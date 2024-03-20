package initializers

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/rahulsm20/songbot/pkg/postgres"
	"github.com/redis/go-redis/v9"
)

var DB *postgres.Queries

func InitializeDB() {
	conn, err := sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		fmt.Printf("Failed to connect to db: %v", err)
		return
	}
	DB = postgres.New(conn)
}

func InitializeRedis() *redis.Client {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})
	return redisClient
}
