var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_abandoned_data", function (req, res, next) {
  pool.query(
    "insert into abandoned(abandoned_mobile, company_id, abandoned_status)values(?,?,?)",
    [req.body.abandonedmobile, req.body.companyid, req.body.abandonedstatus],
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

router.get("/display_all_abandoned_data", function (req, res, next) {
  pool.query("select A.*,(select C.name from company C where C.id=A.company_id) as cName from abandoned A", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [],status:false });
    } else {
      return res.status(200).json({ data: result,status:true });
    }
  });
});

router.post("/edit_abandoned_data", function (req, res, next) {
  console.log('req.body',req.body);
  pool.query(
    "update abandoned set abandoned_mobile=?, company_id=?, abandoned_status=? where abandoned_id=?",
    [
      req.body.abandonedmobile,
      req.body.companyid,
      req.body.abandonedstatus,
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

router.post("/delete_abandoned", function (req, res, next) {
  pool.query(
    "delete from abandoned where abandoned_id=?",
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
router.post("/delete_allabandoned", function (req, res, next) {
  pool.query(
    "delete from abandoned where abandoned_id in (?)",
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

router.get(`/DisplayAllAbandoned/:company_id`, function (req, res, next) {
  const qry = `select A.* from abandoned A where A.company_id='${req.params.company_id}' order by A.abandoned_id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in DisplayAllAbandoned", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in DisplayAllAbandoned", result);
      return res
        .status(200)
        .json({ status: true, message: "Record found", result });
    }
  });
});



router.post("/add", function (req, res, next) {
  if (!req.body.abandoned_mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.abandoned_mobile;
  } else {
    var FinalMobile = req.body.abandoned_mobile;
  }
  const qry = `insert into abandoned set abandoned_mobile="${FinalMobile}", company_id="${req.body.company_id}", abandoned_status="${req.body.abandoned_status}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in abandoned add", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in abandoned add", result);
      return res
        .status(200)
        .json({ status: true, message: "record submit", result });
    }
  });
});

router.post("/update/:id/:company_id", function (req, res, next) {
  if (!req.body.abandoned_mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.abandoned_mobile;
  } else {
    var FinalMobile = req.body.abandoned_mobile;
  }
  const qry = `update abandoned set abandoned_mobile="${FinalMobile}", company_id="${req.body.company_id}", abandoned_status="${req.body.abandoned_status}" where abandoned_id="${req.body.abandoned_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in abandoned add", error);
      return res
        .status(400)
        .json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in abandoned add", result);
      return res
        .status(200)
        .json({ status: true, message: "record update", result });
    }
  });
});

module.exports = router;
