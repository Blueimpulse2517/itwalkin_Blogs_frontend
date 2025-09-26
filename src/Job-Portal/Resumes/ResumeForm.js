import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from "./ResumeForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import useScreenSize from '../SizeHook';

const ResumeForm = () => {
  const initialState = {
    name: '',
    profileSummary: '',
    address: '',
    email: '',
    qualification: '',
    college: '',
    totalExperience: '',
    experiences: [
      { company: '', role: '', startDate: '', endDate: '', descriptions: [''] },
    ],
    certifications: [''],
    skills: [{ heading: '', items: [''] }],
    languages: [''],
    qualificationDetails: [
      { degree: '', score: '', collegeName: '', stateCode: '', countryCode: '' },
    ],
  };

  const navigate  = useNavigate();
  const screenSize = useScreenSize();
  const [formData, setFormData] = useState(initialState);
  const [profileData, setProfileData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  let studId = JSON.parse(localStorage.getItem("StudId"));
  const [imageConsent, setImageConsent] = useState(null); // null initially

  const handleConscentChange = (value) => {
    setImageConsent(value);
  };


  useEffect(() => {
    const fetchProfile = async () => {
      const userid = JSON.parse(localStorage.getItem("StudId"));
      const headers = {
        authorization: `${userid} ${atob(JSON.parse(localStorage.getItem("StudLog")))}`,
      };

      try {
        const res =   await axios.get(`/StudentProfile/viewProfile/${studId}`)
        const result = res.data.result;
        setProfileData([result]);
        console.log("pd",result)
        setImageConsent(result.imageConsent)  
        setFormData(prev => ({
          ...prev,
          name: result.name || "",
          email: result.email || "",
          profileSummary: result.profileSummary || "",
          totalExperience: result.Experiance || "",
          address: result.address || "",
          qualification:result.Qualification||"",
          college:result.college||"",
          experiences: result.experiences?.length
            ? result.experiences.map(exp => ({
              company: exp.company || "",
              role: exp.role || "",
              startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
              endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
              descriptions: exp.descriptions?.length ? exp.descriptions : [""],
            }))
            : [{ company: "", role: "", startDate: "", endDate: "", descriptions: [""] }],
          certifications: result.certifications?.length ? result.certifications : [""],
          skills: result.skills?.length
            ? result.skills.map(skill => ({
              heading: skill.heading || "",
              items: skill.items?.length ? skill.items : [""],
            }))
            : [{ heading: "", items: [""] }],
          languages: result.languages?.length ? result.languages : [""],
          qualificationDetails: result.qualificationDetails?.length
            ? result.qualificationDetails.map(q => ({
              degree: q.degree || "",
              score: q.score || "",
              collegeName: q.collegeName || "",
              stateCode: q.stateCode || "",
              countryCode: q.countryCode || "",
            }))
            : [{ degree: "", score: "", collegeName: "", stateCode: "", countryCode: "" }],
        }));
      } catch (err) {
        alert("Something went wrong while fetching profile");
      }
    };

    fetchProfile();
  }, [studId]);

  useEffect(()=>{
console.log(imageConsent)
  },[imageConsent])

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const sectionStyle = {
    background: '#f8f8f8',
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '5px',
  };

  const inputStyle = {
    display: 'block',
    width: '98%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  };
  const inputStyles = {
    display: 'block',
    width: '88%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  };

  const buttonStyle = {
    marginTop: '5px',
    padding: '8px 14px',
    backgroundColor: 'rgb(40, 4, 99)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  const buttonStyles = {
    marginTop: '0px',
    padding: '8px 14px',
    backgroundColor: 'rgb(40, 4, 99)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  // ---------- BASIC INPUT CHANGE ----------
  const handleChange = (field, value) => {
    let charLimit = null;
    if (field === "profileSummary") charLimit = 200;   
    if (field === "address") charLimit = 200;      
    if (field === "name") charLimit = 50;    
    if (field === "email") charLimit = 200;
    if (charLimit && value.length > charLimit) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- QUALIFICATION ----------
  const handleQualificationChange = (index, key, value) => {
    const updated = [...formData.qualificationDetails];
    updated[index][key] = value;
    setFormData({ ...formData, qualificationDetails: updated });
  };

  const addQualificationRow = () => {
    if (formData.qualificationDetails.length >= 5) return;
    setFormData({
      ...formData,
      qualificationDetails: [
        ...formData.qualificationDetails,
        { degree: '', score: '', collegeName: '', stateCode: '', countryCode: '' },
      ],
    });
  };

  const removeQualificationRow = (index) => {
    const updated = [...formData.qualificationDetails];
    updated.splice(index, 1);
    if (updated.length === 0) {
      updated.push({ degree: '', score: '', collegeName: '', stateCode: '', countryCode: '' });
    }
    setFormData({ ...formData, qualificationDetails: updated });
  };

  // ---------- EXPERIENCE ----------
  const handleExperienceChange = (index, key, value) => {
    const updated = [...formData.experiences];
    updated[index][key] = value;
    setFormData({ ...formData, experiences: updated });
  };

  const handleRoleDescriptionChange = (expIndex, descIndex, value) => {
    const updated = [...formData.experiences];
    updated[expIndex].descriptions[descIndex] = value;
    setFormData({ ...formData, experiences: updated });
  };

  const addRoleDescription = (expIndex) => {
    const updated = [...formData.experiences];
    updated[expIndex].descriptions.push('');
    setFormData({ ...formData, experiences: updated });
  };

  const removeRoleDescription = (expIndex, descIndex) => {
    const updated = [...formData.experiences];
    updated[expIndex].descriptions.splice(descIndex, 1);
    if (updated[expIndex].descriptions.length === 0) updated[expIndex].descriptions = [''];
    setFormData({ ...formData, experiences: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, {
        company: '', role: '', startDate: '', endDate: '', descriptions: ['']
      }],
    });
  };

  const removeExperience = (index) => {
    const updated = [...formData.experiences];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push({ company: '', role: '', startDate: '', endDate: '', descriptions: [''] });
    setFormData({ ...formData, experiences: updated });
  };

  // ---------- CERTIFICATIONS ----------
  const handleCertificationChange = (index, value) => {
    const updated = [...formData.certifications];
    updated[index] = value;
    setFormData({ ...formData, certifications: updated });
  };

  const addCertification = () => {
    setFormData({ ...formData, certifications: [...formData.certifications, ''] });
  };

  const removeCertification = (index) => {
    const updated = [...formData.certifications];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push('');
    setFormData({ ...formData, certifications: updated });
  };

  // ---------- SKILLS ----------
  const handleSkillChange = (index, key, value) => {
    const updated = [...formData.skills];
    updated[index][key] = value;
    setFormData({ ...formData, skills: updated });
  };

  const handleSkillItemChange = (sectionIndex, itemIndex, value) => {
    const updated = [...formData.skills];
    updated[sectionIndex].items[itemIndex] = value;
    setFormData({ ...formData, skills: updated });
  };

  const addSkillItem = (index) => {
    const updated = [...formData.skills];
    updated[index].items.push('');
    setFormData({ ...formData, skills: updated });
  };

  const removeSkillItem = (sectionIndex, itemIndex) => {
    const updated = [...formData.skills];
    updated[sectionIndex].items.splice(itemIndex, 1);
    if (updated[sectionIndex].items.length === 0) updated[sectionIndex].items.push('');
    setFormData({ ...formData, skills: updated });
  };

  const addSkillSection = () => {
    setFormData({ ...formData, skills: [...formData.skills, { heading: '', items: [''] }] });
  };

  const removeSkillSection = (index) => {
    const updated = [...formData.skills];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push({ heading: '', items: [''] });
    setFormData({ ...formData, skills: updated });
  };

  // ---------- LANGUAGES ----------
  const handleLanguageChange = (index, value) => {
    const updated = [...formData.languages];
    updated[index] = value;
    setFormData({ ...formData, languages: updated });
  };

  const addLanguage = () => {
    setFormData({ ...formData, languages: [...formData.languages, ''] });
  };

  const removeLanguage = (index) => {
    const updated = [...formData.languages];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push('');
    setFormData({ ...formData, languages: updated });
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    let userid = JSON.parse(localStorage.getItem("StudId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

    const {name,email,totalExperience,profileSummary, address, experiences, certifications, skills, languages, qualificationDetails } = formData;

    if (
      !profileSummary.trim() ||
      !address.trim() ||
      !name.trim() ||
      !email.trim() ||
      !totalExperience.trim() ||
      experiences.length === 0 ||
      certifications.length === 0 ||
      skills.length === 0 ||
      languages.length === 0 ||
      qualificationDetails.length === 0
    ) {
      setSuccessMessage("Please make sure to fill in all required details");
      return;
    }
    // console.log("hshs",imageConsent)
    const Experiance=totalExperience;
    await axios.put(`/StudentProfile/updatProfile/${studId}`, {
      name, email,Experiance, profileSummary, address, experiences, certifications, skills, languages, qualificationDetails,imageConsent
    }, { headers })
      .then((res) => {
        let result = (res.data)
        if (result === "success") {
          setSuccessMessage(
            <span style={{ color: "green" }}>
              <span style={{ fontWeight: "800" }}>
                Complete your resume for a stronger first impression
              </span>
              <br />
              Your current resume is missing key details. Add more
              information to make your resume stand out.
            </span>
          );
        }
        else if (result === "field are missing") {
          setSuccessMessage("Alert!... all fields must be filled")
        }
        else {
          setSuccessMessage("something went wrong, Could not save your Jobs post")
        }
      }).catch((err) => {
        alert("server issue occured", err)
      })
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const venueInputRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        venueInputRef.current &&
        !venueInputRef.current.autocomplete
      ) {
        const autocomplete = new window.google.maps.places.Autocomplete(venueInputRef.current, {
          fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            handleChange('address', place.formatted_address)
          }
        });

        venueInputRef.current.autocomplete = autocomplete;
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={styles.tvbackbtn}
        onClick={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate("/");
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
      </button>

      <div style={containerStyle}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <div><h1>Resume Builder Form</h1></div>
        </div>

        {successMessage && <p>{successMessage}</p>}

        <input style={inputStyle} disabled placeholder="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
        <textarea style={inputStyle} placeholder="Profile Summary" value={formData.profileSummary} onChange={(e) => handleChange('profileSummary', e.target.value)} />
        <input type="text" ref={venueInputRef} value={formData.address} onChange={(e) => handleChange('address', e.target.value)} style={inputStyle} placeholder="Current Address" />
        <input style={inputStyle} disabled placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
        <input style={inputStyle} disabled placeholder="Total Experience" value={formData.totalExperience} onChange={(e) => handleChange('totalExperience', e.target.value)} />
        <input style={inputStyle} disabled placeholder="Qualification" value={formData.qualification} />
        <input style={inputStyle} disabled placeholder="College" value={formData.college} />

        {/* QUALIFICATION DETAILS */}
        {screenSize.width > 850 ?
        <>
        <h2>Qualification</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" , marginLeft:"2%"}}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Degree/Masters/School</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>% or CGPA</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>College Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>State Code</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Country Code</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.qualificationDetails.map((q, i) => (
              <tr key={i}>
                <td><input style={inputStyles} placeholder="Degree" value={q.degree} onChange={(e) => handleQualificationChange(i, "degree", e.target.value)} /></td>
                <td><input style={inputStyles} placeholder="% or CGPA" value={q.score} onChange={(e) => handleQualificationChange(i, "score", e.target.value)} /></td>
                <td><input maxLength={20} style={inputStyles} placeholder="College Name" value={q.collegeName} onChange={(e) => handleQualificationChange(i, "collegeName", e.target.value)} /></td>
                <td><input style={inputStyles} placeholder="State Code" value={q.stateCode} onChange={(e) => handleQualificationChange(i, "stateCode", e.target.value)} /></td>
                <td><input style={inputStyles} placeholder="Country Code" value={q.countryCode} onChange={(e) => handleQualificationChange(i, "countryCode", e.target.value)} /></td>
                <td>
                  <button style={buttonStyles} type="button" onClick={() => removeQualificationRow(i)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={buttonStyle} type="button" onClick={addQualificationRow}>Add Row</button>
       </>:
       <>
       {/* QUALIFICATION DETAILS */}
<h2>Qualification</h2>
{formData.qualificationDetails.map((q, i) => (
  <div key={i} style={{ ...sectionStyle, display: "flex", flexWrap: "wrap", gap: "10px" }}>
    <input
      style={{ ...inputStyle, flex: "1 1 180px" }}
      placeholder="Degree/Masters/School"
      value={q.degree}
      onChange={(e) => handleQualificationChange(i, "degree", e.target.value)}
    />
    <input
      style={{ ...inputStyle, flex: "1 1 120px" }}
      placeholder="% or CGPA"
      value={q.score}
      onChange={(e) => handleQualificationChange(i, "score", e.target.value)}
    />
    <input
      style={{ ...inputStyle, flex: "1 1 200px" }}
      placeholder="College Name"
      maxLength={20}
      value={q.collegeName}
      onChange={(e) => handleQualificationChange(i, "collegeName", e.target.value)}
    />
    <input
      style={{ ...inputStyle, flex: "1 1 120px" }}
      placeholder="State Code"
      value={q.stateCode}
      onChange={(e) => handleQualificationChange(i, "stateCode", e.target.value)}
    />
    <input
      style={{ ...inputStyle, flex: "1 1 120px" }}
      placeholder="Country Code"
      value={q.countryCode}
      onChange={(e) => handleQualificationChange(i, "countryCode", e.target.value)}
    />
    <button style={buttonStyle} type="button" onClick={() => removeQualificationRow(i)}>Remove</button>
  </div>
))}
<button style={buttonStyle} type="button" onClick={addQualificationRow}>Add Row</button>

       </>
       
      }
        {/* EXPERIENCES */}
        <h2>Experience</h2>
        {formData.experiences.map((exp, i) => (
          <div key={i} style={sectionStyle}>
            <input style={inputStyle} placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(i, 'company', e.target.value)} />
            <input style={inputStyle} placeholder="Role" value={exp.role} onChange={(e) => handleExperienceChange(i, 'role', e.target.value)} />
            <div style={{ display: "flex", gap: '10px' }}>
              <input style={{ ...inputStyle, width: '50%' }} type="date" value={exp.startDate} onChange={(e) => handleExperienceChange(i, 'startDate', e.target.value)} />
              <input style={{ ...inputStyle, width: '50%' }} type="date" value={exp.endDate} onChange={(e) => handleExperienceChange(i, 'endDate', e.target.value)} />
            </div>
            {exp.descriptions.map((desc, j) => (
              <div key={j}>
                <textarea style={inputStyle} placeholder={`Role Description ${j + 1}`} value={desc} onChange={(e) => handleRoleDescriptionChange(i, j, e.target.value)} />
                <button style={buttonStyle} type="button" onClick={() => removeRoleDescription(i, j)}>Remove Description</button>
              </div>
            ))}
            <button style={buttonStyle} type="button" onClick={() => addRoleDescription(i)}>Add Description</button>
            <button style={{ ...buttonStyle, marginLeft: "2px" }} type="button" onClick={() => removeExperience(i)}>Remove Experience</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addExperience}>Add Experience</button>

        {/* CERTIFICATIONS */}
        <h2>Certifications</h2>
        {formData.certifications.map((cert, i) => (
          <div key={i}>
            <input style={inputStyle} placeholder="Certification" value={cert} onChange={(e) => handleCertificationChange(i, e.target.value)} />
            <button style={buttonStyle} type="button" onClick={() => removeCertification(i)}>Remove</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addCertification}>Add Certification</button>

        {/* SKILLS */}
        <h2>Skills</h2>
        {formData.skills.map((skill, i) => (
          <div key={i} style={sectionStyle}>
            <input style={inputStyle} placeholder="Skill Heading" value={skill.heading} onChange={(e) => handleSkillChange(i, 'heading', e.target.value)} />
            {skill.items.map((item, j) => (
              <div key={j}>
                <input style={inputStyle} placeholder={`Skill ${j + 1}`} value={item} onChange={(e) => handleSkillItemChange(i, j, e.target.value)} />
                <button style={buttonStyle} type="button" onClick={() => removeSkillItem(i, j)}>Remove Item</button>
              </div>
            ))}
            <button style={buttonStyle} type="button" onClick={() => addSkillItem(i)}>Add Item</button>
            <button style={{ ...buttonStyle, marginLeft: "2px" }} type="button" onClick={() => removeSkillSection(i)}>Remove Section</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addSkillSection}>Add Skill Section</button>

        {/* LANGUAGES */}
        <h2>Languages</h2>
        {formData.languages.map((lang, i) => (
          <div key={i}>
            <input style={inputStyle} placeholder="Language" value={lang} onChange={(e) => handleLanguageChange(i, e.target.value)} />
            <button style={buttonStyle} type="button" onClick={() => removeLanguage(i)}>Remove</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addLanguage}>Add Language</button>
        <div style={{ padding: "10px", fontFamily: "Arial" }}>
      <p style={{ fontWeight: "bold" }}>
        Would you like to include a photo from Google in your resume?
      </p>

      <label style={{ display: "block", margin: "5px 0" }}>
        <input
          type="radio"
          name="imageConsent"
          value="true"
          checked={imageConsent === true}
          onChange={() => handleConscentChange(true)}
        />{" "}
        Yes, I give my consent
      </label>

      <label style={{ display: "block", margin: "5px 0" }}>
        <input
          type="radio"
          name="imageConsent"
          value="false"
          checked={imageConsent === false}
          onChange={() => handleConscentChange(false)}
        />{" "}
        No, I do not wish
      </label>

      </div>
        <button style={{ ...buttonStyle, display: 'block', marginTop: '20px' }} onClick={handleSubmit}>Save Resume</button>
      </div>
    </div>
  );
};

export default ResumeForm;
