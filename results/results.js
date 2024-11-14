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

let massivesVote = jsonToData(getCandidatesData('candidates'))

const candList = document.getElementById('cand-list')
const presedentBtn = document.getElementById('presedent-btn')
const primeHighBtn = document.getElementById('prime-high-btn')
const primeLowBtn = document.getElementById('prime-low-btn')
const minEduHighBtn = document.getElementById('min-edu-high-btn')
const minEduLowBtn = document.getElementById('min-edu-low-btn')
const minFinHighBtn = document.getElementById('min-fin-high-btn')
const minFinLowBtn = document.getElementById('min-fin-low-btn')
const minEcoHighBtn = document.getElementById('min-eco-high-btn')
const minEcoLowBtn = document.getElementById('min-eco-low-btn')
const minSportHighBtn = document.getElementById('min-sport-high-btn')
const minSportLowBtn = document.getElementById('min-sport-low-btn')
const minJourHighBtn = document.getElementById('min-jour-high-btn')
const minJourLowBtn = document.getElementById('min-jour-low-btn')
const minCharHighBtn = document.getElementById('min-char-high-btn')
const minCharLowBtn = document.getElementById('min-char-low-btn')
const minAffairHighBtn = document.getElementById('min-affair-high-btn')
const minAffairLowBtn = document.getElementById('min-affair-low-btn')

function createCard(cand) {
    let card = createLi('candidate-card__item-na')
    let cardBtn = createBtn('candidate-card__btn')
    let cardPhoto = createImg('candidate-card__photo', cand.photo)
    let cardText = createDiv('candidate-card__text')
    let cardTitle = createH2('candidate-card__title', cand.name)
    let cardClass = createH2('candidate-card__title', `Кол-во голосов: ${cand.vote}`)
    card.append(cardBtn)
    cardBtn.append(cardPhoto, cardText)
    cardText.append(cardTitle, cardClass)
    return card
}

function resetActive() {
    presedentBtn.classList.remove('candidate-type__btn-active')
    primeHighBtn.classList.remove('candidate-type__btn-active')
    primeLowBtn.classList.remove('candidate-type__btn-active')
    minEduHighBtn.classList.remove('candidate-type__btn-active')
    minEduLowBtn.classList.remove('candidate-type__btn-active')
    minFinHighBtn.classList.remove('candidate-type__btn-active')
    minFinLowBtn.classList.remove('candidate-type__btn-active')
    minEcoHighBtn.classList.remove('candidate-type__btn-active')
    minEcoLowBtn.classList.remove('candidate-type__btn-active')
    minSportHighBtn.classList.remove('candidate-type__btn-active')
    minSportLowBtn.classList.remove('candidate-type__btn-active')
    minJourHighBtn.classList.remove('candidate-type__btn-active')
    minJourLowBtn.classList.remove('candidate-type__btn-active')
    minCharHighBtn.classList.remove('candidate-type__btn-active')
    minCharLowBtn.classList.remove('candidate-type__btn-active')
    minAffairHighBtn.classList.remove('candidate-type__btn-active')
    minAffairLowBtn.classList.remove('candidate-type__btn-active')
}

function presedentBtnClick() {
    resetActive()
    presedentBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[0].array) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
presedentBtn.addEventListener('click', (event) => {presedentBtnClick()})


function primeHighBtnClick() {
    resetActive()
    primeHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[1].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
primeHighBtn.addEventListener('click', (event) => {primeHighBtnClick()})

function primeLowBtnClick() {
    resetActive()
    primeLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[1].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
primeLowBtn.addEventListener('click', (event) => {primeLowBtnClick()})

function minEduHighBtnClick() {
    resetActive()
    minEduHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[2].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minEduHighBtn.addEventListener('click', (event) => {minEduHighBtnClick()})

function minEduLowBtnClick() {
    resetActive()
    minEduLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[2].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minEduLowBtn.addEventListener('click', (event) => {minEduLowBtnClick()})

function minFinHighBtnClick() {
    resetActive()
    minFinHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[3].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minFinHighBtn.addEventListener('click', (event) => {minFinHighBtnClick()})

function minFinLowBtnClick() {
    resetActive()
    minFinLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[3].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minFinLowBtn.addEventListener('click', (event) => {minFinLowBtnClick()})

function minEcoHighBtnClick() {
    resetActive()
    minEcoHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[4].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minEcoHighBtn.addEventListener('click', (event) => {minEcoHighBtnClick()})

function minEcoLowBtnClick() {
    resetActive()
    minEcoLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[4].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minEcoLowBtn.addEventListener('click', (event) => {minEcoLowBtnClick()})

function minSportHighBtnClick() {
    resetActive()
    minSportHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[5].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minSportHighBtn.addEventListener('click', (event) => {minSportHighBtnClick()})

function minSportLowBtnClick() {
    resetActive()
    minSportLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[5].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minSportLowBtn.addEventListener('click', (event) => {minSportLowBtnClick()})

function minJourHighBtnClick() {
    resetActive()
    minJourHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[6].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minJourHighBtn.addEventListener('click', (event) => {minJourHighBtnClick()})

function minJourLowBtnClick() {
    resetActive()
    minJourLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[6].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minJourLowBtn.addEventListener('click', (event) => {minJourLowBtnClick()})

function minCharHighBtnClick() {
    resetActive()
    minCharHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[7].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minCharHighBtn.addEventListener('click', (event) => {minCharHighBtnClick()})

function minCharLowBtnClick() {
    resetActive()
    minCharLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[7].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minCharLowBtn.addEventListener('click', (event) => {minCharLowBtnClick()})



function minAffairHighBtnClick() {
    resetActive()
    minAffairHighBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[8].arrayHigh) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minAffairHighBtn.addEventListener('click', (event) => {minAffairHighBtnClick()})


function minAffairLowBtnClick() {
    resetActive()
    minAffairLowBtn.classList.add('candidate-type__btn-active')
    candList.innerHTML = ''
    for (const cand of massivesVote[8].arrayLow) {
        let candidate = createCard(cand)
        candList.append(candidate)
    }
}
minAffairLowBtn.addEventListener('click', (event) => {minAffairLowBtnClick()})
