import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from "./ResumeForm.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useScreenSize from '../SizeHook';
import { SKILL_LIBRARY } from "./SkillLibrary";

const ResumeForm = () => {

  const initialState = {
    name: '',
    profileSummary: '',
    address: '',
    email: '',
    linkedin:'',
    qualification: '',
    college: '',
    totalExperience: '',
    experiences: [
      { company: '', role: '', startDate: '', endDate: '', descriptions: [''] },
    ],
    certifications: [''],
    skills: [{ heading: '', items: [] }],
    // skills: [{ heading: '', items: [''] }],
    languages: [''],
    qualificationDetails: [
      { degree: '', score: '', collegeName: '', stateCode: '', countryCode: '' },
    ],
    personalDetails: [{
      gender: "",
      maritalStatus: "",
      dob: "",
      fatherName: "",
    motherName: "",
    nationality: ""  
    }],
    achievements: [""],
    interests: [""],
    projects:[""],
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: [
        {
          ...prev.personalDetails[0], // spread the first object
          [name]: value,              // update the field
        },
      ],
    }));
  };
  

  // Dynamic List Handlers
  const handleDynamicChange = (index, type, value) => {
    const updated = [...formData[type]];
    updated[index] = value;

    setFormData({ ...formData, [type]: updated });
  };

  const addField = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ""],
    });
  };

  const removeField = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type]: updated,
    });
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
      items: skill.items?.length ? skill.items : [],
    }))
  : [{ heading: "", items: [] }],

          languages: result.languages?.length ? result.languages : [""],
          personalDetails:[{
            gender: result.personalDetails[0]?.gender || "",
            maritalStatus: result.personalDetails[0]?.maritalStatus || "",
            dob: result.personalDetails[0]?.dob
              ? new Date(result.personalDetails[0].dob).toISOString().split("T")[0]
              : "",
          }],
          achievements:
            result.achievements?.length > 0 ? result.achievements : [""],
          interests:
            result.interests?.length > 0 ? result.interests : [""],
          projects:
            result.projects?.length > 0 ? result.projects : [""],
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
console.log(imageConsent, formData)
  },[imageConsent])

  const [skillSearch, setSkillSearch] = useState("");
const [activeSkillIndex, setActiveSkillIndex] = useState(null);
const skillBoxRef = useRef([]);

const selectSkillHeading = (index, heading) => {
  const updated = [...formData.skills];
  updated[index].heading = heading;
  updated[index].items = []; // reset skills when heading changes
  setFormData({ ...formData, skills: updated });
  setSkillSearch("");
};

const addSkillChip = (sectionIndex, skill) => {
  const updated = [...formData.skills];
  if (!updated[sectionIndex].items.includes(skill)) {
    updated[sectionIndex].items.push(skill);
  }
  setFormData({ ...formData, skills: updated });
  setSkillSearch("");
};

const removeSkillChip = (sectionIndex, skill) => {
  const updated = [...formData.skills];
  updated[sectionIndex].items = updated[sectionIndex].items.filter(
    (s) => s !== skill
  );
  setFormData({ ...formData, skills: updated });
};

