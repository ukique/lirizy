-- +goose Up
CREATE TYPE order_status as ENUM('created','finished');

CREATE TYPE order_side as ENUM('sell', 'buy');

CREATE TABLE orders
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    user_id     BIGINT                NOT NULL,
    side        order_side            NOT NULL,
    token       VARCHAR(32)           NOT NULL,
    amount      NUMERIC(36, 18)       NOT NULL,
    price       NUMERIC(36, 18)       NOT NULL,
    status      order_status          NOT NULL,
    created_at  TIMESTAMPTZ           NOT NULL,
    finished_at TIMESTAMPTZ,

    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE INDEX idx_orders_user_id ON orders (user_id);

-- +goose Down
DROP TABLE IF EXISTS orders;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS order_side;