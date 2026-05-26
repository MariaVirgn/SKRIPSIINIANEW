import React from 'react'
import UserLayout from './UserLayout'
import Side1 from './side1'
import Side2 from './side2'

function Home() {
  return (
    <>
        <div id="home">
          <Side1 />
        </div>
        <div id="recomend">
          <Side2 />
        </div>
    </>
  )
}

export default Home