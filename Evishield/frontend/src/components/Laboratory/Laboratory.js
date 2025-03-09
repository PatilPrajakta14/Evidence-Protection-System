import React from 'react'
import { Link } from 'react-router-dom'

export default function Laboratory() {
  return (
    <div className="laboratory">
      <div className="boxes">
        <div className="box1"><Link className='link' to='/uploadReportLab'>Upload Report</Link></div>
      </div>
    </div>
  )
}
