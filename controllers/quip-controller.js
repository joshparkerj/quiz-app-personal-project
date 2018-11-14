module.exports = {
  getQuip: (req,res,next) => {
    const db = req.app.get('db');
    const random_quip = Math.ceil(62*Math.random());
    db.get_quip([random_quip])
      .then(quip => {
        res.status(200).send(quip);
      })
      .catch(err => {
        res.status(500).send('get quip failed');
        console.log(err);
      })

  }
}
