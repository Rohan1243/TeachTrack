import React from "react";

const TeacherComponent = ({
  value,
  index,
  patil,
  handleYes,
  handleNo,
  indexf,
  name,
  list2,
}) => {
  return (
    <div className="flex flex-row gap-[15px] justify-center py-[5px]">
      {indexf ? (
        <>
          <div className="flex min-w-[180px] justify-center gap-[20px] text-gray-200">
            <div className="flex gap-[4px]">
              <input
                type="radio"
                name={`teacher${value}${index}`}
                // value="yes"
                onChange={(e) => handleYes(index, "yes", indexf)}
              />
              <label>Yes</label>
            </div>
            <div className="flex gap-[4px]">
              <input
                type="radio"
                name={`teacher${value}${index}`}
                // value="no"
                onChange={(e) => handleNo(index, "no", indexf)}
              />
              <label>No</label>
            </div>
          </div>
        </>
      ) : (
        <>
          {
            <div className="flex min-w-[180px] justify-center gap-[20px] text-gray-300 font-bold">
              {list2[index]}
            </div>
          }
        </>
      )}
    </div>
  );
};

export default TeacherComponent;
