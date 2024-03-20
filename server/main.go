package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/rahulsm20/songbot/pkg/auth"
	"github.com/rahulsm20/songbot/pkg/initializers"
	"github.com/rahulsm20/songbot/pkg/lib"
	"github.com/rahulsm20/songbot/pkg/routes"
)

func init() {
	initializers.LoadEnvVariables()
	fmt.Println("Loaded env variables")
	auth.Store()
	initializers.InitializeDB()
	fmt.Println("Initialized store")
	initializers.InitializeRedis()
	fmt.Println("Initialized redis")
}

func startIRCClient() {
	// bot credentials
	twitchUsername := os.Getenv("TWITCH_API_USERNAME")
	twitchOAuthToken := fmt.Sprintf("oauth:%v", os.Getenv("TWITCH_API_OAUTH_TOKEN"))
	bot := lib.NewTwitchBot(twitchUsername, twitchOAuthToken)
	go func() {
		for {
			// replace with dynamic channels
			channels := []string{os.Getenv("TWITCH_CHANNELS")}
			fmt.Println("channels: ", channels)

			bot.Client.OnConnect(func() {
				log.Println("Connected to Twitch chat")
				for _, channel := range channels {
					bot.Client.Join(string(channel))
					fmt.Println("Joined channel", channel)
				}
			})
			time.Sleep(1 * time.Minute)
		}
	}()
	bot.Client.OnPrivateMessage(bot.MessageHandler)

	// Connect to Twitch IRC
	err := bot.Client.Connect()
	if err != nil {
		log.Fatal("Error", err)
	}
}

func main() {
	go startIRCClient()
	port := os.Getenv("SERVER_PORT")
	app := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowCredentials = true

	app.Use(initializers.InitSession())
	app.Use(cors.New(config))

	app.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Broccoli API",
		})
	})

	authGroup := app.Group("/auth")
	{
		routes.AuthRoutes(authGroup)
	}

	musicGroup := app.Group("/music")
	{
		routes.SongRoutes(musicGroup)
	}

	app.Run(fmt.Sprintf(":" + port))
}
