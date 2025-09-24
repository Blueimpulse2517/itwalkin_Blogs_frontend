import React, { useEffect, useState } from "react";
import styles from "./LiveTvDisplay.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { use } from "react";

const LiveTvDisplay = () => {
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] =useState([]);
  const [jobSeekerList, setJobSeekerList] = useState([]);
  const [pageLoader, setPageLoader]=useState(true);
const[pageLoader1,setPageLoader1]=useState(true)
  const[jobSeekerId, setJobSeekerIds]=useState([]);
let params = useParams();

  const [jobseeker, setJobseeker] = useState(null);

async function postJob() {
  // setPageLoader(true)
  // setPageLoader1(true)
  const headers = { authorization: 'BlueItImpulseWalkinIn' };
  try {
    const res = await axios.get(`/walkinRoute/walkindetails/${atob(params.id)}`, { headers });
    const result = res.data;
    console.log(result);

    if (result && result.WaitingArea) {
      // Map WaitingArea into list
      const list = result.WaitingArea.map(item => ({
        jobSeekerId: item.jobSeekerId[0]?.jobSeekerId,
        tokenNo: item.tokenNo[0],
        createdDateTime: new Date(item.createdDateTime),
        updatedDateTime: new Date(item.updatedDateTime),
      }));

      // Deduplicate by jobSeekerId -> keep the latest createdDateTime
      const uniqueMap = new Map();
      list.forEach(item => {
        const existing = uniqueMap.get(item.jobSeekerId);
        if (!existing || item.createdDateTime > existing.createdDateTime) {
          uniqueMap.set(item.jobSeekerId, item);
        }
      });

      // Convert map back to array
      const uniqueList = Array.from(uniqueMap.values());
      // if (uniqueList.length === 0) {
      //   setPageLoader(false);
      // }

      //---------------hr table details--------------
        const listofhrscanned  = result.HRCabin.map(item => ({
          jobSeekerId: item.jobSeekerId[0]?.jobSeekerId,
          tokenNo: item.tokenNo[0],
          createdDateTime: new Date(item.createdDateTime),
          updatedDateTime: new Date(item.updatedDateTime),
        }));
 
            const hrScannedIds = listofhrscanned.map(item => item.jobSeekerId);
 
            const filteredUniqueList = uniqueList.filter(
              jobSeeker => !hrScannedIds.includes(jobSeeker.jobSeekerId)
            );

              if (filteredUniqueList.length === 0) {
                setPageLoader(false);
              }
              // console.log("ull",uniqueList)
              // console.log("ful-wav",hrScannedIds)
              console.log("filtered",listofhrscanned)
            setJobSeekerList(filteredUniqueList)

        if (listofhrscanned.length > 0) {
          // Find the latest record by createdDateTime
          const latestRecord = listofhrscanned.reduce((latest, current) =>
            current.updatedDateTime > latest.updatedDateTime ? current : latest
          );

            setJobseeker(latestRecord);
            return latestRecord
        }
        else{
          setPageLoader1(false)
        }

    } else if (result === "field are missing") {
      console.log("failed to fetch data");
    }
  } catch (err) {
    alert("server issue occurred");
    console.error(err);
  }
}


useEffect(()=>{
    postJob()
},[])


useEffect(()=>{
  //  console.log("scanned hr qr code ids", jobseeker)
  //  if (
  //   !jobseeker ||
  //   !jobseeker.createdDateTime ||
  //   isNaN(new Date(jobseeker.createdDateTime).getTime())
  // ) {
  //   setPageLoader1(false)  
  //   return;
  // }
  if(jobseeker)
   getProfileHRQR();
},[jobseeker])

const[profileData1,setProfileData1]=useState([])

