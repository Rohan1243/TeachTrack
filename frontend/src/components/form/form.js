import React, { useEffect, useState } from "react";
import Attributes from "./attributes";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Name from "./name";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";

const FormComponent = () => {


  const list = [
    " ",
    "Vision Mission Pos",
    "Personal TimeTable",
    "Class TimeTable",
    "University Syallbus and structure",
    "TH Course Plan",
    "TH Articulation Matrix Justification",
    "PR Course Plan",
    "PR Articulation Matrix Justification",
    "List of Lab Expt",
    "Schedule of Lab Expt",
    "List of Lab Manual",
    "Theory Attendence Record",
    "Lab Assessment Record",
    "UT Question Papers & Solutions With Marking Scheme",
    "UT MarkSheet & Sample answer sheets",
    "University Question Paper",
    "Remedial assignment samples of defaulters",
    "Remedial Sessions Record",
    "ITL method practised",
    "E - content",
    "Industry Expert Session",
    "Topic Beyond Syallbus",
    "CO attainment calculations for IA",
    "Course Coordinator Report",
    "Feedback",
  ];

  var n;
  const [list2, setList2] = useState([]);
  const [final_obj, setFinal_obj] = useState([]);
  // const [remarks, setRemarks] = useState({});
  const [formData, setFormData] = useState({
    previous: "",
    suggestions: "",
  });
  const [selectedCoordinator, setSelectedCoordinator] = useState("");
  const [coo, setCoo] = useState({ subcoordinator: ""});
  
  const [sub, setSub] = useState({});
  // setCoo({ subcoordinator: selectedCoordinator });
  const toast = useToast();

  

  useEffect(() => {
    fetch("/form/data")
      .then((response) => response.json())
      .then((data) => {
        n = data.teacher.length;
        setList2(data.teacher);
        setSelectedCoordinator(data.teacher[0]);
        setCoo({subcoordinator: data.teacher[0]});
        setSub({ [data.subject]: data.teacher });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  
  

  useEffect(() => {
    const initialFinalObj = list.map((attribute) => ({
      [attribute]: new Array(list2.length).fill(""),
      remark: "", // Initialize remark field with an empty string
    }));
    setFinal_obj(initialFinalObj);
  }, [list2]);

  function remarkHandler(name, value, index) {
    setFinal_obj((prevFinalObj) => {
      const updatedFinalObj = [...prevFinalObj]; // Copy the previous state array
      updatedFinalObj[index][name] = value; // Update the remark field for the corresponding attribute
      // console.log("Updated final_obj:", updatedFinalObj);
      return updatedFinalObj; // Return the updated array
    });
  }

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      console.error("Token not found. User not authenticated.");
      return;
    }

    const submissionData = [
      ...final_obj,
      // {
      //   feedback: data.feedback,
      //   CourseCoordinatorReport: data.CourseCoordinatorReport,
      // },
      {
        previous: formData.previous,
        suggestions: formData.suggestions,
      },
      coo,
      sub,
    ];
    // console.log(submissionData);

    axios
      .post("http://localhost:8000/formData/info", submissionData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast({
          title: `Response submitted Successfully!`,
          status: "success",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
      })
      .catch((error) => {
        // alert("Problem in Generating Report")
        toast({
          title: `Error in generating report! Try again`,
          status: "error",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
      });

    // navigate("/thankYou");
    // console.log(submissionData);
    localStorage.setItem("formData", JSON.stringify(submissionData));

    // Open the report page in a new tab
    window.open("/course_wise/report", "_blank");
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useState(() => {
    setFinal_obj((prevFinalObject) => ({
      ...prevFinalObject,
      ...formData,
    }));
    console.log("Updated final object:", final_obj);
  }, [formData]);

  function goHome() {
    navigate("/home");
  }

  function handleCoordinatorChange(e) {
    const selectedValue = e.target.value;
    setSelectedCoordinator(selectedValue);
    setCoo({ subcoordinator: selectedValue });
  }

 
  return (
    <div className="bg-[#19233D] pt-[30px] pb-[40px] min-w-max ">
      <div className="">
        <div className="flex justify-center text-4xl font-bold text-gray-300 mb-[20px]">
          PAQIC Audit Form
        </div>
        <div className="flex justify-center text-white gap-[20px] my-[10px] text-[17.5px]">
          <label htmlFor="subjectCoordinator" className="opacity-90">
            Choose Subject Coordinator :
          </label>
          <select
            id="subjectCoordinator"
            name="subjectCoordinator"
            value={selectedCoordinator}
            onChange={handleCoordinatorChange}
            className="bg-gray-600 px-[30px] rounded-md"
          >
            {list2.map((coordinator, index) => (
              <option key={index} value={coordinator}>
                {coordinator}
              </option>
            ))}
          </select>
        </div>
        <div className="mx-[50px]">
          <form className="">
            <div className="mx-[10px]">
              <div className="bg-[#2a364c] shadow-lg rounded-lg py-[5px] mx-[20px]">
                {list.map((a, index) => {
                  return (
                    <>
                      <div className="text-white py-[5px] ">
                        <Attributes
                          key={index}
                          value={a}
                          fin={list}
                          index={index}
                          final_obj={final_obj}
                          list2={list2}
                          n={n}
                          remarkHandler={remarkHandler}
                        />
                      </div>
                    </>
                  );
                })}
                <div className="mt-[10px] text-gray-200 font-bold">
                  <div className="flex flex-col bg-gradient-to-l from-[#2b3650] to-[#2a364c] px-[10px] border border-gray-600 rounded-md shadow-md py-[5px] ">
                    <label className="flex gap-[30px]">
                      <div className="text-[18px]">
                        Action taken on previous academic audit<br></br>
                        observations/suggestions{" "}
                      </div>
                      <span>
                        <input
                          type="text"
                          className="w-[500px] h-[50px] bg-gray-600 text-white rounded-[3px] ml-[120px] pl-[5px] text-[18px]"
                          name="previous"
                          value={formData.previous}
                          onChange={handleChange}
                        />
                      </span>
                    </label>

                    <div className="bg-gray-500 w-[1335px] h-[0.5px] mt-[2px]"></div>

                    <label className="flex gap-[30px] mt-[5px]">
                      <div className="text-[18px]">Suggestions: </div>
                      <span>
                        <input
                          type="text"
                          className="w-[500px] h-[50px] bg-gray-600 text-white rounded-[3px] ml-[358px] pl-[5px] text-[18px]"
                          name="suggestions"
                          value={formData.suggestions}
                          onChange={handleChange}
                        />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-[30px]">
              <button onClick={submitHandler} className="text-2xl font-bold text-gray-300 border px-[60px] py-[5px] rounded-lg bg-green-600 hover:opacity-85 transition-all duration-150">Submit</button>
            </div>
            {/* <div>
          <button onClick={goHome}>Home</button>
        </div> */}
          </form>
        </div>

        {/* <Modal isOpen={modalIsOpen}>
                Form Submitted SuccessFully!!
            </Modal> */}
      </div>
    </div>
  );
};

export default FormComponent;