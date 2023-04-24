var express = require("express");
var router = express.Router();
var pool = require("./pool");
var moment = require("moment");
const cron = require("node-cron");

router.post("/add_new_attendence_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into attendence( date, in_time, out_time, in_time_gps, out_time_gps, created_at, updated_at, user_id, company_id, team_id, status, duration, address ) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.date,
      req.body.inTime,
      req.body.outTime,
      req.body.inTimeGps,
      req.body.outTimeGps,
      req.body.createdAt,
      req.body.updateAT,
      req.body.userId,
      req.body.teamId,
      req.body.companyId,
      req.body.duration,
      req.body.status,
      req.body.address,
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

router.post("/edit_attendence_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "update attendence set date=?,in_time=?,out_time=?,in_time_gps=?,out_time_gps=?,created_at=? ,updated_at=?,user_id=?,company_id=?,team_id=?,status=?,duration=?,address=? where id=?",
    [
      req.body.date,
      req.body.inTime,
      req.body.outTime,
      req.body.inTimeGps,
      req.body.outTimeGps,
      req.body.createdAt,
      req.body.updatedAt,
      req.body.userId,
      req.body.companyId,
      req.body.teamId,
      req.body.status,
      req.body.duration,
      req.body.address,
      req.body.id,
    ],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/display_all_attendence", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "select * from team where company_id=?",
    [req.body.id],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.post("/display_all_companyid_by_user", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "select * from user where company_id=?",
    [req.body.id],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.post("/delete_attendence_data", function (req, res, next) {
  pool.query(
    "delete from attendence where id=?",
    [req.body.id],
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

router.post("/delete_all_all_attendence", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from attendence where id in (?)",
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

router.post("/display_companyid_by_userid", function (req, res, next) {
  pool.query(
    "select * from user where company_id=?",
    [req.body.companyId],
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

router.post("/display_companyid_by_teamid", function (req, res, next) {
  pool.query(
    "select * from team where company_id=?",
    [req.body.teamId],
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("attendence");
});

router.post("/Attendence", function (req, res, next) {
  pool.query(
    "insert into attendence set ?",
    req.body,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        return res.status(200).json({
          status: true,
          message: "Attendance added successfully",
          result,
        });
      }
    }
  );
});

router.post("/teamsOnCall", function (req, res, next) {
  let currDate = moment().format("YYYY-MM-DD");
  const qry = `select C.* from calllivestatus C left join attendence A on C.user_id=A.user_id and A.date="${currDate}" where C.company_id="${req.body.company_id}" and C.team_id="${req.body.team_id}" and C.livestatus="On call" and A.status="in";`;
  // const qry = `select * from calllivestatus where company_id="${req.body.company_id}" and team_id="${req.body.team_id}" and livestatus="On call"`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, data: result, message: "Task Data found!" });
    }
  });
});

router.post("/memberDetailsOnCall", function (req, res, next) {
  const qry = `select U.*,(select livestatus C from calllivestatus C where C.user_id=U.id) as livestatus, (select duration C from calllivestatus C where C.user_id=U.id ) as duration, (select created_at C from calllivestatus C where C.user_id=U.id ) as CallTime from user U where U.team_id='${req.body.team_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, data: result, message: "Task Data found!" });
    }
  });
});

router.post("/updateAttendance", function (req, res, next) {
  //console.log("req.body>>>>", req.body);
  pool.query(
    "update attendence set out_time=?, out_time_gps=?, updated_at=?, status=?, duration=? where id=?",
    [
      req.body.out_time,
      req.body.out_time_gps,
      req.body.updated_at,
      req.body.status,
      req.body.duration,
      req.body.id,
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("result 74>>>>>>>>>", result);
        res.status(200).json({
          status: true,
          message: "Attendance updated successfully",
          data: req.body,
        });
      }
    }
  );
});

router.post("/chkuserattendance", function (req, res, next) {
  //console.log("req.body100", req.body);
  pool.query(
    "select * from attendence where user_id=? and company_id=? and date=?",
    [req.body.user_id, req.body.company_id, req.body.date],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        //console.log(result);
        if (result.length == 0)
          res.status(200).json({
            status: true,
            message: "Start My Day",
            attendancestatus: "",
          });
        else {
          //console.log("result====result[0].id", result[0].id);
          res.status(200).json({
            status: false,
            message: "End My Day",
            id: result[0].id,
            attendancestatus: result[0].status,
          });
        }
      }
    }
  );
});

router.post("/checkattendence", (req, res) => {
  var DDa = req.body.date.substr(0, 10);
  pool.query(
    "select * from attendence where date=? and user_id=? and company_id=? and status='in'",
    [DDa, req.body.user_id, req.body.company_id],
    (err, rslt) => {
      if (err) {
        return res
          .status(400)
          .json({ status: false, data: [], message: "Server Error!" });
      } else {
        return res
          .status(200)
          .json({ status: true, data: rslt, message: "Record Updated" });
      }
    }
  );
});
//19 may
router.post("/averageLoginTime", function (req, res, next) {
  var startDay = moment().subtract(1, "week").startOf("week");
  var endDay = moment().subtract(1, "week").endOf("week");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  // //console.log("FinalstartDay", FinalstartDay);
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  //console.log("FinalstartDayy===257", FinalstartDayy);
  // //console.log("From && To", startDay, endDay);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  // //console.log("FinalEndDay", FinalendDay);
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  //console.log("FinalEndDayy===263", FinalendDayy);
  const qry = `select avg(duration) as AverageLoginTime from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' and date between '${FinalstartDayy}' and '${FinalendDayy}';`;
  //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error ==== 258 ", error);
      res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result=====261", result);
      var AverageLoginTime = result[0].AverageLoginTime;
      var AverageLoginTimeFormatted = moment
        .utc(AverageLoginTime * 1000)
        .format("HH:mm:ss");
      // //console.log(
      //   // "AverageLoginTimeFormatted====274",
      //   AverageLoginTimeFormatted
      // );
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        AverageLoginTimeFormatted,
      });
    }
  });
});

/// Manager App Teams Member Logged In ///
router.post("/teamsLoggedInMember", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName from user U join attendence A on A.user_id = U.id where A.status='in' and A.date='${date}' and A.company_id='${req.body.company_id}' and A.team_id=?;`,
    [req.body.team_id],
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.get("/CompanyLoggedInMember/:company_id", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName from user U join attendence A on A.user_id = U.id where A.status='in' and A.date='${date}' and A.company_id='${req.params.company_id}';`,
    function (error, result) {
      if (error) {
        //console.log("Error in teamsLoggedInMember", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.post("/teamsLoggedOutMember", function (req, res, next) {
  //console.log("Request Body", req.body.team_id);
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName from user U join attendence A on A.user_id = U.id where A.date='${date}' and A.company_id='${req.body.company_id}' and A.team_id=?;`,
    [req.body.team_id],
    function (error, result) {
      if (error) {
        // //console.log("Error in teamsLoggedInMember", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        // //console.log("Result in teamsLoggedInMember", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.get("/CompanyLoggedOutMember/:company_id", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName from user U join attendence A on A.user_id = U.id where A.status='out' and A.date='${date}' and A.company_id='${req.params.company_id}';`,
    function (error, result) {
      if (error) {
        // //console.log("Error in teamsLoggedInMember", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        // //console.log("Result in teamsLoggedInMember", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});
/////////////////////////// MANAGER TEAM'S MEMBER AVERAGE LOGIN TIME API ////////////////////////

router.post("/TeamaverageLoginTimeManager", function (req, res, next) {
  //console.log("AverageReqBody-->>577", req.body);
  var TodayDate = moment().format("YYYY-MM-DD");
  if (req.body.team_id != undefined && req.body.company_id != "") {
    const qry = `select avg(duration) as AverageLoginTime from attendence where company_id='${req.body.company_id}' and team_id='${req.body.team_id}' and date = '${TodayDate}';`;
    pool.query(qry, function (error, result) {
      //console.log("QRY======583 in Average Login Time--", qry);
      if (error) {
        // //console.log("Error ==== 258 ", error);
        res.status(400).json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result=====261", result);
        var AverageLoginTime = result[0].AverageLoginTime;
        var AverageLoginTimeFormatted = moment
          .utc(AverageLoginTime * 1000)
          .format("HH:mm:ss");
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result,
          AverageLoginTimeFormatted,
        });
      }
    });
  } else {
    const qry = `select avg(duration) as AverageLoginTime from attendence where company_id='${req.body.company_id}' and date = '${TodayDate}';`;
    pool.query(qry, function (error, result) {
      //console.log("QRY======605 in Average Login Time", qry);
      if (error) {
        // //console.log("Error ==== 258 ", error);
        res.status(400).json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result=====261", result);
        var AverageLoginTime = result[0].AverageLoginTime;
        var AverageLoginTimeFormatted = moment
          .utc(AverageLoginTime * 1000)
          .format("HH:mm:ss");
        return res.status(200).json({
          status: true,
          message: "Record Found",
          result,
          AverageLoginTimeFormatted,
        });
      }
    });
  }
});

router.post("/weekAverageLogin", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startDay = moment().clone().startOf("week").format("YYYY-MM-DD");
  var endDay = moment().clone().endOf("week").format("YYYY-MM-DD");
  //console.log("start day of Week Average Login>>>>>>>>>>>>>>>.", startDay);
  //console.log("end day of Week Average Login>>>>>>>>>>>>>>>.", endDay);

  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between '${startDay}' and '${endDay}' and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between "${startDay}" and "${endDay}" and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date`;
  // //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result.length);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/monthAverageLogin", function (req, res, next) {
  var startDay = moment().subtract(26, "d").format("YYYY-MM-DD");
  var endDay = moment().format("YYYY-MM-DD");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between ${FinalstartDay} and ${FinalendDay} and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between ${FinalstartDay} and ${FinalendDay} and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result=====261", result.length);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/lastmonthAverageLogin", function (req, res, next) {
  // //console.log("Request Body===150", req.body);
  var startDay = moment().subtract(3, "month").startOf("month");
  var endDay = moment().subtract(1, "month").endOf("month");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  // //console.log("FinalstartDay", FinalstartDay);
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  //console.log("FinalstartDayy===402", FinalstartDayy);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  // //console.log("FinalEndDay", FinalendDay);
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  //console.log("FinalEndDayy===407", FinalendDayy);
  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between '${FinalstartDayy}' and '${FinalendDayy}' and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between '${FinalstartDayy}' and '${FinalendDayy}' and status='out' and team_id='${req.body.team_id}' and company_id='${req.body.company_id}') group by date`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result.length);
      let i = 0;
      const fromDb = undefined;
      // //console.log("AverageLoginTime====566", AverageLoginTime);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/monthAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
  var startOfMonth = moment().clone().startOf("month").format("YYYY-MM-DD");

  var endOfMonth = moment().clone().endOf("month").format("YYYY-MM-DD");

  //console.log("Start Of Month................975", startOfMonth);
  //console.log("End Of Month................976", endOfMonth);

  const qry = `Select (Select count(*) from attendence where in_time != '00:00:00' and out_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}') as presentDays,(Select count(*) from attendence where in_time != '00:00:00' and out_time = '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}' and date!=curdate()) as absentDays from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' and date between '${startOfMonth}' and '${endOfMonth}' group by user_id`;
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

router.post("/monthNoActivityAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
  var startOfMonth = moment().clone().startOf("month").format("YYYY-MM-DD");

  //console.log("Start Of Month................975", startOfMonth);
  const qry = `select count(distinct date) as NoActivityDays from attendence where date not in (Select date from attendence where in_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and curdate()) and date between '${startOfMonth}' and curdate()`;
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

router.post("/TeamaverageLoginTime", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  //console.log("date>>>133", date);

  const qry = `select avg(duration) as AverageLoginTime from attendence where company_id='${req.body.company_id}' and team_id='${req.body.team_id}' and date='${date}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error ==== 258 ", error);
      res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result=====261", result);
      var AverageLoginTime = result[0].AverageLoginTime;
      var AverageLoginTimeFormatted = moment
        .utc(AverageLoginTime * 1000)
        .format("HH:mm:ss");
      // //console.log(
      //   // "AverageLoginTimeFormatted====274",
      //   AverageLoginTimeFormatted
      // );
      //console.log("result>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      //console.log(
      //   "Average Login Time Formatted>>>>>>>>>>>>",
      //   AverageLoginTimeFormatted
      // );
      //console.log("Average Login Time >>>>>>>>>>>>", AverageLoginTime);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/noActivityTeamMember", function (req, res, next) {
  // //console.log("req.body in286", req.body);
  var date = moment().format("YYYY-MM-DD");
  //console.log("date>>>>348", date);
  const qry = `SELECT * FROM user where id not in (select user_id from attendence where date="${date}" and team_id='${req.body.team_id}') and team_id='${req.body.team_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in noActivityTeamMember", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in noActivityTeamMember", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

router.post("/companymonthAverageLogin", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startDay = moment().subtract(26, "d").format("YYYY-MM-DD");
  var endDay = moment().format("YYYY-MM-DD");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  //console.log("FinalstartDay", FinalstartDay);
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  //console.log("FinalstartDayy===402", FinalstartDayy);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  //console.log("FinalEndDay", FinalendDay);
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  //console.log("FinalEndDayy===407", FinalendDayy);
  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between ${FinalstartDay} and ${FinalendDay} and status='out' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between ${FinalstartDay} and ${FinalendDay} and status='out' and company_id='${req.body.company_id}') group by date`;
  // //console.log("QRY======265", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result.length);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/companylastmonthAverageLogin", function (req, res, next) {
  // //console.log("Request Body===150", req.body);
  var startDay = moment().subtract(3, "month").startOf("month");
  var endDay = moment().subtract(1, "month").endOf("month");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  // //console.log("FinalstartDay", FinalstartDay);
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  //console.log("FinalstartDayy===402", FinalstartDayy);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  // //console.log("FinalEndDay", FinalendDay);
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  //console.log("FinalEndDayy===407", FinalendDayy);
  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between '${FinalstartDayy}' and '${FinalendDayy}' and status='out' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between '${FinalstartDayy}' and '${FinalendDayy}' and status='out' and company_id='${req.body.company_id}') group by date`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result.length);
      let i = 0;
      const fromDb = undefined;
      // //console.log("AverageLoginTime====566", AverageLoginTime);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.get(
  "/CompanyNoActivityTeamMember/:company_id",
  function (req, res, next) {
    var date = moment().format("YYYY-MM-DD");
    //console.log("date>>>>348", date);
    const qry = `SELECT * FROM user where id not in (select user_id from attendence where date="${date}" and company_id='${req.params.company_id}' and team_id!=0) and company_id='${req.params.company_id}' and team_id!=0;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in noActivityTeamMember", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in noActivityTeamMember", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result: result });
      }
    });
  }
);

router.post("/weekAverageLoginTime", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startDay = moment().subtract(1, "week").startOf("week");
  var endDay = moment().subtract(1, "week").endOf("week");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  const qry = `select avg(duration) as AverageLoginTime from attendence where company_id='${req.body.company_id}' and date between '${FinalstartDayy}' and '${FinalendDayy}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result=====261", result);
      var AverageLoginTime = result[0].AverageLoginTime;
      var AverageLoginTimeFormatted = moment
        .utc(AverageLoginTime * 1000)
        .format("HH:mm:ss");
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        AverageLoginTimeFormatted,
      });
    }
  });
});

