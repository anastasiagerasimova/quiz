//1. Функционал перемещения по карточкам
//2. Проверка на ввод данных
//3. Получение (сбор) данных с карточек
//4. Записывать все веденные данные
//5. Реализовать работу прогресс бара
//6. Подсветка рамки для радио и чекбоксов

// Движение вперед
var btnNext = document.querySelectorAll('[data-nav="next"]');
var answers = {};

btnNext.forEach(function(button){
    button.addEventListener('click', function(){
        this.closest('[data-nav]'); //this ссылается на тот элемент button, по которому произошло событие
        var thisCard = button.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card);

        if(thisCard.dataset.validate == 'novalidate'){;
            navigate('next', thisCard);
            updateProgressBar('next', thisCardNumber);
        } else {
            // При движении вперед сохраняем данные в объект
            saveAnswer(thisCardNumber, gatherCardDate(thisCardNumber));

            // Валидация на заполненость
            if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate('next', thisCard); 
            } else{
                alert('Сделайте ответ, прежде чем переходить далее!') 
            }

            updateProgressBar('next', thisCardNumber);
        
        }
    })
});

// Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener('click', function(){
        this.closest('[data-nav]'); //this ссылается на тот элемент button, по которому произошло событие
        var thisCard = button.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card);
 
        navigate('prev', thisCard);
        updateProgressBar('prev', thisCardNumber);
    })
});

// функция для навигации вперед и назад
function navigate(direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCardNumber;

    if(direction == 'next') {
        nextCardNumber = thisCardNumber + 1;
    } else if(direction == 'prev') {
        nextCardNumber = thisCardNumber - 1;
    }
  
    thisCard.classList.add('hidden');

    document.querySelector(`div[data-card="${nextCardNumber}"]`).classList.remove('hidden');
}

// функция сбора заполненых данных
function gatherCardDate(number) {
    var question;
    var result = [];

    // Находим карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    
    //Находим главный вопрос карточки
    question = currentCard.querySelector('[data-question]').innerText;
  
    // 1. Находим все заполненые значения из радио кнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function(item) {
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 2. Находим все заполненые значения из чекбоксов
    var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item) {
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 3. Находим все заполненые значения из инпутов
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
        var itemValue = item.value;
        if(itemValue.trim() != ""){
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    var data = {
        question: question,
        answer: result
    };

    return data;
}

// функция записи ответов в объект с ответами
function saveAnswer(number, data) {
    answers[number] = data;
}

//Функция поверки на заполненость
function isFilled(number){
    if(answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

//Функция для проверки email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненость required чекбоксов и инпутов с mail
function checkOnRequired(number){
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll('[required]');

    var isValidArray = [];

    requiredFields.forEach(function(item) {
        if(item.type == 'checkbox' && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == 'email') {
            if(validateEmail(item.value)){
                isValidArray.push(true);
            }else{
                isValidArray.push(false);
            }
        }
    });

    if(isValidArray.indexOf(false) == -1){
        return true;
    } else{
        return false;
    }
  
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll('.radio-group').forEach(function(item) {
    item.addEventListener('click', function(e) {
        // Проверяем где произошел клик - внутри label или нет
        var label = e.target.closest('label');

        if(label) {
            // Отменяем активный класс у всех label
            var labels = label.closest('.radio-group').querySelectorAll('label');
            labels.forEach(function(item) {
                item.classList.remove('radio-block--active');
            });
            // Добавляем активный класс к label, по которому был сделан клик
            label.classList.add('radio-block--active');
        }
    });
});

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {
        // Если чекбокс проставлен то
        if (item.checked) {
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            // Если чекбокс не проставлен то
            item.closest('label').classList.remove('checkbox-block--active');
        }
    });
});

// Отображение прогресс бара
function updateProgressBar(direction, number){
    // Расчет всего количества карточек
    var cardsTotalNumber = document.querySelectorAll('[data-card]').length;

    // Текущая карточка
    // Проверка направления перемещения
    if(direction == 'next') {
        number = number + 1;
    } else if (direction == 'prev') {
        number = number - 1;
    }

    // Расчет % прохождения
    var progress = ((number * 100) / cardsTotalNumber).toFixed();

    // Обновляем прогресс бара
    var progressBar = document.querySelector(`[data-card="${number}"]`).querySelector('.progress');
    if(progressBar) {
        // Обновить число прогресс бара
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;

        // Обновить полоску прогресс бара
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%;`;
    }
}
