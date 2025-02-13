
import React from 'react'
import styles from "./AppliedUserProfile.module.css"
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import useScreenSize from '../SizeHook';
import profileDp from "../img/user_3177440.png"
import Arrowimage from '../img/icons8-arrow-left-48.png'
import {jobTags} from '../Tags'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const responsive = {

  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 14
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 8
  },
  mobile: {
    breakpoint: { max: 864, min: 0 },
    items: 1
  }
};

function SearchCandidate() {
  let params = useParams()
  let navigate = useNavigate()

  const [Candidate, setCandidate] = useState([])
  const [FilCandidate, setFilCandidate] = useState([])

  const [nopageFilter, setNoPageFilter] = useState(false)
  const [Filtereredjobs, setFiltereredjobs] = useState([])


  const [jobSeekers, setjobSeekers] = useState([])
  const [NotFound, setNotFound] = useState("")
  const [Result, setResult] = useState(false)
  const screenSize = useScreenSize();
  const [Active, setActive] = useState([])
  const [jobLocation, setjobLocation] = useState("AllL")
  const Location = ['Bangalore']


  const [totalCount, settotalCount] = useState()
  
  let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSearchHome"))

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage?recordsperpage:10)

  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //0
  const records = Candidate.slice(firstIndex, lastIndex)//0,5
  const npage = Math.ceil(totalCount / recordsPerPage) // last page

  async function gettotalcount() {
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    await axios.get("/StudentProfile/getTotalCount", { headers })
      .then((res) => {
        // console.log(res.data.result)
        settotalCount(res.data.result)
      }).catch((err) => {
        alert("something went wrong")
      })
  }
   
  async function getAllJobSeekers() {
    setCount(1)
    setActive([])
    setJobTagsIds([])

    setNoPageFilter(false)
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    // await axios.get("StudentProfile/getAllJobseekers", { headers })
    await axios.get(`/StudentProfile/getLimitJobs/${recordsPerPage}`, { params: { currentPage }, headers })

      .then((res) => {
        let result = (res.data)
        // console.log(result)
        gettotalcount()
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCandidate(sortedate)
        setFilCandidate(sortedate)
      })
  }

    useEffect(() => {
      if (jobTagsIds.length < 1) {
    getAllJobSeekers()

      } else {
        getTagId();
      }
    }, [currentPage, recordsPerPage])

  const [searchKey, setsearchKey] = useState()
  async function searchIcon(key) {
    setFiltereredjobs(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...FilCandidate]
      const filteredItems = dubmyjobs.filter((user) =>
        JSON.stringify(user).toLowerCase().includes(key.toLowerCase())
      )
      setCandidate(filteredItems)
    } else {
      getAllJobSeekers()
      setResult(false)
    }
  }
  async function search(e) {
    let key = e.target.value
    setsearchKey(key)
    setFiltereredjobs(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...FilCandidate]
      const filteredItems = dubmyjobs.filter((user) =>
        JSON.stringify(user).toLowerCase().includes(key.toLowerCase())
      )
      setCandidate(filteredItems)
    } else {
      getAllJobSeekers()
      setResult(false)
    }
  }

  async function getLocation(jobLocation) {
    setCount(1)
    setActive([])


    setFiltereredjobs(jobLocation)
  setNoPageFilter(true)
    await axios.get(`/StudentProfile/getStuLocation/${jobLocation}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCandidate(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

    
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

  function handleRecordchange(e){  
    sessionStorage.setItem("recordsperpageSearchHome", JSON.stringify(e.target.value));
    let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSearchHome"))
    setrecordsPerPage(recordsperpage) 
    setCurrentPage(1)
  }
  
  const [count, setCount]=useState(1)

    const [jobTagsIds, setJobTagsIds] = useState([])

      useEffect(() => {
        if (jobTagsIds.length > 0) {
          getTagId();
        }
      }, [jobTagsIds])

      let ids = jobTagsIds.map((id) => {
        return (
          id._id
        )
      })
      const uniqueList = [...new Set(ids)];
      async function getTagId() {
        settotalCount(uniqueList.length)
        await axios.get(`/StudentProfile/jobTagsIds/${uniqueList}`, {
          params: { currentPage, recordsPerPage }
        })
          .then((res) => {
            // console.log("data from uique id's",res.data)
            let result = res.data
            let sortedate = result.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setCandidate(sortedate)
            if (count == 2) {
              setCurrentPage(1)
            }
    
          })
      }
    
      useEffect(()=>{
        if(Active.length>0){
          changeTags()
        }
      },[Active])
    
  

  async function filterByJobTitle(key) {
    if(count==1){
      setCandidate([])
    }
    setCount(prev=>prev+1)
    const isIndex=Active.findIndex((present)=>{
return(
  present===key
)
    })
    if(isIndex<0){
    var updatedActive = [...Active, key]; 
    setActive(updatedActive);
    }else{
      const IndexId=Active.findIndex((present)=>{
        return(
          present==key
        )
            })
            Active.splice(IndexId,1)
                if(Active.length===0){
                  getAllJobSeekers()
                  return false
    }
    changeTags()
  }}

  async function changeTags(key){

    setNoPageFilter(true)
    setFiltereredjobs(key)
    await axios.get(`/StudentProfile/getTagsJobs/${Active}`)
      .then((res) => {
        let result = (res.data)
        // console.log(result)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobTagsIds(sortedate)
      })
  }


  function CheckProfile(StudID) {
    // navigate(`/Check-Profile/${StudID}`)
    window.open(`/Check-Profile/${StudID}`, '_blank')
  }


  function NoticeAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.NoticePeriod, a.NoticePeriod)
    })
    setCandidate(sorted)
  }
  

  function NoticeDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.NoticePeriod, b.NoticePeriod)
    })
    setCandidate(sorted)
  }
  
  // .......age Sorting.......
  function AgeDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.age, b.age)
    })
    setCandidate(sorted)
  }
  function AgeAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.age, a.age)
    })
    setCandidate(sorted)
  }
  
  
  // .......Experiance Sorting.......
  function ExpDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.Experiance, b.Experiance)
    })
    setCandidate(sorted)
  }
  function ExpAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.Experiance, a.Experiance)
    })
    setCandidate(sorted)
  }
    
  // .......Curent CTC Sorting.......
  function CurrCTCDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.currentCTC, b.currentCTC)
    })
    setCandidate(sorted)
  }
  function CurrCTCAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.currentCTC, a.currentCTC)
    })
    setCandidate(sorted)
  }
  

    
  // .......Expected CTC Sorting.......
  function ExpCTCDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.ExpectedSalary, b.ExpectedSalary)
    })
    setCandidate(sorted)
  }
  function ExpCTCAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.ExpectedSalary, a.ExpectedSalary)
    })
    setCandidate(sorted)
  }
    
  // .......Last Active Sorting.......
  function LastActDescendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.updatedAt, b.updatedAt)
    })
    setCandidate(sorted)
  }

  function LastActAscendingOrder (){
    let newjob = [...FilCandidate]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.updatedAt, a.updatedAt)
    })
    setCandidate(sorted)
  }



  return (
    <>
    {screenSize.width > 850 ?
        <>
        <div className={styles.HomeNavConetenetWrapper}>


<div className={styles.HomeLocationFilterWrapper}>
  {
    Location.map((location, i) => {
      return (
        <>
        <label className={styles.JobLocationFilter}>
        <input checked type="radio"  disabled={location == "Chennai" ||
        location == "Hyderabad" || location == "Mumbai" || location == "Delhi"} name="filter" onClick={() => 
            { getAllJobSeekers() }} />{location}</label><br></br>
            </>
      )
    })
  }
</div>          
<div className={styles.searchBothForNavWrapper}>
  <input className={styles.inputboxsearchNav} type="text" placeholder='Search for a Job / Skills / Location / Experiance' onChange={(e) => { search(e) }} />

  <i style={{ color: "rgb(40, 4, 99)", fontSize: "18px", cursor: "pointer" , marginLeft:"3%"}} onClick={() => { searchIcon(searchKey) }}
    class="fa fa-search" ></i>
</div>
</div>
          {Result ?
            <h4 style={{ marginLeft: "40%", marginTop: "20px" }}> {Candidate.length} matching Result Found  </h4>
            : ""
          }
        </>
        : ""
      }
     
      {screenSize.width > 850 ?
        <>
        <div style={{marginTop:"10px"}}></div>
                   
            <div className={styles.JobtitleFilterWrapper}>
              <buton className={Active.length===0?styles.active:styles.JobtitleFilter} onClick={() => 
                { getAllJobSeekers() }}>All</buton>
              {
                jobTags.map((tags, i) => {
                  return (
                    // <buton className={Active === tags.value ? styles.active : styles.JobtitleFilter} onClick={() => 
                    //   { filterByJobTitle(tags.value) }}>{tags.value} </buton>
                                   
                      <button disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                        className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                        styles.TagHeading: 
                        //  Active === tags.value ? 
                        Active.findIndex(  (present)=>{
                          return(
                            present===tags.value
                          )
                              }) >=0?
                        styles.active : styles.JobtitleFilter} onClick={() => 
                          { filterByJobTitle(tags.value) }}>{tags.value} </button>
                  )
                })
              }
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
      
{nopageFilter ?
              <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>
                {uniqueList.length} </span>Jobs with following matching tags:
                <span style={{ color: "blue" }}>{Active.toString()}</span></p>
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
              <option selected = {lastIndex === 10} value={10}>10</option>
              <option selected = {lastIndex === 25} value={25}>25</option>
              <option selected = {lastIndex === 50} value={50}>50</option>
              <option selected = {lastIndex === 100} value={100}>100</option>
            </select>  jobs per page
            </div>

          <div className={styles.AllUiWrapper}>
            <ul className={styles.ul} >
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.nameHome}`}><b>Jobseeker Name</b>  </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.NoticePeriod}`}><b>Notice Period</b> 
              <p style={{ display: "inline", marginLeft:"4%"}}>
                  <i onClick={NoticeAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={NoticeDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p> 
               </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.age}`}> <b>Age</b>
              <p style={{ display: "inline", marginLeft: "7%" }}>
                  <i onClick={AgeAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={AgeDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p>
               </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Qualification}`}>  <b>Qualif</b> </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Experiance}`}><b>Experience</b> 
              <p style={{ display: "inline", marginLeft: "1%" }}>
                  <i onClick={ExpAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={ExpDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p>  </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Skills}`}> <b>Skills</b> </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.currentCTC}`}> <b>Cur. CTC</b> 
              <p style={{ display: "inline", marginLeft: "2%" }}>
                  <i onClick={CurrCTCAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={CurrCTCDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p> 
              </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.ExpectedSalary}`}><b>Exp. CTC</b>
              <p style={{ display: "inline", marginLeft: "2%" }}>
                  <i onClick={ExpCTCAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={ExpCTCDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p> 
               </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.LastActive}`}><b>Last Active</b> 
              <p style={{ display: "inline", marginLeft: "1%" }}>
                  <i onClick={LastActAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={LastActDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p> 
                </li>
              <li style={{backgroundColor:" rgb(40, 4, 99)"}} className={`${styles.li} ${styles.currentCTC}`}> <b>Contact</b> </li>

            </ul>

            {
                  Candidate.length > 0 ?

                  Candidate.map((Applieduser, i) => {
                    return (
                      <>

                        <ul className={styles.ul} key={i}>
                          <li className={`${styles.li} ${styles.nameHome}`}><s>Locked</s></li>

                          <li className={`${styles.li} ${styles.NoticePeriod}`}> {Applieduser.NoticePeriod ?
                            Applieduser.NoticePeriod : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.age}`}> {Applieduser.age ?
                            Applieduser.age : <li className={styles.Nli}>N/A</li>}
                    
                             </li>
                          <li className={`${styles.li} ${styles.Qualification}`}> {Applieduser.Qualification ?
                            Applieduser.Qualification : <li className={styles.Nli}>N/A</li>}
                    
                             </li>
                          <li className={`${styles.li} ${styles.Experiance}`}> {Applieduser.Experiance ?
                            Applieduser.Experiance : <li className={styles.Nli}>N/A</li>} 
                     
                            </li>
                          <li className={`${styles.li} ${styles.Skills}`}> {Applieduser.Skills ?
                            Applieduser.Skills : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.currentCTC}`}> {Applieduser.currentCTC ?
                            Applieduser.currentCTC : <li className={styles.Nli}>N/A</li>} 
                     
                            </li>
                          <li className={`${styles.li} ${styles.ExpectedSalary}`}> {Applieduser.ExpectedSalary ?
                            Applieduser.ExpectedSalary : <li className={styles.Nli}>N/A</li>}
                </li>
                          <li className={`${styles.li} ${styles.LastActive}`}>
                            {new Date(Applieduser.updatedAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </li>
                          <li  className={`${styles.li} ${styles.currentCTC}`}>
                            <button className={styles.getContact}  onClick={()=>{navigate("/EmployeeLogin")}}> Get Contact</button>

                           </li>


                        </ul>
                      </>

                    )
                  })
                  :
                  <p style={{ marginLeft: "45%", color: "red" }}>No Record found</p>
                                             
                }
          </div >

          <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{marginTop:"10px", marginLeft:"10px"}}>
            Show  <select onChange={(e)=>{handleRecordchange(e)}}>
              <option selected = {lastIndex === 10} value={10}>10</option>              
              <option selected = {lastIndex === 25} value={25}>25</option>              
              <option selected = {lastIndex === 50} value={50}>50</option>              
              <option selected = {lastIndex === 100} value={100}>100</option>              
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
        :
        <>
         <div className={styles.searchBoth}>
        <p className={styles.p}>Search </p>
        <input className={styles.inputboxsearch} type="text" placeholder="candidate's/skills/experience/qualification/noticeperiod" onChange={(e) => { search(e) }} />
      </div>
      {Result ?
        <h4 style={{ marginLeft: "19%", marginTop: "10px" }}> {Candidate.length} matching Result Found  </h4>
        : ""
      }

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
              

              <div className={styles.MobFilterJobTitleWrapper}>
                <label><input className={styles.MobJobtitleFilter} type="radio" name="filter" onClick={() => { getAllJobSeekers() }} />All</label>
                {
                  jobTags.map((tags, i) => {
                    return (
                      <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                        className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                        styles.TagHeading: styles.MobJobtitleFilter} 
                      
                        type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                   
                      )
                  }).slice(0, 4)
                }
              </div>

              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(4, 9)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(9, 14)
                }
              </div>
            </div>

            {/* ....up to here is 1st div i.e button in 1st display and now from down here is 2nd div..i.e 2nd display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(14, 19)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(19, 24)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(24, 29)
                }
              </div>
            </div>
            {/* ....from down here is 3rd div..i.e 3rd display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(29, 34)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(34, 39)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(39, 44)
                }
              </div>
            </div>
            {/* .................from down here is 4th div..i.e 4th display....................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(44, 49)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(49,54)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(54, 59)
                }
              </div>
            </div>
            {/* .................from down here is 5th div..i.e 5th display....................... */}

            <div style={{ display: "flex" }}>              

              <div className={styles.MobFilterJobTitleWrapper}>
                {
                  jobTags.map((tags, i) => {
                    return (
                      <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                        className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                        styles.TagHeading: styles.MobJobtitleFilter} 
                        type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                   
                      )
                  }).slice(59, 64)
                }
              </div>

              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(64, 69)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(69, 74)
                }
              </div>
            </div>

            {/* ....ufrom down here is 6th div..i.e 6th display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(74, 79)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(79, 84)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(84, 89)
                }
              </div>
            </div>
            {/* ....from down here is 7th div..i.e 7th display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(89, 94)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(94, 99)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(99, 104)
                }
              </div>
            </div>
            {/* .................from down here is 8th div..i.e 8th display....................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(104, 109)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(109,114)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(114, 119)
                }
              </div>
            </div>
            {/* .................from down here is 9th div..i.e 9th display....................... */}

            <div style={{ display: "flex" }}>
              
              <div className={styles.MobFilterJobTitleWrapper}>
                {
                  jobTags.map((tags, i) => {
                    return (
                      <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                        className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                        tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                        styles.TagHeading: styles.MobJobtitleFilter} 
                        type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                                         )
                  }).slice(119, 124)
                }
              </div>

              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(124, 129)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(129, 134)
                }
              </div>
            </div>

            {/* ....from down here is 10th div..i.e 10th display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(134, 139)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(139, 144)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(144, 149)
                }
              </div>
            </div>
            {/* ....from down here is 11th div..i.e 11th display..................................... */}
            <div style={{ display: "flex" }}>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(149, 154)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(154, 159)
                }
              </div>
              <div className={styles.MobFilterJobTitleWrapper}>
                {jobTags.map((tags, i) => {
                  return (
                    <label><input disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                      styles.TagHeading: styles.MobJobtitleFilter} 
                      type= "radio" name="filter"  onClick={() => { filterByJobTitle(tags.value) }} />{tags.value}</label>
                 
                  )
                }).slice(159, 164)
                }
              </div>
            </div>            
          </Carousel>


          <div id={styles.JobCardWrapper} >

            {
            Candidate.length>0?
                
            Candidate.map((job, i) => {
              return (
                <>
                  <div className={styles.JobCard} key={i}>
                  <span className={styles.span} style={{display:"inline", marginLeft:"8px"}}>Last Active : </span>
                  <p style={{display:"inline", marginLeft:"80px", fontSize:"xx-smaller"}}>{new Date(job.updatedAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}</p>
                    <div style={{ display: "flex", marginTop:"-20px" }}>
                      <div className={styles.LeftTable}>
                        <span className={styles.span}>Jobseeker Name :  </span> <br></br>
                        {/* <span className={styles.span}><u>Last Active :  </u></span> <br></br> */}

                        <span className={styles.span}>Age :</span><br></br>
                        <span className={styles.span}> Notice Period :</span><br></br>
                        <span className={styles.span}>Qualification :</span><br></br>
                        <span className={styles.span}>Experience : </span><br></br>
                        <span className={styles.span}> Current CTC :</span><br></br>
                        <span className={styles.span}>Expected CTC : </span><br></br>
                        <span className={styles.span}>Contact : </span><br></br>
                      </div>

                      <div className={styles.RightTable}>
                        <span className={styles.span}><s>Locked</s></span><br></br>
                        {/* <span className={styles.span}> <u>{new Date(job.updatedAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}</u></span><br></br> */}
                        <span className={styles.span}>{job.age ? <span style={{ color: "blue" }}>{job.age} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.NoticePeriod ? <span style={{ color: "blue" }}>{job.NoticePeriod} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.Qualification ? <span style={{ color: "blue" }}>{job.Qualification} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.Experiance ? <span style={{ color: "blue" }}>{job.Experiance} </span> : <span style={{ color: "red" }}>Not updated</span>}   </span><br></br>
                        <span className={styles.span}>{job.currentCTC ? <span style={{ color: "blue" }}>{job.currentCTC} </span> : <span style={{ color: "red" }}>Not updated</span>} </span><br></br>
                        <span className={styles.span}> {job.ExpectedSalary ? <span style={{ color: "blue" }}>{job.ExpectedSalary} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <button className={styles.getContactMob}  onClick={()=>{navigate("/EmployeeLogin")}}> Get Contact</button>
                      
                      </div>

                      <img className={styles.MobileimageView} src={job.image?job.image : profileDp}/><br></br>

                    </div>

                    <div className={styles.Down}>
                      <span className={styles.span}> Skills : {job.Skills ? <span style={{ color: "blue" }}>{job.Skills} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                    </div>
                  </div>
                </>
              )
            })
            :
            <p style={{ marginLeft: "37%", color: "red" }}>No Record found</p>

          }

          </div>
          <div style={{marginTop:"50px"}}>
          <Footer/>
        </div>
        </>
      }

    </>
  )
}

export default SearchCandidate