import InfoCard from "../../components/infoCard.jsx";
import KonsentrasiCard from "../../components/konstrasi.jsx";

// Import assets (asumsi path sudah benar)
import Apple from "../../assets/apel.jpeg";
import api from "../../assets/api.jpeg";
import Bintang from "../../assets/bintang.jpeg";
import Bunga from "../../assets/bunga.jpeg";
import Daun from "../../assets/daun.jpeg";
import Pohon from "../../assets/pohon.jpeg";
import Semangka from "../../assets/semangka.jpeg";

export default function Side2() {
  // Data Accord untuk efisiensi kode
  const accords = [
    {
      image: Semangka,
      title: "Citrus",
      desc: "Aroma segar dari buah-buahan seperti jeruk dan lemon. Memberikan kesan energik.",
    },
    {
      image: Apple,
      title: "Fruity",
      desc: "Aroma manis dari buah-buahan non-citrus seperti apel atau beri. Memberikan kesan menyenangkan.",
    },
    {
      image: Bunga,
      title: "Floral",
      desc: "Aroma lembut dari bunga-bungaan seperti mawar atau melati. Memberikan kesan romantis.",
    },
    {
      image: api,
      title: "Oriental",
      desc: "Aroma rempah yang kaya dan hangat. Memberikan kesan misterius dan sensual.",
    },
    {
      image: Pohon,
      title: "Woody",
      desc: "Aroma alami dari kayu-kayuan seperti cendana atau cedar. Memberikan kesan hangat dan *grounded*.",
    },
    {
      image: Daun,
      title: "Fresh",
      desc: "Aroma bersih seperti daun hijau, udara laut, atau air bersih. Memberikan kesan segar.",
    },
    {
      image: Bintang,
      title: "Sweet",
      desc: "Aroma manis *edible* seperti vanila, karamel, atau cokelat (Gourmand).",
    },
  ];

  const notes = [
    {
      num: "1",
      title: "Top Notes",
      time: "5 - 15 menit",
      desc: "Aroma pertama yang tercium saat parfum disemprotkan. Biasanya ringan dan segar.",
    },
    {
      num: "2",
      title: "Middle Notes",
      time: "15 - 60 menit",
      desc: "Inti dari parfum yang muncul setelah *top notes* menguap. Dikenal juga sebagai *heart notes*.",
    },
    {
      num: "3",
      title: "Base Notes",
      time: "1 - 8+ jam",
      desc: "Fondasi parfum yang memberikan kedalaman dan daya tahan. Aroma yang paling lama tertinggal di kulit.",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 pt-16 px-4 sm:px-6 md:px-10 py-12">
        {/* === HERO HEADER === */}
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold leading-tight">
            Panduan Parfum
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light italic mt-6 text-gray-600">
            "Pelajari seni aroma: Jelajahi berbagai jenis wewangian,
            konsentrasi, dan struktur unik di setiap botolnya."
          </p>
          <div className="w-24 h-1 bg-black mx-auto mt-10 rounded-full"></div>
        </div>

        {/* === SECTION 1: ACCORDS === */}
        <div className="w-full mt-10">
          <div className="flex items-center gap-4 mb-12 justify-centermd:justify-start">
            <h2 className="text-4xl font-serif font-bold">
              Jenis Aroma (Accord)
            </h2>
            <div className="flex-grow h-px bg-gray-200 hidden md:block"></div>
          </div>

          {/* Grid responsive: 1 kol di mobile, 3 kol di desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {accords.map((accord, index) => (
              <div
                key={index}
                className="transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg rounded-3xl"
              >
                <InfoCard
                  image={accord.image}
                  title={accord.title}
                  description={accord.desc}
                />
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION 2: KONSENTRASI === */}
        <div className="w-full mt-16 bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
            <div className="flex-grow h-px bg-gray-200 hidden md:block"></div>
            <h2 className="text-4xl font-serif font-bold text-center">
              Konsentrasi Parfum
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <KonsentrasiCard
              title={"Extrait de Parfum"}
              persen1="20-40"
              persen2="8-12+"
              description={
                "Konsentrasi tertinggi dengan daya tahan paling lama. Aroma sangat intens, cocok untuk acara istimewa."
              }
            />
            <KonsentrasiCard
              title={"Eau de Parfum (EDP)"}
              persen1="15-20"
              persen2="6-8"
              description={
                "Pilihan paling populer. Seimbang antara intensitas dan daya tahan, ideal untuk penggunaan sehari-hari."
              }
            />
            <KonsentrasiCard
              title={"Eau de Toilette (EDT)"}
              persen1="5-15"
              persen2="4-6"
              description={
                "Lebih ringan dan segar. Cocok disemprotkan di pagi hari atau cuaca hangat, perlu *re-spray* setelah beberapa jam."
              }
            />
            <KonsentrasiCard
              title={"Eau de Cologne (EDC)"}
              persen1="2-5"
              persen2="2-3"
              description={
                "Sangat ringan dengan konsentrasi rendah. Memberikan kesegaran instan, namun aromanya cepat memudar."
              }
            />
          </div>
        </div>

        {/* === SECTION 3: STRUKTUR (Timeline) === */}
        <div className="w-full mt-16 max-w-5xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">
            Struktur Piramida Aroma
          </h2>

          {/* CONTAINER TIMELINE - w-full dan max-w agar responsive */}
          <div className="w-full bg-white shadow-xl rounded-3xl border border-gray-100 p-8 md:p-10 transition-shadow hover:shadow-2xl">
            {notes.map((note, index) => (
              <div key={note.num}>
                <div className="flex gap-6 items-start py-6 group">
                  {/* Lingkaran Angka */}
                  <div className="flex-shrink-0 bg-black group-hover:bg-blue-600 transition-colors rounded-full w-14 h-14 flex items-center justify-center shadow-md">
                    <p className="text-white text-2xl font-bold font-serif">
                      {note.num}
                    </p>
                  </div>

                  {/* Konten Teks */}
                  <div className="flex-grow flex flex-col gap-2 pt-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1 sm:gap-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {note.title}
                      </h3>
                      <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 sm:text-right w-fit">
                        {note.time}
                      </span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed mt-1">
                      {note.desc}
                    </p>
                  </div>
                </div>

                {/* Garis Penghubung (kecuali yang terakhir) */}
                {index !== notes.length - 1 && (
                  <div className="w-[3px] h-12 bg-gray-200 ml-7 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
