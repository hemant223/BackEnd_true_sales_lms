var express = require("express");
var router = express.Router();
var pool = require("./pool");
const moment = require("moment");
var multer = require("./config/multer");
const readXlsxFile = require("read-excel-file/node");

router.post(
  "/add_new_briefings_data",
  multer.single("icon"),
  function (req, res, next) {
    pool.query(
      "insert into briefings(company_id, msg_type, msg_title, msg_description, created_at, updated_at,icon, posted_team, date_from, date_to) values(?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.companyid,
        req.body.msgtype,
        req.body.msgtitle,
        req.body.msgdescription,
        req.body.createdat,
        req.body.updatedat,
        req.file.filename,
        req.body.postedteam,
        req.body.datefrom,
        req.body.dateto,
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
  }
);

router.get("/display_all_briefings", function (req, res, next) {
  pool.query("select * from briefings", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_briefings_data", function (req, res, next) {
  pool.query(
    "update briefings set company_id=?, msg_type=?, msg_title=?, msg_description=?, created_at=?, updated_at=?, posted_team=?, date_from=?, date_to=? where id=?",
    [
      req.body.companyid,
      req.body.msgtype,
      req.body.msgtitle,
      req.body.msgdescription,
      req.body.createdat,
      req.body.updatedat,
      req.body.postedteam,
      req.body.datefrom,
      req.body.dateto,
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

router.post("/update_icon", multer.single("icon"), function (req, res, next) {
  //console.log("BODY:", req.body);
  //console.log("FILE:", req.file);
  pool.query(
    "update briefings set icon=? where id=? ",
    [req.file.filename, req.body.id],
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

router.post("/delete_briefings_data", function (req, res, next) {
  //console.log("BODY:", req.body);
  pool.query(
    "delete from briefings  where id=?",
    [req.body.id],
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

router.post("/delete_all_all_briefings", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from briefings where id in (?)",
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
  res.render("briefings");
});

router.post("/add", multer.any(), function (req, res, next) {
  //console.log("Request body of Breifing", req.body);
  var qry = "";
  if (req.body.icon != "") {
    qry += `insert into briefings set company_id="${req.body.company_id}", msg_title="${req.body.msg_title}", msg_description="${req.body.msg_description}", created_at="${req.body.created_at}", icon=${req.body.icon}, posted_team="${req.body.posted_team}", date_from="${req.body.date_from}", date_to="${req.body.date_to}";`;
  } else {
    qry += `insert into briefings set company_id="${req.body.company_id}", msg_title="${req.body.msg_title}", msg_description="${req.body.msg_description}", created_at="${req.body.created_at}", posted_team="${req.body.posted_team}", date_from="${req.body.date_from}", date_to="${req.body.date_to}";`;
  }
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Briefing", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        message: "Briefings added successfully",
        result,
      });
    }
  });
});

router.post("/display", function (req, res, next) {
  //console.log("req.body>>", req.body);
  var date = moment().format("YYYY/MM/DD");
  //console.log("date--->>>", date);
  const qry = `select B.*, (select C.name from company C where C.id = B.company_id) as CompanyName from briefings B where B.company_id='${req.body.company_id}' and B.date_from <= '${date}' and B.date_to >= '${date}' and posted_team like '%${req.body.team_id}%' order by id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res.status(200).json({
        status: true,
        data: result,
        message: "Briefings Data found!",
      });
    }
  });
});

router.get("/newPenalDisplay/:company_id", function (req, res, next) {
  //console.log("in new penal body");
  pool.query(
    `select B.* from briefings B order by B.id desc;select T.id, T.team_name from team T;`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        var arr = [];
        result[0].map((item) => {
          const keys = item.posted_team.split(",");
          var str = [];
          keys.map((key) => {
            result[1].map((itm) => {
              if (itm.id == key) {
                str.push(itm.team_name);
              }
            });
          });
          arr.push({ ...item, team_names: str.join() });
        });
        return res.status(200).json({
          status: true,
          result: arr,
          message: "Briefings Data found!",
        });
      }
    }
  );
});

router.post("/newPenalDisplayFilter", function (req, res, next) {
  //console.log("in new penal body filter", req.body);
    pool.query(
      `select B.* from briefings B where B.company_id="${req.body.company_id}" and date(B.created_at) between "${req.body.startDate}" and "${req.body.endDate}" order by B.id desc;select T.id, T.team_name from team T where company_id="${req.body.company_id}"`,
      function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          var arr = [];
          result[0].map((item) => {
            const keys = item.posted_team.split(",");
            var str = [];
            keys.map((key) => {
              result[1].map((itm) => {
                if (itm.id == key) {
                  str.push(itm.team_name);
                }
              });
            });
            arr.push({ ...item, team_names: str.join() });
          });
          return res.status(200).json({
            status: true,
            result: arr,
            message: "Briefings Data found!",
          });
        }
      }
    );
});

router.get("/display", function (req, res, next) {
  //console.log("in new penal body");
  pool.query(
    `select B.*, C.name from briefings B left join company C on B.company_id=C.id order by B.id desc;select T.id, T.team_name from team T;`,
    function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        var arr = [];
        result[0].map((item) => {
          const keys = item.posted_team.split(",");
          var str = [];
          keys.map((key) => {
            result[1].map((itm) => {
              if (itm.id == key) {
                str.push(itm.team_name);
              }
            });
          });
          arr.push({ ...item, team_names: str.join() });
        });
        console.log("arr", arr);
        return res.status(200).json({
          status: true,
          data: arr,
          message: "Briefings Data found!",
        });
      }
    }
  );
});

router.post("/newPenalUpdate/:id",multer.any(),function (req, res, next) {
    //console.log("req body in update brefings", req.body);
    var qry = `update briefings set ? where where id=?`;
    pool.query(
      `update briefings set company_id="${req.body.company_id}", msg_title="${req.body.msg_title}", msg_description="${req.body.msg_description}", created_at="${req.body.created_at}",  updated_at="${req.body.updated_at}", icon=${req.body.icon}, posted_team="${req.body.posted_team}", date_from="${req.body.date_from}", date_to="${req.body.date_to}" where id="${req.body.id}";`,
      function (error, result) {
        if (error) {
          //console.log("error", error);
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          return res.status(200).json({
            status: true,
            result,
            message: "Briefings Updated successfully",
          });
        }
      }
    );
  }
);

router.post("/delete/:id", function (req, res, next) {
  const qry = `delete from briefings where id='${req.params.id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Briefing delete", result);
      return res.status(200).json({
        status: true,
        result,
        message: "Briefings Delete successfully",
      });
    }
  });
});

router.post("/UploadExcel",multer.single("briefingsExcel"),
  function (req, res, next) {
    readXlsxFile("public/images/" + req.file.originalname).then((rows) => {
      rows.shift();
      var qry = "";
      if (rows.length != 0) {
        rows.map((item) => {
          var str = "'" + item.join("','") + "'";
          qry += `INSERT INTO briefings(company_id,msg_type,msg_title,msg_description,created_at,updated_at) VALUES(${str});`;
        });
        pool.query(qry, function (error, result) {
          if (error) {
            // //console.log("Error In Upload Excel File =====132", error);
            return res.status(400).json({
              status: false,
              message: "Error in Uploading file",
              error,
            });
          } else {
            // //console.log("Result in Upload Excel File ====== 106", result);
            return res.status(200).json({
              status: true,
              message: "File Upload successfully",
              result,
            });
          }
        });
      }
    });
  }
);

router.post("/delete", function (req, res, next) {
  const qry = `delete from briefings where id IN(?) and company_id='1' ;`;
  pool.query(qry, [req.body.id], function (error, result) {
    if (error) {
      // //console.log("Error in Multi Delete Briefing", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Multi Delete Briefing", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Delete...", result });
    }
  });
});

router.get(
  "/BreifingReportNewPenalDisplay/:company_id",
  function (req, res, next) {
    //console.log("in new BreifingReportNewPenalDisplay");
    pool.query(
      `select B.msg_title, B.msg_description, B.posted_team, B.date_from, B.date_to from briefings B where B.company_id="${req.params.company_id}" order by B.id desc;select T.id, T.team_name from team T where company_id="${req.params.company_id}";`,
      function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          var arr = [];
          result[0].map((item) => {
            const keys = item.posted_team.split(",");
            var str = [];
            keys.map((key) => {
              result[1].map((itm) => {
                if (itm.id == key) {
                  str.push(itm.team_name);
                }
              });
            });
            arr.push({ ...item, team_names: str.join() });
          });
          return res.status(200).json({
            status: true,
            result: arr,
            message: "Briefings Data found!",
          });
        }
      }
    );
  }
);

router.get(
  "/managerPenalDisplayBriefing/:company_id/:manager_id",
  function (req, res, next) {
    pool.query(
      `select id,team_name from team where team_head=?`,
      [req.params.manager_id],
      async function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          var arrr = [];
          //console.log(result);
          const data = result.map((item) => {
            return new Promise((resolve, reject) => {
              pool.query(
                `select B.msg_title as Title, B.msg_description as BreifingDescription, B.date_from, B.date_to, B.posted_team from briefings B where B.posted_team like '%${item.id}%' group by id order by id desc`,
                (e, r) => {
                  if (e) {
                  } else {
                    resolve(r);
                  }
                }
              );
            });
          });
          //console.log(data);
          let resy = await Promise.all(data);
          resy = resy.flat();
          const filteredId = resy.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const JSONData = filteredId.reduce((acc, item) => {
            const data = JSON.parse(item);
            const posted_team = data.posted_team.split(",");
            result.map((rItem) => {
              posted_team.map((nItem) => {
                if (rItem.id == nItem.trim()) {
                  acc.push({ ...data, team_name: rItem.team_name });
                }
              });
            });
            return acc;
          }, []);
          const JsonFiltered = JSONData.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const response = JsonFiltered.reduce((acc, item) => {
            acc.push(JSON.parse(item));
            return acc;
          }, []);
          //console.log("response", response);
          return res.status(200).json({
            status: true,
            message: "Briefings Data found!",
            response,
          });
        }
      }
    );
  }
);

