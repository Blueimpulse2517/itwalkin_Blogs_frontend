import React, { useRef } from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from "./StudentProfile.module.css"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import profileDp from "../img/user_3177440.png"
import { Puff } from  'react-loader-spinner'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'
import Footer from '../Footer/Footer';

function CheckStudentProfile() {

    const [profileData, setProfileData] = useState([])
    const [approved, setapproved] = useState()
const [PageLoader, setPageLoader] = useState(false)
const screenSize = useScreenSize();

let navigate = useNavigate()


    let studId = JSON.parse(localStorage.getItem("StudId"))

    let params =useParams()

    async function getProfile() {
        let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("EmpLog"))) };
        setPageLoader(true)
        await axios.get(`/StudentProfile/viewProfile/${atob(params.CP)}`,{headers})
            .then((res) => {
                let result = res.data.result
        console.log("result->",result)
                // setMessage(result.message)
                setProfileData([result])
        setPageLoader(false)

            }).catch((err) => {
                alert("some thing went wrong")
            })
            
    }

    useEffect(() => {
        getProfile()
        getEmpProfile()
    }, [])

    let empId = JSON.parse(localStorage.getItem("EmpIdG"))


    async function getEmpProfile() {
        const headers = { authorization: 'BlueItImpulseWalkinIn' };

        await axios.get(`/EmpProfile/getProfile/${empId}`, { headers })
            .then((res) => {
                let result = res.data.result
                console.log(result.isApproved)
                const approved = result.isApproved
                setapproved(approved)
            }).catch((err) => {
                alert("some thing went wrong")
            })
    }

 const[message, setMessage]=useState("")   
const comment=(e)=>{
   setMessage(e.target.value)
}

// const onSubmit=()=>{
//     setSaveComment("")
// }

