import React, { useState, useEffect, useRef } from "react";
import styles from "./Consultation.module.css";
import { useNavigate,useParams } from "react-router-dom";


const ConsultationCard = ({ title, description, price, onBook }) => {
  const [date, setDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const StudentAuth = localStorage.getItem("StudLog");

  const handleBook = () => {
    if (!date) {
      alert(`Please select a date for ${title}`);
      return;
    }

    if (StudentAuth) {
      // If logged in, book directly
      onBook(title, date);
    } else {
      // If not logged in, show popup
      setShowPopup(true);
    }
  };

  // Close popup when clicking outside
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

  return (
    <div className={styles["consult-card"]}>
    <div className={styles["card-content"]}>
      <h2 className={styles["card-title"]}>{title}</h2>
      <p className={styles["card-desc"]}>{description}</p>
      {price && <p className={styles["card-price"]}>{price}</p>}
    </div>
   
    <div className={styles["card-footer"]}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
      />
  
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
  </div>
  
  );
};

const ConsultationServices = () => {
  const handleBooking = (type, date) => {
    alert(`Booked ${type} on ${date}`);
  };
  const navigate = useNavigate();
  return (
    <>
    <button
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
      
     <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        fontWeight:"bold",
        marginTop:"-62px",
        marginRight:"-26"
      }}
    >
     <h2 style={{ marginRight: "-27px" }}>Consultation Services</h2>

    </div>
    <div className={styles["consult-container"]}>
      <ConsultationCard
        title="Free Consultation"
        description="Please select a date. Our team will review your profile and get back to you shortly"
        onBook={handleBooking}
      />

      <ConsultationCard 
        title="Paid Consultation"
        description="Boost your career with ITwalkin Experts!
        Get your profile reviewed, resume enhanced, and personalized career advice.Book your paid consultation today."
        onBook={handleBooking}
      />

      <ConsultationCard
        title="Premium Paid Consultation"
        description="Please select the date. We will get back to you. Rootcause Analysis and Fix Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert. Dedicated Expert will analyze the root cause. One to one interaction with ITwalkin Expert."
        onBook={handleBooking}
      />
    </div>
    </>
  );
};

export default ConsultationServices;
