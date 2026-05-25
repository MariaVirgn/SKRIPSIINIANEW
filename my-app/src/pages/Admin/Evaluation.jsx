import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

function AdminEvaluation() {
  const [summary, setSummary] = useState({
    map: 0,
    mean_ndcg: 0,
    total_users: 0,
  });

  const [details, setDetails] = useState([]);
  const [perfumeNames, setPerfumeNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil data nama parfum untuk mapping ID -> Nama
        const perfumes = await apiFetch("/api/admin/perfumes").catch(() => []);
        const names = {};
        if (Array.isArray(perfumes)) {
          perfumes.forEach((p) => {
            names[p.id] = p.perfume;
          });
        }
        setPerfumeNames(names);

        // 2. Ambil data hasil evaluasi dari backend
        const result = await apiFetch("/api/admin/evaluation");
        const evaluationDetails = result?.details || [];
        setDetails(evaluationDetails);

        // 3. Hitung Metrik Summary dengan pengecekan data
        const validDetails = evaluationDetails.filter(
          (d) => d && typeof d.ndcg === 'number'
        );

        const total = validDetails.length;
        const map = total > 0 
          ? validDetails.reduce((sum, d) => sum + Number(d.ap || 0), 0) / total 
          : 0;
        const mean_ndcg = total > 0 
          ? validDetails.reduce((sum, d) => sum + Number(d.ndcg || 0), 0) / total 
          : 0;

        setSummary({ map, mean_ndcg, total_users: total });
      } catch (err) {
        setError("Gagal memuat data evaluasi. Pastikan server backend berjalan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRatingBadge = (score) => {
    const numScore = Math.round(Number(score));
    const badges = {
      5: { text: "Sangat Sesuai (5)", class: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      4: { text: "Sesuai (4)", class: "bg-blue-100 text-blue-800 border-blue-200" },
      3: { text: "Cukup Sesuai (3)", class: "bg-amber-100 text-amber-800 border-amber-200" },
      2: { text: "Tidak Sesuai (2)", class: "bg-orange-100 text-orange-800 border-orange-200" },
      1: { text: "Sangat Tidak Sesuai (1)", class: "bg-red-100 text-red-800 border-red-200" },
    };
    return badges[numScore] || { text: "Belum Dinilai (0)", class: "bg-gray-100 text-gray-600 border-gray-200" };
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">MEMUAT DATA EVALUASI...</div>;
  
  if (error) return (
    <div className="p-10 text-center text-red-500 font-semibold bg-red-50 m-10 rounded-2xl border border-red-200">
      {error}
    </div>
  );

  return (
    <main className="p-8 col-span-4 w-full h-screen overflow-y-auto bg-slate-50">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900">Algoritma Evaluation</h1>
        <p className="text-slate-500 mt-2">Dashboard analisis performa sistem rekomendasi berdasarkan umpan balik pengguna.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Mean Average Precision (MAP)</p>
          <h2 className="text-5xl font-black text-slate-900">{summary.map.toFixed(3)}</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Mean NDCG</p>
          <h2 className="text-5xl font-black text-indigo-600">{summary.mean_ndcg.toFixed(3)}</h2>
        </div>
      </div>

      {/* Table Detail */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-800">Detail Evaluasi Per User</h2>
        </div>
        
        {details.length === 0 ? (
          <div className="p-20 text-center text-slate-400 italic">Belum ada data evaluasi yang tersedia.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-8 py-4">USER</th>
                  <th className="px-8 py-4">ANCHOR ITEM</th>
                  <th className="px-8 py-4">HASIL REKOMENDASI (SKOR)</th>
                  <th className="px-8 py-4 text-center">AP</th>
                  <th className="px-8 py-4 text-center">NDCG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{row.user_name}</td>
                    <td className="px-8 py-6 text-sm text-slate-500 italic">
                      {perfumeNames[row.anchor_id] || `ID: ${row.anchor_id}`}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2 max-w-lg">
                        {(row.recommended_ids || []).map((pId, idx) => {
                          // 1. Pastikan kita mengakses skor dengan index yang tepat
                          const score = row.relevansi_scores && row.relevansi_scores[idx] !== undefined
                            ? row.relevansi_scores[idx]
                            : 0;

                          // 2. Pastikan kita memiliki nama parfum dari state perfumeNames
                          const perfumeLabel = perfumeNames[pId] || `ID: ${pId}`;

                          if (score === 0) {
                            return (
                              <div key={`${row.user_name}-${pId}-${idx}`} className="bg-gray-100 text-gray-400 border-gray-200 px-3 py-1 rounded-full border text-[10px] font-medium">
                                {perfumeLabel} (Belum Dinilai)
                              </div>
                            );
                          }

                          const badge = getRatingBadge(score);
                          return (
                            <div key={`${row.user_name}-${pId}-${idx}`} className={`flex items-center gap-2 px-3 py-1 rounded-full border ${badge.class}`}>
                              <span className="text-xs font-semibold truncate max-w-[120px]">
                                {perfumeLabel}
                              </span>
                              <span className="text-[9px] font-bold">{score}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-slate-700">{Number(row.ap || 0).toFixed(3)}</td>
                    <td className="px-8 py-6 text-center font-bold text-indigo-600">{Number(row.ndcg || 0).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminEvaluation;