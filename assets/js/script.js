

let apiUrl = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
let questions;
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question-container");

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
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;

    questionElement.innerHTML = `<h2>${currentQuestion.question}</h2>`;

    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

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

answerDivs.forEach(answerDiv => answerDiv.addEventListener("click", selectAnswer));


function selectAnswer(e) {
    const selectedDiv = e.target;
    const isCorrect = selectedDiv.dataset.correct === "true";



    if (isCorrect) {
        selectedDiv.classList.add("correct");
        score++;
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

    setTimeout(() => {
        handleNextButton();
    }, 2000); // Adjust the delay time as needed (in milliseconds)
}



function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        // Remove the event listener from answer divs
        
        showScore();
    }
        
}


function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`
    
    };

