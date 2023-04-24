var express = require("express");
var router = express.Router();
var pool = require("./pool");
var multer = require("./config/multer");
const moment = require("moment");
const readXlsxFile = require("read-excel-file/node");
const cron = require("node-cron");

router.post("/add_new_task_data", function (req, res, next) {
  pool.query(
    "insert into task(status, customer, note, mobile, created_at, updated_at, company_id, refrence_from, task_type, create_customer_profile, csr_read_profile, priority, task_created_by, task_added_date)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.statusid,
      req.body.customerid,
      req.body.note,
      req.body.mobile,
      req.body.createdat,
      req.body.updatedat,
      req.body.companyid,
      req.body.refrencefrom,
      req.body.tasktypeid,
      req.body.createcustomerprofile,
      req.body.csrreadprofile,
      req.body.priorityid,
      req.body.taskcreatedby,
      req.body.taskaddeddate,
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

router.get("/display_all_task_data", function (req, res, next) {
  pool.query("select * from task", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_task_data", function (req, res, next) {
  pool.query(
    "update task set status=?, customer=?, note=?, mobile=?, created_at=?, updated_at=?, company_id=?, refrence_from=?, task_type=?, create_customer_profile=?, csr_read_profile=?, priority=?, task_created_by=?, task_added_date=? where id=?",
    [
      req.body.statusid,
      req.body.customerid,
      req.body.note,
      req.body.mobile,
      req.body.createdat,
      req.body.updatedat,
      req.body.companyid,
      req.body.refrencefrom,
      req.body.tasktypeid,
      req.body.createcustomerprofile,
      req.body.csrreadprofile,
      req.body.priorityid,
      req.body.taskcreatedby,
      req.body.taskaddeddate,
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

router.post("/delete_task", function (req, res, next) {
  pool.query(
    "delete from task where id=?",
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

router.get("/display_all_customer", function (req, res, next) {
  pool.query("select * from customers", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/display_all_status_by_taskstatus", function (req, res, next) {
  pool.query("select * from taskstatus", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/display_all_tasktype", function (req, res, next) {
  pool.query("select * from tasktype", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/display_all_priority", function (req, res, next) {
  pool.query(
    "select * from priority where id=?",
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

router.post("/delete_all_task", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from task where id in (?)",
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
  res.render("task");
});

router.post("/add", function (req, res, next) {
  // //console.log("Request Body In Single Task=======14", req.body);
  const qry = `insert into task set firstname="${req.body.firstname}", lastname="${req.body.lastname}", status="${req.body.status}", customer="${req.body.customer}", user="${req.body.user}", note="${req.body.note}", mobile="${req.body.mobile}", created_at="${req.body.created_at}", company_id="${req.body.company_id}", refrence_from="${req.body.refrence_from}", task_type="${req.body.task_type}", priority="${req.body.priority}", task_created_by="${req.body.task_created_by}", task_added_date="${req.body.task_added_date}";`;
  pool.query(qry, req.body, function (error, result) {
    if (error) {
      // //console.log("Error In SignleTaskResult===========17", error);
      res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      res.status(200).json({
        status: true,
        message: "Task added successfully",
        result,
      });
    }
  });
});

router.post(`/filtersInTask/:company_id`, function (req, res, next) {
  //console.log("Request body in task filters for new penal", req.body);
  var qry = ` select T.firstname, T.lastname, T.mobile, T.created_at as TaskDateTime, U.name as UserName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.created_at as AddedOn, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id=${req.params.company_id} and date(T.task_added_date) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc; select T.*, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, U.name as UserName, (select TM.team_name from team TM where U.team_id=TM.id) as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id=${req.params.company_id} and date(T.task_added_date) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in task filter", error);
      return res
        .status(400)
        .json({ status: false, message: error.sqlMessage, error });
    } else {
      // //console.log("result in task filter", result);
      var tempExcelData = result[0];
      var tempData = result[1];
      var ExcelData = [tempExcelData];
      var resultt = [tempData];
      return res
        .status(200)
        .json({ status: true, message: "Record found", resultt, ExcelData });
    }
  });
});

router.post("/taskList", function (req, res, next) {
  var TodayDate = moment().format("YYYY-MM-DD");
  //console.log("TaskDate>>>>>>>>>>", TodayDate);
  var qry = `select T.*, T.note as Task_Note, U.name as UserName, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.email from user U where U.id=T.task_created_by) as Task_Creator_email,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as taskStatus, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.user='${req.body.user}' order by T.created_at asc LIMIT ${req.body.limit} OFFSET ${req.body.offset};`;
  pool.query(qry, function (error, result) {
    //console.log("qry>>>>>", qry);
    if (error) {
      // //console.log("Error in Task List", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Task List", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/taskListLength", function (req, res, next) {
  //console.log("at line no. 141===>>>");
  var TodayDate = moment().format("YYYY-MM-DD HH:mm:ss");
  var qry = `select T.*, U.name as UserName, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.email from user U where U.id=T.task_created_by) as Task_Creator_email,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as taskStatus, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.user='${req.body.user}' order by T.created_at asc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Task List", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Task List", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

router.post("/taskTypeDetailLength", function (req, res, next) {
  var TodayDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const qry = `select T.*, U.name as UserName, C.name as CustomerName, U.email as Task_Creator_email, C.firmname as firm_name, C.email as cus_email,C.mobile as cus_mobile,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select TP.task_status from taskpriority TP where T.status=TP.task_priority_id) as taskStatus, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.task_type='${req.body.task_type}' order by T.created_at desc`;

  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in taskTypeDetailForTasks", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in taskTypeDetailForTasks", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

//// for new task counts on dashboard

router.post("/AllTaskListCount", function (req, res, next) {
  const qry = `select TT.task_type,TT.task_type_id, count(TT.task_type) as Count from task T, tasktype TT where T.task_type=TT.task_type_id and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' group by task_type;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in All Task List", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in All Task List", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/taskTypeDetailForTasks", function (req, res, next) {
  var TodayDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const qry = `select T.*, U.name as UserName, T.note as Task_Note, C.name as CustomerName, U.email as Task_Creator_email, C.firmname as firm_name, C.email as cus_email,C.mobile as cus_mobile,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select TP.task_status from taskpriority TP where T.status=TP.task_priority_id) as taskStatus, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.task_type='${req.body.task_type}' order by T.created_at desc LIMIT ${req.body.limit} OFFSET ${req.body.offset}`;

  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in taskTypeDetailForTasks", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in taskTypeDetailForTasks", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

/// Task Assign Excel Upload Sheet

router.post(
  "/UploadExcel",
  multer.single("taskExcel"),
  function (req, res, next) {
    //console.log("Request Body In Excel", req.body);
    //console.log("Request file In Excel", req.file);
    readXlsxFile("public/images/" + req.file.filename).then((rows) => {
      // //console.log("Rows in Route...", rows);
      rows.shift();
      // //console.log("Rows in Route of Shift =========97...", rows);
      var qry = "";
      if (rows.length != 0) {
        rows.map((item) => {
          var str = "'" + item.join("','") + "'";

          var now = moment();
          var tempDate = str.split(",")[7];
          var momentDate = moment(tempDate)
            .set({
              hour: now.hour(),
              minute: now.minute(),
              second: now.second(),
            })
            .format("YYYY-MM-DD hh:mm:ss");
          dateFormat = `'${momentDate}'`;
          str = str.split(",");
          str[7] = dateFormat;
          str = str.join();

          if (!str.split(",")[2].startsWith("+91")) {
            var k = str.split(",")[6];
            k = k.replace(/['"]+/g, "");
            mob = `'+91${k}'`;
            str = str.split(",");
            str[6] = mob;
            str = str.join();
          }
          qry += `INSERT INTO task(firstname,lastname,status,customer,user,note,mobile,created_at,updated_at,company_id, refrence_from,task_type, priority, task_created_by) VALUES(${str});`;
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
        });
      }
    });
  }
);
// 18 may

router.post("/calendarTasks", function (req, res, next) {
  var myDate = req.body.sDate;
  var newMyDate = myDate.split("T")[0];
  var TodayDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const qry = `select TT.*, TT.id as idd, CUS.*, TT.created_at as TaskCreatedDate, CUS.name as CustomerName, CUS.email as cus_email, CUS.mobile as cus_mobile, TT.note as Task_Note, TT.firstname as TaskFirstName, TT.lastname as TaskLastName,(select U.name from user U where U.id=T.team_head) as Manager_name, (select TS.task_status from taskstatus TS where TS.taskstatus_id=TT.status) as taskStatus, (select U.name from user U where U.id=TT.task_created_by) as Task_Creator,(select T.task_type from tasktype T where T.task_type_id=TT.task_type) as task_type, U.name as UserName,(select TP.color from taskpriority TP where TT.priority=TP.task_priority_id) as TaskColor, (select U.name from user U where U.id=TT.task_created_by) as Task_Creator,(select U.email from user U where U.id=TT.task_created_by) as Task_Creator_email, (select U.mobile from user U where U.id=TT.task_created_by) as Task_Creator_mobile,(select TP.taskpriority from taskpriority TP where TT.priority=TP.task_priority_id) as TaskPriority from task as TT join customers as CUS on TT.customer=CUS.id join user as U on TT.user=U.id join team as T on CUS.team_id=T.id where TT.user='${req.body.user}' and TT.company_id='${req.body.company_id}' and TT.created_at like '${newMyDate}%';`;

  //console.log("calendarCalls===377", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in calendarCalls", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in calendarCalls", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

// 18-may-2022
router.post("/calenderSortingTasks", function (req, res, next) {
  //console.log("Request body in calenderSortingCalls===396", req.body);
  var FinalstartDay = moment(req.body.startDate).format("YYYY-MM-DD");
  var FinalendDay = moment(req.body.endDate).format("YYYY-MM-DD");
  var selectedStartDate = moment(new Date()).format("YYYY-MM-DD");
  var selectedEndDate = moment(new Date()).format("YYYY-MM-DD");
  if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != "" &&
    req.body.disposition != ""
  ) {
    //console.log("in ifff>>>340");
    var qry = `select T.*, T.created_at as TaskCreatedDate, CUS.name as name, T.note as Task_Note, CUS.email as cus_email, (select U.name from user U where U.id=T.task_created_by) as Task_Creator, (select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select U.email from user U where U.id=T.task_created_by) as Task_Creator_email, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as disposition, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TP.color from taskpriority TP where TP.task_priority_id=T.priority) as TaskColor, CUS.mobile as cus_mobile from task as T join customers as CUS on T.customer=CUS.id where date(T.created_at) between '${FinalstartDay}' and '${FinalendDay}' and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' and T.task_type='${req.body.disposition}' order by CUS.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order == "" &&
    req.body.disposition == ""
  ) {
    //console.log("in elseeeee if>>>350");
    var qry = `select T.*, T.created_at as TaskCreatedDate, T.note as Task_Note, CUS.name as name, CUS.email as cus_email, (select U.name from user U where U.id=T.task_created_by) as Task_Creator, (select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select U.email from user U where U.id=T.task_created_by) as Task_Creator_email, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as disposition, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TP.color from taskpriority TP where TP.task_priority_id=T.priority) as TaskColor, CUS.mobile as cus_mobile from task as T join customers as CUS on T.customer=CUS.id where date(T.created_at) between '${FinalstartDay}' and '${FinalendDay}' and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' order by TaskCreatedDate desc`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != "" &&
    req.body.disposition == ""
  ) {
    //console.log("in elseeeee if>>>360");
    var qry = `select T.*, T.created_at as TaskCreatedDate, CUS.name as name, T.note as Task_Note, CUS.email as cus_email, (select U.name from user U where U.id=T.task_created_by) as Task_Creator, (select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select U.email from user U where U.id=T.task_created_by) as Task_Creator_email, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as disposition, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TP.color from taskpriority TP where TP.task_priority_id=T.priority) as TaskColor, CUS.mobile as cus_mobile from task as T join customers as CUS on T.customer=CUS.id where date(T.created_at) between '${FinalstartDay}' and '${FinalendDay}' and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' order by CUS.name ${req.body.order};`;
  } else if (
    selectedStartDate != "" &&
    selectedEndDate != "" &&
    req.body.order == "" &&
    req.body.disposition != ""
  ) {
    //console.log("in elseeeee if>>>370");
    var qry = `select T.*, T.created_at as TaskCreatedDate, CUS.name as name, T.note as Task_Note, CUS.email as cus_email, (select U.name from user U where U.id=T.task_created_by) as Task_Creator, (select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select U.email from user U where U.id=T.task_created_by) as Task_Creator_email, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as disposition, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TP.color from taskpriority TP where TP.task_priority_id=T.priority) as TaskColor, CUS.mobile as cus_mobile from task as T join customers as CUS on T.customer=CUS.id where date(T.created_at) between '${FinalstartDay}' and '${FinalendDay}' and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' and T.task_type='${req.body.disposition}' order by TaskCreatedDate desc`;
  } else {
    //console.log("in else>>>>385");
    var qry = `select T.*, T.created_at as TaskCreatedDate, CUS.name as name, T.note as Task_Note, CUS.email as cus_email, (select U.name from user U where U.id=T.task_created_by) as Task_Creator, (select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select U.email from user U where U.id=T.task_created_by) as Task_Creator_email, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TP.color from taskpriority TP where TP.task_priority_id=T.priority) as TaskColor, CUS.mobile as cus_mobile from task as T join customers as CUS on T.customer=CUS.id where date(T.created_at) between '${selectedStartDate}' and '${selectedEndDate}' and T.user='${req.body.user}' and T.company_id='${req.body.company_id}' order by CUS.name ${req.body.order};`;
  }
  //console.log("calendarCalls===401", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in calenderSortingCalls", error);
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

// 24 May

router.post("/filterTaskType", function (req, res, next) {
  pool.query(
    "select task_type as name from tasktype where company_id=? order by task_type;",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        //console.log("Data=========319", result);
        res.status(200).json({
          status: true,
          result,
          message: "Record found successfully",
        });
      }
    }
  );
});

router.post("/filterTaskTypeWithtype", function (req, res, next) {
  pool.query(
    "select *, task_type_id as idd,task_type as name from tasktype where company_id=? order by task_type;",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          result,
          message: "Record found successfully",
        });
      }
    }
  );
});

router.post("/CalendarfilterTasktype", function (req, res, next) {
  pool.query(
    "select *, task_type_id as idd,task_type as name from tasktype where company_id=? order by task_type",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        //console.log("error>>>366", error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          result: result,
          message: "Record found successfully",
        });
      }
    }
  );
});

// 31 may
router.post("/filterTaskTypeWithoutType", function (req, res, next) {
  pool.query(
    "select taskpriority as name from taskpriority where company_id=? order by taskpriority",
    [req.body.company_id, req.body.company_id],
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          result,
          message: "Record found successfully",
        });
      }
    }
  );
});

router.post("/Taskfiltering", function (req, res, next) {
  let startDateAhead = moment(req.body.startDate).format("YYYY-MM-DD");
  let EndDateAhead = moment(req.body.endDate).format("YYYY-MM-DD");
  if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.TS != "" &&
    req.body.task_idd != "" &&
    req.body.order != "" &&
    req.body.TT == ""
  ) {
    //console.log("In Else if 1 Part =====925");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' and T.task_type='${req.body.task_idd}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.task_idd != "" &&
    req.body.TS != "" &&
    req.body.order == "" &&
    req.body.TT == ""
  ) {
    //console.log("line number 904>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' and T.task_type='${req.body.task_idd}' order by T.created_at asc;`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != "" &&
    req.body.TT == "" &&
    req.body.task_idd != "" &&
    req.body.TS == ""
  ) {
    //console.log("line number 904>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.task_type='${req.body.task_idd}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != "" &&
    req.body.TS != "" &&
    req.body.TT == "" &&
    req.body.task_idd == ""
  ) {
    //console.log("line number 916>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.task_idd != "" &&
    req.body.order == "" &&
    req.body.TS == "" &&
    req.body.TT == ""
  ) {
    //console.log("line number 927>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.task_type='${req.body.task_idd}' order by T.created_at asc;`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.TS != "" &&
    req.body.order == "" &&
    req.body.TT == "" &&
    req.body.task_idd == ""
  ) {
    //console.log("line number 939>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' order by T.created_at asc;`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != "" &&
    req.body.TS == "" &&
    req.body.TT == "" &&
    req.body.task_idd == ""
  ) {
    //console.log("line number 950>>>>>>");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.TS != "" &&
    req.body.TT != "" &&
    req.body.order != "" &&
    req.body.task_idd == ""
  ) {
    //console.log("In Else if 1 Part =====976");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' and T.task_type='${req.body.TT}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.TT != "" &&
    req.body.TS == "" &&
    req.body.order != "" &&
    req.body.task_idd == ""
  ) {
    //console.log("In Else if 1 Part =====988");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.task_type='${req.body.TT}' order by C.name ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.TS != "" &&
    req.body.TT != "" &&
    req.body.order == "" &&
    req.body.task_idd == ""
  ) {
    //console.log("In Else if 1 Part =====976");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' and T.status='${req.body.TS.TaskStatusid}' and T.task_type='${req.body.TT}' order by T.created_at asc;`;
  } else {
    //console.log("In Last Else 1151 ====");
    var qry = `select T.*, U.name as UserName,U.email as Task_Creator_email, C.name as CustomerName, C.email as cus_email, C.firmname as firm_name, C.mobile as cus_mobile, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as taskStatus , (select TP.status_colour from taskpriority TP where T.status=TP.task_priority_id) as statusColor,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority ,(select U.name from user U where U.id=T.task_created_by) as Task_Creator,(select U.mobile from user U where U.id=T.task_created_by) as Task_Creator_mobile, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as task_type from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where date(T.created_at) between '${startDateAhead}' and '${EndDateAhead}' and T.company_id='${req.body.company_id}' and T.user='${req.body.user}' order by T.created_at asc;`;
  }
  // }
  //console.log("qry", qry);
  pool.query(qry, function (error, result) {
    //console.log("Qurey====331", qry);
    if (error) {
      //console.log("Error in Filter by A to Z", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result for taskFiltering==356", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/newPenalTaskStatus/:company_id", function (req, res, next) {
  pool.query(
    `select * from taskstatus where company_id="${req.params.company_id}"`,
    function (error, result) {
      if (error) {
        //console.log("Error in Task Status", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in Task Status", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.post("/taskTypeShow", function (req, res, next) {
  const qry = `select TT.*, TT.task_type as Taskname from tasktype as TT where company_id='${req.body.company_id}' order by task_type;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in TaskType", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in TaskType", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});
/// 31May

router.post("/updateTask", function (req, res, next) {
  //console.log("Request Body In Update App task==397 line no.", req.body);
  const qry = `update task set status='${req.body.statuss}', note='${req.body.remark}', updated_at='${req.body.updated_at}' where id='${req.body.taskId}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error In update App in Task", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in update App in Task", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Updated", result });
    }
  });
});

router.post("/taskTypeShow", function (req, res, next) {
  //console.log("req.body====", req.body);
  const qry = `select TT.*, TT.task_type as Taskname from tasktype as TT where company_id='${req.body.company_id}' order by task_type;`;

  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in TaskType", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in TaskType", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

/************ Task Status Cheked *****************/
router.post("/checkTaskStatus", function (req, res, next) {
  //console.log("Request body", req.body);
  const qry = `update task set status="2" where user="${req.body.user}" and company_id="${req.body.company_id}" and created_at < CURDATE() and status="1";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Task Status", error);
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong", error });
    } else {
      //console.log("Result in Task Status", result);
      return res
        .status(200)
        .json({ status: true, message: "Update Record", result });
    }
  });
});

router.post("/taskPriority", function (req, res, next) {
  pool.query(
    `SELECT task_priority_id,taskpriority,color FROM taskpriority where company_id=${req.body.company_id};`,
    function (error, result) {
      if (error) {
        //console.log("error in edit>>>>>>", error);
        res.status(400).json({ result });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

router.post("/reassignall", function (req, res, next) {
  try {
    var lengthOfTeam = req.body.teamid.length;
    for (let i = 0; i < lengthOfTeam; i++) {
      var qry = `update customers set user='${req.body.user}',createdBy='${req.body.createdBy}',team_id='${req.body.teamid[i]}' where id in(${req.body.id});`;
    }
    pool.query(qry, function (error, result) {
      //console.log("QRY OF REASSIGN ALL", qry);
      if (error) {
        //console.log("error in edit>>>>>>", error);
        res.status(500).json({ result });
      } else {
        return res.status(200).json({ result });
      }
    });
  } catch (e) {
    //console.log(e);
  }
});

router.post("/reassignid", function (req, res, next) {
  //console.log(req.body.id);
  //makes format 'hi', 'there', 'everybody'
  const qry = `update customers set user='${req.body.user}',team_id='${req.body.team_id}',createdBy='${req.body.createdBy}' where id in(${req.body.id})`;
  pool.query(qry, function (error, result) {
    //console.log("QRY OF REASSIGN", qry);
    if (error) {
      //console.log("error in edit>>>>>>", error);
      res.status(500).json({ result });
    } else {
      res.status(200).json({ result });
    }
  });
});

router.post("/taskCommit", function (req, res, next) {
  var startDay = moment().startOf("month").format("YYYY-MM-DD");
  var endDay = moment().endOf("month").format("YYYY-MM-DD");
  pool.query(
    `SELECT (select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status in (1,2,3) group by user) as assigned,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=3)as completed,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=2) as delay  from task  where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} group by user`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/taskStatus", function (req, res, next) {
  //console.log("req.body>>1029", req.body);
  pool.query(
    `select * from taskstatus where company_id='${req.body.company_id}'`,
    function (error, result) {
      if (error) {
        //console.log("Error in Task Status", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in Task Status", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.post("/globalSearchByCustomer", function (req, res, next) {
  pool.query(
    `select C.*, (select U.name from  user as U where U.id=C.user)as ManagerName,(select U.mobile from    user as U where U.id=C.user)as ManagerMobile from customers as C where C.name like '%${req.body.value}%' and C.company_id=${req.body.company_id} and (C.user=${req.body.user} or C.team_id in (Select id from team where team_head=${req.body.user}))`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/globalSearchByTask", function (req, res, next) {
  pool.query(
    `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname ,C.address as address,C.type as cusType,C.pincode as pincode,C.firmname as firmname , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where C.name like '%${req.body.value}%' and T.company_id=${req.body.company_id} and (T.user=${req.body.user} or T.user in (Select id from user where team_id in (Select id from team where team_head=${req.body.user})));`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/globalSearch", function (req, res, next) {
  pool.query(
    `select C.*, (select U.name from    user as U where U.id=C.user)as ManagerName,
  (select U.mobile from    user as U where U.id=C.user)as ManagerMobile from customers as C where C.name like '%${req.body.value}%' and C.company_id=${req.body.company_id} and (C.user=${req.body.user} or C.team_id in (Select id from team where team_head=${req.body.user}))`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);

        pool.query(
          `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname ,C.address as address,C.type as cusType,C.pincode as pincode,C.firmname as firmname , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where C.name like '%${req.body.value}%' and T.company_id=${req.body.company_id} and (T.user=${req.body.user} or T.user in (Select id from user where team_id in (Select id from team where team_head=${req.body.user})));`,
          function (error, info) {
            if (error) {
              //console.log(error);
              res.status(500).json({ result: result, info: [] });
            } else {
              //console.log(result);
              res.status(200).json({ result: result, info: info });
            }
          }
        );
      }
    }
  );
});

router.post("/managerTaskList", function (req, res, next) {
  pool.query(
    `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address,C.type as cusType,C.pincode as pincode,C.firmname as firmname , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and (T.user='${req.body.user}' or T.user in (Select id from user where team_id in (Select id from team where team_head='${req.body.user}')));`,
    function (error, result) {
      if (error) {
        //console.log("Error in Manager Task List", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        // //console.log("Result in Manager Task List", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.post("/managerTaskListById", function (req, res, next) {
  //console.log(
  //   "req body in task list by id>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  //   req.body
  // );

  if (
    req.body.user.length > 0 &&
    req.body.value == 0 &&
    (req.body.taskStatusKeys == [] ||
      req.body.taskStatusKeys == null ||
      req.body.taskStatusKeys.length == 0)
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='?' and T.user in (?);`,
      [req.body.company_id, req.body.user],
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length == 0 &&
    req.body.value == 1 &&
    (req.body.taskStatusKeys == [] ||
      req.body.taskStatusKeys == null ||
      req.body.taskStatusKeys.length == 0)
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and (T.user='${req.body.user_id}' or T.user in (Select id from user where team_id in (Select id from team where team_head='${req.body.user_id}'))) order by created_at desc`,
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Date Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length == 0 &&
    req.body.value == 0 &&
    req.body.taskStatusKeys.length > 0
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.status in (${req.body.taskStatusKeys}) and (T.user='${req.body.user_id}' or T.user in (Select id from user where team_id in (Select id from team where team_head='${req.body.user_id}')));`,
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length > 0 &&
    req.body.value == 1 &&
    (req.body.taskStatusKeys == [] ||
      req.body.taskStatusKeys == null ||
      req.body.taskStatusKeys.length == 0)
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.user in (${req.body.user}) order by created_at desc`,
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            // .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Date Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length == 0 &&
    req.body.value == 1 &&
    req.body.taskStatusKeys.length > 0
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and T.status in (${req.body.taskStatusKeys}) and (T.user='${req.body.user_id}' or T.user in (Select id from user where team_id in (Select id from team where team_head='${req.body.user_id}'))) order by created_at desc;`,
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length > 0 &&
    req.body.value == 0 &&
    req.body.taskStatusKeys.length > 0
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='?' and T.user in (?) and T.status in (?);`,
      [req.body.company_id, req.body.user, req.body.taskStatusKeys],
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else if (
    req.body.user.length > 0 &&
    req.body.value == 1 &&
    req.body.taskStatusKeys.length > 0
  ) {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address,(select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='?' and T.user in (?) and T.status in (?) order by created_at desc;`,
      [req.body.company_id, req.body.user, req.body.taskStatusKeys],
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  } else {
    pool.query(
      `select T.*, U.name as UserName, C.name as CustomerName, C.email as CustomerEmail,C.firstname as firstname , C.lastname as lastname,C.address as address , (select U.name from user U where U.id=Team.team_head) as ManagerName , (select U.mobile from user U where U.id=Team.team_head) as ManagerMobile, (select U.email from user U where U.id=Team.team_head) as ManagerEmail, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status=TS.taskstatus_id) as TaskStatus, (select TP.color from taskpriority TP where T.priority=TP.task_priority_id) as TaskColor,(select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskTypeStatus from task as T join customers as C on T.customer=C.id join user as U on T.user=U.id join team as Team on U.team_id=Team.id where T.company_id='${req.body.company_id}' and (T.user='${req.body.user}' or T.user in (Select id from user where team_id in (Select id from team where team_head='${req.body.user}')));`,
      function (error, result) {
        if (error) {
          //console.log("Error in Manager Task List", error);
          return res
            .status(400)
            .json({ status: false, message: "Error Occurred", error });
        } else {
          // //console.log("Result in Manager Task List", result);
          return res
            .status(200)
            .json({ status: true, message: "Record Found", result });
        }
      }
    );
  }
});

////////////////// MANAGER API //////////////////

router.post("/EditTask", function (req, res, next) {
  //console.log("taskss body>>>>>459", req.body);
  pool.query(
    `update task set firstname='${req.body.firstname}', lastname='${req.body.lastname}', status='${req.body.status}',user='${req.body.user}', note='${req.body.note}', mobile='${req.body.mobile}', updated_at='${req.body.updated_at}', company_id='${req.body.company_id}', refrence_from='${req.body.refrence_from}', task_type='${req.body.task_type}', create_customer_profile='${req.body.create_customer_profile}', csr_read_profile='${req.body.csr_read_profile}', priority='${req.body.priority}',task_created_by='${req.body.task_created_by}',created_at='${req.body.created_at}' where id='${req.body.id}';`,
    function (error, result) {
      if (error) {
        //console.log("error in edit>>>>>>", error);
        res.status(400).json({ result: false });
      } else {
        res.status(200).json({ result: true });
      }
    }
  );
});

router.post("/datetaskCommit", function (req, res, next) {
  pool.query(
    `SELECT (select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1) and user=${req.body.id} and  status in (1,2,3) group by user) as assigned,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1) and user=${req.body.id} and  status=3)as completed,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1) and user=${req.body.id} and  status=2) as delay  from task  where SUBSTRING_INDEX(created_at,' ',1) between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1) and user=${req.body.id} group by user`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/CSRforFilterAuditor", function (req, res, next) {
  //console.log("CSR FOR FILTER", req.body);
  pool.query(
    "select id,name from user where company_id=?",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        //console.log("Error in TaskPriorityName", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result: result,
        });
      }
    }
  );
});

