import React from 'react'
import {useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function RegisterCase() {
    const navigate=useNavigate()
    const notifyA=(msg)=>{
        toast.error(msg)
      }
      const notifyB=(msg)=>{
        toast.success(msg)
      }
    const Registration=()=>{
        notifyB('registered Successfully')
        navigate('/police')
    }
  return (
    <div className="RegisterCase">
        <div className="complainantDetails">
            <label htmlFor="">Complainant ID:</label>
            <input type="text"/>
        </div>
        <div className="caseSubject">
            <h3>Case Subject:</h3>
            <input type="text" />
            {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam fuga quod porro doloribus alias corporis sit, facilis mollitia qui blanditiis?</p> */}
        </div>
        <div className="caseDetails">
            <h3>Case Details:</h3>
            <input type="text" />
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab saepe nesciunt explicabo facere nam aut, at molestias, quisquam nihil maxime nostrum eum. Culpa ipsum, perferendis accusamus veniam magnam eaque! Distinctio odit iusto nisi dolores nulla doloremque hic sint, repellendus, exercitationem placeat facilis, dolorum dolorem. Praesentium, ut consequatur. Ab, aperiam tempore.</p> */}
        </div>

        <div className="caseDocument">
            <div className="boxforFile">
                <input type="file"/>
            <button>View Documents</button>
            </div>
        </div>

        <div className="register">
            <button onClick={Registration}>Register</button>
        </div>
    </div>
  )
}
