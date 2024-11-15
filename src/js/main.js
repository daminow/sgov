import { massivesVotes } from './candidates.js';
import { createElement, dataToJson, jsonToData, getData, setData } from './data.js';

// Constants
let CANDIDATE_TYPES = {
    PRESIDENT: 'presedent',
    PRIME: 'prime',
    MIN_EDU: 'minEdu',
    MIN_FIN: 'minFin',
    MIN_ECO: 'minEco',
    MIN_SPORT: 'minSport',
    MIN_JOUR: 'minJour',
    MIN_CHAR: 'minChar',
    MIN_AFFAIRS: 'minAffair'
};

const BUTTON_IDS = {
    PRESIDENT: 'presedent-btn',
    PRIME: 'prime-btn',
    MIN_EDU: 'min-edu-btn',
    MIN_FIN: 'min-fin-btn',
    MIN_ECO: 'min-eco-btn',
    MIN_SPORT: 'min-sport-btn',
    MIN_JOUR: 'min-jour-btn',
    MIN_CHAR: 'min-char-btn',
    MIN_AFFAIRS: 'min-affair-btn'
};

// DOM Elements
const candList = document.getElementById('cand-list');
const buttons = Object.keys(BUTTON_IDS).reduce((acc, key) => {
    acc[key] = document.getElementById(BUTTON_IDS[key]);
    return acc;
}, {});

let selectStatus = false;
let openCardStatus = false;
let massivesVote = massivesVotes;

// DOM Elements for session code
const sessionCodeInput = document.getElementById('session-code');
const submitSessionCodeButton = document.getElementById('submit-session-code');
const sessionError = document.getElementById('session-error');

// Helper Functions
function safeJsonParse(data) {
    try {
        return jsonToData(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

function setCandidatesData(name, data) {
    setData(name, dataToJson(data));
}

function createCard(cand) {
    const card = createElement('li', '', ['candidate-card__item-na']);
    const cardBtn = createElement('button', '', ['candidate-card__btn']);
    const cardPhoto = createElement('img', '', ['candidate-card__photo'], { src: cand.photo });
    const cardText = createElement('div', '', ['candidate-card__text']);
    const cardTitle = createElement('h2', cand.name, ['candidate-card__title']);
    const cardClass = createElement('h2', cand.class, ['candidate-card__title']);

    cardText.append(cardTitle, cardClass);
    cardBtn.append(cardPhoto, cardText);
    card.append(cardBtn);

    cardBtn.onclick = function () {
        handleCardClick(cand, card);
    };

    return card;
}

function handleCardClick(cand, card) {
    if (!selectStatus && !cand.status) {
        cand.vote += 1;
        card.classList.replace('candidate-card__item-na', 'candidate-card__item-active');
        cand.status = true;
        selectStatus = true;
        setData('chart', dataToJson(''));

        updateButtonVisibility(cand);
        checkStatusVote(massivesVote);
    }
}

function updateButtonVisibility(cand) {
    const buttonMap = {
        [CANDIDATE_TYPES.PRESIDENT]: buttons.PRESIDENT,
        [CANDIDATE_TYPES.PRIME]: buttons.PRIME,
        [CANDIDATE_TYPES.MIN_EDU]: buttons.MIN_EDU,
        [CANDIDATE_TYPES.MIN_FIN]: buttons.MIN_FIN,
        [CANDIDATE_TYPES.MIN_ECO]: buttons.MIN_ECO,
        [CANDIDATE_TYPES.MIN_SPORT]: buttons.MIN_SPORT,
        [CANDIDATE_TYPES.MIN_JOUR]: buttons.MIN_JOUR,
        [CANDIDATE_TYPES.MIN_CHAR]: buttons.MIN_CHAR,
        [CANDIDATE_TYPES.MIN_AFFAIRS]: buttons.MIN_AFFAIRS
    };

    if (buttonMap[selectChart]) {
        buttonMap[selectChart].style.display = 'none';
        massivesVote.find(vote => vote.name === selectChart).status = true;
        setData('candidates', dataToJson(massivesVote));
    }
}

// Button Click Handlers
function handleButtonClick(chartType) {
    return function () {
        if (!openCardStatus) {
            selectChart = chartType;
            openCardStatus = true;
            setData('chart', dataToJson(selectChart));
            this.classList.replace('candidate-type__btn-na', 'candidate-type__btn-active');
            candList.innerHTML = '';

            const candidates = classValue ? massivesVote[1].arrayHigh : massivesVote[1].arrayLow;
            candidates.forEach(cand => {
                const candidateCard = createCard(cand);
                candList.append(candidateCard);
            });
        } else {
            alert('Выберите кандидата!');
        }
        setData('candidates', dataToJson(massivesVote));
    };
}

// Function to handle session code submission
async function handleSessionCodeSubmission() {
    const sessionCode = sessionCodeInput.value;

    try {
        const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: sessionCode }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            sessionError.textContent = errorData.message || 'Ошибка при вводе кода сессии';
            return;
        }

        const sessionData = await response.json();
        localStorage.setItem('sessionId', sessionData.id);
        localStorage.setItem('sessionType', sessionData.type);
        // Load nominations based on session type
        loadNominations(sessionData.type);
    } catch (error) {
        console.error('Error submitting session code:', error);
        sessionError.textContent = 'Ошибка сети. Попробуйте еще раз.';
    }
}

// Event listener for session code submission
submitSessionCodeButton.addEventListener('click', handleSessionCodeSubmission);

// Event Listeners
buttons.PRESIDENT.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.PRESIDENT));
buttons.PRIME.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.PRIME));
buttons.MIN_EDU.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_EDU));
buttons.MIN_FIN.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_FIN));
buttons.MIN_ECO.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_ECO));
buttons.MIN_SPORT.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_SPORT));
buttons.MIN_JOUR.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_JOUR));
buttons.MIN_CHAR.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_CHAR));
buttons.MIN_AFFAIRS.addEventListener('click', handleButtonClick(CANDIDATE_TYPES.MIN_AFFAIRS));

// Initial State Check
const initialChart = getData('chart');
if (initialChart) {
    handleButtonClick(initialChart)();
}

checkStatusVote(massivesVote);
addEventListener('DOMContentLoaded', (event) => { });