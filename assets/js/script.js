

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
        }

        setTimeout(() => {
            handleNextButton();
        }, 500); // Adjust the delay time as needed (in milliseconds)
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
    progressBarFull.innerHTML = `
    <button id="play-again-button" class="btn" onclick="replayQuiz()">Play Again?</button>
    `
    questionElement.innerHTML = `
    <div class="col-12 text-center">
    <h2>You scored ${score} out of ${questions.length}!</h2>
    <button id="replay-button" class="btn mt-3" onclick="replayQuiz()">Play Again?</button>
    </div>
    `;
    if (score>6) {
    allAnswersContainer.innerHTML = `
    <div class="answers-container col-lg-6">
    <div id="answer-one" class="answer-container">
    <p class="final-text">You</p>
    </div>
    <div id="answer-two" class="answer-container">
    <p class="final-text">are</p>
    </div>
</div>
<div class="answers-container col-lg-6">
    <div id="answer-three" class="answer-container">
    <p class="final-text">a</p>
    </div>
    <div id="answer-four" class="answer-container">
    <p class="final-text">legend!</p>
    </div>
    `;} else {
        allAnswersContainer.innerHTML = `
        <div class="answers-container col-lg-6">
        <div id="answer-one" class="answer-container">
        <p class="final-text">Try</p>
        </div>
        <div id="answer-two" class="answer-container">
        <p class="final-text">harder</p>
        </div>
    </div>
    <div class="answers-container col-lg-6">
        <div id="answer-three" class="answer-container">
        <p class="final-text">next</p>
        </div>
        <div id="answer-four" class="answer-container">
        <p class="final-text">time!</p>
        </div>
        `;
    };
    changeAcceptingAnswers(false);
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
        setTimeout(() => {
            showScore();
          }, 60000);
    };
}