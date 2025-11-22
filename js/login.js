let userConfig = {
    username: ''
};

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    setupEventListeners();
    loadSavedUsername();
});

function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

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

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    
    usernameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
        
        updateStartButton();
    });

    usernameInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    usernameInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
}

function loadSavedUsername() {
    const savedUsername = localStorage.getItem('stopmath_username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        userConfig.username = savedUsername;
    }
    updateStartButton();
}

function updateStartButton() {
    const hasUsername = usernameInput.value.trim().length > 0;
    startBtn.disabled = !hasUsername;
    
    if (hasUsername) {
        startBtn.style.opacity = '1';
        startBtn.style.cursor = 'pointer';
    } else {
        startBtn.style.opacity = '0.7';
        startBtn.style.cursor = 'not-allowed';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Por favor, digite seu nome');
        return;
    }
    
    if (username.length < 2) {
        showError('O nome deve ter pelo menos 2 caracteres');
        return;
    }
    
    if (username.length > 15) {
        showError('O nome deve ter no máximo 15 caracteres');
        return;
    }
    
    userConfig.username = username;
    localStorage.setItem('stopmath_username', username);
    
    startBtn.disabled = true;
    startBtn.innerHTML = '<span class="btn-text">Iniciando...</span><span class="btn-icon">🎯</span>';
    
    loginForm.classList.add('loading');
    
    setTimeout(() => {
        window.location.href = 'game.html';
    }, 1000);
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid rgba(255, 68, 68, 0.3);
        padding: 10px 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-size: 14px;
        animation: shake 0.5s ease-in-out;
    `;
    
    loginForm.insertBefore(errorElement, startBtn);
    
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .login-form.loading .start-btn {
        animation: pulse 1s infinite;
    }
`;
document.head.appendChild(style);