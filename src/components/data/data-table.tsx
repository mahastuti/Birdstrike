import { useState, useEffect, useCallback } from "react";
import { Trash2, RotateCcw, Download, ChevronLeft, ChevronRight, Pencil } from "lucide-react";

interface DataTableProps {
  dataType: 'bird-strike' | 'bird-species' | 'traffic-flight' | 'modeling';
  exportScope?: 'all' | 'filtered';
}

type RowPrimitive = string | number | boolean | null | undefined;
interface BaseRow {
  id: string | number;
  deletedAt?: string | null;
  [key: string]: RowPrimitive;
}

type EditValues = Record<string, string>;

enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export default function DataTable({ dataType, exportScope = 'all' }: DataTableProps) {
  const [data, setData] = useState<BaseRow[]>([]);
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

  const [sortBy, setSortBy] = useState<string>(dataType === 'traffic-flight' ? 'no' : dataType === 'modeling' ? 'tanggal' : '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(dataType === 'traffic-flight' ? SortDirection.Asc : SortDirection.Desc);

  const [bulan, setBulan] = useState<string>('');
  const [tahun, setTahun] = useState<string>('');
  const [bulanOptions, setBulanOptions] = useState<string[]>([]);
  const [tahunOptions, setTahunOptions] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<BaseRow | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'file' | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        showDeleted: showDeleted.toString(),
      });
      if (sortBy) {
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
      }
      if (dataType === 'traffic-flight') {
        if (bulan) params.set('bulan', bulan);
        if (tahun) params.set('tahun', tahun);
      }

      const response = await fetch(`/api/data/${dataType}?${params}`, {
        signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (signal?.aborted) return;

      const result = await response.json();
      if (!signal?.aborted && result.success) {
        setData(result.data);
        setPagination(result.pagination);
        if (dataType === 'traffic-flight') {
          const months: string[] = result?.filters?.months || Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
          const years: string[] = result?.filters?.years || [];
          setBulanOptions(months);
          setTahunOptions(years);
        }
      }
    } catch (error) {
      if (signal?.aborted) return;
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching data:', error);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, limit, search, showDeleted, dataType, sortBy, sortOrder, bulan, tahun]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchData(controller.signal);
    }, search ? 300 : 0);

    return () => {
      try { if (!controller.signal.aborted) controller.abort(); } catch {}
      clearTimeout(timeoutId);
    };
  }, [fetchData, search]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${dataType}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => { if (!loading) { const c = new AbortController(); fetchData(c.signal); } }, 100);
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
      const response = await fetch(`/api/data/${dataType}?id=${id}&action=restore`, { method: 'PATCH' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => { if (!loading) { const c = new AbortController(); fetchData(c.signal); } }, 100);
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
    const params = new URLSearchParams();
    if (sortBy) { params.set('sortBy', sortBy); params.set('sortOrder', sortOrder); }
    if (exportScope === 'filtered') {
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (dataType !== 'traffic-flight') params.set('showDeleted', String(showDeleted));
      if (dataType === 'traffic-flight') {
        if (bulan) params.set('bulan', bulan);
        if (tahun) params.set('tahun', tahun);
      }
    }
    const url = `/api/data/${dataType}/export?${params.toString()}`;
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener noreferrer';
    a.click();
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
          { key: 'titik', label: 'Titik' },
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
      case 'modeling':
        return [
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'jam', label: 'Jam' },
          { key: 'waktu', label: 'Waktu' },
          { key: 'cuaca', label: 'Cuaca' },
          { key: 'jumlah_burung_pada_titik_x', label: 'Jumlah Burung pada Titik X' },
          { key: 'titik', label: 'Titik' },
          { key: 'fase', label: 'Fase' },
          { key: 'strike', label: 'Strike' },
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
        return [] as const;
    }
  };

  const formatValue = (value: unknown, key: string): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string') {
      if (key === 'tanggal') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleDateString('id-ID');
      }
      if (key === 'jam') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleString('id-ID');
      }
      return value;
    }
    return String(value);
  };

  const columns = getColumns();

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc));
    } else {
      setSortBy(key);
      setSortOrder(SortDirection.Asc);
    }
    setPage(1);
  };

  const toDateInput = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const toTimeInput = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mi}`;
  };

  const openPreview = (src: string, type: 'image' | 'pdf' | 'file') => {
    setPreviewSrc(src);
    setPreviewType(type);
  };
  const closePreview = () => { setPreviewSrc(null); setPreviewType(null); };

  const openEdit = (row: BaseRow) => {
    setEditingRow(row);
    const initial: EditValues = {};
    for (const c of columns) {
      if (c.key === 'tanggal') initial[c.key] = toDateInput(row[c.key] as string);
      else if (c.key === 'jam') initial[c.key] = toTimeInput(row[c.key] as string);
      else initial[c.key] = (row[c.key] ?? '') as string;
    }
    setEditValues(initial);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (!editingRow) return;
    const id = String(editingRow.id);
    const body: Record<string, string> = {};
    for (const c of columns) {
      const k = c.key;
      if (dataType === 'bird-species' && k === 'jumlah_burung') body[k] = editValues[k] ? String(editValues[k]) : '';
      else body[k] = editValues[k];
    }
    try {
      const res = await fetch(`/api/data/${dataType}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Gagal mengupdate data');
      setIsEditing(false);
      setEditingRow(null);
      const c = new AbortController();
      fetchData(c.signal);
      setMessage('Data berhasil diperbarui');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setMessage('Gagal memperbarui data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
      <div className="mb-4">
        <details className="bg-gray-50 border border-gray-300 rounded-lg">
          <summary className="cursor-pointer flex justify-between items-center px-4 py-3">
            <span className="font-medium text-gray-800">Cara Buka File CSV di Excel</span>
            <span className="text-gray-600">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-gray-700">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Di Excel pilih Data → From Text/CSV.</li>
              <li>Pilih file CSV hasil download.</li>
              <li>File Origin: UTF-8, Delimiter: Comma (,), lalu Load.</li>
            </ol>
            <p className="mt-2">Jangan double-click file CSV agar encoding tetap benar.</p>
          </div>
        </details>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm">entries</span>
          </div>
          {(dataType === 'bird-strike' || dataType === 'bird-species') && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="rounded" />
              Show Deleted
            </label>
          )}
        </div>

        <div className="flex items-center gap-4">
          {dataType === 'traffic-flight' && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-sm">Bulan:</span>
                <select
                  value={bulan}
                  onChange={(e) => { setBulan(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Semua</option>
                  {bulanOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-sm">Tahun:</span>
                <select
                  value={tahun}
                  onChange={(e) => { setTahun(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Semua</option>
                  {tahunOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </label>
            </>
          )}
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
          <button onClick={downloadData} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded mb-4 text-sm">{message}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => {
                const active = sortBy === column.key;
                return (
                  <th key={column.key} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => toggleSort(column.key)} className="flex items-center gap-1">
                      <span>{column.label}</span>
                      <span className="text-xs text-gray-500">{active ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                );
              })}
              {dataType !== 'modeling' && (
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 w-40">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="border border-gray-300 px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="border border-gray-300 px-4 py-8 text-center text-gray-500">No data available</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={String(row.id)} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.deletedAt ? 'opacity-50' : ''}`}>
                  {columns.map((column) => {
                    const val = row[column.key];
                    if (column.key === 'dokumentasi' && typeof val === 'string' && val) {
                      const lower = val.toLowerCase();
                      const isDataImg = lower.startsWith('data:image/');
                      const isUrlImg = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/.test(lower) || (lower.startsWith('http') && !/\.pdf(\?.*)?$/.test(lower));
                      const isImage = isDataImg || isUrlImg;
                      const isPdf = lower.startsWith('data:application/pdf') || /\.pdf(\?.*)?$/.test(lower);
                      return (
                        <td key={column.key} className="border border-gray-300 px-4 py-2 text-sm">
                          {isImage ? (
                            <button onClick={() => openPreview(val, 'image')} className="inline-block border border-gray-300 rounded hover:opacity-90" title="Lihat & Download">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={val} alt="Dokumentasi" className="h-16 w-16 object-cover rounded" />
                            </button>
                          ) : isPdf ? (
                            <button onClick={() => openPreview(val, 'pdf')} className="text-blue-600 hover:underline">Lihat PDF</button>
                          ) : (
                            <button onClick={() => openPreview(val, 'file')} className="text-blue-600 hover:underline">Lihat File</button>
                          )}
                        </td>
                      );
                    }
                    return (
                      <td key={column.key} className="border border-gray-300 px-4 py-2 text-sm">{formatValue(val, column.key)}</td>
                    );
                  })}
                  {dataType !== 'modeling' && (
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(row)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded text-xs flex items-center gap-1" title="Edit">
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      {row.deletedAt ? (
                        <button onClick={() => handleRestore(String(row.id))} className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs flex items-center gap-1" title="Restore">
                          <RotateCcw className="w-3 h-3" />
                          Undo
                        </button>
                      ) : (
                        <button onClick={() => handleDelete(String(row.id))} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs flex items-center gap-1" title="Delete">
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

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          {(() => {
            const total = pagination?.total ?? 0;
            const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
            const end = total === 0 ? 0 : Math.min(page * limit, total);
            return <>Showing {start} to {end} of {total} entries</>;
          })()}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="border border-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="px-3 py-1 text-sm">Page {page} of {pagination?.pages ?? 0}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === (pagination?.pages ?? 1) || (pagination?.pages ?? 0) === 0} className="border border-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {previewSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg border-2 border-gray-300 shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Dokumentasi</h3>
              <button onClick={closePreview} className="px-3 py-1 rounded border border-gray-300">Tutup</button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto">
              {previewType === 'image' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={previewSrc} alt="Dokumentasi" className="max-h-[70vh] w-auto mx-auto rounded" />
              ) : previewType === 'pdf' ? (
                <iframe src={previewSrc} className="w-full h-[70vh] border" />
              ) : (
                <a href={previewSrc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Buka File</a>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <a href={previewSrc} download className="px-4 py-2 rounded text-white bg-gradient-to-r from-[#72BB34] to-[#40A3DC] hover:opacity-90">Download</a>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg border-2 border-gray-300 shadow-lg">
            <div className="p-4 border-b"><h3 className="text-lg font-medium text-gray-800">Edit Data</h3></div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {columns.map(col => (
                <div key={col.key} className="text-sm">
                  <label className="block text-gray-700 mb-1">{col.label}</label>
                  {col.key === 'tanggal' ? (
                    <input type="date" value={editValues[col.key] || ''} onChange={e => setEditValues(v => ({ ...v, [col.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                  ) : col.key === 'jam' ? (
                    <input type="time" value={editValues[col.key] || ''} onChange={e => setEditValues(v => ({ ...v, [col.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                  ) : col.key === 'dokumentasi' ? (
                    <textarea value={editValues[col.key] || ''} onChange={e => setEditValues(v => ({ ...v, [col.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 h-24" />
                  ) : (
                    <input type="text" value={editValues[col.key] ?? ''} onChange={e => setEditValues(v => ({ ...v, [col.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2" />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => { setIsEditing(false); setEditingRow(null); }} className="px-4 py-2 rounded border border-gray-300">Batal</button>
              <button onClick={saveEdit} className="px-4 py-2 rounded text-white bg-gradient-to-r from-[#72BB34] to-[#40A3DC] hover:opacity-90">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
