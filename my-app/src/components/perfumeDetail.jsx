import React from 'react'

function PerfumeDetail({item}) {

    if(!item) return <p className='text-black text-center'>loading...</p>;
  return (
    <>
    <div className='relative'>
          <img src={`http://localhost:5000/api/uploads/${item.image_file}`} alt="" className='overflow-hidden rounded-md object-cover h-[500px] w-full transition-all hover:scale-105'/>
        </div>

        {/* mid container */}
        <div className='col-span-2 grid grid-cols-3 gap-5 items-center'>
          <div className='flex flex-col gap-5 col-span-2'>
            <div className=''>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
                {item.brand}
              </p>
              <h2 className="text-4xl font-serif font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                {item.perfume}
              </h2>
            </div>
            <div className='grid grid-rows-4 gap-1 '>
              <div className="flex flex-col">
                  <span className="text-[12px] text-gray-400 uppercase font-bold tracking-tighter">
                  Accord
                  </span>
                  <span className="text-md text-gray-700 font-medium">
                  {item.Accord}
                  </span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[12px] text-gray-400 uppercase font-bold tracking-tighter">
                  Situasion
                  </span>
                  <span className="text-md text-gray-700 font-medium">
                  {item.situation}
                  </span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[12px] text-gray-400 uppercase font-bold tracking-tighter">
                  Occasion
                  </span>
                  <span className="text-md text-gray-700 font-medium">
                  {item.Occasion}
                  </span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[12px] text-gray-400 uppercase font-bold tracking-tighter">
                  Gender
                  </span>
                  <span className="text-md text-gray-700 font-medium">
                  {item.gender}
                  </span>
              </div>
            </div>
          </div>
          {/* right container */}
          <div className='flex flex-col'>
            <div>
              <p className=' text-sm text-gray-700 font-bold uppercase'>notes</p>
              <div className='flex flex-col gap-2 mt-2'>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-tighter">
                      Top : 
                    </p>
                    <span className="text-sm text-gray-700 font-medium max-w-full truncate">
                      {item.top_notes}
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-tighter w-auto">
                      Middle : 
                    </p>
                    <span className="text-sm text-gray-700 font-medium max-w-full truncate">
                      {item.mid_notes}
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-tighter w-auto">
                      Base : 
                    </p>
                    <span className="text-sm text-gray-700 font-medium max-w-full truncate">
                      {item.base_notes}
                    </span>
                </div>
              </div>
            </div>
              <div className='mt-10'>
                <p className="text-[10px] block text-gray-400 uppercase font-bold">
                Price
                </p>
                <p className="text-lg font-bold text-gray-900">
                Rp {Number(item.price).toLocaleString("id-ID")}
                </p>
              </div>
          </div>
        </div>
    </>
  )
}

export default PerfumeDetail