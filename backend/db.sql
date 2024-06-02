CREATE DATABASE customerIdentity;

create table Contact(
    id SERIAL PRIMARY KEY,
    phonenumber VARCHAR(100),
    email VARCHAR(255),
    linkeid INT REFERENCES Contact(id) ON DELETE SET NULL,
    linkprecedence VARCHAR(25),
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deletedat TIMESTAMP DEFAULT NULL
);