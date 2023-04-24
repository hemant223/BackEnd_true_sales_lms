var express = require("express");
var router = express.Router();
var pool = require("./pool");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("priority");
});

/// Task Priority Display for penal ///

router.get("/display", function (req, res, next) {
  pool.query("select * from taskpriority", function (error, result) {
    if (error) {
      //console.log("Error In Task Priority====13", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result In Task Priority=====16", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/priorityDisplay", function (req, res, next) {
  pool.query("select Pr. *,(select name from company C where C.id=Pr.company_id) as cname from Priority Pr", function (error, result) {
    if (error) {
      //console.log("Error In Priority====34", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Priority======37", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/taskType", function (req, res, next) {
  pool.query("select * from tasktype", function (error, result) {
    if (error) {
      //console.log("Error In tasktype====49", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in tasktype======54", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post(
  "/managerPenalTaskPriorityName/:company_id/:manager_id",
  function (req, res, next) {
    //console.log(
    //   "Requeste body in task priority for manager penal dashboard",
    //   req.params,
    //   req.body
    // );
    const qry = `select task.*,user.name as USER_NAME,team.team_name as TEAM_name,(select taskpriority from taskpriority where task.priority=taskpriority.task_priority_id ) as TaskPriorityName from task inner join user on task.user=user.id inner join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and task.priority="${req.body.low}" and task.company_id="${req.params.company_id}" group by task.id;select task.*,user.name as USER_NAME,team.team_name as TEAM_name,(select taskpriority from taskpriority where task.priority=taskpriority.task_priority_id ) as TaskPriorityName from task inner join user on task.user=user.id inner join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and task.priority="${req.body.medium}" and task.company_id="${req.params.company_id}" group by task.id;select task.*,user.name as USER_NAME,team.team_name as TEAM_name,(select taskpriority from taskpriority where task.priority=taskpriority.task_priority_id ) as TaskPriorityName from task inner join user on task.user=user.id inner join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and task.priority="${req.body.high}" and task.company_id="${req.params.company_id}" group by task.id; select task.*,user.name as USER_NAME,team.team_name as TEAM_name,(select taskpriority from taskpriority where task.priority=taskpriority.task_priority_id ) as TaskPriorityName from task inner join user on task.user=user.id inner join team on user.team_id=team.id where team.team_head="${req.params.manager_id}" and task.company_id="${req.params.company_id}" group by task.id;
  `;
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
  }
);

router.post("/add_priority", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into priority( company_id, name, created_at, updated_at) values(?,?,?,?)",
    [
      req.body.company_id,
      req.body.name,
      req.body.created_at,
      req.body.updated_at,
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

// router.post("/update_priority", function (req, res, next) {
//   console.log("BODY:", req.body);

//   pool.query(
//     "update priority set company_id=?, name=?,updated_at=? where id=?",
//     [
//       req.body.company_id,
//       req.body.name,

//       req.body.updated_at,
//       req.body.Id

//     ],
//     function (error, result) {
//       //console.log("BODY:", req.body);
//       if (error) {
//         //console.log(error);
//         return res.status(500).json({ result: false });
//       } else {
//         return res.status(200).json({ result: true });
//       }
//     }
//   );
// });

router.post("/edit_priority_data", function (req, res, next) {
  pool.query(
    "update priority set name=?,company_id=?,updated_at=? where id=?",
    [req.body.name, req.body.company_id, req.body.updated_at, req.body.id],
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ result: false });
      } else {
        return res.status(200).json({ result: true });
      }
    }
  );
});

router.post("/delete", function (req, res, next) {
  pool.query(
    "delete from priority where id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Priority deleted successfully" });
      }
    }
  );
});



router.post("/delete_all_all_priority", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from priority where id in (?)",
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


module.exports = router;
