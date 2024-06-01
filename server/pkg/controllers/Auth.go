package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/rahulsm20/songbot/pkg/initializers"
	"github.com/rahulsm20/songbot/pkg/utils"
	"github.com/rahulsm20/songbot/pkg/utils/constants"
)

func AuthHandler(c *gin.Context) {
	res := c.Writer
	req := c.Request

	provider := req.URL.Query().Get("provider")
	req = req.WithContext(context.WithValue(context.Background(), constants.ProviderKey, provider))
	if user, err := gothic.CompleteUserAuth(res, req); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"user": user,
		})
	} else {
		gothic.BeginAuthHandler(res, req)
	}
}

func AuthCallback(c *gin.Context) {
	res := c.Writer
	req := c.Request
	clientUrl := os.Getenv("CLIENT_URL")

	user, err := gothic.CompleteUserAuth(res, req)
	if err != nil {
		fmt.Fprintln(res, err)
		return
	}

	provider := c.Param("provider")

	redisClient := initializers.InitializeRedis()
	sessionToken, err := GetCookie(c, "session_token")
	if err != nil {
		c.JSON(400, fmt.Sprintf("Failed to get session token: %v", err.Error()))
		return
	}

	// search for session token in redis
	var key string
	key = fmt.Sprintf("session_token:%v", sessionToken)
	fmt.Println("key: ", key)
	userData := map[string]interface{}{
		"ID":           uuid.New(),
		"Username":     user.Name,
		"Email":        user.Email,
		"Token":        user.AccessToken,
		"AvatarURL":    user.AvatarURL,
		"CreatedAt":    time.Now().UTC(),
		"ExpiresAt":    user.ExpiresAt,
		"RefreshToken": user.RefreshToken,
	}
	var lifetime time.Duration
	if provider == "spotify" {
		rawSessionData, err := redisClient.Get(c, key).Result()
		if err != nil {
			c.JSON(400, fmt.Sprintf("Failed to get session data: %v", err.Error()))
			return
		}

		var sessionData map[string]interface{}

		err = json.Unmarshal([]byte(rawSessionData), &sessionData)
		if err != nil {
			c.JSON(400, fmt.Sprintf("Failed to unmarshal session data: %v", err.Error()))
			return
		}
		fmt.Println("sessionData: ", sessionData)
		if _, ok := sessionData["twitch"].(map[string]interface{}); ok {
			// fmt.Println("Name:", twitchUser)
			sessionData["spotify"] = userData
			sessionDataJSON, err := json.Marshal(sessionData)

			if err != nil {
				c.JSON(400, fmt.Sprintf("Failed to marshal session data: %v", err.Error()))
				return
			}

			lifetime := user.ExpiresAt.Sub(time.Now().UTC())
			err = redisClient.Set(c, key, sessionDataJSON, lifetime).Err()
			if err != nil {
				c.JSON(400, fmt.Sprintf("Failed to authenticate user: %v", err.Error()))
				fmt.Println("err: ", err)
				return
			}

			c.Redirect(http.StatusTemporaryRedirect, clientUrl)
		} else {
			c.JSON(400, "Please login with Twitch first")
			fmt.Println("Key 'name' doesn't exist or has a different type.")
			return
		}
	} else {
		twitchUser := map[string]interface{}{}
		twitchUser["twitch"] = userData
		setUserCookie(c, user)

		lifetime = user.ExpiresAt.Sub(time.Now().UTC())
		userDataJSON, err := utils.SerializeUserData(twitchUser)
		if err != nil {
			c.JSON(400, fmt.Sprintf("Failed to serialize user: %v", err.Error()))
			return
		}
		key = fmt.Sprintf("session_token:%v", user.AccessToken)
		// newID := uuid.New()
		err = redisClient.Set(c, key, userDataJSON, lifetime).Err()
		if err != nil {
			c.JSON(400, fmt.Sprintf("Failed to authenticate user: %v", err.Error()))
			fmt.Println("err: ", err)
			return
		}
		// var key string
		err = redisClient.Set(c, fmt.Sprintf("user:%v", user.Name), user.AccessToken, lifetime).Err()
		if err != nil {
			c.JSON(400, fmt.Sprintf("Failed to authenticate user: %v", err.Error()))
			fmt.Println("err: ", err)
			return
		}
	}

	trimmedName := strings.TrimSpace(user.Name)
	redirectURL := fmt.Sprintf("%v?id=%v", clientUrl, trimmedName)
	redirectURL = strings.TrimSpace(redirectURL)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

func setUserCookie(c *gin.Context, user goth.User) {
	if user.AvatarURL == "" {
		user.AvatarURL = " "
	}
	c.SetCookie("session_token", user.AccessToken, int(user.ExpiresAt.Sub(time.Now().UTC()).Seconds()), "/", "", false, true)
}

func GetCookie(c *gin.Context, cookieName string) (string, error) {
	cookie, err := c.Request.Cookie(cookieName)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			return "", nil
		}
		return "", fmt.Errorf("error getting %s cookie: %w", cookieName, err)
	}
	return cookie.Value, nil
}

func ValidateToken(c *gin.Context) {
	provider := c.Param("provider")
	fmt.Println("provider: ", provider)
	redisClient := initializers.InitializeRedis()

	token, err := GetCookie(c, "session_token")

	if err != nil {
		c.JSON(400, err)
		return
	}
	if token == "" {
		c.JSON(400, "Token not found")
		return
	}

	// var key string
	key := fmt.Sprintf("session_token:%v", token)
	fmt.Println("key: ", key)
	userData, err := redisClient.Get(c, key).Result()
	if err != nil {
		c.JSON(400, fmt.Sprintf("error:%v\n", err.Error()))
		return
	}
	fmt.Println("userData: ", userData)
	var data utils.SessionDataType
	err = json.Unmarshal([]byte(userData), &data)
	if err != nil {
		c.JSON(400, fmt.Sprintf("error:%v\n", err.Error()))
		return
	}
	c.JSON(http.StatusAccepted, gin.H{
		"user": data,
	})
}
