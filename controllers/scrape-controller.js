const axios = require('axios');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/';
const cat = 'Category:'

const getPage = title => {
    return axios.get(`${url}${title}`)
        .then(r => {
            return $('.mw-parser-output p', r.data).first().text();
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
            })
        )
    })
    .then(res => {
        let output = res.map((e,i) => {
            let a = list[i].attribs.href.slice(6).replace(/_/g,' ');
            let are = new RegExp(a.replace(/ /g,'.'),'gi');
            console.log(are);
            return {
                text: e.replace(are,'********'),
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
                db.add_mc_question([
                    e.text,
                    e.answer,
                    req.params.term
                ])
                .then(r => {
                    return r;
                })
                .catch(err => {
                    console.log(err);
                    return r;
                })
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
