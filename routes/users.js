var express = require("express");
var router = express.Router();
var pool = require("./pool");
const config = require("../nodemon.json");
var request = require("request");
const jwt = require("jsonwebtoken");
var multer = require("./config/multer");
const readXlsxFile = require("read-excel-file/node");
var useragent = require("useragent");
var moment = require("moment");
// const fetch = require("node-fetch")
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("users");
});

// router.post("/sendotp", function (req, res) {
//   console.log("Request body", req.body);
//   // //console.log("Request body", req.body);
//   var options = {
//     method: "GET",
//     // url: `http://byebyesms.com/app/smsapi/index.php?key=460408AD21906C&campaign=10833&routeid=37&type=text&contacts=${req.body.mobile}&senderid=SUPPAL&msg=${req.body.otp} is your sandeepsappal.in account verification code&template_id=1207162607138640022`,
//     // headers: {
//     //   "Cache-Control": "no-cache",
//     // },

//     url: `https://api.msg91.com/api/v5/otp?template_id=6361f763d6fc0503f83a2632&mobile=${req.body.mobile}&authkey=383945Aj0ZM8eNX635238f7P1&otp=${req.body.otp}`,
//     headers: {
//       "Cache-Control": "no-cache",
//     },
//   };
//   request(options, function (error, result, body) {
//     if (error) {
//       //console.log("Error In users", error);
//       return res.status(400).json({ status: false, msg: error });
//     } else {
//       // //console.log("Result In users", result);
//       // return res.json({ status: true, result, msg:req.body.otp });
//       return res.status(200).json({
//         status: true,
//         message: "OTP Has been sent",
//         result,
//         otp: req.body.otp,
//         mobile: req.body.mobile,
//       });
//     }
//   });
// });

router.post("/sendotp", function (req, res) {
  console.log("Request body", req.body);
  // //console.log("Request body", req.body);
  var options = {
    method: "GET",
    // url: `http://byebyesms.com/app/smsapi/index.php?key=460408AD21906C&campaign=10833&routeid=37&type=text&contacts=${req.body.mobile}&senderid=SUPPAL&msg=${req.body.otp} is your sandeepsappal.in account verification code&template_id=1207162607138640022`,
    // headers: {
    //   "Cache-Control": "no-cache",
    // },

    // url: `https://api.msg91.com/api/v5/otp?template_id=6361f763d6fc0503f83a2632&mobile=${req.body.mobile}&authkey=383945Aj0ZM8eNX635238f7P1&otp=${req.body.otp}`,
    // headers: {
    //   "Cache-Control": "no-cache",
    // },

    url: `http://sms.smsindori.com/http-api.php?username=Plus91labs&password=12345&senderid=PLSLMS&route=06&number=${req.body.mobile}&message=PLSLMS:Dear%20customer,%20use%20this%20OTP%20${req.body.otp}%20to%20log%20in%20to%20your%20TrueSales%20account.%20This%20OTP%20will%20expire%20in%2015%20minutes&templateid=1007379278963251418`,
    headers: {
      "Cache-Control": "no-cache",
    },
  };
  request(options, function (error, result, body) {
    if (error) {
      //console.log("Error In users", error);
      return res.status(400).json({ status: false, msg: error });
    } else {
      // //console.log("Result In users", result);
      // return res.json({ status: true, result, msg:req.body.otp });
      return res.status(200).json({
        status: true,
        message: "OTP Has been sent",
        result,
        otp: req.body.otp,
        mobile: req.body.mobile,
      });
    }
  });
});

