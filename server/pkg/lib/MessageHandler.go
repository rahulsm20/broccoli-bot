package lib

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc/v4"
)

type TwitchBot struct {
	Client *twitch.Client
}

func NewTwitchBot(username string, oauthToken string) *TwitchBot {
	bot := &TwitchBot{
		Client: twitch.NewClient(username, oauthToken),
	}
	return bot
}
func (bot *TwitchBot) Start() {
	bot.Client.OnPrivateMessage(bot.MessageHandler)
	bot.Client.Connect()
}

func (bot *TwitchBot) MessageHandler(message twitch.PrivateMessage) {
	// extracts commands
	fmt.Println("message: ", message.Message)
	if strings.HasPrefix(message.Message, "!") {
		words := strings.Fields(message.Message)
		if len(words) > 0 {
			command := words[0][1:]
			fmt.Println("Found command:", command)
			if command == "sr" {
				fmt.Println("Link:", strings.Split(strings.Split(words[1], "/")[4], "?")[0])
				link := strings.Split(strings.Split(words[1], "/")[4], "?")[0]
				res, err := http.Get(fmt.Sprintf(os.Getenv("SERVER_URL")+"music/spotify/add?channel=%v&link=%v", message.Channel, link))

				fmt.Println("requested channel: ", res.Body)
				if err != nil {
					fmt.Println(err.Error())
					bot.Client.Say(message.Channel, fmt.Sprintf("Failed to add song requested by @%v", message.User.Name))
					return
				}
				defer res.Body.Close()

				body, err := io.ReadAll(res.Body)
				if err != nil {
					fmt.Println("Error reading response body:", err)
					return
				}

				fmt.Println("Response Body:", string(body))
				bot.Client.Say(message.Channel, fmt.Sprintf("Added song to queue requested by @%v", message.User.Name))
			}
		}

	}
	// else if message.User.DisplayName != twitchUsername {
	// 	client.Say(message.Channel, fmt.Sprintf("Hello! @%v", message.User.Name))
	// }
	log.Printf("[%s] <%s>: %s\n", message.Channel, message.User.Name, message.Message)
	fmt.Println("chatter: ", message.User.Name)
}
