import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from "./ResumeForm.module.css";
import { useNavigate, useParams } from "react-router-dom";

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
  };
  const navigate  = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [profileData, setProfileData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  let studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    const fetchProfile = async () => {
      const userid = JSON.parse(localStorage.getItem("StudId"));
      const headers = {
        authorization: `${userid} ${atob(JSON.parse(localStorage.getItem("StudLog")))}`,
      };

      try {
        const res =   await axios.get(`/StudentProfile/viewProfile/${studId}`)
        const result = res.data.result;
        console.log("result",result)
        setProfileData([result]);

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
        }));
      } catch (err) {
        alert("Something went wrong while fetching profile");
      }
    };

    fetchProfile();
  }, [studId]);

  useEffect(() => {
    console.log("profile", profileData)
  }, [profileData])

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

  const buttonStyle = {
    marginTop: '5px',
    padding: '8px 14px',
    backgroundColor: 'rgb(40, 4, 99)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  // const handleChange = (field, value) => setFormData({ ...formData, [field]: value });
  const handleChange = (field, value) => {
    let charLimit = null;
  
    if (field === "profileSummary") charLimit = 200;   
    if (field === "address") charLimit = 200;      
    if (field === "name") charLimit = 50;    
    if (field === "email") charLimit = 200;
  
    if (charLimit && value.length > charLimit) {
      return; 
    }
  
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    const {name,email,totalExperience,profileSummary, address, experiences, certifications, skills, languages } = formData;

    if (
      !profileSummary.trim() ||
      !address.trim() ||
      !name.trim() ||
      !email.trim() ||
      !totalExperience.trim() ||
      experiences.length === 0 ||
      certifications.length === 0 ||
      skills.length === 0 ||
      languages.length === 0
    ) {
      setSuccessMessage("Please make sure to fill in all the required details: Name, Email, Experience, Summary, Address, Certifications, Skills, and Languages");
      return;
    }
    
    const Experiance=totalExperience;
    await axios.put(`/StudentProfile/updatProfile/${studId}`, {
    name, email,Experiance,  profileSummary, address, experiences, certifications, skills, languages
    }, { headers })
      .then((res) => {
        let result = (res.data)
        if (result === "success") {
          setSuccessMessage(
            <span
              style={{
                color: "green",
                fontWeight: "400",   // normal weight for body
                fontStyle: "normal",
                // fontFamily: "Arial, Helvetica, sans-serif"
              }}
            >
              <span style={{ fontWeight: "800" }}>
                Complete Your Resume for a Stronger First Impression
              </span>
              <br />
              Your current resume is missing key details that recruiters look for. Add more
              information—like your skills, experience, and education—to make your resume
              stand out and increase your chances of landing interviews.
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

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
      const displayValue =
        place.name && place.name !== place.formatted_address
          ? `${place.name}, ${place.formatted_address}`
          : place.formatted_address;
          handleChange('address', place.formatted_address)
    }
  });

  venueInputRef.current.autocomplete = autocomplete;
  clearInterval(interval); // stop checking once loaded
}
}, 300); // check every 300ms

return () => clearInterval(interval);
}, []);


  return (
    <div className={styles.container}>
    {/* Left Section */}
    <button
  className={styles.tvbackbtn}
  onClick={() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }}
>
  <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
</button>
    <div style={containerStyle}>
      <div style={{display:"flex",justifyContent:"center"}}>
            <div><h1>Resume Builder Form</h1></div>
      </div>
       {successMessage!=""?
        <p>
          {successMessage==="Success!Resume Form successfully submitted"?
            <p style={{color:"green"}}>{successMessage}</p>:
            <p style={{color:"red"}}>{successMessage}</p>
          }
        </p>
         :""
       }
      <input style={inputStyle} disabled placeholder="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
      <textarea style={inputStyle} placeholder="Profile Summary" value={formData.profileSummary} onChange={(e) => handleChange('profileSummary', e.target.value)} />
      {/* <input style={inputStyle} placeholder="Full Address" value={formData.address} 
      onChange={(e) => handleChange('address', e.target.value)} /> */}
      <input
                                            type="text"
                                            ref={venueInputRef}
                                            value={formData.address} 
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            style={inputStyle}
                                            // style={{ width: "200px", zIndex:"99"}}
                                            placeholder="Search Address"
                                          />
      <input style={inputStyle} disabled placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
      <input style={inputStyle} disabled placeholder="Total Experience" value={formData.totalExperience} onChange={(e) => handleChange('totalExperience', e.target.value)} />
      <input style={inputStyle} disabled placeholder="Qualification" value={formData.qualification} onChange={(e) => handleChange('totalExperience', e.target.value)} />
      <input style={inputStyle} disabled placeholder="College" value={formData.college} onChange={(e) => handleChange('totalExperience', e.target.value)} />

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
          <div style={{display:"flex",gap:"4px"}}>
          <button style={buttonStyle} type="button" onClick={() => addRoleDescription(i)}>Add Description</button>
          <button style={buttonStyle} type="button" onClick={() => removeExperience(i)}>Remove Experience</button>
          </div>
        </div>
      ))}
      <button style={buttonStyle} type="button" onClick={addExperience}>Add Experience</button>

      {/* CERTIFICATIONS */}
      <h2>Certifications</h2>
      {formData.certifications.map((cert, i) => (
        <div key={i}>
          <input style={inputStyle} placeholder={`Certification ${i + 1}`} value={cert} onChange={(e) => handleCertificationChange(i, e.target.value)} />
          <button style={buttonStyle} type="button" onClick={() => removeCertification(i)}>Remove Certification</button>
        </div>
      ))}
      <button style={buttonStyle} type="button" onClick={addCertification}>Add Certification</button>

      {/* SKILLS */}
      <h2>Core Technical Skills</h2>
      {formData.skills.map((skill, i) => (
        <div key={i} style={sectionStyle}>
          <input style={inputStyle} placeholder="Heading" value={skill.heading} onChange={(e) => handleSkillChange(i, 'heading', e.target.value)} />
          {skill.items.map((item, j) => (
            <div key={j}>
              <input style={inputStyle} placeholder={`Skill ${j + 1}`} value={item} onChange={(e) => handleSkillItemChange(i, j, e.target.value)} />
              <button style={buttonStyle} type="button" onClick={() => removeSkillItem(i, j)}>Remove Skill</button>
            </div>
          ))}
          <div style={{display:"flex",gap:"4px"}}>
          <button style={buttonStyle} type="button" onClick={() => addSkillItem(i)}>Add Skill</button>
          <button style={buttonStyle} type="button" onClick={() => removeSkillSection(i)}>Remove Skill Section</button>
          </div>
        </div>
      ))}
      <button style={buttonStyle} type="button" onClick={addSkillSection}>Add Skill Section</button>

      {/* LANGUAGES */}
      <h2>Languages</h2>
      {formData.languages.map((lang, i) => (
        <div key={i}>
          <input style={inputStyle} placeholder={`Language ${i + 1}`} value={lang} onChange={(e) => handleLanguageChange(i, e.target.value)} />
          <button style={buttonStyle} type="button" onClick={() => removeLanguage(i)}>Remove Language</button>
        </div>
      ))}
      <button style={buttonStyle} type="button" onClick={addLanguage}>Add Language</button>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button style={{ ...buttonStyle, marginTop: '20px',width:'156px' }} type="submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
    </div>
  );
};

export default ResumeForm;


