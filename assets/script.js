let navBar = document.querySelector('nav');
let highscoreLink = document.getElementById('highscores-link');
let container = document.getElementById('container');
let timerDisplay = document.getElementById('timer');
let startButton = document.getElementById('start-button');
let title = document.getElementById('title');
let text = document.getElementById ('text');
let quizAnswers = document.getElementById('quiz-answers');
let answerButton = document.getElementsByClassName('answer-button');
let answerMessage = document.getElementById('answer-message');
let inputFields = document.getElementById('input-field');
let initials = document.getElementById('initials');
let submitButton = document.getElementById('submit-button');

//variables
let timerSecs = 0;
let currentQuestion = 0;
let score = 0;
let scoreArray = [];
let timerInterval = false;

//javascript questions
let questions = [ 
  {
title: "What is the HTML tag under which one can write the JavaScript code?",
choices: ["<javascript>","<scripted>","<script>","<js>"],
answer:"<script>"
},

{
title:"Which of the following is the correct syntax to display “GeeksforGeeks” in an alert box using JavaScript?",
choices:["alertbox(“GeeksforGeeks”);","msg(“GeeksforGeeks”);","msgbox(“GeeksforGeeks”);","alert(“GeeksforGeeks”);"],
answer:"alert(“GeeksforGeeks”);"
  },
{
title: "What is the correct syntax for referring to an external script called “geek.js”?",
choices:["<script src=”geek.js”>","<script href=”geek.js”>","<script ref=”geek.js”>","<script name=”geek.js”>"],
answer:"<script src=”geek.js”>"
},

{
title: "Which of the following is not a reserved word in JavaScript?",
choices:["interface","throws","program","short"],
answer:"program"
  },
      
{
title: " What is the syntax for creating a function in JavaScript named as Geekfunc?",
choices:["function = Geekfunc() ","function Geekfunc(); ","function := Geekfunc() ","function : Geekfunc()q"],
answer:"function Geekfunc() "
      },
{
title: "How to write an ‘if’ statement for executing some code. ",
choices:[" if(i<>5) ", " if i<>5 ", " if(i!=5) ", "D) if i!=5"], 
answer: "if(i!=5) "
}
]

//starts quiz
function startQuiz() {
  timerSecs = 50;
  timerDisplay.textContent = timerSecs;

//starts timer countdown
countdown();

//starts  question page
nextQuestion();

startButton.style.display = 'none';
}


// changes to next question
function nextQuestion() {
  //changes the appearance of the page
  container.className = 'results-page mt-5';
  title.textContent = 'Question ' + (currentQuestion + 1);
  title.setAttribute('class', 'h2')
  text.textContent = questions[currentQuestion].title;
  text.className = 'h4';
  text.setAttribute('style', 'border-top: 1xp double #00093; padding-top: 20px;')

  //displays the answer button
  quizAnswers.style.display = 'block';

  //takes answers form questions.js, and assigns them one by one to answerButton.
  answerButton[0].textContent = questions[currentQuestion].choices[0];
  answerButton[1].textContent = questions[currentQuestion].choices[1];
  answerButton[2].textContent = questions[currentQuestion].choices[2];
  answerButton[3].textContent = questions[currentQuestion].choices[3];

  for (i = 0; i < answerButton.length; i++) {
    answerButton[i].addEventListener('click', checkAnswer);
  }
}

//checks if answer matches input
function checkAnswer(event) {
  //checks if button/answer values are the same
  console.log('User chose : ' + event.target.textContent);
  console.log('Correct answer:' + questions[currentQuestion].answer);

  //checks if selected question is correct and increases the score
  if (event.target.textContent === questions[currentQuestion].answer) {
    answerMessage.style.display = 'block';
    answerMessage.textContent = 'Correct!';
    answerMessage.className = 'answer-message';
    currentQuestion++;
    score++;

    //function to make message disappear after a set time
    setTimeout(function () {
      answerMessage.style.display = 'none';
    }, 800);

    //funtion to make game end after 5 questions
    if (currentQuestion === questions.length) {
      endGame();

      //function if it hasn't reached 5 go to next question
    } else {
      nextQuestion();
    }

    //function if answered incorrect decrease time and move on to next question
  } else {
    currentQuestion ++;
    answerMessage.style.display = 'block';
    answerMessage.textContent = 'incorrect!';
    answerMessage.className = 'answer-message';

    //disappears after set time
    setTimeout(function () {
      answerMessage.style.display = 'none';
    }, 800);

    //ends game if timer is less then 5 seconds.
    if (timerSecs < 10) {
      timerSecs -= 10;
      endGame();
      // ends the game if on last question.
    } else if (currentQuestion === 5) {
      endGame();
      //subtracts remaining time and moves on to the next question
    } else {
      timerSecs -= 10;
      nextQuestion();
    };
  }
};

