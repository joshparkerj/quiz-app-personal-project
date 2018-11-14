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

module.exports = {
  getUnansweredMultipleChoiceQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.get_new_mc_question([req.session.userid])
      .then(r => {
        let f = r.length;
        res.status(f ? 200 : 404).send(f ? r : 'nothing found')})
      .catch(err('get question failed',res))
  },
  checkSubmission: (req,res,next) => {
    const db = req.app.get('db');
    db.check_mc_submission([req.body.id,req.body.choice])
      .then(r => {
        let a = !!r.length;
        db.log_ask([
          req.body.id,
          req.session.userid,
          a,
          0,
          req.body.choice])
          .then(r => {
            res.status(a ? 200: 500).send(a ? 'correct' : 'wrong')})
          })
          .catch(err('record keeping failed',res))
      .catch(err('check submission failed',res))
  }
}
