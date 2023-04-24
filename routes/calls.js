var express = require("express");
var router = express.Router();
var pool = require("./pool");
var moment = require("moment");
var multer = require("./config/multer");

router.post("/add_new_calls_data", function (req, res, next) {
  pool.query(
    "insert into calls(call_type, duration, customer, recording_url, user, user_note, disposition, created_at, company_id, call_status, task_id, template, unknown_number, case_number)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.calltype,
      req.body.durartion,
      req.body.customerid,
      req.body.recordingurl,
      req.body.userid,
      req.body.usernote,
      req.body.dispostion,
      req.body.createdat,
      req.body.companyid,
      req.body.callstatus,
      req.body.taskid,
      req.body.template,
      req.body.unknownno,
      req.body.caseno,
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
});

router.get("/display_all_calls_data", function (req, res, next) {
  pool.query("select * from calls", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_calls_data", function (req, res, next) {
  pool.query(
    "update calls set call_type=?, duration=?, customer=?, recording_url=?, user=?, user_note=?, disposition=?, created_at=?, company_id=?, call_status=?, task_id=?, template=?, unknown_number=?, case_number=? where id=?",
    [
      req.body.calltype,
      req.body.durartion,
      req.body.customerid,
      req.body.recordingurl,
      req.body.userid,
      req.body.usernote,
      req.body.dispostion,
      req.body.createdat,
      req.body.companyid,
      req.body.callstatus,
      req.body.taskid,
      req.body.template,
      req.body.unknownno,
      req.body.caseno,
      req.body.id,
    ],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/delete_calls", function (req, res, next) {
  pool.query(
    "delete from calls where id=?",
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

router.post("/display_all_task_data", function (req, res, next) {
  pool.query(
    "select * from task where company_id=?",
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

router.post("/delete_all__calls", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from calls where id in (?)",
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("calls");
});

router.post(
  "/insertCallsFromInteraction",
  multer.any(),
  function (req, res, next) {
    //console.log("request body in intrecation", req.body);
    //console.log("req.files>>17", req.files);
    //console.log("req.files>>18", req.files[0].filename);
    //console.log("req.body.created_at", req.body.created_at);

    var CreatedDate = req.body.created_at;
    var CallDate = moment(CreatedDate).format("YYYY-MM-DD HH:mm:ss");
    //console.log("CallDate>>>", CallDate);

    var TaskDateParse = req.body.task_date;
    var TaskDate = moment(TaskDateParse).format("YYYY-MM-DD HH:mm:ss");
    //console.log("TaskDate===s=>", TaskDate);

    var TaskCurrentDate = req.body.task_added_date;
    var TaskCrrDate = moment(TaskCurrentDate).format("YYYY-MM-DD HH:mm:ss");
    //console.log("TaskCrrDate====>", TaskCrrDate);

    // var CallCreatedAt = JSON.parse(req.body.created_at);
    // var finalCallCreatedAt = moment(CallCreatedAt).utc().format("YYYY-MM-DD HH:mm:ss")
    // //console.log('finalCallCreatedAt>>23', finalCallCreatedAt)
    // var finalD = JSON.parse(req.body.duration)
    // //console.log('finalD>>>>', finalD)
    // //console.log("req.body.task_date>>>", req.body.task_date);
    if (req.body.checkk === "true") {
      //console.log("in if 21");
      const qryT = `insert into task set status="${req.body.task_status}",customer="${req.body.customer}",user="${req.body.user}",note="${req.body.user_note}",mobile="${req.body.mobileno}",created_at="${TaskDate}",company_id="${req.body.company_id}",refrence_from="${req.body.refrence_from}",task_type="${req.body.task_type}",create_customer_profile="${req.body.create_customer_profile}",csr_read_profile="${req.body.csr_read_profile}",priority="${req.body.priority}",task_created_by="${req.body.Ttask_created_by}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", task_added_date="${TaskCrrDate}";`;

      pool.query(qryT, function (error, result) {
        //console.log("call request body", req.body);
        if (error) {
          //console.log("Error in Call Add", error);
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage });
        } else {
          console.log("RESULT AFFECTED ROWS>>>>>>>>>>>>", result.affectedRows);
          if (result.affectedRows > 0) {
            //console.log("Result ===45", result);
            const qryC = `insert into calls set call_type="${req.body.call_type}", duration="${req.body.duration}", customer="${req.body.customer}", recording_url="${req.files[0].filename}", user="${req.body.user}", user_note="${req.body.user_note}", disposition="${req.body.disposition}", created_at="${CallDate}", company_id="${req.body.company_id}", call_status="${req.body.call_status}", task_id="${result.insertId}", case_number="${req.body.case_number}";`;

            pool.query(qryC, function (errr, reslt) {
              if (errr) {
                //console.log("Error line 58", errr);
                return res
                  .status(400)
                  .json({ status: false, message: "error", errr });
              } else {
                //console.log(
                //   "reslt in calls intreaction in if first else",
                //   reslt
                // );
                return res.status(200).json({
                  status: true,
                  message: "Both record Inserted Task & Call",
                  reslt,
                  rec: req.files[0].filename,
                });
              }
            });
          }
        }
      });
    } else {
      //console.log("in else====line no. 511111");
      const format = "YYYY-MM-DD HH:mm:ss";
      var todayDate = new Date();
      var dateTime = moment().format(format);
      //console.log("dateTime>>>>>>>>>81", dateTime);

      const qry = `insert into calls set call_type="${req.body.call_type}", duration="${req.body.duration}", customer="${req.body.customer}", recording_url="${req.files[0].filename}", user="${req.body.user}", user_note="${req.body.user_note}", disposition="${req.body.disposition}", created_at="${CallDate}", company_id="${req.body.company_id}", call_status="${req.body.call_status}", task_id="${req.body.task_id}", case_number="${req.body.case_number}"; `;

      //console.log("QRYYYYYYYY ===== 56", qry);
      pool.query(qry, function (error, result) {
        if (error) {
          //console.log("Error in Call Add", error);
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage });
        } else {
          //console.log("in second if else in calls intreactions", result);
          return res.status(200).json({
            status: true,
            message: "Record inserted in Calls only",
            rec: req.files[0].filename,
          });
        }
      });
    }
  }
);

router.post("/dateCSRDetails", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  //console.log("DATE TO OLD", req.body.dateTo);
  var newDateTo = moment(req.body.dateTo).add(1, "days").format("YYYY-MM-DD");
  //console.log("NEW DATE TO CSR DETAILS", newDateTo);
  const qry = `select SEC_TO_TIME(Floor((avg(C.duration)))) as AverageTalkTime,SEC_TO_TIME(Floor((sum(C.duration)))) as TotalTalkTime,(select sum(duration) from attendence A where A.user_id='${req.body.user}' and A.company_id='${req.body.company_id}' and A.date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and '${newDateTo}' and not out_time="00:00:00") as totalAttendance ,(Select SEC_TO_TIME(Floor((sum(B.duration)))) from break B where B.created_at in (select created_at from break where created_at between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and '${newDateTo}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreak,(Select sum(B.duration) from break B where B.created_at in (select created_at from break where created_at between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and '${newDateTo}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreakInNumber,(Select SEC_TO_TIME(floor(AVG(TIME_TO_SEC(A.duration)))) from attendence A where A.user_id=C.user and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and '${newDateTo}') as AverageClockInTime from calls C where user='${req.body.user}' and company_id='${req.body.company_id}' and SUBSTRING_INDEX(created_at,' ',1) between '${newDateTo}' and SUBSTRING_INDEX('${req.body.dateTo}','T',1)`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/followupDetail", function (req, res, next) {
  const qry = `select C.*, T.team_head as ManagerName, U.name as UserName, Cus.name as CustomerName from calls as C join customers as Cus on C.customer=Cus.id join user as U on C.user=U.id join team as T on U.team_id=T.id where C.company_id='${req.body.company_id}' and C.user='${req.body.user}' and C.priority='${req.body.priority}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in followup Detail ====62", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      //console.log("Result in followup Detail ======65", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/TopPriority", function (req, res, next) {
  var qry = `select priority , count(priority) as Cvalue from  calls where user='${req.body.user}' and company_id='${req.body.company_id}' group by priority;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Calls Fetch API ======== 73", error);
      return res
        .status(400)
        .json({ status: true, message: "Error Occurred", error });
    } else {
      //console.log("Result in Calls Fetch API =========78", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/outboundDetail", function (req, res, next) {
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const qry = `select if(CL.customer='undefined', '(Unknown Number)', Cus.name) as CusName, if(CL.customer='undefined', '', Cus.email) as CustomerEmail, if(CL.customer='undefined', '', Cus.firstname) as FirstName, if(CL.customer='undefined', '', Cus.lastname) as LastName, if(CL.customer='undefined', '', Cus.type) as CustomerType, if(CL.customer='undefined', '', Cus.mobile) as CustomerMobile, if(CL.customer='undefined', '', Cus.email) as CustomerEmail, if(CL.customer='undefined', '', Cus.priority) as priority, if(CL.customer='undefined', '', Cus.address) as CustomerAddress, if(CL.customer='undefined', '', Cus.id) as CustomerId, CL.* from calls CL join customers Cus on CL.customer=Cus.id or CL.customer='undefined' join user U on CL.user=U.id where U.id='${req.body.user}' and CL.call_status='${req.body.call_status}' and U.company_id='${req.body.company_id}' and CL.created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by CL.id order by CL.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Out Bound Details ======= 44", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Out bound Details ========= 47", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/inboundDetail", function (req, res, next) {
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  //console.log("Request body in Inbound Details =======39", req.body);
  const qry = `select if(CL.customer='undefined', '(Unknown Number)', Cus.name) as CusName, if(CL.customer='undefined', '', Cus.email) as CustomerEmail, if(CL.customer='undefined', '', Cus.firstname) as FirstName, if(CL.customer='undefined', '', Cus.lastname) as LastName, if(CL.customer='undefined', '', Cus.type) as CustomerType, if(CL.customer='undefined', '', Cus.mobile) as CustomerMobile, if(CL.customer='undefined', '', Cus.email) as CustomerEmail, if(CL.customer='undefined', '', Cus.priority) as priority, if(CL.customer='undefined', '', Cus.address) as CustomerAddress, if(CL.customer='undefined', '', Cus.id) as CustomerId, CL.* from calls CL join customers Cus on CL.customer=Cus.id or CL.customer='undefined' join user U on CL.user=U.id where U.id='${req.body.user}' and CL.call_status='${req.body.call_status}' and U.company_id='${req.body.company_id}' and CL.created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by CL.id order by CL.id desc;`;
  pool.query(qry, function (error, result) {
    //console.log("qry>>", qry);
    if (error) {
      // //console.log("Error in n bound Details", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in Inbound Details", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/inbound", function (req, res, next) {
  //console.log("Request body>>305", req.body);
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const qry = `select call_status, count(call_status) as CallValue from calls where user='${req.body.user}' and company_id='${req.body.company_id}' and customer!='' and call_type='Inbound' and created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by call_status;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Inbound ===== 42", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in Inbound =====44", result);
      // //console.log("Result in Inbound =====130", result);
      var ReceivedValue = 0;
      result.map((item) => {
        //console.log("Item", item);
        ReceivedValue += item.CallValue;
        // //console.log("ReceivedValue============165", ReceivedValue);
        return ReceivedValue;
      });
      // //console.log("ReceivedValue=====135", ReceivedValue);
      let tempObj = { call_status: "Received", CallValue: ReceivedValue };
      result.push(tempObj);
      // //console.log("resultt==============133", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/outbound", function (req, res, next) {
  //console.log("Request body======92", req.body);
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const qry = `select call_status, count(call_status) as CallValue from calls where user='${req.body.user}' and company_id='${req.body.company_id}' and customer!='' and call_type='Outbound' and created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by call_status;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Outbound====== 96", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Outbound=============221", result);
      var contactedValue = 0;
      result.map((item) => {
        // //console.log("Item", item);
        contactedValue += item.CallValue;
        // //console.log("contactedValue===227", contactedValue);
        return contactedValue;
      });
      let tempObj = { call_status: "Contacted", CallValue: contactedValue };
      result.push(tempObj);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/recievedCalls", function (req, res, next) {
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const qry = `select C.*, U.name as UserName, Cus.firmname as firm_name, if(C.customer='undefined', 'Unknown Number', Cus.name) as CusName, Cus.firstname as FirstName, Cus.lastname as LastName, Cus.type as CustomerType, Cus.mobile as CustomerMobile, Cus.email as CustomerEmail, Cus.priority as priority, Cus.address as CustomerAddress, Cus.id as CustomerId from  calls as C join user as U on C.user=U.id join customers as Cus on C.customer=Cus.id or C.customer='undefined' where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and call_type='Inbound' and C.created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by C.id order by id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Received Calls", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in Recieved Calls", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/outboundContacted", function (req, res, next) {
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const qry = `select C.*, U.name as UserName, Cus.firmname as firm_name,if(C.customer='undefined', 'Unknown Number', Cus.name) as CusName, Cus.firstname as FirstName, Cus.lastname as LastName, Cus.type as CustomerType, Cus.mobile as CustomerMobile, Cus.email as CustomerEmail, Cus.address as CustomerAddress, Cus.priority as priority, Cus.id as CustomerId from calls as C join user as U on C.user=U.id join customers as Cus on C.customer=Cus.id or C.customer='undefined' where call_type='Outbound' and C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and C.created_at between '${FinalstartDayy}' and '${FinalendDayy}' group by C.id order by id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Contacted Calls", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in Contacted Calls", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/filter_calltype", function (req, res, next) {
  pool.query(
    "select name as type_id from disposition where company_id=? order by name;",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Data=========319", result);
        // var output = result[0].concat(result[1]);
        // //console.log("output:", output);
        res.status(200).json({
          status: true,
          result: result,
          message: "Record found successfully",
        });
      }
    }
  );
});

router.post("/filtering", function (req, res, next) {
  //console.log("Request body of disposition=======413", req.body);
  //console.log("req.body.disposition>>>>", req.body.disposition);
  let newStartDate = moment(req.body.startDate).format("YYYY-MM-DD");
  //console.log("newStartDate===416", newStartDate);
  let newEndDate = moment(req.body.endDate).format("YYYY-MM-DD");
  //console.log("newEndDate===418", newEndDate);
  if (
    req.body.disposition != "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.call_type != "" &&
    req.body.order != ""
  ) {
    //console.log("In If Part>>>425");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id  where date(CL.created_at) between '${newStartDate}' and '${newEndDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and disposition='${req.body.disposition}' and CL.call_type='${req.body.call_type}' order by C.name ${req.body.order};`;
  } else if (
    req.body.disposition == "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.call_type != "" &&
    req.body.order != ""
  ) {
    //console.log("at line 461");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id where date(CL.created_at) between '${newStartDate}' and '${newEndDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.call_type='${req.body.call_type}' order by C.name ${req.body.order};`;
  } else if (
    req.body.disposition == "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.call_type != "" &&
    req.body.order == ""
  ) {
    //console.log("at line 461");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id where date(CL.created_at) between '${newStartDate}' and '${newEndDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.call_type='${req.body.call_type}' order by CL.created_at asc;`;
  } else if (
    req.body.disposition == "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.call_type == "" &&
    req.body.order != ""
  ) {
    //console.log("at line 461");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id where date(CL.created_at) between '${newStartDate}' and '${newEndDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' order by C.name ${req.body.order};`;
  } else if (
    req.body.disposition != "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.call_type != "" &&
    req.body.order == ""
  ) {
    //console.log("In else If Part>>>504");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id  where date(CL.created_at) between '${newStartDate}' and '${newEndDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and disposition='${req.body.disposition}' and CL.call_type='${req.body.call_type}' order by CL.created_at asc;`;
  } else {
    //console.log("at 442 else");
    var qry = `select CL.* ,C.name as customer_name from calls as CL join customers as C on CL.customer=C.id where CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and disposition='${req.body.disposition}' and CL.call_type='${req.body.call_type}' order by C.name ${req.body.order};`;
  }
  pool.query(qry, function (error, result) {
    //console.log("qryyyyyDahboardFilter", qry);
    if (error) {
      //console.log("Error in Filter by A to Z", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result at line 454 no.", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

/// For Calender filtering

router.post("/calendarCalls", function (req, res, next) {
  var myDate = req.body.sDate;
  var newMyDate = myDate.split("T")[0];
  const qry = `select C.*, CUS.*, CUS.name as CustomerName,(select U.name from user U where U.id=T.team_head) as Manager_name, U.name as UserName from calls as C join customers as CUS on C.customer=CUS.id join user as U on C.user=U.id join team as T on CUS.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and C.created_at like '${newMyDate}%';`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in calendarCalls", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in calendarCalls", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/calenderSortingCalls", function (req, res, next) {
  const qry = `select CL.*,CUS.name as name , CUS.mobile from calls as CL join customers as CUS on CL.customer=CUS.id where CL.created_at between '${req.body.startDate}' and '${req.body.endDate}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' order by CUS.name ${req.body.order};`;
  //console.log("calendarCalls===401", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in calenderSortingCalls", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in calenderSortingCalls", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/inboundPanel", function (req, res, next) {
  const qry = `select CL.*, U.name as UserName, Com.name as CompanyName, CUS.name as CustomerName from  calls as CL join  user as U on CL.user=U.id join  company as Com on CL.company_id=Com.id join customers as CUS on CL.customer=CUS.id where CL.call_type='Inbound' order by CL.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Inbound of WebPanel ===== 263", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in Inbound of WebPanel =====268", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/talkTime", function (req, res, next) {
  var todayDate = moment().format("YYYY-MM-DD");
  var FinalstartDayy = moment().clone().startOf("week").format("YYYY-MM-DD");
  var FinalendDayy = moment()
    .clone()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  //console.log("FinalstartDayy>>>>", FinalstartDayy);
  //console.log("FinalendDayy>>>>", FinalendDayy);
  const qry = `select SEC_TO_TIME(Floor((avg(duration)))) as AverageTalkTime, sum(duration) as TotalTalkime from calls where user='${req.body.user}' and company_id='${req.body.company_id}' and created_at between '${FinalstartDayy}' and '${FinalendDayy}';`;
  // //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/totalTalkTime", function (req, res, next) {
  //console.log("Request body>>655", req.body);
  const qry = `select sum(duration) as TotalTalkime from calls where user='${req.body.user}' and company_id='${req.body.company_id}' and date(created_at)='${req.body.created_at}';`;

  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in totalTalkTime 660", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      var TotalTalkTime = result[0].TotalTalkime;
      var TotalTalkTimeformatted = moment
        .utc(TotalTalkTime * 1000)
        .format("HH:mm:ss");
      //console.log("Result in totalTalkTime 665", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        TotalTalkTimeformatted,
      });
    }
  });
});

router.post("/rangeSearchPanelInbound", function (req, res, next) {
  let startDateAhead = moment(req.body.startDate)
    .subtract(1, "d")
    .format("YYYY-MM-DD HH:mm:ss");
  //console.log("startDateAhead142hhhhhh=ghghgh==", startDateAhead);

  let EndDateAhead = moment(req.body.endDate)
    .add(1, "d")
    .format("YYYY-MM-DD HH:mm:ss");
  //console.log("startDateAhead146666===", EndDateAhead);
  const qry = `select CL.*, U.name as UserName, Com.name as CompanyName, CUS.name as CustomerName from  calls as CL join  user as U on CL.user=U.id join  company as Com on CL.company_id=Com.id join  customers as CUS on CL.customer=CUS.id where CL.created_at between '${startDateAhead}' and '${EndDateAhead}' and CL.call_type='Inbound' order by CL.id desc`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in rangeSearchPanelInbound", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in rangeSearchPanelInbound", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/lastmonthCSRDetails", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startOfMonth = moment()
    .clone()
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");

  var endOfMonth = moment()
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  const qry = `select SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(C.duration)))),'.',1) as AverageTalkTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(C.duration)))),'.',1) as TotalTalkTime,(select sum(duration) from attendence A where A.user_id='${req.body.user}' and A.company_id='${req.body.company_id}' and A.date between '${startOfMonth}' and '${endOfMonth}' and not out_time="00:00:00") as totalAttendance ,(Select SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(B.duration)))),'.',1) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreak,(Select sum(B.duration) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreakInNumber,(Select SUBSTRING_INDEX(SEC_TO_TIME(floor(AVG(TIME_TO_SEC(A.duration)))),'.',1) from attendence A where A.user_id=C.user and A.status='out' and A.date between '${startOfMonth}' and '${endOfMonth}') as AverageClockInTime from calls C where user='${req.body.user}' and company_id='${req.body.company_id}' and SUBSTRING_INDEX(created_at,' ',1) between '${startOfMonth}' and '${endOfMonth}'`;
  // //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result);

      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post(
  "/Filtercurrentmonth/:customer/:company_id",
  function (req, res, next) {
    pool.query(
      `select call_status,created_at from calls where customer="${req.params.customer}" and company_id ="${req.params.company_id}" and date(created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by call_status;select count(*) as count,call_status,CAST(created_at AS DATE) as created_at from calls  where customer= "${req.params.customer}"and company_id= "${req.params.company_id}" and date(created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by  call_status,CAST(created_at AS DATE) order by CAST(created_at AS DATE);`,
      function (error, result) {
        if (error) {
          res.status(500).json({ status: false, message: error.sqlMessage });
        } else {
          var keysObj = {};
          result[0].map((item) => {
            if (!keysObj[item.call_status]) {
              keysObj[item.call_status] = 0;
            }
          });
          //console.log("ddatttee", keysObj);
          var obj = {};
          result[1].map((item) => {
            if (!obj[item.created_at]) {
              obj[item.created_at] = { ...keysObj };
            }
            obj[item.created_at] = {
              ...obj[item.created_at],
              [item.call_status]: item.count,
            };
          });
          res.status(200).json({
            status: true,
            keys: Object.keys(keysObj),
            data: obj,
            message: "Current Month Calls",
          });
        }
      }
    );
  }
);

router.post("/last3monthCSRDetails", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startOfMonth = moment()
    .clone()
    .subtract(3, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  var endOfMonth = moment()
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  const qry = `select SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(C.duration)))),'.',1) as AverageTalkTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(C.duration)))),'.',1) as TotalTalkTime,(select sum(duration) from attendence A where A.user_id='${req.body.user}' and A.company_id='${req.body.company_id}' and A.date between '${startOfMonth}' and '${endOfMonth}' and not out_time="00:00:00") as totalAttendance ,(Select SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(B.duration)))),'.',1) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreak,(Select sum(B.duration) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreakInNumber,(Select SUBSTRING_INDEX(SEC_TO_TIME(floor(AVG(TIME_TO_SEC(A.duration)))),'.',1) from attendence A where A.user_id=C.user and A.status='out' and A.date between '${startOfMonth}' and '${endOfMonth}') as AverageClockInTime from calls C where user='${req.body.user}' and company_id='${req.body.company_id}' and SUBSTRING_INDEX(created_at,' ',1) between '${startOfMonth}' and '${endOfMonth}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result);

      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/insertMissedCalls", (req, res) => {
  //console.log("req.body===625555=>>>>>", req.body);
  const format = "YYYY-MM-DD HH:mm:ss";
  var dateTime = moment().format(format);
  pool.query(
    `insert into calls set call_type='Inbound',duration='0',customer='${
      req.body.customer
    }',recording_url='',user='${
      req.body.userId
    }',user_note='',disposition='',created_at='${dateTime}',company_id='${
      req.body.companyId
    }',call_status='Missed',task_id='${null}', unknown_number='${
      req.body.UnknownNumber
    }'`,
    (err, reslt) => {
      if (err) {
        //console.log("Error in insertMissedCalls =====>>627===>>", err);
        return res
          .status(400)
          .json({ status: false, message: "err occurred", err });
      } else {
        return res.status(200).json({
          status: true,
          message: "Missed call data submitted",
          reslt,
        });
      }
    }
  );
});

