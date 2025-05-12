'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTables, fetchTableData, createRecord, updateRecord, deleteRecord } from '@/services/api';
import { isAuthenticated } from '@/services/adminAuth';

interface TableData {
  columns: string[];
  rows: Record<string, any>[];
}

export default function DatabasePage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<Record<string, any> | null>(null);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    
    loadTables();
  }, [router]);

  useEffect(() => {
    if (selectedTable) {
      loadTableData();
    }
  }, [selectedTable]);

  async function loadTables() {
    try {
      const data = await fetchTables();
      setTables(data);
      if (data.length > 0) {
        setSelectedTable(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  }

  async function loadTableData() {
    if (!selectedTable) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTableData(selectedTable);
      setTableData(data);
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      setError(`Failed to load data for ${selectedTable} table. Please try again or select a different table.`);
      setTableData({ columns: ['id'], rows: [] }); // Provide fallback data
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!selectedTable || !newRecord) return;
    try {
      // Convert values to the appropriate data types
      const processedData = Object.keys(newRecord).reduce((acc, key) => {
        const value = newRecord[key];
        
        // Handle empty strings for optional fields
        if (value === '' && key !== 'id') {
          acc[key] = null;
          return acc;
        }

        // Handle date fields
        if (key === 'birthday' || key.toLowerCase().includes('at')) {
          if (value) {
            // Ensure the date is in ISO format with time
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              acc[key] = date.toISOString();
            } else {
              acc[key] = null;
            }
          } else {
            acc[key] = null;
          }
          return acc;
        }

        // Handle phone numbers - keep as string
        if (key === 'phoneNumber') {
          acc[key] = value.toString();
          return acc;
        }
        
        // Try to convert numeric strings to numbers
        if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
          if (value.includes('.')) {
            acc[key] = parseFloat(value);
          } else {
            acc[key] = parseInt(value, 10);
          }
        } 
        // Convert "true"/"false" strings to booleans
        else if (value === 'true' || value === 'false') {
          acc[key] = value === 'true';
        }
        // Keep the original value for other cases
        else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      await createRecord(selectedTable, processedData);
      setIsCreating(false);
      setNewRecord({});
      loadTableData();
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  }

  async function handleUpdate(id: number) {
    if (!selectedTable || !editingRow) return;
    try {
      // Convert values to the appropriate data types
      const processedData = Object.keys(editingRow).reduce((acc, key) => {
        if (key === 'id') return acc; // Skip id field
        if (key === 'phoneNumber') return acc; // Skip phoneNumber field
        
        const value = editingRow[key];
        
        // Try to convert numeric strings to numbers
        if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
          if (value.includes('.')) {
            acc[key] = parseFloat(value);
          } else {
            acc[key] = parseInt(value, 10);
          }
        } 
        // Convert "true"/"false" strings to booleans
        else if (value === 'true' || value === 'false') {
          acc[key] = value === 'true';
        }
        // Handle empty strings for optional fields
        else if (value === '') {
          acc[key] = null;
        }
        // Keep the original value for other cases
        else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      await updateRecord(selectedTable, id, processedData);
      setEditingRow(null);
      loadTableData();
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteRecord(selectedTable, id);
      loadTableData();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  }

  if (loading && !tableData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Database Management</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Database Management</h1>
      
      <div className="mb-6">
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded mb-6">
          <p>{error}</p>
          <button 
            onClick={() => loadTableData()} 
            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {tableData && (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedTable} Table
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setIsCreating(true)}
            >
              Add New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {tableData.columns.map((column) => (
                    <th key={column} className="px-6 py-3 text-left text-gray-600">
                      {column.toUpperCase()}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isCreating && (
                  <tr>
                    {tableData.columns.map((column) => {
                      // Determine appropriate placeholder based on column name
                      let placeholder = `Enter ${column}`;
                      let type = "text";
                      
                      if (column === 'id') {
                        placeholder = 'Auto-generated';
                        type = "text";
                      } else if (column.includes('email')) {
                        placeholder = 'email@example.com';
                        type = "email";
                      } else if (column.includes('password')) {
                        placeholder = '********';
                        type = "password";
                      } else if (column.includes('price') || column.includes('amount') || column.includes('balance')) {
                        placeholder = '0.00';
                        type = "number";
                      } else if (column.includes('date') || column.includes('At')) {
                        placeholder = 'Leave empty for current date';
                        type = "text";
                      } else if (column.includes('isActive') || column.includes('canPay')) {
                        placeholder = 'true or false';
                        type = "text";
                      } else if (column === 'phoneNumber') {
                        placeholder = '+123456789';
                        type = "tel";
                      }
                      
                      // Determine if the field should be disabled
                      const isDisabled = column === 'id' || 
                                         column === 'createdAt' || 
                                         column === 'updatedAt';
                      
                      return (
                        <td key={column} className="px-6 py-4">
                          <input
                            type={type}
                            className={`w-full px-2 py-1 border rounded text-gray-900 ${isDisabled ? 'bg-gray-100' : ''}`}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            onChange={(e) => {
                              setNewRecord((prev) => ({
                                ...prev,
                                [column]: e.target.value,
                              }));
                            }}
                          />
                          {column === 'id' && (
                            <small className="text-gray-500 text-xs">Auto-generated</small>
                          )}
                          {(column === 'createdAt' || column === 'updatedAt') && (
                            <small className="text-gray-500 text-xs">Set automatically</small>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={handleCreate}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setIsCreating(false);
                          setNewRecord({});
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}
                
                {tableData.rows.length > 0 ? (
                  tableData.rows.map((row) => (
                    <tr key={row.id}>
                      {tableData.columns.map((column) => (
                        <td key={column} className="px-6 py-4">
                          {editingRow && editingRow.id === row.id ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-gray-900"
                              value={editingRow[column] || ''}
                              onChange={(e) => {
                                setEditingRow((prev) => {
                                  if (!prev) return null;
                                  return {
                                    ...prev,
                                    [column]: e.target.value,
                                  };
                                });
                              }}
                            />
                          ) : (
                            <span className="text-gray-900">{row[column]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right space-x-2">
                        {editingRow && editingRow.id === row.id ? (
                          <>
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleUpdate(row.id)}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setEditingRow(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => setEditingRow(row)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(row.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  !isCreating && (
                    <tr>
                      <td colSpan={tableData.columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          <p className="text-lg font-semibold mb-1">No records found</p>
                          <p className="text-sm mb-4">This table doesn't have any data yet.</p>
                          <button
                            onClick={() => setIsCreating(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Add Your First Record
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 