import React, { useEffect, useState } from "react";
import styles from "./LiveTvDisplay.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { use } from "react";

const LiveTvDisplay = () => {
  const [allCandidates, setAllCandidates] =useState([]);
  const [jobSeekerList, setJobSeekerList] = useState([]);
  const [pageLoader, setPageLoader]=useState(false);
  const[jobSeekerId, setJobSeekerIds]=useState([]);
let params = useParams();

//   async function postJob() {
//     const headers = { authorization: 'BlueItImpulseWalkinIn' };
//     await axios.get(`/walkinRoute/walkindetails/${atob(params.id)}`,{headers}) 
//         .then((res) => {
//             let result = (res.data)
//             console.log(result)
//             if (result) {
//               const list = result.WaitingArea.map(item => ({
//                 jobSeekerId: item.jobSeekerId[0]?.jobSeekerId,
//                 tokenNo: item.tokenNo[0],
//                 createdDateTime:item.createdDateTime,
//                 updatedDateTime:item.updatedDateTime,
//               }));
//               setJobSeekerList(list);
//             }
//             else if (result == "field are missing") {
//               console.log("failed to fetch data")
//             }
            
//         }).catch((err) => {
//             alert("server issue occured", err)
//         })

// }

async function postJob() {
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

      setJobSeekerList(uniqueList);
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


async function findList() {
  setPageLoader(true)
  try {
    // create an array of requests for all job seekers
    console.log("jobseekerlist",jobSeekerList)
    const requests = jobSeekerList.map((job) =>
      axios.get(`/StudentProfile/viewProfile/${job.jobSeekerId}`)
    );

    const responses = await Promise.all(requests);

    // combine with jobSeekerList details
    const result = responses.map((res, index) => {
      const profile = res.data.result; // adjust based on your actual API
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
  }
}




useEffect(() => {
  console.log("jsl",jobSeekerList)
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
        <h2 className={styles.title}>HR Cabins</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cabin No</th>
              <th>Token</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {pageLoader ? (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>Data Loading...</td>
    </tr>
  ) :getCabinSlice().length>0?
            getCabinSlice().map((item, index) => (
               
              <tr key={item.token}>
                {console.log(item)}
                <td>{item.cabinNo}</td>
                <td>{item.token}</td>
                <td>{item.name}</td>
              </tr>
            )): (
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
