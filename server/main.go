package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
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

type Twitch struct {
	AvatarURL    string `json:"AvatarURL"`
	CreatedAt    string `json:"CreatedAt"`
	Email        string `json:"Email"`
	ExpiresAt    string `json:"ExpiresAt"`
	ID           string `json:"ID"`
	RefreshToken string `json:"RefreshToken"`
	Token        string `json:"Token"`
	Username     string `json:"Username"`
}

type User struct {
	Twitch Twitch `json:"twitch"`
}

func startIRCClient(channels []User) {
	// Connect to Twitch IRC
	go func() {
		for _, channel := range channels {
			go func(channel User) {
				twitchUsername := channel.Twitch.Username
				twitchOAuthToken := fmt.Sprintf("oauth:%v", channel.Twitch.Token)
				bot := lib.NewTwitchBot(twitchUsername, twitchOAuthToken)
				bot.Client.OnConnect(func() {
					bot.Client.Join(channel.Twitch.Username)
					fmt.Println("Joined channel", channel.Twitch.Username)
				})
				bot.Client.OnPrivateMessage(bot.MessageHandler)
				log.Println("Connecting to IRC for user:", twitchUsername)
				err := bot.Client.Connect()
				if err != nil {
					log.Printf("Error connecting to Twitch chat for user %s: %v\n", twitchUsername, err)
				} else {
					log.Printf("Successfully connected to Twitch chat for user %s\n", twitchUsername)
				}
			}(channel)
		}
	}()
}

type ValidationResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

var ctx = context.Background()

func main() {
	port := os.Getenv("SERVER_PORT")
	gin.SetMode(gin.ReleaseMode)
	app := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{os.Getenv("CLIENT_URL")}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowCredentials = true
	app.Use(initializers.InitSession())
	app.Use(cors.New(config))

	app.GET("/", func(c *gin.Context) {
		initializers.DB.CreateDefaultCommands(c)
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

	go validateAndStartIRC()

	fmt.Printf("rest service running on port:%s\n", port)
	app.Run(fmt.Sprintf(":" + port))
}

func validateAndStartIRC() {
	for {
		redisClient := initializers.InitializeRedis()
		pattern := "user:*"
		var cursor uint64
		var channels []string
		var result []string
		result, _, err := redisClient.Scan(ctx, cursor, pattern, 10).Result()
		if err != nil {
			fmt.Printf("Error during SCAN: %v\n", err)
			return
		}
		channels = append(channels, result...)
		var validChannels []User
		for _, channel := range channels {
			val := redisClient.Get(ctx, channel)
			var unmarshalledToken User
			if val != nil {
				accessToken := val.String()
				accessToken = strings.Trim(strings.Split(accessToken, ":")[2], " ")
				user := redisClient.Get(ctx, fmt.Sprintf("session_token:%v", accessToken))
				if user != nil {
					userBytes, err := user.Bytes()
					if err != nil {
						fmt.Println("failed to turn user into bytes")
						break
					}
					if user != nil {
						err = json.Unmarshal(userBytes, &unmarshalledToken)
						if err != nil {
							log.Fatalf("Failed to read response body: %v", err)
						}
						validChannels = append(validChannels, unmarshalledToken)
					}
				}
			}
		}
		fmt.Println("\nvalidated", validChannels)
		go startIRCClient(validChannels)
		time.Sleep(1 * time.Minute)
	}
}
