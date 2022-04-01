const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  saltAndHash: (plaintext) => new Promise((res, rej) => {
    bcrypt.hash(plaintext, saltRounds, (err, hash) => {
      if (err) { rej(err); } else { res(hash); }
    });
  }),
  compare: (plaintext, hash) => new Promise((res, rej) => {
    bcrypt.compare(plaintext, hash, (err, bcryptRes) => {
      if (err) { rej(err); } else { res(bcryptRes); }
    });
  }),
};
