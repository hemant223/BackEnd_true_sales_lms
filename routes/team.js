var express = require("express");
var router = express.Router();
var pool = require("./pool");
var multer = require("./config/multer");
const readXlsxFile = require("read-excel-file/node");

router.post('/delete_all_all_team', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from team where id in (?)",[req.body.id],function(error,result){

    if(error){
        console.log("in error")
        return res.status(500).json({status:false,error:error})
    }
    else{
      console.log("in success")

     return res.status(200).json({status:true})
    }
  })
});


router.post("/add_new_team_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into team( team_name, team_head, team_status, created_at, updated_at, company_id) values(?,?,?,?,?,?)",
    [
      req.body.teamName,
      req.body.teamStatus,
      req.body.teamHead,
      req.body.createdAt,
      req.body.updatedAt,
      req.body.companyId,
    ],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ result: false });
      } else {
        return res.status(200).json({ result: true });
      }
    }
  );
});

/* router.post("/delete_all_all_team", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from team where id in (?)",
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
}); */

router.get("/display_all_team", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query("select T.*,(select C.name from company C where C.id=T.company_id) as cName,(select U.name from user U where U.id=T.team_head) as uName from team T", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});
router.post("/display_all_user_name_by_company_id", function(req, res, next) {
  //console.log("BODY:", req.body);

  pool.query("select * from user  where company_id=?",[req.body.id],function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});

router.post("/edit_team_data", function (req, res, next) {
  console.log("BODY:", req.body);

  pool.query(
    "update team set team_name=?,team_head=?,team_status=?,updated_at=?,company_id=? where id= ?",
    [
      req.body.team_name,
      req.body.team_head,
      req.body.team_status,
      req.body.updated_at,
      req.body.company_id,
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

router.post("/delete_team_data", function (req, res, next) {
  pool.query(
    "delete from team where id=?",
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("team");
});

router.post("/add", function (req, res, next) {
  const qry = `insert into team set team_name='${req.body.team_name}', team_head='${req.body.team_head}', team_status='${req.body.team_status}', created_at='${req.body.created_at}', company_id='${req.body.company_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Team Add", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        message: "Team added successfully",
        result,
      });
    }
  });
});
router.get("/display", function (req, res, next) {
  pool.query(
    "select T.*,(select C.name from company C where C.id=T.company_id) as cname from team T",
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, data: result, message: "Task Data Found!" });
      }
    }
  );
});

router.get("/teamsShow/:company_id", function (req, res, next) {
  const qry = `select * from team where company_id="${req.params.company_id}" group by id order by id desc;`;
  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.get("/display/:id", function (req, res, next) {
  pool.query(
    "select T.*,(select C.name from company C where C.id=T.company_id) as cname from team T where T.id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        //console.log(error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, data: result, message: "Task Data Found!" });
      }
    }
  );
});

router.post("/update/:id", function (req, res, next) {
  //console.log("Requestt body", req.body);
  const qry = `update team set team_name="${req.body.team_name}", team_head="${req.body.team_head}", team_status="${req.body.team_status}", created_at="${req.body.created_at}", updated_at="${req.body.updated_at}", company_id="${req.body.company_id}" where id="${req.params.id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Team Update", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Team Update", result);
      return res.status(200).json({
        status: true,
        message: "Team updated successfully",
        result,
      });
    }
  });
});

router.post("/add", function (req, res, next) {
  const qry = `insert into team set team_name="${req.body.team_name}", team_head="${req.body.team_head}", team_status="${req.body.team_status}", created_at="${req.body.created_at}", company_id="${req.body.company_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Error in Team Add", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        message: "Team added successfully",
        result,
      });
    }
  });
});

router.post("/newPenalFilterTeams", function (req, res, next) {
  //console.log("req body in team filter", req.body);
  const qry = `select T.*,(select C.name from company C where C.id=T.company_id) as cname, (select U.name from user U where U.id=T.team_head) as TeamHead, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as UserName, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers , (select GROUP_CONCAT(U.id separator ', ') from user U where U.team_id=T.id) as UserId from team T where T.company_id=${req.params.company_id} and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by T.id desc;`;
  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.post("/delete/:id", function (req, res, next) {
  const qry = `delete from team where id='${req.params.id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Team deleted successfully" });
    }
  });
});