router.post("/CSRforFilter", function (req, res, next) {
  //console.log("CSR FOR FILTER", req.body);
  pool.query(
    "select id,name from user where company_id=? and team_id in(Select id from team where team_head=?)",
    [req.body.company_id, req.body.user],
    function (error, result) {
      if (error) {
        //console.log("Error in TaskPriorityName", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result: result,
        });
      }
    }
  );
});

router.post("/teamNameForFilter", function (req, res, next) {
  //console.log("TEAM NAME FOR FILTER", req.body);
  pool.query(
    "select id,team_name from team where company_id=?;",
    [req.body.company_id],
    function (error, result) {
      if (error) {
        //console.log("Error in TaskPriorityName", error);
        return res
          .status(400)
          .json({ status: false, message: "Bad Request", error });
      } else {
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result: result,
        });
      }
    }
  );
});

router.get("/display/:user_id/:company_id", function (req, res, next) {
  pool.query(
    `select T.*, C.email as CustomerEmail, (select U.name from user U where T.user=U.id)as UserName, (select Tm.team_name from team Tm where C.team_id=Tm.id) as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType from task T left join customers C on T.customer=C.id where T.user="${req.params.user_id}" and T.company_id="${req.params.company_id}" group by T.id order by T.id desc;      select T.id as ID, T.firstname as FirstName, T.lastname as LastName, T.mobile as Mobile, T.created_at as TaskDateTime, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.task_added_date as AddedOn from task T left join customers C on T.customer=C.id where T.user="${req.params.user_id}" and T.company_id="${req.params.company_id}" order by T.id desc;`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        let tempData = result[0];
        let tempExcel = result[1];
        let Data = [tempData];
        let Excel = [tempExcel];
        return res
          .status(200)
          .json({ status: true, message: "Record Found", Data, Excel });
      }
    }
  );
});

