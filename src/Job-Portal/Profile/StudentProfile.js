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
// const fileInputRef = useRef(null);

// const [videoFile, setVideoFile] = useState(null);
// const [videoPreview, setVideoPreview] = useState("");
// const [videoUrl, setVideoUrl] = useState("");
// const [ytUploading, setYtUploading] = useState(false);
// const [ytError, setYtError] = useState("");




// const uploadVideoToYouTube = async () => {
//   if (!videoFile) {
//     setYtError("Please select a video first.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("video", videoFile);

//   try {
//     setYtUploading(true);
//     setYtError("");
//     setVideoUrl("");

//     const res = await axios.post(
//       "http://localhost:3000/api/uploadToYouTube", //-----------------dummy api used to test frontend
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" }
//       }
//     );

//     setVideoUrl(res.data.url);
//   } catch (err) {
//     setYtError("Upload failed. Try again.");
//   } finally {
//     setYtUploading(false);
//   }
// };


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

  // -----------you tube code----------  

const [videoFile, setVideoFile] = useState(null);
const [videoPreview, setVideoPreview] = useState("");
const [videoUrl, setVideoUrl] = useState(""); // existing URL
const [ytUploading, setYtUploading] = useState(false);
const [ytError, setYtError] = useState("");
const fileInputRef = useRef(null);
const [uploadConsent, setuploadConsent] = useState(false);
const [disclaimerConsent, setdisclaimerConsent] = useState(false);

useEffect(() => {
  if (profileData && profileData?.url) {
    setVideoUrl(profileData[0].url?profileData[0].url:"");
    setVideoPreview(""); // YouTube preview replaces local preview
  }
}, [profileData]);

const removeLocalVideo = () => {
  setVideoPreview("");
  setVideoFile(null);
  setYtError("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

const deleteYouTubeVideo = async () => {
  try {
    const response = await axios.post("/api/deleteYouTubeVideo", {
      url: videoUrl
    });

    setVideoUrl("");
    setVideoPreview("");
    alert("Video deleted successfully!");

  } catch (error) {
    alert("Failed to delete YouTube video.");
  }
};

const uploadVideoToYouTube = async (file) => {
  if (!file) {
    setYtError("No video selected.");
    return;
  }

  const formData = new FormData();
  formData.append("video", file);

  try {
    setYtUploading(true);
    setYtError("");
    setVideoUrl("");

    const res = await axios.post(
      "http://localhost:3000/api/uploadToYouTube",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    setVideoUrl(res.data.url);
    setVideoPreview("");  

  } catch (err) {
    setYtError("Upload failed.");
  } finally {
    setYtUploading(false);
  }
};

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

{/* YOUTUBE TAB */}

{/* YOUTUBE TAB */}

{/* YOUTUBE TAB */}
{activeTab === "YouTube Video" && (
  <div className={styles.infoSection}>
    <h3>YouTube Video Upload</h3>

    <div>
      <label style={{cursor:"pointer"}}>
        <input
          type="checkbox"
          checked={uploadConsent}
          onChange={(e) => setuploadConsent(e.target.checked)}
        />
        You agree to upload only interview clip
      </label>

      <br />

      <label style={{cursor:"pointer"}}>
        <input
          type="checkbox"
          checked={disclaimerConsent}
          onChange={(e) => setdisclaimerConsent(e.target.checked)}
          
        />
        Itwalkin is not responsible for misuse of this video by the employer        
        </label>
        <p>Note:  This video will required by ITWalkin Admin. This video will be shared only to fortune 500 employer</p>
</div>

    {/* {ytUploading && <p className={styles.loadingText}>Uploading… please wait...</p>} */}
    {ytError && <p className={styles.errorTextRed}>{ytError}</p>}
    {/* UPLOAD CARD */}
    <div
      className={styles.youtubeCard}
      onClick={() => {
        if (!videoPreview && !videoUrl)
          fileInputRef.current.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("video/")) {
          setVideoFile(file);
          setVideoPreview(URL.createObjectURL(file));
          setVideoUrl("");
        }
      }}
    >
      {/* Hidden File Input */}
      <input
  type="file"
  accept="video/*"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setVideoUrl("");
      setYtError("");

      // IMPORTANT — pass file directly to upload function
      uploadVideoToYouTube(file);
    }
  }}
/>


      {/* CASE 1 — NO VIDEO SELECTED */}
      {!videoPreview && !videoUrl && (
        <>
          <button disabled={!(uploadConsent && disclaimerConsent)} 
          style={{backgroundColor: uploadConsent && disclaimerConsent ?"rgb(40,4,99)":"grey" }} className={styles.uploadBtnBlue}>
            Upload Video to YouTube</button>
          <p className={styles.dropText}>
            or drop a file,<br /> paste video or URL
          </p>
        </>
      )}

      {/* CASE 2 — LOCAL VIDEO PREVIEW */}
      {ytUploading?
      <div style={{display:"flex", flexDirection:"column"}}>
      <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading"  />
      <div><p style={{color:"red"}}>Uploading.......</p></div>
      </div>
      :
      (videoPreview && (
        <div className={styles.previewWrapper}>
          <video src={videoPreview} controls className={styles.videoPreview} />

          <button
            className={styles.removeVideoBtn}
            onClick={(e) => {
              e.stopPropagation();
              removeLocalVideo();
            }}
          >
            Delete Video
          </button>
        </div>
      ))
    }

      {/* CASE 3 — EXISTING YOUTUBE VIDEO PREVIEW */}
      {videoUrl && !videoPreview && (
        <div className={styles.previewWrapper}>
          <iframe
            className={styles.youtubeFrame}
            src={videoUrl.replace("watch?v=", "embed/")}
            allowFullScreen
          ></iframe>

          <button
            className={styles.removeVideoBtn}
            onClick={(e) => {
              e.stopPropagation();
              deleteYouTubeVideo();
            }}
          >
            Delete YouTube Video
          </button>
        </div>
      )}
    </div>

    {/* UPLOAD TO YOUTUBE BUTTON */}
    {/* {!videoUrl && (
      <div style={{display:"flex", justifyContent:"center"}}>
      <button
        onClick={uploadVideoToYouTube}
        disabled={ytUploading}
        className={styles.uploadBtnGreen}
      >
        {ytUploading ? "Uploading..." : "Upload to YouTube"}
      </button>
      </div>
    )} */}



  </div>
)}




      </div>
    </div>
  );
}

export default StudentProfile;