router.post("/PenalLogin", function (req, res, next) {
  var scopes = [];
  var Rolename = [];
  //console.log("Request body====>340", req.body);
  // //console.log("Request =======>341", req);
  var agent = useragent.parse(req.headers["user-agent"]);
  let userDeviceId = agent.toString();

  if (req.body.mobile) {
    var qry = `select U.*, C.name as CompanyName from user as U join company as C on U.company_id=C.id where U.mobile='${req.body.mobile}';`;
  } else {
    //console.log("in Else log");
    var qry = `select U.*, C.name as CompanyName from user as U join company as C on U.company_id=C.id where U.email="${req.body.email}" and U.password="${req.body.password}";`;
  }
  //  `select * from user where mobile=${req.body.mobile}`;
  pool.query(qry, function (error, result) {
    // //console.log("Result", result);
    if (error) {
      console.log("Error", error);
      return res.status(400).json({ status: false, error });
    } else {
      if (result.length == 1) {
        pool.query(
          `select CL.slug, R.name from roles as R join roleclaims as RC on R.id=RC.role_id join claims as CL on RC.claim_id=CL.id where R.id='${result[0].role_id}' and R.company_id='${result[0].company_id}'`,
          function (err, reslt) {
            if (err) {
              console.log("error in second query", err);
              return res.status(400).json([]);
            } else {
              reslt.map((item) => {
                scopes.push(item.slug);
              });
              reslt.map((item) => {
                Rolename.push(item.name);
              });
              console.log("scopes===438", scopes);
              if (
                scopes.includes("can_login_webpenal") == true ||
                scopes.includes("can_login_manager_webpenal") == true ||
                scopes.includes("can_login_auditor_penal") == true
              ) {
                let payload = {
                  UserID: result[0].id,
                  DeviceId: userDeviceId,
                  CreatedTime: moment().format("HH:mm:ss"),
                  CreatedDate: moment(),
                };

                const token = jwt.sign(payload, config.secret, {
                  //   expiresIn: "2h",
                });
                return res.status(200).json({
                  status: true,
                  data: result[0],
                  token: token,
                  scopes,
                  Rolename,
                });
              } else {
                return res.status(401).json({
                  status: false,
                  message: "You are not authorized to login",
                });
              }
            }
          }
        );
      } else {
        // //console.log("Error of user auth ===60", result);
        return res
          .status(400)
          .json({ status: false, message: "User Not Found" });
      }
    }
  });
});

router.post("/AppAuthenticate", function (req, res, next) {
  //console.log("Request body====>37", req.body);
  var scopes = [];
  var agent = useragent.parse(req.headers["user-agent"]);
  let userDeviceId = agent.toString();

  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }
  const qry = `select U.*, C.name as CompanyName from user as U join company as C on U.company_id=C.id where U.mobile='${FinalMobile}';`;
  pool.query(qry, function (error, result) {
    //console.log("Result>>>>>>>>>>>>>.", result);
    if (error) {
      //console.log("Error", error);
      return res.status(400).json({ status: false, error });
    } else {
      //console.log(
      //   "result.length == 1 && result[0].status=='Active",
      //   result.length == 1 && result[0].status == "Active"
      // );
      if (result.length == 1 && result[0].status == "Active") {
        pool.query(
          `select CL.slug from roles as R join roleclaims as RC on R.id=RC.role_id join claims as CL on RC.claim_id=CL.id where R.id='${result[0].role_id}' and R.company_id='${result[0].company_id}'`,
          function (err, resultt) {
            if (err) {
              return res
                .status(400)
                .json({ status: false, message: "something went wrong" });
            } else {
              resultt.map((item) => {
                scopes.push(item.slug);
              });
              //console.log("scopes===438", scopes);
              //console.log("scopes lengthhh---->", scopes.length);
              if (
                scopes.includes("can_login_manager_app") == true ||
                scopes.includes("can_login_csr_app") == true ||
                scopes.includes("can_login_auditor_app") == true
              ) {
                let payload = {
                  UserID: result[0].id,
                  DeviceId: userDeviceId,
                  CreatedTime: moment().format("HH:mm:ss"),
                  CreatedDate: moment(),
                };
                const token = jwt.sign(payload, config.secret, {
                  //   expiresIn: "2h",
                });
                return res.status(200).json({
                  status: true,
                  data: result[0],
                  token: token,
                  scopes,
                });
              } else {
                return res.status(200).json({
                  status: false,
                  message: "You are not authorized to login",
                });
              }
            }
          }
        );
      } else {
        return res.status(200).json({
          status: false,
          message: "User Not found",
          // data: result[0],
          // otp: req.body.otp,
        });
      }
    }
  });
});

router.post("/authenticate", function (req, res, next) {
  //console.log("Request body====>37", req.body);
  const qry = `select U.*, C.name as CompanyName from user as U join company as C on U.company_id=C.id where U.mobile='${req.body.mobile}';`;
  //  `select * from user where mobile=${req.body.mobile}`;
  pool.query(qry, function (error, result) {
    //console.log("Result", result);
    if (error) {
      //console.log("Error", error);
      return res.status(400).json({ status: false, error });
    } else {
      if (result.length != 0) {
        const token = jwt.sign({ sub: result[0].id }, config.secret, {
          expiresIn: "2h",
        });
        //console.log("Result of user auth===55", result, token);
        return res.status(200).json({
          status: true,
          data: result[0],
          token: token,
          otp: req.body.otp,
        });
      } else {
        //console.log("Error of user auth ===60", result);
        res.status(200).json({ status: false });
      }
    }
  });
});