router.post("/FilterDisplay/:user_id/:company_id", function (req, res, next) {
  //console.log("req body in task Filter", req.body);
  pool.query(
    `select T.*, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType from task T where T.user="${req.params.user_id}" and T.company_id="${req.params.company_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by T.id desc;  select T.id as ID, T.firstname as FirstName, T.lastname as LastName, T.mobile as Mobile, T.created_at as TaskDateTime, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.task_added_date as AddedOn from task T where T.user="${req.params.user_id}" and T.company_id="${req.params.company_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by T.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("error", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        var tempData = result[0];
        var tempExcel = result[1];
        var resultData = [tempData];
        var excelData = [tempExcel];
        return res.status(200).json({
          status: true,
          message: "Record Found",
          resultData,
          excelData,
        });
      }
    }
  );
});

router.get("/newPenalDisplay/:company_id", function (req, res, next) {
  //console.log("req body in task display for new penal");
  const qry = `select T.*, Tm.team_name as TeamName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, U.name as UserName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus, (select C.email from customers C where T.customer=C.id) as CustomerEmail from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" group by T.id order by T.id desc;   select T.firstname, T.lastname, T.mobile, T.task_added_date as TaskDateTime, U.name as UserName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.created_at as AddedOn, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="1" group by T.id order by T.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Task Display============ 33", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Task Display =========36", result);
      var tempData = result[0];
      var tempExcelData = result[1];
      var Data = [tempData];
      var Excel = [tempExcelData];
      return res
        .status(200)
        .json({ status: true, message: "Task Data found!", Data, Excel });
    }
  });
});