//opens end game page 
function endGame() {
  //changes page 
  quizAnswers.style.display = 'none';
  container.className = 'quiz-page mt-5';
  title.setAttribute('class', 'h2');
  text.setAttribute('style', 'border-top: 0');
  text.removeAttribute('class');
  text.textContent = 'Final score is  ' + score + '. Enter initials to see high score table!';
  inputFields.style.display = 'block';

//changes display page if u ran out of time or not 
  if (timerSecs <= 0) {
    title.textContent = 'out of time';
  } else {
    title.textContent = 'finished';
  }

  //when button is clicked saves initials 
  //brought to high score list page 
  submitButton.addEventListener('click', storeHighScore);
}

//stores initials and puts it in local storage
//then takes user to high score page 
function storeHighScore(event) {
  event.preventDefault();

  if (initials.value.length === 0) {
    return;
    //initial/score combo pushed to score array 
  } else {
    newScore = {
      userName: initials.value.trim(),
      userScore: score 
    };
    scoreArray.push(newScore);
    //sorts scores so that highest score is always 1st 
    scoreArray.sort((a, b) => b.userScore - a.userScore);

    //array made into string and pushed to local storage 
    localStorage.setItem('score', JSON.stringify(scoreArray));
 //user is taken to high score page 
    seeHighScores();
  }
}

//loads scores from local storage into scores array 
function loadHighScore() {

 storedScores = JSON.parse(localStorage.getItem('score'));

 // saves into array if score isn't empty(no previous tries)
 if (storedScores !== null) {
     scoreArray = storedScores;

     // return the new scoreArray value
     return scoreArray;
 }
}

function seeHighScores() { 
 if(timerInterval) { 
 clearInterval(timerInterval);

 };

// creates a new list and button elements and apends them to container 
  container.className = 'score-page mt-5 card bg-light p-4';
  let ul = document.createElement('ul');
  let returnButton = document.createElement('button');
  let clearButton = document.createElement('button');
  returnButton.textContent = 'Back';
  clearButton.textContent = 'Delete high Score';
  container.appendChild(ul);
  container.appendChild(returnButton);
  container.appendChild(clearButton);
//removes navbar 
  startButton.style.display = 'none';
  navBar.style.visibility = 'hidden';
  title.textContent = 'High Scores';
  text.textContent = '';
  text.setAttribute('style', 'border-top: 0');
  quizAnswers.style.display = 'none';
  inputFields.style.display = 'none';

//outputs new li for each highscore 
  for (i = 0; i < scoreArray.length; i++) {
    let score = scoreArray[i].userName + ' : ' + scoreArray[i].userScore;

    li = document.createElement('li');
    li.textContent = score;
    ul.appendChild(li);
  }

  returnButton.addEventListener('click', function () {
    location = "index.html";
  });

  clearButton.addEventListener('click', function () {
    localStorage.clear();
    ul.innerHTML = '';
  });
}

//countdown timer(starts from starting timersecs)
function countdown() {
  timerInterval = setInterval(function () {
    timerSecs --;
    timerDisplay.textContent = timerSecs;
//alert that user has ran out of time if no time is on the timer
    if (timerSecs < 1) {
      timerDisplay.textContent = 0;
      endGame();
      clearInterval(timerInterval);
    }
//cleears timer if questions hit 5(max game is over )
    if (currentQuestion === 5) {
      timerDisplay.textContent = timerSecs;
      clearInterval(timerInterval);
    }
  }, 1000);
}

//prevents outline showing unless keyboard user 
function handleFirstTab(e) { 

if (e.keyCode  === 9) { 

document.body.classList.add('user-is-tabbing'); 
window.removeEventListener.apply('keydown', handleFirstTab); 

}

}

//checks if user uses keyboard 
window.addEventListener('keydown', handleFirstTab); 

loadHighScore(); 

// even listener when you click the start button 
startButton.addEventListener('click', startQuiz); 

//even listener for when you click highscore link in navbar
highscoreLink.addEventListener('click', seeHighScores);