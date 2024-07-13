package auth

import (
	"os"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/spotify"
	"github.com/markbates/goth/providers/twitch"
)

const (
	MaxAge = 86400 * 30
	IsProd = false
)

func Store() {

	redirectURI := os.Getenv("TWITCH_AUTH_CALLBACK")
	twitchClientID := os.Getenv(("TWITCH_CLIENT_ID"))
	twitchClientSecret := os.Getenv("TWITCH_CLIENT_SECRET")

	spotifyRedirectURI := os.Getenv("SPOTIFY_AUTH_CALLBACK")
	spotifyClientID := os.Getenv(("SPOTIFY_CLIENT_ID"))
	spotifyClientSecret := os.Getenv("SPOTIFY_CLIENT_SECRET")
	key := []byte(os.Getenv("SESSION_SECRET"))

	store := sessions.NewCookieStore(key)
	store.MaxAge(MaxAge)

	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = IsProd

	gothic.Store = store
	goth.UseProviders(
		twitch.New(twitchClientID, twitchClientSecret, redirectURI, twitch.ScopeUserRead, twitch.ScopeChatEdit, twitch.ScopeChatRead),
		spotify.New(spotifyClientID, spotifyClientSecret, spotifyRedirectURI, spotify.ScopeAppRemoteControl, spotify.ScopeStreaming, spotify.ScopeUserReadCurrentlyPlaying, spotify.ScopeUserReadPlaybackState),
	)
}