const skillsHeadingRef = useRef(null);
const skillsValueRef = useRef(null);
useEffect(() => {
    if (skillsHeadingRef.current && skillsValueRef.current) {
      const headingHeight = skillsHeadingRef.current.offsetHeight;
      const valueHeight = skillsValueRef.current.offsetHeight;
      const maxHeight = Math.max(headingHeight, valueHeight);
  
      skillsHeadingRef.current.style.height = `${maxHeight}px`;
      skillsValueRef.current.style.height = `${maxHeight}px`;
    }
  }, [profileData]); // runs again when data changes
  const [commentmessage,setCommentmessage]=useState("");
  

  async function sendMessage() {
    if(message==""){
      setCommentmessage("Empty feedback cannot be submitted")
      window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
          return
    }
    const id=profileData[0]._id
    await axios.put(`/StudentProfile/sendMessage/${id}`, { message })
      .then((res) => {
        if (res.data) {         
            setCommentmessage("Feedback has been submitted successfully")
            setMessage("")
        }
      })
      .catch((err) => {
        setCommentmessage("something went wrong");
        console.error(err);
      })
      window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
  }
    return (
        <>
<div style={{display:"flex"}}>
<button
    className={styles.tvbackbtn}
    onClick={() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/posteddrives");
      }
    }}
  >
    <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
  </button>
                             {/* <img style={{ height:"25px", color:"grey", marginTop:"20px", marginLeft:"8%", cursor:"pointer",
             width:"28px"}} onClick={()=>{navigate("/Search-Candidate")}}  src={Arrowimage} /> */}
    <p style={{marginLeft:"40%"}}><b>JobSeeker Profile </b></p>
    </div>
    <div style={{marginLeft:"4%"}}>
    {commentmessage&&
    <>
        {commentmessage==="Feedback has been submitted successfully"?
            <p style={{color:"green"}}>{commentmessage}</p>    :
            <p style={{color:"red"}}>{commentmessage}</p>                          
        }
      </>

      }
   </div>
 {
profileData.map((item, i) => {
    return (
        <div key={i}>
        <img className={styles.imageV} src={item.image?item.image : profileDp}/>
        
        </div>
    )

})
    } 


           {screenSize.width>850?
           <>
<div className={styles.uiwrapper}>
            <ul className={styles.ul}>
                <li className={styles.li}><b>Name </b></li>
                <li className={styles.li}><b>Email  Address</b></li>
                <li className={styles.li}><b>City</b></li> 
                <li className={styles.li}><b>Phone  Number</b></li>
                <li className={styles.li}><b>Qualification</b></li>
                <li ref={skillsHeadingRef} className={`${styles.li} ${styles.skillsHeading}`}><b>Skills</b></li>
                <li className={styles.li}><b>Notice  Period</b></li>
                <li className={styles.li}><b>Experience</b></li>
                <li className={styles.li}><b>Current  CTC</b></li>
                <li className={styles.li}><b>Expected  Salary</b></li>
                <li className={styles.li}><b>Previous Company Name</b></li>
                <li className={styles.li}><b>Present Company Name</b></li>
                <li className={styles.li}><b>Aadhar</b></li>
                <li className={styles.li}><b>Pan  Card</b></li>
                <li className={styles.li}><b>Account Status</b></li>
                <li className={styles.li}><b>HRs/Employer FeedBack</b></li>

            </ul>
            {PageLoader?
 <Puff  height="80"  width="80"  color="#4fa94d"  ariaLabel="bars-loading"  wrapperStyle={{marginLeft:"22%", marginTop:"60px"}}/> 
     :""
  }

            {
            
                profileData.map((item, i) => {
                    return (
                        <ul className={styles.ulR} key={i}>
                            
                            <li className={`${styles.Hli}`}>{item.name?item.name:<li className={styles.Nli}>Not Updated</li>}</li>
                            <li className={`${styles.Hli}`}>{approved?item.email?item.email:<li className={styles.Nli}>Not Updated</li>:<li className={styles.Nli}>please wait for your account Approval</li>}</li>
                            <li className={`${styles.Hli}`}>{item?.city?.value?item.city?.value:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{approved?item.phoneNumber?item.phoneNumber:<li className={styles.Nli}>Not Updated</li> : <li className={styles.Nli}>please wait for your account Approval</li>}</li>
                       
                       <li className={` ${styles.Hli}`}>{item.Qualification?item.Qualification:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li style={{marginLeft:"26%", height:"auto", width:"324%"}} ref={skillsValueRef} className={`${styles.Hli} ${styles.skillsValue}`}>{item.Skills?item.Skills:<li className={styles.Nli} style={{marginLeft:"-8%"}}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.NoticePeriod?item.NoticePeriod:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.Experiance?item.Experiance:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.currentCTC?item.currentCTC:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.ExpectedSalary?item.ExpectedSalary:<li className={styles.Nli}>Not Updated</li>}</li>
                        
                       <li className={` ${styles.Hli}`}>{item.previousCompany?item.previousCompany:<li className={styles.Nli}>No FeedBack</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.currentCompany?item.currentCompany:<li className={styles.Nli}>No FeedBack</li>}</li>


                       <li className={` ${styles.Hli}`}>{item.Aadhar?<li className={styles.Nli}>###########</li>:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.panCard?<li className={styles.Nli}>###########</li>:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.age?item.age:<li className={styles.Nli}>Not Updated</li>}</li>
                       <li className={` ${styles.Hli}`}>{item.message?item.message:<li className={styles.Nli}>No FeedBack</li>}</li>
                        </ul>
                    )
                })

            }
            
            </div>
            <div style={{marginLeft:"70px", marginBottom:"20px"}}>
                <h2>Comment</h2>
                <div style={{display:"flex"}}>
                   <textarea onChange={(e)=>comment(e)} value={message} style={{width:"30%",height:"80px"}}></textarea>
                   <div style={{display:"flex", alignItems:"end",}}>
                     <button onClick={sendMessage} className={styles.jobdetailBackBtn} style={{padding: "0px 5px 0px 8px"}} >Submit</button>
                    </div>
                </div>
            </div>

            </>
            :
            <>
            <div id={styles.JobCardWrapper} >

{profileData.map((job, i) => {
  return (
    <>
      <div className={styles.JobCard} key={i}>
        <div style={{display:"flex"}}>
        <div className={styles.LeftTable}>
                        <span className={styles.span}>Name :  </span> <br></br>
                        <span className={styles.span}>Age :</span><br></br>
                        <span className={styles.span}> Email Id :</span><br></br>
                        <span className={styles.span}> Phone number :</span><br></br>
                        <span className={styles.span}> Notice Period :</span><br></br>
                        <span className={styles.span}>Qualification :</span><br></br>
                        <span className={styles.span}>Experience : </span><br></br>
                        <span className={styles.span}> Current CTC :</span><br></br>
                        <span className={styles.span}>Expected CTC : </span><br></br>
                    </div>
            
                    <div className={styles.RightTable}>
                    <span className={styles.span}><span style={{color:"blue"}}  >{job.name}</span></span><br></br>      
                    <span className={styles.span}>{job.age? <span style={{ color: "blue" }}>{job.age} </span>:<span style={{color:"red"}}>Not updated</span> }</span><br></br>
                    <span className={styles.span}> {job.email?<span style={{ color: "blue" }}>{approved?job.email:<span style={{color:"red", fontWeight:400}}>please wait for your account Approval</span>} </span>: <span style={{color:"red"}}>Not updated</span>}</span><br></br>
                    <span className={styles.span}> {job.phoneNumber?<span style={{ color: "blue" }}>{approved?job.phoneNumber:<span style={{color:"red", fontWeight:400}}>please wait for your account Approval</span>} </span>: <span style={{color:"red"}}>Not updated</span>}</span><br></br>
                    <span className={styles.span}> {job.NoticePeriod?<span style={{ color: "blue" }}>{job.NoticePeriod} </span>: <span style={{color:"red"}}>Not updated</span>}</span><br></br>
                    <span className={styles.span}> {job.Qualification?<span style={{ color: "blue" }}>{job.Qualification} </span>:<span style={{color:"red"}}>Not updated</span>}</span><br></br>
                    <span className={styles.span}> {job.Experiance?<span style={{ color: "blue" }}>{job.Experiance} </span>:<span style={{color:"red"}}>Not updated</span>}   </span><br></br>
                    <span className={styles.span}>{job.currentCTC?<span style={{ color: "blue" }}>{job.currentCTC} </span>:<span style={{color:"red"}}>Not updated</span>} </span><br></br>
                    <span className={styles.span}> {job.ExpectedSalary?<span style={{ color: "blue" }}>{job.ExpectedSalary} </span>:<span style={{color:"red"}}>Not updated</span>}</span><br></br>          
                    </div>
            
                  </div>

                  <div className={styles.Down}>
                  <span className={styles.span}> Skills : {job.Skills?<span style={{ color: "blue" }}>{job.Skills} </span>:<span style={{color:"red"}}>Not updated</span>}</span><br></br>
                  <span className={styles.span}> HRs/Employer FeedBack : {job.message?<span style={{ color: "blue" }}>{job.message} </span>:<span style={{color:"red"}}>No FeedBack</span>}</span><br></br>
                  </div>

      </div>
      <div style={{marginLeft:"16px", marginBottom:"20px"}}>
                <h2>Comment</h2>
                   <textarea onChange={(e)=>comment(e)} value={message} style={{width:"99%",height:"80px"}}></textarea>
                   <div>
                     <button onClick={sendMessage} className={styles.jobdetailBackBtn} style={{padding: "0px 5px 0px 8px", marginLeft:"2px"}} >Submit</button>
                    </div>
            </div>
    </>
  )
})}

</div>
<div style={{marginTop:"50px"}}>
                      <Footer/>
                    </div>
            </>
}

        </>
    )
}

export default CheckStudentProfile