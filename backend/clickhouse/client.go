package clickhouse

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
)

type ConnRequest struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Database string `json:"db"`
	User     string `json:"user"`
	Password string `json:"jwt"`
}

func ConnectClickHouse(w http.ResponseWriter, r *http.Request) {
	var connReq ConnRequest
	if err := json.NewDecoder(r.Body).Decode(&connReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	addr := connReq.Host + ":" + connReq.Port

	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{addr},
		Auth: clickhouse.Auth{
			Database: connReq.Database,
			Username: connReq.User,
			Password: connReq.Password,
		},
	})
	if err != nil {
		http.Error(w, "Connection failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err := conn.Ping(context.Background()); err != nil {
		http.Error(w, "Ping failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Assign global
	ClickHouseConn = conn

	json.NewEncoder(w).Encode(map[string]string{"message": "Connected to ClickHouse!"})
}
