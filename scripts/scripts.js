let animationDuration = 1000; // длительность анимации переворота обратно (можно изменять с помощью выбора сложности)
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
let container = document.getElementById('card-container'); // для быстрого доступа к элементу card-container
let cardsOnTable = container.children; // карты на столе

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
            document.getElementsByClassName('card_face--back')[generatedIds[k]].style.backgroundImage = "url(pic/" + files[i] + ")";
            k++;
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); // Math.random() возвращает [0, 1], поэтому умножаем на большее число
}

function getBackgroundImage(i) {
    return document.getElementsByClassName('card_face--back')[i].style.backgroundImage;
}

function initGame() {
    let cardsOnTableCounter = 18; // счетчик количества карт на столе
    let startTime, endTime; // время начала и окончания игры
    let moves = 0; // количество ходов
    let isBlocked = false;

    let clickedCardsIDs = []; // выбранная пара карт

    for (let i = 0; i < cardsOnTable.length; i++) { // вешаем на все карты обработчики событий
        let card = cardsOnTable[i];
        card.onclick = function () {
            if (!isBlocked) {
                card.classList.toggle('is-flipped'); // применение к карте класса 'is-flipped' для имитации переворота
                clickedCardsIDs.push(i); // добавляем ID выбранной карты в массив
                moves++;

                if (moves === 1) startTime = new Date().getTime();

                let elem1 = document.getElementsByClassName("card")[clickedCardsIDs[0]];
                let elem2 = document.getElementsByClassName("card")[clickedCardsIDs[1]];

                if (clickedCardsIDs.length === 2) { // если было выбрано 2 карты
                    /* если у этих двух карт одинаковые картинки сзади */
                    if (getBackgroundImage(clickedCardsIDs[0]) === getBackgroundImage(clickedCardsIDs[1])) {
                        setTimeout(function () { // анимация вращения и исчезания пары карт через 2 секунды
                            elem1.classList.toggle('is-rotating');
                            elem2.classList.toggle('is-rotating');

                            elem1.classList.toggle('is-hidden');
                            elem2.classList.toggle('is-hidden')
                        }, animationDuration);
                        cardsOnTableCounter -= 2;
                        if (cardsOnTableCounter === 0) { // окончание игры, когда карт на столе не осталось
                            endTime = new Date().getTime();
                            let diff = endTime - startTime;
                            let resultTime;
                            diff >= 1000 ? resultTime = diff / 1000 + " с" : resultTime = diff + " мс";

                            document.getElementById('time').innerHTML += resultTime;
                            document.getElementById('moves').innerHTML += moves;

                            /* делаем видимым фон модального окна вместе со всеми его потомками */
                            setTimeout(function () {
                                document.getElementsByClassName('modal-background')[0].style.opacity = "1";
                            }, 3000);
                        }
                    } else { // если у двух карт разные картинки сзади
                        /* блокируем клики всех карт, чтобы нельзя было быстрыми кликами перевернуть полстола и подсмотреть */
                        isBlocked = true;
                        setTimeout(function () { // анимация переворачивания обратно через 1 секунду
                            elem1.classList.toggle('is-flipped');
                            elem2.classList.toggle('is-flipped');
                            /* снова разрешаем клики */
                            isBlocked = false;
                        }, animationDuration);
                    }
                    clickedCardsIDs.length = 0;
                }
            }
        };
    }

    let isSettingsClicked = false;
    document.getElementById('settings').addEventListener('click', function () {
        isSettingsClicked = !isSettingsClicked;
        if (isSettingsClicked) {
            document.getElementsByClassName('modal-background')[1].style.opacity = "1";
            document.getElementsByClassName('modal-window')[1].style.pointerEvents = "visible";
        } else {
            document.getElementsByClassName('modal-background')[1].style.opacity = "0";
            document.getElementsByClassName('modal-window')[1].style.pointerEvents = "none";
        }
    });
    document.getElementById('close').onclick = function () {
        isSettingsClicked = !isSettingsClicked;
        document.getElementsByClassName('modal-background')[1].style.opacity = "0";
        document.getElementsByClassName('modal-window')[1].style.pointerEvents = "none";
    }

}

initCards();
initGame();


