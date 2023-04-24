var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_disposition_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into disposition(   company_id, name, created_at, updated_at) values(?,?,?,?)",
    [req.body.companyId, req.body.name, req.body.createdAt, req.body.updatedAt],
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

router.get("/display_all_disposition", function (req, res, next) {
  //console.log("BODY:", req.body);

  // pool.query("select * from disposition", function (error, result) {
  pool.query("select D.*,(select C.name from company C where C.id=D.company_id) as cName from disposition D", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});

router.post("/edit_disposition_data", function (req, res, next) {
  pool.query(
    "update disposition set  company_id=?, name=?, created_at=?, updated_at=? where id= ?",
    [
      req.body.companyId,
      req.body.name,
      req.body.createdAt,
      req.body.updatedAt,
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

router.post("/delete_disposition_data", function (req, res, next) {
  pool.query(
    "delete from disposition where id=?",
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

router.post("/delete_all_all_disposition", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from disposition where id in (?)",
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
  res.render("disposition");
});

router.post("/add", function (req, res, next) {
  const qry = `insert into disposition set company_id="${req.body.company_id}", name="${req.body.name}", created_at="${req.body.created_at}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Disposition", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Disposition", result);
      return res
        .status(200)
        .json({
          status: true,
          message: "Disposition added successfully",
          result,
        });
    }
  });
});

router.post("/displayDisposition", function (req, res, next) {
  const qry = `select * from disposition where company_id='${req.body.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Disposition", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Disposition", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/display/:company_id", function (req, res, next) {
  pool.query(
    `select * from disposition where company_id="${req.params.company_id}" order by id desc;`,
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

router.post("/update/:id", function (req, res, next) {
  const qry = `update disposition set company_id="${req.body.company_id}", name="${req.body.name}", created_at="${req.body.created_at}", updated_at="${req.body.updated_at}" where id="${req.params.id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Disposition", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Disposition", result);
      return res
        .status(200)
        .json({
          status: true,
          message: "Disposition Updated successfully",
          result,
        });
    }
  });
});

module.exports = router;
