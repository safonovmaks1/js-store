window.addEventListener('DOMContentLoaded', () => {

    const loadContent = async (url, callback) => {
        await fetch(url) // Promise (Обещание)
            .then(response => response.json()) // Promise (Обещание)
            .then(json => createElement(json.goods));

        callback();
    };

    // Функция создания карточки
    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods__wrapper');

        arr.forEach(function (item) {
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
                        <img class="goods__img" src="${item.url}" alt="phone">
                        <div class="goods__colors">Доступно цветов: 4</div>
                        <div class="goods__title">
                            ${item.title}
                        </div>
                        <div class="goods__price">
                            <span>${item.price}</span> руб/шт
                        </div>
                        <button class="goods__btn">Добавить в корзину</button>         
                `;
            goodsWrapper.appendChild(card);
        });
    }

    loadContent('js/db.json', () => {

        const cartWrapper = document.querySelector('.cart__wrapper'),
            cart = document.querySelector('.cart'),
            close = document.querySelector('.cart__close'),
            open = document.querySelector('#cart'),
            goodsBtn = document.querySelectorAll('.goods__btn'),
            products = document.querySelectorAll('.goods__item'),
            confirm = document.querySelector('.confirm'),
            badge = document.querySelector('.nav__badge'),
            totalCost = document.querySelector('.cart__total > span'),
            titles = document.querySelectorAll('.goods__title');

        // модальное окно
        function openCart() {
            cart.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeCart() {
            cart.style.display = 'none';
            document.body.style.overflow = '';
            window.addEventListener('click', (e) => {
                if (e.target == cart) {
                    cart.style.display = 'none';
                }
            });
        }

        open.addEventListener('click', openCart);
        close.addEventListener('click', closeCart);

        /*
            Карточка товара:
                1. клонирование карточки
                2. Удаление кнопки "добавить в корзину"
                3. Добавление крестика закрытия карточки
                4. Добавление карточки в корзину
                5. Удаление надписи "Ваша корзина пуста"     
        */
        goodsBtn.forEach(function (btn, i) {
            btn.addEventListener('click', () => {
                let item = products[i].cloneNode(true), // 1
                    trigger = item.querySelector('button'),
                    removeBtn = document.createElement('div'),
                    empty = cartWrapper.querySelector('.empty');

                trigger.remove(); // 2

                showConfirm();
                calcGoods(1);

                removeBtn.classList.add('goods__item-remove'); // 3
                removeBtn.innerHTML = '&times';
                item.appendChild(removeBtn);

                cartWrapper.appendChild(item); // 4
                if (empty) {
                    // empty.remove();
                    empty.style.display = 'none'; // 5
                }

                calcTotal();
                removeFromCart();
            });
        });

        //! Обрезка заголовков
        function sliceTitle() {
            titles.forEach(function (item) {
                if (item.textContent.length < 65) {
                    return;
                } else {
                    const str = item.textContent.slice(0, 65) + '...';
                    // const str = `${item.textContent.slice(0, 70)} ...`;
                    item.textContent = str;
                }
            });
        }
        sliceTitle();

        // Анимация иконки добавления в корзину товара
        function showConfirm() {
            confirm.style.display = 'block';
            let counter = 100;
            const id = setInterval(frame, 10);

            function frame() {
                if (counter == 10) {
                    clearInterval(id);
                    confirm.style.display = 'none';
                } else {
                    counter--;
                    confirm.style.transform = `translateY(-${counter}px)`;
                    confirm.style.opacity = '.' + counter;
                }
            }
        }

        // Отображение количества товара в корзине на бейдже
        function calcGoods(i) {
            const items = cartWrapper.querySelectorAll('.goods__item');
            badge.textContent = i + items.length;
        }

        // Подсчет общей стоимости
        function calcTotal() {
            const prices = document.querySelectorAll('.cart__wrapper > .goods__item > .goods__price > span'),
                empty = cartWrapper.querySelector('.empty');
            let total = 0;
            prices.forEach(function (item) {
                total += +item.textContent;
            });
            totalCost.textContent = total;
            if (total == 0) {
                empty.style.display = 'block';
            }
        }

        // Удаление карточки из корзины
        function removeFromCart() {
            const removeBtn = cartWrapper.querySelectorAll('.goods__item-remove');
            removeBtn.forEach(function (btn) {
                btn.addEventListener('click', () => {
                    btn.parentElement.remove();
                    calcGoods(0);
                    calcTotal();
                });
            });
        }
    });

});

    // const example = { username: "Max" };

    // fetch('https://jsonplaceholder.typicode.com/posts', 
    //         {
    //             method: "POST",
    //             body: JSON.stringify(example)
    //         }) // Promise (Обещание)
    //     .then(response => response.json()) // Promise (Обещание)
    //     .then(json => console.log(json))