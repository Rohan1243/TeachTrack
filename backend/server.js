import Express from "express";
import sql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import xl from "exceljs";
import fs from "fs";
import crypto from "crypto";

dotenv.config();
const app = Express();

app.use(Express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
// app.use(bodyParser.json());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const db = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "Huk33998",
  database: "paqic_db",
});

const auth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.json({ Error: "You are not Authenticated" });
    } else {
      jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
          return res.json({ Error: "Token is not correct" });
        } else {
          req.name = decoded.name;
          req.role = decoded.role;
          next();
        }
      });
    }
  } catch (e) {
    return res.status(400);
  }
};

let middleroute = "";

const isCoord = (req, res, next) => {
  try {
    if (req.role == "coordinator") {
      // return res.status(401).json({
      //     success:false,
      //     message:"This is Protected route to Coordinator ! Please Leave"
      // })
      middleroute = "/coordinator";
    } else if (req.role == "teacher") {
      // return res.status(401).json({
      //     success:false,
      //     message:"This is Protected route to Coordinator ! Please Leave"
      // })
      middleroute = "/teacher";
    } else if (req.role == "auditor") {
      // return res.status(401).json({
      //     success:false,
      //     message:"This is Protected route to Coordinator ! Please Leave"
      // })
      middleroute = "/auditor";
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User Role not matching is different from defined role",
    });
  }
};

app.post("/login", (req, res) => {
  try {
    db.query(
      "SELECT * FROM login WHERE email=?",
      [req.body.email],
      (err, result) => {
        if (err)
          return res.status(417).json({ Error: "Login Error in server" });

        if (result.length > 0) {
          bycrypt.compare(
            req.body.password.toString(),
            result[0].password,
            (error, response) => {
              if (error) return res.json({ Error: "Password Compare Error" });
              if (response) {
                db.query(
                  "SELECT role FROM id WHERE secret_key = ?",
                  [result[0].secret_key],
                  (err, rlt) => {
                    if (err)
                      return res.json({ Error: "Error in  Finding Role" });

                    if (rlt.length > 0) {
                      const payload = {
                        name: result[0].name,
                        role: rlt[0].role,
                        key: result[0].secret_key,
                      };

                      const token = jwt.sign(payload, "jwt-secret-key", {
                        expiresIn: 30 * 24 * 60 * 60 * 1000,
                      });
                      res.cookie("token", token);

                      return res.status(200).json({ Status: "Success" });
                    } else {
                      return res.json({ Error: "Role is Missing" });
                    }
                  }
                );
              } else {
                return res.json({ Error: "Password Invalid" });
              }
            }
          );
        } else {
          return res.json({ Error: "Email Does Not Exist" });
        }
      }
    );
  } catch (e) {
    return res.status(400);
  }
});

app.get("/home", auth, isCoord, (req, res) => {
  try {
    if (middleroute === "/coordinator") {
      res.send("coordinator");
    } else if (middleroute === "/teacher") {
      res.send("teacher");
    } else if (middleroute === "/auditor") {
      res.send("auditor");
    } else {
      res.status(403).send("Unauthorized");
    }
  } catch (e) {
    return res.status(400);
  }
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({ Status: "Success" });
  } catch (e) {
    return res.status(400);
  }
});

