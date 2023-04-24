var express = require('express');
var router = express.Router();
var pool = require('./pool')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('usersroles');
});

router.post('/add', function (req, res, next) {
    pool.query("insert into usersroles set ?", req.body, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, message: "UserRoles added successfully", data: req.body });
        }
    });
});

router.get("/display", function (req, res, next) {
    pool.query("select * from usersroles", function (error, result) {
        if (error) {
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    }
    );
});

router.get("/display/:id", function (req, res, next) {
    pool.query("select * from usersroles where user_id=?", [req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, data: result, message: "UserRoles Data found!" });
        }
    }
    );
});

router.put("/update/:id", function (req, res, next) {
    pool.query("update usersroles set ? where user_id=?", [req.body, req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
          } else {
            res.status(200).json({ status: true, data: result, message: "UserRoles Updated successfully", data: req.body });
          }
    }
    );
});

router.delete("/delete/:id", function (req, res, next) {
    pool.query("delete from usersroles where user_id=?", [req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
          }
          else {
            res.status(200).json({ status: true, message: "UserRoles deleted successfully" });
          }
    }
    );
});

module.exports = router;