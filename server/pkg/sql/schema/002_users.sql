-- +goose Up
CREATE TABLE
    command (
        id UUID PRIMARY KEY,
        code VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

CREATE TABLE
    users (
        id UUID PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL
    );

CREATE TABLE
    user_commands (
        user_id UUID REFERENCES users (id),
        command_id UUID REFERENCES command (id),
        PRIMARY KEY (user_id, command_id)
    );