router.post("/add", multer.any(), function (req, res, next) {
  //console.log("Req body ========55", req.body);
  // //console.log("Req file", req.files[0].filename);b
  let name = req.body.firstname + " " + req.body.lastname;

  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }
  var qryy = `select * from user where mobile=${FinalMobile}`;
  pool.query(qryy, function (errorrr, resulttt) {
    if (errorrr) {
      //console.log("Error in user checking in add user API", errorrr);
      return res
        .status(400)
        .json({ status: false, message: errorrr.sqlMessage, errorrr });
    } else {
      if (resulttt.length != 0) {
        //console.log("in user checking in add user API initial if part");
        return res
          .status(200)
          .json({ status: false, message: "This number already register" });
      } else {
        if (req.body.user_picture != "") {
          var qry = `insert into user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", created_at="${req.body.created_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", user_picture="${req.files[0].filename}";`;
        } else {
          qry = `insert into user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", created_at="${req.body.created_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}";`;
        }
        pool.query(qry, function (error, result) {
          if (error) {
            //console.log("Error in User Add====75", error);
            return res
              .status(400)
              .json({ status: false, message: error.sqlMessage });
          } else {
            // //console.log("Result in User Add=====78", result);
            return res.status(200).json({
              status: true,
              message: "User added successfully",
              result,
            });
          }
        });
      }
    }
  });
});

router.post(
  "/UploadExcel",
  multer.single("userExcel"),
  function (req, res, next) {
    // //console.log("Request Body In Excel", req.body);
    //console.log("Request file In Excel", req.file);
    readXlsxFile("public/images/" + req.file.filename).then((rows) => {
      // //console.log("Rows in Route...", rows);
      // //console.log("Rows in Route.testetstes..", rows[1][4]);
      rows.shift();
      //console.log("Rows in Route of Shift =========97...", rows.length);
      var qry = "";
      if (rows.length != 0) {
        rows.map((item) => {
          var str = "'" + item.join("','") + "'";

          var now = moment();
          var tempDate = str.split(",")[4];
          var momentDate = moment(tempDate)
            .set({
              hour: now.hour(),
              minute: now.minute(),
              second: now.second(),
            })
            .format("YYYY-MM-DD hh:mm:ss");
          dateFormat = `'${momentDate}'`;
          str = str.split(",");
          str[4] = dateFormat;
          str = str.join();

          if (!str.split(",")[1].startsWith("+91")) {
            var k = str.split(",")[1];
            k = k.replace(/['"]+/g, "");
            mob = `'+91${k}'`;
            str = str.split(",");
            str[1] = mob;
            str = str.join();
          }

          var tempDate2 = str.split(",")[8];
          var momentDate2 = moment(tempDate2)
            .set({
              hour: now.hour(),
              minute: now.minute(),
              second: now.second(),
            })
            .format("YYYY-MM-DD hh:mm:ss");
          dateFormat2 = `'${momentDate2}'`;
          str = str.split(",");
          str[8] = dateFormat2;
          str = str.join();

          //console.log("str==================== 101", str);
          qry += `INSERT INTO user(name,mobile,email,team_id,created_at,updated_at,company_id,status,date_of_joining, role_id, firstname, lastname, user_picture) VALUES(${str});`;
        });
        pool.query(qry, function (error, result) {
          if (error) {
            // //console.log("Error In Upload Excel File =====103", error);
            return res.status(400).json({
              status: false,
              message: "Error in Uploading file",
              error,
            });
          } else {
            // //console.log("Result in Upload Excel File ====== 106", result);
            return res.status(200).json({
              status: true,
              message: "File Upload successfully",
              result,
            });
          }
          // //console.log('error || result',error || result)
        });
        // });
      }
    });
  }
);

router.get("/newPenalActiveUser/:company_id", function (req, res, next) {
  // //console.log("Req.body", req.body);
  const qry = `select * from user where company_id="${req.params.company_id}"; select * from user where status='Active' and company_id="${req.params.company_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in active User", error);
      return res
        .status(400)
        .json({ status: false, message: "Bad Request", error });
    } else {
      //console.log("Result in active User", result);
      var tempTotal = result[0];
      var tempActive = result[1];
      var TotalUsers = [tempTotal];
      var ActiveUser = [tempActive];
      return res.status(200).json({
        status: true,
        message: "Record Found",
        TotalUsers,
        ActiveUser,
      });
    }
  });
});

router.get("/DisplayUsersRoleWise/:companyId", function (req, res, next) {
  //console.log("req body & params", req.params, req.body);
  pool.query(
    `select U.*, (select R.name from roles R where R.id=U.role_id) as RoleName from user U where company_id="${req.params.companyId}" and U.team_id='0' order by U.id desc;`,
    function (error, result) {
      if (error) {
        // //console.log("Error in User Display All", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", result });
      }
    }
  );
});

router.post("/UserFilter/:companyId", function (req, res, next) {
  //console.log("request body in user filter", req.body);
  //console.log("request params in user filter", req.params);

  let qry = `select U.name, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, U.email, U.mobile, U.created_at, U.status from user U where date(U.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and U.company_id="${req.params.companyId}" order by U.id desc; select U.*, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName from user U where date(U.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and U.company_id="${req.params.companyId}" order by U.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in user filter", error);
      return res
        .status(400)
        .json({ status: false, message: error.sqlMessage, error });
    } else {
      //console.log("Result in user filter", result);
      var tempExcelData = result[0];
      var tempData = result[1];
      var ExcelData = [tempExcelData];
      var resultt = [tempData];
      return res
        .status(200)
        .json({ status: true, message: "Record found...", resultt, ExcelData });
    }
  });
});

router.post("/update/:id/:company_id", multer.any(), function (req, res, next) {
  let name = req.body.firstname + " " + req.body.lastname;
  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }

  if (req.body.user_picture != "") {
    var qry = `update user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", user_picture="${req.files[0].filename}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  } else {
    var qry = `update user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  }

  pool.query(qry, function (error, result) {
    //console.log("Error in users Updated", error);

    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result in users Update", result);

      return res.status(200).json({
        status: true,
        result,
        message: "User Updated successfully",
      });
    }
  });
});

