package api

import (
	"context"
)

// Server represents something
type Server struct {
}

// LoadFromURL will load a lot of things
func (s *Server) LoadFromURL(ctx context.Context, in *URLMessage) (*LoadStatus, error) {
	return &LoadStatus{Status: 0}, nil
}
