import React, { useState } from "react";
import axios from "axios";


const IngestorUI = () => {
const [source, setSource] = useState("ClickHouse");
const [file, setFile] = useState(null);
const [status, setStatus] = useState("");
const [result, setResult] = useState("");

const [selectedColumns, setSelectedColumns] = useState([]);
const [columnMappings, setColumnMappings] = useState({});


const [tablesLoaded, setTablesLoaded] = useState(false);
const [columnsLoaded, setColumnsLoaded] = useState(false);
const [tables, setTables] = useState([]);

const [columns, setColumns] = useState([]);

const [flat, setFlat] = useState(false);

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

    const handleLoadColumns = async() => {
        try {
            console.log(tables);
            const res = await axios.post(
                "http://localhost:8080/api/clickhouse/columns",
                { tables }, // <- sending array of selected tables
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
            console.log("result",res);
            setColumns(res.data);
            setColumnsLoaded(true);
            setCon(true);
            setMessage(`✅ loaded columns: ${res.data.message || "Success"}`);
          } catch (err) {
            setMessage(`❌ failed: ${err.response?.data || err.message}`);
          }
    };


    const handleFileUpload = async (e) => {
      setFlat(true);
      setTablesLoaded(false);
      setColumnsLoaded(false);
      setSelectedColumns([]);
    
      const file = e.target.files[0];
      if (!file) return;
    
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTables([fileNameWithoutExt]);
    
      // ⬇️ Preview columns immediately
      previewCSVColumns(file);
    };
    
    const previewCSVColumns = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const firstLine = text.split("\n")[0];
        const headers = firstLine.split(",").map((h) => h.trim().replace(/['"]+/g, ""));
        setColumns(headers);
        console.log("Previewed columns:", headers);
        setColumnsLoaded(true);
        setTablesLoaded(true);
      };
      reader.readAsText(file);
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
                onChange={(e) => {setSource(e.target.value)
                setTablesLoaded(false); // Reset tables loaded state when source changes
                setColumnsLoaded(false); // Reset columns loaded state when source changes
                setTables([]); // Reset tables when source changes
                setColumns([]); // Reset columns when source changes
                setCon(false); // Reset connection state when source changes
                setMessage(""); // Reset message when source changes
                setSelectedColumns([]); // Reset selected columns when source changes
                setFile(null); // Reset file when source changes
                setStatus(""); // Reset status when source changes
                setResult(""); // Reset result when source changes
                }
            }
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

    {/* Table & Load Columns */}
    <div className="border p-4 rounded-md shadow space-y-4">
        {!tablesLoaded ? (
            !con ? (
                <div className="text-blue-600">Please connect/select FILE to load tables.</div>
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
                                <div className="flex items-center gap-4">
                                    <label>
                                        Table:
                                        <select
                            multiple
                            className="ml-2 border rounded px-2 py-1"
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(
                                    (option) => option.value
                                );
                                setSelectedColumns([]); // Reset selected columns on table change
                                setTables(selectedOptions); // Save selected tables in array
                            }}
                        >
                            {tables.map((table, index) => (
                                <option key={index} value={table}>
                                    {table}
                                </option>
                            ))}
                        </select>
                                    </label>
                                    {source==="ClickHouse"&&(
                                        <button
                                        onClick={handleLoadColumns}
                                        className="px-4 py-1 bg-green-500 text-white rounded"
                                    >
                                        Load Columns
                                    </button>
                                    )}
                                </div>

                                {/* Column Selection */}
                                {columnsLoaded && Array.isArray(columns) && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
    {/* Source Columns */}
    <div>
      <h3 className="font-semibold mb-2">📥 Source Columns</h3>
      <div className="space-y-1">
        {columns.map((col) => (
          <label key={col} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={() => toggleColumn(col)}
            />
            <span>{col}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Target Mapping */}
    <div>
      <h3 className="font-semibold mb-2">📤 Target Columns</h3>
      <div className="space-y-1">
        {selectedColumns.map((col) => (
          <div key={col} className="flex items-center gap-2">
            <span className="w-28">{col}</span>
            <span className="text-gray-500">→</span>
            <input
              className="border px-2 py-1 rounded w-40"
              placeholder="Target column name"
              value={columnMappings[col] || ""}
              onChange={(e) =>
                setColumnMappings({ ...columnMappings, [col]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
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
