import React from 'react'
import { Link } from 'react-router-dom'

export default function Hospital() {
  return (
    <div className='hospital'>
      <div className="userName">WelCome To Hospital Page</div>
      <div className="boxes">
          
          <div className="box1"><Link className='link' to="/uploadReport">View Complaints</Link></div>
      </div>
    </div>
  )
}
