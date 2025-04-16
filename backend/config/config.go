package config

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
)

func ConnectClickHouse(w http.ResponseWriter, r *http.Request) {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"localhost:9000"},
		Auth: clickhouse.Auth{
			Database: "uk",
			Username: "default",
			Password: "mysecret",
		},
	})
	if err != nil {
		http.Error(w, "Connection failed", http.StatusInternalServerError)
		return
	}

	if err := conn.Ping(context.Background()); err != nil {
		http.Error(w, "Ping failed", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Connected to ClickHouse!"})
}
