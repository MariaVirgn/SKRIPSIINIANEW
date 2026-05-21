import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/sidebar'

function AdminLayout() {
  const location = useLocation()
  const active = location.pathname.includes('/admin/user')
    ? 'user'
    : location.pathname.includes('/admin/evaluation')
    ? 'evaluation'
    : 'products'

  return (
        <section className='bg-white h-screen grid grid-cols-5 font-serif'>
            <Sidebar active={active} />
            <Outlet/>
        </section>
  )
}

export default AdminLayout