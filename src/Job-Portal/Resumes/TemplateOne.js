import React, { useEffect, useState } from 'react';
import './templateOne.css';
import { generatePDF } from './generatePDF';
import axios from 'axios';

const TemplateOne = () => {
  const [profileData, setProfileData] = useState(null);
  const[pageLoader, setPageLoader]= useState(false)
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      setPageLoader(true)
      const userid = JSON.parse(localStorage.getItem("StudId"));
      const headers = {
        authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog")))
      };
      try {
        const res =await axios.get(`/StudentProfile/viewProfile/${studId}`)
        setProfileData(res.data.result);
        console.log("response",res.data.result)
        setPageLoader(false)
      } catch (err) {
        alert("Something went wrong while fetching profile");
      }
    };
    fetchProfile();
  }, [studId]);

  const data = {
    summary:
      'Experienced QA Team Lead with proven track record of building Automation Frameworks for Web, App and REST API from scratch, Mentoring, Grooming, Guiding and getting Tasks Accomplished by the Team on or before given timeline.',
    address:
      'Flat No. 305, Lakeview Residency, 3rd Cross, HSR Layout, Bangalore, Karnataka - 560102',
    totalExperience: '7 years 6 months',
    certification: 'ISTQB Certified Test Engineer',
    experience: [
      {
        company: 'InvariaTech',
        location: 'Bangalore',
        title: 'QA Lead',
        date: 'Dec 2016 - PRESENT',
        details: [
          'QA Lead for App(Android/IOS), Web, API and Hardware Testing.',
          'Designing and Implementing Automation Framework, Interacting with ARM processor using TERMIOS.',
          'Involved in Requirement analysis, Creation of Test Plan, Test Strategy.',
          'Travelled on-site(USA).',
        ],
      },
      {
        company: 'Rodmart',
        location: 'Bangalore',
        title: 'Senior QA Engineer',
        date: 'Aug 2015 - Oct 2016',
        details: [
          'Worked on Web and REST API Test Case automation verifying against Results present in MongoDB.',
          'Performance testing and JVM profiling.',
          'Travelled on-site(Singapore).',
        ],
      },
      {
        company: 'Energyquote',
        location: 'Bangalore',
        title: 'QA Engineer',
        date: 'Nov 2012 - May 2015',
        details: [
          'Worked on Framework creation and Automation Scripting of Web applications and Load testing using JMeter.',
          'Writing, Reviewing and Executing Test cases.',
          'Mentoring Interns.',
        ],
      },
      {
        company: 'Kilmist InfoTech',
        location: 'Bangalore',
        title: 'Trainee Test Engineer',
        date: 'Nov 2011 - Oct 2012',
        details: [
          'Testing Web application.',
          'Writing and reviewing test cases for the automation Framework.',
          'Writing Automation scripts for the websites.',
        ],
      },
    ],
    technicalSkills: [
      {
        title: 'Automation Tool',
        skills: ['Selenium', 'Appium', 'REST-Assured', 'Test Partner'],
      },
      {
        title: 'Unit Test Framework',
        skills: ['TestNG', 'Junit'],
      },
      {
        title: 'Design Pattern',
        skills: ['Page Object Model'],
      },
      {
        title: 'Performance Test Tools',
        skills: ['JMeter', 'JProfiler'],
      },
      {
        title: 'Frameworks Implemented',
        skills: ['Data Driven', 'Module Based', 'Hybrid'],
      },
      {
        title: 'REST API Test Tools',
        skills: ['Postman', 'REST Client'],
      },
      // {
      //   title: 'Languages',
      //   skills: ['Java', 'Python', 'VBA', 'C++'],
      // },
    ],
  };

  // This ensures A4 format even on mobile when downloading
  const handleDownloadPDF = () => {
    const resumeElement = document.getElementById('template-one');
    const oldClass = resumeElement.className;
  
    // Temporarily lock viewport zoom
    const viewportMeta = document.querySelector('meta[name=viewport]');
    const oldViewport = viewportMeta ? viewportMeta.content : null;
    if (viewportMeta) viewportMeta.content = "width=device-width, initial-scale=1, maximum-scale=1";
  
    resumeElement.className = oldClass + ' force-a4';
  
    setTimeout(() => {
      generatePDF('template-one', 'template-one-resume.pdf');
      resumeElement.className = oldClass;
  
      // Restore zoom settings
      if (viewportMeta && oldViewport) {
        viewportMeta.content = oldViewport;
      }
    }, 300);
  };
  
  return (
    <div className="resume-container">
      <div id="template-one" className="template-one">
        {/* Header */}
        <div className="resume-header">
          <div className="header-left">
            <h1 className="resume-name">{profileData ? profileData.name : "Loading..."}</h1>
            <p className="summary">{pageLoader?<p>Loading...</p>:(profileData ? profileData.profileSummary : "No profile summary added")}</p>
          </div>
          <div className="header-right">
            <p>{pageLoader?<p>Loading...</p>:(profileData ? profileData.address : "No Address added")}</p>
            <p className="email">{pageLoader?<p>Loading...</p>:(profileData ? profileData.email : "No email added")}</p>
            <p style={{marginTop:"-7px"}}>{pageLoader?<p>Loading...</p>:(profileData ? profileData.phoneNumber : "No phone added")}</p>
          </div>
        </div>

        {/* Body */}
        <div  style={{marginTop:"-24px"}} className="resume-body">
          {/* Left Section */}
          <div className="left-section">
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <div>
  <h2 style={{ fontWeight: "700" }} className="section-title">
    EXPERIENCE
  </h2>
  </div>
  <div>
  <h4  className='texp'>
    ( TOTAL EXPERIENCE - {profileData ? `${profileData.Experiance} Years )` : "Loading..."} 
  </h4>
  </div>
</div>

            {pageLoader ? (
  <p>Loading...</p>
) : (
  profileData?.experiences?.length > 0 ? (
    profileData.experiences.map((exp, index) => (
      <div className="experience" key={index}>
        <h3>
          {exp.company}{exp.location && `, ${exp.location}`} — <strong>{exp.role}</strong>
        </h3>

        <div style={{ display: "flex", gap: "4px", alignItems:"center" }}>
          <p className="date">
            {exp.startDate?
            <>
              {new Date(exp.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}</> :<p>No Date Added</p>
            }
          </p>

          {exp.endDate ? (
            <>
              <span style={{marginTop:"4px"}}>-</span>
              <p className="date">
                {new Date(exp.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </>
          ):<><div style={{marginTop:"4px"}}>-</div><p className="date">Present</p></>}
        </div>

        {exp.descriptions?.length > 0 && (
          <ul>
            {exp.descriptions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    ))
  ) : (
    <p>No experiences added</p>
  )
)}

          </div>

          {/* Right Section */}
          
          <div className="right-section">
          {/* <div style={{ marginLeft: "28px" }} className="certification">
  <h4 style={{ marginLeft: "-19px" }}>CERTIFICATION</h4>
  {pageLoader ? (
    <p>Loading...</p>
  ) : profileData && profileData.certifications ? (
    <ul style={{ paddingLeft: "20px" ,marginTop:"-15px"}}>
      {profileData.certifications.map((cert, index) => (
        <li key={index}>{cert.trim()}</li>
      ))}
    </ul>
  ) : (
    <p>No certification added</p>
  )}
</div> */}


            {/* <div className="total-exp">
              <h4>Total Experience</h4>
              <p>{profileData ? `${profileData.Experiance} Years` : "Loading..."}</p>
            </div> */}

            <div className="skills">
              <h4 style={{marginLeft:"8px"}}>CORE TECHNICAL SKILLS</h4>
              {pageLoader?<p>Loading...</p>:(profileData && profileData.skills && profileData.skills.length > 0 ? (
  profileData.skills.map((group, i) => (
    <div style={{marginLeft:"32px"}} className="skill-section" key={i}>
      <h5>{group.heading}</h5>
      <ul>
        {group.items&& group.items.map((skill, j) => (
          <li key={j}>{skill}</li>
        ))}
      </ul>
    </div>
  ))
) : (
  <p>No skills added</p>
))}

            </div>
            <div style={{ marginLeft: "28px" }} className="certification">
  <h4 style={{ marginLeft: "-19px" }}>CERTIFICATION</h4>
  {pageLoader ? (
    <p>Loading...</p>
  ) : profileData && profileData.certifications ? (
    <ul style={{ paddingLeft: "20px" ,marginTop:"-15px"}}>
      {profileData.certifications.map((cert, index) => (
        <li key={index}>{cert.trim()}</li>
      ))}
    </ul>
  ) : (
    <p>No certification added</p>
  )}
</div>
            <div className="skills">
  {/* <h4>LANGUAGES </h4>
  {pageLoader ? (
    <p>Loading...</p>
  ) : (
    profileData && profileData.languages && profileData.languages.length > 0 ? (
      profileData.languages.map((group, i) => (
        <div className="skill-section" key={i}>
          <ul>
            <li key={i}>{group}</li>
          </ul>
        </div>
      ))
    ) : (
      <p>No languages added</p>
    )
  )}
</div> */}
</div>
<div className="certification">
  <h4 style={{color:"#007bff",fontWeight:"900",marginBottom:"4px"}}>QUALIFICATION:</h4>
  {pageLoader ? (
    <p>Loading...</p>
  ) : profileData && profileData.qualificationDetails && profileData.qualificationDetails.length > 0 ? (
    profileData.qualificationDetails.map((qual, index) => (
      <div className="education-info" key={index}>
        <span>{index+1}.</span>
        <span className="degree">{qual.degree || "-"}</span>
        <span className="separator">,</span>
        <span className="percentage">{qual.score || "-"}</span>
        <span className="separator">,</span>
        <span className="college">{qual.collegeName || "-"}</span>
        <span className="separator">,</span>
        <span className="location">{qual.stateCode || "-"}</span>
        <span className="separator">,</span>
        <span className="country">{qual.countryCode || "-"}</span>
      </div>
    ))
  ) : (
    <p>No Qualification added</p>
  )}
</div>

        
            
          </div>
          <div></div>
        </div>
      </div>

      {/* Download Button */}
      <div className="download-button-container">
        <button
          className="download-button"
          onClick={handleDownloadPDF}
        >
          Download Template 1 PDF
        </button>
      </div>
    </div>
  );
};

export default TemplateOne;
