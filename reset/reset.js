function setCandidatesData(name, data) {
    localStorage.setItem(name, data)
}

function dataToJson(data) {
    return JSON.stringify(data)
}

// false - Начальная школа
// true - Средняя школа
let classValue = true
const changeTitle = document.getElementById('change-status')
const btnToLow = document.getElementById('change-to-low')
const btnToHigh = document.getElementById('change-to-high')
const deleteLocal = document.getElementById('reset-local')

btnToHigh.onclick = function changeToHight() {
    classValue = true
    changeTitle.textContent = 'Установлена Старшая школа'
    setCandidatesData('classValue', dataToJson(classValue))
}

btnToLow.onclick = function changeToLow() {
    classValue = false
    changeTitle.textContent = 'Установлена Младшая школа'
    setCandidatesData('classValue', dataToJson(classValue))
}

deleteLocal.onclick = function deleteLocalSt() {
    localStorage.clear();
    changeTitle.textContent = 'Данные удалены'
    setCandidatesData('classValue', dataToJson(classValue))
}