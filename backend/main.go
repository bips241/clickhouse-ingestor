package main

import (
	"log"
	"net/http"

	routes "backend/Routes"

	"github.com/rs/cors"
)

func main() {
	router := routes.RegisterRoutes()

	// Setup CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},           // Allow all origins (for testing)
		AllowedMethods:   []string{"GET", "POST"}, // Allowed HTTP methods
		AllowedHeaders:   []string{"*"},           // Allow all headers
		AllowCredentials: true,
	})

	// Wrap router with CORS
	handler := c.Handler(router)

	log.Println("🚀 Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