// //console.log('req.body===625555=>>>>>',req.body)
router.post("/insertNotConnectedCalls", (req, res) => {
  //console.log("req.body===625555=>>>>>", req.body);
  const format = "YYYY-MM-DD HH:mm:ss";
  if (!req.body.UnknownNumber.startsWith("+91")) {
    var mobileWithC_Code = "+91" + req.body.UnknownNumber;
  } else {
    var mobileWithC_Code = req.body.UnknownNumber;
  }
  var dateTime = moment().format(format);
  router.post("/insertMissedCalls", (req, res) => {
    //console.log("req.body===625555=>>>>>", req.body);
    const format = "YYYY-MM-DD HH:mm:ss";
    var dateTime = moment().format(format);
    // //console.log('dateTime>>>>>>>>>81', dateTime) ;
    pool.query(
      `insert into calls set call_type='Outbound',duration='0',customer='${
        req.body.customer
      }',recording_url='',user='${
        req.body.userId
      }',user_note='',disposition='',created_at='${dateTime}',company_id='${
        req.body.companyId
      }',call_status='Not Connected',task_id='${null}', unknown_number='${mobileWithC_Code}'`,
      (err, reslt) => {
        if (err) {
          // //console.log("Error in insertMissedCalls =====>>627===>>", err);
          return res
            .status(400)
            .json({ status: false, message: "err occurred", err });
        } else {
          return res.status(200).json({
            status: true,
            message: "Not Connected data submitted",
            reslt,
          });
        }
      }
    );
  });
  // //console.log('req.body===625555=>>>>>',req.body)

  pool.query(
    `insert into calls set call_type='Outbound',duration='0',customer='${
      req.body.customer
    }',recording_url='',user='${
      req.body.userId
    }',user_note='',disposition='',created_at='${dateTime}',company_id='${
      req.body.companyId
    }',call_status='Not Connected',task_id='${null}', unknown_number='${mobileWithC_Code}'`,
    (err, reslt) => {
      if (err) {
        // //console.log("Error in insertMissedCalls =====>>627===>>", err);
        return res
          .status(400)
          .json({ status: false, message: "err occurred", err });
      } else {
        return res.status(200).json({
          status: true,
          message: "Not Connected data submitted",
          reslt,
        });
      }
    }
  );
});