useEffect(() => {
  const handleOutsideClick = (e) => {
    const activeRef = skillBoxRef.current[activeSkillIndex];

    if (activeRef && !activeRef.contains(e.target)) {
      setActiveSkillIndex(null);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
  return () =>
    document.removeEventListener("mousedown", handleOutsideClick);
}, [activeSkillIndex]);

// const[hasValidSkillSections, sethasValidSkillSections]=useState(false)
// useEffect(() => {
//   const isSkills = formData.skills.some(
//     (section) =>
//       section.heading?.trim() !== "" ||
//       section.items.some((item) => item.trim() !== "")
//   );

//   sethasValidSkillSections(isSkills);
// }, [formData.skills]);
let hasValidSkillSections = formData.skills.some
( (section) => section.heading?.trim().length > 0 || 
section.items.some( (item) => typeof item === "string" && item.trim().length > 0 )
)

useEffect(()=>{
  console.log("is skills:",hasValidSkillSections)
  console.log(formData.skills)
},[formData])
 

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
  const [resumeAlert, setresumeAlert]=useState(false)
  const alertRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked outside alert box and it's open
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setresumeAlert(false); // close the alert
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // ---------- BASIC INPUT CHANGE ----------
  const handleChange = (field, value) => {
    let charLimit = null;
    if (field === "profileSummary") charLimit = 400;   
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

  // const removeQualificationRow = (index) => {
  //   const updated = [...formData.qualificationDetails];
  //   updated.splice(index, 1);
  //   if (updated.length === 0) {
  //     updated.push({ degree: '', score: '', collegeName: '', stateCode: '', countryCode: '' });
  //   }
  //   setFormData({ ...formData, qualificationDetails: updated });
  // };

  const removeQualificationRow = (index) => {
    setFormData((prev) => {
      const updated = [...prev.qualificationDetails];
      updated.splice(index, 1);
  
      if (updated.length === 0) {
        updated.push({
          degree: "",
          score: "",
          collegeName: "",
          stateCode: "",
          countryCode: "",
        });
      }
  
      const nextState = {
        ...prev,
        qualificationDetails: updated,
      };
  
      // 🔑 Call API with UPDATED data
      cancelSubmit(nextState);
  
      return nextState;
    });
  };
  

  const cancelSubmit = async (data = formData) => {
    let userid = JSON.parse(localStorage.getItem("StudId"));
    const headers = {
      authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog")))
    };
  
    const {
      name,
      email,
      totalExperience,
      profileSummary,
      address,
      experiences,
      certifications,
      skills,
      languages,
      qualificationDetails,
      personalDetails,
      achievements,
      interests,
      projects
    } = data;
  
    const Experiance = totalExperience;
  
    await axios.put(
      `/StudentProfile/updatProfile/${studId}`,
      {
        name,
        email,
        Experiance,
        profileSummary,
        address,
        experiences,
        certifications,
        skills,
        languages,
        qualificationDetails,
        imageConsent,
        personalDetails,
        achievements,
        interests,
        projects
      },
      { headers }
    );
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

  // const addSkillSection = () => {
  //   setFormData((prev) => {
  //     if (formstate === "nontech") {
  //       const hasComputer = prev.skills.some(s => s.heading === "Computer");
  //       const hasTyping = prev.skills.some(s => s.heading === "Typing");
  
  //       if (!hasComputer) {
  //         return {
  //           ...prev,
  //           skills: [...prev.skills, { heading: "Computer", items: [] }],
  //         };
  //       }
  
  //       if (!hasTyping) {
  //         return {
  //           ...prev,
  //           skills: [...prev.skills, { heading: "Typing", items: [] }],
  //         };
  //       }
  
  //       return prev;
  //     }

  //     return {
  //       ...prev,
  //       skills: [...prev.skills, { heading: "", items: [] }],
  //     };
  //   });
  // };
  
  const addSkillSection = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { heading: "", items: [] }],
    }));
  };
  

  // const removeSkillSection = (index) => {
  //   const updated = [...formData.skills];
  //   updated.splice(index, 1);
  //   if (updated.length === 0) updated.push({ heading: '', items: [''] });
  //   setFormData({ ...formData, skills: updated });
  // };
  const removeSkillSection = (index) => {
    const updated = [...formData.skills];
    updated.splice(index, 1);
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

    const {name,email,totalExperience,profileSummary, address, experiences, certifications, skills, languages, qualificationDetails, personalDetails, achievements, interests, projects } = formData;


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
      // setSuccessMessage(
      //   <span style={{ color: "red" }}>
      //     Your resume is incomplete. Please fill in all required profile details before downloading
      //   </span>
      // );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSuccessMessage("")
      setresumeAlert(true)
     
      return;
    }
    console.log("personal details",personalDetails)
    console.log("ach",achievements)
    console.log("int",interests)
    const Experiance=totalExperience;
    await axios.put(`/StudentProfile/updatProfile/${studId}`, {
      name, email,Experiance, profileSummary, address, experiences, certifications, skills, languages, qualificationDetails,imageConsent,personalDetails, achievements, interests, projects
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

 const goToHelp=()=>{
  //  window.open("#")
 }

 let location = useLocation()
   const { formstate } = location.state || {};
  //  console.log("fd",formstate)
  return (
    <div className={styles.container}>
      <div ref={alertRef} style={{position:"relative"}}>
      {resumeAlert&&
                         <>
                            <div className={styles.popup} > 
        
        Your resume is incomplete. Please fill in all required profile details before downloading
          <div  style={{ marginTop: '15px', display:"flex", justifyContent:"center", gap:"5px" }}>
            <button
              onClick={()=> setresumeAlert(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Ok
            </button>
            <button
              onClick={()=> setresumeAlert(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
                         </>

 }
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
      <button
        className={styles.tvbackbtn}
        onClick={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate("/");
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
      </button>
      <button
        className={styles.tvbackbtn}
        onClick={goToHelp}
        style={{marginRight:"2%"}}
      >
        <div style={{ fontSize: "12px", fontWeight: "800" }}>Help</div>
      </button>
      </div>


      <div style={containerStyle}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <div><h1>Resume Builder Form</h1></div>
        </div>

        {successMessage && <p>{successMessage}</p>}
        <div >
        {/* {console.log("pd",profileData[0]?.Gpicture )} */}
            {profileData? (
              // console.log("pd",profileData[0]?.Gpicture )
                <img
                  src={profileData[0]?.Gpicture}
                  alt="Candidate"
                  style={{ borderRadius: "47%" }}
                />
          ) : (
          <p>Loading...</p>
         )}
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
              
            </div>

        <input style={inputStyle} disabled placeholder="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
        <textarea style={inputStyle} placeholder="Profile Summary" value={formData.profileSummary} onChange={(e) => handleChange('profileSummary', e.target.value)} />
        <input type="text" ref={venueInputRef} value={formData.address} onChange={(e) => handleChange('address', e.target.value)} style={inputStyle} placeholder="Current Address" />
        <input style={inputStyle} disabled placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
        {formstate==="fullstack" &&
        <input style={inputStyle}  placeholder="Linkedin url" value={formData.linkedin?formData.linkedin:""} onChange={(e) => handleChange('linkedin', e.target.value)} />
      }
        <input style={inputStyle} disabled placeholder="Total Experience" value={formData.totalExperience} onChange={(e) => handleChange('totalExperience', e.target.value)} />
        <input style={inputStyle} disabled placeholder="Qualification" value={formData.qualification} />
        <input style={inputStyle} disabled placeholder="College" value={formData.college} />

        {/* QUALIFICATION DETAILS */}
        {screenSize.width > 850 ?
        <>
        <h2>Education</h2>
        <button style={buttonStyle} type="button" onClick={addQualificationRow}>+ Add New Education</button>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" , marginLeft:"0%"}}>
          
          <thead>
            <tr style={{ background: "#eee" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>School/College/University Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Degree</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Field of study (Degree/Masters/School)</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Grade (% or CGPA)</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>year of passing</th>
              {/* <th style={{ border: "1px solid #ccc", padding: "8px" }}>State Code</th> */}
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Location (Country/Region)</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>City</th>
              {/* <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th> */}
            </tr>
          </thead>
          <tbody>
          {formData.qualificationDetails.map((q, i) => (
  <React.Fragment key={i}>
    {/* ROW 1: INPUTS (UNCHANGED INLINE STYLES) */}
    <tr>
      <td>
        <input
          maxLength={20}
          style={inputStyles}
          placeholder="College Name"
          value={q.collegeName}
          onChange={(e) =>
            handleQualificationChange(i, "collegeName", e.target.value)
          }
        />
      </td>

      <td>
        <input
          style={{ ...inputStyles, width: "76%" }}
          placeholder="Degree"
          value={q.degree}
          onChange={(e) =>
            handleQualificationChange(i, "degree", e.target.value)
          }
        />
      </td>

      <td>
        <input
          style={inputStyles}
          placeholder="field"
          value={q.field ? q.field : "N/A"}
        />
      </td>

      <td>
        <input
          style={{ ...inputStyles, width: "76%" }}
          placeholder="% or CGPA"
          value={q.score}
          onChange={(e) =>
            handleQualificationChange(i, "score", e.target.value)
          }
        />
      </td>

      <td>
        <input
          style={{ ...inputStyles, width: "76%" }}
          placeholder="yop"
          value={q.yop ? q.yop : "N/A"}
        />
      </td>

      <td>
        <input
          style={inputStyles}
          placeholder="Country Code"
          value={q.countryCode}
          onChange={(e) =>
            handleQualificationChange(i, "countryCode", e.target.value)
          }
        />
      </td>

      <td>
        <input
          style={{ ...inputStyles, width: "70%" }}
          placeholder="City"
          value={q.city ? q.city : "N/A"}
        />
      </td>
    </tr>

    {/* ROW 2: BUTTONS (RIGHT SIDE, NO STYLE CHANGE) */}
    <tr>
      <td colSpan={7} style={{ textAlign: "right" }}>
        <button
          style={{ ...buttonStyles, marginRight:"2px"}}
          type="button"
          onClick={handleSubmit}
        >
          save
        </button>

        <button
          style={buttonStyles}
          type="button"
          onClick={() => {removeQualificationRow(i)}}
        >
          Cancel
        </button>
      </td>
    </tr>
  </React.Fragment>
))}

          </tbody>
        </table>
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
                <button style={buttonStyle} type="button" onClick={() => removeRoleDescription(i, j)}>Remove Row</button>
              </div>
            ))}
            <button style={buttonStyle} type="button" onClick={() => addRoleDescription(i)}> Add Row</button>
            <button style={{ ...buttonStyle, marginLeft: "2px" }} type="button" onClick={() => removeExperience(i)}>Remove Experience</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addExperience}>Add Experience</button>

        {/* CERTIFICATIONS */}
        <h2>Certifications</h2>
        {formData.certifications.map((cert, i) => (
          <div key={i}>
            <input style={inputStyle} placeholder="Enter Certification" value={cert} onChange={(e) => handleCertificationChange(i, e.target.value)} />
            <button style={buttonStyle} type="button" onClick={() => removeCertification(i)}>Remove</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={addCertification}>Add Certification</button>

        {/* SKILLS */}
        <h2>Skills</h2>
{/* {formData.skills.length===0
?
<button style={buttonStyle} type="button" onClick={addSkillSection}>
  + Add Skill Section
</button>
: */}

<>
  {(formstate === "nontech"
    ? formData.skills
        .map((skill, originalIndex) => ({ skill, originalIndex }))
        .filter(
          ({ skill }) =>
            skill.heading === "Computer" || skill.heading === "Typing" || skill.heading === "" 
        )
    : formData.skills
        .map((skill, originalIndex) => ({ skill, originalIndex }))
        .filter(
          ({ skill }) =>
            skill.heading !== "Computer" && skill.heading !== "Typing"
        )
  ).map(({ skill, originalIndex }) => {
    const isNonTech = formstate === "nontech";

    const suggestions =
      skill.heading &&
      SKILL_LIBRARY[skill.heading] &&
      (
        (isNonTech &&
          (skill.heading === "Computer" ||
           skill.heading === "Typing")) ||
        (!isNonTech &&
          skill.heading !== "Computer" &&
          skill.heading !== "Typing")
      )
        ? SKILL_LIBRARY[skill.heading].filter((s) =>
            s.toLowerCase().includes(skillSearch.toLowerCase())
          )
        : [];

    return (
      <div key={originalIndex} style={sectionStyle}>
        {/* HEADING SELECTOR */}
        <label><b>Skill Category</b></label>
        <select
          style={inputStyle}
          value={skill.heading}
          onChange={(e) =>
            selectSkillHeading(originalIndex, e.target.value)
          }
        >
          <option value="">Select Heading</option>

          {(isNonTech
            ? ["Computer", "Typing"]
            : Object.keys(SKILL_LIBRARY).filter(
                (h) => h !== "Computer" && h !== "Typing"
              )
          ).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* SELECTED SKILL CHIPS */}
        <div style={{ marginBottom: "10px" }}>
          {skill.items.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 10px",
                background: "#e6e6e6",
                borderRadius: "20px",
                marginRight: "6px",
                marginBottom: "6px",
                fontSize: "13px",
              }}
            >
              {item}
              <button
                type="button"
                onClick={() =>
                  removeSkillChip(originalIndex, item)
                }
                style={{
                  marginLeft: "6px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* ADD SKILL INPUT */}
        {skill.heading && (
          <div ref={(el) => (skillBoxRef.current[originalIndex] = el)}>
            <input
              style={inputStyle}
              placeholder="Add skill"
              value={skillSearch}
              onFocus={() => setActiveSkillIndex(originalIndex)}
              onChange={(e) => setSkillSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillSearch.trim()) {
                  addSkillChip(originalIndex, skillSearch.trim());
                  e.preventDefault();
                }
              }}
            />

            {/* DROPDOWN */}
            {activeSkillIndex === originalIndex &&
              suggestions.length > 0 && (
                <div
                  style={{
                    border: "1px solid #ccc",
                    maxHeight: "160px",
                    overflowY: "auto",
                    background: "#fff",
                  }}
                >
                  {suggestions.map((s) => (
                    <div
                      key={s}
                      onClick={() =>
                        addSkillChip(originalIndex, s)
                      }
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        <button
          type="button"
          style={{ ...buttonStyle, marginTop: "10px" }}
          onClick={() => removeSkillSection(originalIndex)}
        >
          Remove Section
        </button>
      </div>
    );
  })}

  {/* ADD SKILL SECTION BUTTON */}
  {(formstate !== "nontech" ||
    !formData.skills.some((s) => s.heading === "Computer") ||
    !formData.skills.some((s) => s.heading === "Typing")) && (
    <button
      type="button"
      style={buttonStyle}
      onClick={addSkillSection}
    >
      + Add Skills
    </button>
  )}
</>

{/* } */}

        {formstate=="freshers" &&
        <>
        <h2>Languages</h2>
        {formData.languages.map((lang, i) => (
          <div key={i}>
            <input style={inputStyle} placeholder="Language" value={lang} onChange={(e) => handleLanguageChange(i, e.target.value)} />
            <button style={buttonStyle} type="button" onClick={() => removeLanguage(i)}>Remove</button>
          </div>
        ))}
        <button style={buttonStyle} type="button" onClick={() => addLanguage()}>Add</button>
        </>
       }
       

        {/* LANGUAGES */}
        {/* 
        <button style={buttonStyle} type="button" onClick={addLanguage}>Add Language</button> */}
        {/* <div style={{ padding: "10px", fontFamily: "Arial" }}>
      <p style={{ fontWeight: "bold" }}>
        Would you like to include a photo from Google in your resume?
      </p> */}

      {/* <label style={{ display: "block", margin: "5px 0" }}>
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

      </div> */}
      {formstate=="freshers" || formstate=="nontech" &&
      <>
       <div>
      {/* PERSONAL DETAILS */}
      <h2>Personal Details</h2>


      {/* Father Name */}
<h3>Father Name:</h3>
<input
  type="text"
  name="fatherName"
  value={formData?.personalDetails[0]?.fatherName}
  placeholder="Enter father name"
  onChange={handlePersonalChange}
  style={inputStyle}
/>

{/* Mother Name */}
<h3>Mother Name:</h3>
<input
  type="text"
  name="motherName"
  value={formData?.personalDetails[0]?.motherName}
  placeholder="Enter mother name"
  onChange={handlePersonalChange}
  style={inputStyle}
/>

{/* Nationality */}
<h3>Nationality:</h3>
<input
  type="text"
  name="nationality"
  value={formData?.personalDetails[0]?.nationality}
  placeholder="Enter nationality"
  onChange={handlePersonalChange}
  style={inputStyle}
/>

      {/* Gender */}
<h3>Gender:</h3>
<div>
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.personalDetails[0]?.gender === "Male"}
            onChange={handlePersonalChange}
          />
          Male
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.personalDetails[0]?.gender === "Female"}
            onChange={handlePersonalChange}
          />
          Female
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="gender"
            value="Other"
            checked={formData.personalDetails[0]?.gender === "Other"}
            onChange={handlePersonalChange}
          />
          Other
        </label>
      </div>
      
      {/* Marital Status */}
      <h3>
        Marital Status:
      </h3>
      <div>
        <label>
          <input
            type="radio"
            name="maritalStatus"
            value="Single"
            checked={formData?.personalDetails[0]?.maritalStatus === "Single"}
            onChange={handlePersonalChange}
          />
          Single
        </label>
        

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="maritalStatus"
            value="Married"
            checked={formData?.personalDetails[0]?.maritalStatus === "Married"}
            onChange={handlePersonalChange}
          />
          Married
        </label>
      </div>

      {/* Date of Birth */}
      <h3>
        Date of Birth:
      </h3>
      <input
        type="date"
        name="dob"
        value={formData?.personalDetails[0]?.dob}
        onChange={handlePersonalChange}
        style={{width:"20%",height:"10px"}}
      />

      {/* ACHIEVEMENTS */}
      <h2>Achievements</h2>
      {formData?.achievements?.map((item, index) => (
        <div key={index} style={{  marginBottom: "10px" }}>
          <input
            type="text"
            value={item}
            placeholder="Enter achievement"
            onChange={(e) =>
              handleDynamicChange(index, "achievements", e.target.value)
            }
            style={inputStyle}
          />
          <button
            onClick={() => removeField("achievements", index)} 
            style={buttonStyle}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => addField("achievements")} style={buttonStyle}>Add Achievement</button>

      {/* INTERESTS */}
      <h2>Interests</h2>
      {formData?.interests?.map((item, index) => (
        <div key={index} style={{  marginBottom: "10px" }}>
          <input
            type="text"
            value={item}
            placeholder="Enter interest"
            onChange={(e) =>
              handleDynamicChange(index, "interests", e.target.value)
              
            }
            style={inputStyle}
          />
          <button
            onClick={() => removeField("interests", index)}
            style={buttonStyle}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => addField("interests")} style={buttonStyle}>Add Interest</button>

      <h2>Projects</h2>
      {formData?.projects?.map((item, index) => (
        <div key={index} style={{  marginBottom: "10px" }}>
          <input
            type="text"
            value={item}
            placeholder="Enter project"
            onChange={(e) =>
              handleDynamicChange(index, "projects", e.target.value)
              
            }
            style={inputStyle}
          />
          <button
            onClick={() => removeField("projects", index)}
            style={buttonStyle}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => addField("interests")} style={buttonStyle}>Add Projects</button>
    </div>
    </>
    }
        <button style={{ ...buttonStyle, display: 'block', marginTop: '20px', backgroundColor:'green' }} onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default ResumeForm;


