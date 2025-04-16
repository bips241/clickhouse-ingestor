package flatfile

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
)

func GetCSVColumns(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form (max memory 10MB)
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Failed to parse multipart form: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Access the uploaded file
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to retrieve file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Parse CSV
	reader := csv.NewReader(file)
	headers, err := reader.Read()
	if err != nil {
		http.Error(w, "Failed to read CSV headers: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Optional log
	fmt.Println("CSV Headers:", headers)

	// Return headers
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(headers)
}
