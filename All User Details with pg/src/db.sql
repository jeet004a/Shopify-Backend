CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hasedPassword VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
);