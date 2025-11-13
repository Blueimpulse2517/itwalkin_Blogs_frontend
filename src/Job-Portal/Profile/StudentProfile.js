import React, { useRef } from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from "./StudentProfile.module.css"
import profileDp from "../img/user_3177440.png"
import { Puff } from  'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'
import socketIO from 'socket.io-client';
import Footer from '../Footer/Footer'

function StudentProfile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Personal Info", "Job Info", "Education", "Skills", "Feedback","YouTube Video"];
const [PageLoader, setPageLoader] = useState(false)

const [youtubeLink, setYoutubeLink] = useState(profileData?.[0]?.youtubeLink || "");

function handleYoutubeLinkChange(e) {
  setYoutubeLink(e.target.value);
}
function getYoutubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

  // useEffect(() => {
  //   async function fetchProfile() {
  //     try {
  //       const res = await fetch("https://api.example.com/user/profile"); // Replace with actual endpoint
  //       if (!res.ok) throw new Error("Failed to fetch profile data");
  //       const data = await res.json();
  //       setProfileData(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchProfile();
  // }, []);

let navigate = useNavigate()

  let studId = JSON.parse(localStorage.getItem("StudId"))
    async function getProfile() {
        let userid = JSON.parse(localStorage.getItem("StudId"))
        const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("StudLog"))) };
        setPageLoader(true)
        await axios.get(`/StudentProfile/viewProfile/${studId}`)
            .then((res) => {
                let result = res.data.result
                setProfileData([result])
                console.log(result)
                setLoading(false);

            }).catch((err) => {
                alert("some thing went wrong")
                setLoading(false);
            })
    }

    useEffect(() => {
        getProfile()
    }, [])
    const[showApprovedStatus, setShowApprovedStatus]=useState(false)

    function updateprofile() {
      navigate("/Update-Profile")
    }
    function resumedownload() {
      navigate("/resumes")
    }

  if (loading) return 
  <div className={styles.centerText} style={{display:"flex",flexDirection:"column"}}>
     <Puff  height="80"  width="80"  color="#4fa94d"  ariaLabel="bars-loading"  wrapperStyle={{marginLeft:"22%", marginTop:"60px"}}/> 
     <p style={{color:"red"}}>Loading</p>
  </div>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!profileData) return null;


  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div style={{display:"flex", flexWrap:"wrap", alignItems:"center"}}>
        <div className={styles.avatar}>
        <img  src={profileData[0].Gpicture?profileData[0].Gpicture: profileDp}/>
        </div>

        <div className={styles.details}>
          <h2 className={styles.name}>{profileData[0].name?profileData[0].name:"#####"}</h2>
          <p className={styles.email}>{profileData[0].email?profileData[0].email:"#####"}</p>
          <p className={styles.city}>{profileData[0].city?profileData[0].city:"#####"}</p>
        </div>
        </div>
        <div className={styles.actions}>
          <button style={{width:"147px"}}  className={styles.editBtn} onClick={updateprofile}>Edit Profile</button>
          <button className={styles.downloadBtn} onClick={resumedownload}>Download Resume</button>
          <span style={{width:"120px",textAlign:"center"}}  className={styles.statusBadge} onClick={()=>setShowApprovedStatus(prev=>!prev)}>Account Status</span>
        </div>
        
      </div>
      

      {/* Tabs Section */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => {setActiveTab(tab);setShowApprovedStatus(false)}}
            
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Dynamic Tab Content */}
      <div className={styles.content}>
        {activeTab === "Personal Info" && (
          <div className={styles.infoSection}>
            <h3>Personal Information</h3>
            <div>
              <strong>Name</strong><br></br> {profileData[0].name?profileData[0].name:"#####"}
            </div>
            <div>
              <strong>Email</strong><br></br> {profileData[0].email?profileData[0].email:"#####"}
            </div>
            <div>
              <strong>Phone</strong><br></br> {profileData[0].phoneNumber?profileData[0].phoneNumber:"#####"}
            </div>
            <div>
              <strong>City</strong><br></br> {profileData[0].city?profileData[0].city:"#####"}
            </div>
            {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>Congratulations—your account has been approved</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Your account is in under Verfication process</strong></div>
             </div> 
            )
          }
          </div>
        )}

        {activeTab === "Job Info" && (
          <div className={styles.infoSection}>
            <h3>Employment Details</h3>
            <div>
              <strong>Current Employer :</strong> {profileData[0].currentEmp?profileData[0].currentEmp:"####"}
            </div>
            {/* <div>
              <strong>Role:</strong> {profileData[0].currentRole}
            </div>
            <div>
              <strong>Duration:</strong> {profileData[0].currentDuration}
            </div> */}
            <br />
            <div style={{marginTop:"-26px"}}>
  <strong>Previous Employer :</strong>{" "}
  {profileData[0].employers && profileData[0].employers.length > 0 ? (
  profileData[0].employers.map((emp, index) => (
    <span key={index}>
      {emp.name}
      {index < profileData[0].employers.length - 1 && ", "}
    </span>
  ))
) : (
  "#####"
)}

</div>
<div>
       <strong>Expected CTC : </strong> 
       {profileData[0].currentCTC? `${profileData[0].currentCTC} LPA`:"####"} 
           </div>

           <div>
       <strong>Experience : </strong> 
       {profileData[0].Experiance?`${profileData[0].Experiance} Yrs`:"####"} 
           </div>



            {/* <div>
              <strong>Role:</strong> {profileData[0].previousRole}
            </div>
            <div>
              <strong>Duration:</strong> {profileData[0].previousDuration}
            </div> */}
            {/* {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>Congratulations—your account has been approved</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Your account is in under Verfication process</strong></div>
             </div> 
            )
          } */}
          </div>
        )}

        {activeTab === "Education" && (
          <div className={styles.educationSection}>
            <h3>Educational Details</h3>
            <div style={{display:"flex",}}>
                  <strong style={{marginTop:"-4px"}}>10<sup>th</sup>: </strong> {profileData[0].tenth?profileData[0].tenth:"#####"}
            </div>
            <div style={{display:"flex", }}>
                  <strong style={{marginTop:"-4px"}}>12<sup>th</sup>: </strong> {profileData[0].twelfth?profileData[0].twelfth:"#####"}
            </div>
            <div style={{display:"flex", }}>
                 <div> <strong>Degree/Diploma: </strong></div>
                  <div> {profileData[0].degree?profileData[0].degree:"#####"}</div>
            </div>
            <div style={{display:"flex", }}>
                  <strong>Masters: </strong> {profileData[0].college?profileData[0].college:"#####"}
            </div>
            {/* {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>Congratulations—your account has been approved</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Your account is in under Verfication process</strong></div>
             </div> 
            )
          } */}
          </div>
        )}

        {activeTab === "Skills" && (
          <div className={styles.infoSection}>
           <div style={{display:"flex",}}>
                  <strong> Skills: </strong> {profileData[0].Skills?profileData[0].Skills:"#####"}
            </div>
            {/* {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>Congratulations—your account has been approved</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Your account is in under Verfication process</strong></div>
             </div> 
            )
          }  */}
           
          </div>
        )}

        {activeTab === "Feedback" && (
          <div className={styles.infoSection}>
            <h3>Feedback</h3>
            {/* {profileData[0].feedback.map((item, index) => (
              <div key={index}>
                <strong>{item.title}:</strong>
                <p>{item.comment}</p>
              </div>
            ))} */}
            {profileData[0].message?profileData[0].message:"#####" }
            {/* {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>Congratulations—your account has been approved</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Your account is in under Verfication process</strong></div>
             </div> 
            )
          } */}
          </div>
        )}

{activeTab === "YouTube Videos" && (
  <div className={styles.infoSection}>
    <h3>YouTube Video</h3>
    <input
      type="text"
      placeholder="Paste YouTube link here"
      value={youtubeLink}
      onChange={handleYoutubeLinkChange}
      style={{width:"100%", padding:"8px", marginBottom:"10px"}}
    />
    
    {/* {youtubeLink && (
      <div style={{marginTop:"10px"}}>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${getYoutubeVideoId(youtubeLink)}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )} */}
  </div>
)}

      </div>
    </div>
  );
}

export default StudentProfile;