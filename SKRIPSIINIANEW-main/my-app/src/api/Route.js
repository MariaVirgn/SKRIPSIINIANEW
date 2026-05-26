export async function Getrekomendasi(title) {
  const res = await fetch("http://localhost:5000/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }), // ← kirim title ke Flask
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json(); // JSON hasil dari Flask
}
