import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setIsLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        if(data.user.role === "admin"){
          navigate("/admin/perfumes")
        }
        if(data.user.role === "customer"){
          navigate('/')
        }
      } else {
        alert(data.msg || "Email atau Password salah");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi :",err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      {/* CARD CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Selamat Datang
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Masuk untuk menemukan parfum impianmu
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-95 shadow-lg
              ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-black/20"}`}
          >
            {isLoading ? "Sedang Masuk..." : "Masuk Sekarang"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-400">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-black bg-transparent font-bold hover:underline"
            >
              Daftar Gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
