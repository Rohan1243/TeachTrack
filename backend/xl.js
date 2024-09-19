const express = require('express');
const xl = require('exceljs');
var fs = require('fs');

const app = express();

const data  =[
  { Attributes: [ '', '', '', '', '' ], remark: '' },
  {
    'Vision Mission Pos': [ 'yes', 'yes', 'yes', 'yes', 'yes' ],
    remark: ''
  },
  { 'Personal TimeTable': [ 'yes', '', 'no', '', '' ], remark: '' },
  { 'Class TimeTable': [ 'Class TimeTable', '', '', '', '' ], remark: '' },
  {
    'University Syallbus and structure': [ 'University Syallbus and structure', '', '', '', '' ],
    remark: ''
  },
  { 'TH Course Plan': [ 'TH Course Plan', '', '', '', '' ], remark: '' },
  {
    'TH Articulation Matrix Justification': [ 'TH Articulation Matrix Justification', '', '', '', '' ],
    remark: ''
  },
  { 'PR Course Plan': [ 'PR Course Plan', '', '', '', '' ], remark: '' },
  {
    'PR Articulation Matrix Justification': [ 'PR Articulation Matrix Justification', '', '', '', '' ],
    remark: ''
  },
  { 'List of Lab Expt': [ 'List of Lab Expt', '', '', '', '' ], remark: '' },
  { 'Schedule of Lab Expt': [ 'Schedule of Lab Expt', '', '', '', '' ], remark: '' },
  { 'List of Lab Manual': [ 'List of Lab Manual', '', '', '', '' ], remark: '' },
  { 'Theory Attendence Record': [ 'Theory Attendence Record', '', '', '', '' ], remark: '' },
  { 'Lab Assessment Record': [ 'Lab Assessment Record', '', '', '', '' ], remark: '' },
  {
    'UT Question Papers & Solutions With Marking Scheme': [ 'UT Question Papers', '', '', '', '' ],
    remark: ''
  },
  {
    'UT MarkSheet & Sample answer sheets': [ 'UT MarkSheet', '', '', '', '' ],
    remark: ''
  },
  { 'University Question Paper': [ 'University Question Paper', '', '', '', '' ], remark: '' },
  {
    'Remedial assignment samples of defaulters': [ 'Remedial assignment', '', '', '', '' ],
    remark: ''
  },
  { 'Remedial Sessions Record': [ 'Remedial Sessions Record', '', '', '', '' ], remark: '' },
  { 'ITL method practised': [ 'ITL method ', '', '', '', '' ], remark: '' },
  { 'E - content': [ 'E - content', '', '', '', '' ], remark: '' },
  { 'Industry Expert Session': [ 'Industry Expert Session', '', '', '', '' ], remark: '' },
  { 'Topic Beyond Syallbus': [ 'Topic Beyond Syallbus', '', '', '', '' ], remark: '' },
  {
    'CO attainment calculations for IA': [ 'CO attainment calculations for IA', '', '', '', '' ],
    remark: ''
  },
  { 'Course Coordinator Report': [ 'Course Coordinator Report', '', '', '', '' ], remark: '' },
  { Feedback: [ 'Feedback', '', '', '', '' ], remark: 'remark' },
  { previous: '', suggestions: '' },
  { subcoordinator: 'Mr. S. D. Shelke' },
  {
    'LP-V': [
      'Mrs. S. R. Hiray',
      'Mrs. A. S. Kadam',
      'Mr. S. D. Shelke',
      'Mrs. D. P. Salapurkar',
      'Mr. N. V. Buradkar'
    ]
  }
]