// Average TalkTime for Penal
router.post("/weekAverageTalkTime", function (req, res, next) {
  //console.log("Request body>>>", req.body);
  var startDay = moment().subtract(1, "week").startOf("week");
  var endDay = moment().subtract(1, "week").endOf("week");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  // //console.log("FinalstartDay", FinalstartDay);
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  // //console.log("FinalstartDayy===402", FinalstartDayy);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  // //console.log("FinalEndDay", FinalendDay);
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  // //console.log("FinalEndDayy===407", FinalendDayy);

  const qry = `select avg(duration) as AverageTalkTime, sum(duration) as TotalTalkime from calls where company_id='${req.body.company_id}' and created_at between '${FinalstartDayy}' and '${FinalendDayy}';`;
  pool.query(qry, function (error, result) {
    // //console.log("QRY===478", qry);
    if (error) {
      // //console.log("Error in TalkTime ===== 459", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in TalkTime =====471", result);
      // //console.log(
      //   "Result in AverageTalkTime =====472",
      //   result[0].AverageTalkTime
      // );
      // //console.log("Result in TotalTalkTime =====473", result[0].TotalTalkime);
      var TotalTalkTime = result[0].TotalTalkime;
      var TotalTalkTimeformatted = moment
        .utc(TotalTalkTime * 1000)
        .format("HH:mm:ss");
      // //console.log("TotalTalkTimeformatted====476", TotalTalkTimeformatted);
      var AverageTalkTime = result[0].AverageTalkTime;
      var AverageTalkTimeFormatted = moment
        .utc(AverageTalkTime * 1000)
        .format("HH:mm:ss");
      // //console.log("AverageTalkTimeFormatted====479", AverageTalkTimeFormatted);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        AverageTalkTimeFormatted,
        TotalTalkTimeformatted,
      });
    }
  });
});

