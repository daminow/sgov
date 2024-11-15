import { massivesVotes } from './candidates.js';
import { createElement, dataToJson, jsonToData, getData, setData } from './data.js'

function createDiv(classList) {
    let div = document.createElement('div')
    div.classList.add(classList)
    return div
}

function createLi(classList) {
    let li = document.createElement('li')
    li.classList.add(classList)
    return li
}

function createH2(classList, text) {
    let h2 = document.createElement('h2')
    h2.textContent = text
    h2.classList.add(classList)
    return h2
}

function createP(classList, text) {
    let p = document.createElement('p')
    p.textContent = text
    p.classList.add(classList)
    return p
}

function createBtn(classList, text) {
    let btn = document.createElement('button')
    btn.textContent = text
    btn.classList.add('btn-reset')
    btn.classList.add(classList)
    return btn
}

function createImg(classList, src) {
    let img = document.createElement('img')
    img.src = src
    img.classList.add(classList)
    return img
}

function dataToJson(data) {
    return JSON.stringify(data)
}

function jsonToData(data) {
    return JSON.parse(data)
}

function getCandidatesData(name) {
    return localStorage.getItem(name)
}

function setCandidatesData(name, data) {
    localStorage.setItem(name, data)
}

let selectStatus = false
let openCardStatus = false

const presedentBtn = document.getElementById('presedent-btn')
const primeBtn = document.getElementById('prime-btn')
const minEduBtn = document.getElementById('min-edu-btn')
const minFinBtn = document.getElementById('min-fin-btn')
const minEcoBtn = document.getElementById('min-eco-btn')
const minSportBtn = document.getElementById('min-sport-btn')
const minJourBtn = document.getElementById('min-jour-btn')
const minCharBtn = document.getElementById('min-char-btn')
const minAffairBtn = document.getElementById('min-affair-btn')

let massivesVote = massivesVotes


let selectChart = ''
if (jsonToData(getCandidatesData('chart')) != null) {
    selectChart = jsonToData(getCandidatesData('chart'))
} else {
    setCandidatesData('chart', dataToJson(selectChart))
}
let jfhghfk = jsonToData(getCandidatesData('candidates'))
if (jfhghfk === null) {
    setCandidatesData('candidates', dataToJson(massivesVote))
} else { massivesVote = jsonToData(getCandidatesData('candidates')) }
// false - Начальная школа
// true - Средняя школа
let classValue = true
if (jsonToData(getCandidatesData('classValue')) === true || jsonToData(getCandidatesData('classValue')) === false) {
    classValue = jsonToData(getCandidatesData('classValue'))
} else {
    setCandidatesData('classValue', dataToJson(classValue))
}
if (classValue === false) {
    document.getElementById('prime-btn').textContent = 'Премьер-Министр Начальной школы'
}
if (classValue === true) {
    document.getElementById('prime-btn').textContent = 'Премьер-Министр Средней и Старшей школы'
}

