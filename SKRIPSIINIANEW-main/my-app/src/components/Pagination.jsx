import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";

function Pagination({
    currentPage, // Index halaman saat ini (dimulai dari 0)
    totalPage,
    setCurrentPage,
}) {

    // =========================
    // JUMLAH PAGE PER GROUP
    // =========================
    const pageSize = 5;

    // =========================
    // HITUNG PAGE AWAL (Zero-based)
    // =========================
    // Menggunakan Math.floor(currentPage / pageSize) memastikan 
    // bahwa jika currentPage adalah 0-4, startPage akan tetap 0.
    const startPage = Math.floor(currentPage / pageSize) * pageSize;

    // =========================
    // HITUNG PAGE AKHIR
    // =========================
    // Menentukan batas akhir angka yang ditampilkan dalam satu grup.
    const endPage = Math.min(startPage + pageSize - 1, totalPage - 1);

    // =========================
    // ARRAY PAGE
    // =========================
    const pages = Array.from(
        { length: Math.max(0, endPage - startPage + 1) },
        (_, i) => startPage + i
    );

    return (
        <div
            className="
        flex
        justify-center
        items-center
        gap-2
        mt-10
        flex-wrap
      "
        >

            {/* =========================
          BUTTON PREVIOUS
      ========================== */}
            <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-xl
          border
          transition-all
          duration-300

          ${currentPage === 0
                        ? `
                bg-gray-100
                text-gray-300
                border-gray-200
                cursor-not-allowed
              `
                        : `
                bg-white
                text-black
                border-gray-300
                hover:bg-black
                hover:text-white
              `
                    }
        `}
            >
                <ChevronLeft size={18} />
            </button>

            {/* =========================
          BUTTON GROUP SEBELUMNYA
      ========================== */}
            {
                startPage > 0 && (
                    <button
                        onClick={() =>
                            setCurrentPage(startPage - 1)
                        }
                        className="
              flex
              items-center
              justify-center
              w-11
              h-11
              rounded-xl
              border
              border-gray-300
              bg-white
              text-black
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
            "
                    >
                        <MoreHorizontal size={16} />
                    </button>
                )
            }

            {/* =========================
          BUTTON PAGE NUMBER
      ========================== */}
            {
                pages.map((p) => {
                    const isActive = p === currentPage;

                    return (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`
                w-11
                h-11
                rounded-xl
                text-sm
                font-semibold
                border
                transition-all
                duration-300

                ${isActive
                                    ? `
                      bg-black
                      text-white
                      border-black
                      shadow-md
                    `
                                    : `
                      bg-white
                      text-black
                      border-gray-300

                      hover:bg-black
                      hover:text-white
                    `
                                }
              `}
                        >
                            {p}
                        </button>
                    );
                })
            }

            {/* =========================
          BUTTON GROUP BERIKUTNYA
      ========================== */}
            {
                endPage < totalPage - 1 && (
                    <button
                        onClick={() =>
                            setCurrentPage(endPage + 1)
                        }
                        className="
              flex
              items-center
              justify-center
              w-11
              h-11
              rounded-xl
              border
              border-gray-300
              bg-white
              text-black
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
            "
                    >
                        <MoreHorizontal size={16} />
                    </button>
                )
            }

            {/* =========================
          BUTTON NEXT
      ========================== */}
            <button
                disabled={currentPage >= totalPage - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-xl
          border
          transition-all
          duration-300

          ${currentPage >= totalPage - 1
                        ? `
                bg-gray-100
                text-gray-300
                border-gray-200
                cursor-not-allowed
              `
                        : `
                bg-white
                text-black
                border-gray-300
                hover:bg-black
                hover:text-white
              `
                    }
        `}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}

export default Pagination;