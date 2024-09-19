import { useEffect, useState } from "react";
import LogoBar from "../LogoBar/LogoBar";
import SideBar from "../LogoBar/sideBar";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

// import { MailToTeachers, SelectAuditor } from "../controllers/input";

export default function MailFunc({role}) {
  const [test, setTest] = useState(
    JSON.parse(localStorage.getItem("test")) || []
  );

  const toast = useToast();

  const [tdetails, settdetails] = useState();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("details"));
    settdetails(data);
  }, [settdetails])

  useEffect(() => {
    // Fetch data only if 'test' state is empty
    if (test.length === 0) {
      axios
        .get("http://localhost:8000/mail/selectauditorandmail")
        .then((res) => {
          setTest(res.data);
          
        })
        .catch((err) => {
          toast({
          title: `Failed! Try again`,
          status: "error",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
        return ;
        
        });
    }
  }, [test]);

  // Save 'test' state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("test", JSON.stringify(test));
  }, [test]);

  const handleSubmit = async () => {
      // axios
      //   .post("http://localhost:8000/mail/auditorsave", test)
      //   .then((res) => {
      //     console.log("Sent data to backend for saving");
      //   })
      //   .catch((err) => {
      //     console.error("Error in sending request for saving", err);
      //   });
      try {
        // Make the POST request
        
        const postResponse = await axios.post("http://localhost:8000/mail/auditorsave", test);
        // Process postResponse if needed
      } catch (error) {
        toast({
          title: `Failed to allot auditors! Try again`,
          status: "error",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
        return ;
      }
    
      try {
        // Make the GET request
        const getResponse = await axios.get("http://localhost:8000/mail/auditormail");
        toast({
          title: `Emails send to auditors with form link`,
          status: "success",
          duration: 5000,
            position:"top",
          isClosable: true,
        })

        // Process getResponse if needed
      } catch (error) {
        toast({
          title: `Cannot send emails to auditors! Try again`,
          status: "error",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
        return ;
      }
  };

  const handleAuditorChange = (index, newValue) => {
    setTest((prevTest) => {
      const updatedTest = [...prevTest];
      updatedTest[index] = { ...updatedTest[index], auditor: newValue };
      return updatedTest;
    });
  };

  useEffect(() => {
    console.log(test); // Log the updated state
  }, [test]); // Run this effect whenever 'test' state changes

  return (
    <div className="flex flex-col fixed">
      <LogoBar teacherDetails= {tdetails}/>

      <div className="flex ">
        <SideBar role={role}/>

        <div className="body ml-[180px] mt-[100px] w-[calc(100vw-180px)] max-w-[calc(100vw-180px)] overflow-hidden text-gray-200">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#2a364c] max-w-[calc(100vw-180px)] h-[calc(100vh-100px)] flex justify-center items-center overflow-hidden">
            <div className="bg-gradient-to-bl from-[#0f172a] to-[#2a364c] h-[500px] w-[900px]  shadow-lg border-2 border-transparent rounded-xl ">
              <div className="flex justify-center mt-3 text-3xl font-bold">
                Select Auditors
              </div>
              <br />
              <hr />

              <div className="pl-[20px]">
                <h1 className="font-bold text-lg mb-3">Instructions :- </h1>
                <div>1. We have selected auditors for you !!</div>
                <div>
                  2. You can edit the selected auditors according to your choice
                </div>
                <div>
                  3. All the auditors would recieve the mail accordingly
                </div>
                <div className="text-red-700">
                  4. Upon submitting, Changes could not be reverted
                </div>
              </div>
              <hr />

              <h1 className="font-bold text-lg mb-3 pl-[20px]">Auditors :- </h1>
              <div className="mt-[20px] overflow-y-scroll pl-[20px] border-1 border-gray-500  flex flex-col gap-y-[20px] max-h-[230px]">
                {test.map((a, index) => {
                  const l1 = [...new Set([test[index].auditor, ...a.teachers])];
                  // Include auditor and teachers, removing duplicates using Set
                  return (
                    <div key={index}>


                      <div className="font-medium text-lg  flex gap-[50px]">
                        <div className=" w-[100px]">
                          {a.sub}:

                        </div>
                        <div>
                          <select
                            onChange={(e) =>
                              handleAuditorChange(index, e.target.value)
                            }
                            value={a.auditor}
                            className="w-[300px] bg-gray-700"
                          >
                            {l1.map((a3, i) => (
                              <option key={i} value={a3}>
                                {a3}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>


                    </div>
                  );
                })}
                <div>
                  <button onClick={handleSubmit} className="bg-green-400 hover:opacity-70 transition-all duration-150 w-[100px] h-[30px] rounded-lg text-gray-800 mb-3"> Submit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f172a] to-[#2a364c] w-[calc(98.93vw-180px)] h-[100vh] text-white">
            {" "}
          </div>
        </div>
      </div>
    </div>

  );
}
