import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data User dan Wishlist secara bersamaan
    Promise.all([apiFetch("/api/profile"), apiFetch("/api/wishlist")])
      .then(([userData, wishlistData]) => {
        setUser(userData);
        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = (id) => {
    try{
      const token = localStorage.getItem("token");
      if(!token) {
        alert("Expired Token");
        navigate("/login");
      }

      fetch(`http://localhost:5000/api/wishlist/${id}`,{
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then(() => {
        getWishlistData();
      })
      
    }catch(e){
      console.log(e.message);
    }
  }

  const getWishlistData = () => {
    apiFetch(`/api/wishlist`)
    .then((result) => {
        setWishlist(Array.isArray(result) ? result : []);
    })
    .catch(e => {
      alert(e.error);
    })
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <p className="text-gray-400 font-medium">Memuat Profil...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="h-24 w-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                  <span className="text-4xl font-serif font-bold text-gray-800">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  Keluar Akun
                </button>
              </div>
            </div>
          </div>

          {/* WISHLIST SECTION */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  Wishlist Saya
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                {wishlist.length} Item
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">Belum ada parfum yang disimpan.</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-black font-bold text-sm mt-2 bg-transparent hover:underline"
                >
                  Cari Parfum Sekarang &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center font-serif text-xl font-bold text-gray-400 group-hover:bg-white transition-colors">
                      {item.brand?.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {item.brand}
                      </p>
                      <h3 className="font-bold text-gray-800 leading-tight">
                        {item.perfume}
                      </h3>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button 
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors" 
                    onClick={() => handleDelete(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Section (Navigasi kembali) */}
          <div className="mt-10 p-6 bg-gray-900 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-gray-200">
            <div>
              <p className="font-bold text-lg">Cari Parfum Lain?</p>
              <p className="text-gray-400 text-xs">
                Temukan aroma yang sesuai dengan suasana hatimu.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
            >
              Mulai Cari &rarr;
            </button>
          </div>
        </div>
      </div>
  );
}