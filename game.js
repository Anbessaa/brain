// Базы данных
const countriesDB = [
    {
        name: "Франция",
        facts: [
            "Эта страна известна своей кухней",
            "Здесь находится Эйфелева башня",
            "Столица - город любви",
            "Родина импрессионизма",
            "Известна своими винами и сырами"
        ]
    },
    {
        name: "Япония",
        facts: [
            "Страна восходящего солнца",
            "Известна своими высокими технологиями",
            "Родина суши и аниме",
            "Здесь находится гора Фудзи",
            "Столица - один из самых населенных городов мира"
        ]
    }
];

const rebusesDB = [
    {
        difficulty: 1,
        puzzle: "🌞🌛➕",
        solution: "день и ночь",
        hints: ["Время суток", "24 часа", "Противоположности"]
    },
    {
        difficulty: 2,
        puzzle: "🌍💧",
        solution: "земной шар",
        hints: ["Планета", "Глобус", "Третья от Солнца"]
    }
];

// Вспомогательные классы
class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
    }

    start() {
        this.interval = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);
            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
}

class PointSystem {
    constructor() {
        this.totalScore = 0;
        this.level = 1;
        this.levelsThreshold = [0, 100, 250, 500, 1000, 2000];
    }

    addPoints(points) {
        this.totalScore += points;
        this.checkLevelUp();
    }

    checkLevelUp() {
        while (this.level < this.levelsThreshold.length && this.totalScore >= this.levelsThreshold[this.level]) {
            this.level++;
            console.log(`Поздравляем! Вы достигли уровня ${this.level}!`);
        }
    }

    getMultiplier() {
        return 1 + (this.level - 1) * 0.1;
    }
}

// Инициализация Telegram Mini App
let tg = window.Telegram.WebApp;

// Функция для инициализации приложения
function initApp() {
    tg.ready();
    tg.expand();

    // Настройка темы
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Настройка основной кнопки Telegram
    tg.MainButton.setText('Начать игру');
    tg.MainButton.show();
    tg.MainButton.onClick(() => app.startRandomGame());

    // Отправка данных в Telegram при завершении игры
    window.onbeforeunload = () => {
        tg.sendData(JSON.stringify({
            score: app.currentGame.pointSystem.totalScore,
            level: app.currentGame.pointSystem.level
        }));
    };
}

// Основные классы игр
class Game {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.pointSystem = new PointSystem();
    }

    updateScore(points) {
        const adjustedPoints = Math.round(points * this.pointSystem.getMultiplier());
        this.score += adjustedPoints;
        this.pointSystem.addPoints(adjustedPoints);
    }
}

class GuessCountry extends Game {
    constructor() {
        super("Угадай страну");
        this.currentCountry = null;
        this.revealedFacts = 0;
    }

    startNewRound(country) {
        this.currentCountry = country;
        this.revealedFacts = 0;
    }

    revealNextFact() {
        if (this.revealedFacts < this.currentCountry.facts.length) {
            this.revealedFacts++;
            return this.currentCountry.facts[this.revealedFacts - 1];
        }
        return null;
    }

    makeGuess(guess) {
        if (guess.toLowerCase() === this.currentCountry.name.toLowerCase()) {
            const points = 100 - (this.revealedFacts * 15);
            this.updateScore(Math.max(points, 10));
            return true;
        }
        return false;
    }
}

class RebusChallenge extends Game {
    constructor() {
        super("Ребус-челлендж");
        this.currentRebus = null;
        this.hintsUsed = 0;
    }

    startNewRound(rebus) {
        this.currentRebus = rebus;
        this.hintsUsed = 0;
    }

    useHint() {
        if (this.hintsUsed < this.currentRebus.hints.length) {
            this.hintsUsed++;
            return this.currentRebus.hints[this.hintsUsed - 1];
        }
        return null;
    }

    solvePuzzle(solution) {
        if (solution.toLowerCase() === this.currentRebus.solution.toLowerCase()) {
            const basePoints = this.currentRebus.difficulty * 100;
            const points = basePoints * (1 - (this.hintsUsed * 0.25));
            this.updateScore(Math.max(points, 10));
            return true;
        }
        return false;
    }
}

// Класс для сохранения прогресса
class GameProgress {
    constructor() {
        this.load();
    }

    save() {
        const data = {
            totalScore: app.currentGame.pointSystem.totalScore,
            level: app.currentGame.pointSystem.level
        };
        localStorage.setItem('gameProgress', JSON.stringify(data));
    }

