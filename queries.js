/*
Create an instance of pg-promise, assigned to pgp
*/

var promise = require('bluebird');

// Overwrite pg-promise's default promise library - ES6 Promises -
// with Bluebird
var options = {
  promiseLib: promise
}
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/puppies';
var db = pgp(connectionString);

// add query functions

function getAllPuppies(req, res, next) {
  db.any('select * from pups')
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL puppies'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllPuppies  : getAllPuppies,
  getSinglePuppy : getSinglePuppy,
  createPuppy    : createPuppy,
  updatePuppy    : updatePuppy,
  removePuppy    : removePuppy
};