router.post("/dateAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
  const qry = `Select (Select count(*) from attendence where in_time != '00:00:00' and out_time != '00:00:00' and user_id='${req.body.user}' and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1)) as presentDays,(Select count(*) from attendence where in_time != '00:00:00' and out_time = '00:00:00' and user_id='${req.body.user}' and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1)) as absentDays from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1) group by user_id`;
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

router.get("/graphDisplay/:user_id/:company_id", function (req, res, next) {
  //console.log("Req params in Attendence", req.params);
  let qry = `select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='in' order by A.id desc;select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='out' order by A.id desc;select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='Force logout' order by A.id desc; select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" order by A.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      var tempAbsent = result[0];
      var tempPresent = result[1];
      var tempForceLogout = result[2];
      var tempTotalAtten = result[3];
      var Absent = [tempAbsent];
      var Present = [tempPresent];
      var ForceLogout = [tempForceLogout];
      var TotalAtten = [tempTotalAtten];
      return res.status(200).json({
        status: true,
        result,
        message: "Attendance data found!",
        Absent,
        Present,
        ForceLogout,
        TotalAtten,
      });
    }
  });
});

router.get("/display/:user_id/:company_id", function (req, res, next) {
  pool.query(
    `select A.*, if(A.status='out' or A.status='Force logout', B.duration , B.duration='00:00:00') as TotalBreakTime, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence A left join break B on B.attendance_id=A.id where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" group by A.id, B.id order by A.id desc; select A.id as ID, A.date, A.in_time as InTime, if(A.status='out' or A.status='Force logout', B.duration , B.duration='00:00:00') as TotalBreakTime, A.out_time as OutTime, A.duration as EffectiveHours, if(A.status='out', "Present", A.status) as AttendanceStatus, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence A left join break B on B.attendance_id=A.id where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" group by A.id, B.id order by A.id desc;             select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='in' order by A.id desc;select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='out' order by A.id desc;select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='Force logout' order by A.id desc; select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" order by A.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("error", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        var tempAbsent = result[2];
        var tempPresent = result[3];
        var tempForceLogout = result[4];
        var tempTotalAtten = result[5];
        var Absent = [tempAbsent];
        var Present = [tempPresent];
        var ForceLogout = [tempForceLogout];
        var TotalAtten = [tempTotalAtten];
        const arr = [];
        result[1].map((item) => {
          // //console.log("userAttendanceDownload", item);
          item["EffectiveHours"] =
            item.AttendanceStatus == "Force logout" ||
            item.AttendanceStatus == "in"
              ? "-"
              : moment.utc(item.EffectiveHours * 1000).format("HH:mm:ss");
          item["TotalBreakTime"] = moment
            .utc(item.TotalBreakTime * 1000)
            .format("HH:mm:ss");
          item["OutTime"] =
            item.AttendanceStatus == "Force logout" ||
            item.AttendanceStatus == "in"
              ? "-"
              : moment(item.OutTime, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["InTime"] = moment(item.InTime, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : null;
          arr.push(item);
        });
        return res.status(200).json({
          status: true,
          result: result[0],
          arr,
          Absent,
          Present,
          ForceLogout,
          TotalAtten,
          message: "Attendance data found!",
        });
      }
    }
  );
});

