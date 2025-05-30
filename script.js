let quizData = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = '';
let selectedCategory = null;

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

// Выбор категории
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedCategory = this.dataset.category;
    });
});

// Начало викторины
document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        alert('Пожалуйста, введите ваше имя.');
        return;
    }

    if (!selectedCategory) {
        alert('Пожалуйста, выберите категорию.');
        return;
    }

    userName = nameInput.value.trim();

    // Фильтрация вопросов по категории
    filteredQuestions = quizData.filter(question => question.category === selectedCategory);

    // Выбор 10 случайных вопросов
    if (filteredQuestions.length > 10) {
        filteredQuestions = getRandomQuestions(filteredQuestions, 10);
    }

    // Сброс состояния викторины
    currentQuestionIndex = 0;
    score = 0;
    
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
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');

    // Очистка контейнеров
    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = '';
    
    // Скрыть кнопку "Следующий вопрос" до выбора ответа
    document.getElementById('next-btn').style.display = 'none';

    if (currentQuestionIndex < filteredQuestions.length) {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        
        // Обновить прогресс
        const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        questionCounter.textContent = `Вопрос ${currentQuestionIndex + 1} из ${filteredQuestions.length}`;
        
        // Отобразить вопрос
        questionContainer.textContent = currentQuestion.question;

        // Отобразить варианты ответов
        for (const [key, value] of Object.entries(currentQuestion.options)) {
            if (value) {
                const button = document.createElement('button');
                button.classList.add('option-btn');
                button.textContent = value;
                button.dataset.key = key;
                button.onclick = () => selectAnswer(key, currentQuestion.answer);
                optionsContainer.appendChild(button);
            }
        }
    } else {
        showResult();
    }
}

function selectAnswer(selectedKey, correctKey) {
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Запретить выбор других вариантов
    optionButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Найти кнопку с выбранным ответом
    const selectedButton = Array.from(optionButtons).find(
        btn => btn.dataset.key === selectedKey
    );
    
    // Найти кнопку с правильным ответом
    const correctButton = Array.from(optionButtons).find(
        btn => btn.dataset.key === correctKey
    );
    
    if (selectedKey === correctKey) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
        correctButton.classList.add('correct');
    }
    
    // Показать кнопку "Следующий вопрос"
    document.getElementById('next-btn').style.display = 'inline-block';
}

function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    const percentage = Math.round((score / filteredQuestions.length) * 100);
    const scoreElement = document.getElementById('score');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    
    scoreElement.textContent = `${score}/${filteredQuestions.length}`;
    resultTitle.textContent = `${userName}, ваш результат:`;
    
    let resultMessage = '';
    if (percentage >= 90) {
        resultMessage = `Потрясающе! Вы настоящий эксперт в ${selectedCategory}! Ваши знания впечатляют.`;
    } else if (percentage >= 70) {
        resultMessage = `Отличный результат! Вы хорошо разбираетесь в ${selectedCategory}. Продолжайте в том же духе!`;
    } else if (percentage >= 50) {
        resultMessage = `Хорошая попытка! В ${selectedCategory} у вас есть базовые знания, но есть куда расти.`;
    } else {
        resultMessage = `Не расстраивайтесь! ${selectedCategory} - сложная тема. Попробуйте еще раз, и у вас обязательно получится!`;
    }
    
    resultText.textContent = resultMessage;
}

// Обработчики кнопок
document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    // Сброс состояния
    currentQuestionIndex = 0;
    score = 0;
    userName = '';
    selectedCategory = null;

    // Снять выбор категории
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    
    // Вернуться к экрану приветствия
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('quiz-screen').style.display = 'none';
    
    // Очистить поле имени
    document.getElementById('name').value = '';
});

// Функции перевода (должны быть дополнены)
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