import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api.js';
import PerfumeCard from '../../components/card.jsx';
import Pagination from '../../components/pagination.jsx';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const FILTER_OPTIONS = {
    Accord: [
        "Citrus", "Floral", "Aquatic", "Oriental",
        "Spicy", "Woody", "Fruity", "Fresh", "Sweet"
    ],
    gender: ["Male", "Female", "Unisex"],
    situation: ["Day", "Night", "Versatile"],
    Occasion: [
        "Office", "Daily", "Formal Event", "Night Out",
        "Relaxing", "Romantic Date", "Outdoor", "Daily Outdoor", "Casual Day"
    ],
    range: [
        { label: "Basic", info: "≤ 155K", value: "basic" },
        { label: "Classic", info: "155,1K – 210K", value: "classic" },
        { label: "Premium", info: "210,1K – 251,1K", value: "premium" },
        { label: "Luxury", info: "251,2K – 349K", value: "luxury" },
        { label: "Elite", info: "> 349,1K", value: "elite" },
    ],
};

const FILTER_LABELS = {
    Accord: "Accord",
    gender: "Gender",
    situation: "Situasi",
    Occasion: "Occasion",
};

const INITIAL_FILTERS = {
    Accord: null,
    gender: null,
    situation: null,
    Occasion: null,
    price_range: null,
};

function CariParfumPage() {
    const [perfumes, setPerfumes] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fungsi untuk menangani klik detail dan integrasi Top 1 Rekomendasi
    const handleViewDetail = async (item) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                // Mengirim aksi ke backend agar parfum ini jadi prioritas rekomendasi
                await apiFetch('/api/recommendation/interact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        perfume_id: item.id,
                        action: 'view_detail'
                    })
                });
            }
        } catch (err) {
            console.error("Gagal mencatat interaksi:", err);
        } finally {
            // Navigasi ke halaman detail
            navigate(`/parfum/${item.id}`);
        }
    };

    const updateFilter = useCallback((key, value) => {
        setFilters(prev => {
            const stateKey = key === 'range' ? 'price_range' : key;
            const nextValue = prev[stateKey] === value ? null : value;
            return { ...prev, [stateKey]: nextValue };
        });
        setCurrentPage(0);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setCurrentPage(0);
    }, []);

    const hasActiveFilter = Object.values(filters).some(v => v !== null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', currentPage);

                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== null) params.set(key, value);
                });

                const result = await apiFetch(`/api/perfume?${params.toString()}`);

                if (!cancelled) {
                    if (result && result.data) {
                        setPerfumes(result.data);
                        setTotalPage(result.pages);
                    } else {
                        setPerfumes([]);
                        setTotalPage(0);
                    }
                }
            } catch (err) {
                if (cancelled) return;
                if (err.message === "Unauthorized") {
                    navigate("/login");
                } else {
                    setPerfumes([]);
                    setTotalPage(0);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [currentPage, filters, navigate]);

    return (
        <main className='mt-6 px-6 pb-20 bg-white'>
            <h1 className="text-4xl font-serif text-center mb-10">
                Temukan Parfum Impianmu
            </h1>

            <section className="max-w-7xl mx-auto border rounded-md p-6 shadow-sm">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-6'>
                    {["Accord", "gender", "situation", "Occasion"].map((cat) => (
                        <div key={cat}>
                            <p className='font-semibold mb-3'>{FILTER_LABELS[cat]}</p>
                            <div className='flex flex-wrap gap-2'>
                                {FILTER_OPTIONS[cat].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => updateFilter(cat, opt)}
                                        className={`px-4 py-1.5 rounded-full border text-xs transition-all ${filters[cat] === opt
                                                ? "bg-black text-white border-black"
                                                : "bg-transparent text-gray-600 hover:border-black"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="md:col-span-2 border-t pt-8">
                        <p className='font-semibold mb-4'>Budget (Price Range)</p>
                        <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                            {FILTER_OPTIONS.range.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => updateFilter("range", item.value)}
                                    className={`flex flex-col items-center p-3 rounded-md border transition-all ${filters.price_range === item.value
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 hover:border-black"
                                        }`}
                                >
                                    <span className="font-bold text-sm">{item.label}</span>
                                    <span className="text-[10px] mt-1 opacity-70">({item.info})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {hasActiveFilter && (
                    <button
                        onClick={resetFilters}
                        className='flex items-center gap-2 text-red-600 text-xs mb-8 hover:underline'
                    >
                        <X size={14} /> RESET SEMUA FILTER
                    </button>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-400">
                        <Loader2 size={32} className="animate-spin mr-3" />
                        <span>Memuat parfum…</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                        {perfumes.length > 0 ? (
                            perfumes.map((item) => (
                                <PerfumeCard
                                    key={item.id}
                                    item={item}
                                    onViewDetail={() => handleViewDetail(item)}
                                    hideLoveButton={true}
                                    hideKesesuaian={true}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                Tidak ada parfum yang cocok dengan filter yang dipilih.
                            </div>
                        )}
                    </div>
                )}

                {!loading && totalPage > 1 && (
                    <div className="mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </section>
        </main>
    );
}

export default CariParfumPage;