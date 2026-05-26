import React, { useEffect, useState } from 'react'
import PopupConfirmation from '../../components/PopupConfirmation';
import { apiFetch } from '../../utils/api';
import { Trash } from 'lucide-react';
import Pagination from '../../components/pagination';

function UserManagement() {
  const [users, setUsers] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  const getUserData = () => {
    apiFetch("/api/admin/users", {
      method:"GET"
    }).then((response) => {
      setUsers(response.data)
      setCurrentPage(response.current_page)
      setTotalPage(response.pages)
    }).catch((response) => {
      alert(response.message);
    })
  }

  useEffect(() => {
    getUserData();
  },[])

  const onHandleBtnDelete = (id) => {
    setSelectedId(id);
    setShowConfirmation(true);
  }
  const onDelete = () => {
    const token = localStorage.token
    fetch(`http://localhost:5000/api/admin/users/${selectedId}`, {
      method:"DELETE",
      headers:{
        Authorization : `Bearer ${token}`
      }
    }).then(response => {
      return response.json();
    }).then(result => {
      alert(result.message);
      getUserData();
      onCloseConf();
    }).catch(response => {
      alert(response.message);
      console.log(response);
      onCloseConf();
    })
  }

  const onCloseConf = () => {
    setSelectedId(null);
    setShowConfirmation(false);
  }

  return (
    <main className='p-6 col-span-4 w-full h-screen'>
      <h2 className='text-black text-2xl text-right w-full'>Product Management</h2>
      <section className='my-5'>
        {
          users? (

        <table className='text-gray-800 w-full px-5 max-h-[550px] overflow-auto'>
          <thead className='h-[40px]'>
            <tr className='bg-gray-900 text-white'>
              <th className='font-light w-[100px]'>Id</th>
              <th className='font-light'>Name</th>
              <th className='font-light'>Email</th>
              <th className='font-light'>created_at</th>
              <th className='font-light'>role</th>
              <th className='font-light w-[100px]'>Actions</th>
            </tr>
          </thead>
          <tbody className='px-5 text-center'>

          {
            users.map((val, idx) => {
              return (
                <tr key={idx} className={'text-sm h-[60px] '.concat(idx % 2 != 0 ? "bg-gray-500 text-white" : "")}>
                  <td className="w-[50px] truncate">{val.id}</td>
                  <td className="max-w-[250px] truncate">{val.name}</td>
                  <td className="w-[350px]">{val.email}</td>
                  <td className="w-[350px]">{val.created_at}</td>
                  <td className="w-[100px]">{val.role}</td>
                  <td className='h-full'>
                    <button className='rounded-full bg-red-700 hover:bg-red-800 p-2 h-full w-auto' onClick={() => onHandleBtnDelete(val.id)}><Trash color="white" width={15} height={15} /></button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
          ) : (
            <h1>loading...</h1>
          )
        }
        {
          totalPage > 1 && (
            <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage}/>
          )
        }
      </section>

          {/* Modal Edit */}
      <div className='text-gray-900'>
          <PopupConfirmation
            isOpen={showConfirmation} 
            message="are you sure want to delete this user?" 
            title={"Delete Confirmation"} 
            onAccept={onDelete}
            onClose={onCloseConf}
            />
      </div>
    </main>
  )
}

export default UserManagement