module.exports = {
  getHealth: (req,res,next) => {
    res.send('seemingly ok');
  },
  getQuestions: (req,res,next) => {
    const db = req.app.get('db');
    db.get_questions()
      .then(r => {
        res.status(200).send(r);
      })
      .catch(err => {
        res.status(500).send('get questions failed');
        console.log(err);
      })
  },
  getQuip: (req,res,next) => {
    let quip = 'are you sure you want to keep lighting up my life? cause ';
    quip += 'imma bouta make a lampshade out of your skin, since you won\'t be ';
    quip += 'using it once I\'m done with you. ';
    res.send(quip);
  },
  addQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.add_question([
      req.body.text,
      req.body.answer
    ])
      .then(r => {
        res.status(200).send();})
      .catch(err => {
        res.status(500).send('add question failed');
        console.error(err);})
  },
  getQuestion: (req,res,next) => {
    const db = req.app.get('db');
    db.get_question([req.params.id])
      .then(r => {
        let f = r.length;
        res.status(f ? 200 : 404).send(f ? r : 'nothing found')})
      .catch(err => {
        res.status(500).send('get question failed');
        console.log(err);})
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
            .catch(err => {
              res.status(500).send('delete question failed');
              console.log(err);})}})
      .catch(err => {
        res.status(500).send('get question failed, no delete attempted');
        console.log(err);})
  }
}
