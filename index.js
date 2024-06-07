const {
  learnerSubmissions,
  assignmentGroup,
  courseInfo,
} = require('./learnerData.js');

// console.log(
//   'courseInfo',
//   courseInfo,
//   '\nassignmentGroup:',
//   assignmentGroup,
//   '\nlearnerSubmissions:',
//   learnerSubmissions
// );

function checkValidCourseId(assignmentObj, course) {
  const { id, name, course_id, group_weight, assignments } = assignmentObj;

  if (course.id !== course_id) {
    throw new Error({
      message: 'Input is Invalid',
    });
  }
}

// helper function that accepts an assignment due_date and returns true if the assignment should be counted as part of a learners grade and false if it should not be counted
function isReadyToGrade(dueDate) {
  // storing the current date
  let todaysDate = new Date().toISOString().split('T')[0].split('-');
  let [curYear, curMonth, curDay] = todaysDate;

  let [yearDue, monthDue, dayDue] = dueDate.split('-');

  // check if the assignment is due to be graded because its year is greater or cases where year is equal but month or day is greater than the actual day month and year
  return parseInt(curYear) > parseInt(yearDue) ||
    (parseInt(curYear) === parseInt(yearDue) &&
      parseInt(curMonth) > parseInt(monthDue)) ||
    (parseInt(curYear) === parseInt(yearDue) &&
      parseInt(curMonth) === parseInt(monthDue) &&
      parseInt(curDay) >= parseInt(dayDue))
    ? true
    : false;
}

// helper function that accepts the submissions array and returns a list of unique learner ids
const getLearnerIds = function (submissions) {
  const learnerIds = {};
  for (let i = 0; i < submissions.length; i++) {
    if (!learnerIds[submissions[i].learner_id]) {
      learnerIds[submissions[i].learner_id] = true;
    }
  }
  return Object.keys(learnerIds);
};

// helper function that accepts a learner id and the submissions array
// and returns an array of the submissions made by a learner that should be counted as part of their grade

// const getLearnerSubmissionsToGrade = function (submissions, learnerId) {
//   const results = submissions.filter((submission) => {
//     let { assignment_id } = submission;
//     let matchingAssignment = getAssignmentById(
//       assignment_id,
//       assignmentGroup.assignments
//     );
//     if (
//       submission.learner_id === learnerId &&
//       isReadyToGrade(matchingAssignment.due_at)
//     ) {
//       return submission;
//     }
//   });

//   if (!results.length) {
//     return 'No submissions for the requested Learner';
//   } else {
//     return results;
//   }
// };
const getLearnerSubmissionsToGrade = function (submissions, learnerId) {
  console.log(
    'in getLearnerSubmissionsToGrade -> learnerId:',
    typeof learnerId
  );
  const results = [];
  submissions.forEach((submission) => {
    let { assignment_id } = submission;
    let matchingAssignment = getAssignmentById(
      assignment_id,
      assignmentGroup.assignments
    );
    if (
      submission.learner_id === learnerId &&
      isReadyToGrade(matchingAssignment.due_at)
    ) {
      results.push({
        assignment: matchingAssignment,
        submittedAssignment: submission,
      });
    }
  });

  if (!results.length) {
    return 'No submissions for the requested';
  } else {
    return results;
  }
};

// helper function that accepts the submissions array and a learnerId and returns
// the avg for the learner
const populateLearnerObjects = function (submissions, learnerId, learnerObj) {
  let totalPossiblePoints = 0;
  let totalPointsEarned = 0;

  // store the assignments submitted by learner that should be counted towards their grade
  let submittedAssignments = getLearnerSubmissionsToGrade(
    submissions,
    learnerId
  );

  learnerObj.id = learnerId;
  learnerObj.avg = 0;
  console.log('submittedAssignments:', submittedAssignments);
  // loop over the submittedAssignments
  for (let i = 0; i < submittedAssignments.length; i++) {
    // destructure the properties expected for each assignment
    let { assignment, submittedAssignment } = submittedAssignments[i];

    // tally the total possible points for each assignment
    totalPossiblePoints += assignment.points_possible;
    // tally the total points earned for each submission passed to the adjust grade for late submission

    // store the adjusted score for tardy assignment
    let adjustedScore = adjustTardySubmissionScore(
      assignment,
      submittedAssignment
    );

    totalPointsEarned += adjustedScore;

    let { assignment_id, submission } = submittedAssignment;
    let { submitted_at, score } = submission;

    // create variable to store the assignment_id to use as a key on learnerObj
    let assignmentKey = assignment_id;

    // store the submission score
    let submissionScore = adjustedScore / assignment.points_possible;

    learnerObj[assignmentKey] = submissionScore.toFixed(2);
  }

  console.log(
    'totalPointsPossible:',
    totalPossiblePoints,
    'totalEarned:',
    totalPointsEarned
  );

  learnerObj.avg = totalPointsEarned / totalPossiblePoints;
  console.log('learnerObj:', learnerObj);

  return learnerObj;
};

// helper function that accepts an id and the assignments array and returns the assignment with that id
const getAssignmentById = function (id, assignments) {
  // console.log('id passed in:', id);
  return assignments.filter((assignment) => assignment.id === id)[0];
};

// accepts assignmentObj and submissionObj and checks if the submission date was late and adjusts and returns the adjusted score
const adjustTardySubmissionScore = function (assignmentObj, submissionObj) {
  const { submission, assignment_id } = submissionObj;
  const { id, due_at } = assignmentObj;

  let daySubmitted = submission.submitted_at.split('-')[2];
  let dayDue = due_at.split('-')[2];

  // check if the ids match before proceeding
  if (id === assignment_id) {
    // check if the submission was ontime
    if (parseInt(daySubmitted) <= parseInt(dayDue)) {
      return submission.score;
      // other wise knock 10 % off of the score
    } else {
      return submission.score * 0.9;
    }
  } else {
    console.log('this Assignment does not exist');
  }
};

/*
returns array of formatted learner objects populated with graded assignments and a grade average
**/
const getLearnerData = function (course, assignmentGp, submissions) {
  let result = [];

  // create variable to store the learnerIds
  const learnerIds = getLearnerIds(submissions);

  // loop over each learner id from the above list
  for (let i = 0; i < learnerIds.length; i++) {
    result.push(
      populateLearnerObjects(submissions, parseInt(learnerIds[i]), {})
    );
  }

  console.log('result:', result);
};

getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
