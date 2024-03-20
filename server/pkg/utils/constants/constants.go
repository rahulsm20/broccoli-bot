package constants

import (
	"os"

	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type providerKey string

var RedirectURL = os.Getenv("SPOTIFY_AUTH_REDIRECT_URL")
var SpotifyState = os.Getenv("SPOTIFY_STATE")
var SpotifyClient *spotify.Client
var SpotifyAuthObject *spotifyauth.Authenticator

const (
	ProviderKey providerKey = "provider"
	MaxAge                  = 86400 * 30
	IsProd                  = false
)
