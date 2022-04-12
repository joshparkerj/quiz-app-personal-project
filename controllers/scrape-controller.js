const axios = require('axios');
const $ = require('cheerio');
const debug = require('debug')('scrape-controller');

const url = 'https://en.wikipedia.org/wiki/';
const cat = 'Category:';
const prefix = 'https://en.wikipedia.org';

const getPage = (title) => axios.get(`${url}${title}`)
  .then((r) => ({
    text: $('.mw-parser-output p', r.data).first().text(),
    img_url: $('.infobox img', r.data).first().attr('src'),
  }))
  .catch((err) => {
    debug(err);
    return null;
  });

const getCatPages = (catUrl) => axios.get(catUrl)
  .then((r) => {
    const items = $('#mw-pages .mw-category li a', r.data);

    const list = items.map(({ attribs }) => attribs.href.slice(6));

    const nextpage = $("a:contains('next page')", r.data).attr('href');
    if (!nextpage) {
      return list;
    }

    return getCatPages(`${prefix}${nextpage}`).then((catPages) => list.concat(catPages));
  })
  .catch((err) => debug(err));

const getCategory = (term) => {
  // check term for any funny business
  if (!term.match(/^[\w_]+$/)) {
    return Promise.reject(new Error('Invalid category name'));
  }

  let catList = [];
  return getCatPages(`${url}${cat}${term}`)
    .then((r) => {
      catList = r;
      return Promise.all(
        r.map((e) => getPage(e)),
      );
    })
    .then((res) => {
      const output = res.map((e, i) => {
        const a = catList[i].replace(/_/g, ' ');
        const are = new RegExp(a.replace(/ /g, '.{0,8}'), 'gi');
        return {
          text: e.text.replace(are, '********').replace(/\[..?\]/g, ''),
          img_url: `https://${e.img_url}`,
          answer: a,
        };
      });
      return output;
    })
    .catch((err) => {
      debug(err);
    });
};

module.exports = {
  scrapeWiki: (req, res) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }

    const db = req.app.get('db');
    getCategory(req.params.term)
      .then((output) => {
        Promise.all(output.filter(({ text }) => text.includes('********')).map((e) => (
          db.add_wiki_question([
            e.text,
            e.img_url,
            e.answer,
            req.params.term,
          ])
            .catch((err) => {
              debug(err);
              return err;
            })
        )));
      })
      .then((r) => {
        res.status(200).send(r);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send('scrape wiki failed');
      });
  },

};
