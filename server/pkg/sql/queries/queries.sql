-- name: GetAllTokens :many
SELECT * from tokens;

-- name: AddUserToken :one
INSERT INTO tokens (id,provider,username,email,avatarURL,token,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;

-- name: ValidateToken :many
SELECT username,email,avatarURL FROM tokens WHERE token = ($1);

-- -- name: GetQueue :many
-- SELECT id,title,artist,requested_by FROM queue WHERE channel =($1);

-- name: GetUsers :many
SELECT DISTINCT username FROM tokens WHERE provider= ($1);