package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
)

func ListTables(w http.ResponseWriter, r *http.Request) {
	conn, _ := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"localhost:9000"},
		Auth: clickhouse.Auth{
			Database: "uk",
			Username: "default",
			Password: "mysecret",
		},
	})

	rows, err := conn.Query(context.Background(), "SHOW TABLES")
	if err != nil {
		http.Error(w, "Failed to list tables", http.StatusInternalServerError)
		return
	}

	var tables []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err == nil {
			tables = append(tables, name)
		}
	}

	json.NewEncoder(w).Encode(tables)
}
