const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const healthElement = document.getElementById("health");
const gameOverElement = document.getElementById("game-over");
const startButton = document.getElementById("start-btn");
const mainMenu = document.getElementById("main-menu");
const gameContainer = document.getElementById("game-container");
const restartButton = document.getElementById("restart-btn");

let score = 0;
let health = 3;

let words = [
    'ev', 'şehir', 'ağaç', 'yol', 'dağ', 'deniz', 'göl', 'güneş', 'ay', 'yıldız',
    'araba', 'telefon', 'bilgisayar', 'kitap', 'film', 'müzik', 'şarkı', 'resim', 
    'oyun', 'arkadaş', 'çalışma', 'okul', 'öğrenci', 'öğretmen', 'iş', 'para', 'yaz',
    'kış', 'bahar', 'sonbahar', 'havuz', 'yüzme', 'yemek', 'kahve', 'çay', 'su',
    'ekmek', 'peynir', 'elma', 'portakal', 'muz', 'sebze', 'meyve', 'kahvaltı', 'öğle',
    'akşam', 'düşünce', 'hayal', 'gerçek', 'plan', 'hedef', 'problemi', 'çözüm', 
    'sorun', 'çalışan', 'yönetici', 'işçi', 'müdür', 'yazar', 'sanatçı', 'şair', 
    'ressam', 'tartışma', 'konuşma', 'söylev', 'toplantı', 'sevinç', 'hüzün', 'aşk', 
    'nefret', 'mutluluk', 'üzüntü', 'öğrenme', 'hız', 'yavaşlık', 'yükselme', 'alçalma', 
    'direnç', 'fark', 'düşüş', 'yükseliş', 'beklenti', 'şüphe', 'endişe', 'korku',
    'savaş', 'barış', 'değişim', 'devrim', 'yenilik', 'yıkım', 'yıkılma', 'zafer', 
    'başarı', 'hedef', 'özlem', 'gönül', 'kader', 'hayat', 'çalışma', 'toplum',
    'evlilik', 'özgürlük', 'barınma', 'sağlık', 'güvenlik', 'yaşam', 'destan', 'sözcük', 
    'anlam', 'kavram', 'konu', 'tema', 'fikir', 'hikaye', 'roman', 'yazarlık', 
    'şirkette', 'işletme', 'şirket', 'meclis', 'parti', 'kulüp', 'dernek', 'bağlantı'
  ];
  
  

let fallingWords = [];
let stars = [];
let gameStarted = false;  // Oyunun başlatılıp başlatılmadığını kontrol etmek için

const getRandomPosition = (wordWidth) => {
    const maxX = canvas.width - wordWidth - 100;  // Kelimenin sağa taşmasını engellemek için
    if (maxX < 50) {
        return 50;
    }

    let randomX;
    let isOverlapping = true;

    while (isOverlapping) {
        randomX = Math.floor(Math.random() * maxX) + 50;
        isOverlapping = false;

        for (let i = 0; i < fallingWords.length; i++) {
            const otherWord = fallingWords[i];
            const otherWordWidth = ctx.measureText(otherWord.word).width;
            if (randomX < otherWord.x + otherWordWidth && randomX + wordWidth > otherWord.x) {
                isOverlapping = true;
                break;
            }
        }
    }
    return randomX;
};

const createNewWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    const wordWidth = ctx.measureText(word).width;
    const fallingWord = {
        word: word,
        x: getRandomPosition(wordWidth),
        y: 0,
        speed: 2,
        typed: '',
        letters: word.split('')
    };
    fallingWords.push(fallingWord);
};

const createStarEffect = (x, y) => {
    const colors = ['#FFB6C1', '#FFD700', '#98FB98', '#87CEFA', '#FF69B4', '#FFA07A', '#8A2BE2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    stars.push({
        x: x,
        y: y,
        size: Math.random() * 3 + 5,
        speed: 2,
        color: color,
        alpha: 1,
    });
};

