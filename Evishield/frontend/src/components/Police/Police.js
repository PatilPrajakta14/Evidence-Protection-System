import React from 'react'
import { Link } from 'react-router-dom'
import './police.css'

export default function Police() {
  return (
    <div className='police'>
      <div className="boxes">
          <div className="box1"><Link className='link' to="/viewComplaints">View Complaints</Link></div>
      </div>
    </div>
  )
}
