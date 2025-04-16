package handlers

import (
	"backend/clickhouse"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type TableRequest struct {
	Tables []string `json:"tables"`
}

func GetColumns(w http.ResponseWriter, r *http.Request) {
	if clickhouse.ClickHouseConn == nil {
		http.Error(w, "ClickHouse not connected", http.StatusBadRequest)
		return
	}

	var req TableRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var columns []string

	for _, table := range req.Tables {
		query := fmt.Sprintf("DESCRIBE TABLE %s", table)
		rows, err := clickhouse.ClickHouseConn.Query(context.Background(), query)
		if err != nil {
			http.Error(w, "Failed to describe table "+table+": "+err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println("Executing query:", query)
		fmt.Println("row data:", rows)

		fmt.Println("rows:", rows.Next())

		// Check if the query returns rows
		if !rows.Next() {
			http.Error(w, "No columns found for table "+table, http.StatusNotFound)
			return
		}

		for rows.Next() {
			var (
				name, typeStr     string
				defaultType       string
				defaultExpression string
				comment           string
				codecExpression   string
				ttlExpression     string
			)

			if err := rows.Scan(
				&name,
				&typeStr,
				&defaultType,
				&defaultExpression,
				&comment,
				&codecExpression,
				&ttlExpression,
			); err != nil {
				fmt.Println("Scan error:", err)
				http.Error(w, "Failed to scan row: "+err.Error(), http.StatusInternalServerError)
				return
			}

			columns = append(columns, name)
		}
		rows.Close()
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(columns); err != nil {
		http.Error(w, "Failed to encode response: "+err.Error(), http.StatusInternalServerError)
	}
}
