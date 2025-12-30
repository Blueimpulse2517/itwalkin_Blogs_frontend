import React, { useEffect, useRef, useState } from "react";
import "./gallery.css";
import template1 from "../img/template1.JPG";
import template2 from "../img/template2.png";
import template3 from "../img/template3.jpg";
import template4 from "../img/template4.png";
import template5 from "../img/template5.jpg";
import template6 from "../img/template6.png";
import { useNavigate } from "react-router-dom";

const TemplateGallery = ({ onSelect, logoutresume }) => {
  const [resumeAlert, setResumeAlert] = useState(false);
  const alertRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setResumeAlert(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPreview = (templateKey, img) => {
    navigate("/resume-preview", {
      state: { templateKey, img },
    });
  };

  return (
    <div className="template-gallery">
      <div className="template-grid">
        <div
          className="template-card"
          onClick={() => { 
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else 
            openPreview("one", template1)
          }}
        >
          <h2>Generic Resume<br />Mid Level (2+ YRS)</h2>
          <p>
            This template is suitable for IT professionals with 2+ years of
            experience. You can add up to 20 bullet points.
          </p>
          <img src={template1} alt="Template One" className="blurred" />
        </div>

        <div
          className="template-card"
          onClick={() => { 
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else 
            openPreview("four", template4)
          }}
        >
          <h2>Full Stack Developer Resume</h2>
          <p>
            This resume is created for Full Stack Web Developer
          </p>
          <img src={template4} alt="Template Four" className="blurred" />
        </div>

        <div
          className="template-card"
          onClick={() => { 
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else 
            openPreview("five", template3)
          }}
        >
          <h2>Tester Resume</h2>
          <p>
          Perfect for testers with hands-on experience in functional and UI testing.
          </p>
          <img src={template3} alt="Template Five" className="blurred" />
        </div>

        <div
          className="template-card"
          onClick={() => { 
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else 
            openPreview("three", template5)}
          }
        >
          <h2>Entry Level – Pro</h2>
          <p>
           Designed for a fresher with skills like Pro
          </p>
          <img src={template5} alt="Template Three" className="blurred" />
        </div>

        <div
          className="template-card"
          onClick={() =>{ 
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else 
            openPreview("two", template2)

          } }
        >
          <h2>Entry Level – Ambition</h2>
          <p>
            Designed to achieve your Ambition
          </p>
          <img src={template2} alt="Template Two" className="blurred" />
        </div>

        <div
          className="template-card"
          onClick={() => {
            // if (logoutresume === true) {
            //   setResumeAlert(true);
            // } else {
              openPreview("six", template6);
           
          }}
          >
          <h2>Non-Tech Resume</h2>
          <p>
            Best suited for non-technical job roles.
          </p>
          <img src={template6} alt="Template Six" className="blurred" />
        </div>
      </div>
      {resumeAlert && (
  logoutresume === true ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={alertRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "300px",
          padding: "20px",
          backgroundColor: "rgb(40,4,99)",
          color: "white",
          fontSize: "12px",
          borderRadius: "5px",
          zIndex: 9999,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        Login as a Job Seeker to explore opportunities and create a strong resume!

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={() => {
              navigate("/Job-Seeker-Login", {
                state: { loginpage: "resume" },
              });
              setResumeAlert(false);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Login as Jobseeker
          </button>

          <button
            onClick={() =>
              setResumeAlert(false)
            }
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null
)}

                     
    </div>
  );
};

export default TemplateGallery;
