(function () {
  // get variables/link to html

  const currentQuestion = document.querySelector(".quizQuestion");
  const submitButton = document.getElementById("submitButton");
  const startButton = document.getElementById("startButton");
  const quizForm = document.getElementById("quiz-form");
  const radioButtons = document.querySelectorAll("[type=radio]");
  const quizAnswerChoices = document.querySelectorAll(".quiz-answer");
  const hide = ["style", "display: none;"];
  const show = ["style", "display: block;"];
  const visible = ["style", "visibility: visible;"];
  const hidden = ["style", "visibility: hidden;"];
  const timeLeft = document.getElementById("timeLeft");
  let modeSwitcher = document.getElementById("themeButton");
  const scoreLink = document.getElementById("scoresLink");
  const scoreBox = document.getElementById("scores");
  let scores = localStorage.getItem("scores")
    ? JSON.parse(localStorage.getItem("scores"))
    : [];
  const scoreCard = document.getElementById("scoreCard");
  const themeLink = document.getElementById("themeLink");
  const closeButton = document.getElementById("closeButton");
  const backdrop = document.getElementById("backdrop");
  let userInitial;
  let currentQuestionIndex = 0;
  let quizScore = 0;
  let visibility;
  let timeInterval;
  let theme;
  let initialTime;
  const questions = [
    {
      question:
        "When using a for loop, how do we identify which item we want to start with?",
      choices: ["i = 0", "i = 1", "i < array.length", "i++"],
      answerIndex: 0,
    },

    {
      question: "What is the proper way to call a function?",
      choices: ["function{}", "function()", "function[]", "function''"],
      answerIndex: 1,
    },
    {
      question: "How do we check how many items are in an array?",
      choices: ["array.items", "array.long", "array.holding", "array.length"],
      answerIndex: 3,
    },
    {
      question: "Which of the the following is NOT a data type",
      choices: ["number", "boolean", "item", "string"],
      answerIndex: 2,
    },
    {
      question: "If no return is set, a function always returns ",
      choices: ["Number", "String", "Array", "Undefined"],
      answerIndex: 3,
    },
    {
      question: "Which of the following means to set equal to?",
      choices: ["=", "==", "===", "===="],
      answerIndex: 0,
    },
    {
      question:
        "Which of the folliwing means to check if value is equal, regardless of data type?",
      choices: ["=", "==", "===", "===="],
      answerIndex: 1,
    },
    {
      question:
        "Which of the following checks for equivalence of data value and type?",
      choices: ["=", "==", "===", "===="],
      answerIndex: 2,
    },
    {
      question: "What kind of data type is 'null'?",
      choices: ["object", "array", "string", "undefined"],
      answerIndex: 0,
    },
    {
      question:
        "What method would allow a developer to turn a string into an array?",
      choices: ["string .join", "string.array", "array.string", "string.split"],
      answerIndex: 3,
    },
  ];

  // on click changes between css sheets for light/dark mode
  modeSwitcher.addEventListener("click", switchMode);

  function switchMode(event) {
    event.preventDefault();
    theme = !theme;
    if (theme) {
      themeLink.setAttribute("href", "./assets/CSS/Light-styles.css");
    } else {
      themeLink.setAttribute("href", "./assets/CSS/Dark-style.css");
    }
  }

  // on click, begins the quiz, hides the start button, makes form visible, starts timer
  startButton.addEventListener("click", function () {
    renderQuestion(currentQuestionIndex);
    startButton.setAttribute(...hide);
    quizForm.setAttribute(...visible);
    setTimer();
  });

  //   display question on screen
  function renderQuestion(questionIndex) {
    // set question
    currentQuestion.textContent = questions[questionIndex].question;

    // loop for each radio label, set value to choices index based on current label index
    quizAnswerChoices.forEach((radioLabel, index) => {
      radioLabel.textContent = questions[questionIndex].choices[index];
    });
  }

  //sets and runs timer
  function setTimer() {
    initialTime = 120;
    timeInterval = setInterval(function () {
      //if timer is over, hide the timer, hide the quiz, run the scoring function
      if (initialTime < 0) {
        clearInterval(timeInterval);
        timeLeft.setAttribute(...hide);
        quizForm.setAttribute(...hidden);
        initialTime = 0;
        scoring();
      }

      timeLeft.textContent = initialTime + " seconds left!";
      initialTime--;
    }, 1000);
  }

  function isAnswerSelected() {
    return [...radioButtons].some((radio) => radio.checked);
  }

  //when submitting answer, check answer, go to next question
  quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!isAnswerSelected()) return;

    const data = new FormData(quizForm);

    //checks if user is correct, if so then increases score by 1
    for (let [, value] of data) {
      if (questions[currentQuestionIndex].answerIndex === Number(value)) {
        quizScore++;
      } else {
        initialTime -= 20;
        timeLeft.setAttribute("style", "color:red;");
        setTimeout(() => {
          timeLeft.setAttribute("style", "color: var(--tertiaryColor;)");
        }, 3000);
      }
    }

    currentQuestionIndex++;

    // runs radiobutton function
    resetRadioButtons();

    //if there are more questions, continue to next quetions
    if (currentQuestionIndex <= questions.length - 1) {
      renderQuestion(currentQuestionIndex);

      //if no more questions, runs quizdone and scoring functions
    } else {
      quizDone();
      scoring();
    }
  });

  //resets answer buttons so nothing is pre-selected from previous question
  function resetRadioButtons() {
    radioButtons.forEach((radioButton) => (radioButton.checked = false));
  }

  function quizDone() {
    clearInterval(timeInterval);
    timeLeft.setAttribute(...hide);

    submitButton.setAttribute(...hide);

    radioButtons.forEach((radioButton) => radioButton.setAttribute(...hide));

    quizAnswerChoices.forEach((radioLabel) => radioLabel.setAttribute(...hide));
  }

  //displays score
  function scoring() {
    currentQuestion.textContent = "You got " + quizScore + " correct!";

    //asks user for their name

    do {
      userInitial = prompt(
        "What are your Initials?",
        "Please type in your Initials."
      );
    } while (
      /^[a-zA-Z]+$/.test(userInitial) === false ||
      userInitial.length >= 4 ||
      userInitial.length <= 0
    );

    // sends user name and score to local storgage
    scores.push({ userInitial, quizScore });
    localStorage.setItem("scores", JSON.stringify(scores));
    scores = JSON.parse(localStorage.getItem("scores"));
    loadScores();
  }

  //  on click runs showScores function
  scoreLink.addEventListener("click", showScores);
  closeButton.addEventListener("click", showScores);

  // shows scores
  function showScores(event) {
    event.preventDefault();
    visibility = !visibility;

    // if scores are not shown, then show them

    if (visibility) {
      scoreCard.setAttribute(...show);
      backdrop.setAttribute(...show);
      closeButton.setAttribute(...show);
      scoreLink.setAttribute(...hide);

      // if scores are shown, hide them again
    } else {
      scoreCard.setAttribute(...hide);
      backdrop.setAttribute(...hide);
      closeButton.setAttribute(...hide);
      scoreLink.setAttribute(...show);
    }
  }
  //lods previous scores on intitialization
  loadScores();

  // reloads scores when function is called
  function loadScores() {
    scoreBox.innerHTML = " ";

    scores.forEach((score) => {
      let scoreDiv = document.createElement("div");
      let scoreNameDiv = document.createElement("div");
      let scoreValueDiv = document.createElement("div");
      let scoreName = document.createElement("h4");
      let scoreVlaue = document.createElement("h4");
      scoreValueDiv.appendChild(scoreVlaue);
      scoreValueDiv.classList.add("valueDiv");
      scoreNameDiv.classList.add("nameDiv");
      scoreDiv.classList.add("scoreItem");
      scoreDiv.appendChild(scoreNameDiv);
      scoreDiv.appendChild(scoreValueDiv);
      scoreName.textContent = score.userInitial;
      scoreVlaue.textContent = score.quizScore;
      scoreNameDiv.appendChild(scoreName);
      scoreBox.appendChild(scoreDiv);
    });
  }
})();
