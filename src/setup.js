const faker = require('faker');
const pool = require('./db');

for(let i = 0; i<500; i++){
  pool.insert(
    'INSERT INTO signatures(name, nationalid, comment, anonymous) VALUES($1, $2, $3, $4) RETURNING *',
    [faker.name.findName(), Math.random().toString().slice(2, 12), faker.lorem.sentence(), false],
  );
  
}

