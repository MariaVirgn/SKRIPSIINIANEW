import { useState } from "react";
import Logo from "../assets/logo.png";
import Logout from "../assets/logout.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white opacity-90 flex items-center px-6 py-4 shadow">
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-2 text-xl font-timesNewRoman"
      >
        <img src={Logo} alt="Parfume Match Logo" className="h-10 w-auto " />
        <span className="bg-transparent text-black ">Parfume Match</span>
      </a>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-20 text-lg ml-auto font-timesNewRoman text-black">
        <li>
          <a
            href="/"
            className="hover:underline bg-transparent text-black "
          >
            Beranda
          </a>
        </li>
        <li>
          <a
            href="/#recomend"
            className="hover:underline bg-transparent text-black "
          >
            Panduan
          </a>
        </li>
        <li>
          <a
            href="/parfum"
            className="hover:underline bg-transparent text-black "
          >
            Rekomendasi
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className="hover:underline bg-transparent text-black "
          >
            Profil
          </a>
        </li>
        <li>
          <a
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent text-black underline cursor-pointer"
          >
            <img src={Logout} alt="Logout" className="h-5 w-auto" />
            <span>Keluar</span>
          </a>
        </li>
      </ul>

      {/* Mobile Toggle Button */}
      <button
        className="ml-auto md:hidden text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden text-black">
          <ul className="flex flex-col items-center gap-6 py-6 text-lg">
            <li>
              <a href="/#recomend" onClick={() => setIsOpen(false)}>Panduan</a>
            </li>
            <li>
              <a href="/parfum" onClick={() => setIsOpen(false)}>Rekomendasi</a>
            </li>
            <li>
              <a href="/profile" onClick={() => setIsOpen(false)}>Profile</a>
            </li>
            <li>
              <a onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                <img src={Logout} alt="Logout" className="h-5 w-auto" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;