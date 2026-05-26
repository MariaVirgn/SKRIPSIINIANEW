export default function KonsentrasiCard({
  title,
  persen1,
  persen2,
  description,
}) {
  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 flex flex-col gap-5">
      {/* HEADER TITLE */}
      {title && (
        <h2 className="text-xl font-bold text-gray-900 tracking-tight border-b border-gray-50 pb-3">
          {title}
        </h2>
      )}

      {/* STATS SECTION */}
      <div className="flex items-center gap-8 py-2">
        {/* Konsentrasi */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            Konsentrasi
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-black text-gray-900">
              {persen1}
            </span>
            <span className="text-lg font-bold text-gray-400">%</span>
          </div>
        </div>

        {/* Divider Vertical */}
        <div className="h-10 w-px bg-gray-200"></div>

        {/* Daya Tahan */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Daya Tahan
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-black text-gray-900">
              {persen2}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase">
              Jam
            </span>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
          {description}
        </p>
      )}
    </div>
  );
}