const auditor = "xyz"
function getExcelData(auditor, res){
  try{

    let workbook = new xl.Workbook();
    const sheet = workbook.addWorksheet("PAQIC_Audit");

  

    sheet.columns = [
      {header: "Sr No", key : "srno", width : "25"},
      {header: "Course code wise", key : "ccw", width : "25"},
      {header: "Evaluator Name", key : "en", width : "25"},
      {header: "Faculty name course wise", key : "fncw", width : "25"},
      {header: "Course coordinator", key : "subcoordinator", width : "25"},
      {header: "Vision, Mission, Pos, PEOs", key : "VisionMissionPos", width : "25"},
      {header: "Personal TT", key : "PersonalTimeTable", width : "25"},
      {header: "Class TT (CCs & course with Tut)", key : "ClassTimeTable", width : "25"},
      {header: "University Syllabus & Structure", key : "Usas", width : "25"},
      {header: "TH Course Plan", key : "ThCoursePlan", width : "25"},
      {header: "TH Articulation Matrix Justification", key : "THArticulationMatrixJustification", width : "25"},
      {header: "PR Course Plan", key : "PRCoursePlan", width : "25"},
      {header: "PR Articulation Matrix Justification", key : "PRArticulationMatrixJustification", width : "25"},
      {header: "List of Lab Expt", key : "ListofLabExpt", width : "25"},
      {header: "Schedule of Lab Expt", key : "ScheduleofLabExpt", width : "25"},
      {header: "List of Lab Manual", key : "ListofLabManual", width : "25"},
      {header: "Theory Attendence Record", key : "TheoryAttendenceRecord", width : "25"},
      {header: "Lab Assessment Record", key : "LabAssessmentRecord", width : "25"},
      {header: "UT Question Papers & Solutions With Marking Scheme", key : "utqp", width : "25"},
      {header: "Remedial assignment samples of defaulters", key : "ras", width : "25"},
      {header: "UT MarkSheet & Sample answer sheets", key : "Utm", width : "25"},
      {header: "Remedial Sessions Record", key : "RemedialSessionsRecord", width : "25"},
      {header: "ITL method practised", key : "ITL", width : "25"},
      {header: "E - content", key : "Econtent", width : "25"},
      {header: "Industry Expert Session", key : "IndustryExpertSession", width : "25"},
      {header: "Topic Beyond Syallbus", key : "TopicBeyondSyallbus", width : "25"},
      {header: "CO attainment calculations for IA", key : "CO", width : "25"},
      {header: "Course Coordinator Report", key : "CourseCoordinatorReport", width : "25"},
      {header: "Feedback", key : "Feedback", width : "25"},
      {header: "Remark Observations by Auditor", key : "Remark", width : "25"},
      
    ]

    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFA500' } // Orange background color (ARGB format)
      };
      cell.font = { bold: true }; // Make text bold
    });
    sheet.addRow();
    sheet.addRow({
      srno:1,
      ccw: Object.keys(data[28])[0],
      en:auditor,
      fncw:data[28][Object.keys(data[28])[0]][0],
      subcoordinator:data[27].subcoordinator,
      VisionMissionPos:data[1][Object.keys(data[1])[0]][0],
      PersonalTimeTable:data[2][Object.keys(data[2])[0]][0],
      ClassTimeTable:data[3][Object.keys(data[3])[0]][0],
      Usas:data[4][Object.keys(data[4])[0]][0],
      ThCoursePlan:data[5][Object.keys(data[5])[0]][0],
      THArticulationMatrixJustification:data[6][Object.keys(data[6])[0]][0],
      PRCoursePlan:data[7][Object.keys(data[7])[0]][0],
      PRArticulationMatrixJustification:data[8][Object.keys(data[8])[0]][0],
      ListofLabExpt:data[9][Object.keys(data[9])[0]][0],
      ScheduleofLabExpt:data[10][Object.keys(data[10])[0]][0],
      ListofLabManual:data[11][Object.keys(data[11])[0]][0],
      TheoryAttendenceRecord:data[12][Object.keys(data[12])[0]][0],
      LabAssessmentRecord:data[13][Object.keys(data[13])[0]][0],
      utqp:data[16][Object.keys(data[16])[0]][0],
      ras:data[17][Object.keys(data[17])[0]][0],
      Utm:data[15][Object.keys(data[15])[0]][0],
      RemedialSessionsRecord:data[18][Object.keys(data[18])[0]][0],
      ITL:data[19][Object.keys(data[19])[0]][0],
      Econtent:data[20][Object.keys(data[20])[0]][0],
      IndustryExpertSession:data[21][Object.keys(data[21])[0]][0],
      TopicBeyondSyallbus:data[22][Object.keys(data[22])[0]][0],
      CO:data[23][Object.keys(data[23])[0]][0],
      CourseCoordinatorReport:data[24][Object.keys(data[24])[0]][0],
      Feedback:data[25][Object.keys(data[25])[0]][0],
      Remark:data[25][Object.keys(data[25])[1]],
    })

    for(let i=1; i<data[28][Object.keys(data[28])[0]].length; i++){
      sheet.addRow({
        fncw:data[28][Object.keys(data[28])[0]][i],
        VisionMissionPos:data[1][Object.keys(data[1])[0]][i],
        PersonalTimeTable:data[2][Object.keys(data[2])[0]][i],
        ClassTimeTable:data[3][Object.keys(data[3])[0]][i],
        Usas:data[4][Object.keys(data[4])[0]][i],
        ThCoursePlan:data[5][Object.keys(data[5])[0]][i],
        THArticulationMatrixJustification:data[6][Object.keys(data[6])[0]][i],
        PRCoursePlan:data[7][Object.keys(data[7])[0]][i],
        PRArticulationMatrixJustification:data[8][Object.keys(data[8])[0]][i],
        ListofLabExpt:data[9][Object.keys(data[9])[0]][i],
        ScheduleofLabExpt:data[10][Object.keys(data[10])[0]][i],
        ListofLabManual:data[11][Object.keys(data[11])[0]][i],
        TheoryAttendenceRecord:data[12][Object.keys(data[12])[0]][i],
        LabAssessmentRecord:data[13][Object.keys(data[13])[0]][i],
        utqp:data[16][Object.keys(data[16])[0]][i],
        ras:data[17][Object.keys(data[17])[0]][i],
        Utm:data[15][Object.keys(data[15])[0]][i],
        RemedialSessionsRecord:data[18][Object.keys(data[18])[0]][i],
        ITL:data[19][Object.keys(data[19])[0]][i],
        Econtent:data[20][Object.keys(data[20])[0]][i],
        IndustryExpertSession:data[21][Object.keys(data[21])[0]][i],
        TopicBeyondSyallbus:data[22][Object.keys(data[22])[0]][i],
        CO:data[23][Object.keys(data[23])[0]][i],
        CourseCoordinatorReport:data[24][Object.keys(data[24])[0]][i],
        Feedback:data[25][Object.keys(data[25])[0]][i],
      })
      
    }
    
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment;filename=" + "PAQIC_Audit.xlsx"
    )
    
    workbook.xlsx.write(res);


  }catch(e){
    console.log(e);
  }
};
app.get('/', async (req, res) => {
  getExcelData(auditor, res);
})

app.listen(3000, () => {
  console.log("Port started on 3000");
})