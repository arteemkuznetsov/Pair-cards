let animationDuration = 1000; // длительность анимации переворота обратно (можно изменять с помощью выбора сложности)
let isBlocked = false;
let files = [
    "avallach.jpg",
    "cirilla.jpg",
    "dandelion.png",
    "eithne.jpg",
    "geralt.jpg",
    "imlerith.jpg",
    "milva.jpg",
    "triss.jpg",
    "yennefer.jpg"
];
let generatedIds = []; // идентификаторы карт
let cardsOnTable = $('#card-container').children(); // карты на столе

function initCards() {
    for (let i = 0; i < cardsOnTable.length; i++) {
        let isPushed = false;
        while (!isPushed) { // цикл выполняется пока не будет сгенерировано уникальное число
            let id = getRandomInt(cardsOnTable.length); // генерируем рандомное число не большее чем количество карт
            if (generatedIds.indexOf(id) === -1) { // если такого числа в массиве нет (число уникально)
                generatedIds.push(id);          // добавляем это число в массив
                isPushed = true;
            }
        }
    }

    let k = 0; // переменная-индекс для движения по generatedIds[]
    for (let i = 0; i < files.length; i++) { // привязываем каждое изображение
        for (let j = 0; j < 2; j++) { // каждое изображение должно повторяться дважды
            // заднюю часть карты, расположенной в случайном месте (текущий элемент generatedIds[]), стилизуем текущим изображением, двигаясь поочередно
            $('.card_face--back:eq(' + generatedIds[k] + ')').css('backgroundImage', 'url(pic/' + files[i] + ')');
            k++;
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); // Math.random() возвращает [0, 1], поэтому умножаем на число-верхнюю границу генерации рандомных чисел
}

function getBackgroundImage(i) {
    return $('.card_face--back:eq(' + i + ')').css('backgroundImage');
}

function showOnStart() {
    /* блокируем клики на карты сразу после инициализации игры */
    isBlocked = true;
    /* через две секунды переворачиваем все карты, демонстрируя их обратную сторону */
    setTimeout(function () {
        for (let i = 0; i < cardsOnTable.length; i++) {
            $('#card' + i).toggleClass('is-flipped');
        }
    }, 2000);
    /* через одну секунду снова переворачиваем карты рубашкой вверх */
    setTimeout(function () {
        for (let i = 0; i < cardsOnTable.length; i++) {
            $('#card' + i).toggleClass('is-flipped');
        }
    }, 1000);
    /* через две секунды (время взято с запасом для переворота карт обратно) разблокируем клики и можем играть */
    setTimeout(function () {
        isBlocked = false;
    }, 2000);
}

function initGame() {
    let cardsOnTableCounter = 18; // счетчик количества карт на столе
    let startTime, endTime; // время начала и окончания игры
    let moves = 0; // количество ходов

    let clickedCardsIDs = []; // выбранная пара карт

    for (let i = 0; i < cardsOnTable.length; i++) { // вешаем на все карты обработчики событий
        let card = $('#card' + i);
        $(document).on('click', '#card' + i, function() {
            if (!isBlocked) {
                card.toggleClass('is-flipped'); // применение к карте класса 'is-flipped' для имитации переворота
                clickedCardsIDs.push(i); // добавляем ID выбранной карты в массив
                moves++;

                if (moves === 1) startTime = new Date().getTime();

                let elem1 = $('.card:eq(' + clickedCardsIDs[0] + ')');
                let elem2 = $('.card:eq(' + clickedCardsIDs[1] + ')');

                if (clickedCardsIDs.length === 2) { // если было выбрано 2 карты
                    /* если у этих двух карт одинаковые картинки сзади */
                    if (getBackgroundImage(clickedCardsIDs[0]) === getBackgroundImage(clickedCardsIDs[1])) {
                        setTimeout(function () { // анимация вращения и исчезания пары карт через 2 секунды
                            elem1.toggleClass('is-rotating');
                            elem2.toggleClass('is-rotating');

                            elem1.toggleClass('is-hidden');
                            elem2.toggleClass('is-hidden')
                        }, 1000);
                        cardsOnTableCounter -= 2;
                        if (cardsOnTableCounter === 0) { // окончание игры, когда карт на столе не осталось
                            endTime = new Date().getTime();
                            let diff = endTime - startTime;
                            let resultTime;
                            diff >= 1000 ? resultTime = Math.trunc(diff / 1000) + " с" : resultTime = Math.trunc(diff) + " мс";

                            $('#time').html('Общее время: ' + resultTime);
                            $('#moves').html('Ходы: ' + moves);

                            /* делаем видимым фон модального окна вместе со всеми его потомками */
                            setTimeout(function () {
                                $('.modal-container:eq(0)').css('opacity', '1');
                            }, 3000);
                        }
                    } else { // если у двух карт разные картинки сзади
                        /* блокируем клики всех карт, чтобы нельзя было быстрыми кликами перевернуть полстола и подсмотреть */
                        isBlocked = true;
                        setTimeout(function () { // анимация переворачивания обратно
                            elem1.toggleClass('is-flipped');
                            elem2.toggleClass('is-flipped');
                            /* снова разрешаем клики */
                            isBlocked = false;
                        }, animationDuration);
                    }
                    clickedCardsIDs.length = 0;
                }
            }
        });
    }

    let isSettingsClicked = false;
    $(document).on('click', '#settings', function() {
        isSettingsClicked = !isSettingsClicked;
        if (isSettingsClicked) {
            $('.modal-container:eq(1)').css('opacity', '1');
            $('.modal-window:eq(1)').css('pointerEvents', 'visible');
        } else {
            $('.modal-container:eq(1)').css('opacity', '0');
            $('.modal-window:eq(1)').css('pointerEvents', 'none');
        }
    });
    $(document).on('click', '#close', function() {
        isSettingsClicked = !isSettingsClicked;
        $('.modal-container:eq(1)').css('opacity', '0');
        $('.modal-window:eq(1)').css('pointerEvents', 'none');
    });

}

initCards();
initGame();
showOnStart();


