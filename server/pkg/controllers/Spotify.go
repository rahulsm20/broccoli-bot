package controllers

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/rahulsm20/songbot/pkg/initializers"
	"github.com/rahulsm20/songbot/pkg/utils"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2"
)

func AddToQueue(c *gin.Context) {
	channel := c.Query("channel")
	link := c.Query("link")
	redisClient := initializers.InitializeRedis()
	sessionToken, err := redisClient.Get(c, fmt.Sprintf("user:%v", channel)).Result()

	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't get session token: %v", err))
		return
	}

	rawUser, err := redisClient.Get(c, fmt.Sprintf("session_token:%v", sessionToken)).Result()
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't get access token: %v", err))
		return
	}
	// fmt.Println("rawUser: ", rawUser)

	user, err := utils.UnmarshalUserData(rawUser)
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't marshal user: %v", err))
		return
	}
	fmt.Println("user: ", user)
	token := &oauth2.Token{
		AccessToken: user.Spotify.Token,
		TokenType:   "Bearer",
	}
	httpClient := spotifyauth.New().Client(c, token)
	client := spotify.New(httpClient)
	err = client.QueueSong(c, spotify.ID(link))
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't add song to queue: %v", err))
		return
	}
	fmt.Print("Added to queue")
}

func GetQueue(c *gin.Context) {
	channel := c.Query("channel")

	redisClient := initializers.InitializeRedis()
	sessionToken, err := redisClient.Get(c, fmt.Sprintf("user:%v", channel)).Result()
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't get session token: %v", err))
		return
	}

	rawUser, err := redisClient.Get(c, fmt.Sprintf("session_token:%v", sessionToken)).Result()
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't get access token: %v", err))
		return
	}
	// fmt.Println("rawUser: ", rawUser)
	user, err := utils.UnmarshalUserData(rawUser)
	// err = json.Unmarshal([]byte(rawUser), &user)
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't marshal user: %v", err))
		return
	}

	token := &oauth2.Token{
		AccessToken: user.Spotify.Token,
		TokenType:   "Bearer",
	}
	httpClient := spotifyauth.New().Client(c, token)
	client := spotify.New(httpClient)
	queue, err := client.GetQueue(c)
	if err != nil {
		c.JSON(400, fmt.Sprintf("couldn't get queue: %v", err))
		return
	}
	c.JSON(200, queue)
}
