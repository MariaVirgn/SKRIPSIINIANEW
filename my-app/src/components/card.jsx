import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { Edit, Trash, Heart } from "lucide-react";
import Swal from "sweetalert2";

export default function PerfumeCard({
  item,
  index = 0,
  isEditingMode = false,
  canModify = false,
  onEdit,
  onDelete,
  wishlistIds = [],         
  setWishlistIds = () => {}, 
  anchor_id = null,         
  hideDetailButton = false, 
}) {

  // =========================
  // STATE LIKE & RATING
  // =========================
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(""); // State untuk menyimpan pilihan dropdown

  // Opsional: Ambil nilai rating yang sudah ada sebelumnya dari backend saat card dimuat
  useEffect(() => {
    if (item?.user_rating) {
      setRating(item.user_rating);
    }
  }, [item]);

  // =========================
  // CEK APAKAH SUDAH DI WISHLIST
  // =========================
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const result = await apiFetch("/api/wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(result)) {
          const isLiked = result.some(
            (wishlistItem) =>
              Number(wishlistItem.perfume_id) === Number(item.id)
          );
          setLiked(isLiked);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (item?.id && !canModify) {
      checkWishlist();
    }
  }, [item, canModify]);

  // =========================
  // FUNCTION HANDLE UPDATE RATING (UNTUK NDCG)
  // =========================
  const handleRatingChange = async (e) => {
    const selectedValue = e.target.value;
    setRating(selectedValue);

    if (!selectedValue) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Login diperlukan",
          text: "Silakan login untuk memberikan penilaian relevansi.",
          confirmButtonColor: "#111827",
        });
        setRating("");
        return;
      }

      // Kirim data rating ke backend untuk memicu kalkulasi ulang NDCG/AP
      await apiFetch(`/api/evaluasi/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          perfume_id: item.id,
          anchor_id: anchor_id, 
          rating_text: selectedValue,
          rating_score: Number(selectedValue) // Mengirimkan nilai angka konversi (0-4) ke backend
        }),
      });

      // Notifikasi sukses tanpa mengganggu user (Toast)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Penilaian disimpan, NDCG diperbarui!'
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan penilaian kesesuaian.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // =========================
  // FUNCTION ADD / REMOVE WISHLIST
  // =========================
  const handleAddToWishlist = async (perfume) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Login diperlukan",
          text: "Silakan login terlebih dahulu",
          confirmButtonColor: "#111827",
        });
        return;
      }

      if (liked) {
        const wishlist = await apiFetch("/api/wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const selectedItem = wishlist.find(
          (wishlistItem) =>
            Number(wishlistItem.perfume_id) === Number(perfume.id)
        );

        if (selectedItem) {
          await apiFetch(
            `/api/wishlist/${selectedItem.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setLiked(false);

          Swal.fire({
            icon: "success",
            title: "Wishlist dihapus",
            text: "Parfum berhasil dihapus dari wishlist",
            timer: 1500,
            showConfirmButton: false,
          });
        }
        return;
      }

      await apiFetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          perfume_id: perfume.id, 
          perfume: perfume.perfume,
          brand: perfume.brand,
          price: perfume.price,
          range: perfume.Range,
          size: perfume.size,
          accord: perfume.Accord,
          situation: perfume.situation,
          occasion: perfume.Occasion,
          anchor_id: anchor_id,   
        }),
      });

      setLiked(true);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Parfum ditambahkan ke wishlist",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui wishlist",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) {
      return "Rp -";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount).replace("Rp", "Rp ");
  };

  return (
    <div
      key={index}
      className={
        "min-w-[200px] min-h-[820px] group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 justify-between h-full flex flex-col ".concat(
          item.similarity ? "w-[400px]" : "w-full"
        )
      }
    >
      {/* GAMBAR PARFUM */}
      <div className="relative pb-2">
        <img
          src={`http://localhost:5000/api/uploads/${item.image_file}`}
          alt=""
          className="overflow-hidden rounded-md object-cover object-center h-[300px] w-full"
        />
      </div>

      {/* PERSENTASE MATCH */}
      {item && item.similarity && (
        <div className="absolute top-4 right-4">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
            {item.similarity}% Match
          </span>
        </div>
      )}

      {/* DETAIL PARFUM */}
      <div className="flex flex-col flex-1">
        {/* BRAND */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
          {item.brand}
        </p>

        {/* NAMA PARFUM */}
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight min-h-[56px]">
          {item.perfume}
        </h2>

        {/* INFO SINGKAT GRID */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-t border-gray-50 pt-4 text-xs">
          
          {/* ACCORD */}
          <div className="flex flex-col overflow-hidden col-span-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-0.5">
              Accord
            </span>
            <span className="text-gray-700 font-medium leading-relaxed line-clamp-2 break-words">
              {item.Accord || "-"}
            </span>
          </div>

          {/* MOOD */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-0.5">
              Mood
            </span>
            <span className="text-gray-700 font-medium break-words line-clamp-2">
              {item.Mood || "-"}
            </span>
          </div>

          {/* GENDER */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-0.5">
              Gender
            </span>
            <span className="text-gray-700 font-medium break-words capitalize">
              {item.gender || "-"}
            </span>
          </div>

          {/* SITUATION */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-0.5">
              Situation
            </span>
            <span className="text-gray-700 font-medium break-words line-clamp-2">
              {item.situation || "-"}
            </span>
          </div>

          {/* OCCASION */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-0.5">
              Occasion
            </span>
            <span className="text-gray-700 font-medium break-words line-clamp-2">
              {item.Occasion || "-"}
            </span>
          </div>

          {/* NOTES (TOP, MID, BASE) */}
          <div className="flex flex-col overflow-hidden col-span-2 border-t border-dashed border-gray-100 pt-2 mt-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">
              Fragrance Notes
            </span>
            <div className="grid grid-cols-3 gap-1 bg-gray-50 p-2 rounded-lg text-[11px]">
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase">Top</span>
                <span className="text-gray-700 font-medium line-clamp-2 break-words">{item.top_notes || item.top || "-"}</span>
              </div>
              <div className="border-x border-gray-200 px-1.5">
                <span className="block text-[9px] text-gray-400 font-bold uppercase">Mid</span>
                <span className="text-gray-700 font-medium line-clamp-2 break-words">{item.mid_notes || item.middle || "-"}</span>
              </div>
              <div className="pl-0.5">
                <span className="block text-[9px] text-gray-400 font-bold uppercase">Base</span>
                <span className="text-gray-700 font-medium line-clamp-2 break-words">{item.base_notes || item.base || "-"}</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              DROPDOWN EVALUASI KESESUAIAN (UNTUK MENGHITUNG NDCG)
             ======================================================== */}
          {!canModify && (
            <div className="flex flex-col col-span-2 border-t border-gray-100 pt-3 mt-1">
              <label className="text-[10px] text-blue-600 uppercase font-bold tracking-wider mb-1">
                Tingkat Kesesuaian Rekomendasi
              </label>
              <select
                value={rating}
                onChange={handleRatingChange}
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl p-2.5 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">-- Pilih Kesesuaian --</option>
                <option value="0">Sangat Tidak Sesuai</option>
                <option value="1">Tidak Sesuai</option>
                <option value="2">Netral</option>
                <option value="3">Sesuai</option>
                <option value="4">Sangat Sesuai</option>
              </select>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER CARD */}
      <div className="mt-6 border-t border-gray-50 pt-4">
        <div className="flex items-center justify-between mb-4">
          {/* PRICE */}
          <div>
            <span className="text-[10px] block text-gray-400 uppercase font-bold">
              Price
            </span>
            <p className="text-lg font-bold text-gray-900">
              {formatRupiah(item.price)}
            </p>
          </div>

          {/* BUTTON WISHLIST / LIKE */}
          {!canModify && (
            <button
              onClick={() => handleAddToWishlist(item)}
              className={`p-2.5 rounded-xl border transition-all duration-300 active:scale-90 ${
                liked
                  ? "bg-red-50 text-red-500 border-red-200"
                  : "bg-gray-50 text-gray-400 border-gray-100 hover:text-red-500 hover:bg-red-50"
              }`}
              title="Tambah ke Wishlist"
            >
              <Heart size={24} fill={liked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* BUTTON ACTION */}
        {canModify ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              className="w-full flex gap-2 justify-center items-center bg-blue-600 hover:bg-blue-800 transition-all duration-75 font-bold capitalize text-white text-sm py-3 rounded-md"
              onClick={() => onEdit(item)}
            >
              <Edit width={20} /> edit
            </button>

            <button
              className="w-full flex gap-2 justify-center items-center bg-red-600 hover:bg-red-800 font-bold capitalize text-white text-sm py-3 rounded-md"
              onClick={() => onDelete(item.id)}
            >
              <Trash width={20} /> delete
            </button>
          </div>
        ) : (
          !hideDetailButton && (
            <Link
              to={`/parfum/${item.id}`}
              className="block w-full bg-black text-white text-center py-3 rounded-md text-sm font-bold hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              Lihat Detail
            </Link>
          )
        )}
      </div>
    </div>
  );
}