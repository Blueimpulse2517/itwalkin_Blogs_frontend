
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
        let userid = JSON.parse(localStorage.getItem("StudId"))
        const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("StudLog"))) };
        setPageLoader(true)
        await axios.get(`/StudentProfile/viewProfile/${studId}`)
            .then((res) => {
                let result = res.data.result
                console.log(result)
                setdriveId(result.interview[0]?.driveId)
                setTokenNo(result.interview[0]?.tokenNo)
                setPageLoader(false)

            }).catch((err) => {
                alert("some thing went wrong")
            })
    }
   
    getProfile();
    
  }, []);



  async function postQRData(driveId,tokenNo) {
  
   let jobSeekerId = JSON.parse(localStorage.getItem("StudId"))
   const headers = { authorization: 'BlueItImpulseWalkinIn' };
  //  console.log("driveid", driveId)
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
