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

        // Ambil data parfum
        const perfumes = await apiFetch("/api/admin/perfumes").catch(() => []);
        const names = {};

        if (Array.isArray(perfumes)) {
          perfumes.forEach((p) => {
            names[p.id] = p.perfume;
          });
        }

        setPerfumeNames(names);

        // Ambil data evaluasi
        const result = await apiFetch("/api/admin/evaluation");
        const evaluationDetails = result?.details || [];

        setDetails(evaluationDetails);

        // Hitung summary
        const validDetails = evaluationDetails.filter(
          (d) => d && typeof d.ndcg === "number"
        );

        const total = validDetails.length;

        const map =
          total > 0
            ? validDetails.reduce((sum, d) => sum + Number(d.ap || 0), 0) /
              total
            : 0;

        const mean_ndcg =
          total > 0
            ? validDetails.reduce(
                (sum, d) => sum + Number(d.ndcg || 0),
                0
              ) / total
            : 0;

        setSummary({
          map,
          mean_ndcg,
          total_users: total,
        });
      } catch (err) {
        setError(
          "Gagal memuat data evaluasi. Pastikan server backend berjalan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center text-lg font-semibold text-black">
        MEMUAT DATA EVALUASI...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-black font-semibold border border-black rounded-2xl m-10 bg-white">
        {error}
      </div>
    );

  return (
    <main className="p-8 col-span-4 w-full min-h-screen overflow-y-auto bg-white text-black">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Algorithm Evaluation
        </h1>

        <p className="mt-2 text-base font-medium">
          Dashboard analisis performa sistem rekomendasi berdasarkan umpan balik
          pengguna.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-black rounded-2xl p-8 bg-white">
          <p className="text-sm font-bold uppercase tracking-wide mb-3">
            Mean Average Precision (MAP)
          </p>

          <h2 className="text-5xl font-extrabold">
            {summary.map.toFixed(3)}
          </h2>
        </div>

        <div className="border border-black rounded-2xl p-8 bg-white">
          <p className="text-sm font-bold uppercase tracking-wide mb-3">
            Mean NDCG
          </p>

          <h2 className="text-5xl font-extrabold">
            {summary.mean_ndcg.toFixed(3)}
          </h2>
        </div>
      </div>

      {/* Table */}
      <section className="border border-black rounded-2xl overflow-hidden bg-white">
        <div className="px-8 py-5 border-b border-black">
          <h2 className="text-xl font-bold">
            Detail Evaluasi Per User
          </h2>
        </div>

        {details.length === 0 ? (
          <div className="p-20 text-center text-lg font-medium">
            Belum ada data evaluasi yang tersedia.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold">
                    USER
                  </th>

                  <th className="px-8 py-5 text-left text-sm font-bold">
                    ANCHOR ITEM
                  </th>

                  <th className="px-8 py-5 text-left text-sm font-bold">
                    HASIL REKOMENDASI
                  </th>

                  <th className="px-8 py-5 text-center text-sm font-bold">
                    AP
                  </th>

                  <th className="px-8 py-5 text-center text-sm font-bold">
                    NDCG
                  </th>
                </tr>
              </thead>

              <tbody>
                {details.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-black hover:bg-gray-100 transition"
                  >
                    {/* User */}
                    <td className="px-8 py-6 text-base font-semibold">
                      {row.user_name}
                    </td>

                    {/* Anchor */}
                    <td className="px-8 py-6 text-base">
                      {perfumeNames[row.anchor_id] ||
                        `ID: ${row.anchor_id}`}
                    </td>

                    {/* Recommendation */}
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2 max-w-xl">
                        {(row.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-black rounded-lg px-3 py-2 text-sm bg-white"
                          >
                            <span className="font-medium">
                              {perfumeNames[item.id] ||
                                `ID: ${item.id}`}
                            </span>

                            <span className="font-bold ml-1">
                              ({item.score})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* AP */}
                    <td className="px-8 py-6 text-center text-base font-bold">
                      {Number(row.ap || 0).toFixed(3)}
                    </td>

                    {/* NDCG */}
                    <td className="px-8 py-6 text-center text-base font-bold">
                      {Number(row.ndcg || 0).toFixed(3)}
                    </td>
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