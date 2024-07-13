package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/rahulsm20/songbot/pkg/initializers"
)

func GetCommands(c *gin.Context) {
	commands, err := initializers.DB.GetCommands(c)
	if err != nil {
		c.JSON(400, err.Error())
		return
	}
	c.JSON(200, gin.H{"commands": commands})
}
