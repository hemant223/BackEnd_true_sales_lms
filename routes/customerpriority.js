var express = require("express");
var router = express.Router();
var pool = require("./pool");
/* GET home page. */

router.post("/add_new_customerpriority_data", function (req, res, next) {
  pool.query(
    "insert into customerpriority(company_id, customer_priority, color, created_at)values(?,?,?,?,?)",
    [
      req.body.companyid,
      req.body.customerpriority,
      req.body.color,
      req.body.createdat,
      
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

router.get("/display_all_customerpriority_data", function (req, res, next) {
  pool.query("select CP. *,(select name from company C where C.id=CP.company_id) as company_name from customerpriority CP ", function (error, result) {
    if (error) {
      
      return res.status(500).json({ data: [] });
    } else {

      return res.status(200).json({ data: result, status:true });
    }
  });
});

router.post("/edit_customerpriority_data", function (req, res, next) {
  pool.query(
    "update customerpriority set company_id=?, customer_priority=?, color=?, created_at=?, updated_at=? where customerpriority_id=?",
    [
      req.body.companyid,
      req.body.customerpriority,
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

router.post("/delete_customerpriority", function (req, res, next) { 
  pool.query(
    "delete from customerpriority where customerpriority_id=?",
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

router.post("/delete_all_customerpriority", function (req, res, next) {
  console.log("req body ", req.body.id);
  pool.query(
    "delete from customerpriority where customerpriority_id in (?)",
    [req.body.id],
    function (error, result) {
      if (error) {
        console.log("in error",error);
        return res.status(500).json({ status: false, error: error });
      } else {
        console.log("in success",result);

        return res.status(200).json({ status: true });
      }
    }
  );
});

router.get("/", function (req, res, next) {
  res.render("customerpriority");
});

router.post("/add", function (req, res, next) {
  console.log(req.body)
  pool.query(
    `insert into customerpriority set company_id="${req.body.company_id}", customer_priority="${req.body.customer_priority}", color="${req.body.color}", created_at="${req.body.created_at}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        //console.log("result", result);
        return res
          .status(200)
          .json({
            status: true,
            message: "Customer Priority added successfully",
            result,
          });
      }
    }
  );
});

router.get("/display/:company_id", function (req, res, next) {
  pool.query(
    `select * from customerpriority where company_id="${req.params.company_id}" order by customerpriority_id desc;`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        //console.log("result", result);
        return res
          .status(200)
          .json({ status: true, message: "Record found", result });
      }
    }
  );
});

router.post("/update/:customerpriority_id", function (req, res, next) {
  pool.query(
    `update customerpriority set company_id="${req.body.company_id}", customer_priority="${req.body.customer_priority}", color="${req.body.color}", created_at="${req.body.created_at}", updated_at="${req.body.updated_at}" where customerpriority_id="${req.params.customerpriority_id}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        //console.log("result", result);
        return res
          .status(200)
          .json({
            status: true,
            message: "Customer Priority Updated successfully",
            result,
          });
      }
    }
  );
});

module.exports = router;
