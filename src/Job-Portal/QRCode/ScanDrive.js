import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyDrives } from "./dummyDrives";
import axios from "axios";
import styles from "../Jobs/Allobs.module.css"

const ScanDrive = () => {

  const { driveId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState([]);
  let studId = JSON.parse(localStorage.getItem("StudId"))


  useEffect(() => {
    const fetchProfile = async () => {
      let userid = JSON.parse(localStorage.getItem("StudId"))
      const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("StudLog"))) };
    try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`)
        const result = res.data.result;
        console.log(result)
        setProfileData([result]);
        setLoading(false);
        // console.log(profileData) // Save profile to state
      } catch (err) {
        alert("Something went wrong while fetching profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studId]);

const[allWalkinDrive, setAllWalkinDrive]=useState([])
  async function getjobs() {

    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    await axios.get("/walkinRoute/getHomewalkins",{headers})
      .then((res) => {
        let result = (res.data)
        // console.log("result - >",result)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      
        setAllWalkinDrive(sortedate)
        // console.log("allWalkinDrive",allWalkinDrive)
      }).catch((err) => {
        console.log(err)
        alert("some thing went wrong")
      })
  }

  useEffect(()=>{
    getjobs()
    // console.log("companyName",allWalkinDrive)
  },[])

  const[tokenNo, setTokenNo]=useState("")

  useEffect(() => {
    if(allWalkinDrive.length>0){
    if (profileData.length === 0) return;

    const StudentAuth = localStorage.getItem("StudLog");

    if (!StudentAuth) {
      alert("Please log in as Jobseeker.");
      navigate("/");
      return;
    }

    const generateUniqueCode = (driveId) => {
      const drive = allWalkinDrive.find((drive) => drive._id === driveId);
      console.log("drive", driveId, allWalkinDrive)
      // console.log("profile", profileData[0])
      // if (!drive?.companyName) {
      //   alert("Please Scan the QR code.");
      //   navigate("/");
      //   return null;
      // }

      const companyCode = drive?.companyName?.substring(0, 2).toUpperCase();
      // console.log("companyName",companyName)
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomPart = "";
      for (let i = 0; i < 3; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return `${companyCode}${randomPart}`;
    };

    const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    const filteredData = attendanceData.filter(
      (entry) => !(entry.userId === studId && entry.driveId === driveId)
    );

    setTokenNo(generateUniqueCode(driveId));
    if (! tokenNo) return;

    const updatedData = [
      ...filteredData,
      {
        userId: studId,
        driveId,
        code: tokenNo,
        timestamp: new Date().toISOString(),
      },
    ];

    localStorage.setItem("attendance", JSON.stringify(updatedData));
    setCode( tokenNo);
    setLoading(false);
  }
  }, [profileData, driveId, studId, allWalkinDrive]);



  async function postQRData() {
     console.log("toke:",tokenNo)
    let jobSeekerId = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    // e.preventDefault()
    console.log(driveId)
    await axios.put(`walkinRoute/updatPostedwalkin/${driveId}`,
      {
        WaitingArea: [
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


  async function saveUpdate() {
    let userid = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };
    await axios.put(`/StudentProfile/updatProfile/${studId}`, {
      interview: [
        {
          tokenNo: tokenNo,
          driveId: driveId,
          scannedDateTime: new Date()
        }
      ]
      
    }, { headers })
      .then(async (res) => {
        let result = res.data
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
    if(tokenNo){
    postQRData()
    saveUpdate()
    }
  },[tokenNo])

  return (
    <div style={{ padding: "2rem", }}>
      <h2>
        {/* QR Scanned for Drive: <span style={{ color: "#0077cc" }}>{driveId}</span> */}
        Token Allotment Display 
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* <h3>Your Unique Attendance Code:</h3> */}
          {/* {console.log("kkkk",profileData)} */}
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "black" }}>Welcome {profileData[0]?.name} !</div>
          <div style={{ fontSize: "1rem", fontWeight: "bold", color: "black" }}>Your token is </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>{tokenNo}</div>
          <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#black" }}>Please Proceed to waiting area.<br></br>Watch the TV for your turn.</div>
          <button className={styles.QRHomeBtn} style={{ marginTop: "1.5rem" }} onClick={() => navigate("/")}>
            Go to Home
          </button>
        </>
      )}
    </div>
  );
};

export default ScanDrive;
