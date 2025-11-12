import React, { useState } from 'react';

const QueryInput = ({ onExecute, isLoading }) => {
  const [query, setQuery] = useState('SELECT * FROM Customers;');

  const handleSubmit = () => {
    if (query.trim()) {
      onExecute(query);
    }
  };

  const handleKeyDown = (e) => {
    // Execute on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">SQL Query Editor</h2>
        <button
          onClick={clearQuery}
          className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
      
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your SQL query here..."
        className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        disabled={isLoading}
      />
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> + 
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded ml-1">Enter</kbd> to execute
        </p>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isLoading || !query.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing...
            </span>
          ) : (
            'Run Query'
          )}
        </button>
      </div>
    </div>
  );
};

export default QueryInput;