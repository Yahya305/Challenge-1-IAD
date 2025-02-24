const quizElement = document.getElementById("quiz");
const problemElement = document.getElementById("problem");
const timerElement = document.getElementById("timer");
const answerElement = document.getElementById("answer");
const submitButton = document.getElementById("submit");
const startButton = document.getElementById("start");
const resultsElement = document.getElementById("results");
const correctSpan = document.getElementById("correct");
const totalSpan = document.getElementById("total");
const averageSpan = document.getElementById("average");

let currentProblemIndex = 0;
let correctCount = 0;
let totalTime = 0;
let penalties = 0;
let problems = [];

function generateProblem() {
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;

    switch (operator) {
        case "+":
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            answer = num1 + num2;
            break;
        case "-":
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            answer = num1 - num2;
            break;
        case "*":
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
        case "/":
            num2 = Math.floor(Math.random() * 10) + 1; // Divisor (1 to 10)
            answer = Math.floor(Math.random() * 10) + 1; // Quotient (1 to 10)
            num1 = num2 * answer; // Dividend
            break;
    }

    return { num1, operator, num2, answer };
}

function generateProblems() {
    return Array.from({ length: 10 }, () => generateProblem());
}

function startProblem() {
    if (currentProblemIndex >= 10) {
        showResults();
        return;
    }

    const problem = problems[currentProblemIndex];
    problemElement.textContent = `${problem.num1} ${problem.operator} ${problem.num2} = ?`;
    answerElement.value = "";
    answerElement.focus();

    let timeLeft = 5;
    let timerInterval = null;
    let timeoutId = null;
    const startTime = Date.now();

    const clearAllTimers = () => {
        if (timerInterval) clearInterval(timerInterval);
        if (timeoutId) clearTimeout(timeoutId);
    };

    const updateTimerDisplay = () => {
        timerElement.textContent = `Time left: ${timeLeft}`;
    };

    const startTimers = () => {
        clearAllTimers();
        updateTimerDisplay();

        // Visual countdown timer
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearAllTimers();
                handleAnswer(null, 5); // Max time per problem
            }
        }, 1000);

        // Actual timeout
        timeoutId = setTimeout(() => {
            clearAllTimers();
            handleAnswer(null, 5); // Max time per problem
        }, timeLeft * 1000);
    };

    // Initial timer start
    startTimers();

    const handleSubmit = () => {
        const userAnswer = parseInt(answerElement.value);
        if (isNaN(userAnswer)) {
            answerElement.style.border = '2px solid red';
            answerElement.placeholder = 'Numeric Data please';
          } else {
            answerElement.style.border = '2px solid green';
            answerElement.placeholder = 'Enter a Number';
          }
        const isCorrect = userAnswer === problem.answer;

        if (!isCorrect) {
            // Apply penalty
            timeLeft -= 2;

            if (timeLeft <= 0) {
                // Immediate timeout if no time left
                clearAllTimers();
                handleAnswer(null, 5);
            } else {
                // Restart timers with new remaining time
                startTimers();
                answerElement.value = "";
                answerElement.focus();
            }
        } else {
            // Calculate actual time taken
            const timeTaken = (Date.now() - startTime) / 1000;
            clearAllTimers();
            handleAnswer(userAnswer, Math.min(timeTaken, 5));
        }
    };

    submitButton.onclick = handleSubmit;
    answerElement.onkeypress = (e) => {
        if (e.key === "Enter") handleSubmit();
    };
}

function handleAnswer(userAnswer, timeTaken) {
    const problem = problems[currentProblemIndex];
    const isCorrect = userAnswer === problem?.answer;

    if (isCorrect) {
        correctCount++;
    } else {
        penalties++;
    }

    totalTime += Math.min(timeTaken, 5);
    currentProblemIndex++;

    if (currentProblemIndex < 10) {
        startProblem();
    } else {
        showResults();
    }
}

function showResults() {
    quizElement.style.display = "none";
    resultsElement.style.display = "block";

    const totalWithPenalties = totalTime + penalties * 2;
    const average = totalWithPenalties / 10;

    correctSpan.textContent = correctCount;
    totalSpan.textContent = totalWithPenalties.toFixed(1);
    averageSpan.textContent = average.toFixed(1);
}

startButton.onclick = () => {
    problems = generateProblems();
    currentProblemIndex = 0;
    correctCount = 0;
    totalTime = 0;
    penalties = 0;

    startButton.style.display = "none";
    quizElement.style.display = "block";
    resultsElement.style.display = "none";

    startProblem();
};
