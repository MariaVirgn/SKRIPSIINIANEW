import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import back from "../../assets/back.png";
import PerfumeCard from "../../components/card";
import UserLayout from "./UserLayout";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  const results =
    location.state?.results?.data || location.state?.results || [];
  const filters = location.state?.filters || {};

  return (
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center px-4 md:px-10 py-10">
        {/* NAVIGATION & HEADER SECTION */}
        <div className="relative w-full max-w-6xl flex items-center justify-center mb-10">
          <div className="absolute left-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-transparent text-black cursor-pointer hover:opacity-60 transition-opacity"
            >
              <img src={back} alt="Back" className="h-5 w-auto" />
              <span className="hidden md:inline font-medium">
                Kembali Ke Form
              </span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-black">
              Rekomendasi Parfum
            </h1>
          </div>
        </div>

        <p className="text-lg md:text-xl italic text-center mb-10 text-gray-500">
          "Ditemukan {results.length} parfum yang cocok dengan preferensimu"
        </p>

        {/* PREFERENCE SUMMARY CARD */}
        <div className="w-full max-w-5xl mb-12 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Preferensi Kamu</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "Aroma", value: filters.Accord },
              { label: "Situation", value: filters.situation },
              { label: "Occasion", value: filters.Occasion },
              { label: "Gender", value: filters.gender },
              {
                label: "Size",
                value: filters.size ? `${filters.size} ml` : null,
              },
              { label: "Price", value: filters.Range },
            ].map(
              (item, index) =>
                item.value && (
                  <div key={index} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg border border-blue-100 text-center">
                      {item.value}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* GRID RESULTS */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center mt-20">
            <p className="text-xl text-gray-500">Tidak ada hasil ditemukan 😢</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-blue-600 underline"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {results.map((item, index) => (<PerfumeCard item={item} index={index}/>))}
          </div>
        )}

        {/* MODAL DETAIL (Top Notes) */}
        {selectedPerfume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedPerfume(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-blue-600 font-bold">
                  Detail Komposisi
                </span>
                <h2 className="text-3xl font-serif font-bold text-gray-800 mt-2 mb-6">
                  {selectedPerfume.perfume}
                </h2>

                <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200">
                  <p className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-widest">
                    Top Notes
                  </p>
                  <p className="text-xl italic text-gray-700 leading-relaxed font-serif">
                    "
                    {selectedPerfume.top_notes ||
                      "Aroma eksklusif yang menyegarkan"}
                    "
                  </p>
                </div>

                <div className="mt-6 flex justify-between text-sm text-gray-500">
                  <span>{selectedPerfume.gender}</span>
                  <span>•</span>
                  <span>{selectedPerfume.size} ml</span>
                  <span>•</span>
                  <span>{selectedPerfume.Occasion}</span>
                </div>

                <button
                  onClick={() => setSelectedPerfume(null)}
                  className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
