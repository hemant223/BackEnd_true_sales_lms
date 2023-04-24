var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_task_status_data", function (req, res, next) {
  console.log('addddd:',req.body)
  pool.query(
    "insert into taskstatus(company_id, task_status, status_color)values(?,?,?)",
    [req.body.company_id, req.body.name, req.body.color],
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

router.get("/display_all_task_status_data", function (req, res, next) {
  pool.query("select TS. *,(select name from company C where C.id=TS.company_id) as company_name from taskstatus TS ", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_task_status_data/:id", function (req, res, next) {
  pool.query(
    "update taskstatus set company_id=?, task_status=?, status_color=? where taskstatus_id=?",
    [
      req.body.company_id,
      req.body.name,
      req.body.color,
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

router.post("/delete_task_status", function (req, res, next) {
  pool.query(
    "delete from taskstatus where taskstatus_id=?",
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

router.post("/delete_all_all_taskstatus", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from taskstatus where taskstatus_id in (?)",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log("in error",error);
        return res.status(500).json({ status: false, error: error });
      } else {
        //console.log("in success",result);

        return res.status(200).json({ status: true });
      }
    }
  );
});

router.get("/showTaskStatus/:company_id", function (req, res, next) {
  var qry = `select TS.* from taskstatus TS where TS.company_id="${req.params.company_id}" and task_status='Completed';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in showTaskStatus", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      //console.log("result in showTaskStatus", result);
      return res
        .status(200)
        .json({ status: true, messag: "record found", result });
    }
  });
});

module.exports = router;