router.post(
  "/FilterGraphDisplay/:user_id/:company_id",
  function (req, res, next) {
    let qry = `select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='Force logout' and date(A.date) between "${req.body.startDate}" and "${req.body.endDate}" order by A.id desc;select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and A.status='out' and date(A.date) between "${req.body.startDate}%" and "${req.body.endDate}%" order by A.id desc; select A.* from attendence A where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and date(A.date) between "${req.body.startDate}%" and "${req.body.endDate}%" order by A.id desc;     select A.id as ID, A.date, A.in_time as InTime, if(A.status='out' or A.status='Force logout', B.duration , B.duration='00:00:00') as TotalBreakTime, A.out_time as OutTime, A.duration as EffectiveHours, if(A.status='out', "Present", A.status) as AttendanceStatus, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence A left join break B on B.attendance_id=A.id where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and date(A.date) between "${req.body.startDate}%" and "${req.body.endDate}%" group by A.id, B.id order by A.id desc;   select A.*, if(A.status='out' or A.status='Force logout', B.duration , B.duration='00:00:00') as TotalBreakTime, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence A left join break B on B.attendance_id=A.id where A.user_id="${req.params.user_id}" and A.company_id="${req.params.company_id}" and date(A.date) between "${req.body.startDate}%" and "${req.body.endDate}%" group by A.id, B.id order by id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        var tempFilterForcelogout = result[0];
        var tempFilterPresent = result[1];
        var tempTotalAtten = result[2];
        var FilterForcelogout = [tempFilterForcelogout];
        var FilterPresent = [tempFilterPresent];
        var FilterTotalAtten = [tempTotalAtten];

        var tempResult0 = result[3];
        var Result0 = [tempResult0];
        var tempResult1 = result[4];
        var Result1 = [tempResult1];
        const arr = [];
        Result0[0].map((item) => {
          item["EffectiveHours"] =
            item.AttendanceStatus == "Force logout" ||
            item.AttendanceStatus == "in"
              ? "-"
              : moment.utc(item.EffectiveHours * 1000).format("HH:mm:ss");
          item["TotalBreakTime"] = moment
            .utc(item.TotalBreakTime * 1000)
            .format("HH:mm:ss");
          item["OutTime"] =
            item.AttendanceStatus == "Force logout" ||
            item.AttendanceStatus == "in"
              ? "-"
              : moment(item.OutTime, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["InTime"] = moment(item.InTime, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : "-";
          arr.push(item);
        });
        return res.status(200).json({
          status: true,
          result,
          message: "Attendance data found!",
          FilterForcelogout,
          FilterPresent,
          FilterTotalAtten,
          arr,
          Result1,
        });
      }
    });
  }
);

router.post("/dateNoActivityAttendanceStats", function (req, res, next) {
  const qry = `select count(distinct date) as NoActivityDays from attendence where date not in (Select date from attendence where in_time != '00:00:00' and user_id='${req.body.user}' and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1)) and date between SUBSTRING_INDEX('${req.body.dateFrom}','T',1) and SUBSTRING_INDEX('${req.body.dateTo}','T',1)`;
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

router.post("/FilterAttendance/:company_id", function (req, res, next) {
  //console.log("Request Body in attendance displpay for new penal");
  const qry = `select U.name as UserName, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, A.date, A.in_time, A.out_time, if(A.status='out' or A.status='Force logout', sum(B.duration), B.duration='00:00:00') as TotalBreak, A.duration as Effectivehours, A.status as Status from attendence as A join user as U on A.user_id=U.id left join break B on B.attendance_id=A.id where A.company_id="${req.params.company_id}" and date(A.date) between "${req.body.startDate}" and "${req.body.endDate}" group by A.id order by A.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Attendence Display Filter =========", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("result in Attendence Display=========41", result);
      const arr = [];
      result.map((item) => {
        item["Effectivehours"] =
          item.Status == "Force logout"
            ? "-"
            : moment.utc(item.Effectivehours * 1000).format("HH:mm:ss");
        item["TotalBreak"] = moment
          .utc(item.TotalBreak * 1000)
          .format("HH:mm:ss");
        item["out_time"] =
          item.Status == "Force logout" || item.Status == "in"
            ? "-"
            : moment(item.out_time, ["HH:mm:ss"]).format("hh:mm:ss a");
        item["in_time"] = moment(item.in_time, ["HH:mm:ss"]).format(
          "hh:mm:ss a"
        );
        arr.push(item);
      });
      return res.status(200).json({
        status: true,
        arr,
        message: "Attendance data found!",
      });
    }
  });
});