function createCard(cand) {
    let card = createLi('candidate-card__item-na')
    let cardBtn = createBtn('candidate-card__btn')
    let cardPhoto = createImg('candidate-card__photo', cand.photo)
    let cardText = createDiv('candidate-card__text')
    let cardTitle = createH2('candidate-card__title', cand.name)
    let cardClass = createH2('candidate-card__title', cand.class)
    card.append(cardBtn)
    cardBtn.append(cardPhoto, cardText)
    cardText.append(cardTitle, cardClass)
    if (cand.status === true) {
        return true
    }
    cardBtn.onclick = function () {
        if (selectStatus === false) {
            if (cand.status === false) {
                cand.vote += 1
                card.classList.remove('candidate-card__item-na')
                card.classList.add('candidate-card__item-active')
                setCandidatesData('chart', dataToJson(''))
                cand.status = true
                selectStatus = true
                if (selectChart === 'presedent') {
                    if (presedentOn === true) {
                        presedentBtn.style.display = 'none'
                        massivesVote[0].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'prime') {
                    if (primeOn === true) {
                        primeBtn.style.display = 'none'
                        massivesVote[1].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minEdu') {
                    if (minEduOn === true) {
                        minEduBtn.style.display = 'none'
                        massivesVote[2].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minFin') {
                    if (minFinOn === true) {
                        minFinBtn.style.display = 'none'
                        massivesVote[3].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minEco') {
                    if (minEcoOn === true) {
                        minEcoBtn.style.display = 'none'
                        massivesVote[4].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minSport') {
                    if (minSportOn === true) {
                        minSportBtn.style.display = 'none'
                        massivesVote[5].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minJour') {
                    if (minJourOn === true) {
                        minJourBtn.style.display = 'none'
                        massivesVote[6].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minChar') {
                    if (minCharOn === true) {
                        minCharBtn.style.display = 'none'
                        massivesVote[7].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                if (selectChart === 'minAffair') {
                    if (minAffairOn === true) {
                        minAffairBtn.style.display = 'none'
                        massivesVote[8].status = true
                        setCandidatesData('candidates', dataToJson(massivesVote))
                    }
                }
                openCardStatus = false
                checkStatusVote(massivesVote)
            }
        }
    }
    return card
}

const candList = document.getElementById('cand-list')


let presedentOn = false
function presedentBtnClick() {
    if (presedentOn === false && openCardStatus === false) {
        selectChart = 'presedent'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        presedentBtn.classList.remove('candidate-type__btn-na')
        presedentBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        for (const cand of massivesVote[0].array) {
            let candidate = createCard(cand)
            candList.append(candidate)
            presedentOn = true
            if (candidate === true) {
                presedentBtn.style.display = 'none'
                massivesVote[0].status = true
                candList.innerHTML = ''
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
presedentBtn.addEventListener('click', (event) => { selectStatus = false; presedentBtnClick() })


let primeOn = false
function primeBtnClick() {
    if (primeOn === false && openCardStatus === false) {
        selectChart = 'prime'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        primeBtn.classList.remove('candidate-type__btn-na')
        primeBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[1].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                primeOn = true
                if (candidate === true) {
                    primeBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[1].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                primeOn = true
                if (candidate === true) {
                    primeBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
primeBtn.addEventListener('click', (event) => { selectStatus = false; primeBtnClick() })


let minEduOn = false
function minEduBtnClick() {
    if (minEduOn === false && openCardStatus === false) {
        selectChart = 'minEdu'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minEduBtn.classList.remove('candidate-type__btn-na')
        minEduBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[2].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minEduOn = true
                if (candidate === true) {
                    minEduBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[2].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minEduOn = true
                if (candidate === true) {
                    minEduBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minEduBtn.addEventListener('click', (event) => { selectStatus = false; minEduBtnClick() })


let minFinOn = false
function minFinBtnClick() {
    if (minFinOn === false && openCardStatus === false) {
        selectChart = 'minFin'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minFinBtn.classList.remove('candidate-type__btn-na')
        minFinBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[3].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minFinOn = true
                if (candidate === true) {
                    minFinBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[3].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minFinOn = true
                if (candidate === true) {
                    minFinBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minFinBtn.addEventListener('click', (event) => { selectStatus = false; minFinBtnClick() })


let minEcoOn = false
function minEcoBtnClick() {
    if (minEcoOn === false && openCardStatus === false) {
        selectChart = 'minEco'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minEcoBtn.classList.remove('candidate-type__btn-na')
        minEcoBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[4].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minEcoOn = true
                if (candidate === true) {
                    minEcoBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[4].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minEcoOn = true
                if (candidate === true) {
                    minEcoBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minEcoBtn.addEventListener('click', (event) => { selectStatus = false; minEcoBtnClick() })


let minSportOn = false
function minSportBtnClick() {
    if (minSportOn === false && openCardStatus === false) {
        selectChart = 'minSport'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minSportBtn.classList.remove('candidate-type__btn-na')
        minSportBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[5].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minSportOn = true
                if (candidate === true) {
                    minSportBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[5].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minSportOn = true
                if (candidate === true) {
                    minSportBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minSportBtn.addEventListener('click', (event) => { selectStatus = false; minSportBtnClick() })


let minJourOn = false
function minJourBtnClick() {
    if (minJourOn === false && openCardStatus === false) {
        selectChart = 'minJour'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minJourBtn.classList.remove('candidate-type__btn-na')
        minJourBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[6].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minJourOn = true
                if (candidate === true) {
                    minJourBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[6].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minJourOn = true
                if (candidate === true) {
                    minJourBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minJourBtn.addEventListener('click', (event) => { selectStatus = false; minJourBtnClick() })


let minCharOn = false
function minCharBtnClick() {
    if (minCharOn === false && openCardStatus === false) {
        selectChart = 'minChar'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minCharBtn.classList.remove('candidate-type__btn-na')
        minCharBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[7].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minCharOn = true
                if (candidate === true) {
                    minCharBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[7].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minCharOn = true
                if (candidate === true) {
                    minCharBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minCharBtn.addEventListener('click', (event) => { selectStatus = false; minCharBtnClick() })


let minAffairOn = false
function minAffairBtnClick() {
    if (minAffairOn === false && openCardStatus === false) {
        selectChart = 'minAffair'
        openCardStatus = true
        setCandidatesData('chart', dataToJson(selectChart))
        minAffairBtn.classList.remove('candidate-type__btn-na')
        minAffairBtn.classList.add('candidate-type__btn-active')
        candList.innerHTML = ''
        if (classValue === false) {
            for (const cand of massivesVote[8].arrayLow) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minAffairOn = true
                if (candidate === true) {
                    minAffairBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
        if (classValue === true) {
            for (const cand of massivesVote[8].arrayHigh) {
                let candidate = createCard(cand)
                candList.append(candidate)
                minAffairOn = true
                if (candidate === true) {
                    minAffairBtn.style.display = 'none'
                    candList.innerHTML = ''
                }
            }
        }
    } else {
        alert('Выберите кандидата!')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
minAffairBtn.addEventListener('click', (event) => { selectStatus = false; minAffairBtnClick() })


if (selectChart === 'presedent') {
    presedentBtnClick()
}
if (selectChart === 'prime') {
    primeBtnClick()
}
if (selectChart === 'minEdu') {
    minEduBtnClick()
}
if (selectChart === 'minFin') {
    minFinBtnClick()
}
if (selectChart === 'minEco') {
    minEcoBtnClick()
}
if (selectChart === 'minSport') {
    minSportBtnClick()
}
if (selectChart === 'minJour') {
    minJourBtnClick()
}
if (selectChart === 'minChar') {
    minCharBtnClick()
}
if (selectChart === 'minAffair') {
    minAffairBtnClick()
}

function checkStatusVote(obj) {
    let stt = false
    for (const object of obj) {
        if (object.status === true) {
            let btn = object.buttonOpenId
            const button = document.getElementById(btn)
            button.style.display = 'none'
            stt = false
        }
        if (object.status === false) {
            stt = true
            return
        }
    }
    if (stt === false) {
        candList.innerHTML = ''
        timerThree()
    }
}

let nhfvgrdbn = 0

function resetStatuses(obj) {
    nhfvgrdbn += 1
    for (let objectt of obj) {
        objectt.status = false
        if (objectt.buttonOpenId != 'presedent-btn') {
            for (const user of objectt.arrayLow) {
                user.status = false
            }
            for (const user of objectt.arrayHigh) {
                user.status = false
            }
        }
        else {
            for (const user of objectt.array) {
                user.status = false
            }
        }
        let btn = objectt.buttonOpenId
        const button = document.getElementById(btn)
        button.style.display = 'flex'
        selectChart = ''
        setCandidatesData('chart', dataToJson(selectChart))
    }
    presedentOn = false
    primeOn = false
    minEduOn = false
    minFinOn = false
    minEcoOn = false
    minSportOn = false
    minJourOn = false
    minCharOn = false
    minAffairOn = false
    let openButtons = [
        presedentBtn,
        primeBtn,
        minEduBtn,
        minFinBtn,
        minEcoBtn,
        minSportBtn,
        minJourBtn,
        minCharBtn,
        minAffairBtn
    ]
    for (const btun of openButtons) {
        btun.classList.add('candidate-type__btn-na')
        btun.classList.remove('candidate-type__btn-active')
    }
    setCandidatesData('candidates', dataToJson(massivesVote))
}
const timerCont = document.getElementById('timer-container')
const timerTitle = document.getElementById('timer')
let timer = null

function startTimer(duration, display) {
    let time = duration, minutes, seconds;
    time = null
    time = duration, minutes, seconds;
    timerCont.classList.remove('opacity-0')
    timerCont.classList.add('opacity-100')
    timer = setInterval(function () {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (--time < 0) {
            time = duration;
            clearInterval(timer);
            timerCont.classList.remove('opacity-100')
            timerCont.classList.add('opacity-0')
            timer = null
            resetStatuses(massivesVote)
        }
    }, 1000);
}

function timerThree() {
    let threeMinutes = 75
    startTimer(threeMinutes, timerTitle);
};

checkStatusVote(massivesVote)

addEventListener('DOMContentLoaded', (event) => {
})