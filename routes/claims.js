var express = require("express");
var router = express.Router();
var pool = require("./pool");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("claims");
});

router.post("/add", function (req, res, next) {
  const qry = `insert into claims set name='${req.body.name}', 
  slug='${req.body.slug}',
   parent_id='${req.body.parent_id}',
    created_at='${req.body.created_at}',
     company_id='${req.body.company_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Claims added successfully", result });
    }
  });
});

router.get("/display/:company_id", function (req, res, next) {
  //console.log("req in claims display for new penal");
  pool.query(
    `select * from claims where company_id="${req.params.company_id}";`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        return res
          .status(200)
          .json({ status: true, result, message: "Roles Data found!" });
      }
    }
  );
});

router.post("/update/:id", function (req, res, next) {
  const qry = `update claims set name='${req.body.name}', slug='${req.body.slug}', parent_id='${req.body.parent_id}', updated_at='${req.body.updated_at}', company_id='${req.body.company_id}' where id='${req.body.id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        message: "Claims updated successfully",
        result,
      });
    }
  });
});

router.delete("/delete/:id", function (req, res, next) {
  pool.query(
    "delete from claims where id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          data: result,
          message: "Claims Delete successfully",
        });
      }
    }
  );
});

router.post("/add_new_claims_data", function (req, res, next) {
  pool.query(
    "insert into claims(name, slug, parent_id, created_at, updated_at, company_id)values(?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.slug,
      req.body.parentid,
      req.body.createdat,
      req.body.updatedat,
      req.body.companyid,
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

router.get("/display_all_claims_data", function (req, res, next) {
  pool.query("select CLM. *,(select name from company C where C.id=CLM.company_id) as company_name from claims CLM ", function (error, result) {
    if (error) {
      
      return res.status(500).json({ data: [] });
    } else {
     
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_claims_data", function (req, res, next) {
  pool.query(
    "update claims set name=?,slug=?,parent_id=?,created_at=?,updated_at=?,company_id=? where id=?",
    [
      req.body.name,
      req.body.slug,
      req.body.parentid,
      req.body.createdat,
      req.body.updatedat,
      req.body.companyid,
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

router.post("/delete_claims", function (req, res, next) {
  
  pool.query(
    "delete from claims where id=?",
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

router.post("/delete_all_claims", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from claims where id in (?)",
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