router.post("/AuditorTaskDisplay", function (req, res, next) {
  const qry = `select T.*, Tm.team_name as TeamName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, U.name as UserName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus, (select C.email from customers C where T.customer=C.id) as CustomerEmail from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="${req.body.company_id}" group by T.id order by T.id desc LIMIT ${req.body.limit} OFFSET ${req.body.offset};`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Task Display============ 33", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Task Display =========36", result);
      return res
        .status(200)
        .json({ status: true, data: result, message: "Task Data found!" });
    }
  });
});

router.post("/AuditorCalendarTasks", function (req, res, next) {
  let newMyDate = moment(req.body.sDate).format("YYYY-MM-DD");
  //console.log("newMydate-->>1635", newMyDate);
  const qry = `select T.*, Tm.team_name as TeamName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, U.name as UserName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus, (select C.email from customers C where T.customer=C.id) as CustomerEmail from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="${req.body.company_id}" and T.created_at like "${newMyDate}%" group by T.id order by T.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Task Display============ 33", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Task Display =========36", result);
      return res
        .status(200)
        .json({ status: true, data: result, message: "Task Data found!" });
    }
  });
});

router.post("/newPenalFilterTask/:company_id", function (req, res, next) {
  //console.log("req body in task filter for new penal");
  const qry = `select T.firstname, T.lastname, T.mobile, T.created_at, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as UserName, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.task_added_date from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and date(T.task_added_date) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Task Display============ 33", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Task Display =========36", result);
      // //console.log("Result in Task Display =========36", result.length);
      return res
        .status(200)
        .json({ status: true, data: result, message: "Task Data found!" });
    }
  });
});

