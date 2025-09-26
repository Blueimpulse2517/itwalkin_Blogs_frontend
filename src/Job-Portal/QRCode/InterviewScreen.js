import React, { useEffect, useState } from "react";
import styles from "./InterviewScreen.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setIn } from "immutable";


const InterviewScreen = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState("");

  const handleScan = async () => {
    setLoading(true);
    setProfile(null);

    // simulate API fetch
    setTimeout(() => {
      setProfile({
        name: "Not Updated",
        email: "Not Updated",
        city: "Not Updated",
        phone: "Not Updated",
        qualification: "Not Updated",
        skills: "Not Updated",
        noticePeriod: "Not Updated",
        experience: "Not Updated",
        currentCTC: "Not Updated",
        expectedSalary: "Not Updated",
        prevCompany: "No Feedback",
        presentCompany: "No Feedback",
        aadhaar: "Not Updated",
        pan: "Not Updated",
        accountStatus: "Not Updated",
        feedback: "No Feedback",
        image:
          "https://via.placeholder.com/80", // Replace with dynamic image if available
      });
      setLoading(false);
    }, 2000);
  };

  const [interviewEnded, setInterviewEnded] = useState(false);
  const [interviewstated, setInterviewstarted] = useState(false);
  
  const handleEndInterview = () => {
  if (profileData.length > 0) {
    console.log("Submitting profile:", profileData);
    sendMessage();
    updateQRData();
  }
};

  const [jobseeker, setJobseeker] = useState(null);
  const [pageLoader, setPageLoader]=useState(false);
  const[profileData,setProfileData]=useState([]);
  const [noData, setNoData] = useState(false);

   let params = useParams();
   const job_id=atob(params.id)
  async function getJobseekerId() {
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    try {
      const res = await axios.get(`/walkinRoute/walkindetails/${atob(params.id)}`, { headers });
      const result = res.data;
      console.log(result);
  
      if (result) {
        const list = result.HRCabin.map(item => ({
          jobSeekerId: item.jobSeekerId[0]?.jobSeekerId,
          tokenNo: item.tokenNo[0],
          createdDateTime: new Date(item.createdDateTime),
          updatedDateTime: new Date(item.updatedDateTime),
        }));
        

  
        if (list.length > 0) {
          // Find the latest record by createdDateTime
          const latestRecord = list.reduce((latest, current) =>
            current.updatedDateTime > latest.updatedDateTime ? current : latest
          );
          console.log("latest-",latestRecord)
          // if (latestRecord.createdDateTime && !isNaN(new Date(latestRecord.createdDateTime).getTime())) {
            setJobseeker(latestRecord);
            return latestRecord
          //   setNoData(false)
          // } else {
          //   setNoData(true);
          // }
          
        }
       
      } else if (result === "field are missing") {
        console.log("failed to fetch data");
      }
    } catch (err) {
      alert("server issue occurred");
      console.error(err);
    }
  }
  
 
  const handleStartInterview = async () => {
    setNoData(false);
    const latestJobseeker = await getJobseekerId();
    console.log("jst",latestJobseeker)
    if (
      !latestJobseeker ||
      !latestJobseeker.createdDateTime ||
      isNaN(new Date(latestJobseeker.createdDateTime).getTime())
    ) {
      console.log("1");
      setNoData(true);
      setLoading(false);
      setinterviewStatusmessage("")
      setInterviewEnded(false)
      return;
    }
    
    await getProfile(latestJobseeker);
  
    setLoading(false);
  };
  
  
    async function getProfile(latestJobseeker) {
     
      if (!latestJobseeker) {
        console.log("js",latestJobseeker)
        setNoData(true);
        setInterviewstarted(false);
        return;
      }
    

      if (!(latestJobseeker.createdDateTime && !isNaN(new Date(latestJobseeker.createdDateTime).getTime()))) {
        setNoData(true);
        setInterviewstarted(false);
        return;
      }
    
      setInterviewstarted(true);
  setInterviewEnded(false);
  setinterviewStatusmessage("")
      const studId=latestJobseeker?.jobSeekerId;
      if (!studId) {
        setNoData(true); 
        setInterviewstarted(false)  // 👈 no studId = no data
        return;
      }
      
        setLoading(true)
        await axios.get(`/StudentProfile/viewProfile/${studId}`)
            .then((res) => {
                let result = res.data.result
                console.log("profile",result.message)
                
                setProfileData([result])
                setLoading(false)
                // setComments(result.message)

            }).catch((err) => {
                alert("some thing went wrong")
            })
    }
  

  // useEffect(()=>{
  // console.log(profileData)
 
  // },[profileData])
  
 const[interviewStatusmessage, setinterviewStatusmessage]=useState("")
  async function sendMessage() {
    let message=profileData[0]?.message
    if(comments!=""){
        message=comments 
    }
    console.log("fm",message)
    const id=jobseeker?.jobSeekerId;
    await axios.put(`/StudentProfile/sendMessage/${id}`, { message })
      .then((res) => {
        if (res.data) {
          setProfileData([]);
    setProfile(null);
    setLoading(false);
    setInterviewEnded(true); 
    setInterviewstarted(false) // mark as ended
    // setComments("");
    setNoData(false)
    setinterviewStatusmessage("Interview completed successfully and feedback has been submitted")
          // alert("Interview completed Successfully and feedback has been submitted");
          // window.location.reload();
        }
      })
      .catch((err) => {
        setinterviewStatusmessage("something went wrong");
        console.error(err);
      });
  }
  
  async function updateQRData() {
  
    const jobSeekerId=jobseeker?.jobSeekerId;
    const tokenNo=jobseeker.tokenNo;
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    console.log()
    await axios.put(`walkinRoute/updatPostedwalkin/${atob(params.id)}`,
      {
       HRCabin: [
          {
            jobSeekerId: [{ jobSeekerId: jobSeekerId }],  // <-- wrap properly
            tokenNo: [tokenNo],
            updatedDateTime: new Date()
          }
        ]
 
        
      }, 
    { headers })
      .then(async (res) => {
        let result = res.data
        console.log("result",result)
        if (result == "success") {
          console.log("Success! drive updated successfully")
          // settopMessage("Success! Profile updated successfully")
        } else if (result == "feilds are missing") {
          console.log("warning! drive failed updated ")
          // settopMessage("Alert!..name, emailAddress, NoticePeriod, phoneNumber, Qualification, Skills and Experiance should not be empty")
        }
 
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
 
 
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

    const [OperationalAppliedUser, setOperationalAppliedUser] = useState()

  async function getAppliedUserIds(OId) {
    setPageLoader(true)

    await axios.get(`/walkinRoute/getAppliedUserIds/${OId}`)
        .then(async (res) => {
            let AppliedUserIds = res.data.jobSeekerId
            let appliedUserIds = AppliedUserIds.map((ids) => {
                return (
                    ids.jobSeekerId
                )
            })
          console.log("applied user ids",appliedUserIds)
            setOperationalAppliedUser([res.data])
            
            // await axios.get(`/StudentProfile/getAppliedProfileByIds/${appliedUserIds}`)
            //     .then((res) => {
            //         console.log("total profile fetched",res.data)
            //         setAppliedUser(res.data)
            //         setPageLoader(false)
            //     }).catch((err) => {
            //         alert("server error occured")
            //     })
        }).catch((err) => {
            alert("server error occured")
        })
}

useEffect(() => {
    getAppliedUserIds(atob(params.id))
}, [])


  async function Select(id, status) {
    let slectedJobseker = id;
    await axios.put(`walkinRoute/status/${atob(params.id)}`, { slectedJobseker })
        .then((res) => {
          getAppliedUserIds(atob(params.id))

        }).catch((err) => {
            alert("server error occured")
        })
}
async function Reject(id, status) {
    let rejectedJobseker = id
    await axios.put(`walkinRoute/status/${atob(params.id)}`, { rejectedJobseker })
        .then((res) => {
          getAppliedUserIds(atob(params.id))

        }).catch((err) => {
            alert("server error occured")
        })
}
async function onHold(id, status) {
    console.log("onhold")
    let onHoldJobseker = id
    await axios.put(`walkinRoute/status/${atob(params.id)}`, { onHoldJobseker })
        .then((res) => {
            console.log("abc",res)
            getAppliedUserIds(atob(params.id))

        }).catch((err) => {
            alert("server error occured")
        })
}

async function UndoSelect(id) {
    let userid = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

    let slectedJobseker = id

    await axios.put(`walkinRoute/updatforUndoWalkinApplied/${atob(params.id)}`, { slectedJobseker }, { headers })
        .then((res) => {
          getAppliedUserIds(atob(params.id))
        }).catch((err) => {

            alert("server error occured")
        })

}

async function UndoReject(id) {

    let userid = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

    let rejectedJobseker = id

    await axios.put(`walkinRoute/updatforUndoWalkinApplied/${atob(params.id)}`, { rejectedJobseker }, { headers })
        .then((res) => {
          getAppliedUserIds(atob(params.id))
        }).catch((err) => {

            alert("server error occured")
        })

}

async function UndoOnHold(id) {
    let userid = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

    let onHoldJobseker = id

    await axios.put(`walkinRoute/updatforUndoWalkinApplied/${atob(params.id)}`, { onHoldJobseker }, { headers })
        .then((res) => {
            getAppliedUserIds(atob(params.id))
        }).catch((err) => {

            alert("server error occured")
        })
}

function NoticeAscendingOrder() {
    // let newjob = [...AppliedUser]
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
        return collator.compare(b.NoticePeriod, a.NoticePeriod)
    })
    // setAppliedUser(sorted)
}



  return (
    
    
    <div className={styles.container}>
      {/* Left Section */}
      <button
    className={styles.tvbackbtn}
    onClick={() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }}
  >
    <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
  </button>
      
      <div className={styles.leftBox}>
      {interviewStatusmessage&&<>
        {interviewStatusmessage==="some thing went wrong"?
            <p style={{color:"red"}}>{interviewStatusmessage}</p>    :
            <p style={{color:"green"}}>{interviewStatusmessage}</p>                          
        }
      </>

      }
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading..</p>
          </div>
        )}

