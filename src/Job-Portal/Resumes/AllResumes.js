import React, { useEffect, useState } from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateGallery from './TemplateGallery';
import axios from 'axios';
import styles from "../Jobs/Allobs.module.css"
import Style from "./AllResumes.module.css"
import { Navigate, useNavigate } from 'react-router-dom';

  
function AllResumes() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const studId = JSON.parse(localStorage.getItem("StudId"));

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
    getProfile();
  }, []);

   const navigate = useNavigate()
  return (
    <div>
      {selectedTemplate===null?<h1 style={{ textAlign: 'center', marginTop: '20px' }}>Choose Your Resume Template</h1>
       :
       <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Your resume preview</h1>}
      {!selectedTemplate && (
        <TemplateGallery onSelect={setSelectedTemplate} />
      )}

      {selectedTemplate && profileData && (
        <div style={{ padding: '20px' }}>
          <div style={{display:"flex"}}>
          <button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {
    setSelectedTemplate(null); // First reset the template view
    
  }}
>
  <div class={Style.backbtn} >Back</div>
</button>

<button
  class={Style.jobdetailBackBtnContainer }
  onClick={() => {navigate("/My-Profile")}}
>
  <div class={Style.updatebtn}>Update Profile</div>
</button>
 
</div>

          {selectedTemplate === 'one' && <TemplateOne data={profileData} />}
          {selectedTemplate === 'two' && <TemplateTwo data={profileData} />}
        </div>
      )}
    </div>
  );
}

export default AllResumes;

