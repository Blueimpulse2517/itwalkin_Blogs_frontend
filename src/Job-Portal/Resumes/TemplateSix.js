import React, { useEffect, useState } from "react";
import styles from "./TemplateSix.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateSix = () => {
  const [profileData, setProfileData] = useState(null);
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`);
        setProfileData(res.data.result);
      } catch {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [studId]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("template-six");
    element.classList.add(styles.forceA4);

    setTimeout(() => {
      generatePDF("template-six", `${profileData?.name}_resume.pdf`);
      element.classList.remove(styles.forceA4);
    }, 300);
  };

  if (!profileData) return null;

  return (
    <div className={styles.wrapper}>
      <div id="template-six" className={styles.resume}>
        {/* HEADER */}
        <h1 className={styles.title}>RESUME</h1>

        <div className={styles.header}>
          <div>
            <strong>{profileData.name}</strong>
            <p>{profileData.address}</p>
          </div>

          <div className={styles.headerRight}>
            <p><strong>E-mail:</strong> {profileData.email}</p>
            <p><strong>Contact No:</strong> {profileData.phoneNumber}</p>
          </div>
        </div>

        {/* OBJECTIVE */}
        <Section title="Objective">
          <p>{profileData.objective?profileData.objective:"I wan to excel in the field with hard work, perseverance and dedication."}</p>
        </Section>

        {/* EDUCATION */}
        <Section title="Educational Qualifications">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course</th>
                <th>University / Board</th>
                <th>Passing Year</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {profileData.qualificationDetails?.map((q, i) => (
                <tr key={i}>
                  <td>{q.degree}</td>
                  <td>{q.collegeName}</td>
                  <td>{q.yop || "-"}</td>
                  <td>{q.score || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* TECHNICAL SKILLS */}
        <Section title="Technical Skills">
  {["Computer", "Typing"].map((heading) => {
    const group = profileData.skills?.find(
      (g) => g.heading === heading
    );

    return group && group.items?.length > 0 ? (
      <p key={heading}>
        <strong>{heading}:</strong> {group.items.join(", ")}
      </p>
    ) : null;
  })}
</Section>


        {/* HOBBIES */}
        <Section title="Hobbies">
          <ul>
            {profileData.interests?.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Section>

        {/* EXPERIENCE */}
        <Section title="Experience">
          <ul>
            {profileData.experiences?.map((e, i) => (
              <li key={i}>
                {e.company} – {e.role}
              </li>
            ))}
          </ul>
        </Section>

        {/* PERSONAL DETAILS */}
        <Section title="Personal Details">
          <div className={styles.personalGrid}>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Father Name:</strong> {profileData.personalDetails?.[0]?.fatherName || "N/A"}</p>
            <p><strong>Mother Name:</strong> {profileData.personalDetails?.[0]?.motherName || "N/A"}</p>
            <p><strong>Date of Birth:</strong> {profileData?.personalDetails[0]?.dob
    ? new Date(profileData.personalDetails[0].dob).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short", 
        year: "numeric",
      })
    : "N/A"}</p>
            <p><strong>Gender:</strong> {profileData.personalDetails?.[0]?.gender || "N/A"}</p>
            <p><strong>Nationality:</strong> {profileData.personalDetails?.[0]?.Nationality || "N/A"}</p>
            <p><strong>Languages Known:</strong> {profileData.languages?.join(", ")}</p>
          </div>
        </Section>

        {/* DECLARATION */}
        <Section title="Declaration">
          <p>
            I hereby affirm that all the above information in this document is
            true to the best of my knowledge.
          </p>
          <p className={styles.thankYou}>Thank You.</p>
          <p><strong>Place:</strong> {profileData.address}</p>
          <p><strong>Date:</strong> __________</p>
        </Section>
      </div>

      <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
        Download Template 6 PDF
      </button>
    </div>
  );
};

const Section = ({ title, children }) => (
  <>
    <div className={styles.sectionTitle}>{title}</div>
    <div className={styles.sectionContent}>{children}</div>
  </>
);

export default TemplateSix;


