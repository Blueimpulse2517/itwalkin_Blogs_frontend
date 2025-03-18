import React, { useEffect, useState } from 'react'
import Styles from "../Job-Portal/NaveBar/nav.module.css"
import { Link, useNavigate, NavLink, useSearchParams, useLocation } from "react-router-dom";


function SidebarNav(props) {
  let navigate = useNavigate()

  const [value , setValue] = useState("")
    // console.log(value)

  function update(key){
    setValue(key)
    // console.log(key)
  }

  let url = window.location.href
  let currentUrl=url. substring(url. lastIndexOf('/') + 1)

    function getUrl(){
      if(currentUrl==="alljobs" || currentUrl==="My-Profile" || currentUrl==="My-Applied-Jobs" || currentUrl==="AskQuestion"
        || currentUrl==="" || currentUrl==="PostJobs" || currentUrl==="Search-Candidate" || currentUrl==="MyProfile" ||
        currentUrl==="PostBlogs" || currentUrl==="postedjobs" || currentUrl==="Search-Candidate-Home" || currentUrl==="EmployeeLogin"
        || currentUrl==="JobSeekerLogin"
      ){
        setValue(currentUrl)
      }
  }
  
  useEffect(()=>{
    getUrl()
  },[url])

  function Linkedin(e){
    window.open("https://www.linkedin.com/company/104886917/admin/dashboard/", '_blank');  
  }
  const [empHome, setEmpHome] = useState(false);
  const location = useLocation();
  // const[pathName,setPathName]=useState(location.pathname)
  // console.log("pathnameee",pathName)
  useEffect(() => {
    // console.log("Current Path:", location.pathname); 

    if (location.pathname === "/Search-Candidate") {
      setEmpHome(true); 
    } else {
      setEmpHome(false); 
    }

    const inputField = document.querySelector(`.${Styles.blogInputboxsearch}`);
    if (inputField) {
      inputField.value = ""; 
    }
  }, [location.pathname]); 


  return (
  <>
  
      <div  ref ={props.refrence} >
      {/* <p style={{marginLeft:"80%"}} onClick={()=>{props.setShowSideNaveProps((prev)=>!prev)}}> &#10005;</p> */}
      <div style={{ marginTop:"-15px"}}>
         <div style={{display:"flex",marginTop:"10px",marginRight:"6px"}} >
            <input className={Styles.blogInputboxsearch}  type="text" placeholder='Search for a Job / Skills / Location / Experiance' onChange={(e) => { 
                                                                                                                                 if(empHome)
                                                                                                                                    props.searchs(e)
                                                                                                                                 else if(location.pathname==="/Blogs"){
                                                                                                                                      props.searchBlog(e)
                                                                                                                                      console.log("blogs entered")          
                                                                                                                                  }
                                                                                                                                 else if(location.pathname==="/AllCareerJobs"){
                                                                                                                                  props.searchcarrer(e)
                                                                                                                                  console.log("carrer entered")          
                                                                                                                                 }
                                                                                                                                 else if(location.pathname==="/alljobs"){
                                                                                                                                  props.jobSeekersearch(e)
                                                                                                                                  console.log("jobseeker home entered") 
                                                                                                                                 }
                                                                                                                                 else if(location.pathname==="/Search-Candidate-Home"){
                                                                                                                                  props. empSearchNoLogin(e)
                                                                                                                                  console.log("emp entered",e.target.value)          
                                                                                                                                 }
                                                                                                                                 else{
                                                                                                                                  props.search(e)
                                                                                                                                  console.log("else entered")   
                                                                                                                                 }
                                                                                                                          
                                                                                                                                }} />
            <i style={{marginLeft:"0px",fontSize:"20px",marginTop:"7px"}} class="fa fa-search" onClick={() => { props.searchIcon(props.searchKey);props.ChangeSideNaveBar();props.setSearchClick(false)}}></i>
          </div>
          
        {/* <p onClick={()=>{navigate("/")}} className={`${Styles.p} `}>Home </p> */}
        <p onClick={()=>{navigate("/Blogs"); update("Blogs")}} className={`${Styles.textBigSodeBar} ${value==="Blogs"?Styles.active:""}`}>Blogs</p>
        <p onClick={()=>{navigate("/AllCareerJobs"); update("AllCareerJobs")}} className={`${Styles.textBigSodeBar} ${value==="AllCareerJobs"?Styles.active:""}`}>ITwalkin Career</p>
        <p  className={`${Styles.textBigSodeBar}`} style={{color:"gray"}}>Walkin Drives</p>
        <p onClick={()=>{navigate("/support"); update("AllHelps")}} className={`${Styles.textBigSodeBar} ${value==="AboutUs"?Styles.active:""} `}>Help/Support</p>
        <p onClick={()=>{navigate("/AboutUs"); update("AboutUs")}} className={`${Styles.textBigSodeBar} ${value==="AboutUs"?Styles.active:""} `}>About Us</p>
        <p onClick={()=>{navigate("/Services"); update("Services")}} className={`${Styles.textBigSodeBar} ${value==="Services"?Styles.active:""}`}>Our Services</p>
        <p onClick={()=>{navigate("/Contact"); update("Contact")}} className={`${Styles.textBigSodeBar} ${value==="Contact"?Styles.active:""}`}>Contact Us</p>
        <p onClick={()=>{navigate("/TermsAndCondition"); update("TermsAndCondition")}} className={`${Styles.textBigSodeBar} ${value==="TermsAndCondition"?Styles.active:""}`}>Terms & Conditions</p>
        <div className={Styles.brands}>

        {/* <a> <i className='fa-brands fa-facebook-square' style={{fontSize:"xx-Large" , marginBottom:"30px", marginTop:"10px"}}></i> </a>
              <a> <i className='fa-brands fa-instagram-square' style={{fontSize:"xx-Large", marginBottom:"30px"}}></i> </a><br></br>
              <a> <i className='fa-brands fa-twitter-square' style={{fontSize:"xx-Large", marginBottom:"45px", marginTop:"10px"}}></i> </a> */}
              {/* <i className="fa-brands fa-linkedin-square" style={{fontSize:"xx-Large", marginBottom:"30px"}} onClick={Linkedin} ></i><br></br> */}
              <i className="fa-brands fa-linkedin" style={{ fontSize: "xx-large", marginBottom: "30px" }}  onClick={Linkedin}></i>
        </div>
        </div>
      </div>
      </>
  )
}

export default SidebarNav