router.post(
  "/newPenalTaskViewFilter/:id/:company_id",
  function (req, res, next) {
    //console.log(
    //   "req params in task view display",
    //   req.params,
    //   "req Body",
    //   req.body
    // );
    const qry = `select Cl.*,(select U.name from user U where Cl.user=U.id) as UserName from calls Cl join task T on Cl.task_id=T.id where Cl.company_id="${req.params.company_id}" and Cl.task_id="${req.params.id}" and date(Cl.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by Cl.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in task view", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        // //console.log("result in task view", result);
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    });
  }
);

router.get(
  "/newPenalTaskViewDisplay/:id/:company_id",
  function (req, res, next) {
    const qry = `select Cl.*, C.email as CustomerEmail,(select U.name from user U where Cl.user=U.id) as UserName, (select Tm.team_name from team Tm where C.team_id=Tm.id) as TeamName from calls Cl join task T on Cl.task_id=T.id join customers C on Cl.customer=C.id where Cl.company_id="${req.params.company_id}" and Cl.task_id="${req.params.id}" order by Cl.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in task view", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        // //console.log("result in task view", result);
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    });
  }
);

router.get("/DisplayTasks/:id/:company_id", function (req, res, next) {
  pool.query(
    `select T.*, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as UserName, (select TM.team_name from team TM where U.team_id=TM.id) as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus, (select C.email from customers C where T.customer=C.id) as Email, (select C.name from customers C where T.customer=C.id) as CustomerName from task T, user U where T.id="${req.params.id}" and T.company_id="${req.params.company_id}" group by T.id order by T.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("error in display singal task", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        return res.status(200).json({
          status: true,
          data: result,
          message: "GetAllTask Data found!",
        });
      }
    }
  );
});

router.get(
  `/newPenalTotalTask/:company_id/:taskStatusId`,
  function (req, res, next) {
    //console.log("request in Total Task", req.params);
    var qry = `select * from task where company_id="${req.params.company_id}"; select * from task where company_id="${req.params.company_id}" and status="${req.params.taskStatusId}";`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in Total task", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        // //console.log("result in Total task", result);
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

router.post("/lastmonthtaskCommit", function (req, res, next) {
  var startDay = moment()
    .clone()
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  var endDay = moment()
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  pool.query(
    `SELECT (select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status in (1,2,3) group by user) as assigned,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=3)as completed,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=2) as delay  from task  where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} group by user`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/last3monthtaskCommit", function (req, res, next) {
  var startDay = moment()
    .clone()
    .subtract(3, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  var endDay = moment()
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  pool.query(
    `SELECT (select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status in (1,2,3) group by user) as assigned,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=3)as completed,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=2) as delay  from task  where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} group by user`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/taskCommit", function (req, res, next) {
  var startDay = moment().startOf("month").format("YYYY-MM-DD");
  var endDay = moment().endOf("month").format("YYYY-MM-DD");
  pool.query(
    `SELECT (select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status in (1,2,3) group by user) as assigned,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=3)as completed,(select count(*) from task where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} and  status=2) as delay  from task  where SUBSTRING_INDEX(created_at,' ',1) between '${startDay}' and '${endDay}' and user=${req.body.id} group by user`,
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ result: [] });
      } else {
        //console.log(result);
        res.status(200).json({ result: result });
      }
    }
  );
});

router.post("/newPenalTaskPriorityName/:company_id", function (req, res, next) {
  const qry = `select T.*, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriorityName from task as T where T.priority="${req.body.low}" and T.company_id="${req.params.company_id}"; select T.*, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriorityName from task as T where T.priority="${req.body.medium}" and T.company_id="${req.params.company_id}"; select T.*, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriorityName from task as T where T.priority="${req.body.high}" and T.company_id="${req.params.company_id}"; select T.*, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriorityName from task as T where T.company_id="${req.params.company_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in TaskPriorityName", error);
      return res
        .status(400)
        .json({ status: false, message: "Bad Request", error });
    } else {
      // //console.log("Result in TaskPriorityName", result);
      var tempLowPriority = result[0];
      var tempMediumPriority = result[1];
      var tempHighPriority = result[2];
      var tempAllPriority = result[3];
      var lowPriority = [tempLowPriority];
      var mediumPriority = [tempMediumPriority];
      var highPriority = [tempHighPriority];
      var TotalPriority = [tempAllPriority];
      return res.status(200).json({
        status: true,
        message: "Record Found",
        lowPriority,
        mediumPriority,
        highPriority,
        TotalPriority,
      });
    }
  });
});

