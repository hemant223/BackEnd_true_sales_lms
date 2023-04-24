var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.get(`/DisplayBreakType/:company_id`, function (req, res, next) {
  const qry = `select BT.* from breaktype BT where BT.company_id='${req.params.company_id}' order by BT.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in DisplayBreakType", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in DisplayBreakType", result);
      return res
        .status(200)
        .json({ status: true, message: "Record found", result });
    }
  });
});

router.post("/add", function (req, res, next) {
  const qry = `insert into breaktype set break_type="${req.body.break_type}", company_id="${req.body.company_id}", created_at="${req.body.created_at}", breakstatus="${req.body.breakstatus}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in breaktype add", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in breaktype add", result);
      return res
        .status(200)
        .json({ status: true, message: "record submit", result });
    }
  });
});

router.post("/update/:id/:company_id", function (req, res, next) 
  
{
  console.log('body',req.body)
  const qry = `update breaktype set break_type="${req.body.break_type}", company_id="${req.body.company_id}", updated_at="${req.body.updated_at}", breakstatus="${req.body.breakstatus}" where id="${req.body.id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      
       console.log("error in breaktype update", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in breaktype update", result);
      return res
        .status(200)
        .json({ status: true, message: "record update", result });
    }
  });
});




router.get("/display_all_type", function (req, res, next) {
  pool.query("select BT. *,(select name from company C where C.id=BT.company_id) as cname from breaktype BT", function (error, result) {
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




router.post("/delete", function (req, res, next) {
  pool.query(
    "delete from breaktype where id=?",
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

router.post("/delete_all_all_breaktype", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from breaktype where id in (?)",
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
