package app

import (
	"github.com/gin-gonic/gin"
	"github.com/ukique/lirizy/internal/features/orders/transport"
)

// Routes registers HTTP endpoints.
func Routes(router *gin.Engine, orderHandler *transport.OrderHandler) {
	router.POST("/order", orderHandler.Create)
}
