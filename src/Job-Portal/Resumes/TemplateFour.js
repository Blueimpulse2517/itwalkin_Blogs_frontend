import React, { useEffect, useState } from "react";
import styles from "./TemplateFour.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateFour = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [profileData, setProfileData] = useState({});
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`);
        setProfileData(res.data.result || {});

        // convert image to base64 same as other templates
        if (res.data.result?.Gpicture) {
          const base64 = await toDataURL(res.data.result.Gpicture);
          localStorage.setItem("profileImageBase64", base64);
        }
      } catch {
        alert("Failed to load profile");
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

  const handlePDF = () => {
    const resume = document.getElementById("template-four");
    const old = resume.className;

    const viewport = document.querySelector("meta[name=viewport]");
    const oldVp = viewport?.content;

    if (viewport)
      viewport.content = "width=device-width, initial-scale=1, maximum-scale=1";

    resume.className = old + " " + styles.forceA4;

    setTimeout(() => {
      generatePDF("template-four", `${profileData?.name || "resume"}.pdf`);
      resume.className = old;

      if (viewport && oldVp) viewport.content = oldVp;
    }, 300);
  };

  const exp = profileData.experiences || [];
  const edu = profileData.qualificationDetails || [];
  const proj = profileData.projects || [];
  const ach = profileData.achievements || [];
  const langs = profileData.languages || [];

  return (
    <div className={styles.pageWrapper}>
        
      <div id="template-four" className={styles.templateFour} >
      <div>
            {/* NAME */}
          <h1 className={styles.name}>{profileData?.name || ""}</h1>

          {/* ROLE + SPECIALIZATION ROW */}
          <div className={styles.roleRow}>
            <span className={styles.rolePrimary}>Full Stack Developer</span>
            {/* <span className={styles.roleSecondary}>Cloud & Microservice Specialist</span> */}
          </div>

          {/* HARDCODED CONTACT ROW */}
          <div className={styles.contactRow}>
            <span>📞 {profileData?.phoneNumber|| ""}</span>
            <span>•</span>
            <span>✉ {profileData?.email|| ""}</span>
            <span>•</span>
            <span>🔗 linkedin.com</span>
            <span>•</span>
            <span>📍 {profileData?.email|| ""}</span>
          </div>
        </div>
           
           <div style={{display:"flex", gap:"4px"}}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>

          

          {/* SUMMARY */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>SUMMARY</div>
            <p className={styles.summaryText}>
              {profileData?.profileSummary ||""}
            </p>
          </div>

          {/* EXPERIENCE */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>EXPERIENCE</div>

            {(exp.length ? exp : [1, 2, 3]).slice(0, 3).map((item, i) => (
              <div key={i} className={styles.expEntry}>
                <div className={styles.expHeader}>
                  <span className={styles.expRole}>
                    {item.role || "Full Stack Developer"}
                  </span>
                </div>

                <div className={styles.expCompanyRow}>
                  <span className={styles.expCompany}>{item.company || ""}</span>

                  <span className={styles.expDate}>
                  {item.startDate?  
                  (new Date(item.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })):<span>N/A</span> 
            }  — 
              {item.endDate?
              (new Date(item.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })):<span>Present</span>
            }
                  </span>

                  {/* <span className={styles.expLoc}>📍 {item.location || "Indianapolis, IN"}</span> */}
                </div>

                <ul className={styles.expBullets}>
                  {item.descriptions?
                  (item.descriptions.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))):"N/A"
                }
                </ul>
              </div>
            ))}
          </div>

          {/* EDUCATION */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>EDUCATION</div>

            {(edu.length ? edu : [1]).map((e, i) => (
              <div key={i} className={styles.eduEntry}>
                <div className={styles.eduDegree}>
                  {e.degree || "N/A"}
                </div>
                <div className={styles.expRole} style={{color:"#1a5ac3", fontWeight:"700"}}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div>{e.collegeName || "N/A"}</div>
                    <div>  {e.score|| "N/A"} </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          {/* TECHNICAL STACK */}
          <div className={styles.sectionBlock}>

          
            <div className={styles.sectionTitle}>TECHNICAL STACK</div>
            {profileData.skills
  ?.filter((group) =>
    ["frontend", "backend", "fullstack"].includes(
      group.heading?.toLowerCase()
    )
  )
  .map((group, i) => (
    <div className="skill-section" key={i}>
      <div className={styles.subTitleBlue}>{group.heading}</div>
      <p className={styles.subList}>
        {group.items && group.items.join(", ")}
      </p>
    </div>
  ))}

           

        
          </div>

          {/* PROJECTS */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>PROJECTS & PORTFOLIO</div>

            {(proj.length ? proj : [1, 2]).slice(0, 2).map((p, i) => (
              <div key={i} className={styles.projectEntry}>
                <div className={styles.projectTitle}>
                <div key={i} className={styles.achItem}>• {p}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENTS */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>KEY ACHIEVEMENTS</div>
            {langs.length>0? 
            (ach.map((a, i) => (
              <div key={i} className={styles.achItem}>• {a}</div>
            ))):<p>N/A</p>
           }
          </div>

          {/* LANGUAGES */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>LANGUAGES</div>
            {langs.length>0? 
            ( langs.map((l, i) => (
              <div key={i} className={styles.langItem}>{l}</div>
            ))):<p>N/A</p>
           }
          </div>
        </div>
      </div>
      </div>

      <button onClick={handlePDF} className={styles.downloadBtn}>
        Download Template 4 PDF
      </button>
    </div>
  );
};

export default TemplateFour;


