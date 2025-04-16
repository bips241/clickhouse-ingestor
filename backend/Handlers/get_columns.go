package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
)

type TableRequest struct {
	Table string `json:"table"`
}

func GetColumns(w http.ResponseWriter, r *http.Request) {
	var req TableRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	conn, _ := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"localhost:9000"},
		Auth: clickhouse.Auth{
			Database: "uk",
			Username: "default",
			Password: "mysecret",
		},
	})

	query := "DESCRIBE TABLE " + req.Table
	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		http.Error(w, "Query failed", http.StatusInternalServerError)
		return
	}

	var columns []string
	for rows.Next() {
		var name, typeStr string
		_ = rows.Scan(&name, &typeStr)
		columns = append(columns, name+" ("+typeStr+")")
	}

	json.NewEncoder(w).Encode(columns)
}
