-- +goose Up
CREATE TABLE users
(
    id BIGSERIAL PRIMARY KEY NOT NULL
);
-- +goose Down
DROP TABLE IF EXISTS users;