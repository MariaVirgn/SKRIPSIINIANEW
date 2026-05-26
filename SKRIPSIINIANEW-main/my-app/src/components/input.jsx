import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

import search from "../assets/search.png";

export default function PlaceholdersAndVanishInputDemo() {
  const navigate = useNavigate();
  const [dropdowns, setDropdowns] = useState(null);
  const [accord, setAccord] = useState("");
  const [situation, setSituation] = useState("");
  const [occasion, setOccasion] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState(0);
  const [range, setRange] = useState("");

  useEffect(() => {
    // GUNAKAN fungsi apiFetch, jangan fetch standar
    const getDropdownData = async () => {
      try {
        const data = await apiFetch("/api/dropdowns"); // Sesuai prefix blueprint
        console.log("Data Dropdown Berhasil:", data);
        setDropdowns(data);
      } catch (err) {
        console.error("Gagal ambil dropdown:", err);
      }
    };

    getDropdownData();
  }, []);

const handleSubmit = async () => {
    const payload = {
      Accord: accord,
      situation: situation,
      Occasion: occasion,
      gender: gender,
      size: Number(size), // Pastikan size adalah angka
      Range: range,
    };

    try {
      const data = await apiFetch("/api/recommend", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Navigate ke hasil
      navigate("/result", { state: { results: data, filters: payload } });
    } catch (err) {
      alert("Gagal mendapatkan rekomendasi");
    }
  };
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-4 mt-5 ">
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-timesNewRoman text-center text-black">
          Temukan Parfum Impianmu
        </h1>

        <h2 className="text-lg sm:text-xl md:text-2xl font-normal italic text-center mt-4 text-black opacity-60">
          "Isi preferensi dibawa ini untuk mendapatkan rekomendasi perfum yang
          sempurna untukmu"
        </h2>
      </div>
      <div className="bg-white w-[75rem] mt-5  h-[60%] shadow-lg rounded-lg overflow-hidden px-14 pt-10 ">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="accord"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Jenis Aroma (Accord) - Pilih Minimal 1
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setAccord(e.target.value)}
            >
              <option value="">Pilih Aroma</option>
              {dropdowns?.Accord?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="situation"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Situation (Waktu Penggunaan)
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSituation(e.target.value)}
            >
              <option value="">Pilih situasi</option>
              {dropdowns?.situation?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="occasion"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Occasion (Kesempatan)
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option value="">Pilih kesempatan</option>
              {dropdowns?.Occasion?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="priceRange"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Rentang Harga
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="">Pilih rentang harga</option>
              {dropdowns?.Range?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="ukuran"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Ukuran Parfum
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value="">Pilih ukuran</option>
              {dropdowns?.size?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="gender"
              className="font-timesNewRoman font-medium text-xl text-black"
            >
              Gender
            </label>

            <select
              className="w-full bg-white text-black border border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Pilih gender</option>
              {dropdowns?.gender?.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full mt-10 ">
          <button
            onClick={handleSubmit}
            className="w-full flex  items-center justify-center bg-white border border-black text-black p-3 gap-2 rounded-lg"
          >
            <img src={search} alt="Search" className="h-5 w-auto" />
            <span>Find My Perfume</span>
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /* <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        value={title}
        onSubmit={onSubmit}
      />
      <p className="text-red-600 text-center font-thin font-sans italic mt-1">
        Contoh keyword : Spider-Man 3
      </p> */
}
