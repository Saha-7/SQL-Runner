import React, { useState } from 'react';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';
import TablesPanel from './components/TablesPanel';
import { executeQuery } from './services/api';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecuteQuery = async (query) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await executeQuery(query);
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSelect = (tableName, info) => {
    console.log(`Selected table: ${tableName}`, info);
    // You can add additional logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">SQL Runner</h1>
          <p className="text-sm text-gray-600 mt-1">Execute SQL queries and explore your database</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tables Panel - Sidebar */}
          <div className="lg:col-span-1">
            <TablesPanel onTableSelect={handleTableSelect} />
          </div>

          {/* Query and Results - Main Area */}
          <div className="lg:col-span-3 space-y-6">
            <QueryInput onExecute={handleExecuteQuery} isLoading={isLoading} />
            <ResultsDisplay result={result} error={error} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600">
        <p>Built with SQLite + React + FastAPI</p>
      </footer>
    </div>
  );
}

export default App;