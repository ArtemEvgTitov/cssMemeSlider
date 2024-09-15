const slider = document.getElementById('slider');
const buttons = document.querySelectorAll('.button');
const memeCaption = document.getElementById('memeCaption');
let memes = [];
let currentMemeIndex = 0;

// Загружаем данные из JSON и активируем первую страницу
fetch('./memes.json')
    .then(response => response.json())
    .then(data => {
        memes = data;
        renderMemes();
        showMeme(0);
        memeCaption.classList.add('active');
        memeCaption.textContent = memes[0].caption;
        buttons.forEach((button, index) => {
            button.classList.toggle('active', index === 0);
        });
    })
    .catch(error => console.error('Ошибка при загрузке JSON:', error));

// Функция для рендера изображений на странице
function renderMemes() {
    memes.forEach((meme, index) => {
        const img = document.createElement('img');
        img.src = meme.image;
        img.alt = `Meme ${index + 1}`;
        img.classList.add('meme-image');
        if (index === 0) img.classList.add('active');
        slider.appendChild(img);
    });
}

// Функция для отображения мема с анимацией и текстом
function showMeme(newIndex) {
    const images = document.querySelectorAll('.meme-image');
    if (newIndex === currentMemeIndex) return;

    // Анимация выхода для текущего изображения
    const currentImage = images[currentMemeIndex];
    currentImage.classList.remove('active');

    // Анимация выхода для текущего текста
    memeCaption.classList.remove('active');
    memeCaption.classList.add(newIndex < currentMemeIndex ? 'slide-out-left' : 'slide-out-right');

    // Появляется новое изображение с анимацией
    const newImage = images[newIndex];
    newImage.classList.add(newIndex > currentMemeIndex ? 'slide-in-right' : 'slide-in-left', 'active');

    // Убираем анимационные классы после завершения анимации изображения
    newImage.addEventListener('transitionend', () => {
        newImage.classList.remove('slide-in-left', 'slide-in-right');
    }, { once: true });

    // Когда анимация текущего текста завершится, показываем новый текст
    memeCaption.addEventListener('transitionend', () => {
        memeCaption.classList.remove('slide-out-left', 'slide-out-right');

        // Обновляем текст подписи и анимацию входа
        memeCaption.textContent = memes[newIndex].caption;
        memeCaption.classList.add(newIndex < currentMemeIndex ? 'slide-in-right' : 'slide-in-left', 'active');

        // Убираем анимационные классы после завершения анимации текста
        memeCaption.addEventListener('transitionend', () => {
            memeCaption.classList.remove('slide-in-left', 'slide-in-right');
        }, { once: true });
    }, { once: true });

    currentMemeIndex = newIndex;

    // Обновляем активную кнопку
    buttons.forEach((button, index) => {
        button.classList.toggle('active', index === newIndex);
    });
}

// Добавляем обработчики событий для кнопок
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        showMeme(index);
    });
});