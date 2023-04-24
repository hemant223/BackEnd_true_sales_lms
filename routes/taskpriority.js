var express = require("express");
var router = express.Router();
var pool = require("./pool");
const moment = require("moment");

router.post("/add_new_taskpriority_data", function (req, res, next) {
  pool.query(
    "insert into taskpriority(company_id, taskpriority, color, created_at, updated_at)values(?,?,?,?,?)",
    [
      req.body.companyid,
      req.body.taskpriority,
      req.body.color,
      req.body.createdat,
      req.body.updatedat,
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

router.get("/display_all_taskpriority_data", function (req, res, next) {
  pool.query("select * from taskpriority", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_taskpriority_data", function (req, res, next) {
  pool.query(
    "update taskpriority set company_id=?, taskpriority=?, color=?, created_at=?, updated_at=? where task_priority_id=?",
    [
      req.body.companyid,
      req.body.taskpriority,
      req.body.color,
      req.body.createdat,
      req.body.updatedat,
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

router.post("/delete_taskpriority", function (req, res, next) {
  pool.query(
    "delete from taskpriority where task_priority_id=?",
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

router.post("/delete_all_taskpriority", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from taskpriority where task_priority_id in (?)",
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

router.post("/add", function (req, res, next) {
  pool.query(
    `insert into taskpriority set company_id="${req.body.company_id}", taskpriority="${req.body.taskpriority}", color="${req.body.color}", created_at="${req.body.created_at}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Task Priority added successfully", result });
      }
    }
  );
});

router.get("/display/:company_id", function (req, res, next) {
  pool.query(
    `select * from taskpriority where company_id="${req.params.company_id}" order by task_priority_id desc;`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    }
  );
});

router.post("/update/:task_priority_id", function (req, res, next) {
  pool.query(
    `update taskpriority set company_id="${req.body.company_id}", taskpriority="${req.body.taskpriority}", color="${req.body.color}", created_at="${req.body.created_at}", updated_at="${req.body.updated_at}" where task_priority_id="${req.params.task_priority_id}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Task Priority Updated successfully", result });s
      }
    }
  );
});




router.get("/display_all_task_priority", function (req, res, next) {
  console.log("BODY:", req.body);

  pool.query("select TP. *,(select C.name from company C where C.id=TP.company_id) as cname from taskpriority TP", function (error, result) {
    console.log("BODY:", req.body);
    if (error) {
      console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});


router.post("/delete", function (req, res, next) {
  pool.query(
    "delete from taskpriority where task_priority_id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Task Priority deleted successfully" });
      }
    }
  );
});




router.post("/delete_all_all_taskpriority", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from taskpriority where task_priority_id in (?)",
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
