# Broccoli Bot <img src='./client/public/broccoli-icon.svg' type='image/svg+xml' style="width:30px"/>

Free, open source and distributed bot for twitch streamers that provides hassle free integration with multiple music streaming platforms.   

## How to use
* Login with Twitch
* Login with your Spotify
* Default commands 
   - !sr
        - function: removes your latest requested song from the queue
        - params (any one)
            - song and artist name
            - spotify link
   - !rm - remove requested song
        - function: removes your latest requested song from the queue
        - params: none
## Run locally
- Client
    * Setup env variables based on the .env.example files
    * ```
      cd client
      ```
    * Run client  
        ```
        npm run dev
        ```
- Server
    * Setup env variables based on the .env.example files
    * ```
       cd server
       ```
    * Run server  
        ```
        npm run dev
        ```
        (or)
    * Run using Docker
        ```
        docker build -t broccoli-api .
        docker run -p 3000:5000 broccoli-api
        ```
## Nerd shit
### Tech stack
* React + Vite + Typescript
* Go + Gin
* Redis
* Docker
* GCP (Cloud Run, Cloud Engine)
<!-- * PostgreSQL -->

### System Design
![alt text](https://github.com/rahulsm20/twitch-songbot/assets/77540672/f21d3eba-42c1-4810-a3cb-c48ca5ab169d)