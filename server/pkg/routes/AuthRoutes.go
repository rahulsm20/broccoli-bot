package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/rahulsm20/songbot/pkg/controllers"
)

func AuthRoutes(r *gin.RouterGroup) {
	r.GET("/:provider/callback", controllers.AuthCallback)
	r.GET("/:provider/validate", controllers.ValidateToken)
	r.GET("/access/:channel", controllers.GetUserData)
	r.GET("/bot", controllers.GetBotToken)
	r.GET("/commands", controllers.GetCommands)
	r.GET("/", controllers.AuthHandler)
}
