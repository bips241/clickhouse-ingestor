package handlers

import (
	"encoding/json"
	"net/http"
)

func IngestToFlatFile(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"message": "Ingested to FlatFile (TODO)"})
}

func IngestToClickHouse(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"message": "Ingested to ClickHouse (TODO)"})
}
