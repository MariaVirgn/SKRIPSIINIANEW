import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import PerfumeCard from '../../components/card'
import { apiFetch } from '../../utils/api';
import ProductModal from '../../components/ProductModal';
import PopupConfirmation from '../../components/PopupConfirmation';
import Pagination from '../../components/pagination';
import { Plus } from 'lucide-react';

function ProductManagement() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [totalPage, setTotalPage] = useState();
  
  function getData (){
    apiFetch(`/api/perfume?page=${currentPage}`, {
      methods:"GET"
    }).then((result) => {
      setItems(result.data);
      setTotalPage(result.pages);
      setCurrentPage(result.current_page);
    })
  }

  useEffect(() => {
    getData();
  },[currentPage])

  const onSubmit = (obj, isEdit) => {
    const data = objectToFormData(obj);

    if(isEdit){
      fetch(`http://localhost:5000/api/admin/perfume/${data.get("id")}`, {
        headers:{
          Authorization: `Bearer ${localStorage.token}`
        },
        method:"PUT",
        body:data
      }).then(result => {
        return result.json();
      }).then(result => {
        alert(result.message);
        getData();
        onClose();
      }) 
      .catch((response) => {
        alert(response.msg);
      })
    } else {
      fetch(`http://localhost:5000/api/admin/perfume`, {
        method:"POST",
        headers: {
          Authorization : `Bearer ${localStorage.token}`
        },
        body:data
      }).then(result => {
        return result.json();
      }).then(result => {
        alert(result.message);
        getData();
        onClose();
      }).catch((response) => {
        alert(response.msg);
        onClose();
      })
    }
  }

  const onEdit = (item) => {
    setIsModalOpen(true);
    setModalData(item);
  }

  const onDelete = () => {
    const token = localStorage.token;
    if(!token) window.location.href = "/login";
    fetch(`http://localhost:5000/api/admin/perfume/${selectedId}`, {
      method:"DELETE",
      headers: {
        Authorization : `Bearer ${token}`
      }
    }).then(result => {
      return result.json();
    }).then(result => {
        alert(result.message);
        getData();
        onCloseConf();
    }).catch(result => {
      alert(result.msg);
    })
  }

  const onClose = () => {
    setModalData(null);
    setIsModalOpen(false);
  }

  const onCloseConf = () => {
    setShowConfirmation(false);
    setSelectedId(null);
  }

  const objectToFormData = (obj) => {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  }

  const handleAdd = () => {
    setIsModalOpen(true);
    setModalData(null);
  }

  return (
    <main className='p-6 col-span-4 w-full h-screen overflow-auto'>
      <h2 className='text-black text-2xl text-right w-full'>Product Management</h2>
      <section className='my-5'>
        <button 
        type='button' 
        className='flex justify-center items-center gap-2 ms-auto bg-green-700'
        onClick={handleAdd}
        >
          <Plus/> New Perfume
        </button>
        <div className='text-black grid grid-cols-3 mt-2 gap-2'>
          {
            !items ? (<h2>loading ...</h2>) : (
              items.map((item,idx) => {
                return <PerfumeCard 
                          key={idx}
                          item={item} 
                          index={idx} 
                          canModify={true} 
                          onEdit={onEdit}
                          onDelete={(id) => {
                            setSelectedId(id);
                            setShowConfirmation(true);
                          }}/>
              })
            )
          }
        </div>
        <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage}/>
      </section>

          {/* Modal Edit */}
      <div className='text-gray-900'>
          <ProductModal isOpen={isModalOpen} initialData={modalData} onSubmit={onSubmit} onClose={onClose}/>
          <PopupConfirmation 
            isOpen={showConfirmation} 
            message="are you sure want to delete this perfume?" 
            title={"Delete Confirmation"} 
            onAccept={onDelete}
            onClose={onCloseConf}
            />
      </div>
    </main>
  )
}

export default ProductManagement