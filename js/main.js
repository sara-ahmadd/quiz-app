let bulletsParent = document.querySelector(".questions-count ul");
let qustionsCount = document.querySelector(".category p span");
let questionContainer = document.querySelector(".question");
let questionPlace = document.querySelector(".question p");
let answerOne = document.querySelector(".answers #one label");
let answerTwo = document.querySelector(".answers #two label");
let answerThree = document.querySelector(".answers #three label");
let answerFour = document.querySelector(".answers #four label");
let categoryParagraph = document.querySelector(".category p:nth-child(1)");
let submitButton = document.querySelector(".answers .submit button");
let answers = Array.from(document.getElementsByName("answer"));
let gradeDiv = document.querySelector(".grade");
let scoreDiv = document.querySelector(".grade p span");
let total = document.querySelector(".grade p #total");
let grade = document.querySelector(".grade p:nth-child(1)");
let timeParentDiv = document.querySelector(".time");
let timeDiv = document.querySelector(".time p #min-sec");

let i = 0;
let rightAnswers = 0;
let countDownInterval;
let answersArray = [];
//show title of the category of the current quiz in the html page.
categoryParagraph.innerHTML = "HTML category";

//grab data from the json file
//1- create request object.
let newRequest = new XMLHttpRequest();
//2- make the request.
newRequest.open("GET", "../json/html_qustions.json", true);
//3- send the request.
newRequest.send();

//4- get the response.

//i- attach event listener to the request on changing the ready state.
newRequest.onreadystatechange = () => {
  //ii- check if its equal to 4 && status equals 200.
  if (newRequest.readyState == 4 && newRequest.status == 200) {
    //iii- get the response from responseText property & convert it into js object.
    let result = JSON.parse(newRequest.responseText);
    //create bullets corresponding to questions count
    result.map((item) => {
      bulletsParent.append(document.createElement("li"));
    });
    //get the count of questions from json file.
    qustionsCount.innerHTML = result.length;
    getQuestions(result, 0);
    bulletsParent.children[0].classList.add("active");
    //on clicking submit button
    countDown(120, result);
    submitButton.onclick = () => {
      clearInterval(countDownInterval);
      countDown(120, result);
      nextQuestion(result);
    };
  }
};

// get the data from the response that is received to show them in the html page.
function getQuestions(array, i) {
  let { question, ans_1, ans_2, ans_3, ans_4 } = array[i];
  questionPlace.textContent = question;

  answerOne.textContent = `a) ${ans_1}`;
  addDataAttribute(answerOne.previousElementSibling, `${ans_1}`);

  answerTwo.textContent = `b) ${ans_2}`;
  addDataAttribute(answerTwo.previousElementSibling, `${ans_2}`);

  answerThree.textContent = `c) ${ans_3}`;
  addDataAttribute(answerThree.previousElementSibling, `${ans_3}`);

  answerFour.textContent = `d) ${ans_4}`;
  addDataAttribute(answerFour.previousElementSibling, `${ans_4}`);
}
//function to add Data Attribute To Radio Elements
let addDataAttribute = (element, value) => {
  if (element !== null && element !== undefined) {
    element.setAttribute("data-answer", value);
  }
};
//get the next question
function nextQuestion(array) {
  i++;
  if (i >= array.length) {
    i = array.length - 1;
    showResults(array);
  }
  getQuestions(array, i);
  colorThecorrespondingBullet(i);
}

//give active class to the bullet that corresponds the current question.
function colorThecorrespondingBullet(i) {
  let bullets = Array.from(document.querySelectorAll(".questions-count ul li"));
  bullets.forEach((bullet, index) => {
    if (i === index) {
      bullet.classList.add("active");
    } else {
      bullet.classList.remove("active");
    }
  });
}

function getRightAnswer(array, i) {
  if (i < array.length) {
    let { right_ans } = array[i];
    answersArray.push(right_ans);
    let choice;
    //check if the choice quals to the right answer.
    function checkAnswer() {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
          choice = answers[i].dataset.answer;
          choice === right_ans ? rightAnswers++ : null;
          scoreDiv.innerHTML = `${rightAnswers}`;
        }
      }
    }
    total.innerHTML = array.length;
    checkAnswer();
  }
}

//display grade and score in the html page.
function showResults(array) {
  gradeDiv.style.display = "block";
  questionContainer.remove();
  bulletsParent.remove();
  timeParentDiv.remove();
  clearInterval(countDownInterval);
  if (rightAnswers === array.length) {
    grade.innerHTML = "Perfect!👍";
  } else if (rightAnswers >= array.length / 2 && rightAnswers < array.length) {
    grade.innerHTML = "Good Job🙂";
  } else {
    grade.innerHTML = "Bad, Try Again🙁";
  }
}

//count down function to show the next question after time is up.
function countDown(duration, array) {
  let minutes, seconds;
  if (i < array.length) {
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timeDiv.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
  getRightAnswer(array, i);
}

export { getQuestions, nextQuestion, getRightAnswer };
