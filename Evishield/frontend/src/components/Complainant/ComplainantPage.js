import React from 'react'
import { Link } from 'react-router-dom'

export default function ComplainantPage() {
  return (
    <div className='police'>
      <div className="boxes">
          <div className="box1"><Link className='link' to="/trackYourComplaint">Track Your Complaint</Link></div>
          <div className="box1"><Link className='link' to="/complainant">View Complaints</Link></div>
      </div>

    </div>
  )
}
