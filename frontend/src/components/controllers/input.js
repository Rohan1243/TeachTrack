import React from "react";
import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Input() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newStaffObject, setStaffObj] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    // Create a new file reader instance
    const reader = new FileReader();

    // Define the onload event handler
    reader.onload = function (event) {
      parseExcelToJson(event.target.result); // Call function to parse Excel file
    };

    // Read the selected file as binary string
    reader.readAsArrayBuffer(selectedFile);
  };

  // Function to parse Excel file and convert to JSON
  let staffObj = {};
  const parseExcelToJson = (fileData) => {
    // Parse the Excel file
    const data = new Uint8Array(fileData);
    const workbook = XLSX.read(data, { type: "array" });

    // Convert the first sheet of the workbook to JSON
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Log the converted JSON data
    console.log("Converted JSON data:", jsonData);

    try {
      let key = 1;
      for (key in jsonData) {
        let teachers = [];
        let sub = "";

        if (jsonData[key][0] === "Subject") {
          key++;
        }
        if (jsonData[key].length === 0) {
          key++;
          key++;
          break;
        }
        sub = jsonData[key][0];
        let staff = "";
        if (jsonData[key][1] === undefined) {
          staff = jsonData[key][2];
        } else {
          staff = jsonData[key][1];
        }

        teachers.push(staff);
        staffObj[sub] = teachers;
      }

      let i;
      let subject;
      for (i = key; i < jsonData.length; i++) {
        let teachers = [];
        if (jsonData[i].length === 1) {
          subject = jsonData[i][0];
        } else {
          // Process teachers data
          while (i < jsonData.length && jsonData[i].length > 1) {
            if (jsonData[i][2] === undefined) {
              teachers.push(jsonData[i][1]);
            } else {
              teachers.push(jsonData[i][2]);
            }

            i++;
          }

          // If teachers array is not empty, add to staffObj
          if (teachers.length > 0) {
            let distinctArr = [...new Set(teachers)];
            if (subject) {
              // Ensure subject is defined before assigning to staffObj
              staffObj[subject] = distinctArr;
            }
          }
          // Decrease the index to handle the current array again
          i--;
        }
      }

      setStaffObj(staffObj);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    axios
      .post("http://localhost:8000/inputs/timetable", staffObj)
      .then((response) => {
        console.log("Data uploaded to server successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading data to server:", error);
      });
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <p>File Size: {selectedFile.size} bytes</p>
        </div>
      )}
      {newStaffObject && (
        <div>
          <h3>Staff Object Data:</h3>
          <pre>{JSON.stringify(newStaffObject, null, 1)}</pre>
        </div>
      )}
    </div>
  );
}

export function TeacherDetailInput() {

  const teacherDetails = [
    {
      name:"Mrs. S. R. Hiray",
      email:"hiray@gmail.com",
      phone:1234567890
    },
    {
      name:"Mrs. J. B. Jagdale",
      email:"adwaitmali73@gmail.com",
      phone:1234567890
    },
    {
      name:"Mr. M. R. Khodaskar",
      email:"mk@gmail.com",
      phone:1234567890
    },
    {
      name:"Mrs. K. Y. Digholkar",
      email:"kd@gmail.com",
      phone:1234567890
    },
    {
      name:"Mrs. A. S. Kadam",
      email:"ak@gmail.com",
      phone:1234567890
    },
    {
      name:"Mr. N. V. Buradkar",
      email:"nb@gmail.com",
      phone:1234567890
    },
    {
      name:"Mr. S. D. Shelke",
      email:"ss@gmail.com",
      phone:1234567890
    },
    {
      name:"Mrs. D. P. Salapurkar",
      email:"ds@gmail.com",
      phone:1234567890
    },
    {
      name:"Mrs. S. A. Jakhete",
      email:"sj@gmail.com",
      phone:1234567890
    },
    {
      name:"Mr. V. R. Jaiswal",
      email:"hiray@gmail.com",
      phone:1234567890
    },
    

  ]
  const handleSubmit = () => {
      axios.post("http://localhost:8000/inputs/teacherDetails", teacherDetails)
      .then((res) => {
        console.log("Teacher Details send to backend successfully", res.data);
      })
      .catch((err) => {
        console.error("Sending Teacher Details Failed", err);
      })
  };

  return (
    <button className="text-white bg-black" onClick={handleSubmit}>
      Submit Teacher Details
    </button>
  );
}

export function TeacherPastExperience(){
  const data = {
    "DS": [
      "Mrs. J. B. Jagdale",
      "Mr. M. R. Khodaskar"
    ],
    "SC": [
      "Mr. S. D. Shelke",
      "Mrs. K. Y. Digholkar",
      "Mr. V. R. Jaiswal"
    ],
    "BCT": [
      "Mrs. S. A. Jakhete",
      "Mrs. K. Y. Digholkar"
    ],
    "S&E": [
      "Mrs. A. S. Kadam",
      "Mr. N. V. Buradkar",
      "Mrs. S. A. Jakhete"
    ],
    "LP-V": [
      "Mr. M. R. Khodaskar",
      "Mr. V. R. Jaiswal"
    ],
    "LP-VI": [
      "Mrs. A. S. Kadam",
      "Mr. N. V. Buradkar",
      "Mrs. S. R. Hiray",
      "Mr. S. D. Shelke",
      "Mrs. D. P. Salapurkar"
    ]
   };

   const handleSubmit = () => {
    axios.post("http://localhost:8000/inputs/pastExperienceInput", data)
    .then((res) => {
      console.log("Teacher Details send to backend successfully", res.data);
    })
    .catch((err) => {
      console.error("Sending Teacher Details Failed", err);
    })
};

   return (
    <button className="text-white bg-black" onClick={handleSubmit}>
      Submit Past Details
    </button>
  );


}

export function SelectAuditor(){
  const handleSubmit = async () => {
    axios.post("http://localhost:8000/mail/selectauditorandmail")
    .then((res) => {
      console.log("Request for mail sent successfully");
    })
    .catch((err) => {
      console.error("Error in sending request", err);
    })


    // axios.get("http://localhost:8000/mail/auditormail")
    // .then((res) => {
    //   console.log("Request for mail sent successfully");
    // })
    // .catch((err) => {
    //   console.error("Error in sending request for mail", err);
    // }) 
};


const handleMail = async () => {
  axios.get("http://localhost:8000/mail/auditormail")
  .then((res) => {
    console.log("Request for mail sent successfully");
  })
  .catch((err) => {
    console.error("Error in sending request for mail", err);
  }) 
};

// return (
//   <>
//   <div>
//     <button className="text-white bg-black m-5" onClick={handleSubmit}>
//     Select Auditor
//     </button>
//   </div>
//   <div>
//     <button className="text-white bg-black m-5" onClick={handleMail}>
//     Send Mail to auditors
//   </button>
//   </div>

//   </>
  
// );
}

export function MailToTeachers(){
  const handleSubmit = () => {
    axios.get("http://localhost:8000/mailtoallteachers")
    .then((res) => {
      console.log("Request for mail sent successfully");
    })
    .catch((err) => {
      console.error("Error in sending request", err);
    })
};

return (
  <button className="text-white bg-black" onClick={handleSubmit}>
    MailToAllTeachers
  </button>
);
}