router.post("/userDetail", function (req, res, next) {
  // //console.log("Request Body in User Details", req.body);
  const qry = `select U.*,T.*,(select U.name from user U where U.id=T.team_head) as manager,(select U.email from user U where U.id=T.team_head) as Managar_Email,(select U.mobile from user U where U.id=T.team_head) as Managar_Mobile, (select C.name from company C where C.id=U.company_id) as Company_Name from user U , team T where U.id='${req.body.user}' and U.company_id='${req.body.company_id}' and U.team_id = T.id;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in User Detail", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in User Detail", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

//////////////////////////////////////////////// MANAGER API ///////////////////////////////////////

router.post("/ManagerProfile", function (req, res, next) {
  pool.query(
    "select U.*,(select C.name from company C where C.id=U.company_id) as Company_Name,(select R.name from roles R where U.role_id=R.id ) as rolename from user U where U.id=? and U.company_id=?",
    [req.body.id, req.body.company_id],
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        // //console.log("result in ManagerProfile>>>199", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", result });
      }
    }
  );
});

router.post("/TeamMember", function (req, res, next) {
  //console.log("req.body--->>>>809", req.body);
  let currDate = moment().format("YYYY-MM-DD");
  const qry = `select U.*,CLS.updated_at,if(A.status="in", CLS.livestatus, "") as livestatus from user U left join calllivestatus CLS on CLS.user_id=U.id left join attendence A on U.id=A.user_id and A.date="${currDate}" where U.team_id='${req.body.team_id}' and U.company_id='${req.body.company_id}' group by U.id`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("error>>>>>>>>146", error);
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result TeamMember", result);
      res
        .status(200)
        .json({ status: true, message: "GET Teams Successfully", result });
    }
  });
});

router.get("/CompanyTeamMember/:company_id", function (req, res, next) {
  //console.log("req.body--->>>>809", req.body);
  const qry = `select U.*,(select livestatus from calllivestatus C where C.user_id=U.id group by C.user_id) as livestatus, (select updated_at from calllivestatus C where C.user_id=U.id group by C.user_id) as updateidletime from user U where U.company_id='${req.params.company_id}' and team_id!=0`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("error>>>>>>>>146", error);
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result TeamMember", result);
      res
        .status(200)
        .json({ status: true, message: "GET Teams Successfully", result });
    }
  });
});

router.get("/DisplayAll", function (req, res, next) {
  // //console.log("req body & params", req.params, req.body);
  pool.query(
    `select U.*, (select R.name from roles R where R.id=U.role_id) as RoleName, group_concat(T.team_name separator ', ') as TeamName, CLS.livestatus as CallLiveStatus from user U left join team T on U.team_id=T.id or U.id=T.team_head left join calllivestatus CLS on U.id=CLS.user_id where U.company_id="${req.params.companyId}" group by U.id order by U.id desc; select U.name, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, U.email, U.mobile, U.created_at, U.status from user U where U.company_id="${req.params.companyId}" order by U.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("Error in User Display All", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        let tempData = result[0];
        let tempExcel = result[1];
        let Data = [tempData];
        let ExcelData = [tempExcel];
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", Data, ExcelData });
      }
    }
  );
});

