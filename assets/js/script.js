let apiUrl = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
let questions;
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question-container");
const answerDivs = document.querySelectorAll(".answer-text");
const nextButton = document.getElementById("next-btn");

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

    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

    allAnswers.forEach((answer, index) => {
        const answerDiv = answerDivs[index];
        answerDiv.innerText = `${answer}`;
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
        }
        answerDiv.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Restart";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", () => {
        location.reload();
    });
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", handleNextButton);

fetchData();