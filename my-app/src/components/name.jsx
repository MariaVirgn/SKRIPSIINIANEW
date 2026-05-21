import { Link } from "react-router-dom"; // Import Link dari react-router-dom

export default function Name() {
  return (
    <div className="flex flex-col items-center text-center px-4 max-w-5xl animate-in fade-in zoom-in duration-1000">
      {/* Small Subtitle / Kicker */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-8 h-[1px] bg-white/50"></div>
        <span className="text-white text-sm md:text-base tracking-[0.4em] font-light uppercase">
          Experience Excellence
        </span>
        <div className="w-8 h-[1px] bg-white/50"></div>
      </div>

      {/* Main Title */}
      <div className="relative">
        <h1 className="text-white text-[80px] md:text-[140px] font-serif leading-none tracking-tight">
          SELAMAT DATANG
        </h1>
        <div className="flex justify-center -mt-4 md:-mt-6 mb-4">
          <span className="text-white italic font-serif text-2xl md:text-4xl low-opacity-50">
            di
          </span>
        </div>
      </div>

      {/* Brand Name / App Name */}
      <div className="border-y border-white/20 py-4 mb-8">
        <h2 className="text-white text-3xl md:text-6xl tracking-[0.15em] font-serif uppercase">
          Rekomendasi Parfum
        </h2>
      </div>

      {/* Quote Section */}
      <div className="max-w-xl mb-12">
        <p className="text-white/80 text-lg md:text-2xl font-light italic leading-relaxed">
          "Parfum adalah sensasi ingatan yang paling intens."
        </p>
      </div>

      {/* Modern Button - SUDAH DIUBAH */}
      <div className="flex justify-center">
        <Link
          to="/parfum" // Mengubah href="#list" menjadi to="/parfum"
          className="group relative px-10 py-4 bg-white text-black font-bold tracking-widest text-sm
            overflow-hidden transition-all duration-500 rounded-none
            hover:bg-black hover:text-white hover:ring-1 hover:ring-white"
        >
          <span className="relative z-10">Temukan Aroma Anda Sekarang</span>
          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </Link>
      </div>
    </div>
  );
}