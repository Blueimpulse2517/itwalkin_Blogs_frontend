import React, { useEffect, useState } from "react";
import styles from "./TemplateThree.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateThree = () => {
  const [profileData, setProfileData] = useState(null);
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`);
        setProfileData(res.data.result);

        if (res.data.result?.Gpicture) {
          const base64 = await toDataURL(res.data.result.Gpicture);
          localStorage.setItem("profileImageBase64", base64);
        }
      } catch {
        alert("Something went wrong while fetching profile");
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
    const resumeElement = document.getElementById("template-three");
    const oldClass = resumeElement.className;

    const viewportMeta = document.querySelector('meta[name=viewport]');
    const oldViewport = viewportMeta ? viewportMeta.content : null;
    if (viewportMeta)
      viewportMeta.content =
        "width=device-width, initial-scale=1, maximum-scale=1";

    resumeElement.className = oldClass + " " + styles.forceA4;
    setTimeout(() => {
      generatePDF("template-three", `${profileData.name}_resume.pdf`);
      resumeElement.className = oldClass;

      if (viewportMeta && oldViewport) viewportMeta.content = oldViewport;
    }, 300);
  };

  return (
    <div className={styles.resumeContainer}>
      <div id="template-three" className={styles.templateThree}>
        {/* LEFT BLUE SECTION */}
        <div className={styles.leftSection}>
          <div className={styles.photoContainer}>
            {profileData?.imageConsent && profileData?.Gpicture ? (
              <img src={profileData?.Gpicture} alt="Candidate" className={styles.photo} />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>

          <h2 className={styles.name}>{profileData?.name || "Loading..."}</h2>

          <div className={styles.contactSection}>
            <p><span className={styles.squareSmall1}></span>{profileData?.email || "No Email"}</p>
            <p><span className={styles.squareSmall1}></span>{profileData?.phoneNumber || "No Phone"}</p>
            <p><span className={styles.squareSmall1}></span>{profileData?.address || "No Address"}</p>
          </div>

          {/* LEFT SECTION HEADINGS WITH FULL UNDERLINE */}
          <div className={styles.section}>
            <div className={styles.leftHeadingFull}>
              <span className={styles.square}></span>
              <h3>SKILLS</h3>
            </div>
            {profileData?.skills?.length > 0 ? (
              <ul>
                {profileData?.skills?.map((group, i) =>
                  group.items?.map((item, j) => (
                    <li key={`${i}-${j}`}>
                      <span className={styles.squareSmall}></span>
                      {item}
                    </li>
                  ))
                )}
              </ul>
            ) : <p>No skills added</p>}
          </div>

          <div className={styles.section}>
            <div className={styles.leftHeadingFull}>
              <span className={styles.square}></span>
              <h3>PERSONAL DETAILS</h3>
            </div>
            <p>
  <span className={styles.squareSmall}></span>
  Date of Birth:{" "}
  {profileData?.personalDetails[0]?.dob
    ? new Date(profileData.personalDetails[0].dob).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A"}
</p>

            <p><span className={styles.squareSmall}></span>Gender: {profileData?.personalDetails[0]?.gender || "N/A"}</p>
            <p><span className={styles.squareSmall}></span>Marital Status: {profileData?.personalDetails[0]?.maritalStatus || "N/A"}</p>
            {/* <p><span className={styles.squareSmall}></span>Religion: {profileData?.religion || "N/A"}</p> */}
          </div>

          <div className={styles.section}>
            <div className={styles.leftHeadingFull}>
              <span className={styles.square}></span>
              <h3>INTERESTS</h3>
            </div>
            {profileData?.interests?.length > 0 ? (
              <ul>
                {profileData?.interests?.map((int, i) => (
                  <li key={i}><span className={styles.squareSmall}></span>{int}</li>
                ))}
              </ul>
            ) : <p>No interests added</p>}
          </div>

          <div className={styles.section}>
            <div className={styles.leftHeadingFull}>
              <span className={styles.square}></span>
              <h3>LANGUAGES</h3>
            </div>
            {profileData?.languages?.length > 0 ? (
              <ul>
                {profileData?.languages?.map((lang, i) => (
                  <li key={i}><span className={styles.squareSmall}></span>{lang}</li>
                ))}
              </ul>
            ) : <p>No languages added</p>}
          </div>
        </div>

        {/* RIGHT WHITE SECTION */}
        <div className={styles.rightSection}>
          <div className={styles.section}>
            <div className={styles.rightHeadingShort}>
              <span className={styles.squareBlue}></span>
              <h3>OBJECTIVE</h3>
              <span className={styles.shortLine}></span>
            </div>
            <p>{profileData?.profileSummary || "No objective added"}</p>
          </div>

          <div className={styles.section}>
            <div className={styles.rightHeadingShort}>
              <span className={styles.squareBlue}></span>
              <h3>EDUCATION</h3>
              <span className={styles.shortLine}></span>
            </div>
            {profileData?.qualificationDetails?.length > 0 ? (
              <ul>
                {profileData?.qualificationDetails?.map((edu, i) => (
                  <li key={i}>
                    <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
                    <div><strong>{edu?.degree}</strong> </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                       <div>{edu?.collegeName} </div> 
                       <div>{edu?.score || "N/A"}</div>
                    </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No education details added</p>}
          </div>

          <div className={styles.section}>
            <div className={styles.rightHeadingShort}>
              <span className={styles.squareBlue}></span>
              <h3>EXPERIENCE</h3>
              <span className={styles.shortLine}></span>
            </div>
            {profileData?.experiences?.length > 0 ? (
              <ul>
                {profileData?.experiences?.map((exp, i) => (
                  <li key={i}>
                    <strong>{exp?.role}</strong> — {exp?.company} 
                    ({new Date(exp?.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })} - {exp?.endDate?
                (new Date(exp?.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }))
              :  "Present"})
                  </li>
                ))}
              </ul>
            ) : <p>No experience added</p>}
          </div>

          <div className={styles.section}>
            <div className={styles.rightHeadingShort}>
              <span className={styles.squareBlue}></span>
              <h3>PROJECTS</h3>
              <span className={styles.shortLine}></span>
            </div>
            {profileData?.projects?.length > 0 ? (
              <ul>
                {profileData?.projects?.map((proj, i) => <li key={i}>{proj}</li>)}
              </ul>
            ) : <p>No projects added</p>}
          </div>

          <div className={styles.section}>
            <div className={styles.rightHeadingShort}>
              <span className={styles.squareBlue}></span>
              <h3>ACHIEVEMENTS & AWARDS</h3>
              <span className={styles.shortLine}></span>
            </div>
            {profileData?.achievements?.length > 0 ? (
              <ul>
                {profileData?.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
              </ul>
            ) : <p>No achievements added</p>}
          </div>
        </div>
      </div>

      <div className={styles.downloadContainer}>
        <button onClick={handleDownloadPDF} className={styles.downloadButton}>
          Download Template 3 PDF
        </button>
      </div>
    </div>
  );
};

export default TemplateThree;
