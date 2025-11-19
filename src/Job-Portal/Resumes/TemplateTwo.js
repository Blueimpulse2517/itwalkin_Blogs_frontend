import React, { useEffect, useState } from "react";
import styles from "./templateTwo.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateTwo = () => {
  const [profileData, setProfileData] = useState(null);
  const [pageLoader, setPageLoader] = useState(false);
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      setPageLoader(true);
      try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`);
        setProfileData(res.data.result);

        // Convert image to base64
        if (res.data.result?.Gpicture) {
          const base64 = await toDataURL(res.data.result.Gpicture);
          localStorage.setItem("profileImageBase64", base64);
        }
        setPageLoader(false);
      } catch (err) {
        alert("Something went wrong while fetching profile");
        setPageLoader(false);
      }
    };

    const toDataURL = async (url) => {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    fetchProfile();
  }, [studId]);

  const handleDownloadPDF = () => {
    const resumeElement = document.getElementById("template-two");
    const oldClass = resumeElement.className;

    const viewportMeta = document.querySelector('meta[name=viewport]');
    const oldViewport = viewportMeta ? viewportMeta.content : null;
    if (viewportMeta) viewportMeta.content = "width=device-width, initial-scale=1, maximum-scale=1";

    resumeElement.className = oldClass + " " + styles.forceA4;
    setTimeout(() => {
      generatePDF("template-two", `${profileData.name}_resume.pdf`);
      resumeElement.className = oldClass;

      if (viewportMeta && oldViewport) viewportMeta.content = oldViewport;
    }, 300);
  };

  return (
    <div className={styles.resumeContainer}>
      <div id="template-two" className={styles.templateTwo}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.name}>{profileData?.name || "Loading..."}</h1>
            <p className={styles.objective}>
              {profileData?.profileSummary || "Career objective not added yet"}
            </p>
          </div>

          <div className={styles.headerCenter}>
            {profileData?.imageConsent === true && profileData?.Gpicture ? (
              <img
                src={profileData?.Gpicture}
                alt="Candidate"
                className={styles.photo}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>

          <div className={styles.headerRight}>
            <p>{profileData?.phoneNumber || "No Phone"}</p>
            <p>{profileData?.email || "No Email"}</p>
            <p>{profileData?.address || "No Address"}</p>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Left Section */}
          <div className={styles.left}>
          <section>
  <h3>EDUCATION QUALIFICATION</h3>
  {profileData?.qualificationDetails?.length > 0 ? (
    <ul className={styles.educationSection}>
      {profileData?.qualificationDetails?.map((edu, i) => (
        <li key={i} className={styles.educationItem}>
          <div className={styles.educationLeft}>
            {edu?.collegeName} <br />
            <span style={{ fontWeight: "normal" }}>{edu?.degree}</span>
          </div>
          <div style={{marginRight:"10%"}} className={styles.educationRight}>
            {/* <div>{edu.year || "----"}</div> */}
            <div >{edu?.score ? `${edu?.score}` : "N/A"}</div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No education details added</p>
  )}
</section>


            <section>
              <h3>ACHIEVEMENTS AND EXTRA-CURRICULAR ACTIVITIES</h3>
              {profileData?.achievements?.length > 0 ? (
                <ul>
                  {profileData?.achievements?.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              ) : (
                <p>No achievements added</p>
              )}
            </section>

            <section>
              <h3>ACADEMIC PROJECTS UNDERTAKEN</h3>
              {profileData?.projects?.length > 0 ? (
                <ul>
                  {profileData?.projects?.map((proj, i) => (
                    <li key={i}>{proj}</li>
                  ))}
                </ul>
              ) : (
                <p>No projects added</p>
              )}
            </section>
          </div>

          {/* Right Section */}
          <div className={styles.right}>
          <section>
  <h3>SKILLS</h3>
  {profileData?.skills?.length > 0 ? (
    <div className={styles.skillsWrapper}>
      {profileData?.skills?.map((group, i) =>
        group.items?.map((item, j) => (
          <span key={`${i}-${j}`} className={styles.skillTag}>
            {item}
          </span>
        ))
      )}
    </div>
  ) : (
    <p>No skills added</p>
  )}
</section>


            {/* <section>
              <h3>TECHNICAL SKILLS</h3>
              {profileData?.technicalSkills?.length > 0 ? (
                <ul>
                  {profileData.technicalSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No technical skills added</p>
              )}
            </section> */}

            <section>
              <h3>LANGUAGES</h3>
              {profileData?.languages?.length > 0 ? (
                <ul>
                  {profileData?.languages?.map((lang, i) => (
                    <li key={i}>{lang}</li>
                  ))}
                </ul>
              ) : (
                <p>No languages added</p>
              )}
            </section>
            
            <section>
              <h3>WORK EXPERIENCE</h3>
              {profileData?.experiences?.length > 0 ? (
                <ul>
                  {profileData?.experiences?.map((exp, i) => (
                    <li key={i}>
                      {exp?.company} — {exp?.role} <br></br>
                      ({new Date(exp?.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })} -{" "}
                      {exp?.endDate?
                      (new Date(exp.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })) 
                      : "Present"})
                      
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No work experience added</p>
              )}
            </section>

            <section>
              <h3>PERSONAL DETAILS</h3>
              <div style={{display:"flex", flexWrap:"wrap", gap:"4px"}}>
              <div className={styles.personalTag}>Gender: {profileData?.personalDetails[0]?.gender || "N/A"}</div>
              {/* <div className={styles.personalTag}>Religion: {profileData?.religion || "N/A"}</div> */}
              <div className={styles.personalTag}>Marital Status: {profileData?.personalDetails[0]?.maritalStatus || "N/A"}</div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className={styles.downloadContainer}>
        <button onClick={handleDownloadPDF} className={styles.downloadButton}>
          Download Template 2 PDF
        </button>
      </div>
    </div>
  );
};

export default TemplateTwo;
