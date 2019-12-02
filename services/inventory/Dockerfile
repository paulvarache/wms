FROM golang:alpine AS builder

WORKDIR /tmp/build

COPY inventory inventory
COPY database database

WORKDIR /tmp/build/inventory

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o inventory

FROM scratch AS service
COPY --from=builder /tmp/build/inventory/inventory /inventory
WORKDIR /

EXPOSE 7777

ENTRYPOINT ["/inventory"]
