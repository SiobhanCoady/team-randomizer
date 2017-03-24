const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  database: 'teams'
});

module.exports = db;
