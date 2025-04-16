import React, { useState } from "react";

const IngestorUI = () => {
  const [source, setSource] = useState("ClickHouse");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");

  const [selectedColumns, setSelectedColumns] = useState([]);

  const [tablesLoaded, setTablesLoaded] = useState(false);
const [loadingTables, setLoadingTables] = useState(false);
const [columnsLoaded, setColumnsLoaded] = useState(false);
const [columns, setColumns] = useState([]);


  const column = ["id", "date", "price", "property_type", "postcode", "county"];

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
    {/* Source Selector */}
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

    <div className="target-box">
      {source === "ClickHouse" ? "Flat File" : "ClickHouse"}
    </div>
  </div>
</div>

{source === "ClickHouse" && (
  <div className="border p-4 rounded-md shadow space-y-2 mt-4">
    <div className="font-semibold">ClickHouse Config:</div>
    <div className="grid grid-cols-2 gap-4">
      <input className="border p-2 rounded" placeholder="Host" />
      <input className="border p-2 rounded" placeholder="Port" />
      <input className="border p-2 rounded" placeholder="JWT" />
      <input className="border p-2 rounded" placeholder="DB" />
      <input className="border p-2 rounded" placeholder="User" />
    </div>
    <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Connect</button>
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
  {/* Load Tables Section */}
  {!tablesLoaded ? (
    <div className="flex items-center gap-4">
      {!loadingTables ? (
        <button
          onClick={() => {
            setLoadingTables(true);
            setTimeout(() => {
              setTablesLoaded(true);
              setLoadingTables(false);
            }, 1500); // Simulate table loading
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Load Tables
        </button>
      ) : (
        <div className="flex items-center gap-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading Tables...
        </div>
      )}
    </div>
  ) : (
    <>
      {/* Table Selection */}
      <div className="flex items-center gap-4">
        <label>
          Table:
          <select className="ml-2 border rounded px-2 py-1">
            <option>uk_price_paid</option>
            {/* Add more tables as needed */}
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


      {/* Buttons */}
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
