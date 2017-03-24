const db = require('./conn');

db.query(`
  CREATE TABLE teams (
    id SERIAL,
    names TEXT
  )
`).then(function() {
  console.log('Created table teams');
  process.exit();
}).catch(function(error) {
  console.error(error);
  process.exit();
})
