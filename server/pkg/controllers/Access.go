package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rahulsm20/songbot/pkg/initializers"
)

func GetUserData(c *gin.Context) {
	redisClient := initializers.InitializeRedis()
	channel := c.Param("channel")
	token, err := redisClient.Get(c, channel).Result()
	if err != nil {
		c.JSON(404, err.Error())
		return
	}
	c.JSON(200, token)
}

// func

func GetBotToken(c *gin.Context) {
	redisClient := initializers.InitializeRedis()
	clientID := os.Getenv("TWITCH_CLIENT_ID")
	clientCredentials := os.Getenv("TWITCH_CLIENT_SECRET")

	data := map[string]interface{}{
		"client_id":     clientID,
		"client_secret": clientCredentials,
		"grant_type":    "client_credentials",
	}

	// Serialize the data into a JSON string
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Create an io.Reader from the JSON string
	reader := strings.NewReader(string(jsonData))

	response, err := http.Post("https://id.twitch.tv/oauth2/token", "text", reader)
	if err != nil {
		fmt.Println("Error reading from reader:", err)
		return
	}
	fmt.Println(response)
	content, err := io.ReadAll(reader)
	if err != nil {
		fmt.Println("Error reading from reader:", err)
		return
	}
	fmt.Println("Content read from io.Reader:")
	fmt.Println(string(content))

	// user := twitch.New(clientID,clientCredentials,os.Getenv("TWITCH_AUTH_CALLBACK"),twitch.ScopeChatRead,twitch.ScopeChatEdit)
	channel := c.Param("channel")
	key := fmt.Sprintf("spotify_access_token:%v", channel)
	token, err := redisClient.Get(c, key).Result()
	if err != nil {
		c.JSON(404, err.Error())
		return
	}
	c.JSON(200, token)
}