async function getProfileHRQR() {
  if (
    !jobseeker ||
    !jobseeker.createdDateTime ||
    isNaN(new Date(jobseeker.createdDateTime).getTime())
  ) {
    setPageLoader1(false)  
    return;
  }
  // if (!(jobseeker.createdDateTime && !isNaN(new Date(jobseeker.createdDateTime).getTime()))) {
  //   setPageLoader1(false)
  //   return;
  // }

const studId=jobseeker?.jobSeekerId;
if (!studId) {
  setPageLoader1(false)
  return;
}

  await axios.get(`/StudentProfile/viewProfile/${studId}`)
      .then((res) => {
          let result = res.data.result
          console.log("profile",result.message)
          
          setProfileData1([result])
          setPageLoader1(false)

      }).catch((err) => {
          alert("some thing went wrong")
          setPageLoader1(false)
      })
}


async function findList() {
  try {
    const requests = jobSeekerList.map((job) =>
      axios.get(`/StudentProfile/viewProfile/${job.jobSeekerId}`)
    );

    const responses = await Promise.all(requests);
    console.log("responses:", responses); 
    // combine with jobSeekerList details
    const result = responses.map((res, index) => {
      const profile = res.data.result;
      console.log("responses:", res);  // adjust based on your actual API
      return {
        jobSeekerId: jobSeekerList[index].jobSeekerId,
        tokenNo: jobSeekerList[index].tokenNo,
        name: profile?.name || "N/A",
      };
    });

    setAllCandidates(result);
    setPageLoader(false)
  } catch (err) {
    console.error("Error fetching names:", err);
    setPageLoader(false)
  }
}

useEffect(() => {
  
  if (jobSeekerList.length > 0) {
    findList();
  }

}, [jobSeekerList]);

 
const [allCabinAssignments, setallCabinAssignments]=useState([])
useEffect(()=>{
  
  if(allCandidates){
    const allCabin = allCandidates.map((c, i) => ({
      cabinNo: `Cabin ${(i % 5) + 1}`,
      token: c.tokenNo,
      name: c.name,
    }));

    setallCabinAssignments(allCabin);
    
  }
},[allCandidates])

  // Fixed Cabin Assignment (cabin 1 to 5, looped)
  

  const [waitingPage, setWaitingPage] = useState(0);
  const [cabinPage, setCabinPage] = useState(0);

  const rowsPerPage = 5;

  useEffect(() => {
    if(allCandidates && allCabinAssignments){
    const interval = setInterval(() => {
      setWaitingPage((prev) => (prev + 1) % Math.ceil(allCandidates.length / rowsPerPage));
      setCabinPage((prev) => (prev + 1) % Math.ceil(allCabinAssignments.length / rowsPerPage));
    }, 3000);
    return () => clearInterval(interval);
    }
  }, [allCandidates,allCabinAssignments]);

  const getWaitingSlice = () => {
    const start = waitingPage * rowsPerPage;
    return allCandidates.slice(start, start + rowsPerPage);
  };

  const getCabinSlice = () => {
    const start = cabinPage * rowsPerPage;
    return allCabinAssignments.slice(start, start + rowsPerPage);
  };

  return (
    <div className={styles.displayContainer}>
      {/* Waiting Area */}
      <div className={`${styles.panel} ${styles.waitingPanel}`}>
      <div style={{ width: "100%" }}>
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
</div> 


        <h2 className={styles.title}>Waiting Area</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>
  {pageLoader ? (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>Data Loading...</td>
    </tr>
  ) : getWaitingSlice().length > 0 ? (
    getWaitingSlice().map((item, index) => (
      <tr key={item.token}>
        <td>{waitingPage * rowsPerPage + index + 1}</td>
        <td>{item.name}</td>
        <td>{item.tokenNo}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>No data found</td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* HR Cabin Area */}
      <div className={`${styles.panel} ${styles.cabinPanel}`}>
        <h2 className={styles.title}>HR Cabin</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cabin No</th>
              <th>Token</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {pageLoader1 ? (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>Data Loading...</td>
    </tr>
  ) :profileData1.length>0?
            // getCabinSlice().map((item, index) => (
               
              <tr >

        <td>CabinNo 1</td>
        <td>{profileData1[0]?profileData1[0].name:"name not found"}</td>
        <td>{jobseeker.tokenNo?jobseeker.tokenNo:"no token found"}</td>
      </tr>
 
            // ))
            : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveTvDisplay;