router.get("/display/:user_id/:company_id", function (req, res, next) {
  //console.log("in calls req for new penal");
  const qry = `select C.*, (select Cus.name from customers Cus where C.customer=Cus.id) as CustomerName from calls C where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" order by C.id desc;      select C.id as ID, C.call_type as CallType, (select Cus.name from customers Cus where C.customer=Cus.id) as CustomerName, C.created_at as CallDateTime, if(C.duration, sec_to_time(C.duration), "00:00:00") as Duration, C.user_note as Note, C.call_status as Status, C.disposition as Disposition from calls C where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" order by C.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      let tempData = result[0];
      let tempExcel = result[1];
      let Data = [tempData];
      let Excel = [tempExcel];
      return res
        .status(200)
        .json({ status: true, message: "Call Data found!", Data, Excel });
    }
  });
});

router.post("/newPenalFilterInCalls/:company_id", function (req, res, next) {
  //console.log("req body in calls filter for new penal", req.body);
  const qry = `select CL.call_type, U.name as UserName, CUS.name as CustomerName, CL.created_at as CallDateTime, sec_to_time(CL.duration), CL.user_note,CL.call_status, CL.disposition, CL.unknown_number, CL.case_number, CUS.mobile as CustomerMobile from calls as CL left join user as U on CL.user=U.id left join company as Com on CL.company_id=Com.id left join customers as CUS on CL.customer=CUS.id where CL.company_id="${req.params.company_id}" and date(CL.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by CL.id desc;  select CL.*, U.name as UserName, CUS.name as CustomerName, CUS.mobile as CustomerMobile from calls as CL left join user as U on CL.user=U.id left join company as Com on CL.company_id=Com.id left join customers as CUS on CL.customer=CUS.id where CL.company_id="${req.params.company_id}" and date(CL.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by CL.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Calls ======== 29", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Calls ========== 30", result);
      var tempExcelData = result[0];
      var tempData = result[1];
      var excelData = [tempExcelData];
      var CallData = [tempData];
      return res.status(200).json({
        status: true,
        data: excelData,
        CallData,
        message: "Call Data found!",
      });
    }
  });
});

