import { useNavigate } from "react-router-dom";

export default function Sidebar({ active }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="col-span-1 w-full h-screen bg-[#374957] text-white p-5 flex flex-col">
      <h1 className="text-xl font-semibold mb-8">Admin Panel</h1>

      <button
        onClick={() => navigate("/admin/perfumes")}
        className={`mb-3 text-left hover:opacity-80 text-black ${active === "products" ? "opacity-80" : ""}`}>
        Perfumes
      </button>
      <button
        onClick={() => navigate("/admin/evaluation")}
        className={`mb-3 text-left hover:opacity-80 text-black ${active === "evaluation" ? "opacity-80" : ""}`}>
        Evaluation
      </button>
      <button
        onClick={() => navigate("/admin/user")}
        className={`mb-3 text-left hover:opacity-80 text-black ${active === "user" ? "opacity-80" : ""}`}>
        Users
      </button>

      <div className="mt-auto">
        <button className="text-sm opacity-70 hover:opacity-100 text-black" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}