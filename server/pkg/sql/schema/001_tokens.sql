-- +goose Up

CREATE TABLE tokens (
id UUID PRIMARY KEY,
provider VARCHAR(255) NOT NULL,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
token VARCHAR(255) NOT NULL,
avatarURL VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);