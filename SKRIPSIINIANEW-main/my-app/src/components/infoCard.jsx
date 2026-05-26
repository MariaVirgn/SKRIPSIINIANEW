export default function InfoCard({ title, image, description }) {
  return (
    <div className="group w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
      
      {/* IMAGE CONTAINER */}
      <div className="relative h-48 w-full overflow-hidden">
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        )}
        {/* Overlay tipis agar teks lebih menyatu */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-[2px] bg-blue-600"></span>
          {title && (
            <h2 className="text-xl font-serif font-bold text-gray-800 tracking-tight">
              {title}
            </h2>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
            {description}
          </p>
        )}

        {/* Aksesori Dekoratif di bawah */}
        <div className="mt-2 pt-4 border-t border-gray-50 flex justify-end">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-blue-500 transition-colors">
            Fragrance Accord
          </span>
        </div>
      </div>
    </div>
  );
}