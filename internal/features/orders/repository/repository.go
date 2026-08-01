// Package repository provides database operations for orders.
package repository

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/ukique/lirizy/models"
)

type OrderRepository struct {
	pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{
		pool: pool,
	}
}

func (r *OrderRepository) Create(ctx context.Context, order models.Order) error {
	sqlQuery := `
	INSERT INTO orders(user_id, side, token, amount, price, status, created_at)
	VALUES ($1,$2,$3,$4,$5,$6,$7)
`
	_, err := r.pool.Exec(ctx, sqlQuery,
		order.UserID,
		order.Side,
		order.Token,
		order.Amount,
		order.Price,
		order.Status,
		order.CreatedAt)

	if err != nil {
		return err
	}
	return nil
}
