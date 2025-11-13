import React from 'react'
import styles from "./AppliedUserProfile.module.css"
import { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Puff } from 'react-loader-spinner'
import useScreenSize from '../SizeHook';
import profileDp from "../img/user_3177440.png"
import Footer from '../Footer/Footer';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function AppliedDriveUserProfile() {
    let params = useParams()
    let JobId = atob(params.jid)

    let navigate = useNavigate()
    

    const [AppliedUser, setAppliedUser] = useState([])
    const [OperationalAppliedUser, setOperationalAppliedUser] = useState()
    const [select, setselect] = useState("select")
    const [reject, setreject] = useState("reject")
    const [Onhold, setOnhold] = useState("Onhold")
    const [PageLoader, setPageLoader] = useState(false)
    const screenSize = useScreenSize();
    const [Filtereredjobs, setFiltereredjobs] = useState([])
    const [nopageFilter, setNoPageFilter] = useState(false)

    async function getAppliedUserIds(OId) {
        setPageLoader(true)

        await axios.get(`/walkinRoute/getAppliedUserIds/${OId}`)
            .then(async (res) => {
                let AppliedUserIds = res.data.jobSeekerId
                let appliedUserIds = AppliedUserIds.map((ids) => {
                    return (
                        ids.jobSeekerId
                    )
                })
              console.log("applied user ids",appliedUserIds)
                setOperationalAppliedUser([res.data])
                
                await axios.get(`/StudentProfile/getAppliedProfileByIds/${appliedUserIds}`)
                    .then((res) => {
                        console.log("total profile fetched",res.data)
                        setAppliedUser(res.data)
                        setPageLoader(false)
                    }).catch((err) => {
                        alert("server error occured")
                    })
            }).catch((err) => {
                alert("server error occured")
            })
    }

    useEffect(() => {
        getAppliedUserIds(JobId)
    }, [])

    function CheckProfile(StudID) {
        // navigate(`/Check-Profile/${StudID}`)
        window.open(`/Check-Profile/${StudID}`, '_blank')
    }

    async function Select(id, status) {
        let slectedJobseker = id
        await axios.put(`walkinRoute/status/${JobId}`, { slectedJobseker })
            .then((res) => {
                getAppliedUserIds(JobId)

            }).catch((err) => {
                alert("server error occured")
            })
    }
    async function Reject(id, status) {
        let rejectedJobseker = id
        await axios.put(`walkinRoute/status/${JobId}`, { rejectedJobseker })
            .then((res) => {
                getAppliedUserIds(JobId)

            }).catch((err) => {
                alert("server error occured")
            })
    }
    async function onHold(id, status) {
        console.log("onhold")
        let onHoldJobseker = id
        await axios.put(`walkinRoute/status/${JobId}`, { onHoldJobseker })
            .then((res) => {
                console.log("abc",res)
                getAppliedUserIds(JobId)

            }).catch((err) => {
                alert("server error occured")
            })
    }

    async function UndoSelect(id) {
        let userid = JSON.parse(localStorage.getItem("StudId"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

        let slectedJobseker = id

        await axios.put(`walkinRoute/updatforUndoWalkinApplied/${JobId}`, { slectedJobseker }, { headers })
            .then((res) => {
                getAppliedUserIds(JobId)
            }).catch((err) => {

                alert("server error occured")
            })

    }

    async function UndoReject(id) {

        let userid = JSON.parse(localStorage.getItem("StudId"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

        let rejectedJobseker = id

        await axios.put(`walkinRoute/updatforUndoWalkinApplied/${JobId}`, { rejectedJobseker }, { headers })
            .then((res) => {
                getAppliedUserIds(JobId)
            }).catch((err) => {

                alert("server error occured")
            })

    }

    async function UndoOnHold(id) {
        let userid = JSON.parse(localStorage.getItem("StudId"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("StudLog"))) };

        let onHoldJobseker = id

        await axios.put(`walkinRoute/updatforUndoWalkinApplied/${JobId}`, { onHoldJobseker }, { headers })
            .then((res) => {
                getAppliedUserIds(JobId)
            }).catch((err) => {

                alert("server error occured")
            })
    }

    function NoticeAscendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(b.NoticePeriod, a.NoticePeriod)
        })
        setAppliedUser(sorted)
    }

    function NoticeDescendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(a.NoticePeriod, b.NoticePeriod)
        })
        setAppliedUser(sorted)
    }

    // .......age Sorting.......
    function AgeDescendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(a.age, b.age)
        })
        setAppliedUser(sorted)
    }
    function AgeAscendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(b.age, a.age)
        })
        setAppliedUser(sorted)
    }

    // .......Experiance Sorting.......
    function ExpDescendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(a.Experiance, b.Experiance)
        })
        setAppliedUser(sorted)
    }
    function ExpAscendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(b.Experiance, a.Experiance)
        })
        setAppliedUser(sorted)
    }

    // .......Curent CTC Sorting.......
    function CurrCTCDescendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(a.currentCTC, b.currentCTC)
        })
        setAppliedUser(sorted)
    }
    function CurrCTCAscendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(b.currentCTC, a.currentCTC)
        })
        setAppliedUser(sorted)
    }


    // .......Expected CTC Sorting.......
    function ExpCTCDescendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(a.ExpectedSalary, b.ExpectedSalary)
        })
        setAppliedUser(sorted)
    }
    function ExpCTCAscendingOrder() {
        let newjob = [...AppliedUser]
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const sorted = newjob.sort((a, b) => {
            return collator.compare(b.ExpectedSalary, a.ExpectedSalary)
        })
        setAppliedUser(sorted)
    }

    let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))

    const [currentPage, setCurrentPage] = useState(1)
    const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage ? recordsperpage : 10)
    const lastIndex = currentPage * recordsPerPage //10
    const firstIndex = lastIndex - recordsPerPage //5
    const records =  Array.isArray(AppliedUser) ? AppliedUser.slice(firstIndex, lastIndex) : [] //5
    const npage = Math.ceil(AppliedUser.length / recordsPerPage) // last page
    const number = [...Array(npage + 1).keys()].slice(1)

    function firstPage(id) {
        setCurrentPage(1)
    }

    function previous() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCurrent(id) {
        setCurrentPage(id)
    }
    function next() {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1)
        }
    }
    function last() {
        setCurrentPage(npage)
    }
    function handleRecordchange(e) {
        sessionStorage.setItem("recordsperpage", JSON.stringify(e.target.value));
        let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))
        setrecordsPerPage(recordsperpage)
        setCurrentPage(1)
    }

    const [selectedIds, setSelectedIds] = useState([]);

    // Handle Checkbox Select/Deselect
    const handleCheckboxChange = (id) => {
      setSelectedIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id]
      );
    };

  
    const handleDownloadList = () => {
        const selectedData = records.filter((item) =>
          selectedIds.includes(item._id.toString())
        );
      
        if (!selectedData.length) {
          alert("Please select at least one record");
          return;
        }
      
        const doc = new jsPDF();
      
        selectedData.forEach((candidate, index) => {
          const fields = [
            { label: "Name", key: "name" },
            // { label: "Email Address", key: "email" },
            { label: "Phone Number", key: "phoneNumber" },
            { label: "Qualification", key: "Qualification" },
            { label: "Skills", key: "Skills" },
            { label: "Experience", key: "Experiance", suffix: " Years" },
            { label: "Current CTC", key: "currentCTC", suffix: " LPA" },
            { label: "Expected Salary", key: "ExpectedSalary", suffix: " LPA" },
            { label: "Notice Period", key: "NoticePeriod", suffix: " Days" },

          ];
      
          const body = fields.map(({ label, key, suffix }) => {
            let value = candidate[key] || candidate[key.toLowerCase()] || "N/A";
      
            if (Array.isArray(value)) value = value.join(", ");
            if (typeof value === "object" && value !== null)
              value = JSON.stringify(value);
      
            if (suffix && value !== "N/A" && !value.toString().includes(suffix))
              value = `${value}${suffix}`;
      
            return [label, value];
          });
      
          autoTable(doc, {
            head: [["Field", "Details"]],
            body,
            startY: index === 0 ? 10 : doc.lastAutoTable.finalY + 15,
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
            styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
            columnStyles: {
              0: { fontStyle: "bold", cellWidth: 60 },
              1: { cellWidth: 120 },
            },
            margin: { top: 10, left: 10, right: 10 },
            didDrawPage: (data) => {
              if (index === 0) {
                doc.setFontSize(14);
                doc.text("Selected Candidate Details", 14, 8);
              }
            },
          });
        });
      
        doc.save("selected_list.pdf");
      };
  

    const handleMergeMail = () => {
        const selectedData = records.filter((item) =>
          selectedIds.includes(item._id.toString())
        );
        if (selectedData.length === 0) return alert("Select at least one user.");
      
        const subject = encodeURIComponent("Candidate Details");
      
        // Only show key info (short enough for Gmail)
        const body = encodeURIComponent(
          selectedData
          .map(
            (d, i) => `
    ${i + 1}. ${d.name || "N/A"}
    Age: ${d.age || "N/A"}
    Notice Period: ${d.NoticePeriod ? `${d.NoticePeriod} Days` : "N/A"}
    Qualification: ${d.Qualification || "N/A"}
    Experience: ${d.Experiance ? `${d.Experiance} Years` : "N/A"}
    Skills: ${Array.isArray(d.Skills) ? d.Skills.join(", ") : d.Skills || "N/A"}
    Current CTC: ${d.currentCTC ? `${d.currentCTC} LPA` : "N/A"}
    Expected Salary: ${d.ExpectedSalary ? `${d.ExpectedSalary} LPA` : "N/A"}
    Email: ${d.email || "N/A"}
    Phone: ${d.phoneNumber || "N/A"}
    Address: ${d.address || "N/A"}
    `
          )
          .join("\n-----------------------------------\n")
      );
      
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
      };
      

      // Download as Excel
  const handleDownloadExcel = () => {
    const data = records.filter((item) => selectedIds.includes(item._id.toString()));
    const selectedData = data.map((item) => ({
        Name: item.name || "N/A",
        Age:item.age
        ? `${item.age} Years`
        : "N/A",
        NoticePeriod: item.NoticePeriod
        ? `${item.NoticePeriod} Days`
        : "N/A",
        Qualification: item.Qualification || "N/A",
        Experience: item.Experiance
      ? `${item.Experiance} Years`
      : "N/A",
        Skills: item.Skills || "N/A",
        CurrentCTC: item.currentCTC
      ? `${item.currentCTC} LPA`
      : "N/A",
    ExpectedSalary: item.ExpectedSalary
      ? `${item.ExpectedSalary} LPA`
      : "N/A",
      }));

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
    XLSX.writeFile(workbook, "selected_list.xlsx");

  };

  // Check if all rows are selected
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(records.map((item) => item._id.toString()));
    } else {
      setSelectedIds([]);
    }
  };

    return (
        <>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
         <button
    className={styles.tvbackbtn}
    onClick={() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/posteddrives");
      }
    }}
  >
    <div style={{ fontSize: "12px", fontWeight: "800" }}>Back</div>
  </button>
 
 
  <div className={styles.downloadbtns}>
    <button onClick={handleDownloadList} className={styles.backbtn} style={{ fontSize: "10px", fontWeight: "800" }}>Download List</button>
    <button onClick={handleMergeMail} className={styles.backbtn} style={{ fontSize: "10px", fontWeight: "800" }}>Merge & Mail</button>
    <button onClick={handleDownloadExcel} className={styles.backbtn} style={{ fontSize: "10px", fontWeight: "800" }}>Download Excel</button>
  </div>


   </div>

            <h4 style={{ marginTop: "10px", marginLeft: "1%" }}>Total {AppliedUser.length} {AppliedUser.length>1?"Job Seekers":"Job Seeker"}  have applied</h4>
            
         
            {screenSize.width > 850 ?
<>
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                        {nopageFilter ?
                            <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>{Filtereredjobs}</span> from All Jobs</p>
                            :
                            <p style={{ fontWeight: 400, marginLeft: "10px" }}>Showing {firstIndex + 1} to {lastIndex} latest candidates</p>
                        }
                        <div className={styles.navigationWrapper}>
                            <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                                <i class='fas fa-step-backward'></i>
                            </button>
                            <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={previous}>
                                <i class='fas fa-caret-square-left'></i>
                            </button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={next}>
                                <i class='fas fa-caret-square-right'></i>
                            </button>
                            <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={last}>
                                <i class='fas fa-step-forward'></i>
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: "5px", marginTop: "0", marginLeft: "10px" }}>
                        Show  <select onChange={(e) => { handleRecordchange(e) }}>
                            <option selected={lastIndex === 10} value={10}>10</option>
                            <option selected={lastIndex === 25} value={25}>25</option>
                            <option selected={lastIndex === 50} value={50}>50</option>
                            <option selected={lastIndex === 100} value={100}>100</option>
                        </select>  candidates per page
                    </div>
                <div className={styles.AllUiWrapper}>

                    <ul className={styles.ul} >
                        
                    <input
                type="checkbox"
                checked={selectedIds.length === records.length}
                onChange={handleSelectAll}
                style={{ visibility: 'hidden' }}
              />
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.name}`}><b>Name</b>  </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.NoticePeriod}`}><b>Notice Period</b>
                            <p style={{ display: "inline", marginLeft: "10px" }}>
                                <i onClick={NoticeAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                                <i onClick={NoticeDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                            </p>
                        </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.age}`}> <b>Age</b>
                            <p style={{ display: "inline", marginLeft: "10px" }}>
                                <i onClick={AgeAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                                <i onClick={AgeDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                            </p>
                        </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.Qualification}`}>  <b>Qualification</b> </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.Experiance}`}><b>Experience</b>
                            <p style={{ display: "inline", marginLeft: "10px" }}>
                                <i onClick={ExpAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                                <i onClick={ExpDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                            </p>
                        </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.Skills}`}> <b>Skills</b> </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.currentCTC}`}> <b>Curr. CTC</b>
                            <p style={{ display: "inline", marginLeft: "10px" }}>
                                <i onClick={CurrCTCAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                                <i onClick={CurrCTCDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                            </p>
                        </li>
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.ExpectedSalary}`}><b>Exp. CTC</b>
                            <p style={{ display: "inline", marginLeft: "10px" }}>
                                <i onClick={ExpCTCAscendingOrder} className={`${styles.arrow} ${styles.up}`}> </i>
                                <i onClick={ExpCTCDescendingOrder} className={`${styles.arrow} ${styles.down}`}></i>
                            </p>
                        </li>
                        {/* <li className={`${styles.li} ${styles.checkProfile}`}><b>View Profile</b> </li> */}
                        <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.Status}`}><b>Status</b> </li>
                        {/* <li style={{ backgroundColor: " rgb(40, 4, 99)", color: "white" }} className={`${styles.li} ${styles.Status}`}><b>Background Check</b> </li> */}

                    </ul>
                    {PageLoader ?
                        <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "49%", marginTop: "50px" }} />
                        : ""
                    }

                    {
                        records?.map((Applieduser, i) => {
                            return (
                                <ul className={styles.ul} key={i}>
                                     <input
                  type="checkbox"
                  checked={selectedIds.includes(Applieduser._id)}
                  onChange={() => handleCheckboxChange(Applieduser._id)}
                />
                                    <li className={`${styles.li} ${styles.name} ${styles.onclick}`} onClick={() => { CheckProfile(btoa(Applieduser._id)) }} >
                                        {Applieduser.name ? <a className={styles.namelink} title="Click to check the Contact Details">
                                            {Applieduser.name}</a> : <li className={styles.Nli}>N/A</li>} </li>
                                    <li className={`${styles.li} ${styles.NoticePeriod}`}> {Applieduser.NoticePeriod ?
                                        Applieduser.NoticePeriod : <li className={styles.Nli}>N/A</li>}days </li>
                                    <li className={`${styles.li} ${styles.age}`}> {Applieduser.age ?
                                        Applieduser.age : <li className={styles.Nli}>N/A</li>} </li>
                                    <li className={`${styles.li} ${styles.Qualification}`}> {Applieduser.Qualification ?
                                        Applieduser.Qualification : <li className={styles.Nli}>N/A</li>} </li>
                                    <li className={`${styles.li} ${styles.Experiance}`}> {Applieduser.Experiance ?
                                        Applieduser.Experiance : <li className={styles.Nli}>N/A</li>}Yrs </li>
                                    <li className={`${styles.li} ${styles.Skills}`}> {Applieduser.Skills ?
                                        Applieduser.Skills : <li className={styles.Nli}>N/A</li>} </li>
                                    <li className={`${styles.li} ${styles.currentCTC}`}> {Applieduser.currentCTC ?
                                        Applieduser.currentCTC : <li className={styles.Nli}>N/A</li>}LPA </li>
                                    <li className={`${styles.li} ${styles.ExpectedSalary}`}> {Applieduser.ExpectedSalary ?
                                        Applieduser.ExpectedSalary : <li className={styles.Nli}>N/A</li>} </li>
                                    {/* <li  className={`${styles.li} ${styles.checkProfile}`}><button onClick={()=>{CheckProfile(Applieduser._id)}} className={`${styles.ViewProfile}`}>{Applieduser.name}</button> </li> */}
                                    <li className={`${styles.li} ${styles.Status}`}>
                                        <div style={{ marginLeft: "-3%" }}>
                                            {
                                                OperationalAppliedUser?.map((operationl, it) => {
                                                    // {console.log("drive-obj",operationl)}
                                                    return (
                                                        <div key={it}>
                                                            {
                                                                operationl.slectedJobseker?.find((jobseekerid) => {
                                                                    return (
                                                                        jobseekerid == Applieduser._id
                                                                    )
                                                                }) ?
                                                                    <>
                                                                        <button onClick={() => { UndoSelect(Applieduser._id, "selected") }} style={{
                                                                            marginLeft: "2%", background: "rgb(24, 175, 24)", color: "white",cursor:"pointer",
                                                                            border: "solid", width: "80%", height: "30px", fontWeight: "bold"
                                                                        }} title="Click to Undo Select">Selected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                    :

                                                                    (operationl.rejectedJobseker?.find((jobseekerid) => {
                                                                        return (
                                                                            jobseekerid == Applieduser._id
                                                                        )
                                                                    })) ?
                                                                        <>
                                                                            <button onClick={() => { UndoReject(Applieduser._id, "selected") }} style={{
                                                                                marginLeft: "2%", background: "red", color: "white",cursor:"pointer",
                                                                                border: "solid", width: "80%", height: "30px", fontWeight: "bold"
                                                                            }} title="Click to Undo Reject">Rejected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                        :

                                                                        (operationl.onHoldJobseker?.find((jobseekerid) => {
                                                                            return (
                                                                                jobseekerid == Applieduser._id
                                                                            )
                                                                        })) ?
                                                                            <>
                                                                                <button onClick={() => { UndoOnHold(Applieduser._id, "selected") }} style={{
                                                                                    marginLeft: "2%", background: "blue", color: "white",cursor:"pointer",
                                                                                    border: "solid", width: "80%", height: "30px", fontWeight: "bold"
                                                                                }} title="Click to Undo On Hold">OnHold<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                            :
                                                                            <>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "70%", height: "30px", fontWeight: "bold",cursor:"pointer",
                                                                                }} onClick={() => { Select(Applieduser._id, "selected") }}>Select</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "70%", height: "30px", fontWeight: "bold",cursor:"pointer",
                                                                                }} onClick={() => { Reject(Applieduser._id, "Rejected") }}>Reject</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "70%", height: "30px", fontWeight: "bold",cursor:"pointer",
                                                                                }} onClick={() => { onHold(Applieduser._id, "OhHold") }}>OnHold</button><br></br>

                                                                            </>

                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </li>
                                    {/* <li className={`${styles.li} ${styles.Status}`}>
                                      <button style={{marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", 
                                      border: "solid", fontWeight: "600",}}>
                                        Background Check</button>
                                    </li> */}

                                </ul>

                            )
                        })
                    }
                </div>

                           <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{marginTop:"14px", marginLeft:"10px"}} >
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              <option selected = {lastIndex === 10} value={10}>10</option>
              <option selected = {lastIndex === 25} value={25}>25</option>
              <option selected = {lastIndex === 50} value={50}>50</option>
              <option selected = {lastIndex === 100} value={100}>100</option>
            </select>  candidates per page
            </div>
           
          <div className={styles.navigationWrapper}>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                <i class='fas fa-step-backward' ></i>
              </button>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={previous}>
                <i class='fas fa-caret-square-left'></i>
              </button>
              <span>{currentPage}</span>
              <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={next}>
                <i class='fas fa-caret-square-right'></i>
              </button>
              <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={last}>
                <i class='fas fa-step-forward'></i>
              </button>
            </div>
            </div>
</>
                :
                <>
                    {PageLoader ?
                        <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "40%", marginTop: "50px" }} />
                        : ""
                    }
                    <div id={styles.JobCardWrapper} >

                        {AppliedUser?.map((job, i) => {
                            return (
                                <>
                                    <div className={styles.JobCard} key={i}>
                                    <input
                  type="checkbox"
                  checked={selectedIds.includes(job._id)}
                  onChange={() => handleCheckboxChange(job._id)}
                />
            
                                        <div style={{ display: "flex" }}>

                                            <div className={styles.LeftTable}>
                                                <span className={styles.span}>Name :  </span> <br></br>
                                                <span className={styles.span}>Age :</span><br></br>
                                                <span className={styles.span}> Notice Period :</span><br></br>
                                                <span className={styles.span}>Qualification :</span><br></br>
                                                <span className={styles.span}>Experience : </span><br></br>
                                                <span className={styles.span}> Current CTC :</span><br></br>
                                                <span className={styles.span}>Expected CTC : </span><br></br>
                                            </div>

                                            <div className={styles.RightTable}>
                                                <span className={styles.span}><span style={{ color: "blue", textDecoration: "underline" }} onClick={() => { CheckProfile(btoa(job._id)) }}  >{job.name} </span></span><br></br>
                                                <span className={styles.span}>{job.age ? <span style={{ color: "blue" }}>{job.age} </span> : <span style={{ color: "red" }}>N/A</span>}</span><br></br>
                                                <span className={styles.span}> {job.NoticePeriod ? <span style={{ color: "blue" }}>{job.NoticePeriod} </span> : <span style={{ color: "red" }}>N/A</span>}</span><br></br>
                                                <span className={styles.span}> {job.Qualification ? <span style={{ color: "blue" }}>{job.Qualification} </span> : <span style={{ color: "red" }}>N/A</span>}</span><br></br>
                                                <span className={styles.span}>
  {job.Experiance ? (
    <span style={{ color: "blue" }}>
      {job.Experiance} Yrs
    </span>
  ) : (
    <span style={{ color: "red" }}>N/A</span>
  )}
</span>
<br />

<span className={styles.span}>
  {job.currentCTC ? (
    <span style={{ color: "blue" }}>
      {job.currentCTC} LPA
    </span>
  ) : (
    <span style={{ color: "red" }}>N/A</span>
  )}
</span>
<br />

<span className={styles.span}>
  {job.ExpectedSalary ? (
    <span style={{ color: "blue" }}>
      {job.ExpectedSalary} LPA
    </span>
  ) : (
    <span style={{ color: "red" }}>N/A</span>
  )}
</span>
<br />

                                            </div>
                                            <img className={styles.MobileimageView} src={job.image ? job.image : profileDp} />

                                        </div>

                                        <div className={styles.Down}>
                                            <span className={styles.span}> Skills : {job.Skills ? <span style={{ color: "blue" }}>{job.Skills} </span> : <span style={{ color: "red" }}>N/A</span>}</span><br></br>
                                        </div>

                                        {
                                            OperationalAppliedUser?.map((operationl) => {
                                                return (
                                                    <>
                                                        {
                                                            operationl.slectedJobseker?.find((jobseekerid) => {
                                                                return (
                                                                    jobseekerid == job._id
                                                                )
                                                            }) ?
                                                                <>  <div style={{display:"flex", marginLeft:"-27%"}}>
                                                                    
                                                                    <button onClick={() => { UndoSelect(job._id, "selected") }} style={{
                                                                        marginLeft: "27%", background: "rgb(24, 175, 24)", color: "white",
                                                                        border: "solid", width: "31%", height: "30px", fontWeight: "bold"
                                                                    }} title="Click to Undo Select">Selected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br>
                                                                    {/* <button style={{marginLeft: "", background: "rgb(40, 4, 99)", color: "white", 
                                      border: "solid", fontWeight: "600",}}>
                                        Background Check</button> */}
                                                                    </div>
                                                                </>
                                                                
                                                                :

                                                                (operationl.rejectedJobseker?.find((jobseekerid) => {
                                                                    return (
                                                                        jobseekerid == job._id
                                                                    )
                                                                })) ?
                                                                    <>
                                                                        <button onClick={() => { UndoReject(job._id, "selected") }} style={{
                                                                            marginLeft: "27%", background: "red", color: "white",
                                                                            border: "solid", width: "31%", height: "30px", fontWeight: "bold"
                                                                        }} title="Click to Undo Reject">Rejected<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                    :

                                                                    (operationl.onHoldJobseker?.find((jobseekerid) => {
                                                                        return (
                                                                            jobseekerid == job._id
                                                                        )
                                                                    })) ?
                                                                        <>
                                                                            <button onClick={() => { UndoOnHold(job._id, "selected") }} style={{
                                                                                marginLeft: "27%", background: "blue", color: "white",
                                                                                border: "solid", width: "31%", height: "30px", fontWeight: "bold"
                                                                            }} title="Click to Undo On Hold">OnHold<span style={{ fontSize: '16px' }} >&#10004;</span></button><br></br></>
                                                                        :
                                                                        <>
                                                                            <div style={{ display: "flex", marginLeft: "-1%" }}>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "23%", height: "30px", fontWeight: "bold"
                                                                                }} onClick={() => { Select(job._id, "selected") }}>Select</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "23%", height: "30px", fontWeight: "bold"
                                                                                }} onClick={() => { Reject(job._id, "Rejected") }}>Reject</button><br></br>
                                                                                <button style={{
                                                                                    marginLeft: "2%", background: "rgb(40, 4, 99)", color: "white", border: "solid",
                                                                                    width: "25%", height: "30px", fontWeight: "bold"
                                                                                }} onClick={() => { onHold(job._id, "OhHold") }}>OnHold</button><br></br>
                                                                                {/* <li className={`${styles.li} ${styles.Status}`} style={{border:"none"}}> */}
                                      {/* <button style={{marginLeft: "", background: "rgb(40, 4, 99)", color: "white", 
                                      border: "solid", fontWeight: "600",}}>
                                        Background Check</button> */}
                                    {/* </li> */}
                                                                            </div>
                                                                            
                                                                        </>

                                                        }
                                                        
                                                    </>
                                                )
                                            })
                                            
                                        }

                                    </div>
                                </>
                            )
                        })}

                    </div>
                                              <div style={{marginTop:"70px"}}>
                                              <Footer/>
                                            </div>
                </>

            }

        </>
    )
}

export default AppliedDriveUserProfile;

