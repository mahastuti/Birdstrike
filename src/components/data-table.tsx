"use client"

import { useState, useEffect } from "react";
import { Trash2, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps {
  dataType: 'bird-strike' | 'bird-species' | 'traffic-flight';
}

export default function DataTable({ dataType }: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        showDeleted: showDeleted.toString()
      });

      const response = await fetch(`/api/data/${dataType}?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, showDeleted, dataType]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${dataType}?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${dataType}?id=${id}&action=restore`, {
        method: 'PATCH'
      });
      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        fetchData();
      }
    } catch (error) {
      console.error('Error restoring data:', error);
    }
  };

  const downloadData = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).filter(key => key !== 'deletedAt');
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getColumns = () => {
    switch (dataType) {
      case 'bird-strike':
        return [
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'airline', label: 'Airline' },
          { key: 'kategori_kejadian', label: 'Kategori' },
          { key: 'lokasi_perimeter', label: 'Lokasi' },
          { key: 'komponen_pesawat', label: 'Komponen' },
          { key: 'kondisi_kerusakan', label: 'Kerusakan' }
        ];
      case 'bird-species':
        return [
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'jenis_burung', label: 'Jenis Burung' },
          { key: 'nama_ilmiah', label: 'Nama Ilmiah' },
          { key: 'lokasi', label: 'Lokasi' },
          { key: 'jumlah_burung', label: 'Jumlah' },
          { key: 'cuaca', label: 'Cuaca' }
        ];
      case 'traffic-flight':
        return [
          { key: 'flight_number', label: 'Flight Number' },
          { key: 'airline', label: 'Airline' },
          { key: 'departure_time', label: 'Departure' },
          { key: 'arrival_time', label: 'Arrival' },
          { key: 'aircraft_type', label: 'Aircraft' },
          { key: 'passengers', label: 'Passengers' }
        ];
      default:
        return [];
    }
  };

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return '-';
    if (key.includes('tanggal') || key.includes('time')) {
      try {
        return new Date(value).toLocaleDateString('id-ID');
      } catch {
        return value;
      }
    }
    return value;
  };

  const columns = getColumns();

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm">entries</span>
          </div>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="rounded"
            />
            Show Deleted
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-48"
              placeholder="Search..."
            />
          </div>
          
          <button
            onClick={downloadData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th key={column.key} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  {column.label}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.deletedAt ? 'opacity-50' : ''}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="border border-gray-300 px-4 py-2 text-sm">
                      {formatValue(row[column.key], column.key)}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      {row.deletedAt ? (
                        <button
                          onClick={() => handleRestore(row.id.toString())}
                          className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs flex items-center gap-1"
                          title="Restore"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Undo
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(row.id.toString())}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs flex items-center gap-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} entries
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="border border-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="px-3 py-1 text-sm">
            Page {page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="border border-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
