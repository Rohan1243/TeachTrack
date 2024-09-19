import React, { useEffect, useState } from "react";
import TeacherComponent from "./teacher";

function Attributes({ value, fin, index, final_obj, list2, n, remarkHandler }) {
  // var teachers_names = list2;
  // console.log(list2);

  const [obj, setObj] = useState({
    title: "",
    ll: [],
  });

  function handleYes(a, val, indexf) {
    const udpatil = [...patil];
    udpatil[a] = val;

    setObj((prevState) => ({
      ...prevState,
      title: fin[index],
      ll: udpatil, // Assuming patil is supposed to be the new value for ll
    }));

    final_obj[indexf][value] = udpatil;

    setPatil(udpatil);
  }

  function handleNo(a, val, indexf) {
    const udpatil = [...patil];
    udpatil[a] = val;

    setObj((prevState) => ({
      ...prevState,
      title: fin[index],
      ll: udpatil, // Assuming patil is supposed to be the new value for ll
    }));
    final_obj[indexf][value] = udpatil;
    setPatil(udpatil);
  }

  useEffect(() => {
    // console.log(obj); // Log the updated state
    // console.log(final_obj)
    // console.log(list2)
  }, [obj]);

  const [patil, setPatil] = useState(new Array(n).fill(""));

  return (
    <div className="flex mx-[20px]">
      <div className="min-w-[450px] font-bold">{value}</div>
      <div className="flex gap-[10px] bg-[#2a364c] border border-[#13163b] rounded-md shadow shadow-[#13163b] ">
        {list2.map((name, b) => {
          return (
            <TeacherComponent
              value={value}
              index={b}
              patil={patil}
              handleYes={handleYes}
              handleNo={handleNo}
              indexf={index}
              name={name}
              list2={list2}
            />
          );
        })}
        <div className="">
          {index != 0 ? (
            <div className="">
              <div className="flex gap-[15px] opacity-90 bg-red-00 px-[10px] justify-center items-center my-[5px]">
                <label>Remark: </label>
                <input type="text" placeholder="NA" className="pl-[5px] bg-gray-600 text-white rounded-[3px] border" name="remark" onChange={(e) => remarkHandler(e.target.name, e.target.value, index)} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attributes;
