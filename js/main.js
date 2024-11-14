import { massivesVotes } from './candidates.js';
import { createElement, dataToJson, jsonToData, getData, setData } from './data.js';

const presedentBtn = document.getElementById('presedent-btn');
const primeBtn = document.getElementById('prime-btn');
const minEduBtn = document.getElementById('min-edu-btn');
const minFinBtn = document.getElementById('min-fin-btn');
const minEcoBtn = document.getElementById('min-eco-btn');
const minSportBtn = document.getElementById('min-sport-btn');
const minJourBtn = document.getElementById('min-jour-btn');
const minCharBtn = document.getElementById('min-char-btn');
const minAffairBtn = document.getElementById('min-affair-btn');
const candList = document.getElementById('cand-list');

let massivesVote = massivesVotes;
let selectStatus = false;
let openCardStatus = false;
let selectChart = jsonToData(getData('chart')) || '';
let classValue = jsonToData(getData('classValue')) || true;

if (jsonToData(getData('candidates')) === null) {
    setData('candidates', dataToJson(massivesVote));
} else {
    massivesVote = jsonToData(getData('candidates'));
}

if (classValue === false) {
    primeBtn.textContent = 'Премьер-Министр Начальной школы';
} else {
    primeBtn.textContent = 'Премьер-Министр Средней и Старшей школы';
}

function createCard(cand) {
    const card = createElement('li', '', ['candidate-card__item-na']);
    const cardBtn = createElement('button', '', ['candidate-card__btn']);
    const cardPhoto = createElement('img', '', ['candidate-card__photo'], { src: cand.photo || 'default_photo.png' });
    const cardText = createElement('div', '', ['candidate-card__text']);
    const cardTitle = createElement('h2', cand.name, ['candidate-card__title']);
    const cardClass = createElement('h2', cand.class, ['candidate-card__title']);
    card.append(cardBtn);
    cardBtn.append(cardPhoto, cardText);
    cardText.append(cardTitle, cardClass);
    if (cand.status === true) return true;

    cardBtn.onclick = function () {
        if (selectStatus === false && cand.status === false) {
            cand.vote += 1;
            card.classList.remove('candidate-card__item-na');
            card.classList.add('candidate-card__item-active');
            cand.status = true;
            selectStatus = true;
            setData('candidates', dataToJson(massivesVote));
            checkStatusVote(massivesVote);
        }
    };
    return card;
}

function createButtonClickHandler(button, chartType) {
    button.addEventListener('click', () => {
        if (!openCardStatus) {
            selectChart = chartType;
            openCardStatus = true;
            setData('chart', dataToJson(selectChart));
            button.classList.remove('candidate-type__btn-na');
            button.classList.add('candidate-type__btn-active');
            candList.innerHTML = '';
            massivesVote.forEach((voteGroup) => {
                voteGroup.array.forEach(cand => {
                    const candidate = createCard(cand);
                    candList.append(candidate);
                });
            });
        } else {
            alert('Выберите кандидата!');
        }
        setData('candidates', dataToJson(massivesVote));
    });
}

createButtonClickHandler(presedentBtn, 'presedent');
createButtonClickHandler(primeBtn, 'prime');
createButtonClickHandler(minEduBtn, 'minEdu');
createButtonClickHandler(minFinBtn, 'minFin');
createButtonClickHandler(minEcoBtn, 'minEco');
createButtonClickHandler(minSportBtn, 'minSport');
createButtonClickHandler(minJourBtn, 'minJour');
createButtonClickHandler(minCharBtn, 'minChar');
createButtonClickHandler(minAffairBtn, 'minAffair');

function checkStatusVote(obj) {
    let stt = false;
    for (const object of obj) {
        if (object.status === true) {
            const button = document.getElementById(object.buttonOpenId);
            button.style.display = 'none';
            stt = false;
        }
        if (object.status === false) {
            stt = true;
            return;
        }
    }
    if (stt === false) {
        candList.innerHTML = '';
        timerThree();
    }
}

function resetStatuses(obj) {
    obj.forEach(objectt => {
        objectt.status = false;
        const button = document.getElementById(objectt.buttonOpenId);
        button.style.display = 'flex';
        selectChart = '';
        setData('chart', dataToJson(selectChart));
    });
    presedentOn = false;
    primeOn = false;
    minEduOn = false;
    minFinOn = false;
    minEcoOn = false;
    minSportOn = false;
    minJourOn = false;
    minCharOn = false;
    minAffairOn = false;
    [presedentBtn, primeBtn, minEduBtn, minFinBtn, minEcoBtn, minSportBtn, minJourBtn, minCharBtn, minAffairBtn].forEach(btun => {
        btun.classList.add('candidate-type__btn-na');
        btun.classList.remove('candidate-type__btn-active');
    });
    setData('candidates', dataToJson(massivesVote));
}

const timerCont = document.getElementById('timer-container');
const timerTitle = document.getElementById('timer');
let timer = null;

function startTimer(duration, display) {
    let time = duration, minutes, seconds;
    timerCont.classList.remove('opacity-0');
    timerCont.classList.add('opacity-100');
    timer = setInterval(() => {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (--time < 0) {
            clearInterval(timer);
            timerCont.classList.remove('opacity-100');
            timerCont.classList.add('opacity-0');
            timer = null;
            resetStatuses(massivesVote);
        }
    }, 1000);
}

function timerThree() {
    startTimer(75, timerTitle);
}

checkStatusVote(massivesVote);