var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_customers_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "insert into roles(  name, slug, created_at, updated_at, company_id) values(?,?,?,?,?)",
    [
      req.body.name,
      req.body.slug,
      req.body.createdat,
      req.body.updatedat,
      req.body.companyid,
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

router.get("/display_all_roles", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query("select RL. *,(select name from company C where C.id=RL.company_id) as cname from roles RL", function (error, result) {
    console.log("BODY:", req.body);
    if (error) {
      console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});



router.post("/edit_roles_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "update roles set name=?,slug=?,updated_at=?,company_id=? where id= ?",
    [
      req.body.name,
      req.body.slug,
     
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

router.post("/delete_roles", function (req, res, next) {
  pool.query(
    "delete from roles where id=?",
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
router.post("/delete_all_all_roles", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from roles where id in (?)",
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
  res.render("roles");
});

router.post("/add", function (req, res, next) {
  const qry = `insert into roles set name='${req.body.name}', slug='${req.body.slug}', created_at='${req.body.created_at}', company_id='${req.body.company_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      //console.log("Result of Roles", result);
      return res
        .status(200)
        .json({ status: true, message: "Record saved", result });
    }
  });
});

router.get("/display", function (req, res, next) {
  pool.query("select * from roles", function (error, result) {
    if (error) {
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      res
        .status(200)
        .json({ status: true, data: result, message: "Roles Data found!" });
    }
  });
});

router.get("/newPenalRolesDisplay/:company_id", function (req, res, next) {
  //console.log("req in role display for new penal");
  pool.query(
    `SELECT r.name, r.perm, r.claimsId, r.company_id, r.id, COUNT(*) 'UserCount' FROM user u INNER JOIN (SELECT r.company_id, r.id, r.name, GROUP_CONCAT(rc.claim_id separator', ') 'claimsId' , GROUP_CONCAT(c.slug separator', ') 'perm' FROM roles r INNER JOIN roleclaims rc ON rc.role_id = r.id INNER JOIN claims c ON c.id = rc.claim_id GROUP BY r.id, r.name, r.company_id ) r ON r.id = u.role_id where u.company_id="${req.params.company_id}" GROUP BY r.name, r.perm,r.claimsId;`,
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

router.get("/newPenalRoleDisplay/:company_id", function (req, res, next) {
  pool.query(
    `select * from roles where company_id="${req.params.company_id}";`,
    function (error, result) {
      if (error) {
        //console.log("error in newPenalRoleDisplay", error);
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

router.get("/display/:id", function (req, res, next) {
  pool.query(
    "select * from roles where id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, data: result, message: "Roles Data found!" });
      }
    }
  );
});

router.post("/update/:id/:company_id", function (req, res, next) {
  //console.log("Request body in roles update", req.body);
  const qry = `update roles set name="${req.body.name}", slug="${req.body.slug}", updated_at="${req.body.updated_at}" where id="${req.params.id}" and company_id="${req.params.company_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        result,
        message: "Roles Updated successfully",
      });
    }
  });
});

router.delete("/delete/:id", function (req, res, next) {
  pool.query(
    "delete from roles where id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Roles deleted successfully" });
      }
    }
  );
});

module.exports = router;