router.post("/managerPenalFilterDisplayBriefing/:company_id/:manager_id",
  function (req, res, next) {
    //console.log("managerPenalFilterDisplayBriefing", req.body);
    pool.query(`select id,team_name from team where team_head=?`,[req.params.manager_id],
      async function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          var arrr = [];
          //console.log(result);
          const data = result.map((item) => {
            return new Promise((resolve, reject) => {
              pool.query(
                `select B.msg_title as Title, B.msg_description as BreifingDescription, B.date_from, B.date_to, B.posted_team from briefings B where B.posted_team like '%${item.id}%' and date(B.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by id order by id desc;`,
                (e, r) => {
                  if (e) {
                  } else {
                    resolve(r);
                  }
                }
              );
            });
          });
          //console.log(data);
          let resy = await Promise.all(data);
          resy = resy.flat();
          const filteredId = resy.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const JSONData = filteredId.reduce((acc, item) => {
            const data = JSON.parse(item);
            const posted_team = data.posted_team.split(",");
            result.map((rItem) => {
              posted_team.map((nItem) => {
                if (rItem.id == nItem.trim()) {
                  acc.push({ ...data, team_name: rItem.team_name });
                }
              });
            });
            return acc;
          }, []);
          const JsonFiltered = JSONData.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const response = JsonFiltered.reduce((acc, item) => {
            acc.push(JSON.parse(item));
            return acc;
          }, []);
          //console.log("response", response);
          return res.status(200).json({
            status: true,
            message: "Briefings Data found!",
            response,
          });
        }
      }
    );
  }
);

