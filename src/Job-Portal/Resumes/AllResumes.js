import React, { useEffect, useState } from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateGallery from './TemplateGallery';
import axios from 'axios';
import styles from "../Jobs/Allobs.module.css"
import Style from "./AllResumes.module.css"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TemplateThree from './TemplateThree';
import TemplateFour from './TemplateFour';
import TemplateFive from './TemplateFive';
import TemplateSix from './TemplateSix';

  
function AllResumes() {
  // const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const studId = JSON.parse(localStorage.getItem("StudId"));
  let location = useLocation()
  const { logoutresume } = location.state || {};
  const { selectedTemplate } = location.state || {};

  async function getProfile() {
    const headers = {
      authorization: studId + " " + atob(JSON.parse(localStorage.getItem("StudLog")))
    };

    try {
      const res =   await axios.get(`/StudentProfile/viewProfile/${studId}`)
      const result = res.data.result;
     console.log(result)
      setProfileData({
        name: result.name,
        email: result.email,

        phone: result.phoneNumber,// Or: result.phone if available
        education: [
          { degree: "MCA", university: "LNCT University", cgpa: "8.30" },
          { degree: "BCA", university: "MCNU", cgpa: "8.58" }
        ],
        skills: ["HTML", "CSS", "JavaScript", "React", "Git"]
      });

    } catch (err) {
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    if(logoutresume!==true)
     getProfile();
  }, []);

   const navigate = useNavigate()
  return (
<>
{/* <button
    className={Style.resumebackbtn}
    onClick={() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/alljobs");
      }
    }}
  >
    <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
  </button> */}
    <div>
      {console.log("st",selectedTemplate)}
      {!selectedTemplate?
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Choose resume template<br></br> </h1>
       :
       <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Preview Your Resume </h1>}
      {!selectedTemplate && (
        <TemplateGallery logoutresume={logoutresume}/>
      )}

      {selectedTemplate && profileData && (
        <div style={{ padding: '20px' }}>
          <div style={{display:"flex"}}>
          <button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {
     // First reset the template view
    
  }}
>
  <div class={Style.backbtn} 
  onClick={() => {
    if (window.history.length > 1) {
       navigate(-1);
      } else {
         navigate('/resumes'); 
       }
  }}
  >Back</div>
</button>

<button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {navigate("/Update-Profile")}}
>
  <div class={Style.updatebtn}>Update Profile</div>
</button>
 
</div>

          {selectedTemplate === 'one' && <TemplateOne data={profileData} />}
          {selectedTemplate === 'two' && <TemplateTwo data={profileData} />}
          {selectedTemplate === 'three' && <TemplateThree data={profileData} />}
          {selectedTemplate === 'four' && <TemplateFour data={profileData} />}
          {selectedTemplate === 'five' && <TemplateFive data={profileData} />}
          {selectedTemplate === 'six' && <TemplateSix data={profileData} />}

        </div>
        
      )}
    </div>
    </>
  );
}

export default AllResumes;


