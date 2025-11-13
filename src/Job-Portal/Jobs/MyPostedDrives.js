import React, { useRef } from 'react'
import styles from "./myPostedjobs.module.css"
import { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Puff } from 'react-loader-spinner'
import useScreenSize from '../SizeHook';
import location from "../img/icons8-location-20.png" 
import graduation from "../img/icons8-graduation-cap-40.png"
import socketIO from 'socket.io-client';
import Footer from '../Footer/Footer';
import HTMLReactParser from 'html-react-parser'
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';


function MyPostedDrives(props) {
  useEffect( ()=>{    
    const socket = socketIO.connect(props.url,{
      auth:{
        token: JSON.parse(localStorage.getItem("EmpIdG"))
      }
    });
  },[])

  // let location = useLocation()
  // let empName= location.state.gserid 

  const [myjobs, setMyjobs] = useState([])
  const [myjobsforFilter, setmyjobsforFilter] = useState([])
  const [PageLoader, setPageLoader] = useState(false)
  const [Result, setResult] = useState(false)
  const [NoJobFound, setNoJobFound] = useState("")
  const screenSize = useScreenSize();
  const [Filterjobs, setFilterjobs] = useState([])

  const [Filtereredjobs, setFiltereredjobs] = useState([])
  const [nopageFilter, setNoPageFilter]=useState(false)

  const [isReadMore, setIsReadMore] = useState(true)
  const navigate = useNavigate()

  let empId = JSON.parse(localStorage.getItem("EmpIdG"))

  async function getjobs() {
    let userid = JSON.parse(localStorage.getItem("EmpIdG"))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("EmpLog"))) };
    setPageLoader(true)
    setTimeout(async () => {
      await axios.get(`/walkinRoute/getPostedwalkins/${empId}`, {headers})
        .then((res) => {
          let result = (res.data)
          // console.log("result",res.data)
          let sortedate = result.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setMyjobs(sortedate)
          setmyjobsforFilter(sortedate)
    setPageLoader(false)
          if (res.data.length == 0) {
            setNoJobFound("Loading....")
          }

        }).catch((err) => {
          alert("back error occured")
        })
    }, 1000)

  }
  useEffect(() => {
    getjobs()
  }, [])
  // .................delete function............
  async function deletejob(deleteid) {
    let userid = JSON.parse(localStorage.getItem("EmpIdG"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("EmpLog"))) };
    Swal.fire({
      title: 'Are you sure?',
      // icon: 'warning',
      width:"260",
      // position:"top",
      customClass:{
        popup:"alertIcon"
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/walkinRoute/deletewalkin/${deleteid}`, {headers})
          .then((res) => {
            getjobs()
          })
          .catch((err) => { alert("server error occured") })
      }
    })
  }
  function update(id) {
    // navigate("/Updatepostedjobs", { state: { getId: id } })
    navigate("/updatedposted-Drives", { state: { getId:id } })
  }

  // ........search ........................search...........................
  const [searchKey, setsearchKey] = useState()

  async function searchIcon(key) {
    if (key) {
      setResult(true)
      let dubmyjobs = [...myjobsforFilter]

      const filteredItems = dubmyjobs.filter((user) =>{
        if(JSON.stringify(user).toLowerCase().includes(key.toLowerCase())){
          return user
        }
    })
      setMyjobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }
  }


  async function search(e) {
    let key = e.target.value
    setsearchKey(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...myjobsforFilter]

      const filteredItems = dubmyjobs.filter((user) =>{
        if(JSON.stringify(user).toLowerCase().includes(key.toLowerCase())){
          return user
        }
    })
      setMyjobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }

  }

  function seeProfilejobSeekerId(id) {
    // window.open(`/Applied-User-Profile/${id}`, '_blank')
        window.open(`/Applied-DriveUser-Profile/${id}`, '_blank')
  }

  // ..........Sorting.......

  function sortbyOldjobs() {
    let newjob = [...myjobs]
    let oldjobSort = newjob.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    setMyjobs(oldjobSort)
  }

  function sortbyNewjobs() {
    let newjob = [...myjobs]
    let newjobSort = newjob.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    setMyjobs(newjobSort)
  }

  function sortbyOlddrives() {
    let newjob = [...myjobs]
    let oldjobSort = newjob.sort(function (a, b) {
      return new Date(a.driveDate) - new Date(b.driveDate);
    })
    setMyjobs(oldjobSort)
  }

  function sortbyNewdrives() {
    let newjob = [...myjobs]
    let newjobSort = newjob.sort(function (a, b) {
      return new Date(b.driveDate) - new Date(a.driveDate);
    })

    setMyjobs(newjobSort)
  }

  function SdescendingOrder() {
    let newJobs = [...myjobs]
    // const desendSort = newJobs.sort(function (a, b) {
    //   return (
    //     b.salaryRange - a.salaryRange
    //   )
    // })
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newJobs.sort((a, b) => {
      return collator.compare(b.salaryRange, a.salaryRange)
    })
    setMyjobs(sorted)
  }

  function SascendingOrder() {
    let newJObs = [...myjobs]
    // const AscendSort = newJObs.sort(function (a, b) {
    //   return (
    //     a.salaryRange - b.salaryRange
    //   )
    // })
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newJObs.sort((a, b) => {
      return collator.compare(a.salaryRange, b.salaryRange)
    })
    setMyjobs(sorted)
  }

  function EdescendingOrder() {
    let newjob = [...myjobs]
    // const descend = newjob.sort(function (a, b) {
    //   return (
    //     b.experiance - a.experiance
    //   )
    // })
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.experiance, a.experiance)
    })
    setMyjobs(sorted)

  }

  function EascendingOrder() {
    let newjob = [...myjobs]

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.experiance, b.experiance)
    })
    setMyjobs(sorted)
  }

  
  let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))
    
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage?recordsperpage:10)
  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //5
  const records = myjobs.slice(firstIndex, lastIndex)//0,5
  const npage = Math.ceil(myjobs.length / recordsPerPage) // last page
  const number = [...Array(npage + 1).keys()].slice(1)
  const [transferRecords, setTransferRecords] = useState("PostedJobs")

  function firstPage(id){
    setCurrentPage(1)
  }

function previous(){
  if(currentPage !==1){
    setCurrentPage(currentPage-1)
  }  
}
function changeCurrent(id){
  setCurrentPage(id)
}
function next(){
  if(currentPage !==npage){
    setCurrentPage(currentPage+1)
  }
}
function last(){
    setCurrentPage(npage)
}
function handleRecordchange(e){  
  sessionStorage.setItem("recordsperpage", JSON.stringify(e.target.value));
  let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))
  setrecordsPerPage(recordsperpage)  
  setCurrentPage(1)
}


const [selectedDriveId, setSelectedDriveId] = useState(null);
const [selectedHRDriveId, setSelectedHRDriveId] = useState(null);

const handleGenerateQR = (driveId) => {
  setSelectedDriveId(prevId => (prevId === driveId ? null : driveId));
};

const handleHRGenerateQR = (driveId) => {
  setSelectedHRDriveId(prevId => (prevId === driveId ? null : driveId));
};

  const generateQRUrl = (driveId) => {
    return `${window.location.origin}/scan/drive/${driveId}`;
  };

  const generateHRQRUrl = (driveId) => {
    return `${window.location.origin}/enter-cabin`;
  };

  const qrRefs = useRef({});

  const handleDownloadQR = (id) => {
  const qrNode = qrRefs.current[id];
  if (!qrNode) return;

  toPng(qrNode, { pixelRatio: 5 })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `QR-${id}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error("Failed to download QR code:", err);
    });
};

 const qrRef = useRef(null);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const qrCodeValue = () =>{
    return `${window.location.origin}/enter-cabin`;
  }

  const handleGenerateQRClick = () => {
    setIsQRVisible(true);
  };

  const handleDownloadQRClick = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, { pixelRatio: 5 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "interview-qr.png";
      link.click();
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  const selectedTag=useRef("")
      const updateTag=(tag)=>{
        selectedTag.current=tag
      }

  return (
    <>
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
      
 {screenSize.width > 850 ?
        <>
          {/* <div className={styles.searchBothForNavWrapper}>
            <input className={styles.inputboxsearchNav} type="text" placeholder='Search for a Job / Skills / Location / Experience' onChange={(e) => { search(e) }} />

            <i style={{ color: "rgb(40, 4, 99)", fontSize: "18px", cursor: "pointer" }} onClick={() => { searchIcon(searchKey) }}
              class="fa fa-search" ></i>
          </div> */}
          {/* {Result ?
            <h4 style={{ marginLeft: "40%", marginTop: "20px" }}> {myjobs.length} matching Result Found  </h4>
            : ""
          } */}
        </>
        : ""
      }      

     {screenSize.width>850?
       <>
       <div style={{display:"flex"}}>
    
        <p style={{marginLeft:"38%", marginTop:"-13px", fontSize:"large", fontWeight:"bold",}}>My Posted Walkin Drives</p>
        </div>

        <div style={{display:"flex", justifyContent:"space-between"}}>
            {        nopageFilter?
    <p style={{fontWeight:400, marginLeft:"10px"}}>Displaying <span style={{color:"blue"}}>{Filtereredjobs}</span> from All Jobs</p>
    :
    <p style={{fontWeight:400, marginLeft:"10px"}}>Showing {firstIndex+1} to {lastIndex} latest drives</p>
    }
<div className={styles.navigationWrapper}>
  <button disabled={currentPage === 1} style={{display:"inline", margin:"5px"}} className={styles.navigation} onClick={firstPage}>
  <i class='fas fa-step-backward'></i>
  </button>
  <button disabled={currentPage === 1} style={{display:"inline", margin:"5px"}} className={styles.navigation} onClick={previous}>
  <i class='fas fa-caret-square-left'></i>
  </button>
  <span>{currentPage}</span>
  <button disabled={currentPage === npage} style={{display:"inline", margin:"5px"}} className={styles.navigation} onClick={next}>
  <i class='fas fa-caret-square-right'></i>
  </button>
  <button disabled={currentPage === npage} style={{display:"inline", margin:"5px"}} className={styles.navigation} onClick={last}>
  <i class='fas fa-step-forward'></i>
  </button>
     </div>
     </div>
     <div style={{marginBottom:"5px", marginTop:"0", marginLeft:"10px"}}>
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              <option selected = {lastIndex === 10} value={10}>10</option>
              <option selected = {lastIndex === 25} value={25}>25</option>
              <option selected = {lastIndex === 50} value={50}>50</option>
              <option selected = {lastIndex === 100} value={100}>100</option>
            </select>  drives per page
            </div>
      
   <div className={styles.Uiwarpper}>
          <ul className={styles.ul}>
            <li className={styles.li}><b>Company Name</b></li>
            <li className={`${styles.li} ${styles.Jtitle}`}><b>Job Title</b></li>
            {/* <li className={`${styles.li} ${styles.liDescription}`}><b>Job description</b></li> */}
            <li className={`${styles.li} ${styles.Pdate}`}><b>Posted Date</b>
            <p className={styles.arrowWrapper}>
               <i onClick={sortbyNewdrives} className={`${styles.arrow} ${styles.up}`} ></i>
                <i onClick={sortbyOlddrives} className={`${styles.arrow} ${styles.down}`}></i>
            </p>
            </li>
            <li className={`${styles.li} ${styles.Pdate}`}><b>Drive Date / Time</b>
            <p className={styles.arrowWrapper}>
               <i onClick={sortbyNewjobs} className={`${styles.arrow} ${styles.up}`} ></i>
                <i onClick={sortbyOldjobs} className={`${styles.arrow} ${styles.down}`}></i>
            </p>
            </li>
            <li className={`${styles.li} ${styles.Location}`}><b>Location</b></li>

            <li className={`${styles.li} ${styles.Package}`}><b>CTC </b>
            <p className={styles.arrowWrapper}>
                  <i onClick={SdescendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={SascendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
            </p>
            </li>

            <li className={`${styles.li} ${styles.experiance}`}><b>Experience </b>
            <p className={styles.arrowWrapper}>
                  <i onClick={EdescendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={EascendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
            </p>
            </li>
            <li className={`${styles.li} ${styles.Skills}`}><b>Skills Required</b></li>
            <li className={`${styles.li} ${styles.Action}`}><b>Action</b></li>
            <li className={`${styles.li} ${styles.Action}`}><b>Reception Table</b></li>
            <li className={`${styles.li} ${styles.Action}`}><b>HR Table</b></li>
            <li className={`${styles.li} ${styles.Action}`}><b>Launch Live Display</b></li>
            <li className={`${styles.li} ${styles.NuApplied}`}><b>No of JobSeeker Applied</b></li>

          </ul>
          {PageLoader ?
           <> <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "49%", marginTop: "50px" }} />
              <div style={{display:"flex",justifyContent:"center", color:"red"}}>
              <h3>Loading...</h3>
              </div>
            </>: <>
          {
            records.length > 0 ?

            records.map((items, i) => {
                return (

                  <ul className={styles.ul} key={i}>

                    <li className={styles.li}>
                     {/* {items.Logo ?  < img style={{ width: "40%", height: "40px" }} src={items.Logo} />
                       : ""}<br></br> */}
                      {items.companyName}
                      </li>

                    <li className={`${styles.li} ${styles.Jtitle}`} style={{ color: "blue", cursor:"pointer" }} onClick={() => navigate(`/DriveDetails/${btoa(items._id)}?index=${i}`, {state: {transferRecords, },})}>{items.jobTitle.toUpperCase()}</li>
                    {/* <li className={`${styles.li} ${styles.liDescription}`}> 
                    { items.jobDescription? HTMLReactParser(items.jobDescription.toString()) :""}
                      <span style={{ color: "blue", cursor:"pointer" }} onClick={() => { navigate(`/Jobdetails/${btoa(items._id)}`) }} >...see more</span>
                    </li> */}
                    <li className={`${styles.li} ${styles.Pdate}`}>
                      {new Date(items.createdAt).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </li>
                    <li className={`${styles.li} ${styles.date}`}>
                          {new Date(items.driveDate).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}/{items.StartTime}
                    </li>
                    <li className={`${styles.li} ${styles.Location}`}>{items.venue?items.venue:"venue not updated"}</li>
                    <li style={{wordBreak:"break-word"}} className={`${styles.li} ${styles.Package}`}>{items.salaryRange==="Not disclosed" ||items.salaryRange===""  ? "Not Disclosed":<><span>&#8377;</span>{items.salaryRange} LPA</>}</li>
                    <li className={`${styles.li} ${styles.experiance}`}>{items.experiance}Yrs</li>
                    <li className={`${styles.li} ${styles.Skills}`}>{items.skills}</li>
                    <li className={`${styles.li} ${styles.Action}`}>
                      <div className={styles.Acbuttons}>
                        <button onClick={() => { update(items._id) }} className={`${styles.Abutton} ${styles.update}`}>update</button>
                        <button onClick={() => { deletejob(items._id) }} className={`${styles.Abutton} ${styles.delete}`}>delete</button>
                      </div>
                    </li>
                  
                    <li style={{position:"relative"}} className={`${styles.li} ${styles.Action}`}>
                        <button onClick={() => { handleGenerateQR(items._id) }} className={`${styles.Abutton} ${styles.update}`}>Generate QR</button>                 
                        {selectedDriveId === items._id && (
  <div style={{display:"flex", flexDirection:"column",alignItems:"center"}}>

    <div
      ref={(el) => (qrRefs.current[items._id] = el)}
      style={{ background: "white", padding: "16px", display: "inline-block" ,width:"100px", height:"100px"}}
    >
      <QRCode style={{width:"100px", height:"100px"}} value={generateQRUrl(items._id)} size={160} />
    </div>

    <button
      onClick={() => handleDownloadQR(items._id)}
      style={{ marginTop: "0.5rem", display: "block" }}
      className={`${styles.Abutton} ${styles.update}`}
    >
      Download QR
    </button>
  </div>
)}
                    </li>

                    <li className={`${styles.li} ${styles.Action}`}>
      <button
        className={`${styles.Abutton} ${styles.update}`}
        onClick={() => { handleHRGenerateQR(items._id) }}
      >
        Generate QR
      </button>

{selectedHRDriveId === items._id && (
  <div style={{display:"flex", flexDirection:"column",alignItems:"center"}}>

    <div
      ref={(el) => (qrRefs.current[items._id] = el)}
      style={{ background: "white", padding: "16px", display: "inline-block" ,width:"100px", height:"100px"}}
    >
      <QRCode style={{width:"100px", height:"100px"}} value={generateHRQRUrl(items._id)} size={160} />
    </div>
    <button
      onClick={() => handleDownloadQR(items._id)}
      style={{ marginTop: "0.5rem", display: "block" }}
      className={`${styles.Abutton} ${styles.update}`}
    >
      Download QR
    </button>
  </div>
)}
    </li>

    <li style={{display:"flex", flexDirection:"column", gap:"4px"}} className={`${styles.li} ${styles.Action}`}>
                        <button  onClick={() => navigate(`/live-tv-display/${btoa(items._id)}`)}
                        className={`${styles.Abutton} ${styles.update}`}>Live Tv Display</button>
                        <button  onClick={() => navigate(`/interview-screen/${btoa(items._id)}`)}
                        className={`${styles.Abutton} ${styles.update}`}>HR Dashboard</button>
    </li>

                    <li className={`${styles.li} ${styles.NuApplied}`}>
                      {items.jobSeekerId.length > 0 ?
                        <button className={`${styles.viewButton}`} onClick={() => { seeProfilejobSeekerId(btoa(items._id)) }}>{items.jobSeekerId.length}</button>
                        :
                        <button className={`${styles.viewButton}`} >{items.jobSeekerId.length}</button>

                      }
                    </li>
                  </ul>
                )
              })
              // :""
              : <p style={{ marginLeft: "44%", color: "red" }}>No Record Found</p>
          }
          </>
          }
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{marginTop:"14px", marginLeft:"10px"}} >
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              <option selected = {lastIndex === 10} value={10}>10</option>
              <option selected = {lastIndex === 25} value={25}>25</option>
              <option selected = {lastIndex === 50} value={50}>50</option>
              <option selected = {lastIndex === 100} value={100}>100</option>
            </select>  drives per page
            </div>

          <div className={styles.navigationWrapper}>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                <i class='fas fa-step-backward' ></i>
              </button>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={previous}>
                <i class='fas fa-caret-square-left'></i>
              </button>
              <span>{currentPage}</span>
              <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={next}>
                <i class='fas fa-caret-square-right'></i>
              </button>
              <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={last}>
                <i class='fas fa-step-forward'></i>
              </button>
            </div>
            </div>
            {/* <div style={{marginTop:"200px", position:"sticky", bottom:0}}>
          <Footer/>
        </div> */}
      </>
      :
      <> 

<p style={{marginLeft:"30%"}}>My Posted Walkin Drives</p>
{/* <button className={styles.searchButton} onClick={() => {
          navigate("/Search-Candidate")
        }}>Search Candidate</button> */}

<p style={{ marginLeft: "4%", color: "blue", fontWeight:"bold" }}> Total {myjobs.length} drives</p>
        <div className={styles.searchBoth}>
          {/* <p className={styles.p}>Search </p> */}
          {/* <input className={styles.inputboxsearch} type="text" placeholder='search for a posted job' onChange={(e) => { search(e) }} /> */}
        </div>
        {Result ?
            <h4 style={{ marginLeft: "34%", marginTop: "0px"}}> {myjobs.length} matching Result Found  </h4>
            : ""
          }
      <div id={styles.JobCardWrapper} >

{myjobs.length>0?
myjobs.map((job, i) => {
  return (
    <>
 <div className={styles.JobCard} key={i}>
                        
                        <div className={styles.JobTitleDateWrapper}>
        <p className={styles.jobTitle} onClick={() => {
  window.scrollTo({
    top:0
  })
  navigate(`/DriveDetails/${btoa(job._id)}?index=${i}`, {state: {selectedTag, },})}}>{job.jobTitle.toUpperCase()} </p>                      
        <p className={styles.Date}>{new Date(job.createdAt).toLocaleString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
        } </p>       

        </div>
        
        {/* <br></br> */}
        <div className={styles.companyNameLocationWrapper}  >
          <img className={styles.logo} src={job.Logo} />
          <span className={styles.companyName} >{job.companyName} </span><br></br>
          </div>
          
        <  img className={styles.jobLocationImage} src={location}  /> 
        <span className={styles.jobLocation}>{job.venue?job.venue:"venue not updated"} ,</span>
        <span className={styles.qualificationAndExperiance}>
        
        <  img className={styles.graduationImage} src={graduation}  /> 

          {job.qualification}, {job.experiance}Yrs Exp ,   {job.jobtype}
        {/* <span className={styles.jobtypeAndDate}> {job.jobtype}</span> */}
        </span><br></br>
        
 
                                     
                        <div className={styles.skillWrapper}>
                          <span className={styles.skillsHeading}>Skills: </span><span className={styles.skills}>{job.skills}</span><br></br>
                        </div>
                        <div style={{display:"flex", gap:"6px",marginLeft:"4%"}}>
            <span className={styles.skillsHeading}>Drive Date: </span><span className={styles.skills}>{new Date(job.driveDate).toLocaleDateString("en-IN")}</span></div>
            <br></br>
            <div style={{marginTop:"-13px",marginLeft:"10px",fontWeight:"bold"}}>
            {/* <span className={styles.skillsHeading}>Drive Time: </span><span className={styles.skills}>{job.time && `${((+job.time.split(":")[0] % 12) || 12)}:${job.time.split(":")[1]} ${job.time.split(":")[0] >= 12 ? "PM" : "AM"}`}</span> */}
            <span style={{marginTop:"10px"}} className={styles.skillsHeadings}>Drive Time: </span><span className={styles.skills}>{job.StartTime}</span>

         </div>
        <span className={styles.NoOfJobSeekersApplied}> No. of Job Seekers Applied:
        {job.jobSeekerId.length > 0 ?
                          <button className={`${styles.MobileviewButton}`} onClick={() => { seeProfilejobSeekerId(btoa(job._id)) }}>{job.jobSeekerId.length}</button>
                          :
                          <button className={`${styles.MobileZeroViewButton}`} >{job.jobSeekerId.length}</button>

                        }
        </span><br></br>


        <div className={styles.ApplyPackage}style={{width:"95%"}}>
          <span className={styles.salaryRange} style={{ marginLeft: "10px" }}>{job.salaryRange==="Not disclosed" ||job.salaryRange===""  ? "Not Disclosed":<><span>&#8377;</span>{job.salaryRange} LPA</>}</span>
          <div className={styles.MobileAcbuttons}>
          <button onClick={() => { update(job._id) }} className={` ${styles.MobileUpdate}`}>update</button>
          <button onClick={() => { deletejob(job._id) }} className={` ${styles.MobileDelete}`}>delete</button>
               </div>
        </div>


        <div style={{marginLeft:"4%"}}>

<li style={{position:"relative"}} className={`${styles.li} ${styles.Action}`}>
                <button style={{width:"144px"}} onClick={() => { handleGenerateQR(job._id) }} className={`${styles.Abutton} ${styles.update}`}>Generate Reception Table QR</button>                 
                {selectedDriveId === job._id && (
<div style={{display:"flex", flexDirection:"column",alignItems:"center", marginLeft:"74px"}}>

<div
ref={(el) => (qrRefs.current[job._id] = el)}
style={{ background: "white", padding: "16px", display: "inline-block" ,width:"100px", height:"100px"}}
>
<QRCode style={{width:"100px", height:"100px"}} value={generateQRUrl(job._id)} size={160} />
</div>

<button
onClick={() => handleDownloadQR(job._id)}
style={{ marginTop: "0.5rem", display: "block", width:"103px" }}
className={`${styles.Abutton} ${styles.update}`}
>
Download QR
</button>


</div>
)}
</li>


</div>

{/* </div> */}

<div style={{marginLeft:"4%"}}>
<li className={`${styles.li} ${styles.Action}`}>
<button
 style={{width:"144px"}}
className={`${styles.Abutton} ${styles.update}`}
onClick={() => { handleHRGenerateQR(job._id) }}
>
Generate HR Table QR
</button>


{selectedHRDriveId === job._id && (
<div style={{display:"flex", flexDirection:"column",alignItems:"center", marginLeft:"74px"}}>

<div
ref={(el) => (qrRefs.current[job._id] = el)}
style={{ background: "white", padding: "16px", display: "inline-block" ,width:"100px", height:"100px"}}
>
<QRCode style={{width:"100px", height:"100px"}} value={generateHRQRUrl(job._id)} size={160} />
</div>

<button
onClick={() => handleDownloadQR(job._id)}
style={{ marginTop: "0.5rem", display: "block", width:"103px" }}
className={`${styles.Abutton} ${styles.update}`}
>
Download QR
</button>
</div>
)}
</li>

</div>


<div style={{marginLeft:"4%"}}>
<li className={`${styles.li} ${styles.Action}`}>
<button style={{width:"145px"}} onClick={() => navigate(`/live-tv-display/${btoa(job._id)}`)} className={`${styles.Abutton} ${styles.update}`}>Live Tv Display</button>
</li>

</div>

<div style={{marginLeft:"4%"}}>
<li className={`${styles.li} ${styles.Action}`}>
<button style={{width:"145px"}} onClick={() => navigate(`/interview-screen/${btoa(job._id)}`)} className={`${styles.Abutton} ${styles.update}`}>HR Dashboard</button>
</li>

</div>




    <p className={styles.jobDescriptionHeading}>Job Description:</p>

        <p className={styles.jobDescription}> 
        {/* {job.jobDescription} */}
        {
                    job.jobDescription? 
                    HTMLReactParser(job.jobDescription.slice(0,100)
                    .toString())                    
                    :""                
                    }
                  <span style={{ color: "blue", cursor:"pointer" }} onClick={() => navigate(`/DriveDetails/${btoa(job._id)}?index=${i}`, {state: {selectedTag, },})} >...see more</span>
                   
          </p>
      </div>
    </>
  )
})
: <p style={{ marginLeft: "39%", color: "red" }}> No Drives Found</p>
}

</div>
<div style={{marginTop:"120px"}}>
          <Footer/>
        </div>
      </>
}


    </>

  )
}

export default MyPostedDrives