const drawStars = () => {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.closePath();
        star.alpha -= 0.02;
        star.y -= star.speed;
    });
    stars = stars.filter(star => star.alpha > 0);
};

const drawFallingWords = () => {
    fallingWords.forEach(fallingWord => {
        ctx.fillStyle = '#000';
        ctx.font = '21px Arial';
        let xPosition = fallingWord.x;

        fallingWord.letters.forEach((letter, index) => {
            if (index < fallingWord.typed.length) {
                ctx.fillStyle = `hsl(${(index * 30) % 360}, 100%, 50%)`;
            } else {
                ctx.fillStyle = '#000';
            }

            const letterWidth = ctx.measureText(letter).width;
            ctx.fillText(letter, xPosition, fallingWord.y);
            xPosition += letterWidth + 2;
        });
    });
};

const checkWords = () => {
    fallingWords.forEach(fallingWord => {
        if (fallingWord.typed === fallingWord.word) {
            score += 10;
            scoreElement.textContent = `Puan: ${score}`;

            let wordWidth = 0;
            fallingWord.letters.forEach(letter => {
                wordWidth += ctx.measureText(letter).width + 2;
            });

            const starX = fallingWord.x + wordWidth / 2;
            createStarEffect(starX, fallingWord.y);

            fallingWords = fallingWords.filter(word => word !== fallingWord);
            createNewWord();
        }
    });
};

let speedIncreaseInterval = 3000;
let lastSpeedIncreaseTime = 0;
let speedMultiplier = 0.5;

let gameOver = false;

const updateGame = () => {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawFallingWords();

    if (fallingWords.length < 3) {
        createNewWord();
    }

    fallingWords.forEach(fallingWord => {
        fallingWord.y += fallingWord.speed * speedMultiplier;

        if (Date.now() - lastSpeedIncreaseTime > speedIncreaseInterval) {
            speedMultiplier += 0.1;
            lastSpeedIncreaseTime = Date.now();
        }

        if (fallingWord.y > canvas.height) {
            health -= 1;
            healthElement.textContent = `Sağlık: ${health}`;
            fallingWords = fallingWords.filter(word => word !== fallingWord);
            createNewWord();

            if (health <= 0) {
                gameOver = true;
                gameOverElement.style.display = 'block';
                restartButton.style.display = 'block';
                return;
            }
        }
    });

    checkWords();
    requestAnimationFrame(updateGame);
};

const restartGame = () => {
    gameOver = false;
    gameOverElement.style.display = 'none';
    restartButton.style.display = 'none';

    score = 0;
    health = 3;
    scoreElement.textContent = `Puan: ${score}`;
    healthElement.textContent = `Sağlık: ${health}`;
    fallingWords = [];

    speedMultiplier = 1;

    createNewWord();
    updateGame();
};

// Event listener for restarting the game
restartButton.addEventListener("click", restartGame);

// Event listener to start the game
startButton.addEventListener("click", () => {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

const startGame = () => {
    gameStarted = true;
    gameOverElement.style.display = 'none';
    score = 0;
    health = 3;
    scoreElement.textContent = `Puan: ${score}`;
    healthElement.textContent = `Sağlık: ${health}`;
    fallingWords = [];
    createNewWord();
    updateGame();
};

document.addEventListener('keydown', (e) => {
    const char = e.key.toLowerCase();

    if (gameStarted) {
        fallingWords.forEach(fallingWord => {
            const currentIndex = fallingWord.typed.length;

            if (char === fallingWord.word[currentIndex]) {
                fallingWord.typed += char;

                let xPosition = fallingWord.x;
                for (let i = 0; i < currentIndex; i++) {
                    xPosition += ctx.measureText(fallingWord.word[i]).width + 2;
                }

                createStarEffect(xPosition, fallingWord.y);
            } else {
                fallingWord.typed = '';
            }
        });
    }
});
