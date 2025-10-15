// import React, { useState } from "react";
// import styles from "./Consultation.module.css";

// const ConsultationCard = ({ title, description, price, onBook }) => {
//   const [date, setDate] = useState("");

//   const handleBook = () => {
//     if (!date) {
//       alert(`Please select a date for ${title}`);
//       return;
//     }
//     onBook(title, date);
//   };

//   return (
//     <div className={styles["consult-card"]}>
//       <div className={styles.tags}>For one person</div>
//       <h2 className={styles["card-title"]}>{title}</h2>
//       <p className={styles["card-desc"]}>{description}</p>
//       <p className={styles["card-price"]}>{price}</p>

//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />
//       <button className={styles.bookbutton} onClick={handleBook}>BOOK NOW</button>
//     </div>  
//   );
// };

// const ConsultationServices = () => {
//   const handleBooking = (type, date) => {
//     alert(`Booked ${type} on ${date}`);
//   };

//   return (
//     <div className={styles["consult-container"]}>
//     <ConsultationCard
//       title="Free Consultation"
//       description="Please select the date. We will get back to you. Review by expert on submission of profile."
//       price="Free"
//       onBook={handleBooking}
//     />
  
//     <ConsultationCard
//       title="Paid Consultation"
//       description="Please select the date. We will get back to you. Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert."
//       price="INR 30000"
//       onBook={handleBooking}
//     />
  
//     <ConsultationCard
//       title="Paid Consultation"
//       description="Please select the date. We will get back to you. Rootcause Analysis and Fix Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert. Dedicated Expert will analyze the root cause. One to one interaction with ITwalkin Expert."
//       price="INR 50000"
//       onBook={handleBooking}
//     />
//   </div>
  
//   );
// };

// export default ConsultationServices;
// import React, { useState } from "react";
// import styles from "./Consultation.module.css";

// const ConsultationCard = ({ title, description, price, onBook }) => {
//   const [date, setDate] = useState("");
//   const [showPopup, setShowPopup] = useState(false); // added popup state

//   const handleBook = () => {
//     if (!date) {
//       alert(`Please select a date for ${title}`);
//       return;
//     }
//     setShowPopup(true); // show popup instead of booking immediately
//   };

//   return (
//     <div className={styles["consult-card"]}>
//       {showPopup && (
//         <div className={styles.popup}>
//           <p>Confirm booking for this consultation?</p>
//           <div className={styles["popup-buttons"]}>
//             <button onClick={() => { setShowPopup(false); onBook(title, date); }}>Yes</button>
//             <button onClick={() => setShowPopup(false)}>No</button>
//           </div>
//         </div>
//       )}

//       <div className={styles.tags}>For one person</div>
//       <h2 className={styles["card-title"]}>{title}</h2>
//       <p className={styles["card-desc"]}>{description}</p>
//       <p className={styles["card-price"]}>{price}</p>

//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />
//       <button className={styles.bookbutton} onClick={handleBook}>
//         BOOK NOW
//       </button>
//     </div>
//   );
// };

// const ConsultationServices = () => {
//   const handleBooking = (type, date) => {
//     alert(`Booked ${type} on ${date}`);
//   };

//   return (
//     <div className={styles["consult-container"]}>
//       <ConsultationCard
//         title="Free Consultation"
//         description="Please select the date. We will get back to you. Review by expert on submission of profile."
//         price="Free"
//         onBook={handleBooking}
//       />

//       <ConsultationCard
//         title="Paid Consultation"
//         description="Please select the date. We will get back to you. Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert."
//         price="INR 30000"
//         onBook={handleBooking}
//       />

//       <ConsultationCard
//         title="Paid Consultation"
//         description="Please select the date. We will get back to you. Rootcause Analysis and Fix Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert. Dedicated Expert will analyze the root cause. One to one interaction with ITwalkin Expert."
//         price="INR 50000"
//         onBook={handleBooking}
//       />
//     </div>
//   );
// };

// export default ConsultationServices;

// import React, { useState } from "react";
// import styles from "./Consultation.module.css";

// const ConsultationCard = ({ title, description, price, onBook }) => {
//   const [date, setDate] = useState("");
//   const [showPopup, setShowPopup] = useState(false);

//   const handleBook = () => {
//     if (!date) {
//       alert(`Please select a date for ${title}`);
//       return;
//     }
//     setShowPopup(true);
//   };

