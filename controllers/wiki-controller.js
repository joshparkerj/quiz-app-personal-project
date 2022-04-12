const debug = require('debug')('wiki-controller');

const handleResponse = (status, res) => (r) => {
  res.status(status).send(r);
};

const handleError = (message, res) => (err) => {
  res.status(500).send(message);
  debug(err);
};

const fyshuffle = (inputArray) => {
  const a = inputArray.slice();
  for (let i = a.length - 1, j, x; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }

  return a;
};

module.exports = {
  checkSubmission: (req, res) => {
    const db = req.app.get('db');
    debug(`submitted: ID: ${req.body.id} Choice: ${req.body.choice}`);
    db.check_wiki_submission([req.body.id, req.body.choice])
      .then((r) => {
        const a = !!r.length;
        db.log_ask([
          req.body.id,
          req.session.userid,
          a,
          0,
          req.body.choice])
          .then(() => {
            res.status(a ? 200 : 500).send(a ? 'correct' : 'wrong');
          });
      })
      .catch(handleError('check submission failed', res));
  },
  getWikiCategories: (req, res) => {
    const db = req.app.get('db');
    db.get_wiki_categories()
      .then(handleResponse(200, res))
      .catch(handleError('get wiki categories failed', res));
  },
  questionAnswered: (req, res) => {
    /* removing this condition for now so that hopefully
    the app will work better when I present this evening...
    if (req.session.game.some(e => e.id == req.params.id)) { */
    req.session.game = req.session.game.filter((e) => e.id !== req.body.id);
    debug(`question answered ${req.session.game.length}`);
    if (req.session.gamescore) {
      req.session.gamescore += 1;
    } else {
      req.session.gamescore = 1;
    }

    res.status(200).send({ score: req.session.gamescore });
    /* } else {
      res.status(500).send('invalid id');
    } */
  },

  createGame: (req, res) => {
    debug(`game. cat: ${req.params.category} num: ${req.params.count}`);
    const db = req.app.get('db');
    db.get_some_wiki_questions_by_category([
      req.params.category,
      req.params.count,
    ])
      .then((r) => {
        if (!r.length) {
          res.status(404).send('no question found');
        } else if (r.length !== Number(req.params.count)) {
          res.status(204).send('couldn\'t get that many questions');
        } else {
          const rts = r.map(({
            id, text, answer, category, img_url: imgUrl,
          }) => ({
            id,
            text,
            answers: [answer],
            category,
            img_url: imgUrl,
          }));

          Promise.all(
            rts.map((e) => db.get_more_wiki_answers([
              e.id,
              e.category,
              3,
            ])),
          )
            .then((wikiAnswers) => {
              const game = rts.map((e) => (
                {
                  ...e,
                  answers: fyshuffle([...e.answers, wikiAnswers.map(({ answer }) => answer)]),
                }
              ));
              req.session.game = game;
              req.session.gamescore = 0;
              debug(`saved game to session: ${game}`);
              res.status(200).send(game);
            })
            .catch(handleError('create game failed', res));
        }
      })
      .catch(handleError('create game failed', res));
  },

  getEntireCategory: (req, res) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }

    const db = req.app.get('db');
    db.get_all_questions_in_category([req.params.category])
      .then(handleResponse(200, res))
      .catch(handleError('get entire category failed', res));
  },
  deleteWikiQuestion: (req, res) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }

    const db = req.app.get('db');
    db.remove_refs_to_question([req.params.id])
      .then(() => db.delete_wiki_question([req.params.id]))
      .then(handleResponse(200, res))
      .catch(handleError('delete wiki question failed', res));
  },

  updateWikiQuestion: (req, res) => {
    if (!req.session.admin) {
      res.status(403).send('permission denied');
      return;
    }

    const db = req.app.get('db');
    db.update_wiki_question([req.params.id, req.body.text])
      .then(handleResponse(200, res))
      .catch(handleError('update wiki question failed', res));
  },
};