router.post("/lastmonthAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
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

  //console.log("Start Of Month................975", startOfMonth);
  //console.log("End Of Month................976", endOfMonth);

  const qry = `Select (Select count(*) from attendence where in_time != '00:00:00' and out_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}') as presentDays,(Select count(*) from attendence where in_time != '00:00:00' and out_time = '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}' and date!=curdate()) as absentDays from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' and date between '${startOfMonth}' and '${endOfMonth}' group by user_id`;
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

router.post("/lastmonthNoActivityAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
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

  //console.log("Start Of Month................975", startOfMonth);

  const qry = `select count(distinct date) as NoActivityDays from attendence where date not in (Select date from attendence where in_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}') and date between '${startOfMonth}' and '${endOfMonth}'`;
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

router.post("/last3monthAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
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
  const qry = `Select (Select count(*) from attendence where in_time != '00:00:00' and out_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}') as presentDays,(Select count(*) from attendence where in_time != '00:00:00' and out_time = '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}' and date!=curdate()) as absentDays from attendence where user_id='${req.body.user}' and company_id='${req.body.company_id}' and date between '${startOfMonth}' and '${endOfMonth}' group by user_id`;
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

router.post("/last3monthNoActivityAttendanceStats", function (req, res, next) {
  //console.log("Request Body in Month Attendance Stats", req.body);
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
  const qry = `select count(distinct date) as NoActivityDays from attendence where date not in (Select date from attendence where in_time != '00:00:00' and user_id='${req.body.user}' and date between '${startOfMonth}' and '${endOfMonth}') and date between '${startOfMonth}' and '${endOfMonth}'`;
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

cron.schedule(" 0 0 * * * ", function () {
  // //console.log("run in every 10 seconds....");
  //console.log("run in eevry midnight");
  var qry = `update attendence set status='Force logout' where out_time='00:00:00';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in Forcelogout", error);
    } else {
      // //console.log("result in ForceLogout", result);
    }
  });
});

router.get(
  "/AttendanceReportNewPenalDisplay/:company_id",
  function (req, res, next) {
    const qry = `select U.name as UserName, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, A.date, A.in_time, A.out_time, if(A.status='out' or A.status='Force logout', B.duration, B.duration='00:00:00') as TotalBreak, A.duration as Effectivehours, A.status as Status, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence as A join user as U on A.user_id=U.id left join break B on B.attendance_id=A.id where A.company_id="${req.params.company_id}" group by A.id, B.id order by A.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Attendence Display=========38", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("result in Attendence Display=========41", result);
        const arr = [];
        result.map((item) => {
          item["Effectivehours"] =
            item.Status == "Force logout"
              ? "-"
              : moment.utc(item.Effectivehours * 1000).format("HH:mm:ss");
          item["TotalBreak"] = moment
            .utc(item.TotalBreak * 1000)
            .format("HH:mm:ss");
          item["out_time"] =
            item.Status == "Force logout" || item.Status == "in"
              ? "-"
              : moment(item.out_time, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["in_time"] = moment(item.in_time, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          arr.push(item);
        });
        // //console.log("arrr in attendance report", arr);
        return res.status(200).json({
          status: true,
          data: arr,
          message: "Attendance data found!",
        });
      }
    });
  }
);

router.get(
  "/TaskReportDataNewPenalDisplay/:company_id",
  function (req, res, next) {
    //console.log("req body in task display for new penal");
    const qry = `select T.firstname, T.lastname, T.mobile, T.created_at, (select TT.task_type from tasktype TT where T.task_type=TT.task_type_id) as TaskType, (select U.name from user U where T.user=U.id) as AssignedExecutive, Tm.team_name as TeamName, (select TP.taskpriority from taskpriority TP where T.priority=TP.task_priority_id) as TaskPriority, T.created_at as AddedOn from task T join user U on T.user=U.id join team Tm on U.team_id=Tm.id where T.company_id="${req.params.company_id}" group by T.id order by T.id desc;`;
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

router.post("/teamIdleTime", function (req, res, next) {
  pool.query(
    `Select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName,substring_index(timediff(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),(select if(sum(C.duration)!='00:00:00',substring_index(sec_to_time(sum(C.duration)),'.',1),'00:00:00') from calls C where C.user=A.user_id and C.created_at=curdate())),'.',1) as totalTime,substring_index(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),'.',1) as TotalTimeBr,timediff(if(A.status='in',current_time(),A.out_time),A.in_time) as TotalTimeAt from attendence A join user U on A.user_id = U.id where A.date=curdate() and A.team_id=? and A.company_id=? and (A.status='in' or A.status='out')`,
    [req.body.team_id, req.body.company_id],
    function (error, result) {
      if (error) {
        //console.log("Error in teamIdleTime", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in teamIdleTime", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result: result });
      }
    }
  );
});

router.post("/companyteamIdleTime", function (req, res, next) {
  pool.query(
    `Select A.*, U.*, (select U.name from user U where A.user_id = U.id) as UserName,substring_index(timediff(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),(select if(sum(C.duration)!='00:00:00',substring_index(sec_to_time(sum(C.duration)),'.',1),'00:00:00') from calls C where C.user=A.user_id and C.created_at=curdate())),'.',1) as totalTime,substring_index(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),'.',1) as TotalTimeBr,timediff(if(A.status='in',current_time(),A.out_time),A.in_time) as TotalTimeAt from attendence A join user U on A.user_id = U.id where A.date=curdate() and A.company_id=? and (A.status='in' or A.status='out')`,
    [req.body.company_id],
    function (error, result) {
      if (error) {
        //console.log("Error in teamIdleTime", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in teamIdleTime", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result: result });
      }
    }
  );
});

router.post("/companytotalTeamIdleTime", function (req, res, next) {
  //console.log("req.bodyinTotalIdleTime--->>>1387", req.body);
  var qry = `Select substring_index(sec_to_time(sum(time_to_sec(timediff(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),(select if(sum(C.duration)!='00:00:00',substring_index(sec_to_time(sum(C.duration)),'.',1),'00:00:00') from calls C where C.user=A.user_id and C.created_at=curdate()))))),'.',1) as totalTime,substring_index(sec_to_time(sum(time_to_sec(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate()))))),'.',1) as TotalTimeBr,sec_to_time(sum(time_to_sec(timediff(if(A.status='in',current_time(),A.out_time),A.in_time)))) as TotalTimeAt from attendence A where A.date=curdate() and A.company_id="${req.body.company_id}" and (A.status='in' or A.status='out')`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in teamIdleTime", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in TotalteamIdleTime", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

router.post("/totalTeamIdleTime", function (req, res, next) {
  //console.log("req.bodyinTotalIdleTime--->>>1387", req.body);
  var qry = `Select substring_index(sec_to_time(sum(time_to_sec(timediff(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate())),(select if(sum(C.duration)!='00:00:00',substring_index(sec_to_time(sum(C.duration)),'.',1),'00:00:00') from calls C where C.user=A.user_id and C.created_at=curdate()))))),'.',1) as totalTime,substring_index(sec_to_time(sum(time_to_sec(timediff(timediff(if(A.status='in',current_time(),A.out_time),A.in_time),(select if(substring_index(sec_to_time(sum(B.duration)),'.',1)!='00:00:00',substring_index(sec_to_time(sum(B.duration)),'.',1),'00:00:00') from break B where B.attendance_id=A.id and B.created_at=curdate()))))),'.',1) as TotalTimeBr,sec_to_time(sum(time_to_sec(timediff(if(A.status='in',current_time(),A.out_time),A.in_time)))) as TotalTimeAt from attendence A where A.date=curdate() and A.team_id='${req.body.team_id}' and A.company_id='${req.body.company_id}' and (A.status='in' or A.status='out')`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in teamIdleTime", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in TotalteamIdleTime", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

router.post("/companyweekAverageLogin", function (req, res, next) {
  //console.log("Request Body in Average Login Time", req.body);
  var startDay = moment().clone().startOf("week").format("YYYY-MM-DD");
  var endDay = moment().clone().endOf("week").format("YYYY-MM-DD");
  const qry = `SELECT concat(EXTRACT(DAY FROM date)," ",SUBSTRING(monthname(date), 1, 3)) as day,Floor(avg(duration)) as AverageLoginTime,SUBSTRING_INDEX(SEC_TO_TIME(Floor((avg(duration)))),'.',1) as AverageFormatedTime,(select power(10,length(max(avgvalue))-2) from (Select Floor(avg(duration)) as Avgvalue from attendence where date in (select date from attendence where date between '${startDay}' and '${endDay}' and status='out' and company_id='${req.body.company_id}') group by date)z) as length from attendence where date in (select date from attendence where date between "${startDay}" and "${endDay}" and status='out' and company_id='${req.body.company_id}') group by date`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error ==== 258 ", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result=====261", result.length);
      return res.status(200).json({
        status: true,
        // message: "Record Found",
        result,
        // AverageLoginTimeFormatted,
      });
    }
  });
});

router.get(
  `/managerPenalTeamMemberAttendanceShow/:company_id/:manager_id/:team_id`,
  function (req, res, next) {
    let qry = `select U.id, U.name, (select R.name from roles R where U.role_id=R.id) as RoleName, A.date, A.in_time as InTime, A.out_time as OutTime, if(A.status='out' or A.status='Force logout', B.duration, B.duration='00:00:00') as TotalBreak, A.duration as EffectiveHour, A.status as Status, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from user U join team T on U.team_id=T.id join attendence A on U.id=A.user_id left join break B on B.attendance_id=A.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and T.id="${req.params.team_id}" group by A.id, B.id order by A.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenalTeamMemberAttendanceShow", error);
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalTeamMemberAttendanceShow", result);
        const arr = [];
        result.map((item) => {
          item["EffectiveHour"] =
            item.Status == "Force logout"
              ? "-"
              : moment.utc(item.EffectiveHour * 1000).format("HH:mm:ss");
          item["TotalBreak"] = moment
            .utc(item.TotalBreak * 1000)
            .format("HH:mm:ss");
          item["OutTime"] =
            item.Status == "Force logout"
              ? "-"
              : moment(item.OutTime, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["InTime"] = moment(item.InTime, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : "-";
          arr.push(item);
        });
        return res
          .status(200)
          .json({ status: true, message: "Record found", arr });
      }
    });
  }
);

router.get(
  "/managerPenalAttendenceReport/:company_id/:manager_id",
  function (req, res, next) {
    var qry = `select U.name as UserName, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, A.date, A.in_time, A.out_time, if(A.status='out' or A.status='Force logout', B.duration, B.duration='00:00:00') as TotalBreak, A.duration as Effectivehours, A.status as Status, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence as A join user as U on A.user_id=U.id left join break B on B.attendance_id=A.id join team T on U.team_id=T.id where A.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" group by A.id, B.id order by A.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in manager penal attendence report", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        // //console.log("result in manager penal attendence report", result);
        const arr = [];
        result.map((item) => {
          item["Effectivehours"] =
            item.Status == "Force logout"
              ? "-"
              : moment.utc(item.Effectivehours * 1000).format("HH:mm:ss");
          item["TotalBreak"] = moment
            .utc(item.TotalBreak * 1000)
            .format("HH:mm:ss");
          item["out_time"] =
            item.Status == "Force logout" || item.Status == "in"
              ? "-"
              : moment(item.out_time, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["in_time"] = moment(item.in_time, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : "-";
          arr.push(item);
        });
        return res
          .status(200)
          .json({ status: true, message: "record found", arr });
      }
    });
  }
);

router.post(
  "/managerPenalFilterAttendenceReport/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("Request Body in attendance displpay for manager penal");
    const qry = `select U.name as UserName, (select R.name from roles R where R.id=U.role_id) as RoleName, (select T.team_name from team T where T.id=U.team_id) as TeamName, A.date, A.in_time, A.out_time, if(A.status='out' or A.status='Force logout', B.duration, B.duration='00:00:00') as TotalBreak, A.duration as Effectivehours, A.status as Status, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from attendence as A join user as U on A.user_id=U.id left join break B on B.attendance_id=A.id join team T on U.team_id=T.id where A.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and date(A.date) between "${req.body.startDate}" and "${req.body.endDate}" group by A.id, B.id order by A.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        // //console.log("Error in Attendence Display Filter =========", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("result in Attendence Display=========41", result);
        const arr = [];
        result.map((item) => {
          item["Effectivehours"] =
            item.Status == "Force logout"
              ? "-"
              : moment.utc(item.Effectivehours * 1000).format("HH:mm:ss");
          item["TotalBreak"] = moment
            .utc(item.TotalBreak * 1000)
            .format("HH:mm:ss");
          item["out_time"] =
            item.Status == "Force logout"
              ? "-"
              : moment(item.out_time, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["in_time"] = moment(item.in_time, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : "-";
          arr.push(item);
        });
        return res.status(200).json({
          status: true,
          arr,
          message: "Attendance data found!",
        });
      }
    });
  }
);

router.post(
  `/managerPenalTeamMemberFilterAttendanceShow/:company_id/:manager_id/:team_id`,
  function (req, res, next) {
    let qry = `select A.id, U.name, (select R.name from roles R where U.role_id=R.id) as RoleName, A.date, A.in_time as InTime, A.out_time as OutTime, if(A.status='out', B.duration, B.duration='00:00:00') as TotalBreak, A.duration as EffectiveHour, A.status as Status, B.start_time as BreakStartTime, B.end_time as BreakEndTime, B.created_at as BreakDate, B.break_type as BreakType from user U join team T on U.team_id=T.id join attendence A on U.id=A.user_id left join break B on B.attendance_id=A.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and T.id="${req.params.team_id}" and date(A.date) between "${req.body.startDate}%" and "${req.body.endDate}%" group by A.id, B.id order by A.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log(
          // "error in managerPenalTeamMemberFilterAttendanceShow",
          // error
        // );
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalTeamMemberFilterAttendanceShow", result);
        const arr = [];
        result.map((item) => {
          item["EffectiveHour"] =
            item.Status == "Force logout"
              ? "-"
              : moment.utc(item.EffectiveHour * 1000).format("HH:mm:ss");
          item["TotalBreak"] = moment
            .utc(item.TotalBreak * 1000)
            .format("HH:mm:ss");
          item["OutTime"] =
            item.Status == "Force logout"
              ? "-"
              : moment(item.OutTime, ["HH:mm:ss"]).format("hh:mm:ss a");
          item["InTime"] = moment(item.InTime, ["HH:mm:ss"]).format(
            "hh:mm:ss a"
          );
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : "-";
          arr.push(item);
        });
        return res
          .status(200)
          .json({ status: true, message: "Record found", arr });
      }
    });
  }
);

router.get(
  "/managerPenalWidgetsAnalysis/:company_id/:manager_id/:startDate/:endDate",
  function (req, res, next) {
    const qry = `select sum(attendence.duration) as TotalLoginTime from attendence join user on attendence.user_id=user.id join team on team.id=user.team_id where team.team_head="${req.params.manager_id}" and attendence.company_id="${req.params.company_id}" and attendence.date between '${req.params.startDate}%' and '${req.params.endDate}%'; select avg(break.duration) as AverageBreak,sum(break.duration) as TotalBreak from user join attendence on user.id=attendence.user_id join break on attendence.id=break.attendance_id join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and user.company_id="${req.params.company_id}" and break.created_at between '${req.params.startDate}%' and '${req.params.endDate}%'; select sum(calls.duration) as TotalTalkTime, avg(calls.duration) as AvGTalkTime from calls join user on calls.user=user.id join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and calls.company_id="${req.params.company_id}" and calls.created_at between '${req.params.startDate}%' and '${req.params.endDate}%';`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in managerPenalWidgetsAnalysis", error);
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong", error });
      } else {
        // //console.log("result in managerPenalWidgetsAnalysis", result);
        var temptotalLogin = result[0];
        var tempAvgBreakAndTotalBreak = result[1];
        var tempAvgTalkAndTotalTalk = result[2];

        var totalLogin = [temptotalLogin];
        var AvgBreakAndTotalBreak = [tempAvgBreakAndTotalBreak];
        var AvgTalkAndTotalTalk = [tempAvgTalkAndTotalTalk];
        var TotalLoginTime = totalLogin[0][0].TotalLoginTime;
        var TotlBrk = AvgBreakAndTotalBreak[0][0].TotalBreak;
        var AvgBrk = AvgBreakAndTotalBreak[0][0].AverageBreak;
        var TotalTalkTime = AvgTalkAndTotalTalk[0][0].TotalTalkime;
        var AverageTalkTime = AvgTalkAndTotalTalk[0][0].AverageTalkTime;
        var TotalLoginTimeFormatted =
          TotalLoginTime == null
            ? "00:00:00"
            : moment.utc(TotalLoginTime * 1000).format("HH:mm:ss");
        var AvgBrkFormatted =
          AvgBrk == null
            ? "00:00:00"
            : moment.utc(AvgBrk * 1000).format("HH:mm:ss");
        var TotlBrkFormatted =
          TotlBrk == null
            ? "00:00:00"
            : moment.utc(TotlBrk * 1000).format("HH:mm:ss");
        var TotalTalkTimeformatted =
          TotalTalkTime == null
            ? "00:00:00"
            : moment.utc(TotalTalkTime * 1000).format("HH:mm:ss");
        var AverageTalkTimeFormatted =
          AverageTalkTime == null
            ? "00:00:00"
            : moment.utc(AverageTalkTime * 1000).format("HH:mm:ss");
        return res.status(200).json({
          status: true,
          message: "record found",
          TotalLoginTimeFormatted,
          AvgBrkFormatted,
          TotlBrkFormatted,
          TotalTalkTimeformatted,
          AverageTalkTimeFormatted,
        });
      }
    });
  }
);

