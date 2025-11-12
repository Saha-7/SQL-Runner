import React, { useState, useEffect } from 'react';
import { getTables, getTableInfo } from '../services/api';

const TablesPanel = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getTables();
      setTables(data.tables);
      setError(null);
    } catch (err) {
      setError('Failed to load tables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = async (tableName) => {
    setSelectedTable(tableName);
    try {
      const info = await getTableInfo(tableName);
      setTableInfo(info);
      if (onTableSelect) {
        onTableSelect(tableName, info);
      }
    } catch (err) {
      console.error('Failed to fetch table info:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Tables</h2>
        <div className="text-center py-8 text-gray-500">Loading tables...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Tables</h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Tables</h2>
      
      <div className="space-y-2">
        {tables.map((table) => (
          <div key={table}>
            <button
              onClick={() => handleTableClick(table)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedTable === table
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📊 {table}
            </button>
          </div>
        ))}
      </div>

      {tableInfo && selectedTable && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">{selectedTable} Schema</h3>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="space-y-2">
              {tableInfo.columns.map((col, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-mono text-gray-700">{col.name}</span>
                  <span className="text-gray-500">{col.type}</span>
                </div>
              ))}
            </div>
          </div>

          {tableInfo.sample_data && tableInfo.sample_data.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Sample Data (5 rows)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(tableInfo.sample_data[0]).map((key) => (
                        <th key={key} className="px-2 py-1 text-left text-gray-600">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tableInfo.sample_data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-1 text-gray-700">
                            {val !== null ? val.toString() : 
                              <span className="text-gray-400 italic">NULL</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TablesPanel;