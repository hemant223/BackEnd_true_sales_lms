var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/fetchlivestatus", function (req, res) {
  const qry = `select * from calllivestatus where team_id='${req.body.team_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("ERROR>>>>>>>>>.>>>>>>>>9", error)
      return res.status(500).json({ status: false, message: "something went wrong", error })
    } else {
      //console.log("RESULT>>>>>>>>>>>>>>>>>>>>>>>>>11", result)
      let finalResults = [];
      const resultsLength = result.length;
      for (let index = 0; index < resultsLength; index++) {
        finalResults.push({ ...result[index] });
      }
      // //console.log("RESULT>>>>>>>>>>>>>>>>>>>>>>>>>11", finalResults)
      var found = finalResults.find(function (element) {
        if (element.user_id == req.body.user_id)
          return true
      });

      if (found && finalResults.length > 0) {
        if (req.body.livestatus == "Wrapping up") {
          var qry = `update calllivestatus set livestatus='${req.body.livestatus}' where user_id='${req.body.user_id}';`
        } else {
          var qry = `update calllivestatus set livestatus='On call',created_at='${req.body.created_at}' where user_id='${req.body.user_id}';`
        }
      } else {
        var qry = `insert into calllivestatus set user_id='${req.body.user_id}', company_id='${req.body.company_id}', customer_id='${req.body.customer_id}', callstatus='${req.body.callstatus}', livestatus='On call',duration='${req.body.duration}', created_at='${req.body.created_at}', team_id='${req.body.team_id}';`;
      }
      pool.query(qry, function (error, result) {
        if (error) {
          //console.log("error in calllive status", error);
          return res.status(500).json({ status: false, message: "something went wrong", error })
        } else {
          //console.log("result in calllive status", result);
          return res.status(200).json({ status: true, message: "record submit", result });
        }
      })
    }
  })
})

router.post('/fetchLivestatusWrapping', function (req, res, next) {
  var qry = `select * from calllivestatus where user_id="${req.body.user_id}"`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in calllive status", error);
      return res.status(500).json({ status: false, message: "something went wrong", error })
    } else {
      //console.log("result in calllive status", result);
      return res.status(200).json({ status: true, message: "record submit", result });
    }
  })
})

router.post('/fetchlivestatusafterwrapping', function (req, res, next) {
  //console.log('req.body>>>>>60', req.body)
  var qry = `update calllivestatus set livestatus='${req.body.livestatus}', updated_at='${req.body.updated_at}' where user_id='${req.body.user_id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in calllive status", error);
      return res.status(500).json({ status: false, message: "something went wrong", error })
    } else {
      //console.log("result in calllive status", result);
      return res.status(200).json({ status: true, message: "record submit", result });
    }
  })
})

router.post('/updateTimeAfterAttendance', function (req, res, next) {
  //console.log('req.body>>>>>60', req.body)
  var qry = `update calllivestatus set updated_at='${req.body.updated_at}' where user_id='${req.body.user_id}' and company_id="${req.body.company_id}" and team_id="${req.body.team_id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("error in calllive status", error);
      return res.status(500).json({ status: false, message: "something went wrong", error })
    } else {
      // //console.log("result in calllive status>>>>>>>>.81>>>>>>>>>>>>>>>", result);
      return res.status(200).json({ status: true, message: "record submit", result });
    }
  })
})

router.get("/fetchLiveStatusAdminPenal/:company_id", function (req, res, next) {
  var qry = `select * from calllivestatus where company_id='${req.params.company_id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in call Live Status", error);
      return res.status(400).json({ status: false, message: "something went wrong", error });
    } else {
      // //console.log("result in call Live status", result);
      return res.status(200).json({ status: true, message: "record found", result });
    }
  });
});

module.exports = router;
