import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ResumePreview.module.css";

const ResumePreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const studId = localStorage.getItem("StudId");
   const logoutresume = !(Boolean(studId));
  const [resumeAlert, setResumeAlert] = useState({
    show: false,
    selected: null
  });

  const alertRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setResumeAlert({ show: false, selected: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!state) return null;

  const { img, templateKey } = state;

  return (
    <>
      {/* Back Button */}
      <div className={styles.backWrapper}>
        <div
          className={styles.resumebackbtn}
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/resumes");
            }
          }}
        >
          Back
        </div>
      </div>

      {/* Preview */}
      <div className={styles.previewWrapper}>
         <div style={{display:"flex",justifyContent:"center", backgroundColor:"#f2f2f2"}}>
         <h1>This is how your Resume will look</h1>
         </div>
        <div className={styles.previewContainer} >
           
          <img
            src={img}
            alt="Resume Preview"
            className={styles.previewImage}
            onClick={() =>
              setResumeAlert({ show: true, selected: templateKey })
            }
          />
        </div>

        {/* Alert */}
        {resumeAlert.show && (
          <div className={styles.overlay}>
            <div
              ref={alertRef}
              className={styles.alertBox}
              onClick={(e) => e.stopPropagation()}
            >
              {logoutresume === true ? (
                <>
                  Login as a Job Seeker to explore opportunities and create a
                  strong resume!
                  <div className={styles.btnGroup}>
                    <button
                      className={styles.successBtn}
                      onClick={() => {
                        navigate("/Job-Seeker-Login", {
                          state: { loginpage: "resume" }
                        });
                        setResumeAlert({ show: false, selected: null });
                      }}
                    >
                      Login as Jobseeker
                    </button>

                    <button
                      className={styles.dangerBtn}
                      onClick={() =>
                        setResumeAlert({ show: false, selected: null })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  Ensure your profile is fully completed
                  <div className={styles.btnGroup}>
                    <button
                      className={styles.successBtn}
                      onClick={() => {
                        if (resumeAlert.selected === "one") {
                          navigate("/resume-form", {
                            state: { formstate: "experience" }
                          });
                        }
                        else if (resumeAlert.selected === "two") {
                          navigate("/resume-form", {
                            state: { formstate: "entrylevelambition" }
                          });
                        }
                        else if (resumeAlert.selected === "three") {
                          navigate("/resume-form", {
                            state: { formstate: "entrylevelpro" }
                          });
                        }
                        else if (resumeAlert.selected === "five") {
                          navigate("/resume-form", {
                            state: { formstate: "testing" }
                          });
                        }
                       else if (resumeAlert.selected === "six") {
                          navigate("/resume-form", {
                            state: { formstate: "nontech" }
                          });
                        }
                        else if (resumeAlert.selected === "four") {
                          navigate("/resume-form", {
                            state: { formstate: "fullstack" }
                          });
                        }
                        else {
                          navigate("/resume-form", {
                            state: { formstate: "freshers" }
                          });
                        }
                        setResumeAlert({ show: false, selected: null });
                      }}
                    >
                      Continue to Edit profile
                    </button>

                    <button
                      className={styles.dangerBtn}
                      onClick={() => {
                        navigate("/resumes", {
                          state: { selectedTemplate: templateKey }
                        });
                        setResumeAlert({ show: false, selected: null });
                      }}
                    >
                      Continue to Download Resume
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResumePreview;


