var express = require('express');
var mongoose = require('mongoose');
var Student = require('../model/student');
var router = express.Router();

router.get('/student', function(req, res, next) {
    Student.find(function(err, students) {
        if (err) {
            next(err);
        } else {
            res.json({
                success: true,
                students: students
            });
        }
    });

    
});

router.get('/similar', function(req, res) {
    // 5980c7a55e359d104130ae41
    var id = req.body.id;
});

/*
router.get('/create', function(req, res) {
    var s1 = new Student();
    s1.name = 'Tarun Boddupalli';
    s1.grade = 11;
    s1.classes.push({
        id: 'E1',
        period: '1',
        teacher: 'Fedowitz, Elizabeth',
        room: '195'
    }, {
        id: 'E2',
        period: '2',
        teacher: 'Nasser, Gene',
        room: '235'
    }, {
        id: 'E3',
        period: '3',
        teacher: 'DiOrio, Jennifer',
        room: '135'
    }, {
        id: 'E4',
        period: '4/5',
        teacher: 'Morrow, Denise',
        room: '140'
    }, {
        id: 'E000',
        period: '6',
        teacher: 'Lunch',
        room: 'CAFE'
    }, {
        id: 'E6',
        period: '7/8',
        teacher: 'Hesse, LeeAnne',
        room: '215'
    }, {
        id: 'E7',
        period: '9/10',
        teacher: 'Connell, Robin',
        room: '254'
    }, {
        id: 'E8',
        period: '11',
        teacher: 'Malanga, Something',
        room: '192'
    }, {
        id: 'E9',
        period: '12',
        teacher: 'Leghorn, Brittany',
        room: '007'
    });
    s1.markModified('classes');
    s1.save();

    var s2 = new Student();
    s2.name = 'Bharddwaj Vemulapalli';
    s2.grade = 11;
    s2.classes.push({
        id: 'E11',
        period: '1',
        teacher: 'Evans, Michael',
        room: '252'
    }, {
        id: 'E13',
        period: '2',
        teacher: 'Other, Teacher',
        room: '113'
    }, {
        id: 'E14',
        period: '3',
        teacher: 'Some Other, Teacher',
        room: '130'
    }, {
        id: 'E12',
        period: '4/5',
        teacher: 'Stocker, Focker',
        room: '236'
    }, {
        id: 'E000',
        period: '6',
        teacher: 'Lunch',
        room: 'CAFE'
    }, {
        id: 'E6',
        period: '7/8',
        teacher: 'Hesse, LeeAnne',
        room: '215'
    }, {
        id: 'E7',
        period: '9/10',
        teacher: 'Connell, Robin',
        room: '254'
    }, {
        id: 'E8',
        period: '11',
        teacher: 'Malanga, Something',
        room: '192'
    }, {
        id: 'E10',
        period: '12',
        teacher: 'Frey, Diane',
        room: '227'
    });
    s2.markModified('classes');
    s2.save();

    res.json({
        success: true
    });
});
*/

router.use(function(req, res) {
    res.json({
        success: false
    });
});

module.exports = router;
