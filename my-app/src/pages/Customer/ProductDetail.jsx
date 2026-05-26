import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import PerfumeDetail from '../../components/perfumeDetail';
import PerfumeCard from '../../components/card';
import UserLayout from './UserLayout';

function ProductDetail() {
  const {id} = useParams();
  const [item, setItem] = useState();
  const [recommendation, setRecommendation] = useState();

  useEffect(() => {
    setRecommendation(null);
    apiFetch(`/api/perfume/${id}`, {
      method: "GET",
    })
    .then((result) => {
      console.log(result);
      setItem(result);
    })
    .catch((e) => {
      console.log(e);
    })
  },[id])

  useEffect(() => {
    const getRecommendation = async () => {
      if (!item) return;

      const payload = {
        Accord: item.Accord || '',
        situation: item.situation || '',
        Occasion: item.Occasion || '',
        gender: item.gender || '',
        size: Number(item.size) || 0,
        Range: item.Range || '',
        selected_id: item.id
      };

      try {
        const result = await apiFetch('/api/recommend', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setRecommendation(Array.isArray(result) ? result : []);
      } catch (err) {
        console.log(err);
      }
    };

    if (item && recommendation == null) {
      getRecommendation();
    }
  }, [item, recommendation]);

  
  return (
      <main className='px-6 font-serif'>
        <section className='grid grid-cols-3 border-[0.5px] border-gray-200 rounded-md p-5 mt-10 gap-6'>
          {/* left container */}
          <PerfumeDetail item={item}/>
        </section>

        <section className='mt-10'>
          <h2 className='text-gray-700 text-3xl font-bold'>Rekomendasi produk serupa</h2>
          <div className='w-full overflow-x-auto'>
            <div className='flex gap-5 w-auto justify-start items-center'>
              {
                /* UPDATE: Variabel map diubah menjadi recItem dan ditambah key/anchor_id */
                recommendation ? recommendation.map((recItem, idx) => {
                  return (
                  <div className='relative w-[500px] h-auto' key={idx}>
                    <PerfumeCard 
                        item={recItem} 
                        index={idx}
                        anchor_id={item.id} /* Lempar ID halaman asal ke Card */
                        hideDetailButton={true} /* 👈 UPDATE: Sembunyikan tombol lihat detail khusus di area ini */
                    />
                  </div>
                    )
                }) : (
                  <p className='text-gray-700'>loading...</p>
                )
              }
            </div>
          </div>
        </section>
      </main>
  )
}

export default ProductDetail;