package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/rahulsm20/songbot/pkg/controllers"
	"github.com/rahulsm20/songbot/pkg/initializers"
)

func SongRoutes(router *gin.RouterGroup) {
	// router.GET("/spotify", controllers.AddToQueue)
	router.Use(AuthMiddleware)
	router.GET("/spotify/add", controllers.AddToQueue)
	router.GET("/spotify/queue", controllers.GetQueue)
	// router.GET("/spotify/:trackID", controllers.AddToQueue)
}

func AuthMiddleware(c *gin.Context) {
	redisClient := initializers.InitializeRedis()
	channel := c.Query("channel")
	if channel == "" {
		c.JSON(400, gin.H{"error": "channel is required"})
		c.Abort()
		return
	}
	key := fmt.Sprintf("user:%v", channel)
	token, err := redisClient.Get(c, key).Result()
	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}
	user, err := redisClient.Get(c, fmt.Sprintf("session_token:%v", token)).Result()
	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}
	fmt.Println("Checking for auth", user)
	c.Next()
}
