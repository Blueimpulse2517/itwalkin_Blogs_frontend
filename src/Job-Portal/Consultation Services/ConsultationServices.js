import React, { useState, useEffect, useRef } from "react";
import styles from "./Consultation.module.css";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../SizeHook";

const ConsultationCard = ({ title, description, price, onBook }) => {
  const [date, setDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const StudentAuth = localStorage.getItem("StudLog");

  const handleBook = () => {
    if (!date) {
      alert(`Please select a date for ${title}`);
      return;
    }

    if (StudentAuth) {
      onBook(title, date);
      setConfirmPopup(true);
    } else {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const screenSize = useScreenSize();

  return (
    <div className={styles["consult-card"]}>
      <div className={styles["card-content"]}>
        <h2 className={styles["card-title"]}>{title}</h2>
        <p className={styles["card-desc"]}>{description}</p>
        {price && <p className={styles["card-price"]}>{price}</p>}
      </div>

      <div className={styles["card-footer"]}>
        <div className={styles.dateWrapper}>
  <input
    type="date"
    className={styles.dateInput}
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
  {!date && (
    <span className={styles.fakePlaceholder}></span>
  )}
</div>

        <div className={styles["button-wrapper"]}>
          <button className={styles.bookbutton} onClick={handleBook}>
            BOOK NOW
          </button>

          {showPopup && (
            <div ref={popupRef} className={styles.popup}>
              <p>
                Login as a Job Seeker to explore personalized consultation services
                designed to boost your career.
              </p>
              <div className={styles["popup-buttons"]}>
                <button
                  onClick={() => {
                    navigate("/Job-Seeker-Login", {
                      state: { loginpage: "consult" },
                    });
                    setShowPopup(false);
                  }}
                >
                  Yes
                </button>
                <button onClick={() => setShowPopup(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmPopup && (
        <div className={styles.centerPopup}>
          <p>
            {title} Scheduled for {date}
            <br />
            ITWALKIN.com offers expert career advice both free and paid. ITWALKIN.com is not affiliated with third-party consultants unless clearly stated.
          </p>
          <div className={styles["popup-buttons"]}>
            <button onClick={() => setConfirmPopup(false)}>OK</button>
            <button onClick={() => setConfirmPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ConsultationServices = () => {
  const navigate = useNavigate();

  const handleBooking = (type, date) => {
    console.log(type, date);
  };

  return (
    <>
      <button style={{marginTop:"10px"}}
        className={styles.tvbackbtn}
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/alljobs");
          }
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
      </button>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px", fontWeight: "bold" , marginTop:"-41px"}}>
        <h2>Consultation Services</h2>
      </div>

      <div className={styles["consult-container"]}>
        <ConsultationCard
          title="Free Consultation"
          description="Feeling stuck, overwhelmed, or unsure about your next career move? Our free jobseeker consultation is here to help you gain clarity, confidence, and direction — at no cost. Whether you're: crafting your resume and not sure what recruiters want, exploring new roles but unsure where to start, preparing for interviews and need expert tips, looking to switch industries or upskill strategically, and looking to boost your professional growth further while navigating today’s fast-changing job market effectively. stuck, overwhelmed, or unsure about your next career move? Get clarity and direction at no cost."
          onBook={handleBooking}
        />

        <ConsultationCard
          title="Paid Consultation"
          description="Supercharge your career with ITwalkin Experts. Get your professional profile reviewed by industry specialists. Receive a polished, recruiter-ready resume tailored to your goals. Unlock personalized career guidance aligned with your aspirations. Stand out in today’s competitive job market with expert support. Our consultations are designed to give you clarity and confidence. Book your paid session now and take the next step forward. Your career deserves expert attention — let’s make it happen."
          onBook={handleBooking}
        />

        <ConsultationCard
          title="Premium Paid Consultation"
          description="Submit your profile for a detailed root cause analysis by our experts. Receive a personalized fix review to uncover what’s holding you back. Get your resume professionally enhanced for better recruiter visibility. Enjoy a dedicated one-on-one phone consultation with ITwalkin Experts. Our specialists dive deep into your career challenges and opportunities. Every insight is tailored to your goals, strengths, and job aspirations. Benefit from expert guidance that’s focused, actionable, and results-driven."
          onBook={handleBooking}
        />
      </div>
    </>
  );
};

export default ConsultationServices;