router.get("/newPenalAnsweredAndMissed/:company_id", function (req, res, next) {
  const qry = `select * from calls where call_status='Answered' and company_id="${req.params.company_id}" order by id desc;select * from calls where call_status='Missed' and company_id="${req.params.company_id}" order by id desc; select * from calls where call_status='Connected' and company_id="${req.params.company_id}" order by id desc; select * from calls where call_status='Not Connected' and company_id="${req.params.company_id}" order by id desc; select * from calls where company_id="${req.params.company_id}" order by id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Answered & Missed", error);
      return res
        .status(400)
        .json({ status: false, message: "Bad Request", error });
    } else {
      // //console.log("Result in Answered & Missed", result);
      var tempAnswered = result[0];
      var tempMissed = result[1];
      var Answered = [tempAnswered];
      var Missed = [tempMissed];
      var tempConnected = result[2];
      var tempNotConnected = result[3];
      var Connected = [tempConnected];
      var NotConnected = [tempNotConnected];
      var tempTotalCalls = result[4];
      var TotalCalls = [tempTotalCalls];
      return res.status(200).json({
        status: true,
        message: "Record Found",
        Missed,
        Answered,
        Connected,
        NotConnected,
        TotalCalls,
      });
    }
  });
});

router.post("/callstatus", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  var newDateTo = moment(d2).add(1, "days").format("YYYY-MM-DD");
  //console.log("NEW DATE TO", newDateTo);
  const qry = `SELECT * FROM calls where disposition in ${req.body.disposition} and created_at between '${d1}' and '${newDateTo}' and user='${req.body.user}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/CompanyCallstatus", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  var newDateTo = moment(d2).add(1, "days").format("YYYY-MM-DD");
  //console.log("NEW DATE TO", newDateTo);
  const qry = `SELECT * FROM calls where disposition in ${req.body.disposition} and created_at between '${d1}' and '${newDateTo}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result.length);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/Attendance", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM attendence where date between '${d1}' and '${d2}' and user_id= '${req.body.user}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 259 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====269", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/callLogs", function (req, res, next) {
  //console.log("Request Body in Call Logs", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM calls where created_at between '${d1}' and '${d2}' and user='${req.body.user}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/monthCSRDetails", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startOfMonth = moment().clone().startOf("month").format("YYYY-MM-DD");
  var endOfMonth = moment().clone().endOf("month").format("YYYY-MM-DD");
  const qry = `select SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(C.duration)))),'.',1) as AverageTalkTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(C.duration)))),'.',1) as TotalTalkTime,(select sum(duration) from attendence A where A.user_id='${req.body.user}' and A.company_id='${req.body.company_id}' and A.date between '${startOfMonth}' and '${endOfMonth}' and not out_time="00:00:00") as totalAttendance ,(Select SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(B.duration)))),'.',1) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreak,(Select sum(B.duration) from break B where B.created_at in (select created_at from break where created_at between '${startOfMonth}' and '${endOfMonth}' ) and B.attendance_id in (Select id from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' group by date)) as TotalBreakInNumber,(Select SUBSTRING_INDEX(SEC_TO_TIME(floor(AVG(TIME_TO_SEC(A.duration)))),'.',1) from attendence A where A.user_id=C.user and A.status='out' and A.date between '${startOfMonth}' and '${endOfMonth}') as AverageClockInTime from calls C where user='${req.body.user}' and company_id='${req.body.company_id}' and SUBSTRING_INDEX(created_at,' ',1) between '${startOfMonth}' and '${endOfMonth}'`;
  // //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/callLogsD", function (req, res, next) {
  //console.log("Request Body in Call Logs Customer D", req.body);
  const qry = `SELECT C.*,concat(substring_index(SUBSTRING_INDEX(C.created_at,' ',1),'-',-1),' ',Substring(monthname(SUBSTRING_INDEX(C.created_at,' ',1)),1,3)) as date,time_format(substring_index(SUBSTRING_INDEX(C.created_at,' ',-1),':',2),'%h:%i %p') as time,(select Cs.name from customers Cs where Cs.id=C.customer) as CustomerName,(select Cs.mobile from customers Cs where Cs.id=C.customer) as CustomerMobile,(select U.name from user U where U.id=C.user) as UserName FROM calls C where SUBSTRING_INDEX(C.created_at,' ',1)=curdate() and C.user='${req.body.user}' and C.company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.get(
  "/CallsReportDataNewPenalDisplay/:company_id",
  function (req, res, next) {
    //console.log(
    //   "req body in calls CallsReportDataNewPenalDisplay for new penal"
    // );
    const qry = `select CL.id, CL.call_type, U.name as Executive, CUS.name as CustomerName, CL.created_at as CallDateTime, sec_to_time(CL.duration) as Duration, CL.user_note as Notes,CL.call_status as Status, CL.disposition as Disposition, CL.unknown_number, CL.case_number, CUS.mobile as CustomerMobile from calls as CL left join user as U on CL.user=U.id left join customers as CUS on CL.customer=CUS.id where CL.company_id="${req.params.company_id}" group by CL.id order by CL.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Calls ======== 29", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        console.log("Result in Calls ========== 30", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Call Data found!" });
      }
    });
  }
);