{!loading && noData && !interviewEnded && (
  <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
    No Jobseeker has scanned the QR Code
  </div>
)}

        {!loading && profileData.length>0 &&  !interviewEnded &&(
          <div className={styles.profileTableWrapper}>
            <div style={{display:"flex", justifyContent:"center"}}>
              <h2 className={styles.profileHeading}>Jobseeker Profile</h2>
              </div>
            {/* Heading + Image */}
            <div style={{display:"flex", justifyContent:"start"}}>
            <div className={styles.profileHeader}>
              <img
                // src={}
                alt="Candidate"
                className={styles.profileImage}
              />
              
            </div>
            </div>

            {/* Profile Table */}
            <table className={styles.profileTable}>
              <tbody>
                <tr><td>Name</td><td>{profileData[0]?.name?profileData[0]?.name:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Email Address</td><td>{profileData[0]?.email?profileData[0]?.email:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                {/* <tr><td>City</td><td>{profileData[0]?.city?profileData[0]?.city.value:<p style={{color:"red"}}>Not updated</p>}</td></tr> */}
                <tr><td>City</td><td>Bangalore</td></tr>
                <tr><td>Phone Number</td><td>{profileData[0]?.phoneNumber?profileData[0]?.phoneNumber:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Qualification</td><td>{profileData[0]?.Qualification?profileData[0]?.Qualification:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Skills</td><td>{profileData[0]?.Skills?profileData[0]?.Skills:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Notice Period</td><td>{profileData[0]?.NoticePeriod?profileData[0]?.NoticePeriod:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Experience</td><td>{profileData[0]?.Experiance?profileData[0]?.Experiance:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Current CTC</td><td>{profileData[0]?.currentCTC?profileData[0]?.currentCTC:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                <tr><td>Expected Salary</td><td>{profileData[0]?.ExpectedSalary?profileData[0]?.ExpectedSalary:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                {/* <tr><td>Previous Company</td><td>{profile.prevCompany}</td></tr>
                <tr><td>Present Company</td><td>{profile.presentCompany}</td></tr> */}
                <tr><td>Aadhaar</td><td>{profileData[0]?.Aadhar?profileData[0]?.Aadhar:<p style={{color:"red"}}>Not updated</p>}</td></tr>
                {/* <tr><td>PAN</td><td>{profile.pan}</td></tr> */}
                {/* <tr><td>Account Status</td><td>{profileData[0]?.accountStatus?profileData[0]?.accountStatus:<p style={{color:"red"}}>Not updated</p>}</td></tr> */}
                <tr><td>HR Feedback</td><td>{profileData[0]?.message?profileData[0]?.message:<p style={{color:"red"}}>No Feedback</p>}</td></tr>
                <tr><td>Comments</td><td>
                   <textarea
                     required 
                     value={comments}
                     onChange={(e) => setComments(e.target.value)}
                     className={styles.commentBox}
                     placeholder="Write your feedback here..."
                   />
               </td>
               </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className={styles.rightBox}>
        <button
          className={styles.scanBtn}
          onClick={handleStartInterview}
          disabled={interviewstated}
        >
          {profileData.length>0 ? "Scan Progress" : "Scan"}
        </button>
        <div>
          <div style={{display:"flex", flexDirection:"column"}} >
          {
                                            OperationalAppliedUser?.map((operationl) => {
                                                return (
                                                    <>
                                                        {
                                                            operationl.slectedJobseker?.find((jobseekerid) => {
                                                                return (
                                                                    jobseekerid == jobseeker?.jobSeekerId
                                                                )
                                                            }) ?
                                                                <>  <div style={{display:"flex", flexDirection:"column", marginLeft:"-27%"}}>
                                                                    
                                                                    <button  onClick={() => { UndoSelect(jobseeker?.jobSeekerId, "selected") }} style={{
                                                                        marginLeft: "27%", background: "rgb(24, 175, 24)", color: "white",
                                                                        border: "solid",  height: "30px", fontWeight: "bold",cursor:"pointer"
                                                                    }} title="Click to Undo Select">Selected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br>
                                                                    
                                                                    </div>
                                                                </>
                                                                
                                                                :

                                                                (operationl.rejectedJobseker?.find((jobseekerid) => {
                                                                    return (
                                                                        jobseekerid == jobseeker?.jobSeekerId
                                                                    )
                                                                })) ?
                                                                    <>
                                                                        <button onClick={() => { UndoReject(jobseeker?.jobSeekerId, "selected") }} style={{
                                                                            marginLeft: "27%", background: "red", color: "white",
                                                                            border: "solid",  height: "30px", fontWeight: "bold",cursor:"pointer"
                                                                        }} title="Click to Undo Reject">Rejected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                    :

                                                                    (operationl.onHoldJobseker?.find((jobseekerid) => {
                                                                        return (
                                                                            jobseekerid == jobseeker?.jobSeekerId
                                                                        )
                                                                    })) ?
                                                                        <>
                                                                            <button onClick={() => { UndoOnHold(jobseeker?.jobSeekerId, "selected") }} style={{
                                                                                marginLeft: "27%", background: "blue", color: "white",
                                                                                border: "solid",  height: "30px", fontWeight: "bold",cursor:"pointer"
                                                                            }} title="Click to Undo On Hold">OnHold<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                        :
                                                                        <>
                                                                            <div style={{ display: "flex", flexDirection:"column", marginLeft: "-1%" }}>
                                                                                <button style={{
                                                                                    marginLeft: "2%",  backgroundColor: jobseeker?.jobSeekerId == null ? "grey" : "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    height: "30px", fontWeight: "bold",  cursor: jobseeker?.jobSeekerId == null ? "not-allowed" : "pointer"
                                                                                }} onClick={() => { Select(jobseeker?.jobSeekerId, "selected") }}>Select</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", backgroundColor: jobseeker?.jobSeekerId == null ? "grey" : "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                     height: "30px", fontWeight: "bold",  cursor: jobseeker?.jobSeekerId == null ? "not-allowed" : "pointer"
                                                                                }} onClick={() => { Reject(jobseeker?.jobSeekerId, "Rejected") }}>Reject</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", backgroundColor: jobseeker?.jobSeekerId == null ? "grey" : "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    height: "30px", fontWeight: "bold",  cursor: jobseeker?.jobSeekerId == null ? "not-allowed" : "pointer"
                                                                                }} onClick={() => { onHold(jobseeker?.jobSeekerId, "OhHold") }}>OnHold</button><br></br>
                                                                                {/* <li className={`${styles.li} ${styles.Status}`} style={{border:"none"}}> */}
                                      
                                                                            </div>
                                                                            
                                                                        </>

                                                        }
                                                        
                                                    </>
                                                )
                                            })
                                            
                                        }
           
          </div>
        <button className={styles.endBtn} onClick={handleEndInterview}>
          End Interview
        </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;