router.get(
  "/auditorPenalDahsobardWidgets/:company_id/:startDate/:endDate",
  function (req, res, next) {
    const qry = `select sum(duration) as TotalLoginTime from attendence where company_id='${req.params.company_id}' and date between '${req.params.startDate}%' and '${req.params.endDate}%'; select avg(duration) as AverageTalkTime, sum(duration) as TotalTalkime from calls where company_id='${req.params.company_id}' and created_at between '${req.params.startDate}%' and '${req.params.endDate}%'; select avg(B.duration) as AverageBreak, sum(B.duration) as TotalBreak from break B left join attendence A on A.id=B.attendance_id where A.company_id='${req.params.company_id}' and B.created_at between "${req.params.startDate}%" and "${req.params.endDate}%";`;

    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in adminPenalWidgest", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        var temptotalLogin = result[0];
        var tempAvgTalkAndTotalTalk = result[1];
        var tempAvgBreakAndTotalBreak = result[2];
        var totalLogin = [temptotalLogin];
        var AvgTalkAndTotalTalk = [tempAvgTalkAndTotalTalk];
        var AvgBreakAndTotalBreak = [tempAvgBreakAndTotalBreak];

        var TotalLoginTime = totalLogin[0][0].TotalLoginTime;
        var TotalLoginTimeFormatted =
          TotalLoginTime != null
            ? moment.utc(TotalLoginTime * 1000).format("HH:mm:ss")
            : "00:00:00";
        var TotalTalkTime = AvgTalkAndTotalTalk[0][0].TotalTalkime;
        var TotalTalkTimeformatted =
          TotalTalkTime != null
            ? moment.utc(TotalTalkTime * 1000).format("HH:mm:ss")
            : "00:00:00";
        var AverageTalkTime = AvgTalkAndTotalTalk[0][0].AverageTalkTime;
        var AverageTalkTimeFormatted =
          AverageTalkTime != null
            ? moment.utc(AverageTalkTime * 1000).format("HH:mm:ss")
            : "00:00:00";
        var TotlBrk = AvgBreakAndTotalBreak[0][0].TotalBreak;
        var TotlBrkFormatted =
          TotlBrk != null
            ? moment.utc(TotlBrk * 1000).format("HH:mm:ss")
            : "00:00:00";
        var AvgBrk = AvgBreakAndTotalBreak[0][0].AverageBreak;
        var AvgBrkFormatted =
          AvgBrk != null
            ? moment.utc(AvgBrk * 1000).format("HH:mm:ss")
            : "00:00:00";
        return res.status(200).json({
          status: true,
          message: "record found",
          TotalLoginTimeFormatted,
          TotalTalkTimeformatted,
          AverageTalkTimeFormatted,
          TotlBrkFormatted,
          AvgBrkFormatted,
        });
      }
    });
  }
);

module.exports = router;
