import { getQuestions, nextQuestion, getRightAnswer } from "./main.js";

let bulletsParent = document.querySelector(".questions-count ul");
let qustionsCount = document.querySelector(".category p span");
let submitButton = document.querySelector(".answers .submit button");
let categoryParagraph = document.querySelector(".category p:nth-child(1)");
let answers = Array.from(document.getElementsByName("answer"));
let scoreDiv = document.querySelector(".grade p span");
let timeDiv = document.querySelector(".time p #min-sec");
let rightAnswerContainer = document.querySelector(".answers .answer");

let i = 0;
let rightAnswers = 0;
let countDownInterval;

let jsRequest = new XMLHttpRequest();

jsRequest.open("GET", "../json/js_questions.json", true);

jsRequest.send();

//i- attach event listener to the request on changing the ready state.
jsRequest.onreadystatechange = () => {
  //ii- check if its equal to 4 && status equals 200.
  if (jsRequest.readyState == 4 && jsRequest.status == 200) {
    categoryParagraph.innerHTML = "JS category";
    //iii- get the response from responseText property & convert it into js object.
    let result = JSON.parse(jsRequest.responseText);
    //create bullets corresponding to questions count
    bulletsParent.innerHTML = "";
    result.map((item) => {
      bulletsParent.append(document.createElement("li"));
    });
    //get the count of questions from json file.
    qustionsCount.innerHTML = result.length;
    getQuestions(result, 0);
    bulletsParent.children[0].classList.add("active");

    countDownIntervalFunction(120, result);

    //on clicking submit button
    submitButton.onclick = () => {
      clearInterval(countDownInterval);
      countDownIntervalFunction(120, result);
      nextQuestion(result);
      i++;
    };
  }
};
//count down function to show the next question after time is up.
function countDownIntervalFunction(duration, array) {
  let minutes, seconds;
  if (i < array.length) {
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timeDiv.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 5) {
        rightAnswerContainer.style.display = "block";
      }
      if (--duration < 0) {
        clearInterval(countDownInterval);
        rightAnswerContainer.style.display = "none";
        submitButton.click();
      }
    }, 1000);
  }
  getRightAnswer(array, i);
}
