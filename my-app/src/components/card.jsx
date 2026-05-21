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
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (item?.user_rating) {
      setRating(item.user_rating);
    }
  }, [item]);

  // =========================
  // CEK WISHLIST
  // =========================
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const result = await apiFetch("/api/wishlist", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(result)) {
          const isLiked = result.some(
            (wishlistItem) => Number(wishlistItem.perfume_id) === Number(item.id)
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
  // HANDLE UPDATE RATING
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
          rating_score: Number(selectedValue)
        }),
      });

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
  // ADD / REMOVE WISHLIST
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
          headers: { Authorization: `Bearer ${token}` },
        });

        const selectedItem = wishlist.find(
          (wishlistItem) => Number(wishlistItem.perfume_id) === Number(perfume.id)
        );

        if (selectedItem) {
          await apiFetch(`/api/wishlist/${selectedItem.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          setLiked(false);
          Swal.fire({
            icon: "success",
            title: "Wishlist dihapus",
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
    }
  };

  const formatRupiah = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount).replace("Rp", "Rp ");
  };

  return (
    <div
      key={index}
      className={`group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full ${
        item.similarity ? "w-[340px]" : "w-full"
      }`}
    >
      {/* TINGKAT MATCH */}
      {item?.similarity && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            {item.similarity}% Match
          </span>
        </div>
      )}

      {/* HEADER: GAMBAR & IDENTITAS */}
      <div className="flex flex-col gap-2">
        {/* GAMBAR */}
        <div className="relative overflow-hidden rounded-lg bg-gray-50">
          <img
            src={`http://localhost:5000/api/uploads/${item.image_file}`}
            alt=""
            className="object-cover object-center h-[200px] w-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* BRAND & NAMA */}
        <div>
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
            {item.brand}
          </p>
          <h2 className="text-lg font-serif font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.perfume}
          </h2>
        </div>
      </div>

      {/* METADATA ATRIBUT (Dibuat Grid Padat) */}
      <div className="mt-2 pt-2 border-t border-gray-50 text-[11px] flex flex-col gap-1.5 flex-1">
        
        {/* Accord (Diberi ruang 2 baris kebawah agar teks panjang terlihat utuh) */}
        <div className="bg-gray-50/50 p-1.5 rounded-md">
          <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight">Accord</span>
          <span className="text-gray-700 font-medium line-clamp-2 break-words leading-tight">
            {item.Accord || "-"}
          </span>
        </div>

        {/* Atribut Side-by-Side */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-gray-50/50 p-1.5 rounded-md">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight">Mood</span>
            <span className="text-gray-700 font-medium line-clamp-1">{item.Mood || "-"}</span>
          </div>
          <div className="bg-gray-50/50 p-1.5 rounded-md">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight">Gender</span>
            <span className="text-gray-700 font-medium capitalize line-clamp-1">{item.gender || "-"}</span>
          </div>
          <div className="bg-gray-50/50 p-1.5 rounded-md">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight">Situation</span>
            <span className="text-gray-700 font-medium line-clamp-1">{item.situation || "-"}</span>
          </div>
          <div className="bg-gray-50/50 p-1.5 rounded-md">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight">Occasion</span>
            <span className="text-gray-700 font-medium line-clamp-1">{item.Occasion || "-"}</span>
          </div>
        </div>

        {/* Fragrance Notes (DIPERBAIKI: Menggunakan break-words dan whitespace-normal agar otomatis buat baris baru) */}
        <div className="border border-dashed border-gray-200 p-1.5 rounded-md text-[10px]">
          <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tight mb-0.5">Notes (T/M/B)</span>
          <p className="text-gray-600 font-medium break-words whitespace-normal leading-relaxed">
            <span className="text-gray-900 font-semibold">T:</span> {item.top_notes || item.top || "-"} •{" "}
            <span className="text-gray-900 font-semibold">M:</span> {item.mid_notes || item.middle || "-"} •{" "}
            <span className="text-gray-900 font-semibold">B:</span> {item.base_notes || item.base || "-"}
          </p>
        </div>

        {/* EVALUASI DROPDOWN */}
        {!canModify && (
          <div className="mt-1 pt-1.5 border-t border-gray-100">
            <label className="block text-[9px] text-blue-600 uppercase font-bold tracking-tight mb-1">
              Ksesuaian Rekomendasi (NDCG)
            </label>
            <select
              value={rating}
              onChange={handleRatingChange}
              className="w-full bg-blue-50/40 border border-blue-100 rounded-lg p-1.5 text-[11px] text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
            >
              <option value="">-- Pilih Kesesuaian --</option>
              <option value="0">Sangat Tidak Sesuai (0)</option>
              <option value="1">Tidak Sesuai (1)</option>
              <option value="2">Netral (2)</option>
              <option value="3">Sesuai (3)</option>
              <option value="4">Sangat Sesuai (4)</option>
            </select>
          </div>
        )}
      </div>

      {/* FOOTER: HARGA & TOMBOL AKSI */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] block text-gray-400 uppercase font-bold">Harga</span>
            <p className="text-base font-bold text-gray-900">{formatRupiah(item.price)}</p>
          </div>

          {/* WISHLIST BUTTON */}
          {!canModify && (
            <button
              onClick={() => handleAddToWishlist(item)}
              className={`p-2 rounded-lg border transition-all active:scale-90 ${
                liked
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-gray-50 text-gray-400 border-gray-100 hover:text-red-500"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* TOMBOL UTAMA */}
        {canModify ? (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              className="flex gap-1 justify-center items-center bg-blue-600 hover:bg-blue-700 font-semibold text-white text-xs py-2 rounded"
              onClick={() => onEdit(item)}
            >
              <Edit width={14} /> Edit
            </button>
            <button
              className="flex gap-1 justify-center items-center bg-red-600 hover:bg-red-700 font-semibold text-white text-xs py-2 rounded"
              onClick={() => onDelete(item.id)}
            >
              <Trash width={14} /> Delete
            </button>
          </div>
        ) : (
          !hideDetailButton && (
            <Link
              to={`/parfum/${item.id}`}
              className="block w-full bg-black text-white text-center py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              Lihat Detail
            </Link>
          )
        )}
      </div>
    </div>
  );
}