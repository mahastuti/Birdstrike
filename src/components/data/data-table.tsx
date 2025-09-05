"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps {
  dataType: 'bird-strike' | 'bird-species' | 'traffic-flight';
}

export default function DataTable({ dataType }: DataTableProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
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

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        showDeleted: showDeleted.toString()
      });

      const response = await fetch(`/api/data/${dataType}?${params}`, {
        signal // Add abort signal for request cancellation
      });

      // Check if response is ok before reading body
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if request was aborted
      if (signal?.aborted) {
        return;
      }

      const result = await response.json();

      // Only update state if request wasn't aborted
      if (!signal?.aborted && result.success) {
        setData(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      // Handle different types of errors gracefully
      if (signal?.aborted) {
        // Request was aborted - this is normal, don't log or update state
        return;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Abort error but signal not aborted - still ignore
          return;
        }
        console.error('Error fetching data:', error);
      } else {
        console.error('Unknown error fetching data:', error);
      }
    } finally {
      // Only set loading to false if request wasn't aborted
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [page, limit, search, showDeleted, dataType]);

  useEffect(() => {
    const controller = new AbortController();

    // Add debouncing for search to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchData(controller.signal);
    }, search ? 300 : 0); // 300ms debounce for search, immediate for other changes

    return () => {
      try {
        // Safely abort the controller without throwing errors
        if (!controller.signal.aborted) {
          controller.abort();
        }
      } catch {
        // Silently ignore abort errors during cleanup
      }
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${dataType}?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        // Use a small delay to prevent race conditions with the main fetch
        setTimeout(() => {
          if (!loading) {
            const newController = new AbortController();
            fetchData(newController.signal);
          }
        }, 100);
      } else {
        setMessage(result.message || 'Failed to delete data');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setMessage('Failed to delete data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${dataType}?id=${id}&action=restore`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        // Use a small delay to prevent race conditions with the main fetch
        setTimeout(() => {
          if (!loading) {
            const newController = new AbortController();
            fetchData(newController.signal);
          }
        }, 100);
      } else {
        setMessage(result.message || 'Failed to restore data');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error restoring data:', error);
      setMessage('Failed to restore data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const downloadData = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).filter(key => key !== 'deletedAt');
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return String(value);
          })
          .join(',')
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
          { key: 'jam', label: 'Jam' },
          { key: 'waktu', label: 'Waktu' },
          { key: 'fase', label: 'Fase' },
          { key: 'lokasi_perimeter', label: 'Lokasi Perimeter' },
          { key: 'kategori_kejadian', label: 'Kategori Kejadian' },
          { key: 'airline', label: 'Airline' },
          { key: 'runway_use', label: 'Runway Use' },
          { key: 'komponen_pesawat', label: 'Komponen Pesawat' },
          { key: 'dampak_pada_pesawat', label: 'Dampak Pada Pesawat' },
          { key: 'kondisi_kerusakan', label: 'Kondisi Kerusakan' },
          { key: 'tindakan_perbaikan', label: 'Tindakan Perbaikan' },
          { key: 'sumber_informasi', label: 'Sumber Informasi' },
          { key: 'remark', label: 'Remark' },
          { key: 'deskripsi', label: 'Deskripsi' },
          { key: 'dokumentasi', label: 'Dokumentasi' },
          { key: 'jenis_pesawat', label: 'Jenis Pesawat' }
        ];
      case 'bird-species':
        return [
          { key: 'longitude', label: 'Longitude' },
          { key: 'latitude', label: 'Latitude' },
          { key: 'lokasi', label: 'Lokasi' },
          { key: 'titik', label: 'Titik' },
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'jam', label: 'Jam' },
          { key: 'waktu', label: 'Waktu' },
          { key: 'cuaca', label: 'Cuaca' },
          { key: 'jenis_burung', label: 'Jenis Burung' },
          { key: 'nama_ilmiah', label: 'Nama Ilmiah' },
          { key: 'jumlah_burung', label: 'Jumlah Burung' },
          { key: 'keterangan', label: 'Keterangan' },
          { key: 'dokumentasi', label: 'Dokumentasi' }
        ];
      case 'traffic-flight':
        return [
          { key: 'no', label: 'No' },
          { key: 'act_type', label: 'Act Type' },
          { key: 'reg_no', label: 'Reg No' },
          { key: 'opr', label: 'Operator' },
          { key: 'flight_number_origin', label: 'Flight No (Org)' },
          { key: 'flight_number_dest', label: 'Flight No (Dest)' },
          { key: 'ata', label: 'ATA' },
          { key: 'block_on', label: 'Block On' },
          { key: 'block_off', label: 'Block Off' },
          { key: 'atd', label: 'ATD' },
          { key: 'ground_time', label: 'Ground Time' },
          { key: 'org', label: 'ORG' },
          { key: 'des', label: 'DES' },
          { key: 'ps', label: 'PS' },
          { key: 'runway', label: 'Runway' },
          { key: 'avio_a', label: 'Avio A' },
          { key: 'avio_d', label: 'Avio D' },
          { key: 'f_stat', label: 'F Stat' },
          { key: 'bulan', label: 'Bulan' },
          { key: 'tahun', label: 'Tahun' }
        ];
      default:
        return [];
    }
  };

  const formatValue = (value: unknown, key: string): string => {
    if (value === null || value === undefined) return '-';

    // Handle ISO date strings
    if (typeof value === 'string') {
      if (key === 'tanggal') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleDateString('id-ID');
      }
      if (key === 'jam') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      // fallback for any other ISO-like strings that look like dates
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleString('id-ID');
      }
      return value;
    }

    return String(value);
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
          
          {dataType !== 'traffic-flight' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="rounded"
              />
              Show Deleted
            </label>
          )}
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
              {dataType !== 'traffic-flight' && (
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 w-32">
                  Actions
                </th>
              )}
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
                <td colSpan={columns.length + (dataType !== 'traffic-flight' ? 1 : 0)} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={String(row.id)}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${Boolean(row.deletedAt) ? 'opacity-50' : ''}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="border border-gray-300 px-4 py-2 text-sm">
                      {formatValue(row[column.key], column.key)}
                    </td>
                  ))}
                  {dataType !== 'traffic-flight' && (
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {row.deletedAt ? (
                          <button
                            onClick={() => handleRestore(String(row.id))}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs flex items-center gap-1"
                            title="Restore"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Undo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(String(row.id))}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs flex items-center gap-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
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