router.post("/teamcallLogs", function (req, res, next) {
  //console.log("Request Body in Call Logs", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM calls where created_at between '${d1}' and '${d2}' and company_id='${req.body.company_id}' and user in ( select id from user where team_id='${req.body.team}')`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/companyCallLogs", function (req, res, next) {
  //console.log("COMPANY CALL LOGS BODY>>>>>>>>>>>>>>", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM calls where created_at between '${d1}' and '${d2}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/teamcallstatus", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  var newDateTo = moment(d2).add(1, "days").format("YYYY-MM-DD");
  const qry = `SELECT * FROM calls where disposition in ${req.body.disposition} and created_at between '${d1}' and '${newDateTo}' and company_id='${req.body.company_id}' and user in ( select id from user where team_id='${req.body.team}')`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 252 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====241", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/TeamAttendance", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM attendence where date between '${d1}' and '${d2}' and team_id= '${req.body.team}' and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 259 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====269", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.post("/CompanyAttendance", function (req, res, next) {
  //console.log("COMPANY ATTENDANCE BODY>>>>>>>>>>>>>>>>>>>>>>", req.body);
  var dateFrom = req.body.dateFrom.split("T");
  var dateTo = req.body.dateTo.split("T");
  //console.log("date", dateFrom[0], dateTo[0]);
  var d1 = dateFrom[0];
  var d2 = dateTo[0];
  const qry = `SELECT * FROM attendence where date between "${d1}" and "${d2}" and company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 259 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====269", result);
      return res.status(200).json({
        status: true,
        result,
      });
    }
  });
});

router.get(
  `/managerPenalTeamMemberCalls/:company_id/:manager_id/:team_id`,
  function (req, res, next) {
    let qry = `select CL.*, T.team_name from calls CL join user U on CL.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and CL.call_status='Connected' and U.Company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by CL.id; select CL.*, T.team_name from calls CL join user U on CL.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and CL.call_status='Not Connected' and U.Company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by CL.id; select CL.*, T.team_name from calls CL join user U on CL.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and CL.call_status='Missed' and U.Company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by CL.id; select CL.*, T.team_name from calls CL join user U on CL.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and CL.call_status='Answered' and U.Company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by CL.id; select CL.*, T.team_name from calls CL join user U on CL.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and U.Company_id="${req.params.company_id}" and T.id="${req.params.team_id}" group by CL.id;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenalTeamMemberCalls", error);
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalTeamMemberCalls", result);
        let tempCon = result[0];
        let tempNotCon = result[1];
        let tempMis = result[2];
        let tempAns = result[3];
        let tempTotal = result[4];
        let Connected = [tempCon];
        let NotConnected = [tempNotCon];
        let Missed = [tempMis];
        let Answered = [tempAns];
        let TotalCalls = [tempTotal];
        return res.status(200).json({
          status: true,
          message: "Record found",
          Connected,
          NotConnected,
          Missed,
          Answered,
          TotalCalls,
        });
      }
    });
  }
);