router.get(
  "/managerPenalBriefingModule/:company_id/:manager_id",
  function (req, res, next) {
    pool.query(`select id,team_name from team where team_head=?`,[req.params.manager_id],
      async function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          var arrr = [];
          // //console.log(result);
          const data = result.map((item) => {
            return new Promise((resolve, reject) => {
              pool.query(
                `select B.* from briefings B where B.posted_team like '%${item.id}%' group by B.id order by B.id desc;`,
                (e, r) => {
                  if (e) {
                  } else {
                    resolve(r);
                  }
                }
              );
            });
          });
          let resy = await Promise.all(data);
          resy = resy.flat();
          const filteredId = resy.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const JSONData = filteredId.reduce((acc, item) => {
            const data = JSON.parse(item);
            const posted_team = data.posted_team.split(",");
            result.map((rItem) => {
              posted_team.map((nItem) => {
                if (rItem.id == nItem.trim()) {
                  acc.push({ ...data, team_name: rItem.team_name });
                }
              });
            });
            return acc;
          }, []);
          const JsonFiltered = JSONData.reduce((acc, item) => {
            if (!acc.includes(JSON.stringify(item))) {
              acc.push(JSON.stringify(item));
            }
            return acc;
          }, []);
          const response = JsonFiltered.reduce((acc, item) => {
            acc.push(JSON.parse(item));
            return acc;
          }, []);
          return res.status(200).json({
            status: true,
            message: "Briefings Data found!",
            response,
          });
        }
      }
    );
  }
);
module.exports = router;
