-- name: GetAllTokens :many
SELECT * from tokens;

-- name: AddUserToken :one
INSERT INTO tokens (id,provider,username,email,avatarURL,token,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;

-- name: ValidateToken :many
SELECT username,email,avatarURL FROM tokens WHERE token = ($1);

-- -- name: GetQueue :many
-- SELECT id,title,artist,requested_by FROM queue WHERE channel =($1);

-- name: GetUsers :many
SELECT * FROM tokens WHERE provider= ($1);

-- name: GetCommands :many
SELECT * FROM command;

-- name: AddUser :one
INSERT INTO users (id,username,email,created_at,updated_at) VALUES ($1,$2,$3,$4,$4) RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE username=($1);

-- name: CreateDefaultCommands :many
INSERT INTO command (id,code,description,created_at,updated_at) VALUES ('5f601536-dce6-4fa9-a44a-2deaf5e0aba8', 'sr', 'Request a song', '2024-07-11T08:45:07.164Z','2024-07-11T08:45:07.164Z') RETURNING *;
INSERT INTO command (id,code,description,created_at,updated_at) VALUES ('ef63ac0b-aae3-4d60-8c97-686aa99b94cb', 'rm', 'Remove latest requested song', '2024-07-11T08:45:07.164Z','2024-07-11T08:45:07.164Z') RETURNING *;