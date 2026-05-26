import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setIsLoading(true);

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (data) {
        alert(data.msg || "Registrasi Berhasil!");
        navigate("/login");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-10">
      {/* CARD CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Buat Akun
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Daftar untuk mulai menjelajahi aroma favoritmu
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input Nama */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-5 py-3.5 bg-gray-50 border text-black border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full px-5 py-3.5 text-black bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-3.5 text-black bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button Register */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-95 shadow-lg
              ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-black/20"}`}
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-400">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-black bg-transparent font-bold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
