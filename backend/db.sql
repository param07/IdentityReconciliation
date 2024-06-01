CREATE DATABASE customerIdentity;

create table Contact(
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(100),
    email VARCHAR(255),
    linkedId INT REFERENCES Contact(id) ON DELETE SET NULL,
    linkPrecedence VARCHAR(25),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL
);