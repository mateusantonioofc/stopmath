let currentQuestion = null;
let score = 0;

let timerInterval = null;
let timeLeft = 10;
const totalTime = 60000;
const timeNewQuestionDelay = 4000;

let currentSlide = 0;
const totalSlides = 5;

const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const timerValue = document.getElementById('timer-value');
const timerProgress = document.querySelector('.timer-progress');
const scoreValue = document.getElementById('score-value');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackMessage = document.getElementById('feedback-message');
const hintBtn = document.getElementById('hint-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const externalControls = document.getElementById('external-carousel-controls');
const externalPrevBtn = document.getElementById('external-prev-btn');
const externalNextBtn = document.getElementById('external-next-btn');
const externalIndicators = document.getElementById('external-indicators');
const carouselTrack = document.getElementById('carousel-track');

const questions = [
    {
        question: "Encontre o 15º termo da PA: 3, 7, 11, 15, ...",
        answer: "59",
        explanation: "a₁ = 3, r = 4, a₁₅ = 3 + (15-1)×4 = 3 + 56 = 59"
    },
    {
        question: "Qual é o 20º termo da PA: 2, 5, 8, 11, ...?",
        answer: "59",
        explanation: "a₁ = 2, r = 3, a₂₀ = 2 + (20-1)×3 = 2 + 57 = 59"
    },
    {
        question: "Calcule o 12º termo da PA: 10, 15, 20, 25, ...",
        answer: "65",
        explanation: "a₁ = 10, r = 5, a₁₂ = 10 + (12-1)×5 = 10 + 55 = 65"
    },
    {
        question: "Determine o 8º termo da PA: -3, 1, 5, 9, ...",
        answer: "25",
        explanation: "a₁ = -3, r = 4, a₈ = -3 + (8-1)×4 = -3 + 28 = 25"
    },
    {
        question: "Encontre o 10º termo da PA: 100, 95, 90, 85, ...",
        answer: "55",
        explanation: "a₁ = 100, r = -5, a₁₀ = 100 + (10-1)×(-5) = 100 - 45 = 55"
    },
    {
        question: "Qual é o 6º termo da PA: 1/2, 1, 3/2, 2, ...?",
        answer: "3",
        explanation: "a₁ = 0.5, r = 0.5, a₆ = 0.5 + (6-1)×0.5 = 0.5 + 2.5 = 3"
    },
    {
        question: "Calcule o 25º termo da PA: 7, 12, 17, 22, ...",
        answer: "127",
        explanation: "a₁ = 7, r = 5, a₂₅ = 7 + (25-1)×5 = 7 + 120 = 127"
    },
    {
        question: "Determine o 18º termo da PA: -10, -6, -2, 2, ...",
        answer: "58",
        explanation: "a₁ = -10, r = 4, a₁₈ = -10 + (18-1)×4 = -10 + 68 = 58"
    }
];

document.addEventListener('DOMContentLoaded', function () {
    createStars();
    createParticles();
    setupExternalCarousel();
    setupEventListeners();
    startNewQuestion();
});

function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3;
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }
}

function createParticles() {
    const container = document.querySelector('.container');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;

        container.appendChild(particle);
    }
}

function setupEventListeners() {
    answerInput.addEventListener('focus', () => {
        answerInput.style.boxShadow = '0 0 15px rgba(123, 47, 247, 0.7)';
        answerInput.style.borderColor = '#30eaff';
    });

    answerInput.addEventListener('blur', () => {
        answerInput.style.boxShadow = '0 0 10px rgba(123, 47, 247, 0.3)';
        answerInput.style.borderColor = '#7b2ff7';
    });

    submitBtn.addEventListener('mousedown', () => {
        submitBtn.style.transform = 'translateY(2px)';
        submitBtn.style.boxShadow = '0 3px 10px rgba(123, 47, 247, 0.4)';
    });

    submitBtn.addEventListener('mouseup', () => {
        submitBtn.style.transform = 'translateY(0)';
        submitBtn.style.boxShadow = '0 5px 15px rgba(123, 47, 247, 0.4)';
    });

    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    hintBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunc);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeModalFunc();
        }
    });

    externalPrevBtn.addEventListener('click', prevSlide);
    externalNextBtn.addEventListener('click', nextSlide);
}

function setupExternalCarousel() {
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('external-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        externalIndicators.appendChild(indicator);
    }

    updateExternalCarouselButtons();
}

function openModal() {
    modalOverlay.classList.add('active');
    externalControls.classList.add('visible');
    goToSlide(0);
}

function closeModalFunc() {
    modalOverlay.classList.remove('active');
    externalControls.classList.remove('visible');
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
        slide.classList.remove('active');
    });
    
    slides[currentSlide].style.display = 'block';
    slides[currentSlide].classList.add('active');

    document.querySelectorAll('.external-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });

    updateExternalCarouselButtons();
}

function updateExternalCarouselButtons() {
    externalPrevBtn.disabled = currentSlide === 0;
    externalNextBtn.disabled = currentSlide === totalSlides - 1;
}

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

function startNewQuestion() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timeLeft = 10;
    timerValue.textContent = timeLeft;
    timerProgress.style.background = 'conic-gradient(#30eaff 0%, transparent 0%)';

    currentQuestion = getRandomQuestion();
    questionText.textContent = currentQuestion.question;

    answerInput.value = '';
    answerInput.focus();
    hideFeedback();

    startTimer();
}

function startTimer() {
    const startTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeLeft = Math.ceil((totalTime - elapsed) / 1000);

        if (timeLeft <= 0) {
            timeLeft = 0;
            timerValue.textContent = "0";
            timerProgress.style.background = 'conic-gradient(#ff3030 100%, transparent 0%)';
            clearInterval(timerInterval);
            showFeedback("Tempo esgotado! ❌", false);
            setTimeout(startNewQuestion, timeNewQuestionDelay);
        } else {
            timerValue.textContent = timeLeft;
            const progress = 100 - (elapsed / totalTime * 100);
            timerProgress.style.background = `conic-gradient(#30eaff ${progress}%, transparent 0%)`;
        }
    }, 100);
}

function checkAnswer() {
    if (!currentQuestion) return;

    const userAnswer = answerInput.value.trim();

    if (userAnswer === '') {
        showFeedback("Digite uma resposta! ⚠️", false);
        return;
    }

    clearInterval(timerInterval);

    if (userAnswer === currentQuestion.answer) {
        score += 10;
        scoreValue.textContent = score;
        showFeedback(`Correto! ✅ +10 pontos\n${currentQuestion.explanation}`, true);
    } else {
        showFeedback(`Incorreto! ❌\nResposta correta: ${currentQuestion.answer}\n${currentQuestion.explanation}`, false);
    }

    setTimeout(startNewQuestion, timeNewQuestionDelay);
}

function showFeedback(message, isCorrect) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = 'feedback-message ' + (isCorrect ? 'feedback-correct' : 'feedback-incorrect');
    feedbackContainer.classList.add('show');
}

function hideFeedback() {
    feedbackContainer.classList.remove('show');
}