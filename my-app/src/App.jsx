import Footer from "./components/footer.jsx";
import Navbar from "./components/navbar.jsx";
import AppRoutes from "./routes/Approutes.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  // 1. Auto Scroll ke atas setiap kali pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-white min-h-screen flex flex-col" id="top">
        <AppRoutes/>
    </div>
  );
}

export default App;