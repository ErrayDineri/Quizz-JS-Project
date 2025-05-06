const questions = [
    { question: "Le Soleil est une étoile.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "La capitale de la France est Paris.", choices: ["Lyon","Marseille","Paris","Nice"], correct: 2 },
    { question: "L'eau gèle à 0°C.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "La tour Eiffel se trouve à Rome.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "Le Python est un langage de programmation.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "La Terre est plate.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "2+2 = 4.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le mont Everest est la plus haute montagne du monde.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le diamant est la substance naturelle la plus dure.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le Nil est le fleuve le plus long du monde.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "L'ADN signifie Acide DésoxyriboNucléique.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le Japon est en Europe.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "La vitesse de la lumière est d'environ 300 000 km/s.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "La banane est un légume.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "Le lion est un mammifère.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Les araignées ont six pattes.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "Le vent est causé par la rotation de la Terre.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Shakespeare a écrit 'Hamlet'.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le plutonium est un gaz.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "Electricité = courant * resistance.", choices: ["Vrai","Faux"], correct: 1 },
    { question: "L'élément chimique Au est l'or.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Les tomates sont des fruits.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le chocolat est fabriqué à partir du cacao.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "Le Sahara est le plus grand désert chaud.", choices: ["Vrai","Faux"], correct: 0 },
    { question: "La Russie est le plus grand pays du monde par superficie.", choices: ["Vrai","Faux"], correct: 0 }
];

let current = 0, score = 0;
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');

function loadQuestion() {
    const q = questions[current];
    questionEl.textContent = q.question;
    choicesEl.innerHTML = '';
    q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c;
    btn.onclick = () => select(i, btn);
    choicesEl.appendChild(btn);
    });
    nextBtn.disabled = true;
    progressEl.textContent = `Question ${current+1}/${questions.length}`;
}

function select(i, btn) {
    const q = questions[current];
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    if (i === q.correct) { score++; btn.classList.add('correct'); }
    else { btn.classList.add('incorrect');
    document.querySelectorAll('.choice-btn')[q.correct].classList.add('correct'); }
    scoreEl.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
}

nextBtn.onclick = () => {
    current++;
    if (current < questions.length) loadQuestion();
    else {
    questionEl.textContent = 'Quiz terminé !';
    choicesEl.innerHTML = '';
    nextBtn.style.display = 'none';
    progressEl.textContent = '';
    }
};

loadQuestion();
