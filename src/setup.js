const faker = require('faker');
const pool = require('./db');

async function setup() {
  await pool.select('DROP TABLE IF EXISTS signatures;');
  await pool.select('CREATE TABLE IF NOT EXISTS'
  + ' signatures(id serial primary key,name varchar(128) not null,'
  + 'nationalId varchar(10) not null unique,comment varchar(400),'
  + 'anonymous boolean not null default true,'
  + 'signed timestamp with time zone not null default current_timestamp);');

  for (let i = 0; i < 500; i += 1) {
    const fromMilli = Date.parse('Feb 14, 2021');
    const dateOffset = faker.random.number(Date.parse('Mar 1, 2021') - fromMilli);
    const newDate = new Date(fromMilli + dateOffset);
    const id = Math.random().toString().slice(2, 12);
    if (Math.random() < 0.5) {
      pool.insert(
        'INSERT INTO signatures(name, nationalid, comment, anonymous,signed) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [faker.name.findName(), id, faker.lorem.sentence(), Math.random() < 0.5, newDate],
      );
    } else {
      pool.insert(
        'INSERT INTO signatures(name, nationalid, anonymous,signed) VALUES($1, $2, $3, $4) RETURNING *',
        [faker.name.findName(), id, Math.random() < 0.5, newDate],
      );
    }
  }
}

setup();
