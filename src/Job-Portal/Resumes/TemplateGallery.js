import React, { useEffect, useRef, useState } from 'react';
import './gallery.css';
import template1 from "../img/template1.png";
import template2 from "../img/template2.png";
import template3 from "../img/template3.png";
import template4 from "../img/template4.JPG";
import { useNavigate } from 'react-router-dom';
import TemplateTwo from './TemplateTwo';

const Magnifier = ({ src, alt, className }) => {
  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const [showLens, setShowLens] = useState(false);
  const [lensStyle, setLensStyle] = useState({});

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = lens.offsetWidth;
    const lensHeight = lens.offsetHeight;

    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    const left = clampedX - lensWidth / 2;
    const top = clampedY - lensHeight / 2;

    const bgX = (clampedX / rect.width) * 100;
    const bgY = (clampedY / rect.height) * 100;

    setLensStyle({
      display: 'block',
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: '200px',
      height: '200px',
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '500% 500%',
      backgroundPosition: `${bgX}% ${bgY}%`,
      pointerEvents: 'none',
      zIndex: 2,
      border: "1px solid black",
      borderRadius: "4px"
    });
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className={className} />
      {showLens && (
        <div ref={lensRef} style={lensStyle}>
          <span style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: '24px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
           
          }}>+</span>
        </div>
      )}
    </div>
  );
};

const TemplateGallery = ({ onSelect, logoutresume }) => {
  const [resumeAlert, setResumeAlert] = useState({ show: false, selected: null });
  const alertRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setResumeAlert({ show: false, selected: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="template-gallery">
      
      <div style={{ display: "flex", flexDirection: "column", gap: "40px",}}>
  {/* First row: Template 1 & 2 */}
  <div style={{ display: "flex", gap: "40px", flexWrap:"wrap"  }}>
    <div
      style={{ fontWeight: "bold" }}
      className="template-card template1"
      onClick={() => setResumeAlert({ show: true, selected: "one" })}
    >
      <p style={{ marginBottom: "30px", fontWeight: "bold" }}>
     <h2 style={{color:"#280463"}}>2+ YRS OF EXPERIENCE RESUME</h2><br></br>
        This template is suitable for IT professionals with 2+ years of experience. 
        You can add up to 20 bullet points
      </p>
      <Magnifier src={template1} alt="Template One" className="blurred" />
      {/* <p>Template 1</p> */}
    </div>

    <div
      style={{ width: "600px", fontWeight: "bold" }}
      className="template-card template2"
      onClick={() => setResumeAlert({ show: true, selected: "two" })}
    >
      <p>
     <h2 style={{color:"#280463"}}>FRESHER RESUME</h2><br></br>
        This template is suitable for recent graduates across all domains. 
        You can add up to 12 bullet points to highlight education, skills, and academic projects.
      </p>
      <Magnifier src={template3} alt="Template Two" className="blurred" />
      {/* <p>Template 2</p> */}
    </div>
  </div>

  {/* Second row: Template 3 & 4 */}
  <div style={{ display: "flex", gap: "40px", flexWrap:"wrap" }}>
    <div
      style={{ fontWeight: "bold" }}
      className="template-card template3"
      onClick={() => setResumeAlert({ show: true, selected: "three" })}
    >
      <p>
      <h2 style={{color:"#280463"}}>FRESHER RESUME</h2><br></br>
        This template is suitable for recent graduates across all domains. 
        You can add up to 12 bullet points to highlight education, skills, and academic projects.
      </p>
      <Magnifier src={template3} alt="Template Three" className="blurred" />
      {/* <p>Template 3</p> */}
    </div>

    <div
      style={{ fontWeight: "bold" }}
      className="template-card template4"
      onClick={() => setResumeAlert({ show: true, selected: "four" })}
    >
      <p>
      <h2 style={{color:"#280463"}}>FULL STACK DEVELOPER RESUME</h2><br></br>
       This template is ideal for aspiring Full Stack Developers, providing up to 12 bullet points to highlight education, frontend and backend skills, frameworks, and key projects.
      </p>
      <Magnifier src={template4} alt="Template Four" className="blurred" />
      {/* <p>Template 4</p> */}
    </div>
  </div>
</div>


      {resumeAlert.show && (
        logoutresume==true?
        <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        
        }}
      >
        <div
          ref={alertRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '300px',
            padding: '20px',
            backgroundColor: 'rgb(40,4,99)',
            color: 'white',
            fontSize: '12px',
            borderRadius: '5px',
            zIndex: 9999,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
           
          }}
        >
Login as a Job Seeker to explore opportunities and create a strong resume!
          <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
            <button
             onClick={() => { 
              navigate("/Job-Seeker-Login", {
              state: { loginpage: "resume" },
            }); setResumeAlert({ show: false, selected: null })}}
            
             style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
               
              }}
            >
             Login as  Jobseeker
            </button>
            <button
              onClick={() => {
                setResumeAlert({ show: false, selected: null })
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
                 
                
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
        :
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          
          }}
        >
          <div
            ref={alertRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '300px',
              padding: '20px',
              backgroundColor: 'rgb(40,4,99)',
              color: 'white',
              fontSize: '12px',
              borderRadius: '5px',
              zIndex: 9999,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
             
            }}
          >
            Ensure your profile is fully completed
            <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
              <button
               onClick={() => {
                if (resumeAlert?.selected === "one") {
                  navigate("/resume-form", {
                    state: { formstate: "experience" },
                  });
                }
                else {
                  navigate("/resume-form", {
                    state: { formstate: "freshers" },
                  });
                }
                setResumeAlert({ show: false, selected: null });
              }}
              
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '12px',
                  cursor: 'pointer',
                 
                }}
              >
               Continue to Edit profile
              </button>
              <button
                onClick={() => {
                  onSelect(resumeAlert.selected);
                  setResumeAlert({ show: false, selected: null });
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '12px',
                  cursor: 'pointer',
                   
                  
                }}
              >
                Continue to Download Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
