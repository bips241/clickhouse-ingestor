import React, { useState } from "react";
import axios from "axios";


const IngestorUI = () => {
const [source, setSource] = useState("ClickHouse");
const [file, setFile] = useState(null);
const [status, setStatus] = useState("");
const [result, setResult] = useState("");

const [selectedColumns, setSelectedColumns] = useState([]);

const [tablesLoaded, setTablesLoaded] = useState(false);
const [loadingTables, setLoadingTables] = useState(false);
const [columnsLoaded, setColumnsLoaded] = useState(false);
const [tables, setTables] = useState([]);

const [columns, setColumns] = useState([]);

const [con, setCon] = useState(false);

const [config, setConfig] = useState({
    host: "",
    port: "",
    jwt: "",
    db: "",
    user: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleConnect = async () => {
    console.log(config);
      try {
        const res = await axios.post("http://localhost:8080/api/clickhouse/connect", config);
        console.log(res);
        setCon(true);
        setMessage(`✅ Connected: ${res.data.message || "Success"}`);
      } catch (err) {
        setMessage(`❌ Connection failed: ${err.response?.data || err.message}`);
      }
    };

    const handleLoadTable = async() => {
        try {
            const res = await axios.get("http://localhost:8080/api/clickhouse/tables", config);
            setTables(res.data);
            setTablesLoaded(true);
            console.log(res);
            setCon(true);
            setMessage(`✅ loaded tables: ${res.data.message || "Success"}`);
          } catch (err) {
            setMessage(`❌ failed: ${err.response?.data || err.message}`);
          }
    };
  const column = [];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleColumn = (col) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== col));
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border rounded-lg shadow space-y-6 text-sm">
      {/* Source Selection */}
    <div className="source-selection">
        <label className="label">🔁 Source Selection:</label>

        <div className="dropdown-wrapper">
            <select
                className="dropdown"
                value={source}
                onChange={(e) => setSource(e.target.value)}
            >
                <option>ClickHouse</option>
                <option>Flat File</option>
            </select>
            <text>to</text>
            <div className="target-box">
                {source === "ClickHouse" ? "Flat File" : "ClickHouse"}
            </div>
        </div>
    </div>

    {source === "ClickHouse" && (
        <div className="border p-4 rounded-md shadow space-y-2 mt-4">
            <div className="font-semibold">ClickHouse Config:</div>
            <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded" placeholder="Host" name="host" value={config.host} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Port" name="port" value={config.port} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="JWT" name="jwt" value={config.jwt} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="DB" name="db" value={config.db} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="User" name="user" value={config.user} onChange={handleChange} />
            </div>
            <button
                onClick={handleConnect}
                className={`mt-2 px-4 py-1 text-white rounded ${
                    con ? "bg-green-500" : "bg-blue-500"
                }`}
            >
                {con ? "Connected" : "Connect"}
            </button>
        </div>
    )}

    {source === "Flat File" && (
        <div className="border p-4 rounded-md shadow flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
                Flat File:
                <input type="file" accept=".csv" onChange={handleFileUpload} />
            </label>
            <label className="flex items-center">
                Delimiter:
                <select className="ml-2 border rounded px-2 py-1">
                    <option>,</option>
                    <option>;</option>
                    <option>|</option>
                </select>
            </label>
        </div>
    )}

    {/* Table & Load Columns */}
    <div className="border p-4 rounded-md shadow space-y-4">
        {!tablesLoaded ? (
            !con ? (
                <div className="text-blue-600">Please connect to load tables.</div>
            ) : (
                <button
                    onClick={handleLoadTable}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Load Tables
                </button>
            )
        ) : (
            <>
                {/* Table Selection */}
                <div className="flex items-center gap-4">
                    <label>
                        Table:
                        <select
                            className="ml-2 border rounded px-2 py-1"
                            onChange={(e) => setSelectedColumns([])} // Reset selected columns on table change
                        >
                            {tables.map((table, index) => (
                                <option key={index} value={table}>
                                    {table}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        onClick={() => {
                            setColumnsLoaded(false);
                            setTimeout(() => {
                                setColumns(["price", "date", "postcode", "property_type"]);
                                setColumnsLoaded(true);
                            }, 1000); // Simulate column loading
                        }}
                        className="px-4 py-1 bg-green-500 text-white rounded"
                    >
                        Load Columns
                    </button>
                </div>

                {/* Column Selection */}
                {columnsLoaded && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                        {columns.map((col) => (
                            <label key={col} className="flex items-center gap-2">
                                <input type="checkbox" />
                                {col}
                            </label>
                        ))}
                    </div>
                )}
            </>
        )}
    </div>
      <div className="border p-4 rounded-md shadow flex gap-4">
        <button className="px-4 py-1 bg-yellow-500 text-white rounded">
          Preview First 100 Rows
        </button>
        <button
          className="px-4 py-1 bg-indigo-600 text-white rounded"
          onClick={() => {
            setStatus("🔄 Ingesting...");
            setTimeout(() => {
              setStatus("✅ Done");
              setResult("35412 records ingested");
            }, 2000);
          }}
        >
          Start Ingestion
        </button>
      </div>

      {/* Status */}
      <div className="border p-4 rounded-md shadow">
        <div>Status: {status || "Idle"}</div>
        <div>Result: {result}</div>
      </div>
    </div>
  );
};
export default IngestorUI;
