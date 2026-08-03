// Package service implements business logic for order creation and processing.
package service

import (
	"context"
	"time"

	"github.com/ukique/lirizy/models"
)

// OrderRepository persists and retrieves orders from storage.
type OrderRepository interface {
	Create(ctx context.Context, order models.Order) error
}
type OrderService struct {
	orderRepository OrderRepository
}

func NewOrderService(orderRepository OrderRepository) *OrderService {
	return &OrderService{orderRepository: orderRepository}
}

func (s *OrderService) Create(ctx context.Context, order models.Order) error {
	order.CreatedAt = time.Now()
	order.Status = models.StatusCreated
	if err := s.orderRepository.Create(ctx, order); err != nil {
		return err
	}
	return nil
}
