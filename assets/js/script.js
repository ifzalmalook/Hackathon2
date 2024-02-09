

let apiUrl = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
let questions;
let currentQuestionIndex = 0;
let currentQuestionCounter = 0;
let score = 0;
let maxQuestions = 10;
let acceptingAnswers = true;

const replayButton = document.getElementById('replay-button');
const allAnswersContainer = document.getElementById("all-answers");
const questionElement = document.getElementById("question-container");
const progressText = document.getElementById('progressText');
const gameFooterProgress = document.getElementById('game-footer-progress');
const progressBar = document.getElementById('progressBar');
const progressBarFull = document.getElementById('progressBarFull');

//Allows iterating through the answer div boxes
const answerDivs = Array.from(document.getElementsByClassName("answer-text"));

const nextButton = document.getElementById("next-btn");
const scoreTracker = document.getElementById("score");

//gets data from API

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        questions = data.results;
        startQuiz();


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

function startQuiz() {

    currentQuestionIndex = 0;
    currentQuestionCounter = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    changeAcceptingAnswers(true);
    let currentQuestion = questions[currentQuestionIndex];

    questionElement.innerHTML = `<h2 class="d-flex justify-content-center">${currentQuestion.question}</h2>`;

    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

    shuffleArray(allAnswers);

    allAnswers.forEach((answer, index) => {
        const answerDiv = answerDivs[index];
        answerDiv.innerHTML = `${answer}`;
        answerDiv.dataset.correct = answer === currentQuestion.correct_answer;
        answerDiv.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    answerDivs.forEach(answerDiv => {
        answerDiv.classList.remove("correct", "incorrect");
        answerDiv.disabled = false;
    });
    nextButton.style.display = "none";
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


answerDivs.forEach(answerDiv => answerDiv.addEventListener("click", selectAnswer));


function selectAnswer(e) {
    if (!acceptingAnswers) {
        return;
    } else {
        const selectedDiv = e.target;
        const isCorrect = selectedDiv.dataset.correct === "true";



        if (isCorrect) {
            selectedDiv.classList.add("correct");
            score++;
            scoreTracker.textContent = score;
        } else {
            selectedDiv.classList.add("incorrect");
        }

        answerDivs.forEach(answerDiv => {
            if (answerDiv.dataset.correct === "true") {
                answerDiv.classList.add("correct");
            } else {
                answerDiv.classList.add("incorrect");
            }
            answerDiv.disabled = true;
        });

        if (currentQuestionCounter < maxQuestions) {
            currentQuestionCounter++;
            progressText.innerText = `Question ${currentQuestionCounter} / ${maxQuestions}`;
            progressBarFull.style.width = `${(currentQuestionCounter / maxQuestions) * 100}%`;
            changeAcceptingAnswers(false);
        }

        setTimeout(() => {
            handleNextButton();
        }, 1500); // Adjust the delay time as needed (in milliseconds)
    }
}



function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionCounter < questions.length) {
        showQuestion();
    } else {
        // Remove the event listener from answer divs

        showScore();
    }

}

function changeAcceptingAnswers(newVal) {
    acceptingAnswers = newVal;
}

function showScore() {
    resetState();
    questionElement.innerHTML = `
    <div class="col-12 text-center">
    <h2 id="replay-text">You scored ${score} out of ${questions.length}!</h2>
    <button id="replay-button-one" class="btn mt-3 d-md-none" onclick="replayQuiz()">Play Again?</button>
    </div>
    `;
    gameFooterProgress.innerHTML = `
    <div id="progress-bar-final" class=" d-none d-md-block">
    <div id="progress-bar-replay">
    <button id="replay-button-two" class="btn" onclick="replayQuiz()">Play Again?</button>
    </div>
    </div>
    `
    if (score>6) {
    allAnswersContainer.innerHTML = `
    <div class="answers-container col-lg-6">
    <div class="final-container">
    <p id="final-text-one" class="final-text hidden">You</p>
    </div>
    <div class="final-container">
    <p id="final-text-two" class="final-text hidden">are</p>
    </div>
</div>
<div class="answers-container col-lg-6">
    <div class="final-container">
    <p id="final-text-three" class="final-text hidden">a</p>
    </div>
    <div class="final-container">
    <p id="final-text-four" class="final-text hidden">legend!</p>
    </div>
    `;} else {
        allAnswersContainer.innerHTML = `
        <div class="answers-container col-lg-6">
        <div class="final-container">
        <p class="final-text hidden">Try</p>
        </div>
        <div class="final-container">
        <p class="final-text hidden">harder</p>
        </div>
    </div>
    <div class="answers-container col-lg-6">
        <div class="final-container">
        <p class="final-text hidden">next</p>
        </div>
        <div class="final-container">
        <p class="final-text hidden">time!</p>
        </div>
        `;
    };
    runFinalText();
    changeAcceptingAnswers(false);

};


const runFinalText = () => {
    const finalText = document.querySelectorAll('.final-text');
  for (let i = 0; i < finalText.length; i++) {
    setTimeout(() => {
      finalText[i].classList.remove('hidden');
    }, i * 700);
  }
};

function replayQuiz() {
    location.reload();
};

/* timer functions Timer will count down from 60 at second intervals
when it reaches zero the game will end */

let tCount = 60;
let time = setInterval(timingFunction, 1000);

function timingFunction() {
    if (acceptingAnswers) {
        document.getElementById("timer-icon").innerHTML = `${tCount}`;
        tCount = tCount - 1;
        if (tCount < 0) {
            clearInterval(time);
            showScore();
        }
    };
}
