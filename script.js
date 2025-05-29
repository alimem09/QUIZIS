let quizData = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = '';

// Загрузка JSON-файла
fetch('quiz-data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.map(question => ({
            ...question,
            question: translateToRussian(question.question),
            options: translateOptionsToRussian(question.options)
        }));
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        alert('Пожалуйста, введите ваше имя.');
        return;
    }

    userName = nameInput.value.trim();
    const category = document.getElementById('category').value;

    // Фильтрация вопросов по категории
    filteredQuestions = quizData.filter(question => {
        return category === 'all' || question.category === category;
    });

    // Выбор 10 случайных вопросов
    if (filteredQuestions.length > 10) {
        filteredQuestions = getRandomQuestions(filteredQuestions, 10);
    }

    // Показать экран викторины
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';

    loadQuestion();
});

function getRandomQuestions(questions, count) {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
}

function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');

    // Очистка контейнеров
    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (currentQuestionIndex < filteredQuestions.length) {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;

        for (const [key, value] of Object.entries(currentQuestion.options)) {
            if (value) { // Проверяем, чтобы не было пустых вариантов
                const button = document.createElement('button');
                button.textContent = `${key}: ${value}`;
                button.onclick = () => selectAnswer(key, currentQuestion.answer);
                optionsContainer.appendChild(button);
            }
        }
    } else {
        showResult();
    }
}

function selectAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    loadQuestion();
}

function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    const resultContainer = document.getElementById('result-container');
    resultContainer.textContent = `Поздравляем, ${userName}! Вы набрали ${score} из ${filteredQuestions.length}. Отличная работа!`;
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    // Сброс состояния
    currentQuestionIndex = 0;
    score = 0;
    userName = '';

    // Вернуться к экрану приветствия
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('quiz-screen').style.display = 'none';
});

// Перевод вопросов и вариантов ответов на русский язык
function translateToRussian(text) {
    const translations = {
        "What was Francis Marion's nickname?": "Какое прозвище было у Фрэнсиса Мариона?",
        "The Grand Strand is a long stretch of sandy beach situated near which of the following?": "Большой пляж находится недалеко от какого из следующих мест?",
        // Добавьте переводы остальных вопросов
    };
    return translations[text] || text;
}

function translateOptionsToRussian(options) {
    const translations = {
        "The Swamp Fox": "Лиса болот",
        "The Yankee Ghost": "Призрак янки",
        "The Carolina Gamecock": "Петух Каролины",
        // Добавьте переводы остальных вариантов
    };
    return Object.fromEntries(
        Object.entries(options).map(([key, value]) => [key, translations[value] || value])
    );
}