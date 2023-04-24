var express = require('express');
var router = express.Router();
var pool = require('./pool')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('tracker');
});

router.post('/add', function (req, res, next) {
    pool.query("insert into tracker set ?", req.body, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, message: "Tracker added successfully", data: req.body });
        }
    });
});

router.get("/display", function (req, res, next) {
    pool.query("select * from tracker", function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, data: result, message: "Tracker Data found!" });
        }
    }
    );
});

router.get("/display/:id", function (req, res, next) {
    pool.query("select * from tracker where id=?", [req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, data: result, message: "Tracker Data found!" });
        }
    }
    );
});

router.put("/update/:id", function (req, res, next) {
    pool.query("update tracker set ? where id=?", [req.body, req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        } else {
            res.status(200).json({ status: true, data: result, message: "Tracker Updated successfully", data: req.body });
        }
    }
    );
});

router.delete("/delete/:id", function (req, res, next) {
    pool.query("delete from tracker where id=?", [req.params.id], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, message: "Tracker deleted successfully" });
        }
    }
    );
});

module.exports = router;