// कुछ पैराग्राफ्स जो टेस्ट के लिए उपयोग होंगे
const quotes = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the English alphabet. Learning to type quickly and accurately is a valuable skill in today's digital world.",
    "Technology has revolutionized the way we live and work. From communication to entertainment, its impact is undeniable. The future holds even more exciting possibilities as innovation continues to advance.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Always remember that your present situation is not your final destination. The best is yet to come."
];

// जरूरी HTML एलिमेंट्स को चुनना
const textDisplayElement = document.getElementById('text-display');
const textInputElement = document.getElementById('text-input');
const timerElement = document.getElementById('timer');
const mistakesElement = document.getElementById('mistakes');
const resultsElement = document.getElementById('results');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

// वेरिएबल्स जो गेम की स्टेट को ट्रैक करेंगे
let timer;
let totalTime = 60;
let timeRemaining = totalTime;
let mistakes = 0;
let typedChars = 0;
let isTimerStarted = false;

// एक नया पैराग्राफ लोड करने का फंक्शन
function loadNewQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    textDisplayElement.innerHTML = ''; // पहले के टेक्स्ट को साफ करें
    
    // टेक्स्ट के हर कैरेक्टर को एक <span> में डालें
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textDisplayElement.appendChild(charSpan);
    });
}

// यूजर के इनपुट को प्रोसेस करने का फंक्शन
function processInput() {
    // अगर टाइमर शुरू नहीं हुआ है, तो उसे शुरू करें
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    const quoteChars = textDisplayElement.querySelectorAll('span');
    const inputChars = textInputElement.value.split('');
    typedChars = inputChars.length;
    
    let currentMistakes = 0;

    quoteChars.forEach((charSpan, index) => {
        const char = inputChars[index];

        if (char == null) {
            // अभी तक टाइप नहीं किया गया
            charSpan.classList.remove('correct', 'incorrect');
        } else if (char === charSpan.innerText) {
            // सही टाइप किया
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            // गलत टाइप किया
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            currentMistakes++;
        }
    });

    mistakes = currentMistakes;
    mistakesElement.innerText = mistakes;
    
    // जब पूरा पैराग्राफ सही टाइप हो जाए
    if (typedChars === quoteChars.length && mistakes === 0) {
        endGame();
    }
}

// टाइमर शुरू करने का फंक्शन
function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = timeRemaining;
        if (timeRemaining === 0) {
            endGame();
        }
    }, 1000);
}

// गेम खत्म करने का फंक्शन
function endGame() {
    clearInterval(timer); // टाइमर रोकें
    textInputElement.disabled = true; // इनपुट को डिसेबल करें
    resultsElement.classList.remove('hidden'); // रिजल्ट्स दिखाएं
    
    // WPM और Accuracy की गणना करें
    const grossWPM = (typedChars / 5) / (totalTime / 60);
    const netWPM = grossWPM - (mistakes / (totalTime / 60));
    const accuracy = Math.floor(((typedChars - mistakes) / typedChars) * 100);

    wpmElement.innerText = Math.max(0, Math.floor(netWPM)); // WPM नेगेटिव नहीं हो सकता
    accuracyElement.innerText = accuracy > 0 ? accuracy : 0; // Accuracy नेगेटिव नहीं हो सकती
}

// गेम को रीसेट करने का फंक्शन
function resetGame() {
    clearInterval(timer);
    timeRemaining = totalTime;
    mistakes = 0;
    typedChars = 0;
    isTimerStarted = false;

    timerElement.innerText = totalTime;
    mistakesElement.innerText = 0;
    
    textInputElement.value = '';
    textInputElement.disabled = false;
    
    resultsElement.classList.add('hidden');
    loadNewQuote();
}

// इवेंट लिस्टनर्स
textInputElement.addEventListener('input', processInput);
restartBtn.addEventListener('click', resetGame);

// पेज लोड होने पर गेम शुरू करें
resetGame();