// Team Name and Member Name for Manager App //
router.post("/teamWithMember", function (req, res, next) {
  const qry = `select T.*, count(U.name) as UserCount, group_concat(U.name separator '#') as CSRName, group_concat(U.mobile separator '#') as CSRMobile from team T, user U where T.id=U.team_id group by T.id;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in teamWithMember", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in teamWithMember", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/teamHead", function (req, res, next) {
  const qry = `select T.*,(select C.name from  company C where C.id=T.company_id) as cname, (select U.name from user U where U.id=T.team_head) as TeamHead from  team T where T.company_id='1';`;
  // `select * from user where company_id='1';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Team Head", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Team Head", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", result });
    }
  });
});

router.post("/delete", function (req, res, next) {
  const qry = `delete from team where id IN(?) and company_id='1';`;
  pool.query(qry, [req.body.id], function (error, result) {
    if (error) {
      //console.log("Error in Multi Delete Team", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Multi Delete Team", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post(
  "/UploadExcel",
  multer.single("teamExcel"),
  function (req, res, next) {
    // //console.log("Request Body In Excel", req.body);
    // //console.log("Request file In Excel", req.file);
    readXlsxFile("public/images/" + req.file.originalname).then((rows) => {
      // //console.log("Rows in Route...", rows);
      rows.shift();
      // //console.log("Rows in Route of Shift =========97...", rows.length);
      var qry = "";
      if (rows.length != 0) {
        rows.map((item) => {
          var str = "'" + item.join("','") + "'";
          // //console.log("str==================== 101", str);
          qry += `INSERT INTO team(team_name,team_head,team_status,created_at,updated_at,company_id) VALUES(${str});`;
        });
        pool.query(qry, function (error, result) {
          if (error) {
            //console.log("Error In Upload Excel File =====103", error);
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

router.post("/CSRDetail", function (req, res, next) {
  pool.query(
    "select * from user where id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log("error>>>>>>>>146", error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          message: "GET CSR Detail Successfully",
          result,
        });
      }
    }
  );
});

router.post("/TeamManagementAuditor", function (req, res, next) {
  pool.query(
    `SELECT (select T.team_name from team T where T.id=U.team_id) as TeamName,(select T.id from team T where T.id=U.team_id) as TeamId,(select T.company_id from team T where T.id=U.team_id) as TeamCompanyId, group_concat(CONCAT_WS(',', U.id, U.name,U.company_id) SEPARATOR '|') as userlist FROM user U where U.company_id='${req.body.company_id}' group by U.team_id;`,
    function (error, result) {
      if (error) {
        //console.log("error>>>>>>>>146", error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        //console.log("result team management>>>>>>>>146", result);
        res
          .status(200)
          .json({ status: true, message: "GET Teams Successfully", result });
      }
    }
  );
});

router.post("/Teams", function (req, res, next) {
  //console.log("req body in teams>>>>>>>>>>>>>", req.body);
  pool.query(
    "select * from team where company_id=? and team_head=?",
    [req.body.company_id, req.body.user],
    function (error, result) {
      if (error) {
        //console.log("error>>>>>>>>146", error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "GET Teams Successfully", result });
      }
    }
  );
});

router.post("/TeamManagement", function (req, res, next) {
  pool.query(
    `SELECT (select T.team_name from team T where T.id=U.team_id) as TeamName,(select T.id from team T where T.id=U.team_id) as TeamId,(select T.company_id from team T where T.id=U.team_id) as TeamCompanyId, group_concat(CONCAT_WS(',', U.id, U.name,U.company_id) SEPARATOR '|') as userlist FROM user U where U.team_id in(Select T.id from team T where T.team_head='${req.body.user}') group by U.team_id;`,
    function (error, result) {
      if (error) {
        //console.log("error>>>>>>>>146", error);
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        //console.log("result team management>>>>>>>>146", result);
        res
          .status(200)
          .json({ status: true, message: "GET Teams Successfully", result });
      }
    }
  );
});

router.post("/addcustomer", function (req, res, next) {
  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }

  pool.query(
    "insert into customers(name, email, mobile, phone, address, type, status, note, created_at, updated_at, company_id, team_id, user, firmname, firstname, lastname, priority, pincode, outcome, createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.email,
      FinalMobile,
      null,
      req.body.address,
      req.body.type,
      req.body.status,
      req.body.note,
      req.body.created_at,
      null,
      req.body.company_id,
      req.body.team_id,
      req.body.user,
      req.body.firmname,
      req.body.firstName,
      req.body.lastName,
      req.body.priority,
      req.body.pinCode,
      null,
      req.body.createdBy,
    ],
    function (error, result) {
      if (error) {
        // //console.log("Error in Team Add", error);
        return res
          .status(500)
          .json({ status: false, message: error.sqlMessage });
      } else {
        return res.status(200).json({
          status: true,
          message: "Team added successfully",
          result,
        });
      }
    }
  );
});

router.post("/newPenalFilterTeams/:company_id", function (req, res, next) {
  //console.log("req body in team filter", req.body);
  const qry = `select T.team_name, (select U.name from user U where U.id=T.team_head) as Manager, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as TeamMembers, T.created_at as CreatedOn, T.team_status as Status from team T where T.company_id=${req.params.company_id} and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by T.id desc;`;
  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.get("/teamsDisplay/:company_id", function (req, res, next) {
  const qry = `select T.*,(select C.name from company C where C.id=T.company_id) as cname, (select U.name from user U where U.id=T.team_head) as TeamHead, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id or U.id=T.team_head) as UserName, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers , (select GROUP_CONCAT(U.id separator ', ') from user U where U.team_id=T.id or U.id=T.team_head) as UserId from team T where T.company_id="${req.params.company_id}" order by T.id desc;`;
  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.get("/teamsHeadDisplay/:company_id", function (req, res, next) {
  const qry = `select T.*, U.name as TeamHead, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id or U.id=T.team_head) as UserName, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers , (select GROUP_CONCAT(U.id separator ', ') from user U where U.team_id=T.id or U.id=T.team_head) as UserId from user U left join team T on U.team_id=T.id or U.id=T.team_head where U.company_id=${req.params.company_id} and U.team_id='0' order by T.id desc;`;

  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.get("/teamsReportData/:company_id", function (req, res, next) {
  const qry = `select T.team_name, (select U.name from user U where U.id=T.team_head) as Manager, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as TeamMembers, T.created_at as CreatedOn, T.team_status as Status from team T where T.company_id="${req.params.company_id}" order by T.id desc;`;
  pool.query(qry, (error, data) => {
    if (error) {
      // //console.log("Error=====44", error);
      return res.status(400).json({ status: false, error });
    } else {
      // //console.log("Data======46", data);
      return res
        .status(200)
        .json({ status: true, message: "Record Found...", data });
    }
  });
});

router.get(
  `/teamsShowForManagerPenal/:company_id/:manager_id`,
  function (req, res, next) {
    let qry = `SELECT T.* FROM team T where T.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}";`;
    pool.query(qry, function (err, result) {
      if (err) {
        // //console.log("Error=====44", err);
        return res.status(400).json({ status: false, err });
      } else {
        // //console.log("Data======46", data);
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", result });
      }
    });
  }
);

router.get(`/managerPenalTeamsMembersShow/:company_id/:manager_id/:team_id/:CurrDate`, function (req, res, next) {
  let qry = `select T.*, T.created_at as TeamDate, (select U.name from user U where U.id=T.team_head) as TeamHead,U.*, (select R.name from roles R where U.role_id=R.id) as RoleName,if(A.status="in", CLS.livestatus, "") as livestatus,CLS.created_at as LiveTimeStatus,CLS.duration as CallDuration,CLS.updated_at as IdleTime from user U join team T on U.team_id=T.id left join calllivestatus CLS on CLS.user_id=U.id left join attendence A on U.id=A.user_id and A.date="${req.params.CurrDate}" where T.team_head='${req.params.manager_id}' and U.company_id='${req.params.company_id}' and T.id='${req.params.team_id}' group by U.id order by U.id desc;select count(U.id) as TotalUser, (select count(U.id) from user U join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and U.status='Active' and T.id="${req.params.team_id}" and U.company_id="${req.params.company_id}") as ActiveUser from user U join team T on U.team_id=T.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and T.id="${req.params.team_id}";select count(TS.id) as TotalTask, (select count(TS.id) from task TS join user U on TS.user=U.id join team T on U.team_id=T.id where T.team_head="${req.params.manager_id}" and TS.status='3' and T.id="${req.params.team_id}" and U.company_id="${req.params.company_id}") as CompleteTask from task TS join user U on TS.user=U.id join team T on U.team_id=T.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and T.id="${req.params.team_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in managerPenalTeamsMembersShow", error);
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong", error });
    } else {
      // //console.log("result in managerPenalTeamsMembersShow", result);
      let TDetail = result[0];
      let TMem = result[1];
      let TotalTS = result[2];
      let TeamDetail = [TDetail];
      let TeamMember = [TMem];
      let TotalTask = [TotalTS];
      return res.status(200).json({
        status: true,
        message: "Record Found",
        TeamDetail,
        TeamMember,
        TotalTask,
      });
    }
  });
}
);


router.get("/managerPenalTeamsReportData/:company_id/:manager_id",
  function (req, res, next) {
    const qry = `select T.team_name, (select U.name from user U where U.id=T.team_head) as Manager, COUNT(U.name)as TotalMembers, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as TeamMembers, T.created_at as CreatedOn, T.team_status as Status from user U join team T on U.team_id=T.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" group by T.id order by T.id desc;`;
    pool.query(qry, (error, data) => {
      if (error) {
        // //console.log("Error=====44", error);
        return res.status(400).json({ status: false, error });
      } else {
        // //console.log("Data======46", data);
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", data });
      }
    });
  }
);

router.post(
  "/managerPenalFilterTeamsReportData/:company_id/:manager_id",
  function (req, res, next) {
    const qry = `select T.team_name, (select U.name from user U where U.id=T.team_head) as Manager, COUNT(U.name)as TotalMembers, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as TeamMembers, T.created_at as CreatedOn, T.team_status as Status from user U join team T on U.team_id=T.id where U.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" and date(T.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by T.id order by T.id desc;`;
    pool.query(qry, (error, data) => {
      if (error) {
        // //console.log("Error=====44", error);
        return res.status(400).json({ status: false, error });
      } else {
        // //console.log("Data======46", data);
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", data });
      }
    });
  }
);

router.get(
  "/managerPenalTeamsDisplay/:company_id/:manager_id",
  function (req, res, next) {
    const qry = `select T.*,(select C.name from company C where C.id=T.company_id) as cname, (select U.name from user U where U.id=T.team_head) as TeamHead, (select GROUP_CONCAT(U.name separator ', ') from user U where U.team_id=T.id) as UserName, (select COUNT(U.name) from user U where U.team_id=T.id) as TotalMembers , (select GROUP_CONCAT(U.id separator ', ') from user U where U.team_id=T.id) as UserId from team T where T.company_id="${req.params.company_id}" and T.team_head="${req.params.manager_id}" group by T.id order by T.id desc;`;
    pool.query(qry, (error, data) => {
      if (error) {
        // //console.log("Error=====44", error);
        return res.status(400).json({ status: false, error });
      } else {
        // //console.log("Data======46", data);
        return res
          .status(200)
          .json({ status: true, message: "Record Found...", data });
      }
    });
  }
);

module.exports = router;
