let animationDuration = 1000; // длительность анимации (в дальнейшем можно будет изменять с помощью выбора сложности)
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
let cards = container.children; // карты на столе

function initCards() {
    for (let i = 0; i < cards.length; i++) {
        let isPushed = false;
        while (!isPushed) { // цикл выполняется пока не будет сгенерировано уникальное число
            let id = getRandomInt(cards.length); // генерируем рандомное число не большее чем количество карт
            if (generatedIds.indexOf(id) === -1) { // если такого числа в массиве нет (число уникально)
                generatedIds.push(id);          // добавляем это число в массив
                isPushed = true;
            }
        }
    }

    let k = 0; // переменная-индекс для движения по generatedIds[]
    for (let i = 0; i < files.length; i++) { // привязываем каждое изображение к двум картам
        for (let j = 0; j < 2; j++) { // каждое изображение должно повторяться дважды
            document.getElementsByClassName('card_face--back')[generatedIds[k]].style.backgroundImage = "url(pic/" + files[i] + ")";
            k++;
        } // заднюю часть карты, расположенной в случайном месте (текущий элемент generatedIds[]), стилизуем текущим изображением, двигаясь поочередно
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); // Math.random() возвращает [0, 1], поэтому умножаем на большее число
}

function getBackgroundImage(i) {
    return document.getElementsByClassName('card_face--back')[i].style.backgroundImage;
}

function initGame() {
    let cardsOnTable = 18; // счетчик количества карт на столе
    let startTime, endTime; // время начала и окончания игры
    let moves = 0; // количество ходов

    let clickedCardsIDs = []; // выбранная пара карт

    for (let i = 0; i < cards.length; i++) { // вешаем на все карты обработчики событий
        let card = container.children[i];
        card.addEventListener('click', function () {
            card.classList.toggle('is-flipped'); // применение к карте класса 'is-flipped' для имитации переворота
            clickedCardsIDs.push(i); // добавляем ID выбранной карты в массив
            moves++;

            if (moves === 1) startTime = new Date().getTime();

            let elem1 = document.getElementsByClassName("card")[clickedCardsIDs[0]]; // для быстрого доступа к элементам
            let elem2 = document.getElementsByClassName("card")[clickedCardsIDs[1]];

            if (clickedCardsIDs.length === 2) { // если было выбрано 2 карты
                if (getBackgroundImage(clickedCardsIDs[0]) === getBackgroundImage(clickedCardsIDs[1])) { // если у этих двух карт одинаковые картинки сзади
                    setTimeout(function() { // анимация вращения и исчезания пары карт через 1 секунду
                        elem1.classList.toggle('is-rotating');
                        elem2.classList.toggle('is-rotating');

                        elem1.classList.toggle('is-hidden');
                        elem2.classList.toggle('is-hidden')
                    }, animationDuration);
                    cardsOnTable -= 2;
                    if (cardsOnTable === 0) {
                        endTime = new Date().getTime();
                        let dif = endTime - startTime;
                        let resultTime;
                        dif >= 1000 ? resultTime = dif / 1000 + " с" : resultTime = dif + " мс";

                        document.getElementById('time').innerHTML += resultTime;
                        document.getElementById('moves').innerHTML += moves;

                        setTimeout(function() {
                            document.getElementsByClassName('modal-background')[0].style.opacity = "1";
                        }, 3000);
                    }
                }
                else { // если у двух карт разные картинки сзади
                    setTimeout(function() { // анимация переворачивания обратно через 1 секунду
                        elem1.classList.toggle('is-flipped');
                        elem2.classList.toggle('is-flipped');
                    }, animationDuration);
                }
                clickedCardsIDs.length = 0;
            }
        });
    }

    let isSettingsClicked = false;
    document.getElementById('settings').addEventListener('click', function () {
        isSettingsClicked = !isSettingsClicked;
        if (isSettingsClicked) {
            document.getElementsByClassName('modal-background')[1].style.opacity = "1";
            document.getElementsByClassName('modal-window')[1].style.pointerEvents = "visible";
        }
        else {
            document.getElementsByClassName('modal-background')[1].style.opacity = "0";
            document.getElementsByClassName('modal-window')[1].style.pointerEvents = "none";
        }
    });

}

initCards();
initGame();


