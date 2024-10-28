
import React from 'react'
import styles from "./AppliedUserProfile.module.css"
import { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import useScreenSize from '../SizeHook';
import profileDp from "../img/user_3177440.png"
import Arrowimage from '../img/icons8-arrow-left-48.png'
import Footer from '../Footer/Footer';

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
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


// import { useSnapCarousel } from 'react-snap-carousel';
// import AutoplaySlider from 'react-awesome-slider'
// import Slider from "react-slick";

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
  const [Active, setActive] = useState("")
  let jobTags = [
    { value: 'TECHNOLOGIES', label: 'TECHNOLOGIES'},

    { value: 'Angular js', label: 'Angular js' }, { value: 'Vue js', label: 'Vue js' },
    { value: 'NextJs', label: 'NextJs' },{ value: '.NET', label: '.NET' }, { value: 'Larvel', label: 'Larvel' },
    { value: 'Kotlin', label: 'Kotlin' }, { value: 'Android', label: 'Android' }, { value: 'iOS', label: 'iOS' },
    { value: 'Xamarin', label: 'Xamarin' }, { value: 'Ember JS', label: 'Ember JS' }, 
    { value: 'Cordova', label: 'Cordova' }, { value: 'Groovey,Grails', label: 'Groovey,Grails' },
    { value: 'QT', label: 'QT' }, { value: 'Oracle', label: 'Oracle' }, { value: 'Postgres SQL', label: 'Postgres SQL' },
    { value: 'CouchDB', label: 'CouchDB' }, { value: 'Redis', label: 'Redis' }, { value: 'Azure', label: 'Azure' },
    { value: 'AWS', label: 'AWS' }, { value: 'Rackspace', label: 'Rackspace' }, { value: 'Heroku', label: 'Heroku' },
    { value: 'GoogleCloud', label: 'GoogleCloud' }, { value: 'Weblogic', label: 'Weblogic' },
    { value: 'Apache', label: 'Apache' }, { value: 'Lotus', label: 'Lotus' }, { value: 'Domino', label: 'Domino' },
    { value: 'MS IIS', label: 'MS IIS' }, { value: 'ColdFusion', label: 'ColdFusion' },
    { value: 'nginx', label: 'nginx' }, { value: 'Resin', label: 'Resin' }, { value: 'Selenium', label: 'Selenium' },
    { value: 'HP LoadRunner', label: 'HP LoadRunner' }, { value: 'jUnit', label: 'jUnit' },
    { value: 'Jira', label: 'Jira' }, { value: 'Confluence', label: 'Confluence' },
    { value: 'Testrails', label: 'Testrails' },{ value: 'Machine Learing', label: 'Machine Learing' },
    { value: 'Cybersecurity', label: 'Cybersecurity' }, { value: 'AI', label: 'AI' },
    { value: 'Backend', label: 'Backend' }, { value: 'Frontend', label: 'Frontend' },
    { value: 'HTML-CSS', label: 'HTML-CSS' }, { value: 'MongoDB', label: 'MongoDB' },
    { value: 'MySql', label: 'MySql' }, { value: 'Flutter', label: 'Flutter' },
    { value: 'Mobile App Developer', label: 'Mobile App Developer' }, { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'React Native', label: 'React Native' }, { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Security developer', label: 'Security developer' }, { value: 'Data science', label: 'Data science' },
    { value: 'Data Analyst', label: 'Data Analyst' }, { value: 'Game Developer', label: 'Game Developer' },
    { value: 'Graphic Developers', label: 'Graphic Developers' }, { value: 'AI Engineer', label: 'AI Engineer' },
    { value: 'Security Developer', label: 'Security Developer' }, { value: 'Cloud Developers', label: 'Cloud Developers' },


  // ]

  // let TechTags = [
    { value: 'ROLE', label: 'ROLE'},

    { value: 'S-w Developer', label: 'S/w Developer ' }, { value: 'Firmware Tester', label: 'Firmware Tester' },
    { value: 'Firmware Developer', label: 'Firmware Developer' }, { value: 'Hardware Engineer', label: 'Hardware Engineer' },
    { value: 'Agile', label: 'Agile' }, { value: 'Scrum Master', label: "Scrum Master" },
    { value: 'Product Owner', label: 'Product Owner' }, { value: 'Product Line Manager', label: 'Product Line Manager' },
    { value: 'Project Manager', label: 'Project Manager' }, { value: 'Automation Tester', label: 'Automation Tester' },
    { value: 'QA Enginner', label: 'QA Enginner' }, { value: 'Senior Tester', label: 'Senior Tester' },
    { value: 'Manager', label: 'Manager' }, { value: 'Director', label: 'Director' },
    { value: 'Compliance Engineer', label: 'Compliance Engineer' },
    { value: 'Verification Engineer', label: 'Verification Engineer' },
    { value: 'QA Manager', label: 'QA Manager' }, { value: 'Verification Lead', label: 'Verification Lead' },
    { value: 'Validation Engineer', label: 'Validation Engineer' },
    { value: 'Testing Manager', label: 'Testing Manager' }, { value: 'Team Lead', label: 'Team Lead' },
    { value: 'Senior Developer', label: 'Senior Developer' }, { value: 'Admin', label: 'Admin' },    
    { value: 'Purchase', label: 'Purchase' },{ value: 'Finance', label: 'Finance' },   
    { value: 'Recruiter', label: 'Recruiter' }, { value: 'Lab Technician', label: 'Lab Technician' },
    { value: 'Store keeper', label: 'Store keeper' },
  // ]

  // let TOOLSPROTOCOLS =[
    { value: 'TOOLS/PROTOCOLS', label: 'TOOLS/PROTOCOLS'},

    { value: 'HP LoadRunner', label: 'HP LoadRunner' },
    { value: 'jUnit', label: 'jUnit' },
    { value: 'Jira', label: 'Jira' },
    { value: 'Confluence', label: 'Confluence' },
    { value: 'Testrails', label: 'Testrails' },
    { value: 'PLC-SCADA', label: 'PLC-SCADA' },
    { value: 'ModBUS', label: 'ModBUS' },
    { value: 'CAN BUS', label: 'CAN BUS' },
  // ]
  // let INDUSTRY=[
    { value: 'INDUSTRY', label: 'INDUSTRY' },

    { value: 'Aerospace', label: 'Aerospace' },
    { value: 'IT', label: 'IT' },
    { value: 'Banking', label: 'Banking' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'FMCG', label: 'FMCG' },
    { value: 'Telecommunication', label: 'Telecommunication' },
    { value: 'Multimedia', label: 'Multimedia' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Defence', label: 'Defence' },
    { value: 'Power', label: 'Power' },
    { value: 'Security', label: 'Security' },
    { value: 'Education', label: 'Education' },
  // ]
  // let JOB_TYPE=[
    { value: 'Job Type', label: 'Job Type'},

    { value: 'Full Time', label: 'Full Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Work from Home', label: 'Work from Home' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Freelancer', label: 'Freelancer' },
    { value: 'On-Site', label: 'On-Site' },
    { value: 'International Relocation', label: 'International Relocation' },
    { value: 'Frequent Traveling', label: 'Frequent Traveling' },
    { value: 'Temporary Assignment', label: 'Temporary Assignment' },
  // ]
  // let Experiance
  { value: 'EXPERIENCE', label: 'EXPERIENCE'},

  { value: '2 to 5 Yrs', label: '2 to 5 Yrs ' }, { value: '6 to 10 Yrs', label: '6 to 10 Yrs' },
  // let SALARY=[ 
    { value: 'SALARY', label: 'SALARY'},

    { value: '11 to 15', label: '11 to 15' }, { value: '16 and above', label: '16 and above' },
    { value: '<10L', label: '<10L' },
    { value: '10 to 20L', label: '10 to 20L' },
    { value: '20 to 30L', label: '20 to 30L' },
    { value: '30 and above', label: '30 and above' },
  // ]

  // let NOTICE_PERIOD=[
    { value: 'NOTICE PERIOD', label: 'NOTICE PERIOD'},

    { value: 'Immediate', label: 'Immediate' },
    { value: '30days', label: '30days' },
    { value: '60days', label: '60days' },
  // ]

  // let COMPANY_TYPE=[
    { value: 'COMPANY TYPE', label: 'COMPANY TYPE' },

    { value: 'Fortune500', label: 'Fortune500' },
    { value: 'MNC', label: 'MNC' },
    { value: 'Indian MNC', label: 'Indian MNC' },
    { value: 'Product Based', label: 'Product Based' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Manpower sourcing', label: 'Manpower sourcing' },
    { value: 'Firm', label: 'Firm' },
    { value: 'Pvt Ltd', label: 'Pvt Ltd' },
  // ]
  // let COLLEGE_TYPE=[
    { value: 'COLLEGE TYPE', label: 'COLLEGE TYPE' },

    { value: 'IITs/NITs', label: 'IITs/NITs' },
    { value: 'Top 100', label: 'Top 100' },
    { value: 'Top 500', label: 'Top 500' },
    { value: 'Others', label: 'Others' },
  // ]

  // let EDUCATION =[
    { value: 'EDUCATION', label: 'EDUCATION' },

    { value: 'Phd', label: 'Phd' },
    { value: 'ME/ MTech', label: 'ME/ MTech' },
    { value: 'MBA', label: 'MBA' },
    { value: 'BE/BTECH', label: 'BE/BTECH' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'MCA/BCA', label: 'MCA/BCA' },
    { value: 'Bcom/BA', label: 'Bcom/BA' },
    { value: 'Others', label: 'Others' },
  
  ]

  const Location = ['Bangalore', 'Chennai',
    'Hyderabad', 'Mumbai']

  // let jobSeekerId = JSON.parse(localStorage.getItem("StudId"))

  async function getAllJobSeekers() {
    setNoPageFilter(false)

    // let userid = JSON.parse(localStorage.getItem("EmpIdG"))
    // const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("EmpLog"))) };
    const headers = { authorization: 'BlueItImpulseWalkinIn' };

    await axios.get("StudentProfile/getAllJobseekers", { headers })
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCandidate(sortedate)
        setFilCandidate(sortedate)
      })
  }

  useEffect(() => {
    getAllJobSeekers()
  }, [])

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

  // const [status, setstatus] = useState({select})
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

  function CheckProfile(StudID) {
    // navigate(`/Check-Profile/${StudID}`)
    window.open(`/Check-Profile/${StudID}`, '_blank')
  }



  async function getLocation(jobLocation) {
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

  let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSerachCand"))


  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage?recordsperpage:10)

  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //0
  const records = Candidate.slice(firstIndex, lastIndex)//0,5
  const npage = Math.ceil(Candidate.length / recordsPerPage) // last page
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

  function handleRecordchange(e){  
    sessionStorage.setItem("recordsperpageSerachCand", JSON.stringify(e.target.value));
    let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSerachCand"))
    setrecordsPerPage(recordsperpage) 
    setCurrentPage(1)
  }

  async function filterByJobTitle(key) {
    setNoPageFilter(true)
    setFiltereredjobs(key)
    setActive(key)
    await axios.get(`/StudentProfile/getSkillTags/${key}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCandidate(sortedate)
      })
  }
  // .........Notice Period sorting....
  function NoticeAscendingOrder() {
    let newjob = [...FilCandidate]
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
      return collator.compare(b.NoticePeriod, a.NoticePeriod)
    })
    setCandidate(sorted)
  }


  function NoticeDescendingOrder() {
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
  function AgeDescendingOrder() {
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
  function AgeAscendingOrder() {
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
  function ExpDescendingOrder() {
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
  function ExpAscendingOrder() {
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
  function CurrCTCDescendingOrder() {
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
  function CurrCTCAscendingOrder() {
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
  function ExpCTCDescendingOrder() {
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
  function ExpCTCAscendingOrder() {
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
  function LastActDescendingOrder() {
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

  function LastActAscendingOrder() {
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
          <div className={styles.searchBothForNavWrapper}>
            <input className={styles.inputboxsearchNav} type="text" placeholder='Search Seekers' onChange={(e) => { search(e) }} />

            <i style={{ color: "rgb(40, 4, 99)", fontSize: "18px", cursor: "pointer" }} onClick={() => { searchIcon(searchKey) }}
              class="fa fa-search" ></i>
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
          <div style={{ marginTop: "30px" }}></div>
          
          <div className={styles.LocationFilterWrapper}>
             {/* <button className={`${styles.JobLocationFilter}`}  name="filter" onClick={() =>
               { getAllJobSeekers(); setActive("All") }} >All</button> */}
            {
              Location.map((location, i) => {
                return (
                  <button className={location == "Chennai" || location == "Hyderabad" || location == "Mumbai" ?
                  styles.disable: Active ==="Bangalore"?  styles.locationActive :styles.JobLocationFilter} disabled={location == "Chennai" || 
                  location == "Hyderabad" || location == "Mumbai" || location == "Delhi"} name="filter" onClick={() => { getLocation(location); setActive("Bangalore") }} >{location}</button>

                )
              })
            }
          </div><br></br>
         
            <div className={styles.JobtitleFilterWrapper}>
              <buton className={Active === "All" ? styles.active : styles.JobtitleFilter} onClick={() => 
                { getAllJobSeekers(); setActive("All") }}>All</buton>
              {
                jobTags.map((tags, i) => {
                  return (
                    <button disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" } 
                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE"?
                      styles.TagHeading:  Active === tags.value ? 
                      styles.active : styles.JobtitleFilter} onClick={() => { filterByJobTitle(tags.value) }}>{tags.value} </button>
                  
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
              <option selected = {lastIndex === 10} value={10}>10</option>
              <option selected = {lastIndex === 25} value={25}>25</option>
              <option selected = {lastIndex === 50} value={50}>50</option>
              <option selected = {lastIndex === 100} value={100}>100</option>
            </select>  jobs per page
            </div>

          <div className={styles.AllUiWrapper}>
            <ul className={styles.ul} >
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.name}`}><b>Name</b>
              </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.NoticePeriod}`}><b>Notice Period</b>
                <p style={{ display: "inline", marginLeft: "4%" }}>
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
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Qualification}`}>  <b>Qualif</b>
              </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Experiance}`}><b>Experience</b>
                <p style={{ display: "inline", marginLeft: "1%" }}>
                  <i onClick={ExpAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={ExpDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                </p>
              </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Skills}`}> <b>Skills</b> </li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.currentCTC}`}> <b>Curr. CTC</b>
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


            </ul>

            {
              !nopageFilter ?

                records.length > 0 ?
                  records.map((Applieduser, i) => {
                    return (
                      <>

                        <ul className={styles.ul} key={i}>
                          <li className={`${styles.li} ${styles.name} ${styles.onclick}`} onClick={() => { CheckProfile(btoa(Applieduser._id)) }} >
                            {Applieduser.name ? <a className={styles.namelink} title="Click to check the Contact Details">
                              {Applieduser.name}</a> : <li className={styles.Nli}>N/A</li>} </li>

                          <li className={`${styles.li} ${styles.NoticePeriod}`}> {Applieduser.NoticePeriod ?
                            Applieduser.NoticePeriod : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.age}`}> {Applieduser.age ?
                            Applieduser.age : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Qualification}`}> {Applieduser.Qualification ?
                            Applieduser.Qualification : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Experiance}`}> {Applieduser.Experiance ?
                            Applieduser.Experiance : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Skills}`}> {Applieduser.Skills ?
                            Applieduser.Skills : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.currentCTC}`}> {Applieduser.currentCTC ?
                            Applieduser.currentCTC : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.ExpectedSalary}`}> {Applieduser.ExpectedSalary ?
                            Applieduser.ExpectedSalary : <li className={styles.Nli}>N/A</li>} </li>
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

                        </ul>
                      </>

                    )
                  })
                  :
                  <p style={{ marginLeft: "45%", color: "red" }}>No Record found</p>
                :
                Candidate.length > 0 ?
                  Candidate.map((Applieduser, i) => {
                    return (
                      <>

                        <ul className={styles.ul} key={i}>
                          <li className={`${styles.li} ${styles.name} ${styles.onclick}`} onClick={() => { CheckProfile(btoa(Applieduser._id)) }} >
                            {Applieduser.name ? <a className={styles.namelink} title="Click to check the Contact Details">
                              {Applieduser.name}</a> : <li className={styles.Nli}>N/A</li>} </li>

                          <li className={`${styles.li} ${styles.NoticePeriod}`}> {Applieduser.NoticePeriod ?
                            Applieduser.NoticePeriod : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.age}`}> {Applieduser.age ?
                            Applieduser.age : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Qualification}`}> {Applieduser.Qualification ?
                            Applieduser.Qualification : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Experiance}`}> {Applieduser.Experiance ?
                            Applieduser.Experiance : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.Skills}`}> {Applieduser.Skills ?
                            Applieduser.Skills : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.currentCTC}`}> {Applieduser.currentCTC ?
                            Applieduser.currentCTC : <li className={styles.Nli}>N/A</li>} </li>
                          <li className={`${styles.li} ${styles.ExpectedSalary}`}> {Applieduser.ExpectedSalary ?
                            Applieduser.ExpectedSalary : <li className={styles.Nli}>N/A</li>} </li>

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

                        </ul>
                      </>

                    )
                  })
                  :
                  <p style={{ marginLeft: "45%", color: "red" }}>No Record found</p>

            }
            <div>
            </div>
          </div >
          <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{marginTop:"10px", marginLeft:"10px"}}>
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
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
          <div id={styles.JobCardWrapper} >

            {Candidate.map((job, i) => {
              return (
                <>
                  <div className={styles.JobCard} key={i}>
                    <div style={{ display: "flex" }}>

                      <div className={styles.LeftTable}>
                        <span className={styles.span}>Name :  </span> <br></br>
                        <span className={styles.span}><u>Last Active :  </u></span> <br></br>
                        <span className={styles.span}>Age :</span><br></br>
                        <span className={styles.span}> Notice Period :</span><br></br>
                        <span className={styles.span}>Qualification :</span><br></br>
                        <span className={styles.span}>Experience : </span><br></br>
                        <span className={styles.span}> Current CTC :</span><br></br>
                        <span className={styles.span}>Expected CTC : </span><br></br>
                      </div>

                      <div className={styles.RightTable}>
                        <span className={styles.span}><span style={{ color: "blue", textDecoration: "underline" }} onClick={() => { CheckProfile(btoa(job._id)) }} >{job.name}</span></span><br></br>
                        <span className={styles.span}> <u>{new Date(job.updatedAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}</u></span><br></br>
                        <span className={styles.span}>{job.age ? <span style={{ color: "blue" }}>{job.age} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.NoticePeriod ? <span style={{ color: "blue" }}>{job.NoticePeriod} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.Qualification ? <span style={{ color: "blue" }}>{job.Qualification} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                        <span className={styles.span}> {job.Experiance ? <span style={{ color: "blue" }}>{job.Experiance} </span> : <span style={{ color: "red" }}>Not updated</span>}   </span><br></br>
                        <span className={styles.span}>{job.currentCTC ? <span style={{ color: "blue" }}>{job.currentCTC} </span> : <span style={{ color: "red" }}>Not updated</span>} </span><br></br>
                        <span className={styles.span}> {job.ExpectedSalary ? <span style={{ color: "blue" }}>{job.ExpectedSalary} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                      </div>
                      <img className={styles.MobileimageView} src={job.image ? job.image : profileDp} />

                    </div>

                    <div className={styles.Down}>
                      <span className={styles.span}> Skills : {job.Skills ? <span style={{ color: "blue" }}>{job.Skills} </span> : <span style={{ color: "red" }}>Not updated</span>}</span><br></br>
                    </div>
                  </div>
                </>
              )
            })}

          </div>
        </>
      }

<div style={{marginTop:"10px"}}>
          <Footer/>
        </div>

    </>
  )
}

export default SearchCandidate