router.post(
  "/newPenalTodaysDisplayTasks/:company_id",
  function (req, res, next) {
    //console.log("req body in today task display for new penal");
    const qry = `select T.*, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as UserName, (select TM.team_name from team TM where U.team_id=TM.id) as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus from task T, user U where T.company_id="${req.params.company_id}" and T.created_at LIKE "%${req.body.todayDate}%" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        console.log("Error in Task Display============ 33", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Task Display =========36", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Task Data found!" });
      }
    });
  }
);

router.post("/updateApp/:id/:company_id", function (req, res, next) {
  //console.log("Request Body In Update App task", req.body);
  const qry = `update task set firstname="${req.body.firstname}", lastname="${req.body.lastname}", status="${req.body.status}", customer="${req.body.customer}", user="${req.body.user}", note="${req.body.note}", mobile="${req.body.mobile}", created_at="${req.body.created_at}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", refrence_from="${req.body.refrence_from}", task_type="${req.body.task_type}", priority="${req.body.priority}", task_created_by="${req.body.task_created_by}", task_added_date="${req.body.task_added_date}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  pool.query(qry, function (error, result) {
    //console.log("qryyyy", qry);
    if (error) {
      //console.log("Error In update App in Taskk", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in update App in Task", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Updated", result });
    }
  });
});

