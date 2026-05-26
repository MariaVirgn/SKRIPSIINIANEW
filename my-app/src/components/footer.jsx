import Logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt="Parfume Match Logo"
                className="h-10 w-auto grayscale hover:grayscale-0 transition-all duration-500"
              />
              <span className="text-xl font-serif font-bold tracking-tighter text-black">
                Parfume Match
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
              Cari Karakter Parfummu
            </p>
          </div>

          {/* Quick Links / Navigation (Optional but makes it look Pro) */}
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">
              Panduan
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Tentang Kami
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Privasi
            </a>
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-sm font-serif italic text-gray-800">
              "Find Your Perfect Fragrance"
            </p>
            <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Parfume Match. All rights
              reserved.
            </p>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-10 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </footer>
  );
}
