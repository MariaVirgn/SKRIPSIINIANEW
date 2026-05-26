import Vidio from "../../assets/vidio.mp4";
import Name from "../../components/name.jsx";

const Side1 = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Background dengan Overlay Gradien */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src={Vidio} type="video/mp4" />
        </video>
        {/* Overlay ganda: Gelap merata + Gradien bawah untuk kedalaman */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>

      {/* Floating Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Animasi Masuk untuk Komponen Name */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <Name />

          <p className="mt-4 text-white/70 text-lg md:text-xl font-light tracking-[0.2em] uppercase max-w-2xl mx-auto">
            Temukan Aroma yang Menjelaskan Jati Dirimu
          </p>

        </div>
      </div>

      {/* Indikator Scroll (Opsional tapi Manis) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50 animate-bounce">
        <span className="text-[10px] text-white uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Side1;
