var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_sf_integration_data", function (req, res, next) {
  pool.query(
    "insert into sf_integration(token_url, main_url, companyid, api_name)values(?,?,?,?)",
    [req.body.tokenUrl, req.body.mainUrl, req.body.companyId, req.body.apiName],
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

router.get("/display_all_sf_integration_data", function (req, res, next) {
  pool.query("select * from sf_integration", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_sf_integrationy_data", function (req, res, next) {
  pool.query(
    "update sf_integration set token_url=?, main_url=?, companyid=?, api_name=? where id=?",
    [
      req.body.tokenUrl,
      req.body.mainUrl,
      req.body.companyId,
      req.body.apiName,
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

router.post("/delete_sf_integration", function (req, res, next) {
  pool.query(
    "delete from sf_integration where id=?",
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

router.post("/delete_all_all_sf_integration", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from sf_integration where id in (?)",
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