router.get("/display_all_user_data", function (req, res, next) {
  pool.query(
    "select U.*,(select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, (select C.name from company C where C.id=U.company_id) as Cname from user U",
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result, status: true });
      }
    }
  );
});

router.get("/display/:id/:company_id", function (req, res, next) {
  //console.log("Request", req.params);
  pool.query(
    `select * from user where id="${req.params.id}" and company_id="${req.params.company_id}";`,
    function (error, result) {
      if (error) {
        //console.log("Error in user detail ===103", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in user detail ===103", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "User Data found!" });
      }
    }
  );
});

router.post("/update/:id/:company_id", multer.any(), function (req, res, next) {
  //console.log("Request body in update in Users=====143", req.body);
  // //console.log("Req file", req.files[0].filename);

  let name = req.body.firstname + " " + req.body.lastname;

  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }
  if (req.body.user_picture != "") {
    var qry = `update user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", user_picture="${req.files[0].filename}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  } else {
    var qry = `update user set name="${name}", mobile="${FinalMobile}", email="${req.body.email}", team_id="${req.body.team_id}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", status="${req.body.status}", user_state="${req.body.user_state}", user_country="${req.body.user_country}", date_of_joining="${req.body.date_of_joining}", user_city="${req.body.user_city}", role_id="${req.body.role_id}", firstname="${req.body.firstname}", lastname="${req.body.lastname}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  }

  pool.query(qry, function (error, result) {
    //console.log("Error in users Updated", error);
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result in users Update", result);
      return res.status(200).json({
        status: true,
        result,
        message: "User Updated successfully",
      });
    }
  });
});

router.get("/GlobalSearchForNewPenal/:company_id", function (req, res, next) {
  var qry = `select U.*, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName from user U where U.company_id="${req.params.company_id}" order by U.id desc; select C.*, C.name as CustomerName, C.mobile as customer_mobile, T.team_name as TeamName, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id where C.company_id="${req.params.company_id}" order by C.id desc; select T.*, Tm.team_name as TeamName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as UserName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus, (select C.email from customers C where T.customer=C.id) as CustomerEmail from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" group by T.id order by T.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in GlobalSearch For New Penal", error);
      return res
        .status(400)
        .json({ status: false, message: error.sqlMessage, error });
    } else {
      //console.log("result in GlobalSearch For New Penal", result);
      return res
        .status(200)
        .json({ status: true, message: "record found", result });
    }
  });
});

router.get(
  "/managerPenalActiveUser/:company_id/:manager_id/:role_id",
  function (req, res, next) {
    const qry = `select (select count(US.name) from user US where US.team_id=T.id and T.team_head="${req.params.manager_id}") as TotalUser, (select count(US.name) from user US where US.team_id=T.id and US.status='Active') as ActiveUser from user U join team T on U.team_id=T.id where U.company_id="${req.params.company_id}" and T.team_head='${req.params.manager_id}' group by U.id;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in active User", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        //console.log("Result in active User", result.length);
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result,
        });
      }
    });
  }
);

router.get(
  `/managerPenalOverAllTask/:company_id/:manager_id`,
  function (req, res, next) {
    //console.log("request in Total Task", req.params);
    var qry = `select count(T.id) as Total_task from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}";select T.* from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" and T.status='3';`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in Total task", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        //console.log("result in Total task", result[0]);
        var tempTotal = result[0];
        var tempCompl = result[1];
        var totalTask = [tempTotal];
        var completeTask = [tempCompl];
        return res.status(200).json({
          status: true,
          message: "Record found",
          totalTask,
          completeTask,
        });
      }
    });
  }
);

