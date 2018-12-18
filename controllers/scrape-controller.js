const axios = require('axios');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/';
const cat = 'Category:';
const prefix = 'https://en.wikipedia.org';

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

const getCatPages = url => {
    return axios.get(url)
        .then(r => {
            const list = [];
            const items = $('#mw-pages .mw-category li a', r.data)
            for (let i = 0; i < items.length; i++) {
                list.push(items[i].attribs.href.slice(6));
            }
            const nextpage = $("a:contains('next page')", r.data).attr('href');
            if (!nextpage) return list;
            return getCatPages(`${prefix}${nextpage}`).then(r => {
                return list.concat(r);
            })
        })
        .catch(err => console.error(err))
}

const getCategory = term => {
    let catList = [];
    return getCatPages(`${url}${cat}${term}`)
        .then(r => {
            catList = r;
            return Promise.all(
                r.map(e => {
                    return getPage(e);
                }))
        })
        .then(res => {
            let output = res.map((e, i) => {
                let a = catList[i].replace(/_/g, ' ');
                let are = new RegExp(a.replace(/ /g, '.{0,8}'), 'gi');
                return {
                    text: e.text.replace(are, '********').replace(/\[..?\]/g, ''),
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
    scrapeWiki: (req, res, next) => {
        if (!req.session.admin){
            res.status(403).send('permission denied');
            return;
        }
        const db = req.app.get('db');
        getCategory(req.params.term)
            .then(output => {
                Promise.all(output.map(e => {
                    if (e.text.includes('********')) {
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
                }))
            })
            .then(r => {
                res.status(200).send(r);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('scrape wiki failed');
            })
    }

}