    load() {
        const savedData = localStorage.getItem('gameProgress');
        if (savedData) {
            const data = JSON.parse(savedData);
            return data;
        }
        return null;
    }
}

// Основной класс приложения
class GameApp {
    constructor() {
        this.countryGame = new GuessCountry();
        this.rebusGame = new RebusChallenge();
        this.currentGame = null;
        this.timer = null;
        this.progress = new GameProgress();

        this.gameContainer = document.getElementById('gameContent');
        this.startButton = document.getElementById('startGame');
        this.guessInput = document.getElementById('guessInput');
        this.submitButton = document.getElementById('submitGuess');
        this.feedback = document.getElementById('feedback');
        this.timerDisplay = document.getElementById('timer');
        this.scoreDisplay = document.getElementById('score');
        this.levelDisplay = document.getElementById('level');

        this.initEventListeners();
        this.loadProgress();
    }
 // Инициализация Telegram Mini App
        if (window.Telegram && window.Telegram.WebApp) {
            initApp();
        }
    }    

 initEventListeners() {
        this.startButton.addEventListener('click', () => this.startRandomGame());
        this.submitButton.addEventListener('click', () => this.makeGuess());
    }

    loadProgress() {
        const savedData = this.progress.load();
        if (savedData) {
            this.countryGame.pointSystem.totalScore = savedData.totalScore;
            this.countryGame.pointSystem.level = savedData.level;
            this.rebusGame.pointSystem.totalScore = savedData.totalScore;
            this.rebusGame.pointSystem.level = savedData.level;
            this.updateStats();
        }
    }

    startRandomGame() {
        if (Math.random() < 0.5) {
            this.startCountryGame();
        } else {
            this.startRebusGame();
        }
    }

    startCountryGame() {
        const country = this.getRandomCountry();
        this.currentGame = this.countryGame;
        this.countryGame.startNewRound(country);
        this.displayGame("Угадай страну", country.facts[0]);
        this.startTimer(60, () => this.revealNextFact(country));
    }

    startRebusGame() {
        const rebus = this.getRandomRebus();
        this.currentGame = this.rebusGame;
        this.rebusGame.startNewRound(rebus);
        this.displayGame("Ребус-челлендж", rebus.puzzle);
        this.startTimer(30);
    }

    displayGame(title, content) {
        this.gameContainer.innerHTML = `
            <h2>${title}</h2>
            <p>${content}</p>
        `;
    }

    startTimer(duration, onTick) {
        if (this.timer) this.timer.stop();
        this.timer = new Timer(duration, 
            (remaining) => {
                this.timerDisplay.textContent = remaining;
                if (onTick) onTick(remaining);
            },
            () => this.endGame("Время вышло!", false)
        );
        this.timer.start();
    }

    revealNextFact(country) {
        const fact = this.countryGame.revealNextFact();
        if (fact) {
            this.gameContainer.innerHTML += `<p>${fact}</p>`;
        }
    }

    makeGuess() {
        const guess = this.guessInput.value;
        let result;

        if (this.currentGame instanceof GuessCountry) {
            result = this.countryGame.makeGuess(guess);
        } else if (this.currentGame instanceof RebusChallenge) {
            result = this.rebusGame.solvePuzzle(guess);
        }

        if (result) {
            this.endGame("Правильно!", true);
        } else {
            this.feedback.textContent = "Неправильно. Попробуйте еще раз.";
        }

        this.guessInput.value = '';
        this.updateStats();
    }

    endGame(message, isCorrect = false) {
        this.timer.stop();
        this.feedback.textContent = message;
        this.updateStats();

        if (isCorrect) {
            this.submitButton.disabled = true; // Отключаем кнопку после правильного ответа
            setTimeout(() => {
                this.startRandomGame();
                this.feedback.textContent = '';
                this.submitButton.disabled = false; // Включаем кнопку для новой игры
            }, 2000);
        } else {
            this.startButton.disabled = false;
        }

        this.progress.save();
    }

// Обновление счета в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            tg.MainButton.setText(`Счет: ${this.currentGame.pointSystem.totalScore}`);
        }
    }

    updateStats() {
        this.scoreDisplay.textContent = this.currentGame.pointSystem.totalScore;
        this.levelDisplay.textContent = this.currentGame.pointSystem.level;
    }

    getRandomCountry() {
        return countriesDB[Math.floor(Math.random() * countriesDB.length)];
    }

    getRandomRebus() {
        return rebusesDB[Math.floor(Math.random() * rebusesDB.length)];
    }
}

// Создание экземпляра приложения
const app = new GameApp();
