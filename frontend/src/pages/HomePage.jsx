import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className='text-center mt-60'>
      <h1 className='text-2xl font-bold mt-4'>Welcome To Custom Form Builder</h1>
      <p className='mt-3'>Build your own form with category,cloze and comprehension questions</p>
      <Link to={'/form-builder'}>
      <button className='mt-4  bg-purple-600 text-white p-3 rounded cursor-pointer'>Get Started</button>
      </Link>
    </div>
  )
}

export default HomePage