//   return (
//     <div className={styles["consult-card"]}>
//       <div className={styles.tags}>For one person</div>
//       <h2 className={styles["card-title"]}>{title}</h2>
//       <p className={styles["card-desc"]}>{description}</p>
//       <p className={styles["card-price"]}>{price}</p>

//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />

//       {/* Button wrapper ensures popup appears just above the button */}
//       <div className={styles["button-wrapper"]}>
//         {showPopup && (
//           <div className={styles.popup}>
//             <p>Confirm booking for this consultation?</p>
//             <div className={styles["popup-buttons"]}>
//               <button
//                 onClick={() => {
//                   setShowPopup(false);
//                   onBook(title, date);
//                 }}
//               >
//                 Yes
//               </button>
//               <button onClick={() => setShowPopup(false)}>No</button>
//             </div>
//           </div>
//         )}

//         <button className={styles.bookbutton} onClick={handleBook}>
//           BOOK NOW
//         </button>
//       </div>
//     </div>
//   );
// };

// const ConsultationServices = () => {
//   const handleBooking = (type, date) => {
//     alert(`Booked ${type} on ${date}`);
//   };

//   return (
//     <div className={styles["consult-container"]}>
//       <ConsultationCard
//         title="Free Consultation"
//         description="Please select the date. We will get back to you. Review by expert on submission of profile."
//         price="Free"
//         onBook={handleBooking}
//       />

//       <ConsultationCard
//         title="Paid Consultation"
//         description="Please select the date. We will get back to you. Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert."
//         price="INR 30000"
//         onBook={handleBooking}
//       />

//       <ConsultationCard
//         title="Paid Consultation"
//         description="Please select the date. We will get back to you. Rootcause Analysis and Fix Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert. Dedicated Expert will analyze the root cause. One to one interaction with ITwalkin Expert."
//         price="INR 50000"
//         onBook={handleBooking}
//       />
//     </div>
//   );
// };

// export default ConsultationServices;

import React, { useState, useEffect, useRef } from "react";
import styles from "./Consultation.module.css";
import { Navigate, useNavigate } from "react-router-dom";

const ConsultationCard = ({ title, description, price, onBook }) => {
  const [date, setDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null); // reference for popup div

  const handleBook = () => {
    if (!date) {
      alert(`Please select a date for ${title}`);
      return;
    }
    setShowPopup(true);
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
  const navigate = useNavigate()
  let StudentAuth = localStorage.getItem("StudLog")

  return (
    <div className={styles["consult-card"]}>
      <div className={styles.tags}>For one person</div>
      <h2 className={styles["card-title"]}>{title}</h2>
      <p className={styles["card-desc"]}>{description}</p>
      <p className={styles["card-price"]}>{price}</p>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className={styles["btn-wrapper"]}>
        <button className={styles.bookbutton} onClick={handleBook}>
          BOOK NOW
        </button>

        {showPopup && (
          <div ref={popupRef} className={styles.popup}>
            <p>Login as a Jobseeker to explore personalized consultation services designed to boost your career.</p>
            <div className={styles["popup-buttons"]}>
            <button
  onClick={() => {
    if (StudentAuth) {
      // When studentAuth exists (user is logged in)
      onBook(title, date);
    } else {
      // When not logged in
      navigate("/Job-Seeker-Login", {
        state: { loginpage: "consult" },
      });
    }
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
  );
};

const ConsultationServices = () => {
  const handleBooking = (type, date) => {
    alert(`Booked ${type} on ${date}`);
  };


  
  return (
    <div className={styles["consult-container"]}>
      <ConsultationCard
        title="Free Consultation"
        description="Please select the date. We will get back to you. Review by expert on submission of profile."
        price="Free"
        onBook={handleBooking}
      />

      <ConsultationCard
        title="Paid Consultation"
        description="Please select the date. We will get back to you. Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert."
        // price="INR 30000"
        onBook={handleBooking}
      />

      <ConsultationCard
        title="Premium Paid Consultation"
        description="Please select the date. We will get back to you. Rootcause Analysis and Fix Review by expert on submission of profile. Dedicated phone call with ITwalkin Experts. Resume Enhancement by ITwalkin Expert. Dedicated Expert will analyze the root cause. One to one interaction with ITwalkin Expert."
        // price="INR 50000"
        onBook={handleBooking}
        
      />
    </div>
  );
};

export default ConsultationServices;
