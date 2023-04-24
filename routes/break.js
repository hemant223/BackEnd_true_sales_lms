var express = require("express");
var router = express.Router();
var pool = require("./pool");
var moment = require("moment");

router.post("/add_new_break_data", function (req, res, next) {
  pool.query(
    "insert into break(attendance_id, start_time, end_time, in_time_gps, out_time_gps, status,created_at,duration,break_type)values(?,?,?,?,?,?,?,?,?)",
    [
      req.body.attendanceId,
      req.body.startTime,
      req.body.endTime,
      req.body.inTimeGps,
      req.body.outTimeGps,
      req.body.status,
      req.body.createdAt,
      req.body.breakType,
      req.body.duration,
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

router.get("/display_all_break", function (req, res, next) {
  //console.log("BODY:", req.body);
  pool.query("select * from break", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_break_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "update break set attendance_id=?,start_time=?,end_time=?,in_time_gps=?,out_time_gps=?,status=? ,created_at=?,duration=? where id=?",
    [
      req.body.attendanceId,
      req.body.startTime,
      req.body.endTime,
      req.body.inTimeGps,
      req.body.outTimeGps,
      req.body.status,
      req.body.createdAt,
      req.body.duration,
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

router.post("/delete_break_data", function (req, res, next) {
  pool.query(
    "delete from break where id=?",
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

router.post("/delete_all_all_break", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from break where id in (?)",
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
  res.render("break");
});

router.post("/companymonthtotalBreak", function (req, res, next) {
  var startDay = moment().subtract(26, "d").format("YYYY-MM-DD");
  var endDay = moment().format("YYYY-MM-DD");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at between "${startDay}" and "${endDay}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at in (select created_at from break where created_at between "${startDay}" and "${endDay}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in total Break=====171", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/companylastmonthtotalBreak", function (req, res, next) {
  var startDay = moment().subtract(3, "month").startOf("month");
  var endDay = moment().subtract(1, "month").endOf("month");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${FinalstartDayy}" and "${FinalendDayy}" ) and created_at between "${FinalstartDayy}" and "${FinalendDayy}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${FinalstartDayy}" and "${FinalendDayy}" ) and created_at in (select created_at from break where created_at between "${FinalstartDayy}" and "${FinalendDayy}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      //console.log("Result in total Break=====171", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/insertBreak", function (req, res, next) {
  //console.log("req.body 10>>>>>", req.body);
  const qry = `insert into break set ?`;
  pool.query(qry, req.body, function (error, result) {
    if (error) {
      //console.log("Error in Insert Break", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Insert Break====18", result);
      return res.status(200).json({
        status: true,
        message: "Record Inserted",
        idd: result.insertId,
      });
    }
  });
});

// router.post("/chkuserbreak", function (req, res, next) {
//   //console.log("req.body100", req.body);
//   const qry = `select B.* from break as B join attendence as A on B.attendance_id=A.id where A.user_id='${req.body.user}' and A.company_id='${req.body.company_id}' and A.date='${req.body.date}';`;
//   pool.query(qry, function (error, result) {
//     if (error) {
//       res.status(500).json({ status: false, message: error.sqlMessage });
//     } else {
//       //console.log(result);
//       if (result.length == 0)
//         res.status(200).json({
//           status: true,
//           message: "Start My Day",
//           attendancestatus: "",
//         });
//       else {
//         res.status(200).json({
//           status: false,
//           message: "End My Day",
//           id: result[0].id,
//           attendancestatus: result[0].status,
//         });
//       }
//     }
//   });
// });

// router.post("/updateBreak", function (req, res, next) {
//   //console.log("req.body>>>>", req.body);
//   const qry = `update break set end_time='${req.body.end_time}', out_time_gps='${req.body.out_time_gps}', status='${req.body.status}',duration='${req.body.duration}',created_at='${req.body.created_at}' where id='${req.body.id}'`;
//   pool.query(qry, function (error, result) {
//     if (error) {
//       // //console.log("Error in Break Update", error);
//       res.status(400).json({ status: false, message: error.sqlMessage });
//     } else {
//       // //console.log("result 74>>>>>>>>>", result);
//       res.status(200).json({
//         status: true,
//         message: "Attendance updated successfully",
//         data: req.body,
//       });
//     }
//   });
// });

router.post("/updateBreak", function (req, res, next) {
  pool.query(
    "update break set attendance_id=?,start_time=?,end_time=?,in_time_gps=?,out_time_gps=?,status=?,duration=?,break_type=? where id=?",
    [
      req.body.attendanceId,
      req.body.startTime,
      req.body.endTime,
      req.body.inTimeGps,
      req.body.outTimeGps,
      req.body.status,
      req.body.duration,
      req.body.breakType,
      req.body.breakId,
    ],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  )
}

);

router.get("/displayBreak/:attendanceid/:TodayDate", function (req, res, next) {
  //console.log("req.params---->>>>228", req.params);
  pool.query(
    `select * from break where attendance_id='${req.params.attendanceid}' and created_at='${req.params.TodayDate}'`,
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

router.post("/totalBreak", function (req, res, next) {
  const qry = `select sum(duration) as TotalBreak from break where attendance_id='${req.body.attendanceId}' and created_at='${req.body.created_at}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in total Break=====82", result);
      var TotalBreak = result[0].TotalBreak;
      var TotalBreakFormatted = moment
        .utc(TotalBreak * 1000)
        .format("HH:mm:ss");
      // //console.log("TotalBreakFormatted===87", TotalBreakFormatted);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
        TotalBreakFormatted,
      });
    }
  });
});

///////////////////////////// MEMBER ON BREAK //////////////////////////////////////////////

router.post("/teamsMemberOnBreak", function (req, res, next) {
  //console.log("req.body in264", req.body);
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select B.*, A.*,count(attendance_id) as personOnBreak,(select U.name from user U where A.user_id = U.id) as UserName from break B join attendence A on B.attendance_id = A.id where A.team_id=? and A.status='in' and B.status='start' and A.date='${date}' group by attendance_id;`,
    [req.body.team_id],
    function (error, result) {
      if (error) {
        //console.log("Error in teamsMemberOnBreak", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in teamsMemberOnBreak", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

router.get("/CompanyMemberOnBreak/:company_id", function (req, res, next) {
  //console.log("req.bodyin---->>228", req.body);
  var date = moment().format("YYYY-MM-DD");
  pool.query(
    `select B.*, A.*,count(attendance_id) as personOnBreak,(select U.name from user U where A.user_id = U.id) as UserName from break B join attendence A on B.attendance_id = A.id where A.company_id='${req.params.company_id}' and A.status='in' and B.status='start' and A.date='${date}' group by attendance_id;`,
    function (error, result) {
      if (error) {
        //console.log("Error in teamsMemberOnBreak", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Result in teamsMemberOnBreak", result);
        return res
          .status(200)
          .json({ status: true, message: "Record Found", result });
      }
    }
  );
});

///////////////////// TOTAL BREAK /////////////////////////

router.post("/teamsMemberTotalBreak", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  const qry = `SELECT SUBSTRING_INDEX(SEC_TO_TIME(Floor(sum(duration))),'.',1) as TotalBreak from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date="${date}" ) and status='end' and created_at="${date}" group by created_at;`;
  pool.query(qry, function (error, result) {
    //console.log("qry>>>>>TotalBreak", qry);
    if (error) {
      // //console.log("Error in teamsMemberTotalBreak", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in teamsMemberTotalBreak", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/CompanyMemberTotalBreak/:company_id", function (req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  const qry = `SELECT SUBSTRING_INDEX(SEC_TO_TIME(Floor(sum(duration))),'.',1) as TotalBreak from break where attendance_id in (Select id from attendence where company_id='${req.params.company_id}' and date="${date}") and status='end' and created_at="${date}" group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in teamsMemberTotalBreak", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in teamsMemberTotalBreak", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/companyweektotalBreak", function (req, res, next) {
  var startDay = moment().clone().startOf("week").format("YYYY-MM-DD");
  var endDay = moment().clone().endOf("week").format("YYYY-MM-DD");
  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at between "${startDay}" and "${endDay}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at in (select created_at from break where created_at between "${startDay}" and "${endDay}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      //console.log("result in week total break>>>>>>>>>>>>>>>>>", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/fetchBreakType", function (req, res, next) {
  const qry = `select * from breaktype where company_id="${req.body.company_id}"`;
  pool.query(qry, function (error, result) {
    if (error) {
      res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("BREAK TYPE RESULT>>>>>>>>>>>>>>136", result);
      res.status(200).json({ status: true, message: "Data found", result });
    }
  });
});

/////////////// MANAGER APP API ////////////////////

router.post("/weektotalBreak", function (req, res, next) {
  var startDay = moment().clone().startOf("week").format("YYYY-MM-DD");
  var endDay = moment().clone().endOf("week").format("YYYY-MM-DD");
  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at between "${startDay}" and "${endDay}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at in (select created_at from break where created_at between "${startDay}" and "${endDay}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Total Break====79", error);
      return res
        .status(400)

        .json({ status: false, message: "Error occurred", error });
    } else {
      //console.log("result in week total break>>>>>>>>>>>>>>>>>", result);

      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/monthtotalBreak", function (req, res, next) {
  var startDay = moment().subtract(26, "d").format("YYYY-MM-DD");
  var endDay = moment().format("YYYY-MM-DD");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);

  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at between "${startDay}" and "${endDay}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${startDay}" and "${endDay}" ) and created_at in (select created_at from break where created_at between "${startDay}" and "${endDay}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      //console.log("Result in total Break=====171", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.post("/lastmonthtotalBreak", function (req, res, next) {
  // //console.log("Request Body===150", req.body);
  var startDay = moment().subtract(3, "month").startOf("month");
  var endDay = moment().subtract(1, "month").endOf("month");
  var FsD = JSON.stringify(startDay);
  var FinalstartDay = FsD.split("T")[0];
  var FinalstartDayy = FinalstartDay.replace(`"`, ``);
  var EsD = JSON.stringify(endDay);
  var FinalendDay = EsD.split("T")[0];
  var FinalendDayy = FinalendDay.replace(`"`, ``);
  const qry = `SELECT Floor(sum(duration)) as AverageBreak,SUBSTRING_INDEX(SEC_TO_TIME(Floor((sum(duration)))),'.',1) as AverageFormatedTime, concat(EXTRACT(DAY FROM created_at)," ",SUBSTRING(monthname(created_at), 1, 3)) as day, sum(duration) as TotalBreak,(select power(10,length(max(avgvalue))-2) from (select avg(duration) as Avgvalue from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${FinalstartDayy}" and "${FinalendDayy}" ) and created_at between "${FinalstartDayy}" and "${FinalendDayy}" group by created_at)z) as length from break where attendance_id in (Select id from attendence where team_id='${req.body.team_id}'  and company_id='${req.body.company_id}' and date between "${FinalstartDayy}" and "${FinalendDayy}" ) and created_at in (select created_at from break where created_at between "${FinalstartDayy}" and "${FinalendDayy}" ) group by created_at;`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Total Break====79", error);
      return res
        .status(400)
        .json({ status: false, message: "Error occurred", error });
    } else {
      // //console.log("Result in total Break=====171", result);
      return res.status(200).json({
        status: true,
        message: "Record Found",
        result,
      });
    }
  });
});

router.get(
  "/callStatusDuration/:company_id/:user_id",
  function (req, res, next) {
    var currDate = moment().format("YYYY-MM-DD");
    //console.log("currDate--->", currDate);
    const qry = `select if(A.status='in', CLS.created_at, "attendance not marked yet") as CallTime from user U left join calls CL on U.id=CL.user left join attendence A on U.id=A.user_id left join calllivestatus CLS on U.id=CLS.user_id where U.company_id='${req.params.company_id}' and U.id='${req.params.user_id}' and CLS.livestatus="On call" or CLS.livestatus="Wrapping up" and A.date="${currDate}" group by U.id;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("error in callStatusDuration", error);
        return res
          .status(400)
          .json({ status: false, message: "something went wrong", error });
      } else {
        //console.log("result in callStatusDuration", result);
        return res
          .status(200)
          .json({ status: true, message: "record found", result });
      }
    });
  }
);

router.get(`/totalIdleTime/:company_id/:user_id`, function (req, res, next) {
  var curdate = moment().format("YYYY-MM-DD");
  const qry = `select CLS.livestatus, CLS.updated_at from user U left join attendence A on U.id=A.user_id left join calllivestatus CLS on U.id=CLS.user_id where U.company_id="${req.params.company_id}" and U.id="${req.params.user_id}" and A.status='in' and A.date='${curdate}' and CLS.created_at like"${curdate}%" group by U.id;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in totalIdleTime", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong" });
    } else {
      //console.log("result in totalIdleTime", result);
      return res
        .status(200)
        .json({ status: true, message: "record found", result });
    }
  });
});

module.exports = router;
