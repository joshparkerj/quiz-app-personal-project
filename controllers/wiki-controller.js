const r = (status, res) => {
  return r => {
    res.status(status).send(r);
  }
}

const err = (message, res) => {
  return err => {
    res.status(500).send(message);
    console.log(err);
  }
}

const fyshuffle = a => {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

module.exports = {
  checkSubmission: (req, res, next) => {
    const db = req.app.get('db');
    console.log(`submitted: ID: ${req.body.id} Choice: ${req.body.choice}`);
    db.check_wiki_submission([req.body.id, req.body.choice])
      .then(r => {
        let a = !!r.length;
        db.log_ask([
          req.body.id,
          req.session.userid,
          a,
          0,
          req.body.choice])
          .then(r => {
            res.status(a ? 200 : 500).send(a ? 'correct' : 'wrong')
          })
      })
      .catch(err('check submission failed', res))
  },
  getWikiCategories: (req, res, next) => {
    const db = req.app.get('db');
    db.get_wiki_categories()
      .then(r(200, res))
      .catch(err('get wiki categories failed', res))
  },
  questionAnswered: (req, res, next) => {
    /* removing this condition for now so that hopefully
    the app will work better when I present this evening...
    if (req.session.game.some(e => e.id == req.params.id)) {*/
    req.session.game = req.session.game.filter(e => {
      return e.id !== req.params.id;
    })
    console.log(`question answered ${req.session.game.length}`);
    if (req.session.gamescore) {
      req.session.gamescore += 1;
    } else {
      req.session.gamescore = 1;
    }
    res.status(200).send({ score: req.session.gamescore });
    /*} else {
      res.status(500).send('invalid id');
    }*/
  },
  createGame: (req, res, next) => {
    console.log(`game. cat: ${req.params.category} num: ${req.params.count}`);
    const db = req.app.get('db');
    const rts = [];
    db.get_some_wiki_questions_by_category([
      req.params.category,
      req.params.count
    ])
      .then(r => {
        if (!r.length) {
          res.status(404).send('no question found');
          return 'pass';
        }
        if (r.length != req.params.count) {
          res.status(204).send('couldn\'t get that many questions');
          return 'pass';
        }
        r.map((e, i) => {
          rts[i] = {};
          rts[i].id = e.id;
          rts[i].text = e.text;
          rts[i].answers = [e.answer];
          rts[i].category = e.category;
          rts[i].img_url = e.img_url;
        })
        return Promise.all(
          rts.map(e => {
            return db.get_more_wiki_answers([
              e.id,
              e.category,
              3
            ])
          })
        )
      })
      .then(r => {
        if (r === 'pass') {
          return 'pass';
        }
        rts.map((e, i) => {
          r[i].forEach(f => e.answers.push(f.answer));
          e.answers = fyshuffle(e.answers);
        })
        req.session.game = rts;
        req.session.gamescore = 0;
        console.log(`saved game to session: ${rts}`);
        res.status(200).send(rts);
      })
      .catch(err('create game failed', res));
  },
  getEntireCategory: (req, res, next) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }
    const db = req.app.get('db');
    db.get_all_questions_in_category([req.params.category])
      .then(r(200, res))
      .catch(err('get entire category failed', res));
  },
  deleteWikiQuestion: (req, res, next) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }
    const db = req.app.get('db');
    db.remove_refs_to_question([req.params.id])
      .then(r => {
        return db.delete_wiki_question([req.params.id])
      })
      .then(r(200, res))
      .catch(err('delete wiki question failed', res));
  },
  updateWikiQuestion: (req, res, next) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }
    const db = req.app.get('db');
    db.update_wiki_question([req.params.id, req.body.text])
      .then(r(200, res))
      .catch(err('update wiki question failed', res));
  }
}
