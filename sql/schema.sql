
-- Gott að hafa inni þegar við erum hugsanlega að henda og búa til aftur og aftur
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS signatures(
  id serial primary key,
  name varchar(128) not null,
  nationalId varchar(10) not null unique,
  comment varchar(400),
  anonymous boolean not null default true,
  signed timestamp with time zone not null default current_timestamp
);
CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    username character varying(128) NOT NULL,
    password character varying NOT NULL,
    admin boolean NOT NULL
);

