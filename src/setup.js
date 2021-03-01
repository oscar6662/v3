const faker = require('faker');
const pool = require('./db');

for(let i = 0; i<500; i++){

  var fromMilli = Date.parse("Feb 14, 2021");
  var dateOffset = faker.random.number(Date.parse("Mar 1, 2021") - fromMilli);
  var newDate = new Date(fromMilli + dateOffset);


  if(Math.random()<0.5){

    if(Math.random()<0.5){
      pool.insert(
        'INSERT INTO signatures(name, nationalid, comment, anonymous,signed) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [faker.name.findName(), Math.random().toString().slice(2, 12), faker.lorem.sentence(), false, newDate],
      );
    }else{
      pool.insert(
        'INSERT INTO signatures(name, nationalid, comment, anonymous,signed) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [faker.name.findName(), Math.random().toString().slice(2, 12), faker.lorem.sentence(), true, newDate],
      );
    }
  }else{
    if(Math.random()<0.5){
      pool.insert(
        'INSERT INTO signatures(name, nationalid, anonymous,signed) VALUES($1, $2, $3, $4) RETURNING *',
        [faker.name.findName(), Math.random().toString().slice(2, 12), true, newDate],
      );
    }else{
      pool.insert(
        'INSERT INTO signatures(name, nationalid, anonymous,signed) VALUES($1, $2, $3, $4) RETURNING *',
        [faker.name.findName(), Math.random().toString().slice(2, 12), false, newDate],
      );
    }
  }
  
  
}

