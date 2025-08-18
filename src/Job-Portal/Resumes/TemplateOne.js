import React, { useEffect, useState } from 'react';
import './templateOne.css';
import { generatePDF } from './generatePDF';
import axios from 'axios';

const TemplateOne = () => {
  const [profileData, setProfileData] = useState(null);
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      const userid = JSON.parse(localStorage.getItem("StudId"));
      const headers = {
        authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog")))
      };
      try {
        const res = await axios.get(`/StudentProfile/getProfile/${studId}`, { headers });
        setProfileData(res.data.result);
        console.log("pd",profileData)
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
      {
        title: 'Languages',
        skills: ['Java', 'Python', 'VBA', 'C++'],
      },
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
            <p className="summary">{data.summary}</p>
          </div>
          <div className="header-right">
            <p>{data.address}</p>
            <p className="email">{profileData ? profileData.email : "Loading..."}</p>
            <p>{profileData ? profileData.phoneNumber : "Loading..."}</p>
          </div>
        </div>

        {/* Body */}
        <div className="resume-body">
          {/* Left Section */}
          <div className="left-section">
            <h2 className="section-title">EXPERIENCE</h2>
            {data.experience.map((exp, index) => (
              <div className="experience" key={index}>
                <h3>{exp.company}, {exp.location} — <strong>{exp.title}</strong></h3>
                <p className="date">{exp.date}</p>
                <ul>
                  {exp.details.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="right-section">
            <div className="certification">
              <h4>Certification</h4>
              <p>{data.certification}</p>
            </div>

            <div className="total-exp">
              <h4>Total Experience</h4>
              <p>{profileData ? `${profileData.Experiance} Years` : "Loading..."}</p>
            </div>

            <div className="skills">
              <h4>CORE TECHNICAL SKILLS</h4>
              {data.technicalSkills.map((group, i) => (
                <div className="skill-section" key={i}>
                  <h5>{group.title}</h5>
                  <ul>
                    {group.skills.map((skill, j) => (
                      <li key={j}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
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
