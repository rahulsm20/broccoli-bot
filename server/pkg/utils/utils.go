package utils

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type UserDataType struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	AvatarURL    string    `json:"avatarurl"`
	CreatedAt    time.Time `json:"createdAt"`
	ExpiresAt    time.Time `json:"expiresAt"`
	Token        string    `json:"token"`
	RefreshToken string    `json:"refreshToken"`
}

type SessionDataType struct {
	Twitch  UserDataType `json:"twitch"`
	Spotify UserDataType `json:"spotify"`
}

func SerializeUserData(userData map[string]interface{}) (string, error) {
	userDataJSON, err := json.Marshal(userData)
	if err != nil {
		return "", err
	}
	return string(userDataJSON), nil
}

func UnmarshalUserData(userData string) (SessionDataType, error) {
	var userObject SessionDataType
	err := json.Unmarshal([]byte(userData), &userObject)
	if err != nil {
		return userObject, err
	}
	return userObject, nil
}
