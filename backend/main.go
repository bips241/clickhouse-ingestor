package main

import (
	"context"
	"fmt"

	"github.com/ClickHouse/clickhouse-go/v2"
)

func main() {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"localhost:9000"},
		Auth: clickhouse.Auth{
			Database: "default",
			Username: "default",
			Password: "mysecret", // use your password
		},
		DialTimeout: 5 * 1000000000, // 5s in nanoseconds
	})
	if err != nil {
		panic(err)
	}

	if err := conn.Ping(context.Background()); err != nil {
		panic(err)
	}

	fmt.Println("✅ Connected to ClickHouse!")

	// Fetch and list tables
	rows, err := conn.Query(context.Background(), "SHOW TABLES")
	if err != nil {
		panic(err)
	}

	fmt.Println("📦 Tables in database:")
	for rows.Next() {
		var table string
		if err := rows.Scan(&table); err != nil {
			panic(err)
		}
		fmt.Println(" -", table)
	}
}
