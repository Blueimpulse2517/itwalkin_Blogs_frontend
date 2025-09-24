
// JobseekerEnterCabin.jsx
import React, { useEffect, useState } from "react";
import { getProfileByUserId, setCurrentInCabin, Databaseprofile } from "./mockdatabase";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function JobseekerEnterCabin() {
    const StudentAuth = localStorage.getItem("StudLog");

   const navigate = useNavigate();
    // const { driveId } = useParams();
   const[driveId,setdriveId] = useState("");
   const[tokenNo,setTokenNo] = useState("");
  const[pageLoader, setPageLoader]=useState(false);
  useEffect(() => {
    let studId = JSON.parse(localStorage.getItem("StudId"))
    async function getProfile() {
      const studId = JSON.parse(localStorage.getItem("StudId"));
      const headers = { 
          authorization: studId + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) 
      };
      
      setPageLoader(true);
  
      try {
          const res = await axios.get(`/StudentProfile/viewProfile/${studId}`, { headers });
          const result = res.data.result;
  
          if (result.interview && result.interview.length > 0) {
              // Find the interview with the latest scannedDateTime
              const latestInterview = result.interview.reduce((latest, current) => {
                  return new Date(current.scannedDateTime) > new Date(latest.scannedDateTime) ? current : latest;
              }, result.interview[0]);
  
              setdriveId(latestInterview.driveId);
              setTokenNo(latestInterview.tokenNo);
          } else {
              // No interviews found
              setdriveId(null);
              setTokenNo(null);
          }
  
          setPageLoader(false);
      } catch (err) {
          alert("Something went wrong");
          setPageLoader(false);
      }
  }
  
   
    getProfile();
    
  }, []);



  async function postQRData(driveId,tokenNo) {
  
   let jobSeekerId = JSON.parse(localStorage.getItem("StudId"))
   const headers = { authorization: 'BlueItImpulseWalkinIn' };
   console.log("driveid", driveId)
   await axios.put(`walkinRoute/updatPostedwalkin/${driveId}`,
    {
      HRCabin: [
         {
           jobSeekerId: [{ jobSeekerId: jobSeekerId }],  // <-- wrap properly
           tokenNo: [tokenNo],
           createdDateTime:new Date(),
           updatedDateTime: new Date()
         }
       ]
      // applyLink:"itwalkin.com"
     }, 
   { headers })
     .then(async (res) => {
       let result = res.data
       console.log("result",result)
       if (result == "success") {
         console.log("Success! Profile updated successfully")
         // settopMessage("Success! Profile updated successfully")
       } else if (result == "feilds are missing") {
         console.log("warning! Profile failed updated successfully")
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

  useEffect(()=>{
    if(driveId &&tokenNo){
      console.log("driveid",driveId ,",",tokenNo)
      postQRData(driveId,tokenNo)
    }
  },[driveId,tokenNo])

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to the Interview Cabin</h2>
      <p>Your presence has been marked. Good Luck for the interview.</p>
    </div>
  );
}
