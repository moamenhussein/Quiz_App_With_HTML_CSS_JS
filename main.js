let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let quetionsObject = JSON.parse(this.responseText);
      let questionsQount = quetionsObject.length;
      createBullets(questionsQount);
      //Add Questions Data;
      addQuestionData(quetionsObject[currentIndex], questionsQount);
      //Start Countdown Timer
      countDown(5, questionsQount);
      //Click On Submit
      submitButton.onclick = () => {
        //Get Aight Answer
        let theRightAnswer = quetionsObject[currentIndex].right_answer;
        //Check The Answer
        checkAnswer(theRightAnswer, questionsQount);
        //Increase Index
        currentIndex++;
        //Remove Pervious Questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(quetionsObject[currentIndex], questionsQount);
        //Handel Bullets Class
        hundleBullet();
        //CountDown
        clearInterval(countDownInterval);
        countDown(5, questionsQount);
        //Show Results
        showResults(questionsQount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  //Create Spans
  for (let i = 0; i < num; i++) {
    //Create Bullet
    let theBullets = document.createElement("span");
    //Check It Is First Span
    if (i === 0) {
      theBullets.classList.add("on");
    }
    //Append Bullets To Main Bullet Container
    bulletsSpansContainer.appendChild(theBullets);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //Create H2 Question Title
    let questionTitle = document.createElement("h2");
    //Create Question Text
    let questionText = document.createTextNode(obj.title);
    //Append Text To Heading
    questionTitle.appendChild(questionText);
    //Append H2 To The Quiz Area
    quizArea.appendChild(questionTitle);
    //Create The Answers
    for (let i = 1; i <= 4; i++) {
      //Create Main Answer Div
      let mainDiv = document.createElement("div");
      //Add Class To Main Div
      mainDiv.className = "answer";
      //Create Radio Input
      let radioInput = document.createElement("input");
      //Add Type + Name + Id + Data-Attribute
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      //Make First Options Select
      if (i === 1) {
        radioInput.checked = true;
      }
      //Create Label
      let theLabel = document.createElement("label");
      //Add For Attribute
      theLabel.htmlFor = `answer_${i}`;
      //Crerate Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      //Add The Text To Label
      theLabel.appendChild(theLabelText);
      //Add Input + label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      //Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(aAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (aAnswer === choosenAnswer) {
    rightAnswers++;
  }
}

function hundleBullet() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpan = Array.from(bulletsSpans);
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good The Mark Is</span>,${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect The Mark Is</span>,${rightAnswers} From ${count}`;
    } else {
      theResults = `<span class="bad">Bad The Mark Is</span>,${rightAnswers} From ${count}`;
    }
    resultContainer.innerHTML = theResults;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "#fff";
    resultContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
