const r = (status,res) => {
  return r => {
    res.status(status).send(r);
  }
}

const err = (message,res) => {
  return err => {
    res.status(500).send(message);
    console.log(err);
  }
}

const fyshuffle = a => {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i+1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

module.exports = {
  getWikiMC: (req,res,next) => {
    const db = req.app.get('db');
    const rts = {};
    db.get_new_wiki_question([req.session.userid])
      .then(r => {
        let f = r.length;
        if(!f){
          res.status(404).send('nothing found');
          return;
        }
        rts.id = r[0].id;
        rts.text = r[0].text;
        rts.answers = [r[0].answer];
        rts.category = r[0].category;
        rts.img_url = r[0].img_url;
        db.get_more_wiki_answers([
          rts.id,
          rts.category,
          3
        ])
          .then(r => {
            r.forEach(e => rts.answers.push(e.answer));
            rts.answers = fyshuffle(rts.answers);
            res.status(200).send(rts);
          })
          .catch(err('get mc answers failed'))
      })
      .catch(err('get wiki mc failed',res))
  },
  checkSubmission: (req,res,next) => {
    const db = req.app.get('db');
    console.log('tryna check submission...');
    console.log(req.body.id);
    console.log(req.body.choice);
    db.check_wiki_submission([req.body.id,req.body.choice])
      .then(r => {
        let a = !!r.length;
        db.log_ask([
          req.body.id,
          req.session.userid,
          a,
          0,
          req.body.choice])
          .then(r => {
            res.status(a ? 200 : 500).send(a ? 'correct' : 'wrong')})
          })
          .catch(err('record keeping failed',res))
      .catch(err('check submission failed',res))
  },
  getWikiCategories: (req,res,next) => {
    const db = req.app.get('db');
    db.get_wiki_categories()
      .then(r(200,res))
      .catch(err('get wiki categories failed',res))
  },
  getWikiMCbyCat: (req,res,next) => {
    const db = req.app.get('db');
    const rts = {};
    db.get_new_wiki_question_by_category([
      req.session.userid,
      req.params.category
    ])
      .then(r => {
        if(!r.length){
          res.status(404).send('no question found');
          return;
        }
        rts.id = r[0].id;
        rts.text = r[0].text;
        rts.answers = [r[0].answer];
        rts.category = r[0].category;
        rts.img_url = r[0].img_url;
        db.get_more_wiki_answers([
          rts.id,
          rts.category,
          3
        ])
          .then(r => {
            r.forEach(e => rts.answers.push(e.answer));
            rts.answers = fyshuffle(rts.answers);
            res.status(200).send(rts);
          })
          .catch(err('get mc answers failed'))
      })
      .catch(err('get wiki mc failed',res))
  }
}
