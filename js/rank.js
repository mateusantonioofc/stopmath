const rankData = [
    { name: "Mamaco", score: 850, level: "Mestre PA" },
    { name: "Coxinha", score: 830, level: "Expert" },
    { name: "Mexico", score: 680, level: "Expert" },
    { name: "Miguel", score: 590, level: "Avançado" },
    { name: "LucioLucio", score: 540, level: "Avançado" },
    { name: "LuanaBala", score: 480, level: "Intermediário" },
    { name: "Frontenzo", score: 420, level: "Intermediário" },
    { name: "Java", score: 350, level: "Iniciante" },
    { name: "CD", score: 290, level: "Iniciante" },
    { name: "Você", score: 1000, level: "Novato" }
];

let rankModal;
let rankList;
let userRankElement;

function initRankModal() {
    createRankModal();
    setupRankEventListeners();
    updateRankList();
}

function createRankModal() {
    rankModal = document.createElement('div');
    rankModal.className = 'rank-modal-overlay';
    rankModal.innerHTML = `
        <div class="rank-modal">
            <div class="rank-modal-header">
                <h2>🏆 Ranking dos Mestres da PA</h2>
                <button class="rank-close-btn" id="rank-close-btn">&times;</button>
            </div>
            <div class="rank-info">
                <div class="rank-stats">
                    <div class="stat">
                        <span class="stat-label">Sua Posição</span>
                        <span class="stat-value" id="user-position">-</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Seu Score</span>
                        <span class="stat-value" id="user-score">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Seu Nível</span>
                        <span class="stat-value" id="user-level">Novato</span>
                    </div>
                </div>
            </div>
            <div class="rank-list-container">
                <div class="rank-list-header">
                    <span>Posição</span>
                    <span>Jogador</span>
                    <span>Score</span>
                    <span>Nível</span>
                </div>
                <div class="rank-list" id="rank-list">
                    
                </div>
            </div>
            <div class="rank-actions">
                <button class="rank-action-btn" id="share-rank-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    Compartilhar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(rankModal);
    rankList = document.getElementById('rank-list');
    userRankElement = document.querySelector('.rank-icon');
    
    if (userRankElement) {
        userRankElement.addEventListener('click', openRankModal);
    }
}

function setupRankEventListeners() {
    const closeBtn = document.getElementById('rank-close-btn');
    const shareBtn = document.getElementById('share-rank-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeRankModal);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareRank);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', playAgain);
    }
    
    rankModal.addEventListener('click', (e) => {
        if (e.target === rankModal) {
            closeRankModal();
        }
    });
}

function openRankModal() {
    updateUserRank();
    rankModal.classList.add('active');
}

function closeRankModal() {
    rankModal.classList.remove('active');
}

function updateRankList() {
    if (!rankList) return;
    
    rankList.innerHTML = '';
    
    rankData.forEach((player, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = `rank-item ${player.name === 'Você' ? 'current-user' : ''}`;
        
        const positionClass = index < 3 ? `rank-${index + 1}` : '';
        
        rankItem.innerHTML = `
            <div class="rank-position ${positionClass}">
                ${index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
            </div>
            <div class="rank-name">${player.name}</div>
            <div class="rank-score">${player.score}</div>
            <div class="rank-level">
                <span class="level-badge ${getLevelClass(player.level)}">${player.level}</span>
            </div>
        `;
        
        rankList.appendChild(rankItem);
    });
}

function updateUserRank() {
    const userPosition = document.getElementById('user-position');
    const userScore = document.getElementById('user-score');
    const userLevel = document.getElementById('user-level');
    
    if (userScore) {
        userScore.textContent = score;
    }
    
    const username = localStorage.getItem('stopmath_username') || 'Jogador';
    
    const userIndex = rankData.findIndex(player => player.name === 'Você');
    if (userPosition && userIndex !== -1) {
        userPosition.textContent = `#${userIndex + 1}`;
    }
    
    if (userLevel) {
        userLevel.textContent = getUserLevel(score);
        
        const userData = rankData.find(player => player.name === 'Você');
        if (userData) {
            userData.name = username;
            userData.score = score;
            userData.level = getUserLevel(score);
            updateRankList();
        }
    }
}

function getUserLevel(score) {
    if (score >= 800) return "Mestre PA";
    if (score >= 600) return "Expert";
    if (score >= 400) return "Avançado";
    if (score >= 200) return "Intermediário";
    return "Novato";
}

function getLevelClass(level) {
    const levelClasses = {
        "Mestre PA": "level-master",
        "Expert": "level-expert",
        "Avançado": "level-advanced",
        "Intermediário": "level-intermediate",
        "Iniciante": "level-beginner",
        "Novato": "level-novice"
    };
    return levelClasses[level] || "level-novice";
}

function shareRank() {
    const userData = rankData.find(player => player.name === 'Você');
    if (userData) {
        const shareText = `🏆 Meu ranking no STOPMATH: Posição #${rankData.findIndex(p => p.name === 'Você') + 1} com ${userData.score} pontos! Nível: ${userData.level}. Desafie-me!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'STOPMATH - Ranking',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Ranking copiado para a área de transferência! 📋');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', initRankModal);