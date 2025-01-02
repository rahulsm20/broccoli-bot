FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY . .

COPY go.mod go.sum ./

RUN go mod download

RUN go build -o /app/bin/main .
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000
ENV environment production

CMD ["/app/bin/main"]
