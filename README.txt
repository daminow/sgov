Структура сайта:
	reset/reset.html - Сбросить данные в хранилище, изменить
	results/results.html - Просмотреть результаты голосования
	index.html - Страница для голосования

1. Для постановки файла на сервер надо добавить адрес сайта перед ссылками.
	Пример: Было (<link rel="stylesheet" href="css/style.css">) Стало(<link rel="stylesheet" href="http://sehriyo.uz/css/style.css">).
	Не надо изменять в файле results.html строку с подключением JavaScript!!

2. Для изменения кандидатов нужно перейти в js/candidates.js, далее изменять по министерствам.
	Структура: {status: false, name: 'Муроджонов Имран', class: '5 "A" класс', vote: 0,photo: ''}.
		status - Не меняется.
		name - Фамилия Имя.
		class - Класс.
		vote - Значение набранных голосов, перед запуском всегда должно быть 0.
		photo - Сюда вставляется ссылка на фотографию, можно использовать для хранения фотографий Discord.
	Министерства:
		candidPrimeLow - Премьер-министр Начальной школы
		candidprimeHigh - Премьер-министр Средней и Старшей школы

		candidMinEduLow - Министр Образования Начальной школы
		candidMinEduHigh - Министр Образования Средней и Старшей школы

		candidMinFinLow - Министр Финансов Начальной школы
		candidMinFinHigh - Министр Финансов Средней и Старшей школы

		candidMinEcoLow - Министр Экологии Начальной школы
		candidMinEcoHigh - Министр Экологии Средней и Старшей школы

		candidMinSportLow - Министр Спорта Начальной школы
		candidMinSportHigh - Министр Спорта Средней и Старшей школы

		candidMinJourLow - Министр СМИ Начальной школы
		candidMinJourHigh - Министр СМИ Средней и Старшей школы

		candidMinCharLow - Глава Благотворительного фонда Начальной школы
		candidMinCharHigh - Глава Благотворительного фонда Средней и Старшей школы

		candidMinAffairLow - Министр Дисциплины Начальной школы 
		candidMinAffairHigh - Министр Дисциплины Средней и Старшей школы

3. Для хранения данных голосования использовано внутреннее хранилище, localStorage. Для того чтобы посмотреть данные в хранилище, нужно зайти в devTools/Приложения/Локальное хранилище.

4. При изменении кандидатов нужно удалить данные в хранилищах устройств, с которых был заход на сайт. Делается через страницу reset.html

5. Переключение между средней и старшей школой происходит на странице reset.html.

