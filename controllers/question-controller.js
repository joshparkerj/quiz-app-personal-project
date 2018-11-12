const err = (message,res) => {
  return err => {
    res.status(500).send(message);
    console.log(err);
  }
}

module.exports = {
  getQuestions: (req,res,next) => {
    const db = req.app.get('db');
    db.get_questions()
      .then(r => {
        res.status(200).send(r);
      })
      .catch(err('get questions failed',res))
  },
  addQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.add_question([
      req.body.text,
      req.body.answer,
      req.body.author
    ])
      .then(r => {
        res.status(200).send();})
      .catch(err('add question failed',res))
  },
  getQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.get_question([req.params.id])
      .then(r => {
        let f = r.length;
        res.status(f ? 200 : 404).send(f ? r : 'nothing found')})
      .catch(err('get question failed',res))
  },
  deleteQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.get_question([req.params.id])
      .then(r => {
        if (!r.length){
          res.status(404).send('no question to delete');
        }else{
          db.delete_question([req.params.id])
            .then(r => {
              res.status(200).send('question deleted');})
            .catch(err('delete question failed',res))}})
      .catch(err('get question failed, no delete attempted',res))
  },
  getQuizQuestions: (req,res,next) => {
    const db = req.app.get('db');
    db.get_quiz_questions()
      .then(questions => {
        res.status(200).send(questions);
      })
      .catch(err('get quiz questions failed',res))
  },
  getQuizQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.get_quiz_question([req.params.id])
      .then(r => {
        let f = r.length;
        res.status(f ? 200: 404).send(f ? r: 'nothing found')})
      .catch(err('get quiz question failed',res))
  },
  checkQuizResponse: (req,res,next) => {
    const db = req.app.get('db');
    console.log(req.body.q_id);
    console.log(req.body.u_id);
    console.log(req.body.answer);
    console.log(req.body.time);
    db.check_quiz_response([req.body.q_id,req.body.answer])
      .then(r => {
        let a = !!r.length;
        db.log_ask([
          req.body.q_id,
          req.body.u_id,
          a,
          req.body.time,
          req.body.answer])
          .then(r => {
            res.status(a ? 200 : 500).send(a ? 'great job!' : 'wrong answer');
          })
          .catch(err('record keeping failed',res))
      })
      .catch(err('check quiz response failed',res))
  }
}
