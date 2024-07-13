FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app/bin/main .

FROM alpine:latest

WORKDIR /app

COPY --from=builder . .

EXPOSE 5000

CMD ["/app/bin/main"]
