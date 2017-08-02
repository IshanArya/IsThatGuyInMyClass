var students = [];

var maths = [
    {
        name: "AP Calculus AB",
        room: "135"
    },
    {
        name: "AP Calculus BC",
        room: "136"
    },
    {
        name: "AP Statistics",
        room: "137"
    }
];
var sciences = [
    {
        name: "AP Physics 1",
        room: "140"
    },
    {
        name: "AP Physics 2",
        room: "141"
    },
    {
        name: "AP Chemistry",
        room: "142"
    }
];
var elas = [
    {
        name: "AP Lang Comp",
        room: "150"
    },
    {
        name: "AP Lit",
        room: "151"
    },
    {
        name: "Honors English 11",
        room: "152"
    }
];
var histories = [
    {
        name: "AP World History",
        room: "160"
    },
    {
        name: "AP US History",
        room: "161"
    },
    {
        name: "AP US Government",
        room: "162"
    }
];
var languages = [
    {
        name: "AP Spanish Language",
        room: "170"
    },
    {
        name: "AP French Language",
        room: "171"
    },
    {
        name: "AP Chinese Language and Culture",
        room: "172"
    }
];
var electives = [
    {
        name: "AP Music Theory",
        room: "180"
    },
    {
        name: "AP Computer Science",
        room: "181"
    },
    {
        name: "Honors Robotics",
        room: "182"
    }
];

var PEs = [
    {
        name: "Physical Education",
        room: "SGYM"
    },
    {
        name: "Physical Education",
        room: "BGYM"
    },
    {
        name: "Health",
        room: "190"
    }
];

for (var i = 0; i < 20; i++) {
    var s = {
        name: "Student " + (i + 1),
        classes: new Array(8)
    };
    var lunch = Math.floor(Math.random() * 4) + 3;
    s.classes[lunch] = {
        name: "Lunch",
        room: "CAFE"
    };
    var selectedClasses = [
        maths[Math.floor(Math.random() * 3)],
        sciences[Math.floor(Math.random() * 3)],
        elas[Math.floor(Math.random() * 3)],
        histories[Math.floor(Math.random() * 3)],
        languages[Math.floor(Math.random() * 3)],
        electives[Math.floor(Math.random() * 3)],
        PEs[Math.floor(Math.random() * 3)]
    ];
    for (var j = 0; j < 8; j++) {
        if (j == lunch) {
            continue;
        }
        s.classes[j] = selectedClasses.pop(Math.floor(Math.random() * selectedClasses.length));
    }
    students.push(s);
}

var student = students.pop(0);
for (var i = 0; i < student.classes.length; i++) {
    var matchedStudents = [];
    for (var j = 0; j < students.length; j++) {
        if (students[j].classes[i].room === student.classes[i].room) {
            matchedStudents.push(students[j]);
        }
    }
    var matchedStudentNames = matchedStudents.map((s) => s.name).join(', ');
    console.log("Period " + (i + 1) + ", I have " + student.classes[i].name + " with " + (matchedStudentNames.length == 0 ? "no one" : matchedStudentNames) + " in room " + student.classes[i].room + "\n");
}
