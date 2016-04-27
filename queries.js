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

function getSinglePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);

  db.one('select * from pups where id = $1', pupID)
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE puppy'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createPuppy(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('INSERT into pups (name, breed, age, sex)' +
          'values (${name}, ${breed}, ${age}, ${sex})',
        req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one puppy'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function updatePuppy(req, res, next) {
  db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
          [req.body.name, req.body.breed, parseInt(req.body.age), req.body.sex, parseInt(req.params.id)]
         )
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated puppy'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from pups where id=$1', pupID)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount} puppy'
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
