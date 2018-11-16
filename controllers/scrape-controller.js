const axios = require('axios');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/';
const cat = 'Category:'

const getPage = title => {
    return axios.get(`${url}${title}`)
        .then(r => {
            return {
                text: $('.mw-parser-output p', r.data).first().text(),
                img_url: $('.infobox img', r.data).first().attr('src')
            };
        })
        .catch(err => {
            console.error(err);
            return null;
        })
}

const getCategory = term => {
    const list = [];
    return axios.get(`${url}${cat}${term}`)
    .then(r => {
        const items = $('#mw-pages .mw-category li a', r.data);
        for (let i = 0; i < items.length; i++){
            list.push(items[i]);
        }
        return Promise.all(
            list.map(e => {
                return getPage(e.attribs.href.slice(6));
            }))
    })
    .then(res => {
        let output = res.map((e,i) => {
            let a = list[i].attribs.href.slice(6).replace(/_/g,' ');
            let are = new RegExp(a.replace(/ /g,'.{0,8}'),'gi');
            console.log(are);
            return {
                text: e.text.replace(are,'********').replace(/\[..?\]/g,''),
                img_url: `https://${e.img_url}`,
                answer: a
            }
        });
        return output;
    })
    .catch(err => {
        console.error(err);
    })
}

module.exports = {
    scrapeWiki: (req,res,next) => {
      const db = req.app.get('db');
      getCategory(req.params.term)
        .then(output => {
            Promise.all(output.map(e => {
                if(e.text.includes('********')){
                    db.add_wiki_question([
                        e.text,
                        e.img_url,
                        e.answer,
                        req.params.term
                    ])
                    .then(r => {
                        return r;
                    })
                    .catch(err => {
                        console.log(err);
                        return err;
                    })
                }
            }))})
        .then(r => {
            res.status(200).send(r);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('scrape wiki failed');
        })
    }

}