router.get(
  "/managerPenalAnsweredAndMissed/:company_id/:manager_id",
  function (req, res, next) {
    const qry = `select CL.*, U.name, U.team_id, Tm.team_name from calls CL join user U on CL.user=U.id join team Tm on U.team_id=Tm.id where Tm.team_head="${req.params.manager_id}" and CL.call_status='Connected' and CL.company_id="${req.params.company_id}" group by CL.id; select CL.*, U.name, U.team_id, Tm.team_name from calls CL join user U on CL.user=U.id join team Tm on U.team_id=Tm.id where Tm.team_head="${req.params.manager_id}" and CL.call_status='Not Connected' and CL.company_id="${req.params.company_id}" group by CL.id; select CL.*, U.name, U.team_id, Tm.team_name from calls CL join user U on CL.user=U.id join team Tm on U.team_id=Tm.id where Tm.team_head="${req.params.manager_id}" and CL.call_status='Answered' and CL.company_id="${req.params.company_id}" group by CL.id; select CL.*, U.name, U.team_id, Tm.team_name from calls CL join user U on CL.user=U.id join team Tm on U.team_id=Tm.id where Tm.team_head="${req.params.manager_id}" and CL.call_status='Missed' and CL.company_id="${req.params.company_id}" group by CL.id; select CL.*, U.name, U.team_id, Tm.team_name from calls CL join user U on CL.user=U.id join team Tm on U.team_id=Tm.id where Tm.team_head="${req.params.manager_id}" and CL.company_id="${req.params.company_id}" group by CL.id;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in Answered & Missed", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        // //console.log("Result in Answered & Missed", result);
        var tempAnswered = result[2];
        var tempMissed = result[3];
        var Answered = [tempAnswered];
        var Missed = [tempMissed];
        var tempConnected = result[0];
        var tempNotConnected = result[1];
        var Connected = [tempConnected];
        var NotConnected = [tempNotConnected];
        var tempTotalCalls = result[4];
        var totalCalls = [tempTotalCalls];
        return res.status(200).json({
          status: true,
          message: "Record Found",
          Missed,
          Answered,
          Connected,
          NotConnected,
          totalCalls,
        });
      }
    });
  }
);

router.get(
  "/managerPenalCallsReport/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("req body in calls display for manager penal");
    const qry = `select CL.id, CL.call_type, U.name as UserName, CUS.name as CustomerName, CL.created_at as CallDateTime, sec_to_time(CL.duration) as duration, CL.user_note, CL.disposition, CL.call_status, CL.unknown_number, CL.case_number, CUS.mobile as CustomerMobile from calls as CL join user as U on CL.user=U.id left join customers as CUS on CL.customer=CUS.id join team T on U.team_id=T.id where CL.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" group by CL.id order by CL.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Calls ======== 29", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Calls ========== 30", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Call Data found!" });
      }
    });
  }
);

