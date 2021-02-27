const faker = require('faker');
const pool = require('./db');

for(let i = 0; i<500; i++){
  pool.query(
    'INSERT INTO signatures(name, nationalid, comment, anonymous) VALUES($1, $2, $3, $4) RETURNING *',
    [faker.name.findName(), 0000000000+i, faker.lorem.sentence(), false],
  );
  
}

