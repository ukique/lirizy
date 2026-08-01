package app

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/ukique/lirizy/internal/features/orders/repository"
	"github.com/ukique/lirizy/internal/features/orders/service"
	"github.com/ukique/lirizy/internal/features/orders/transport"
)

// Run initializes features, and register HTTP via Routes
func Run(pool *pgxpool.Pool, router *gin.Engine) {
	orderRepository := repository.NewOrderRepository(pool)
	orderService := service.NewOrderService(orderRepository)
	orderHandler := transport.NewOrderHandler(orderService)

	Routes(router, orderHandler)
}
