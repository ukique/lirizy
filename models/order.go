// Package models defines the domain entities shared across features.
package models

import (
	"time"

	"github.com/jackc/pgtype/ext/shopspring-numeric"
)

// Order represents a buy or sell request in the exchange.
type Order struct {
	ID         int64           `json:"id"`
	UserID     int64           `json:"user_id"`
	Side       OrderSide       `json:"side"`
	Token      string          `json:"token"`
	Amount     numeric.Numeric `json:"amount"`
	Price      numeric.Numeric `json:"price"`
	Status     OrderStatus     `json:"status"`
	CreatedAt  time.Time       `json:"created_at"`
	FinishedAt time.Time       `json:"finished_at"`
}

// OrderStatus is a type that respondent the current status of order
// "created" when the order is placed, "finished" once it is closed.
type OrderStatus string

const (
	StatusCreated  OrderStatus = "created"
	StatusFinished OrderStatus = "finished"
)

// OrderSide represents the direction of an order:
// "buy" when the user is buying, "sell" when the user is selling.
type OrderSide string

const (
	SideBuy  OrderSide = "buy"
	SideSell OrderSide = "sell"
)