router.post(
  "/add_new_user_data",
  multer.single("user_picture"),
  function (req, res, next) {
    let name = req.body.firstname + " " + req.body.lastname;
    //console.log("BODY:", req.body);
    //console.log("FILE:", req.file);
    pool.query(
      "insert into user(name, mobile, email, team_id, created_at, company_id, status, date_of_joining, role_id, firstname, lastname, user_picture)values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
         name,
        req.body.mobile,
        req.body.email,
        req.body.team_id,
        req.body.createdAt,
        req.body.company_id,
        req.body.status,
        req.body.date_of_joining,
        req.body.role_id,
        req.body.firstname,
        req.body.lastname,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          //console.log(error);
          return res.status(500).json({ result: false });
        } else {
          return res.status(200).json({ result: true });
        }
      }
    );
  }
);
router.post("/delete_all_all_user", function (req, res, next) {
  console.log("req body ", req.body.id);
  pool.query(
    "delete from user where id in (?)",
    [req.body.id],
    function (error, result) {
      if (error) {
        console.log("in error");
        return res.status(500).json({ status: false, error: error });
      } else {
        console.log("in success");

        return res.status(200).json({ status: true });
      }
    }
  );
});



router.post("/edit_user_data",multer.single('user_picture'), function (req, res, next) {
 console.log('bfbf',req.body);
 console.log('bfbf',req.file);
  let name = req.body.firstname + " " + req.body.lastname;
  pool.query(
    "update user set name=?, mobile=?, email=?, team_id=?, updated_at=?, company_id=?, status=?, date_of_joining=?, role_id=?, firstname=?, lastname=?, user_picture=? where id=?",
    [
      name,
      req.body.mobile,
      req.body.email,
      req.body.team_id,
      req.body.update_At,
      req.body.company_id,
      req.body.status,
      req.body.date_of_joining,
      req.body.role_id,
      req.body.firstname,
      req.body.lastname,
      req.file.filename,
      req.body.userId,
    ],
    function (error, result) {
      if (error) {
        console.log('error',error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post(
  "/update_picture",
  multer.single("userpicture"),
  function (req, res, next) {
    //console.log("FILE:", req.file);
    pool.query(
      "update user set user_picture=? where id=?",
      [req.file.filename, req.body.id],
      function (error, result) {
        if (error) {
          //console.log(error);
          return res.status(500).json({ result: false });
        } else {
          return res.status(200).json({ result: true });
        }
      }
    );
  }
);

router.post("/delete_user", function (req, res, next) {
  pool.query(
    "delete from user where id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/delete_all_user", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from user where id in (?)",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log("in error");
        return res.status(500).json({ status: false, error: error });
      } else {
        //console.log("in success");

        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/display_all_team", function (req, res, next) {
  pool.query(
    "select * from team where company_id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});
router.post("/display_all_roles", function (req, res, next) {
  pool.query(
    "select * from roles where company_id=?",
    [req.body.comId],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.get("/AuditorTeamsUser/:company_id/:team_id", function (req, res, next) {
  const qry = `select U.*, (select R.name from roles R where R.id=U.role_id) as RoleName, group_concat(T.team_name separator ', ') as TeamName, (select CLS.livestatus from calllivestatus CLS where U.id=CLS.user_id) as CallLiveStatus from user U left join team T on U.team_id=T.id or U.id=T.team_head where U.company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by U.id, T.id order by U.id desc; select U.name, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, U.email, U.mobile, U.created_at, U.status from user U left join team T on U.team_id=T.id or U.id=T.team_head where U.company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by U.id, T.id order by U.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in AuditorTeamsUser", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in AuditorTeamsUser", result);
      let tempResult = result[0];
      let tempExcel = result[1];
      let dataResult = [tempResult];
      let dataExcel = [tempExcel];
      return res
        .status(200)
        .json({ status: true, message: "record found", dataResult, dataExcel });
    }
  });
});

router.get("/AllCSRFetch/:role_id/:company_id", function (req, res, next) {
  //console.log("AllCSRFetch AllCSRFetch ---> 876", req.params);
  const qry = `select U.* from user U where U.company_id='${req.params.company_id}' and U.role_id='${req.params.role_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in AllCSRFetch", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "record found", result });
    }
  });
});

router.get(
  "/AllCSRFetchForManagerPenal/:company_id/:manager_id",
  function (req, res, next) {
    const qry = `select (select U.name from user U where U.id=T.team_head) as TeamHead, U.* from user U join team T on U.team_id=T.id where T.team_head='${req.params.manager_id}' and U.company_id='${req.params.company_id}' group by U.id order by U.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in AllCSRFetch", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "record found", result });
      }
    });
  }
);

module.exports = router;
