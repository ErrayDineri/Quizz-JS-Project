// script.js
async function fetchQuestions(categoryId, difficulty, amount) {
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (categoryId !== 'all') apiUrl += `&category=${categoryId}`;
    if (difficulty !== 'all') apiUrl += `&difficulty=${difficulty}`;

    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.response_code !== 0) throw new Error('Aucune question trouvée.');

    return data.results.map(item => {
        const decode = txt => {
            const el = document.createElement('textarea');
            el.innerHTML = txt;
            return el.value;
        };

        // combine and shuffle answers
        const choices = [...item.incorrect_answers.map(decode), decode(item.correct_answer)];
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return {
            q: decode(item.question),
            c: choices,
            a: choices.indexOf(decode(item.correct_answer))
        };
    });
}

let questions = [],
    current = 0,
    score = 0,
    timer, timeLeft;
const maxTime = 15;

// DOM refs
const setupEl = document.getElementById('setup');
const quizEl = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('nextBtn');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const timerFill = document.getElementById('timerFill');
const lifeline50 = document.getElementById('lifeline50');
const lifelineSkip = document.getElementById('lifelineSkip');
const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
const reviewList = document.getElementById('reviewList');
const finalScore = document.getElementById('finalScore');
const leaderboardEl = document.getElementById('leaderboard');
const restartBtn = document.getElementById('restartBtn');
const shareBtn = document.getElementById('shareBtn');

// Start quiz
document.getElementById('startBtn').onclick = async () => {
    const cat = document.getElementById('category').value;
    const diff = document.getElementById('difficulty').value;
    const amount = document.getElementById('questionNumber').value;

    try {
        questions = await fetchQuestions(cat, diff, amount);
    } catch (e) {
        alert(e.message);
        return;
    }

    current = 0;
    score = 0;
    setupEl.classList.add('d-none');
    quizEl.classList.remove('d-none');
    loadQuestion();
};

function loadQuestion() {
    clearInterval(timer);
    timeLeft = maxTime;
    const obj = questions[current];
    progressText.textContent = `Question ${current+1}/${questions.length}`;
    progressFill.style.width = `${(current/questions.length)*100}%`;
    questionEl.textContent = obj.q;
    choicesEl.innerHTML = '';
    obj.c.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn btn-outline-primary choice-btn';
        b.textContent = opt;
        b.onclick = () => select(i, b);
        choicesEl.appendChild(b);
    });
    nextBtn.disabled = true;
    lifeline50.disabled = false;
    lifelineSkip.disabled = false;
    startTimer();
}

function startTimer() {
    timerFill.style.width = '100%';
    timer = setInterval(() => {
        timeLeft--;
        timerFill.style.width = `${(timeLeft/maxTime)*100}%`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNext();
        }
    }, 1000);
}

function select(idx, btn) {
    clearInterval(timer);
    Array.from(choicesEl.children).forEach(b => b.disabled = true);
    const correctIdx = questions[current].a;
    questions[current].userAns = idx;
    if (idx === correctIdx) {
        score++;
        btn.classList.replace('btn-outline-primary', 'btn-success');
    } else {
        btn.classList.replace('btn-outline-primary', 'btn-danger');
        choicesEl.children[correctIdx].classList.replace('btn-outline-primary', 'btn-success');
    }
    nextBtn.disabled = false;
}

function autoNext() {
    questions[current].userAns = null;
    select(-1, document.createElement('div'));
    nextBtn.disabled = false;
}

nextBtn.onclick = () => {
    current++;
    if (current < questions.length) loadQuestion();
    else showReview();
};

lifeline50.onclick = () => {
    const wrongBtns = Array.from(choicesEl.children)
        .filter((b, i) => i !== questions[current].a && !b.disabled);
    wrongBtns.sort(() => Math.random() - 0.5)
        .slice(0, 2).forEach(b => b.disabled = true);
    lifeline50.disabled = true;
};

lifelineSkip.onclick = () => {
    clearInterval(timer);
    nextBtn.disabled = false;
    lifelineSkip.disabled = true;
};

function showReview() {
    quizEl.classList.add('d-none');
    finalScore.textContent = `Vous avez obtenu ${score}/${questions.length}`;
    reviewList.innerHTML = '';
    questions.forEach((q, i) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const user = q.userAns != null ? q.c[q.userAns] : 'Didn\'t answer';
        li.innerHTML = `<strong>Q${i+1}:</strong> ${q.q}<br><em>Your answer:</em> ${user}<br><em>Correct:</em> ${q.c[q.a]}`;
        reviewList.appendChild(li);
    });
    const board = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    board.push({
        date: new Date().toLocaleDateString(),
        score
    });
    board.sort((a, b) => b.score - a.score);
    const top5 = board.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(top5));
    leaderboardEl.innerHTML = '';
    top5.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${entry.date} — ${entry.score}/${questions.length}`;
        leaderboardEl.appendChild(li);
    });
    reviewModal.show();
}

restartBtn.onclick = () => location.reload();
// Grab the toast element & Bootstrap instance
const copyToastEl = document.getElementById('copyToast');
const copyToast = new bootstrap.Toast(copyToastEl);

shareBtn.onclick = () => {
    const text = `I did ${score}/${questions.length} in the quizz !`;
    navigator.clipboard.writeText(text)
        .then(() => {
            // Show the toast
            copyToast.show();
        })
        .catch(err => {
            console.error(err);
            alert("Failed to copy text.");
        });
};