router.post("/CreateTask", function (req, res, next) {
  //console.log("taskss body>>>>>459", req.body);
  pool.query(
    "insert into task(firstname, lastname, status, customer, user, note, mobile, created_at, updated_at, company_id, refrence_from, task_type, create_customer_profile, csr_read_profile, priority,task_created_by, task_added_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.firstname,
      req.body.lastname,
      req.body.status,
      req.body.customer,
      req.body.user,
      req.body.note,
      req.body.mobile,
      req.body.created_at,
      req.body.updated_at,
      req.body.company_id,
      req.body.refrence_from,
      req.body.task_type,
      req.body.create_customer_profile,
      req.body.csr_read_profile,
      req.body.priority,
      req.body.task_created_by,
      req.body.task_added_date,
    ],
    function (error, result) {
      if (error) {
        //console.log("error in edit>>>>>>", error);
        res.status(400).json({ result: false });
      } else {
        res.status(200).json({ result: true });
      }
    }
  );
});

router.get(
  "/TaskReportDataNewPenalDisplay/:company_id",
  function (req, res, next) {
    //console.log("req body in task display for new penal");
    const qry = `select T.firstname, T.lastname, T.mobile, T.created_at, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as UserName, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.task_added_date from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in Task Display============ 33", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Task Display =========36", result);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Task Data found!" });
      }
    });
  }
);

router.get(
  "/newPenalDisplayExcelDownload/:company_id",
  function (req, res, next) {
    //console.log("req body in task display for new penal");
    const qry = `select T.firstname, T.lastname, T.mobile, T.task_added_date as TaskDateTime, U.name as UserName, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.created_at as AddedOn, (select TS.task_status from taskstatus TS where T.status = TS.taskstatus_id) as TaskStatus from task T left join user U on T.user=U.id left join team Tm on U.team_id=Tm.id where T.company_id="1" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Task Display============ 33", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Task Display =========36", result);
        // //console.log("Result in Task Display =========36", result.length);
        return res
          .status(200)
          .json({ status: true, data: result, message: "Task Data found!" });
      }
    });
  }
);

