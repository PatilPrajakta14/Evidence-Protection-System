import React from 'react'
import { Link } from 'react-router-dom'

export default function CheckNewUpdatesLab() {
  return (
    <div className="checkNewUpdatesLab">
      <div className="heading">
        <h1>No Any Update yet</h1>
      </div>
      <div className="table">
        
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Sr. No.</th>
              <th scope="col">Complaint Subject</th>
              <th scope="col">Complaint Details</th>
              <th scope="col">Complaint Document</th>
              <th scope="col">Register Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <th scope="col">1</th>
              <th scope="col">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis ab laboriosam, perspiciatis saepe sint laudantium!</th>
              <th scope="col">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga labore iste non perspiciatis aspernatur quis saepe error temporibus iusto eius, quas ipsa illum alias, tenetur harum quidem vitae id, dolore minima ratione voluptatem velit?</th>
              <th scope="col">Complaint Document</th>
              <th scope="col"><button className="primary"><Link to='/registerCase'>Register</Link></button></th> 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
