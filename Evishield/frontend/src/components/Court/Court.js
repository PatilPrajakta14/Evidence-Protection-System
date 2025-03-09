import React from 'react'
import { Link } from 'react-router-dom'

export default function Court() {
  return (
    <div className="court">
      <div className="userName"></div>
      <div className="boxes">
          <div className="box1"><Link className='link' to="/checkCases">Check Updates</Link></div>
      </div>
    </div>
  )
}