router.post(
  `/managerPenalTeamViewTodatTask/:company_id/:manager_id/:team_id`,
  function (req, res, next) {
    //console.log("req.body and params", req.body, req.params);
    let qry = `select TS.*,TS.created_at as TaskDate, Cus.name as CustomerName, Cus.mobile as CustomerMobile, U.name as UserName, (select TP.taskpriority from taskpriority TP where TS.priority=TP.task_priority_id) as TaskPriority, (select TT.task_type from tasktype TT where TS.task_type = TT.task_type_id) as TaskType from task TS join customers Cus on TS.customer=Cus.id join user U on TS.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and U.company_id="${req.params.company_id}" and T.id="${req.params.team_id}" and TS.created_at LIKE "%${req.body.todayDate}%" group by TS.id order by TS.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenalTeamViewTodatTask", error);
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalTeamViewTodatTask", result);
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    });
  }
);

router.get(
  "/managerPenalTaskList/:company_id/:manager_id",
  function (req, res, next) {
    var qry = `select T.*, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, U.name as UserName, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" group by T.id order by T.id desc;  select T.id, T.firstname as FirstName, T.lastname as LastName, T.mobile, T.created_at as TaskDateTime,U.name as UserName, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, T.task_added_date as AddedOn, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenal Task List", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        // //console.log("result in managerPenal Task List", result);
        var tempData = result[0];
        var tempExcelData = result[1];
        var ExcelData = [tempExcelData];
        var resultt = [tempData];
        return res
          .status(200)
          .json({ status: true, message: "record found", ExcelData, resultt });
      }
    });
  }
);

router.post(
  "/managerPenalTaskListFilterExcelDownload/:company_id/:manager_id",
  function (req, res, next) {
    var qry = `select T.*, U.name as UserName, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, T.task_added_date as AddedOn, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc; select T.id, T.firstname as FirstName, T.lastname as LastName, T.mobile, T.created_at as TaskDateTime,U.name as UserName, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, T.task_added_date as AddedOn, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in manager penal task list Excel download", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        // //console.log("result in manager penal task list Excel download", result);
        var tempData = result[0];
        var tempExcelData = result[1];
        var ExcelData = [tempExcelData];
        var resultt = [tempData];
        return res
          .status(200)
          .json({ status: true, message: "record found", ExcelData, resultt });
      }
    });
  }
);

router.get(
  "/managerPenalTaskReport/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("req in manager Penal Task Report");
    var qry = `select T.id, T.firstname as FirstName, T.lastname as LastName, T.mobile, T.created_at as TaskDateTime,U.name as UserName, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, T.task_added_date as AddedOn, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in manager penal task report", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        // //console.log("result in manager penal task report", result);
        return res
          .status(200)
          .json({ status: true, message: "record found", data: result });
      }
    });
  }
);

router.post(
  "/managerPenalFilterTaskReport/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("req in manager Penal Task Report");
    var qry = `select T.id, T.firstname as FirstName, T.lastname as LastName, T.mobile, T.created_at as TaskDateTime,U.name as UserName, (select TT.task_type from tasktype TT where TT.task_type_id=T.task_type) as TaskType, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where TP.task_priority_id=T.priority) as TaskPriority, T.task_added_date as AddedOn, (select TS.task_status from taskstatus TS where TS.taskstatus_id=T.status) as TaskStatus from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" and Tm.team_head="${req.params.manager_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in manager penal task report", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        // //console.log("result in manager penal task report", result);
        return res
          .status(200)
          .json({ status: true, message: "record found", data: result });
      }
    });
  }
);

router.post(
  `/managerPenalFilterTeamViewTodatTask/:company_id/:manager_id/:team_id`,
  function (req, res, next) {
    //console.log("req.body and params", req.body, req.params);
    let qry = `select TS.*,TS.created_at as TaskDate, Cus.name as CustomerName, Cus.mobile as CustomerMobile, U.name as UserName, (select TP.taskpriority from taskpriority TP where TS.priority=TP.task_priority_id) as TaskPriority, (select TT.task_type from tasktype TT where TS.task_type = TT.task_type_id) as TaskType from task TS join customers Cus on TS.customer=Cus.id join user U on TS.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and U.company_id="${req.params.company_id}" and T.id="${req.params.team_id}" and TS.created_at LIKE "%${req.body.todayDate}%" and date(TS.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by TS.id order by TS.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenalFilterTeamViewTodatTask", error);
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalFilterTeamViewTodatTask", result);
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    });
  }
);

module.exports = router;