router.post(
  "/managerPenalFilterCallsReport/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("req body in calls display for manager filter penal", req.body);
    const qry = `select CL.id as Id, CL.call_type as CallType, U.name as UserName, CUS.name as CustomerName, CL.created_at as CallDateTime, sec_to_time(CL.duration) as duration, CL.user_note, CL.disposition, CL.call_status, CL.unknown_number, CL.case_number, CUS.mobile as CustomerMobile from calls as CL join user as U on CL.user=U.id left join customers as CUS on CL.customer=CUS.id join team T on U.team_id=T.id where CL.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and date(CL.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by CL.id order by CL.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Calls ======== 29", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Calls ========== 30", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Call Data found!" });
      }
    });
  }
);

router.post("/FilterDisplay/:user_id/:company_id", function (req, res, next) {
  //console.log("in calls FilterDisplay req for new penal", req.body);
  const qry = `select C.*, (select Cus.name from customers Cus where C.customer=Cus.id) as CustomerName from calls C where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" and C.created_at between "${req.body.startDate}" and "${req.body.endDate}" order by C.id desc; select C.id as ID, C.call_type as CallType, (select Cus.name from customers Cus where C.customer=Cus.id) as CustomerName, C.created_at as CallDateTime, if(C.duration, sec_to_time(C.duration), "00:00:00") as Duration, C.user_note as Note, C.call_status as Status, C.disposition as Disposition from calls C where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" and C.created_at between "${req.body.startDate}" and "${req.body.endDate}" order by C.id desc`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      var tempData = result[0];
      var tempExcel = result[1];
      var resultData = [tempData];
      var excelData = [tempExcel];
      return res.status(200).json({
        status: true,
        resultData,
        excelData,
        message: "Call Data found!",
      });
    }
  });
});

router.get(
  "/FilterSalesExecutive/:company_id/:user_id",
  function (req, res, next) {
    const qry = `select CL.*, U.name as UserName, CUS.name as CustomerName, CUS.mobile as CustomerMobile from calls as CL left join user as U on CL.user=U.id left join customers as CUS on CL.customer=CUS.id where CL.company_id="${req.params.company_id}" and CL.user="${req.params.user_id}" group by CL.id order by CL.id desc;  select CL.call_type, U.name as Executive, CUS.name as CustomerName, CL.created_at as CallDateTime, sec_to_time(CL.duration) as Duration, CL.user_note as Notes,CL.call_status as Status, CL.disposition as Disposition, CL.unknown_number, CL.case_number, CUS.mobile as CustomerMobile from calls as CL left join user as U on CL.user=U.id left join customers as CUS on CL.customer=CUS.id where CL.company_id="${req.params.company_id}" and CL.user="${req.params.user_id}" group by CL.id order by CL.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in FilterSalesExecutive", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        let tempAllData = result[0];
        let tempExcelData = result[1];
        let AllData = [tempAllData];
        let ExcelData = [tempExcelData];
        return res
          .status(200)
          .json({ status: true, message: "record found", AllData, ExcelData });
      }
    });
  }
);

module.exports = router;
