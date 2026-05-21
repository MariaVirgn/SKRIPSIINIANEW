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

        // GET PERFUME NAMES
        const perfumes = await apiFetch("/api/admin/perfumes").catch(() => []);

        const names = {};
        perfumes?.forEach((p) => {
          names[p.id] = p.perfume;
        });

        setPerfumeNames(names);

        // GET EVALUATION (Backend sekarang menghitung NDCG berdasarkan rating skala 0-4)
        const result = await apiFetch("/api/admin/evaluation");

        const evaluationDetails = result?.details || [];
        setDetails(evaluationDetails);

        // VALID DATA
        const validDetails = evaluationDetails.filter(
          (d) => d?.ap !== null && d?.ndcg !== null
        );

        // MEAN AVERAGE PRECISION (MAP)
        const map =
          validDetails.length > 0
            ? validDetails.reduce((sum, d) => sum + Number(d.ap), 0) /
              validDetails.length
            : 0;

        // MEAN NDCG (Sekarang merefleksikan grading ideal kumulatif dari rating user)
        const mean_ndcg =
          validDetails.length > 0
            ? validDetails.reduce((sum, d) => sum + Number(d.ndcg), 0) /
              validDetails.length
            : 0;

        setSummary({
          map,
          mean_ndcg,
          total_users: validDetails.length,
        });
      } catch (err) {
        setError(err.message || "Failed to load evaluation data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper untuk mengubah nilai score (0-4) menjadi teks label badge
  const getRatingBadge = (score) => {
    const numScore = Number(score);
    switch (numScore) {
      case 4:
        return { text: "Sangat Sesuai", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case 3:
        return { text: "Sesuai", class: "bg-blue-50 text-blue-700 border-blue-200" };
      case 2:
        return { text: "Netral", class: "bg-slate-100 text-slate-700 border-slate-200" };
      case 1:
        return { text: "Tidak Sesuai", class: "bg-orange-50 text-orange-700 border-orange-200" };
      case 0:
        return { text: "Sangat Tidak Sesuai", class: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { text: "Belum Dinilai", class: "bg-gray-50 text-gray-400 border-gray-100" };
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
        LOADING DASHBOARD...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <main className="p-6 col-span-4 w-full h-screen overflow-y-auto bg-slate-50">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Algoritma Evaluation
        </h1>

        <p className="text-slate-500 mt-2 text-lg font-medium">
          Dashboard Analisis MAP & Mean NDCG berdasarkan tingkat kesesuaian rekomendasi oleh user.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        {/* MAP */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Mean Average Precision (MAP)
          </p>

          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-3">
            {summary.map.toFixed(4)}
          </h2>

          <p className="text-sm text-slate-400 italic">
            Berdasarkan {summary.total_users} user valid.
          </p>
        </div>

        {/* NDCG */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Mean NDCG @7 (Skala Multi-level)
          </p>

          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-3">
            {summary.mean_ndcg.toFixed(4)}
          </h2>

          <p className="text-sm text-slate-400 italic">
            Rata-rata akurasi peringkat berdasarkan bobot pilihan kesesuaian user.
          </p>
        </div>
      </div>

      {/* TABLE DATA */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            Detail Evaluasi Per User
          </h2>

          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Live Metrics
          </span>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400 tracking-widest">
                  User
                </th>

                <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400 tracking-widest">
                  Rekomendasi & Respons Tingkat Kesesuaian
                </th>

                <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400 tracking-widest text-center">
                  AP
                </th>

                <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400 tracking-widest text-center">
                  NDCG
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {details.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 transition-colors"
                >

                  {/* USER */}
                  <td className="px-8 py-6 align-top">
                    <span className="font-black text-lg text-slate-900 block">
                      {row.user_name}
                    </span>
                  </td>

                  {/* WISHLIST & DROPDOWN RATING REFLECTION */}
                  <td className="px-8 py-6">

                    {/* JUMLAH DATA YANG DINILAI */}
                    <div className="mb-3">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                        {row?.ratings?.length || row?.valid_ids?.length || 0} Item Dinilai
                      </span>
                    </div>

                    {/* LIST PARFUM DENGAN INDIKATOR SKALA KESESUAIAN */}
                    <div className="flex flex-col gap-2 max-w-2xl">
                      {(row?.ratings || row?.valid_ids || []).map((itemData, idx) => {
                        // Mengakomodasi jika backend mengirim struktur array object ataupun array ID biasa
                        const isObject = typeof itemData === 'object';
                        const perfumeId = isObject ? itemData.perfume_id : itemData;
                        const score = isObject ? itemData.rating_score : row.scores?.[idx]; 
                        
                        const badgeStyle = getRatingBadge(score);

                        return (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 gap-4"
                          >
                            <span className="text-xs font-bold text-slate-700 truncate">
                              {perfumeNames[perfumeId] || `ID ${perfumeId}`}
                            </span>
                            
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-sm ${badgeStyle.class}`}>
                              {badgeStyle.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </td>

                  {/* SCORE AP */}
                  <td className="px-8 py-6 text-center align-top">
                    <span className="text-base font-bold text-slate-700 block mt-1">
                      {Number(row.ap || 0).toFixed(3)}
                    </span>
                  </td>

                  {/* SCORE NDCG */}
                  <td className="px-8 py-6 text-center align-top">
                    <span className="text-base font-bold text-indigo-600 block mt-1">
                      {Number(row.ndcg || 0).toFixed(3)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminEvaluation;