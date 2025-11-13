import React, { useRef } from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from "./StudentProfile.module.css"
import profileDp from "../img/user_3177440.png"
import { Puff } from  'react-loader-spinner'
import { useNavigate, useParams } from 'react-router-dom'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'
import socketIO from 'socket.io-client';
import Footer from '../Footer/Footer'

function CheckStudentProfile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Personal Info", "Job Info", "Education", "Skills", "Feedback"];
const [PageLoader, setPageLoader] = useState(false)

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
    let params =useParams()

  let studId = JSON.parse(localStorage.getItem("StudId"))
    async function getProfile() {
      let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("EmpLog"))) };
        setPageLoader(true)
        await axios.get(`/StudentProfile/viewProfile/${atob(params.CP)}`,{headers})           
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
    const[message, setMessage]=useState("")   
    const comment=(e)=>{
       setMessage(e.target.value)
    }
    const [commentmessage,setCommentmessage]=useState("");
      
    
      async function sendMessage() {
        if(message==""){
          setCommentmessage("Empty feedback cannot be submitted")
          window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
              return
        }
        const id=profileData[0]._id
      await axios.put(`/StudentProfile/sendMessage/${id}`, { message })
        .then((res) => {
          if (res.data) {         
              setCommentmessage("Feedback has been submitted successfully")
              setMessage("")
          }
        })
        .catch((err) => {
          setCommentmessage("something went wrong");
          console.error(err);
        })
        window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
    }
    function updateprofile() {
      navigate("/Update-Profile")
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
          {/* <button style={{width:"147px"}}  className={styles.editBtn} onClick={updateprofile}>Edit Profile</button>
          <button className={styles.downloadBtn}>Download Resume</button> */}
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
              <div><strong style={{color:"green"}}>This jobseeker Account has been successfully verified
              </strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Verification for this jobseeker’s Account is in progress</strong></div>
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
           {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>This jobseeker Account has been successfully verified</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Verification for this jobseeker’s Account is in progress</strong></div>
             </div> 
            )
          }

            {/* <div>
              <strong>Role:</strong> {profileData[0].previousRole}
            </div>
            <div>
              <strong>Duration:</strong> {profileData[0].previousDuration}
            </div> */}
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
            {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>This jobseeker Account has been successfully verified</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Verification for this jobseeker’s Account is in progress</strong></div>
             </div> 
            )
          }
          </div>
          
        )}
        

        {activeTab === "Skills" && (
          <div className={styles.infoSection}>
           <div style={{display:"flex",}}>
                  <strong> Skills: </strong> {profileData[0].Skills?profileData[0].Skills:"#####"}
            </div>
            {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>This jobseeker Account has been successfully verified</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Verification for this jobseeker’s Account is in progress</strong></div>
             </div> 
            )
          }
               
           
          </div>
        )}

        {activeTab === "Feedback" && (
          <div className={styles.infoSection}>
            <h3>Feedback</h3>
            
            {profileData[0].message?profileData[0].message:"#####" }
            {showApprovedStatus &&
            (profileData[0].isApproved?
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"green"}}>This jobseeker Account has been successfully verified</strong></div>
             </div>
             :
             <div className={styles.aprovedStatus}>
              <div><strong style={{color:"Black"}}>Account Status</strong></div>
              <div><strong style={{color:"red"}}></strong></div>
              <div><strong style={{color:"red"}}>Verification for this jobseeker’s Account is in progress</strong></div>
             </div> 
            )
          }
            <h2>Comment</h2>
                <div style={{display:"flex"}}>
                   <textarea onChange={(e)=>comment(e)} value={message} style={{width:"30%",height:"80px"}}></textarea>
                   <div style={{display:"flex", alignItems:"end",}}>
                     <button onClick={sendMessage} className={styles.jobdetailBackBtn} style={{padding: "0px 5px 0px 8px"}} >Submit</button>
                    </div>
                </div>
               
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckStudentProfile;
