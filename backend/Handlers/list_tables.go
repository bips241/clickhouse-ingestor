package handlers

import (
	"backend/clickhouse"
	"context"
	"encoding/json"
	"net/http"
)

func ListTables(w http.ResponseWriter, r *http.Request) {
	if clickhouse.ClickHouseConn == nil {
		http.Error(w, "ClickHouse not connected", http.StatusBadRequest)
		return
	}

	rows, err := clickhouse.ClickHouseConn.Query(context.Background(), "SHOW TABLES")
	if err != nil {
		http.Error(w, "Failed to list tables: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err == nil {
			tables = append(tables, name)
		}
	}

	json.NewEncoder(w).Encode(tables)
}
