import './App.css';
import IngestorUI from './components/IngestorUI.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold mt-4">Ingestor Tool</h1>
      </header>
      <main className="p-4">
        <IngestorUI />
      </main>
    </div>
  );
}

export default App;
