var express = require("express");
var router = express.Router();
var pool = require("./pool");
const moment = require("moment");

router.post("/add_new_task_type_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into tasktype(  company_id, task_type, created_at, updated_at) values(?,?,?,?)",
    [
      req.body.companyId,
      req.body.taskType,
      req.body.createdAt,
      req.body.updatedAt,
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

router.post("/delete_all_all_tasktype", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from tasktype where task_type_id in (?)",
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

router.get("/display_all_task_type", function (req, res, next) {
  //console.log("BODY:", req.body);

  // pool.query("select * from tasktype", function (error, result) {
  pool.query("select TT.*,(select C.name from company C where C.id=TT.company_id) as cName from tasktype TT", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});

router.post("/edit_task_type_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "update tasktype set  company_id=?, task_type=?, created_at=?, updated_at=? where task_type_id= ?",
    [
      req.body.companyId,
      req.body.taskType,
      req.body.createdAt,
      req.body.updatedAt,
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

router.post("/delete_task_type_data", function (req, res, next) {
  pool.query(
    "delete from tasktype where task_type_id=?",
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

router.post("/add", function (req, res, next) {
  pool.query(
    `insert into tasktype set task_type="${req.body.task_type}", created_at="${req.body.created_at}", company_id="${req.body.company_id}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        return res
          .status(200)
          .json({
            status: true,
            message: "Task type added successfully",
            result,
          });
      }
    }
  );
});

router.get("/display/:company_id", function (req, res, next) {
  pool.query(
    `select * from tasktype where company_id="${req.params.company_id}" order by task_type_id desc;`,
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

router.post("/update/:tasktype_id", function (req, res, next) {
  pool.query(
    `update tasktype set task_type="${req.body.task_type}", created_at="${req.body.created_at}", company_id="${req.body.company_id}", updated_at="${req.body.updated_at}" where task_type_id="${req.params.tasktype_id}" ;`,
    function (error, result) {
      if (error) {
        //console.log("error in tasktype update", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        return res
          .status(200)
          .json({
            status: true,
            message: "Task Type Updated successfully",
            result,
          });
      }
    }
  );
});

module.exports = router;
