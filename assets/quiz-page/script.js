var timerEl = document.getElementById('timer');
var questionTitleEl = document.getElementById('question-title');
var answerButtonsEl = document.getElementById('answer-list');
var retryButtonEl = document.getElementById('retry');
var answerButtonCorrectAnswer = document.querySelectorAll('#correct-answer');
var answerButtonWrongAnswer = document.querySelectorAll('#wrong-answer');
var timeLeft = 89;
var correctAnswersNeededRemaining = 5;

/*
All questions are located in the "questionBank" array.
In each questionBank index, a discriminator of ■ will be used to allow for a custom number of multiple choice answers.
In each questionBank index, the first segment will be the question.
In each questionBank index, if a ✅ is put as the last char, then it will be omitted and the answer will be parsed as an additional correct answer. It is required for one answer.
Each question is going to be randomly chosen.
5 questions max for the quiz.
Question bank of 15 questions.
*/

//Additional Correct Answer: ✅
//Discriminator: ■
var questionBank = [
    "What does the \'++\' operator do?■Increment a variable by 1.✅■Increment a variable by 2.■Decrement a variable by 1.■Decrement a variable by 2."
    ,"What does the \'--\' operator do?■Increment a variable by 1.■Increment a variable by 2.■Decrement a variable by 1.✅■Decrement a variable by 2."
    ,"What is most associated with square brackets?■Arrays.✅■Objects.■Elements/Logic.■Grouping/Parameters."
    ,"What is most associated with curly brackets?■Objects.✅■Arrays.■Elements/Logic.■Grouping/Parameters."
    ,"What is most associated with angle brackets?■Objects.■Arrays.■Elements/Logic.✅■Grouping/Parameters."
    ,"What is most associated with parenthesis?■Objects.■Arrays.■Elements/Logic.■Grouping/Parameters.✅"
    ,"Javascript is a(n) ______-oriented programming language.■object✅■BASIC■high■low■abstract■Linux"
    ,"Is a <name>.js file being only present in the files sufficient for it to successfully run with the HTML file?■Yes.■No.✅"
];

function quizOver(answers, score) {
    answerButtonsEl.innerHTML = '';
    if (answers <= 0) {
        if (score > 0)
        questionTitleEl.textContent = 'You completed the Quiz!\nYour score is: ' + score + "!";
    } else {
        questionTitleEl.textContent = 'You did not complete the Quiz! Try again.';
        answerButtonsEl.insertAdjacentHTML("beforeend", "<button id=\"retry\">Retry</button>");
        retryButtonEl = document.getElementById('retry');
        retryButtonEl.addEventListener('click', function () {
            questionBankCopy = [];
            questionBankCopy = questionBankCopy.concat(questionBank);
            answerButtonsEl.innerHTML = '';
            timeLeft = 89;
            timerEl.textContent = "Time: 90s";
            generateQuestion();
            countdown();
        });
        timerEl.textContent = "Time: Over!";
    }
}

var questionBankCopy = []; //This will keep a copy of the remaining question bank
questionBankCopy = questionBankCopy.concat(questionBank);

function generateQuestion() {
    timerEl = document.getElementById('timer');
    questionTitleEl = document.getElementById('question-title');
    answerButtonsEl = document.getElementById('answer-list');
    answerButtonCorrectAnswer = document.getElementById('correct-answer');
    answerButtonWrongAnswer = document.getElementById('wrong-answer');
    
    var randomNumber = Math.floor(Math.random() * questionBankCopy.length);
    var randomQuestionString = questionBankCopy[randomNumber];
    questionBankCopy.splice(randomNumber, 1);

    var randomQuestion = [];
    randomQuestion = randomQuestionString.split('■');

    //Ascii Table
    //String.fromCharCode found from https://www.geeksforgeeks.org/javascript-program-to-print-alphabets-from-a-to-z-using-loop/
    //Code heavily references from this site. Modified.

    questionTitleEl.textContent = randomQuestion[0];
    randomQuestion.splice(0, 1);

    console.log(correctAnswersNeededRemaining);

    randomNumber = Math.floor(Math.random() * randomQuestion.length);
    var asciiValue = 65;
    console.log(questionBankCopy);
    while (randomQuestion.length > 0) {
        chosenRandomAnswer = randomQuestion[randomNumber];
        if(chosenRandomAnswer[chosenRandomAnswer.length - 1] === "✅") {
            randomQuestion[randomNumber] = chosenRandomAnswer.substring(0, chosenRandomAnswer.length - 1);
            answerButtonsEl.insertAdjacentHTML("beforeend", "<button id=\"correct-answer\">" + String.fromCharCode(asciiValue) + ".) " + randomQuestion[randomNumber] + "</button>");
        } else {
            answerButtonsEl.insertAdjacentHTML("beforeend", "<button id=\"wrong-answer\">" + String.fromCharCode(asciiValue) + ".) " + randomQuestion[randomNumber] + "</button>");
        }    
        asciiValue++;
        randomQuestion.splice(randomNumber, 1);
        randomNumber = Math.floor(Math.random() * randomQuestion.length);
    }
    answerButtonCorrectAnswer = document.querySelectorAll('#correct-answer');
    answerButtonWrongAnswer = document.querySelectorAll('#wrong-answer');


    //For loops obtained from https://www.codeinwp.com/snippets/add-event-listener-to-multiple-elements-with-javascript/#gref . Modified.
    for(i of answerButtonCorrectAnswer) {
        (function(i) {
            i.addEventListener('click', function() {
                answerButtonsEl.innerHTML = '';
                correctAnswersNeededRemaining--;
                if (correctAnswersNeededRemaining == 0) {
                    quizOver(correctAnswersNeededRemaining, timeLeft);
                    timeLeft = 0;
                } else {
                    generateQuestion();
                }
            });
        })(i);
    }
    for(i of answerButtonWrongAnswer) {
        (function(i) {
            i.addEventListener('click', function() {
                answerButtonsEl.innerHTML = '';
                if(timeLeft <= 18) {
                    timeLeft = 0;
                    quizOver(correctAnswersNeededRemaining, 0);
                } else {
                    timeLeft -= 18;
                    timerEl.textContent = "Time: " + timeLeft + "s";
                    generateQuestion();
                }
            });
        })(i);
    }
}

function countdown() {
    var timeInterval = setInterval(function () {
        timerEl.textContent = "Time: " + timeLeft + "s";
        if(timeLeft <= 0) {
          clearInterval(timeInterval);
          timerEl.textContent = "Time: Over!";
          quizOver(correctAnswersNeededRemaining, 0);
        }
        timeLeft--;
    }, 1000);
}

generateQuestion();
countdown();