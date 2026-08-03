// Package transport handles HTTP requests for the order feature.
package transport

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ukique/lirizy/models"
)

// OrderService implements business logic for orders.
type OrderService interface {
	Create(ctx context.Context, order models.Order) error
}
type OrderHandler struct {
	orderService OrderService
}

func NewOrderHandler(orderService OrderService) *OrderHandler {
	return &OrderHandler{
		orderService: orderService,
	}
}

func (h *OrderHandler) Create(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "incorrect data"})
		return
	}
	if err := h.orderService.Create(c.Request.Context(), order); err != nil {
		log.Printf("failed to create order: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order Created!"})
}