app.post("/inputs/timetable", async (req, res) => {
  const subjectTeacherMap = req.body;

  try {
    for (const subjectCode in subjectTeacherMap) {
      const teachers = subjectTeacherMap[subjectCode];

      // 1. Retrieve the subject_id for the subject_code
      const getSubjectId = () => {
        return new Promise((resolve, reject) => {
          const subjectQuery =
            "SELECT subject_id FROM subject_code WHERE subject_name = ?";
          db.query(subjectQuery, [subjectCode], (error, subjectRows) => {
            if (error) {
              reject(error);
            } else {
              resolve(subjectRows);
            }
          });
        });
      };

      const subjectRows = await getSubjectId();
      if (!subjectRows || subjectRows.length === 0) {
        console.error(`Subject code ${subjectCode} not found.`);
        continue; // Skip to the next subject
      }

      const subjectId = subjectRows[0].subject_id;

      // 2. Insert mapping between subject and teacher into the subject_teacher table
      for (const teacherName of teachers) {
        // Retrieve the secret_key for the teacher from the teacher_details table
        const getSecretKey = () => {
          return new Promise((resolve, reject) => {
            const teacherQuery =
              "SELECT secret_key FROM teacher_details WHERE name = ? LIMIT 1";
            db.query(teacherQuery, [teacherName], (error, teacherRows) => {
              if (error) {
                reject(error);
              } else {
                resolve(teacherRows);
              }
            });
          });
        };

        const teacherRows = await getSecretKey();
        if (!teacherRows || teacherRows.length === 0) {
          console.error(`Teacher ${teacherName} not found.`);
          continue; // Skip to the next teacher
        }

        const secretKey = teacherRows[0].secret_key;

        // Insert mapping between subject and teacher into the subject_teacher table
        const insertMapping = () => {
          return new Promise((resolve, reject) => {
            const insertMappingQuery =
              "INSERT INTO subject_teacher (secret_key,subject_id,subject_status) VALUES (?, ?, 1)";
            db.query(
              insertMappingQuery,
              [secretKey, subjectId],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        };

        await insertMapping();

        console.log(
          `Inserted teacher ${teacherName} for subject ${subjectCode}`
        );
      }
    }

    res.json({ message: "Teacher details inserted successfully" });
  } catch (error) {
    console.error("Error inserting teacher details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const generateRandomKey = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 6; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  try {
    // Check if the generated key already exists in the database
    const query =
      "SELECT secret_key FROM teacher_details WHERE secret_key = ? LIMIT 1";
    const [result] = await new Promise((resolve, reject) => {
      db.query(query, [key], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // If result is not empty, the key is already assigned, generate a new one
    if (result && result.length > 0) {
      return generateRandomKey(); // Generate a new key recursively
    }

    return key;
  } catch (error) {
    console.error("Error generating random key:", error);

    throw error;
  }
};

app.post("/inputs/teacherDetails", async (req, res) => {
  const td = req.body;
  console.log(td);
  try {
    for (const teacher of td) {
      console.log(teacher)
      // Check if teacher with the same name and email already exists
      const existingTeacherQuery =
        "SELECT * FROM teacher_details WHERE name = ? AND email = ? LIMIT 1";
      const [existingTeacherRows] = await new Promise((resolve, reject) => {
        db.query(
          existingTeacherQuery,
          [teacher.name, teacher.email],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      if (!existingTeacherRows || existingTeacherRows.length === 0) {
        // No existing teacher found, proceed with insertion

        // Generate a random secret key
        const secretKey = await generateRandomKey();

        // Insert teacher details into the database
        const insertQuery =
          "INSERT INTO teacher_details (secret_key, name, email, phone) VALUES (?, ?, ?, ?)";
        db.query(
          insertQuery,
          [secretKey, teacher.name, teacher.email, teacher.phone],
          (error, results) => {
            if (error) {
              console.error("Error inserting teacher details:", error);
            } else {
              console.log("Inserted teacher:", teacher.name);

            }
          }
        );
        const query =
          "INSERT INTO id (secret_key, role, subject_id) VALUES(?, 'teacher', 0)";
        db.query(query, [secretKey], (error, results) => {
          if (error) {
            console.error("Error inserting id:", error);
          } else {
            console.log("Inserted in ID Table");
          }
        });
      } else {
        console.log(
          `Teacher ${teacher.name} with email ${teacher.email} already exists.`
        );
      }
    }

    // res.json({ message: "Teacher details inserted successfully" });
    return res.status(200).json({ data: "success" });
  } catch (error) {
    // console.error("Error inserting teacher details:", error);
    return res.status(500).json({ data: "failed" });
  }
});

app.post("/inputs/pastExperienceInput", async (req, res) => {
  const subjectTeacherMap = req.body;
  console.log(subjectTeacherMap)

  try {
    for (const subjectCode in subjectTeacherMap) {
      const teachers = subjectTeacherMap[subjectCode];
      console.log(teachers)
      // 1. Retrieve the subject_id for the subject_code
      const getSubjectId = () => {
        return new Promise((resolve, reject) => {
          const subjectQuery =
            "SELECT subject_id FROM subject_code WHERE subject_name = ?";
          db.query(subjectQuery, [subjectCode], (error, subjectRows) => {
            if (error) {
              reject(error);
            } else {
              resolve(subjectRows);
            }
          });
        });
      };

      const subjectRows = await getSubjectId();
      if (!subjectRows || subjectRows.length === 0) {
        console.error(`Subject code ${subjectCode} not found.`);
        continue; // Skip to the next subject
      }

      const subjectId = subjectRows[0].subject_id;

      // 2. Insert mapping between subject and teacher into the subject_teacher table
      for (const teacherName of teachers) {
        // Retrieve the secret_key for the teacher from the teacher_details table
        const getSecretKey = () => {
          return new Promise((resolve, reject) => {
            const teacherQuery =
              "SELECT secret_key FROM teacher_details WHERE name = ? LIMIT 1";
            db.query(teacherQuery, [teacherName], (error, teacherRows) => {
              if (error) {
                reject(error);
              } else {
                resolve(teacherRows);
              }
            });
          });
        };

        const teacherRows = await getSecretKey();
        if (!teacherRows || teacherRows.length === 0) {
          console.error(`Teacher ${teacherName} not found.`);
          continue; // Skip to the next teacher
        }

        const secretKey = teacherRows[0].secret_key;

        // Insert mapping between subject and teacher into the subject_teacher table
        const insertMapping = () => {
          return new Promise((resolve, reject) => {
            const insertMappingQuery =
              "INSERT INTO subject_teacher (secret_key,subject_id,subject_status) VALUES (?, ?, 0)";
            db.query(
              insertMappingQuery,
              [secretKey, subjectId],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        };

        await insertMapping();

        console.log(
          `Inserted teacher ${teacherName} for subject ${subjectCode}`
        );
      }
    }

    res.json({ data: "success" });
  } catch (error) {
    // console.error("Error inserting teacher details:", error);
    res.status(500).json({ data: "failed" });
  }
});

function verifyToken(req, res, next) {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization;
    if (!token) {
      return reject({ status: 403, message: "Token is required" });
    }

    try {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        "jwt-secret-key"
      );
      req.user = decoded;
      resolve();
    } catch (error) {
      reject({ status: 401, message: "Invalid token" });
    }
  });
}

app.get("/teacher-details", async (req, res) => {
  try {
    await verifyToken(req, res);
    // Check if user is authenticated
    if (!req.user) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    // Fetch teacher details from the database using the user's token information
    const teacherDetails = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM teacher_details WHERE secret_key = ?";
      db.query(query, [req.user.key], (error, rows) => {
        if (error) {
          reject({ status: 500, message: "Internal server error" });
        } else if (rows.length === 0) {
          reject({ status: 404, message: "Teacher details not found" });
        } else {
          resolve(rows[0]);
        }
      });
    });

    res.json({ teacher: teacherDetails });
  } catch (error) {
    // console.error('Error fetching teacher details:', error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  secure: "false",
  auth: {
    user: "vedantrajanikantlatthe@gmail.com",
    pass: "reju wlhb iivs orbj",
  },
});

async function sendMailtoallauditors(subject, email) {
  const mailoptions = {
    from: "<vedantrajanikantlatthe@gmail.com>",
    to: `${email}`,
    subject: "Auditor Mail",
    html: `Hi,\nThis is the mail from PAQIC Autid department.\nYou are Selected as an Auditor for subject: ${subject}\n\nLink for Audit form: http://localhost:3000/auditor/form`,
  };
  try {
    await transporter.sendMail(mailoptions);
    console.log("Email Sent");
  } catch (e) {
    console.error(e);
  }
}
// Select auditor and send to frontend
app.get("/mail/selectauditorandmail", (req, res) => {
  try {
    const query =
      "SELECT subject_id, (SELECT secret_key FROM subject_teacher AS st_inner WHERE st_inner.subject_id = st_outer.subject_id AND st_inner.subject_status = 0 ORDER BY RAND() LIMIT 1) AS secret_key FROM subject_teacher AS st_outer WHERE subject_status = 0 GROUP BY subject_id;";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      const listf = [];

      if (results.length > 0) {
        results.forEach((result) => {
          const subQuery = `SELECT subject_code.subject_name, teacher_details.name, teacher_details.secret_key FROM subject_code INNER JOIN subject_teacher ON subject_code.subject_id = subject_teacher.subject_id INNER JOIN teacher_details ON subject_teacher.secret_key = teacher_details.secret_key WHERE subject_teacher.subject_status = 0 AND subject_code.subject_id = ${result.subject_id}`;

          db.query(subQuery, (err, rlt) => {
            if (err) {
              console.error("Error executing sub-query: " + err.stack);
              return;
            }

            if (rlt.length > 0) {
              const obj = {
                sub: rlt[0].subject_name,
                auditor: "",
                teachers: [],
              };

              rlt.forEach((item) => {
                obj.teachers.push(item.name);
                if (item.secret_key === result.secret_key) {
                  obj.auditor = item.name;
                }
              });

              listf.push(obj);
            }

            // Check if all queries have been processed before sending response
            if (listf.length === results.length) {
              // console.log(listf);
              res.json(listf);
            }
          });
        });
      } else {
        console.log("No results found.");
        res.json([]);
      }
    });
  } catch (e) {
    return res.status(400);
  }
});

// Save auditor in database
app.post("/mail/auditorsave", (req, res) => {
  const data = req.body;

  // Use Promise.all to ensure all queries are executed before sending a response
  try {
    Promise.all(
      data.map((item) => {
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT subject_code.subject_id, teacher_details.secret_key FROM subject_code INNER JOIN subject_teacher ON subject_code.subject_id = subject_teacher.subject_id INNER JOIN teacher_details ON subject_teacher.secret_key = teacher_details.secret_key WHERE subject_code.subject_name = '${item.sub}' AND teacher_details.name = '${item.auditor}'`,
            (err, rlt) => {
              if (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
              } else {
                if (rlt.length > 0) {
                  const subjectId = rlt[0].subject_id;
                  const secretKey = rlt[0].secret_key;

                  // Check if subject_id is already present in the id table for the secret_key
                  db.query(
                    `SELECT subject_id FROM id WHERE secret_key = '${secretKey}'`,
                    (err1, rlt1) => {
                      if (err1) {
                        console.error(err1);
                        reject(err1); // Reject the promise if there's an error
                      } else {
                        if (rlt1.length > 0 && rlt1[0].subject_id == 0) {
                          // Update the existing record in the id table
                          db.query(
                            `UPDATE id SET subject_id = ${subjectId}, role = 'auditor' WHERE secret_key = '${secretKey}'`,
                            (err2, rlt2) => {
                              if (err2) {
                                console.error(err2);
                                reject(err2); // Reject the promise if there's an error
                              } else {
                                resolve(); // Resolve the promise if the operation is successful
                              }
                            }
                          );
                        } else {
                          // Insert a new record into the id table
                          db.query(
                            `INSERT INTO id (secret_key, role, subject_id) VALUES (?, ?, ?)`,
                            [secretKey, "auditor", subjectId],
                            (err3, rlt3) => {
                              if (err3) {
                                console.error(err3);
                                reject(err3); // Reject the promise if there's an error
                              } else {
                                resolve(); // Resolve the promise if the operation is successful
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                } else {
                  console.log(
                    `No matching data found for subject ${item.sub} and auditor ${item.auditor}`
                  );
                  resolve(); // Resolve the promise if no matching data is found
                }
              }
            }
          );
        });
      })
    )
      .then(() => {
        res.status(200).send("Data processed successfully");
      })
      .catch((error) => {
        res.status(500).send("An error occurred while processing the data");
      });
  } catch (e) {
    return res.status(400);
  }
});

//mail all audoitors
app.get("/mail/auditormail", (req, res) => {
  try {
    db.query(
      "SELECT secret_key, subject_id FROM id WHERE role='auditor'",
      (error1, result1) => {
        if (error1) {
          console.error(error1);
          return res
            .status(500)
            .json({ message: "Error in fetching auditor data" });
        }
        if (result1.length > 0) {
          // Use Promise.all to wait for all asynchronous queries to complete
          Promise.all(
            result1.map((a1) => {
              return new Promise((resolve, reject) => {
                var mail;
                var subject;

                db.query(
                  `SELECT email FROM teacher_details WHERE secret_key='${a1.secret_key}'`,
                  (error2, result2) => {
                    if (error2) {
                      console.error(error2);
                      return reject({
                        message: "Error in fetching auditor data: secret_key",
                      });
                    }
                    if (result2.length > 0) {
                      mail = result2[0].email;
                    } else {
                      return reject({ message: "No mail" });
                    }

                    db.query(
                      `SELECT subject_name FROM subject_code WHERE subject_id='${a1.subject_id}'`,
                      (error3, result3) => {
                        if (error3) {
                          console.error(error3);
                          return reject({
                            message:
                              "Error in fetching auditor data: subject_id",
                          });
                        }
                        if (result3.length > 0) {
                          subject = result3[0].subject_name;
                        } else {
                          return reject({ message: "No subject" });
                        }

                        // Resolve the promise with the mail and subject
                        resolve({ mail, subject });
                      }
                    );
                  }
                );
              });
            })
          )
            .then((results) => {
              // Process the results after all promises have resolved
              results.forEach(({ mail, subject }) => {
                console.log(mail);
                console.log(subject);
                sendMailtoallauditors(subject, mail);
              });
              res.json({ message: "Mail sent to all auditors" });
            })
            .catch((error) => {
              console.error("Error:", error.message);
              return res
                .status(500)
                .json({ message: "Error in processing auditor data" });
            });
        } else {
          return res.status(500).json({ message: "No data" });
        }
      }
    );
  } catch (e) {
    return res.status(400);
  }
});

// signup automated

async function sendMailtoallteachers(email, password) {
  const mailoptions = {
    from: "<vedantrajanikantlatthe@gmail.com>",
    to: `${email}`,
    subject: "PAQIC Login Details",
    html: `Hi,\nThis is the mail from PAQIC Autid department.\nYour login Credentials are\nEmail:${email}\n\nPassword: ${password}`,
  };
  try {
    await transporter.sendMail(mailoptions);
    console.log("Email Sent");
  } catch (e) {
    console.error(e);
  }
}

async function sendtoforgotpass(email, secret_key) {
  const mailoptions = {
    from: "<vedantrajanikantlatthe@gmail.com>",
    to: `${email}`,
    subject: "PAQIC Login Details",
    html: `Hi,\nThis is the mail from PAQIC Autid department.\nYour secret_key for resetting password is\n\nSecret-Key:${secret_key}`,
  };
  try {
    await transporter.sendMail(mailoptions);
    console.log("Email Sent");
  } catch (e) {
    console.error(e);
  }
}

app.get("/signup", (req, res) => {
  const query = "SELECT secret_key, name, email FROM teacher_details ";
  try {
    db.query(query, (err, rlt) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching teacher details." });
      }

      if (rlt.length > 0) {
        const promises = rlt.map((item) => {
          return new Promise((resolve, reject) => {
            db.query(
              `SELECT count(secret_key) as count FROM login WHERE secret_key = '${item.secret_key}'`,
              (err1, rlt1) => {
                if (err1) {
                  console.error(err1);
                  return reject(
                    "An error occurred while checking login details."
                  );
                }
                if (!rlt1[0].count) {
                  const password = "pict123";
                  const email = item.email;
                  const sk = item.secret_key;
                  const name = item.name;

                  // Send email to teacher
                  sendMailtoallteachers(email, password)
                    .then(() => {
                      // Hash password
                      bycrypt.hash(password, 10, (err, hashed) => {
                        if (err) {
                          console.error(err);
                          return reject(
                            "An error occurred while hashing the password."
                          );
                        }
                        // Insert into login table
                        db.query(
                          "INSERT INTO login VALUES (?, ?, ?, ?)",
                          [sk, name, email, hashed],
                          (err2, rlt2) => {
                            if (err2) {
                              console.error(err2);
                              return reject(
                                "An error occurred while inserting into login table."
                              );
                            }
                            resolve();
                          }
                        );
                      });
                    })
                    .catch((error) => reject(error));
                } else {
                  resolve(); // Resolve if count is not 0
                }
              }
            );
          });
        });

        // Execute all promises
        Promise.all(promises)
          .then(() => {
            res
              .status(200)
              .json({ data: "success" });
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ data: "failed" });
          });
      } else {
        res.status(404).json({ data: "noteacher" });
      }
    });
  } catch (e) {
    return res.status(400);
  }
});

app.post("/getkeyforgotpass", (req, res) => {
  const email = req.body.value;
  try {
    db.query(
      `SELECT secret_key from teacher_details WHERE email = '${email}'`,
      (err, rlt) => {
        if (err) {
          console.error(err);
          return res.status(500);
        }

        try {
          // sendtoforgotpass(email, rlt[0].secret_key);
        } catch (err) {
          return res.status(500);
        }
      }
    );
  } catch (e) {
    return res.status(400);
  }
});

app.get("/form/data", (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      console.log("Token is Missing");
      return res.json({
        err: "You are not authenticated",
      });
    }

    jwt.verify(token, "jwt-secret-key", (error, decoded) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        const sk = decoded.key;
        const data = {};
        var sub = "";

        const subjectIdPromise = new Promise((resolve, reject) => {
          db.query(
            `SELECT subject_id FROM id WHERE secret_key ='${sk}' `,
            (err1, rlt1) => {
              if (err1) {
                console.error("ERROR 1");
                reject(err1);
              }
              if (rlt1.length > 0) {
                resolve(rlt1[0].subject_id);
              } else {
                console.log("No subject Mapped to auditor");
                reject("No subject Mapped to auditor");
              }
            }
          );
        });

        subjectIdPromise
          .then((subjectId) => {
            const teachersPromise = new Promise((resolve, reject) => {
              db.query(
                `SELECT name FROM teacher_details INNER JOIN subject_teacher ON teacher_details.secret_key = subject_teacher.secret_key WHERE subject_teacher.subject_id = ${subjectId} AND subject_status = 1`,
                (err2, rlt2) => {
                  if (err2) {
                    console.error(err2);
                    reject(err2);
                  }
                  if (rlt2.length > 0) {
                    const teachers = rlt2.map((a) => a.name);
                    resolve(teachers);
                  } else {
                    console.log("There are no teachers teaching this subject");
                    reject("There are no teachers teaching this subject");
                  }
                }
              );
            });

            const subjectNamePromise = new Promise((resolve, reject) => {
              db.query(
                `SELECT subject_name FROM subject_code WHERE subject_id = ${subjectId}`,
                (err3, rlt3) => {
                  if (err3) {
                    console.error(err3);
                    reject(err3);
                  }
                  if (rlt3.length > 0) {
                    resolve(rlt3[0].subject_name);
                  } else {
                    console.log("No subject Mapped to this code");
                    reject("No subject Mapped to this code");
                  }
                }
              );
            });

            return Promise.all([teachersPromise, subjectNamePromise]);
          })
          .then(([teachers, subjectName]) => {
            data.teacher = teachers;
            data.subject = subjectName;
            // console.log(data);
            res.json(data);
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
          });
      }
    });
  } catch (e) {
    return res.status(400);
  }
});

app.post("/formData/info", async (req, res) => {
  const data = req.body;

  const size = data.length;
  const sugg = data[size - 3].suggestions;

  const lastObject = data[size - 1];
  const [subjectName, teachers] = lastObject
    ? Object.entries(lastObject)[0]
    : [null, []];
  const final_teachers = JSON.stringify(teachers);

  // Helper function to execute queries as promises
  const query = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };

  try {
    // Check if the subject already exists in the database
    const existingSubjects = await query(
      "SELECT * FROM form_data WHERE course_name = ?",
      [subjectName]
    );

    if (existingSubjects.length > 0) {
      console.log("Subject already exists. Skipping or updating...");
      res.status(409).send("Subject already exists.");
      return;
    }

    // Subject does not exist, insert new record
    await query(
      "INSERT INTO form_data (course_name, suggestion, teacher_list) VALUES (?, ?, ?)",
      [subjectName, sugg, final_teachers]
    );

    // Check if the subject exists in xl_data table
    const existingXLData = await query(
      "SELECT * FROM xl_data WHERE course_name = ?",
      [subjectName]
    );

    if (existingXLData.length > 0) {
      console.log("Subject already exists in xl_data. Skipping or updating...");
      res.status(409).send("Subject already exists in xl_data.");
      return;
    }

    // Insert new record into xl_data table
    const string_data = JSON.stringify(data);
    await query("INSERT INTO xl_data (course_name, main_data) VALUES (?, ?)", [
      subjectName,
      string_data,
    ]);

    res.status(201).send("New record inserted successfully.");
  } catch (err) {
    console.error(err);``
    res.status(500).send("An error occurred");
  }
});

app.get("/fetchData/consolereport", (req, res) => {
  try {
    db.query("SELECT * FROM form_data", (err, rlt) => {
      if (err) console.error(err);
      console.log(rlt);
      res.json(rlt);
    });
  } catch (e) {
    return res.status(400);
  }
});

let verified_email;

app.post("/forgotpassword/verifyemail", (req, res) => {
  let recieved_email = Object.keys(req.body)[0];
  try {
    db.query(
      "SELECT * from teacher_details WHERE email = ?",
      [recieved_email],
      (err, rlt) => {
        if (err) {
          console.error(err);
          return;
        }
        if (rlt.length > 0) {
          verified_email = recieved_email;
          res.status(200).json({ data: "verified" });
        } else {
          res.status(400).json({ data: "failed" });
        }
      }
    );
  } catch (e) {
    return res.status(400);
  }
});

function generateNumericOTP() {
  const otpLength = 6;
  const max = Math.pow(10, otpLength);
  const min = max / 10;

  // Generate a random number within the range of 6-digit numbers
  const randomNumber = crypto.randomInt(min, max);

  return randomNumber.toString().padStart(otpLength, "0");
}

let otp = generateNumericOTP();

app.get("/forgotpassword/sentotp", async (req, res) => {
  const mailoptions = {
    from: "<vedantrajanikantlatthe@gmail.com>",
    to: `${verified_email}`,
    subject: "OTP to reset password",
    html: `Your OTP to reset password is ${otp}`,
  };
  try {
    await transporter.sendMail(mailoptions);
    res.status(200).json({ data: "success" });
  } catch (e) {
    console.error(e);
    res.status(200).json({ data: "failed" });
  }
});

app.post("/forgotpassword/veriftyotp", (req, res) => {
  try {
    let recieved_otp = Object.keys(req.body)[0];
    if (recieved_otp === otp) {
      res.status(200).json({ data: "verified" });
    } else {
      res.status(400).json({ data: "failed" });
    }
  } catch (e) {
    return res.status(400);
  }
});

app.put("/forgorpassword/changepass", (req, res) => {
  let recieved_password = Object.keys(req.body)[0];
  try {
    if (!verified_email || !recieved_password) {
      res.status(400).json({
        data: "failed",
      });
    }

    bycrypt.hash(recieved_password, 10, (err, hashed) => {
      if (err) {
        console.error(err);
        res.status(400).json({
          data: "failed",
        });
      }

      db.query(
        "UPDATE login SET password = ? WHERE email = ?",
        [hashed, verified_email],
        (err1, rlt) => {
          if (err1) {
            console.error(err1);
            res.status(400).json({
              data: "failed",
            });
          }
          return res.status(200).json({ data: "success" });
        }
      );
    });
  } catch (e) {
    return res.status(400);
  }
});

const auditorname = async (subject) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT name FROM teacher_details 
                   INNER JOIN id ON teacher_details.secret_key = id.secret_key  
                   INNER JOIN subject_code ON subject_code.subject_id = id.subject_id 
                   WHERE subject_code.subject_name = ?`;

    db.query(query, [subject], (err, rlt) => {
      if (err) {
        console.error(err);
        return resolve(""); // Return empty string on error
      }

      if (rlt.length > 0) {
        console.log(rlt[0].name);
        resolve(rlt[0].name); // Return the name if found
      } else {
        resolve(""); // Return empty string if no result
      }
    });
  });
};

function incrementIntegerInString(str) {
  // Use a regular expression to find the first integer in the string
  const regex = /(\d+)/;
  const match = str.match(regex);

  if (match) {
    // Extract the integer from the match
    const originalInteger = match[0];
    // Convert the integer to a number, increment it, and convert it back to a string
    const incrementedInteger = (parseInt(originalInteger, 10) + 1).toString();
    // Replace the original integer in the string with the incremented integer
    const result = str.replace(originalInteger, incrementedInteger);
    return result;
  } else {
    // If no integer is found, return the original string
    return str;
  }
}

app.get("/auditsheet", async (req, res) => {
  try {
    db.query("Select * from xl_data", async (err, rlt) => {
      // console.log(rlt);

      let workbook = new xl.Workbook();

      // const sheet = workbook.getWorksheet("PAQIC_Audit");
      if (rlt.length > 0) {
        let sheet = workbook.getWorksheet("PAQIC_Audit");
        if (sheet) {
          // main code
          let key;
          for (key in rlt) {
            let data = JSON.parse(rlt[key].main_data);
            let auditor = await auditorname(Object.keys(data[28])[0]);

            sheet.addRow({
              srno: incrementIntegerInString(key),
              ccw: Object.keys(data[28])[0],
              en: auditor,
              fncw: data[28][Object.keys(data[28])[0]][0],
              subcoordinator: data[27].subcoordinator,
              VisionMissionPos: data[1][Object.keys(data[1])[0]][0],
              PersonalTimeTable: data[2][Object.keys(data[2])[0]][0],
              ClassTimeTable: data[3][Object.keys(data[3])[0]][0],
              Usas: data[4][Object.keys(data[4])[0]][0],
              ThCoursePlan: data[5][Object.keys(data[5])[0]][0],
              THArticulationMatrixJustification:
                data[6][Object.keys(data[6])[0]][0],
              PRCoursePlan: data[7][Object.keys(data[7])[0]][0],
              PRArticulationMatrixJustification:
                data[8][Object.keys(data[8])[0]][0],
              ListofLabExpt: data[9][Object.keys(data[9])[0]][0],
              ScheduleofLabExpt: data[10][Object.keys(data[10])[0]][0],
              ListofLabManual: data[11][Object.keys(data[11])[0]][0],
              TheoryAttendenceRecord: data[12][Object.keys(data[12])[0]][0],
              LabAssessmentRecord: data[13][Object.keys(data[13])[0]][0],
              utqp: data[16][Object.keys(data[16])[0]][0],
              ras: data[17][Object.keys(data[17])[0]][0],
              Utm: data[15][Object.keys(data[15])[0]][0],
              RemedialSessionsRecord: data[18][Object.keys(data[18])[0]][0],
              ITL: data[19][Object.keys(data[19])[0]][0],
              Econtent: data[20][Object.keys(data[20])[0]][0],
              IndustryExpertSession: data[21][Object.keys(data[21])[0]][0],
              TopicBeyondSyallbus: data[22][Object.keys(data[22])[0]][0],
              CO: data[23][Object.keys(data[23])[0]][0],
              CourseCoordinatorReport: data[24][Object.keys(data[24])[0]][0],
              Feedback: data[25][Object.keys(data[25])[0]][0],
              Remark: data[25][Object.keys(data[25])[1]],
            });

            for (
              let i = 1;
              i < data[28][Object.keys(data[28])[0]].length;
              i++
            ) {
              sheet.addRow({
                fncw: data[28][Object.keys(data[28])[0]][i],
                VisionMissionPos: data[1][Object.keys(data[1])[0]][i],
                PersonalTimeTable: data[2][Object.keys(data[2])[0]][i],
                ClassTimeTable: data[3][Object.keys(data[3])[0]][i],
                Usas: data[4][Object.keys(data[4])[0]][i],
                ThCoursePlan: data[5][Object.keys(data[5])[0]][i],
                THArticulationMatrixJustification:
                  data[6][Object.keys(data[6])[0]][i],
                PRCoursePlan: data[7][Object.keys(data[7])[0]][i],
                PRArticulationMatrixJustification:
                  data[8][Object.keys(data[8])[0]][i],
                ListofLabExpt: data[9][Object.keys(data[9])[0]][i],
                ScheduleofLabExpt: data[10][Object.keys(data[10])[0]][i],
                ListofLabManual: data[11][Object.keys(data[11])[0]][i],
                TheoryAttendenceRecord: data[12][Object.keys(data[12])[0]][i],
                LabAssessmentRecord: data[13][Object.keys(data[13])[0]][i],
                utqp: data[16][Object.keys(data[16])[0]][i],
                ras: data[17][Object.keys(data[17])[0]][i],
                Utm: data[15][Object.keys(data[15])[0]][i],
                RemedialSessionsRecord: data[18][Object.keys(data[18])[0]][i],
                ITL: data[19][Object.keys(data[19])[0]][i],
                Econtent: data[20][Object.keys(data[20])[0]][i],
                IndustryExpertSession: data[21][Object.keys(data[21])[0]][i],
                TopicBeyondSyallbus: data[22][Object.keys(data[22])[0]][i],
                CO: data[23][Object.keys(data[23])[0]][i],
                CourseCoordinatorReport: data[24][Object.keys(data[24])[0]][i],
                Feedback: data[25][Object.keys(data[25])[0]][i],
              });
            }
          }
        } else {
          sheet = workbook.addWorksheet("PAQIC_Audit");
          sheet.columns = [
            { header: "Sr No", key: "srno", width: "25" },
            { header: "Course code wise", key: "ccw", width: "25" },
            { header: "Evaluator Name", key: "en", width: "25" },
            { header: "Faculty name course wise", key: "fncw", width: "25" },
            {
              header: "Course coordinator",
              key: "subcoordinator",
              width: "25",
            },
            {
              header: "Vision, Mission, Pos, PEOs",
              key: "VisionMissionPos",
              width: "25",
            },
            { header: "Personal TT", key: "PersonalTimeTable", width: "25" },
            {
              header: "Class TT (CCs & course with Tut)",
              key: "ClassTimeTable",
              width: "25",
            },
            {
              header: "University Syllabus & Structure",
              key: "Usas",
              width: "25",
            },
            { header: "TH Course Plan", key: "ThCoursePlan", width: "25" },
            {
              header: "TH Articulation Matrix Justification",
              key: "THArticulationMatrixJustification",
              width: "25",
            },
            { header: "PR Course Plan", key: "PRCoursePlan", width: "25" },
            {
              header: "PR Articulation Matrix Justification",
              key: "PRArticulationMatrixJustification",
              width: "25",
            },
            { header: "List of Lab Expt", key: "ListofLabExpt", width: "25" },
            {
              header: "Schedule of Lab Expt",
              key: "ScheduleofLabExpt",
              width: "25",
            },
            {
              header: "List of Lab Manual",
              key: "ListofLabManual",
              width: "25",
            },
            {
              header: "Theory Attendence Record",
              key: "TheoryAttendenceRecord",
              width: "25",
            },
            {
              header: "Lab Assessment Record",
              key: "LabAssessmentRecord",
              width: "25",
            },
            {
              header: "UT Question Papers & Solutions With Marking Scheme",
              key: "utqp",
              width: "25",
            },
            {
              header: "Remedial assignment samples of defaulters",
              key: "ras",
              width: "25",
            },
            {
              header: "UT MarkSheet & Sample answer sheets",
              key: "Utm",
              width: "25",
            },
            {
              header: "Remedial Sessions Record",
              key: "RemedialSessionsRecord",
              width: "25",
            },
            { header: "ITL method practised", key: "ITL", width: "25" },
            { header: "E - content", key: "Econtent", width: "25" },
            {
              header: "Industry Expert Session",
              key: "IndustryExpertSession",
              width: "25",
            },
            {
              header: "Topic Beyond Syallbus",
              key: "TopicBeyondSyallbus",
              width: "25",
            },
            {
              header: "CO attainment calculations for IA",
              key: "CO",
              width: "25",
            },
            {
              header: "Course Coordinator Report",
              key: "CourseCoordinatorReport",
              width: "25",
            },
            { header: "Feedback", key: "Feedback", width: "25" },
            {
              header: "Remark Observations by Auditor",
              key: "Remark",
              width: "25",
            },
          ];
          sheet.getRow(1).eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFA500" }, // Orange background color (ARGB format)
            };
            cell.font = { bold: true }; // Make text bold
          });
          sheet.addRow();

          let key;
          for (key in rlt) {
            let data = JSON.parse(rlt[key].main_data);
            let auditor = await auditorname(Object.keys(data[28])[0]);

            sheet.addRow({
              srno: incrementIntegerInString(key),
              ccw: Object.keys(data[28])[0],
              en: auditor,
              fncw: data[28][Object.keys(data[28])[0]][0],
              subcoordinator: data[27].subcoordinator,
              VisionMissionPos: data[1][Object.keys(data[1])[0]][0],
              PersonalTimeTable: data[2][Object.keys(data[2])[0]][0],
              ClassTimeTable: data[3][Object.keys(data[3])[0]][0],
              Usas: data[4][Object.keys(data[4])[0]][0],
              ThCoursePlan: data[5][Object.keys(data[5])[0]][0],
              THArticulationMatrixJustification:
                data[6][Object.keys(data[6])[0]][0],
              PRCoursePlan: data[7][Object.keys(data[7])[0]][0],
              PRArticulationMatrixJustification:
                data[8][Object.keys(data[8])[0]][0],
              ListofLabExpt: data[9][Object.keys(data[9])[0]][0],
              ScheduleofLabExpt: data[10][Object.keys(data[10])[0]][0],
              ListofLabManual: data[11][Object.keys(data[11])[0]][0],
              TheoryAttendenceRecord: data[12][Object.keys(data[12])[0]][0],
              LabAssessmentRecord: data[13][Object.keys(data[13])[0]][0],
              utqp: data[16][Object.keys(data[16])[0]][0],
              ras: data[17][Object.keys(data[17])[0]][0],
              Utm: data[15][Object.keys(data[15])[0]][0],
              RemedialSessionsRecord: data[18][Object.keys(data[18])[0]][0],
              ITL: data[19][Object.keys(data[19])[0]][0],
              Econtent: data[20][Object.keys(data[20])[0]][0],
              IndustryExpertSession: data[21][Object.keys(data[21])[0]][0],
              TopicBeyondSyallbus: data[22][Object.keys(data[22])[0]][0],
              CO: data[23][Object.keys(data[23])[0]][0],
              CourseCoordinatorReport: data[24][Object.keys(data[24])[0]][0],
              Feedback: data[25][Object.keys(data[25])[0]][0],
              Remark: data[25][Object.keys(data[25])[1]],
            });

            for (
              let i = 1;
              i < data[28][Object.keys(data[28])[0]].length;
              i++
            ) {
              sheet.addRow({
                fncw: data[28][Object.keys(data[28])[0]][i],
                VisionMissionPos: data[1][Object.keys(data[1])[0]][i],
                PersonalTimeTable: data[2][Object.keys(data[2])[0]][i],
                ClassTimeTable: data[3][Object.keys(data[3])[0]][i],
                Usas: data[4][Object.keys(data[4])[0]][i],
                ThCoursePlan: data[5][Object.keys(data[5])[0]][i],
                THArticulationMatrixJustification:
                  data[6][Object.keys(data[6])[0]][i],
                PRCoursePlan: data[7][Object.keys(data[7])[0]][i],
                PRArticulationMatrixJustification:
                  data[8][Object.keys(data[8])[0]][i],
                ListofLabExpt: data[9][Object.keys(data[9])[0]][i],
                ScheduleofLabExpt: data[10][Object.keys(data[10])[0]][i],
                ListofLabManual: data[11][Object.keys(data[11])[0]][i],
                TheoryAttendenceRecord: data[12][Object.keys(data[12])[0]][i],
                LabAssessmentRecord: data[13][Object.keys(data[13])[0]][i],
                utqp: data[16][Object.keys(data[16])[0]][i],
                ras: data[17][Object.keys(data[17])[0]][i],
                Utm: data[15][Object.keys(data[15])[0]][i],
                RemedialSessionsRecord: data[18][Object.keys(data[18])[0]][i],
                ITL: data[19][Object.keys(data[19])[0]][i],
                Econtent: data[20][Object.keys(data[20])[0]][i],
                IndustryExpertSession: data[21][Object.keys(data[21])[0]][i],
                TopicBeyondSyallbus: data[22][Object.keys(data[22])[0]][i],
                CO: data[23][Object.keys(data[23])[0]][i],
                CourseCoordinatorReport: data[24][Object.keys(data[24])[0]][i],
                Feedback: data[25][Object.keys(data[25])[0]][i],
              });
            }
          }
        }
      } else {
        let sheet = workbook.addWorksheet("PAQIC_Audit");
        sheet.columns = [
          { header: "Sr No", key: "srno", width: "25" },
          { header: "Course code wise", key: "ccw", width: "25" },
          { header: "Evaluator Name", key: "en", width: "25" },
          { header: "Faculty name course wise", key: "fncw", width: "25" },
          { header: "Course coordinator", key: "subcoordinator", width: "25" },
          {
            header: "Vision, Mission, Pos, PEOs",
            key: "VisionMissionPos",
            width: "25",
          },
          { header: "Personal TT", key: "PersonalTimeTable", width: "25" },
          {
            header: "Class TT (CCs & course with Tut)",
            key: "ClassTimeTable",
            width: "25",
          },
          {
            header: "University Syllabus & Structure",
            key: "Usas",
            width: "25",
          },
          { header: "TH Course Plan", key: "ThCoursePlan", width: "25" },
          {
            header: "TH Articulation Matrix Justification",
            key: "THArticulationMatrixJustification",
            width: "25",
          },
          { header: "PR Course Plan", key: "PRCoursePlan", width: "25" },
          {
            header: "PR Articulation Matrix Justification",
            key: "PRArticulationMatrixJustification",
            width: "25",
          },
          { header: "List of Lab Expt", key: "ListofLabExpt", width: "25" },
          {
            header: "Schedule of Lab Expt",
            key: "ScheduleofLabExpt",
            width: "25",
          },
          { header: "List of Lab Manual", key: "ListofLabManual", width: "25" },
          {
            header: "Theory Attendence Record",
            key: "TheoryAttendenceRecord",
            width: "25",
          },
          {
            header: "Lab Assessment Record",
            key: "LabAssessmentRecord",
            width: "25",
          },
          {
            header: "UT Question Papers & Solutions With Marking Scheme",
            key: "utqp",
            width: "25",
          },
          {
            header: "Remedial assignment samples of defaulters",
            key: "ras",
            width: "25",
          },
          {
            header: "UT MarkSheet & Sample answer sheets",
            key: "Utm",
            width: "25",
          },
          {
            header: "Remedial Sessions Record",
            key: "RemedialSessionsRecord",
            width: "25",
          },
          { header: "ITL method practised", key: "ITL", width: "25" },
          { header: "E - content", key: "Econtent", width: "25" },
          {
            header: "Industry Expert Session",
            key: "IndustryExpertSession",
            width: "25",
          },
          {
            header: "Topic Beyond Syallbus",
            key: "TopicBeyondSyallbus",
            width: "25",
          },
          {
            header: "CO attainment calculations for IA",
            key: "CO",
            width: "25",
          },
          {
            header: "Course Coordinator Report",
            key: "CourseCoordinatorReport",
            width: "25",
          },
          { header: "Feedback", key: "Feedback", width: "25" },
          {
            header: "Remark Observations by Auditor",
            key: "Remark",
            width: "25",
          },
        ];

        sheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA500" }, // Orange background color (ARGB format)
          };
          cell.font = { bold: true }; // Make text bold
        });
        sheet.addRow();
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + "PAQIC_Audit.xlsx"
      );

      workbook.xlsx.write(res);
    });
  } catch (e) {
    return res.status(400);
  }
});

const port = 8000;

app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});