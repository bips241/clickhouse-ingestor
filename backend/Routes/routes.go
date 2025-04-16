package routes

import (
	"net/http"

	handlers "backend/Handlers"
	"backend/clickhouse"

	"github.com/gorilla/mux"
)

func RegisterRoutes() *mux.Router {
	router := mux.NewRouter()

	// Base health check
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("✅ API is running"))
	}).Methods("GET")

	// ClickHouse related
	router.HandleFunc("/api/clickhouse/connect", clickhouse.ConnectClickHouse).Methods("POST")
	router.HandleFunc("/api/clickhouse/tables", handlers.ListTables).Methods("GET")
	router.HandleFunc("/api/clickhouse/columns", handlers.GetColumns).Methods("GET")

	// FlatFile and ingestion
	router.HandleFunc("/api/ingest/to-flatfile", handlers.IngestToFlatFile).Methods("POST")
	router.HandleFunc("/api/ingest/to-db", handlers.IngestToClickHouse).Methods("POST")

	return router
}
