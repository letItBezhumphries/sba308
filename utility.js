const {
  learnerSubmissions,
  assignmentGroup,
  courseInfo,
} = require('./learnerData.js');
const { faker } = require('@faker-js/faker');

class Course {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class AssignmentGroup {
  constructor(id, name, course_id, group_weight, assignments) {
    this.id = id;
    this.name = name;
    this.course_id = course_id;
    this.group_weight = group_weight;
    this.assignments = assignments;
  }
}

class Assignment {
  constructor(id, name, due_at, points_possible) {
    this.id = id;
    this.name = name;
    this.due_at = due_at;
    this.points_possible = points_possible;
  }
}

class Learner {
  constructor(id, name, assignments, grades, courses, submissions) {
    this.id = id;
    this.name = name;
    this.assignments = assignments;
    this.courses = courses;
    this.grades = grades;
    this.submissions = submissions;
  }
}

class Submission {
  constructor(learner_id, assignment_id, submission) {
    this.learner_id = learner_id;
    this.assignment_id = assignment_id;
    this.submission = submission;
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const createMockAssigments = function (assignments) {
  let mockAssignmentTotal = getRandomNum(5, 10);
  // let results = [];

  let assignmentNames = [
    'Closures',
    'Keyword this',
    'DOM',
    'Pass By Reference',
    'Async/Await',
    'Fetch',
    'ES6',
    'Prototypal Inheritance',
    'Objects and Inheritance',
    'Statements & Expressions',
    'Literals',
    'Template Strings',
  ];

  // to avoid using the same id from ids already created
  let lastAssignmentIdIssued =
    assignmentGroup.assignments[assignmentGroup.assignments.length - 1].id + 1;

  while (mockAssignmentTotal > 0) {
    //name, due_at, points_possible
    let assignmentName = assignmentNames.splice(
      getRandomNum(0, assignmentNames.length - 1),
      1
    );

    let assignmentDate = `2023-${getRandomNum(1, 12)}-${getRandomNum(1, 29)}`;

    let newAssignment = new Assignment(
      lastAssignmentIdIssued,
      assignmentName,
      assignmentDate,
      getRandomNum(50, 250)
    );

    assignments.push(newAssignment);
    lastAssignmentIdIssued++;
    mockAssignmentTotal--;
  }

  console.log('assignments results:', assignments);
  return assignments;
};

// console.log(createMockAssigments(assignmentGroup.assignments));

// function to create some mock testing Courses
// id, name
const createMockCourses = function () {
  let courseTotal = 3;
  const courses = [];
  const courseNames = ['Intro to HTML', 'Intro to CSS', 'Intro to SCSS'];
  let newCourse;
  let currentNameIdx = 0;

  while (courseTotal > 0) {
    let newCourseId = courseInfo.id + 1;

    newCourse = new Course(newCourseId, courseNames[currentNameIdx]);

    courses.push(newCourse);
    currentNameIdx++;
    courseTotal--;
  }

  courses.unshift(courseInfo);

  return courses;
};

let courses = createMockCourses();
