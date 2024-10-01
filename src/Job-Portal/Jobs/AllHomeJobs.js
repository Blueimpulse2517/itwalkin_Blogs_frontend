import React, { useState, useEffect, useRef } from 'react';

import styles from "./Allobs.module.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Puff } from 'react-loader-spinner'
import location from "../img/icons8-location-20.png"
import graduation from "../img/icons8-graduation-cap-40.png"
import useScreenSize from '../SizeHook';
// import {SwipeableViews} from 'react-swipeable-views-v18';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 14
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


function Home() {

  const [jobs, setJobs] = useState([])
  const [nopageFilter, setNoPageFilter] = useState(false)
  const [Filtereredjobs, setFiltereredjobs] = useState([])

  const [Filterjobs, setFilterjobs] = useState([])

  const [isReadMore, setIsReadMore] = useState(true)
  const [showJobs, setshowJobs] = useState(false)
  const [showExperiance, setshowExperiance] = useState(false)
  const [showPackage, setshowPackage] = useState(false)
  const [PageLoader, setPageLoader] = useState(false)
  const [Result, setResult] = useState(false)
  const [NotFound, setNotFound] = useState("")
  const [Active, setActive] = useState("")
  const screenSize = useScreenSize();

  let jobTags = [
   { value: 'ReactJs', label: 'ReactJs' },
    { value: 'Mern Stack', label: 'Mern Stack' }, { value: 'C++, C', label: 'C++, C' },
    { value: 'Javascript', label: "Javascript" }, { value: 'Node js', label: 'Node js' },
    { value: 'Angular js', label: 'Angular js' }, { value: 'Vue js', label: 'Vue js' }, { value: 'NextJs', label: 'NextJs' },
    { value: 'Backend', label: 'Backend' }, { value: 'Frontend', label: 'Frontend' },
    { value: 'HTML-CSS', label: 'HTML-CSS' },{ value: 'MongoDB', label: 'MongoDB' },
    { value: 'MySql', label: 'MySql' },  { value: 'Flutter', label: 'Flutter' },{ value: 'Game Developer', label: 'Game Developer' },
    { value: 'Mobile App Developer', label: 'Mobile App Developer' },  { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'React Native', label: 'React Native' }, { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Security developer', label: 'Security developer' }, { value: 'Data science', label: 'Data science' },
    { value: 'Data Analyst', label: 'Data Analyst' },   { value: 'java ', label: 'java ' },
    { value: 'Python', label: 'Python' },
    { value: 'Graphic Developers', label: 'Graphic Developers' }, { value: 'AI Engineer', label: 'AI Engineer' },
    { value: 'Security Developer', label: 'Security Developer' }, { value: 'Cloud Developers', label: 'Cloud Developers' },
    ]

  let JobLocationTags = ["Bangalore", "Hyderabad", "Chennai", "Mumbai"]

  let navigate = useNavigate()

  useEffect(() => {
    // let studentAuth = localStorage.getItem("StudLog")
    let EmployeeAuth = localStorage.getItem("EmpLog")
    if (EmployeeAuth) {
      navigate("/postedjobs")
    }
  }, [])

  useEffect(() => {
    let studentAuth = localStorage.getItem("StudLog")
    if (studentAuth) {
      navigate("/alljobs")
    }
  }, [])
  useEffect(() => {
    let adminLogin = localStorage.getItem("AdMLog")
    if (adminLogin) {
      navigate("/BIAddmin@Profile")
    }
  }, [])


  // let menuRef = useRef();
  // let imgRef = useRef();

  // window.addEventListener("click", (e) => {
  //   if (e.target !== menuRef.current && e.target !== imgRef.current) {
  //     setshowJobs(false)
  //   }
  // })
  async function getjobs() {
    setPageLoader(true)
    setNoPageFilter(false)
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    await axios.get("/jobpost/getHomejobs", { headers })
      .then((res) => {

        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        setFilterjobs(sortedate)
        setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

  useEffect(() => {
    getjobs()
  }, [])

  async function applyforJob(id) {
    navigate("/JobSeekerLogin", { state: { Jid: id } })
    // window.open(`${Link}`)
  }
  async function applyforOtherJob(Link) {
    // navigate("/JobSeekerLogin", { state: { Jid: id } })
    window.open(`${Link}`)
  }

  // ...................search..........

  // async function search(e) {
  //   let key = e.target.value

  //   await axios.get(`https://itwalkin-backend.onrender.com/jobpost/searchJob/${key}`)
  //     .then((res) => {
  //       if (key) {
  //         setJobs(res.data)        
  //       } else {
  //         getjobs()
  //       }
  //     })
  // }

  const [searchKey, setsearchKey] = useState()
  // const [jobs, setJobs] = useState([])  
  async function searchIcon(key) {
    setNoPageFilter(true)
    setFiltereredjobs(key)
    setsearchKey(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...Filterjobs]
      const filteredItems = dubmyjobs.filter((user) => {
        if (JSON.stringify(user).includes(key.toLowerCase())) {
          return user
        }
      })
      setJobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }
  }
  async function search(e) {
    setNoPageFilter(true)
    let key = e.target.value
    setFiltereredjobs(key)
    setsearchKey(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...Filterjobs]
      const filteredItems = dubmyjobs.filter((user) => {
        if (JSON.stringify(user).includes(key.toLowerCase())) {
          return user
        }
      })
      setJobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }
  }



  function sortbyOldjobs() {
    let newjob = [...jobs]
    let oldjobSort = newjob.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    setJobs(oldjobSort)
  }

  function sortbyNewjobs() {
    let newjob = [...jobs]
    let newjobSort = newjob.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    setJobs(newjobSort)
  }


  function SdescendingOrder() {
    let newJobs = [...jobs]
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
    setJobs(sorted)
  }

  function SascendingOrder() {
    let newJObs = [...jobs]
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
    setJobs(sorted)
  }

  function EdescendingOrder() {
    let newjob = [...jobs]
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
    setJobs(sorted)

  }

  function EascendingOrder() {
    let newjob = [...jobs]
    // const Ascend = newjob.sort(function (a, b) {
    //   return (
    //     a.experiance - b.experiance
    //   )
    // })
    // setJobs(Ascend)
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.experiance, b.experiance)
    })
    setJobs(sorted)
  }
  function checkEmpHalf(empId, e) {
    
    navigate(`/CheckEmpHalfProfile/${empId}`)

  }


  // const [jobTitle, setjobTitle] = useState("")
  const [jobLocation, setjobLocation] = useState("AllL")
  const [jobTitle, setjobTitle] = useState("")
  // const [getJobTitle, setgetJobTitle] = useState(true)

  async function getjobTitleAll(all) {
    await axios.get("/jobpost/getjobs")
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)

      })
  }
  async function getjobsAllLoc(all) {
    await axios.get("/jobpost/getjobs")
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
      })
  }

  async function JobtitleFilter(jobTitle) {
    await axios.get(`/jobpost/getjobTitle/${jobTitle}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }


  async function getBothFiltered(jobTitle) {

    await axios.post(`/jobpost/getBothjobFilter/${jobLocation}`, { jobTitle })
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }


  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(10)
  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //5
  const records = jobs.slice(firstIndex, lastIndex)//0,5
  const npage = Math.ceil(jobs.length / recordsPerPage) // last page
  const number = [...Array(npage + 1).keys()].slice(1)

  function firstPage() {
    setCurrentPage(1)
  }

  function previous() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  function changeCurrent(id) {
    setCurrentPage(id)
  }
  function next() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }
  function last() {
    setCurrentPage(npage)
  }
  function handleRecordchange(e) {
    setrecordsPerPage(e.target.value)
    setCurrentPage(1)
  }

  async function filterByJobTitle(key) {
    setActive(key)
    setNoPageFilter(true)
    setFiltereredjobs(key)
    await axios.get(`/jobpost/getTagsJobs/${key}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
      })
  }

  async function getLocation(jobLocation) {
    setFiltereredjobs(jobLocation)
    setNoPageFilter(true)

    await axios.get(`/jobpost/getjobLocation/${jobLocation}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

  return (
    <>

      {screenSize.width > 850 ?
        <>



          <div className={styles.searchBothForNavWrapper}>
            <input className={styles.inputboxsearchNav} type="text" placeholder='Search for a Job / Skills / Location / Experiance' onChange={(e) => { search(e) }} />

            <i style={{ color: "rgb(40, 4, 99)", fontSize: "18px", paddingLeft: "8px", cursor: "pointer" }} onClick={() => { searchIcon(searchKey) }}
              class="fa fa-search" ></i>
          </div>
          {Result ?
            <h4 style={{ marginLeft: "40%", marginTop: "20px" }}> {jobs.length} matching Result Found  </h4>
            : ""
          }
        </>
        : ""
      }
      {/* <p>{jobs.length}</p> */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ color: " red", marginLeft: "4%" }}>Note: this website is under development process</p>

      </div>

      {screenSize.width > 850 ?
        <>
        <div className={styles.LocationFilterWrapper}>
             {/* <button className={`${styles.JobLocationFilter}`}  name="filter" onClick={() =>
               { getjobs(); setActive("All") }} >All</button> */}
            {
              JobLocationTags.map((location, i) => {
                return (
                  <button className={location == "Chennai" || location == "Hyderabad" || location == "Mumbai" ?
                  styles.disable: Active ==="Bangalore"?  styles.locationActive :styles.JobLocationFilter} disabled={location == "Chennai" || 
                  location == "Hyderabad" || location == "Mumbai" || location == "Delhi"} name="filter" onClick={() => { getLocation(location.toLowerCase()); setActive("Bangalore") }} >{location}</button>

                )
              })
            }
          </div><br></br>

            <div className={styles.JobtitleFilterWrapper}>
              <buton className={Active === "All" ? styles.active : styles.JobtitleFilter} onClick={() => 
                { getjobs(); setActive("All") }}>All</buton>
              {
                jobTags.map((tags, i) => {
                  return (
                    <buton className={Active === tags.value ? styles.active : styles.JobtitleFilter} onClick={() => 
                      { filterByJobTitle(tags.value) }}>{tags.value} </buton>
                  )
                })
              }
          </div>

                    
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {nopageFilter ?
              <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>{Filtereredjobs}</span> from All Jobs</p>
              :
              <p style={{ fontWeight: 400, marginLeft: "10px" }}>showing {firstIndex + 1} to {lastIndex} latest jobs</p>
            }
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
          <div style={{marginBottom:"5px", marginTop:"0", marginLeft:"10px"}}>
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>  jobs per page
            </div>
          {/* <button >Previous</button>
          { number.map((job,index)=>{
              return(
                <button onClick={()=>{changeCurrent(job)}}>{job}</button>
              )
            })      }
          <button >Next</button>  */}

          <div className={styles.Uiwarpper}>
            <ul className={styles.ul} style={{ color: 'white', fontWeight: "bold" }}>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.CompanyName}`}>Company Name</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Source}`}>Source</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Jtitle}`}>Job Title</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.JobType}`}>JobType</li>

              {/* <li className={`${styles.li} ${styles.HliDescription}`}><b>Job description</b></li> */}
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.date}`}>Posted Date
                <p style={{display:"inline",  marginLeft:"6%", marginTop:"2px"}} >
                  <i onClick={sortbyNewjobs} className={`${styles.arrow} ${styles.up}`} ></i>
                  <i onClick={sortbyOldjobs} className={`${styles.arrow} ${styles.down}`}></i>
                </p>
              </li>
              {/* style={{ position:"absolute", display:"block"}} */}
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Location}`}>Location</li>

              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Package}`}>CTC
              <p style={{display:"inline", marginLeft:"-10%", marginTop:"5px"}}>

                  <i onClick={SdescendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={SascendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p>
              </li>

              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.experiance}`}>Experience
              <p style={{display:"inline", marginLeft:"0%", marginTop:"2px"}}>

                  <i onClick={EdescendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={EascendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p>
              </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.qualification}`}>Qualification</li>


              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Skills}`}>Skills Required</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Apply}`}>Apply</li>

            </ul>
            {PageLoader ?
              <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "49%", marginTop: "50px" }} />
              : ""
            }
            {!nopageFilter ?
              records.length > 0 ?
                records.map((items, i) => {
                  return (

                    <ul className={styles.ul} key={i}>
                      {
                        !items.Source ?

                          <li style={{ cursor: "pointer", textDecoration: "underline" }} className={`${styles.li} ${styles.CompanyName}`}
                            onClick={(e) => {checkEmpHalf(btoa(items.empId)) }}  >
                            {/* {items.Logo ?
                              < img style={{ width: "38px", height: "38px" }} src={items.Logo} />
                              : ""} 
                              <br></br>
                              */}
                            {items.companyName}</li>
                          :
                          <a style={{ cursor: "pointer", textDecoration: "underline" }} className={`${styles.li} ${styles.CompanyName}`} href={items.SourceLink} target="_blank" >
                            {/* {items.Logo ?
                              < img style={{ width: "38px", height: "38px" }} src={items.Logo} />
                              : ""}<br></br> */}
                            {items.Source}

                          </a>

                      }

                      {/* {items.Source ?
                        <a className={`${styles.li} ${styles.Source}`} href={items.SourceCompanyLink} target="_blank">{items.Source}</a>
                        :                         */}
                      <li className={`${styles.li} ${styles.Source}`} >Itwalkin</li>
                      {/* } */}

                      <li className={`${styles.li} ${styles.Jtitle}`} onClick={() => navigate(`/Jobdetails/${btoa(items._id)}`)} style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>{items.jobTitle}</li>
                      <li className={`${styles.li} ${styles.JobType}`}>{items.jobtype}</li>

                      {/* <li className={`${styles.li} ${styles.liDescription}`}>
                          {
                            items.jobDescription.map((descrip, di) => {
                              return (
                                <>
                                  {
                                    descrip.text.slice(0,50)
                                  }
                                </>
                              )
                            }).slice(0, 1)
                          }
  
                          <span onClick={() => navigate(`/Jobdetails/${items._id}`)} className={styles.seeMore}>
                            ...read more
                          </span>
                        </li> */}
                      <li className={`${styles.li} ${styles.date}`}>
                        {new Date(items.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </li>
                      <li className={`${styles.li} ${styles.Location}`}>{items.jobLocation[0].toUpperCase()+items.jobLocation.slice(1)}</li>
                      <li className={`${styles.li} ${styles.Package}`}>{items.salaryRange}L</li>
                      <li className={`${styles.li} ${styles.experiance}`}>{items.experiance}Y</li>
                      <li className={`${styles.li} ${styles.qualification}`}>{items.qualification}</li>
                      <li className={`${styles.li} ${styles.Skills}`}>{items.skills}</li>

                      <li className={`${styles.li} ${styles.Apply}`}>
                        {items.SourceLink ?
                          <button title='this will take to Source page' className={styles.Applybutton} onClick={() => {
                            applyforOtherJob(items.SourceLink)
                          }}>Apply</button>
                          :
                          <button className={styles.Applybutton} onClick={() => { applyforJob(items._id) }}>Apply</button>
                        }
                      </li>
                    </ul>
                  )
                })
                : <p style={{ marginLeft: "47%", color: "red" }}>No Record Found</p>
              :
              jobs.length > 0 ?
                jobs.map((items, i) => {
                  return (

                    <ul className={styles.ul} key={i}>
                      {
                        !items.Source ?

                          <li style={{ cursor: "pointer", textDecoration: "underline" }} className={`${styles.li} ${styles.CompanyName}`}
                            onClick={(e) => {checkEmpHalf(btoa(items.empId)) }}  >
                            {/* {items.Logo ?
                              < img style={{ width: "38px", height: "38px" }} src={items.Logo} />
                              : ""} 
                              <br></br>
                              */}
                            {items.companyName}</li>
                          :
                          <a style={{ cursor: "pointer", textDecoration: "underline" }} className={`${styles.li} ${styles.CompanyName}`} href={items.SourceLink} target="_blank" >
                            {/* {items.Logo ?
                              < img style={{ width: "38px", height: "38px" }} src={items.Logo} />
                              : ""}<br></br> */}
                            {items.Source}

                          </a>

                      }

                      {/* {items.Source ?
                        <a className={`${styles.li} ${styles.Source}`} >{items.Source}</a>
                        : */}
                      <li className={`${styles.li} ${styles.Source}`} >Itwalkin</li>

                      {/* } */}

                      <li className={`${styles.li} ${styles.Jtitle}`} onClick={() => navigate(`/Jobdetails/${btoa(items._id)}`)} style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>{items.jobTitle}</li>
                      <li className={`${styles.li} ${styles.JobType}`}>{items.jobtype}</li>

                      {/* <li className={`${styles.li} ${styles.liDescription}`}>
                          {
                            items.jobDescription.map((descrip, di) => {
                              return (
                                <>
                                  {
                                    descrip.text.slice(0,50)
                                  }
                                </>
                              )
                            }).slice(0, 1)
                          }
  
                          <span onClick={() => navigate(`/Jobdetails/${items._id}`)} className={styles.seeMore}>
                            ...read more
                          </span>
                        </li> */}
                      <li className={`${styles.li} ${styles.date}`}>
                        {new Date(items.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </li>
                      <li className={`${styles.li} ${styles.Location}`}>{items.jobLocation[0].toUpperCase()+items.jobLocation.slice(1)}</li>
                      <li className={`${styles.li} ${styles.Package}`}>{items.salaryRange}L</li>
                      <li className={`${styles.li} ${styles.experiance}`}>{items.experiance}Y</li>
                      <li className={`${styles.li} ${styles.qualification}`}>{items.qualification}</li>
                      <li className={`${styles.li} ${styles.Skills}`}>{items.skills}</li>

                      <li className={`${styles.li} ${styles.Apply}`}>
                        {items.SourceLink ?
                          <button title='this will take to Source page' className={styles.Applybutton} onClick={() => {
                            applyforOtherJob(items.SourceLink)
                          }}>Apply</button>
                          :
                          <button className={styles.Applybutton} onClick={() => { applyforJob(items._id) }}>Apply</button>
                        }
                      </li>
                    </ul>
                  )
                })
                : <p style={{ marginLeft: "47%", color: "red" }}>No Record Found</p>
            }
          </div>

          <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{marginTop:"14px", marginLeft:"10px"}} >
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>  jobs per page
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

        </>
        // Mobile View
        :
        <>
          <div className={styles.searchBoth}>
            <p className={styles.p}>Search </p>
            <input className={styles.inputboxsearch} type="text" placeholder='Search for a Job / Skills / Location / Experiance' onChange={(e) => { search(e) }} />
          </div>
          {Result ?
            <h4 style={{ marginLeft: "18.5%", marginTop: "10px" }}> {jobs.length} matching Result Found  </h4>
            : ""
          }
          {/* ...................... All Filter for Mobile */}

          <Carousel
            swipeable={true}
            draggable={false}
            responsive={responsive}
            autoPlay={false}
            autoPlaySpeed={4000}
            keyBoardControl={true}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            containerClass="carousel-container"
            infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >

            <div style={{ display: "flex" }}>
              <div className={styles.MobLocationFilterWrapper}>
                <label> <input className={styles.MobJobtitleFilter} type="radio" name="filter" onClick={() => { getjobs() }} />All</label>
                {
                  JobLocationTags.map((location, i) => {
                    return (
                      <label> <input className={styles.MobJobtitleFilter} type="radio" disabled={location == "Chennai" || location == "Hyderabad" || location == "Mumbai" || location == "Delhi"} name="filter" onClick={() => { getLocation(location.toLowerCase()) }} />{location}</label>

                    )
                  })
                }
              </div>

              <div className={styles.MobFilterJobTitleWrapper}>
                <label><input className={styles.MobJobtitleFilter} type="radio" name="filter" onClick={() => { getjobs() }} />All</label>
                {
                  jobTags.map((tags, i) => {
                    return (
                      <label><input className={styles.MobJobtitleFilter} type="radio" name="filter"
                        onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                    )
                  }).slice(0, 4)
                }
              </div>

              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input className={styles.MobJobtitleFilter} type="radio" name="filter"
                      onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                  )
                }).slice(4, 9)
                }
              </div>
            </div>
            {/* ........................up to here is 1st div and now from down here is 2nd div..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input className={styles.MobJobtitleFilter} type="radio" name="filter"
                      onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                  )
                }).slice(9, 14)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input className={styles.MobJobtitleFilter} type="radio" name="filter"
                      onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                  )
                }).slice(14, 19)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input className={styles.MobJobtitleFilter} type="radio" name="filter"
                      onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                  )
                }).slice(19, 24)
                }
              </div>
            </div>

          </Carousel>
          {/* <div style={{ display: "flex", marginLeft: "18px" }}>
          
            <div >
              <label> <input type="radio" name="location" checked={jobLocation === 'AllL'} onClick={() => { getjobsAllLoc(); setjobLocation("AllL") }} />All</label><br></br>
              <label> <input type="radio" name="location" checked={jobLocation === 'banglore'} onClick={() => { getLocation("banglore"); setjobLocation('banglore') }} />Banglore</label><br></br>
              <label> <input type="radio" name="location" disabled checked={jobLocation === 'chennai'} onClick={() => { getLocation("chennai"); setjobLocation('chennai') }} />Chennai</label><br></br>
              <label> <input type="radio" name="location" disabled checked={jobLocation === 'hyderabad'} onClick={() => { getLocation("hyderabad"); setjobLocation('hyderabad') }} />Hyderabad</label><br></br>
              <label> <input type="radio" name="location" disabled checked={jobLocation === 'mumbai'} onClick={() => { getLocation("mumbai"); setjobLocation('mumbai') }} />Mumbai</label><br></br>
              <label> <input type="radio" name="location" disabled checked={jobLocation === 'delhi'} onClick={() => { getLocation("delhi"); setjobLocation('delhi') }} />Delhi</label>
            </div>
            <br></br>

            <div >
              <label><input type="radio" name="jobtitle" onClick={() => { getjobTitleAll('all'); setjobTitle("all") }} />All</label>            <br></br>
              <label><input type="radio" name="jobtitle" onClick={() => { { jobLocation !== "AllL" ? getBothFiltered('java') : JobtitleFilter('java') } }} />Java developer</label> <br></br>
              <label><input type="radio" name="jobtitle" onClick={() => { { jobLocation !== "AllL" ? getBothFiltered('full') : JobtitleFilter('full') } }} />Full Stack Developer</label> <br></br>
              <label><input type="radio" name="jobtitle" onClick={() => { { jobLocation !== "AllL" ? getBothFiltered('front') : JobtitleFilter('front') } }} />Frontend Developer</label><br></br>
              <label><input type="radio" name="jobtitle" onClick={() => { { jobLocation !== "AllL" ? getBothFiltered('back') : JobtitleFilter('back') } }} />Backend developer</label> <br></br>
              <label><input type="radio" name="jobtitle" onClick={() => { { jobLocation !== "AllL" ? getBothFiltered('python') : JobtitleFilter('python') } }} />Python Developer</label>
            </div>
          </div> */}


          {PageLoader ?
            <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "40%", marginTop: "50px" }} />
            : ""
          }
          <div id={styles.JobCardWrapper} >
            {
              jobs.length > 0 ?

                jobs.map((job, i) => {
                  return (
                    <>
                      <div className={styles.JobCard} key={i}>

                        <div className={styles.JobTitleDateWrapper}>
                          <p className={styles.jobTitle} onClick={() => {
                            window.scrollTo({
                              top: 0
                            })
                            navigate(`/Jobdetails/${btoa(job._id)}`)
                          }} >{job.jobTitle.toUpperCase()} </p>
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
                        <div className={styles.companyNameLocationWrapper}   >
                          <img className={styles.logo} src={job.Logo} />
                          {!job.Source ?

                            <> <span className={styles.companyName} onClick={() => { checkEmpHalf(btoa(job.empId)) }} >{job.companyName} </span><br></br></>
                            :
                            //  <> <span className={styles.companyName} onClick={()=>{checkEmpHalf(job.empId)}} >{job.companyName} </span><br></br></>
                            <> <a className={`${styles.companyName}`} href={job.SourceLink} target="_blank">{job.Source}</a><br></br> </>
                          }
                        </div>
                        <  img className={styles.jobLocationImage} src={location} />
                        <span className={styles.jobLocation}>{job.jobLocation[0].toUpperCase() + job.jobLocation.slice(1)} ,</span>
                        <span className={styles.qualificationAndExperiance}>

                          <  img className={styles.graduationImage} src={graduation} />

                          {job.qualification}, {job.experiance}Y Exp ,   {job.jobtype}
                          {/* <span className={styles.jobtypeAndDate}> {job.jobtype}</span> */}
                        </span><br></br>

                        <span className={styles.jobtypeAndDate}>Source</span> :

                        <> <span className={styles.skills}>ItWalkin</span><br></br></>
                        {/* } */}

                        <div className={styles.skillWrapper}>
                          <span className={styles.skillsHeading}>Skills: </span><span className={styles.skills}>{job.skills}</span><br></br>
                        </div>
                        <div className={styles.ApplyPackage}>
                          <p className={styles.salaryRange}><span>&#8377;</span>{job.salaryRange}L</p>
                          {job.SourceLink ?
                            <button className={styles.ApplyMobile} onClick={() => {
                              applyforOtherJob(job.SourceLink)
                            }}>Apply</button>
                            :
                            <button className={styles.ApplyMobile} onClick={() => { navigate("/JobSeekerLogin") }}><b>Apply</b></button>
                          }
                        </div>

                        <p className={styles.jobDescriptionHeading}>Job Description:</p>
                        <p className={styles.jobDescription}>
                          {/* {job.jobDescription} */}

                          {
                            job.jobDescription.map((descrip, di) => {
                              return (
                                <>

                                  {
                                    // descrip.type == "unordered-list-item" ?

                                    // <ul style={{ listStyleType: "disc" }}>
                                    //   <li style={{ marginTop: "-12px", marginLeft: "-20px" }}>
                                    //     {descrip.text.slice(0,50)}

                                    //   </li>
                                    // </ul>

                                    // : descrip.type == "ordered-list-item" ?

                                    //   <ul style={{ listStyleType: "disc" }} >
                                    //     <li style={{ marginTop: "-12px", marginLeft: "-20px" }}>

                                    //       {descrip.text}

                                    //     </li>
                                    //   </ul>
                                    //   :
                                    //   <>
                                    descrip.text.slice(0, 50)
                                    //     <br></br>
                                    //   </>

                                  }

                                </>
                              )
                            }).slice(0, 1)
                          }
                          <span onClick={() => {
                            window.scrollTo({
                              top: 0
                            })
                            navigate(`/Jobdetails/${job._id}`)
                          }} className={styles.seeMore}>
                            ...read more
                          </span>
                        </p>


                      </div>
                    </>
                  )
                })
                : <p style={{ marginLeft: "35%", color: "red" }}>No Record Found</p>


            }

          </div>

        </>
      }
    </>

  )
}

export default Home

// .......cards.......

{/* <div className={styles.carwrapper}>
              {jobs.map((items, i) => {
                return (
                  <div className={styles.card}>
                    <div className={styles.AlltexWrapper}>
                      <p className={styles.text}>Job Title :{items.jobTitle}</p>
                      <p className={styles.text}>Job Location:</p><a>{items.jobLocation.toUpperCase()}</a>
                      <p className={styles.text}> Package : {items.salaryRange}</p>
                      <p className={styles.text}> Experiance Required :{items.experiance}</p>
                      <p className={styles.text}> Skills Required :{items.skills}</p>
                      <div className={styles.descriptionAndApply}>
                        <p className={styles.description}>
                          ......... {items.jobDescription} ........
                          {items.jobDescription.slice(0, 60)}
                          <span onClick={() => navigate(`/Jobdetails/${items._id}`)} className={styles.seeMore}>
                            ...read more
                          </span>
                        </p>
                        <button className={styles.button} onClick={applyforJob}>Apply </button>
                      </div>
                    </div>
                  </div>
                )
              })
              }
            </div> */}
