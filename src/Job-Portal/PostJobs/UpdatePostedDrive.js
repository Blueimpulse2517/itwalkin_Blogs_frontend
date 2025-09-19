import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import axios from "axios"
import Companylogo from "../img/logo.png"
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import JoditEditor from 'jodit-react'
import HTMLReactParser from 'html-react-parser'
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Style from "./postJobs.module.css"
import socketIO from 'socket.io-client';
import CreatableSelect from "react-select"
import useScreenSize from '../SizeHook';
import {jobTags} from "../Tags"
import CustomTextEditor from '../Editor/CustomTextEditor'

// import CreatableSelect  from 'react-select/creatable';

function UpdatePostedDrive(props) {
    const screenSize = useScreenSize();

    const editor=useRef(null)
    // useEffect(() => {
    //     const socket = socketIO.connect(props.url, {
    //         auth: {
    //             token: JSON.parse(localStorage.getItem("EmpIdG"))
    //         }
    //     });
    // }, [])

    let empId = JSON.parse(localStorage.getItem("EmpIdG"))
    const [jobTitle, setJobTitle] = useState("")
    const [Source, setSource] = useState("")
    const [SourceLink, setSourceLink] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [jobtype, setJobtype] = useState("")
    const [salaryRange, setSalaryRange] = useState("")
    const [jobLocation, setJobLocation] = useState("")
    const [qualification, setQualification] = useState("")
    const [experiance, setExperiance] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [Logo, setLogo] = useState()
    const [other, setother] = useState(false)
    const [others, setOthers] = useState(false)
    const [otherJobLocation, setotherJobLocation] = useState(false)

  const [Active, setActive] = useState([])

    const [profileData, setProfileData] = useState([])
    const [Tags, setTag] = useState([])

    const [skills, setSkills] = useState("")
    const [applyLink, setApplyLink] = useState("")
    const [concent, setconcent] = useState(false)

    function handleSalary(e){
        const sanitizedValue = e.target.value.replace(/[A-Za-z]/g, '');
        // if(e.target.value.includes(/[1-9]/g))
            if (sanitizedValue.length>2){
            return false
        }else{
            setSalaryRange(sanitizedValue)
        }
    }

    function handleExperiance(e){
        const sanitizedValue = e.target.value.replace(/[A-Za-z]/g, '');
        // if(e.target.value.includes(/[1-9]/g))
            if (sanitizedValue.length>2){
            return false
        }else{
        setExperiance(sanitizedValue)
        }
    }

    let navigate = useNavigate()

    async function getProfile() {
        const headers = { authorization: 'BlueItImpulseWalkinIn' };

        await axios.get(`/EmpProfile/getProfile/${empId}`, { headers })
            .then((res) => {
                let result = res.data.result
                let companyName = res.data.result.CompanyName
                setProfileData([result])
                setCompanyName(companyName)
            }).catch((err) => {
                alert("some thing went wrong")
            })
    }

    useEffect(() => {
        getProfile()
    }, [])

    async function getLogo() {
        let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("EmpLog"))) };
        await axios.get(`/EmpProfile/getLogo/${empId}`, { headers })
            .then((res) => {
                let result = res.data
                setLogo(result)
            }).catch((err) => {
                alert("some thing went wrong")
            })
    }

    useEffect(() => {
        getLogo()
    }, [])

 const location = useLocation()
  let Jobid = location.state.getId
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
  
    hours = parseInt(hours, 10);
  
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const[stime,setstime]=useState("");
          const[etime,setetime]=useState("");
  
          const handleStartTimeChange = (e) => {
            
            let [hours, minutes] = e.target.value.split(":");
            let suffix = hours >= 12 ? "PM" : "AM";
            hours = (hours % 12) || 12; // convert to 12hr
            setstime(e.target.value);
            setStartTime(`${hours}:${minutes} ${suffix}`);
            console.log("dsds",StartTime)
          };
  
          const handleEndTimeChange = (e) => {
            let [hours, minutes] = e.target.value.split(":");
            let suffix = hours >= 12 ? "PM" : "AM";
            hours = (hours % 12) || 12; // convert to 12hr
            setetime(e.target.value)
            setEndTime(`${hours}:${minutes} ${suffix}`);
            console.log("ww",EndTime)
          };

    async function postJob() {
        const headers = { authorization: 'BlueItImpulseWalkinIn' };


        await axios.get(`walkinRoute/walkindetails/${Jobid}`,{headers})
        
            .then((res) => {
              console.log("response",Jobid, res, Jobid)
                let result = (res.data)
                console.log(result)
                if (result) {
                    setJobTitle(result.jobTitle)
                    setTag(result.Tags)
                   setCompanyName(result.CompanyName)
                   setJobDescription(result.jobDescription)
                    setJobtype(result.jobtype)
                    setJobLocation(result.jobLocation)
                    setQualification(result.qualification)
                    setSalaryRange(result.salaryRange)
                    setExperiance(result.experiance)
                    setSkills(result.skills)
                    setVenue(result.venue)
                    setSelectedDate(new Date(result.driveDate).toISOString().split('T')[0]);
                    setStartTime(result.StartTime) 
                    setEndTime(result.EndTime)
                    setstime(convertTo24Hour(result.StartTime));
                    setetime(convertTo24Hour(result.EndTime));
                }
                else if (result == "field are missing") {
                  setSuccessMessage(
                    <span
                      style={{
                        color: "green",
                        fontWeight: "800",   
                        fontStyle: "normal", 
                        fontFamily: "Courier New, Courier, monospace" 
                      }}
                    >
                      Alert!... Job Title, Company Name, Job Description, Experience, Job Location and Skills must be filled
                      </span>
                  );
                  
                }
                // else if (result ==="server issue")
                else
                    {
                    setSuccessMessage("something went wrong, Could not save your Jobs post")
                }
            }).catch((err) => {
                alert("server issue occured", err)
            })
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    useEffect(()=>{
        postJob()
    },[])

    async function updateDrive() {
        const headers = { authorization: 'BlueItImpulseWalkinIn' };

        const driveDate= selectedDate
        // const Tags=jobTags
// console.log(StartTime , EndTime)
        await axios.put(`walkinRoute/updatPostedwalkin/${Jobid}`,{
             empId,jobTitle, companyName, jobDescription,jobtype  ,Tags, jobLocation , qualification , salaryRange ,
                       experiance, skills , applyLink , selectedDate, venue  ,driveDate, StartTime, EndTime
        },{headers})
        
            .then((res) => {
              console.log("response", res, Jobid)
                let result = (res.data)
                console.log(result)
                if(result=="success"){

                  setSuccessMessage("Successfully Updated")
                  
            }
                else if (result == "field are missing") {
                    setSuccessMessage("Alert!... JobTitle, CompanyName JobDescription, Experiance, JobLocation and Skills must be filled")
                }
                // else if (result ==="server issue")
                else
                    {
                    setSuccessMessage("something went wrong, Could not save your Jobs post")
                }
            }).catch((err) => {
                alert("server issue occured", err)
            })
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    function handlejobtitle(e){ 
     setJobTitle(e.target.value)                    
    }

    function handleRadioTags(e){
        // setTag([...Tags, e])
        handleTags(e)
        if(e<10){
        handleTags("<10L")
        }
        else if(e<20 && e>10){
        handleTags("10 to 20L")
        }
        else if(e<30 && e>20){
        handleTags("20 to 30L")
        }
       else if(e>=30){
        handleTags("30 and above")
        }
        
    }
    function handleExpButton(e){
        if(e<5){
            handleTags("2 to 5 Yrs")
            }
            else if(e>5 && e<11){
                handleTags("6 to 10 Yrs")
            }
            else if(e>10 && e<16){
                handleTags("11 to 15 Yrs")
            }
            else if(e>15){
                handleTags("16 and above Yrs")
            }
    }

    const [count, setCount]=useState(1)

    async function handleTags(key) {
if(key==='Full Time' ||key=== 'Contract' || key==='Internship' || key==='Part Time'){
    setJobtype(key)
}
        // setSkills((prev)=>prev ? prev + ", " + key : key)
        // setSkills(Tags)
        const isIndex=Tags.findIndex((present)=>{
            return(
              present===key
            )
                })
                if(isIndex<0){
                    setTag([...Tags, key])
                    setSkills((prev)=>prev ? prev + ", " + key : key)
                    // setSkills([...skills, key])
                }else{
                  const IndexId=Tags.filter((present)=>{
                    return(
                      present!==key
                    )
                        })
                        setTag(IndexId)

                      let str=IndexId.toString().split(",").join(", ")
                        setSkills(str)

                    // setSkills((prev)=>prev.length>=0 ?  IndexId : "," + IndexId)
    }
}

const [selectedDate, setSelectedDate] = useState("");
const [selectedtime, setselectedtime] = useState("");
const [StartTime, setStartTime] = useState("");
const [EndTime, setEndTime] = useState("");

  const venueInputRef = useRef(null);
  const[venue, setVenue]=useState("");
    // useEffect(() => {
    //   if (venueInputRef.current && !venueInputRef.current.autocomplete) {
    //     const autocomplete = new window.google.maps.places.Autocomplete(venueInputRef.current, {
    //       fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
    //     });
    
    //     autocomplete.addListener("place_changed", () => {
    //       const place = autocomplete.getPlace();
    //       if (place && place.formatted_address) {
    //         const displayValue =
    //           place.name && place.name !== place.formatted_address
    //             ? `${place.name}, ${place.formatted_address}`
    //             : place.formatted_address;
    
    //         setVenue(displayValue);
    //       }
    //     });
    
    //     venueInputRef.current.autocomplete = autocomplete; // attach instance
    //   }
    // }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.places &&
          venueInputRef.current &&
          !venueInputRef.current.autocomplete
        ) {
          const autocomplete = new window.google.maps.places.Autocomplete(venueInputRef.current, {
            fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
          });
    
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
              const displayValue =
                place.name && place.name !== place.formatted_address
                  ? `${place.name}, ${place.formatted_address}`
                  : place.formatted_address;
    
              setVenue(place.formatted_address);
            }
          });
    
          venueInputRef.current.autocomplete = autocomplete;
          clearInterval(interval); // stop checking once loaded
        }
      }, 300); // check every 300ms
    
      return () => clearInterval(interval);
    }, []);
    
    const [showTooltip, setShowTooltip] = useState(false);
    
      const toggleTooltip = () => {
        setShowTooltip((prev) => !prev);
      };
    
      const tooltipRef = useRef(null);
    
      useEffect(() => {
          const handleClickOutside = (event) => {
            if (
              tooltipRef.current && !tooltipRef.current.contains(event.target)
            ) {
              setShowTooltip(false);
            }
           
          };
      
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);
    

          const qualifications = [
                  {
                    main: "BE / B.Tech",
                    subs: ["CSE","E&C","CS","IT","OTHERS"],
                  },
                  {
                    main: "ME / M.Tech",
                    subs: ["CSE","ECE","CE","AI&ML","OTHERS"],
                  },
                  {
                    main: "BCA/MCA",
                    subs: ["BCA/MCA"],
                  },
                  {
                    main: "OTHERS",
                    subs: ["OTHERS"],
                  },
                ];
                
                  const [menuOpen, setMenuOpen] = useState(false);
                  const [openIndex, setOpenIndex] = useState(null);
                  const containerRef = useRef(null);
                
                  const toggleMain = (index) => {
                    setOpenIndex(openIndex === index ? null : index);
                  };
                
                  const handleSelect = (value) => {
                    // setSelected(value);
                    setQualification(value)
                    setMenuOpen(false);
                    setOpenIndex(null);
                  };
        
                  useEffect(()=>{
                           console.log("qualification",qualification)
                  },[qualification])
                
                  // Handle outside click
                  useEffect(() => {
                    const handleClickOutside = (e) => {
                      if (containerRef.current && !containerRef.current.contains(e.target)) {
                        setMenuOpen(false);
                        setOpenIndex(null);
                      }
                    };
                    document.addEventListener("mousedown", handleClickOutside);
                    return () => document.removeEventListener("mousedown", handleClickOutside);
                  }, []);

    return (
        <>
<button className={Style.jobdetailBackBtn} 
            onClick={() => {
               if (window.history.length > 1) {
                  navigate(-1);
                 } else {
                    navigate('/'); 
                  }
             }}>
                <div style={{fontSize:"12px", fontWeight:"800px"}}>Back</div>
          </button>
            {
                profileData.map((items, i) => {
                    return (
                        items.isApproved ?

                            <div key={i} style={{display:"flex", justifyContent:"center"}}>
                                <div className={Style.dirveContainer}>
                               <h2  >Update Walkin Drive</h2> 
                               {/* <div className={Style.dirveContainer}> */}

                               <p className={successMessage === "Successfully Updated" ?
                                            Style.successmessage : Style.errormessage}>{successMessage} </p>

                               <div className={Style.dirvefirstRow}>
                                  <div className={Style.dirvesubContainer}>
                                    <h4 className={Style.heading}>Job title**</h4>
                                    <input className={Style.driveinput} maxLength="100"  type="text" value={jobTitle} onChange={(e) => { handlejobtitle(e) }} />          
                                  </div>
                                 <div className={Style.dirvesubContainer}>
                                   <h4 className={Style.heading}>Company Name**</h4>
                                   <input className={Style.driveinput} maxLength="100" type="text" value={companyName} disabled />
                                 </div>
                               </div> 

                                <div>
                                   <h4 className={Style.jobHeadline}>Job Description**</h4>      
                                    {/* <JoditEditor  ref={editor} className={Style.inputbox} value={jobDescription.toString()} onChange={(e)=>{setJobDescription(e)}} /> */}
                                 {/* <CustomTextEditor ref={editor} className={Style.inputbox} value={jobDescription.toString()} onChange={(e)=>{setJobDescription(e)}}/> */}
                                 <CustomTextEditor
 ref={editor} className={Style.inputbox} 
        value={jobDescription}
        onChange={setJobDescription}
      />
                                </div>

                               <div style={{display:"flex",flexDirection:"column"}}>
                               <h4 style={{alignContent:"start"}}>Job Tags <span className={Style.hint}>(Use multiple tags to identify top-matching candidates)</span></h4>
                               <div className={Style.driveJobtitleFilterWrapper}>
                                   {
                                     jobTags.map((tags, i) => {
                                 return (            
                                    <button disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                                      className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                                      tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                                      Style.TagHeading: 
                                      //  Active === tags.value ? 
                                      Tags.findIndex(  (present)=>{
                                        return(
                                          present===tags.value
                                        )
                                            }) >=0?
                                       Style.active : Style.JobtitleFilter} 
                                       onClick={ () => {  handleTags(tags.value) }}
                                       >{tags.value} </button>
                                  
                                      )
                                    })
                                  }
                                </div> 
                              </div>
                              <div class={Style.driveRadioRow}>
                                   <div>
                                     <h4 className={Style.jobHeadline}>Job Type</h4>
                                     <div style={{ marginTop: "-10px" }}>
                                     <label><input name="Job-Type" type="radio" checked={jobtype === "Full Time" || Tags.filter} value="Full Time" onChange={(e) => { setJobtype(e.target.value); handleRadioTags(e.target.value) }} />Full Time  </label>
                                     <label><input name="Job-Type" type="radio" checked={jobtype === "Part Time"} value="Part Time" onChange={(e) => { setJobtype(e.target.value); handleRadioTags(e.target.value) }} />Part Time  </label>
                                     <label><input name="Job-Type" type="radio" checked={jobtype === "Internship"} value="Internship" onChange={(e) => { setJobtype(e.target.value); handleRadioTags(e.target.value) }} />Internship </label>
                                     <label><input name="Job-Type" type="radio" checked={jobtype === "Contract"} value="Contract" onChange={(e) => { setJobtype(e.target.value); handleRadioTags(e.target.value) }} />Contract   </label>
                                     </div>
                                    </div> 
                              </div>        
                                    <div style={{marginRight:"150px"}}>
                                    <div style={{position:"relative", display:"flex", alignItems:"center"}}>
                                    <div> <h4 className={Style.jobHeadline}>Job Location**</h4></div>
                                     <div style={{position:"relative", }} ref={tooltipRef} className={Style.driveAlerti} onClick={toggleTooltip}>
                                      <div>i</div>
                                       {showTooltip && (
                                         <div
                                           className={Style.driveIdesc}
                                         >
                                          We currently support job posting only in Bangalore.
                                         </div>
                                       )}
                                     </div>
                                   </div>
    

                                        <div style={{ marginTop: "-10px" }}>
                                            <label><input name="Location" type="radio" checked={jobLocation === "Bangalore"} value="Bangalore" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} />Bangalore </label>
                                      </div>

                                      

                                 

                                 
                              </div>

                              <div ref={containerRef} style={{ position: "relative",}} className={Style.inputName} >
                                      <div><h4 className={Style.jobHeadline}>Qualification**</h4></div>
                 {/* Clickable Select Box */}
                  <div  onClick={() => setMenuOpen((prev) => !prev)} style={{cursor: "pointer", marginTop:"-10px", display:"flex", alignItems:"center"}} className={Style.inputName}>
                     <div style={{padding:"4px",border:"2px solid #ccc",borderRadius:"5px"}}>
                     {qualification? `${qualification}` : "Select your qualification"}
                  </div>
                 </div>

                {/* Menu Dropdown */}
                 {menuOpen && (
                    <div
                      style={{
                        marginTop: "10px",
                        marginLeft:"7px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "10px",
                        background: "#fff",
                        position: "absolute",
                        width: "81%",
                        zIndex: 10,
                        maxHeight:"200px",
                        overflowY: "auto",
                      }}
                    >
                   {qualifications.map((item, index) => (
                     <div key={index} style={{ marginBottom: "10px" }}>
                       <button
                         onClick={() => toggleMain(index)}
                         style={{
                           width: "100%",
                           padding: "10px",
                           textAlign: "left",
                           background: "#f0f0f0",
                           border: "none",
                           borderRadius: "6px",
                           cursor: "pointer",
                           display: "flex",
                           justifyContent: "space-between",
                           fontSize: "16px",
                         }}
                       >
                       <span>{item.main}</span>
                           </button>

                   {openIndex === index && (
                     <div style={{ marginTop: "6px", marginLeft: "16px" }}>
                       {item.subs.map((sub, i) => (
                         <div
                           key={i}
                           onClick={() => {
                            if (item.main === sub) {
                              handleSelect(item.main);
                            } else {
                              handleSelect(`${item.main} - ${sub}`);
                            }
                          }}
                           style={{
                             padding: "8px 12px",
                             cursor: "pointer",
                             background: "#e9f3ff",
                             borderRadius: "4px",
                             marginBottom: "4px",
                             fontSize: "15px",
                           }}
                           onMouseEnter={(e) => (e.target.style.background = "#cde6ff")}
                           onMouseLeave={(e) => (e.target.style.background = "#e9f3ff")}
                         >
                           {sub}
                         </div>
                       ))}
                     </div>
                     )}
                 </div>
                ))}
            </div>
            )}
          </div>

                              {/* <div>
  <h4 className={Style.jobHeadline}>Qualification Needed *</h4>
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

 
    <div style={{ border: '1px solid black', borderRadius:"2px", padding: '10px', minWidth: '140px' }}>
      <strong>B.E/B.TECH</strong>
      <div>
        <label><input type="radio" name="Qualification" value="B.E/CSE" checked={qualification === "B.E/CSE"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> CSE</label><br />
        <label><input type="radio" name="Qualification" value="B.E/E&C" checked={qualification === "B.E/E&C"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> E&C</label><br />
        <label><input type="radio" name="Qualification" value="B.E/CS" checked={qualification === "B.E/CS"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> CS</label><br />
        <label><input type="radio" name="Qualification" value="B.E/IT" checked={qualification === "B.E/IT"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> IT</label><br />
        <label><input type="radio" name="Qualification" value="B.E/Others" checked={qualification === "B.E/Others"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> OTHERS</label>
      </div>
    </div>

  
    <div style={{ border: '1px solid black', padding: '10px', borderRadius:"2px", minWidth: '140px' }}>
      <strong>M.E/M.TECH</strong>
      <div>
        <label><input type="radio" name="Qualification" value="M.E/CSE" checked={qualification === "M.E/CSE"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> CSE</label><br />
        <label><input type="radio" name="Qualification" value="M.E/ECE" checked={qualification === "M.E/ECE"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> ECE</label><br />
        <label><input type="radio" name="Qualification" value="M.E/CE" checked={qualification === "M.E/CE"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> CE</label><br />
        <label><input type="radio" name="Qualification" value="M.E/AI&ML" checked={qualification === "M.E/AI&ML"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> AI&ML</label><br />
        <label><input type="radio" name="Qualification" value="M.E/Others" checked={qualification === "M.E/Others"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} /> OTHERS</label>
      </div>
    </div>

   
    <div style={{ border: '1px solid black', padding: '10px',borderRadius:"2px", minWidth: '100px' }}>
      <label>
        <input type="radio" name="Qualification" value="BCA/MCA" checked={qualification === "BCA/MCA"} onChange={(e) => { setQualification(e.target.value); setOthers(false); }} />
        BCA/MCA
      </label>
    </div>

    
    <div style={{ border: '1px solid black', padding: '10px', borderRadius:"2px", minWidth: '100px' }}>
      <label>
        <input type="radio" name="Qualification" value="OTHERS" checked={others} onChange={(e) => { setOthers(true); setQualification(""); }} />
        OTHERS
      </label>
    </div>

  </div>
                                  </div>
                               */}

                              
                                <div className={Style.dirvesubContainer} >
                                    <h4 className={Style.heading}>Salary Per Annum in Lakhs** &nbsp;<span className={Style.hint}>(e.g 5 or 10)</span></h4>
                                    <div style={{position:"relative"}}>
                                    <input className={Style.driveinput} style={{width:"210px"}} maxLength="3" type="number" value={salaryRange} onChange={(e) => { handleSalary(e); }} />
                                    <span className={Style.suffixExpMob}>{salaryRange===""?"":"LPA"}</span>
                                   </div>         
                                </div>
                                <div className={Style.dirvesubContainer}>
                                    <h4 className={Style.heading} >Experience Needed** &nbsp;<span className={Style.hint}>(e.g 5 or 10)</span></h4>
                                    <div style={{position:"relative"}}>
                                    <input className={Style.driveinput}style={{width:"210px"}} maxLength="3" type="number" value={experiance} onChange={(e) => { handleExperiance(e); }} />
                                    <span className={Style.suffixExpMob}>{experiance===""?"":"YRS"}</span>
                                    </div>
                                </div>
                              
                              
                            <div className={Style.driveFourthRow}>
                                <div className={Style.dirvesubContainer}>
                                <h4 className={Style.heading}>Skills Needed**</h4>
                                        <input className={Style.driveinput} style={{width:"220px"}}   maxLength="100" value={skills} type="text" onChange={(e)=>{setSkills(e.target.value)}} disabled />

                                </div>
                                
                            </div>
                              

                            <div style={{display:"flex", flexDirection:"column", gap:"2px",marginRight:"124px" }}> 
                                          <label>Venue: </label>
                                          <input
                                            type="text"
                                            ref={venueInputRef}
                                            value={venue}
                                            onChange={(e) => setVenue(e.target.value)}
                                            className={Style.driveinput}
                                            style={{ width: "210px", zIndex:"99"}}
                                            placeholder="Search Venue"
                                          />
                                          </div> 

                            <div  class={Style.driveDateContainer1}>
                                <div>
                                          <label>Select Drive Date: </label>
                                          <input 
                                            className={Style.DriveDate}
                                            type="date" 
                                            value={selectedDate}
                                            min={new Date().toISOString().split("T")[0]}  
                                            onChange={(e) => setSelectedDate(e.target.value)} 
                                          />
                                          </div>
                                           
                            </div>

                            <div class={Style.driveDateContainer}>
                                         <label>Drive Start Time: </label>
                                         <input
                                         className={Style.DriveDate} 
                                           type="time" 
                                           value={stime} 
                                           onChange={handleStartTimeChange} 
                                         />
                                         
                                       </div>

                                       <div class={Style.driveDateContainer}>
                                         <label>Drive End Time: </label>
                                         <input
                                         className={Style.DriveDate} 
                                           type="time" 
                                           value={etime} 
                                           onChange={handleEndTimeChange} 
                                         />
                                         
                                       </div>
                                       {/* <div>
        <p><input type="checkbox" onChange={()=>{setconcent((prev)=>!prev)}}/>
    I have read the terms and conditions of ITwalkin.com and I agree to all the 
     <span style={{color:"blue", cursor:"pointer"}} onClick={()=>(window.open("/TermsAndCondition"))}> Terms and Conditions</span> before posting the jobs </p> */}

     {/* </div> */}
     {Logo ? <p ><span style={{ color: "blue" }}>Note** :</span> Logo will also be posted with the Job</p> : ""}
<div style={{display:"flex", justifyContent:"center" }}>
<button style={{width:"130px"}} disabled={concent} className={concent? Style.disableButton:Style.button} onClick={updateDrive}>Update</button>
</div>
                            {/* </div> */}

                               </div> 
                            </div>
                            : <p style={{ color: "red", fontStyle: "italic", marginLeft: "20px" }}>Your account is being verified.Once your account gets verified,then you will be able to post a Walkin Drive</p>

                    )

                })
            }
           {screenSize.width > 750 ?
""
:
            <div style={{marginTop:"250px"}}>
          <Footer/>
        </div>
}
        </>

    )
}

export default UpdatePostedDrive;