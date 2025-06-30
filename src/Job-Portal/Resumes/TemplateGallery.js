import React, { useEffect, useRef, useState } from 'react';
import './gallery.css';
import template1 from "../img/template1.png";
import { useNavigate } from 'react-router-dom';

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
            pointerEvents: 'none'
          }}>+</span>
        </div>
      )}
    </div>
  );
};

const TemplateGallery = ({ onSelect }) => {
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
      <div
        style={{ position: "relative" }}
        className="template-card"
        onClick={() => setResumeAlert({ show: true, selected: 'one' })}
      >
        <Magnifier src={template1} alt="Template One" className="blurred" />
        <p>Template 1</p>
      </div>

      {resumeAlert.show && (
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
                  setResumeAlert({ show: false, selected: null });
                  navigate("/My-Profile");
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
                Yes
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
                Continue to Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
