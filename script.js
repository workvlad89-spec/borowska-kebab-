// animations.js — добавляет плавное появление секций и карточек при прокрутке
// Подключить в index.html ПОСЛЕ script.js: <script src="animations.js"></script>

document.addEventListener('DOMContentLoaded', function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    // Секции целиком
    document.querySelectorAll('.about, .promo-section, .menu-section, .sauces-section, .final-cta')
        .forEach(function (el) { observer.observe(el); });

    // Карточки меню — с небольшой задержкой друг за другом
    document.querySelectorAll('.menu-card').forEach(function (card, i) {
        card.style.transitionDelay = (i % 6) * 0.06 + 's';
        observer.observe(card);
    });

    // Небольшая "подпрыгивающая" анимация иконки корзины при добавлении товара
    var cartButton = document.getElementById('cartButton');
    var cartCount = document.getElementById('cartCount');
    if (cartButton && cartCount) {
        var lastCount = cartCount.textContent;
        var countObserver = new MutationObserver(function () {
            if (cartCount.textContent !== lastCount) {
                lastCount = cartCount.textContent;
                cartButton.classList.remove('bump');
                void cartButton.offsetWidth; // reflow, чтобы анимация перезапустилась
                cartButton.classList.add('bump');
            }
        });
        countObserver.observe(cartCount, { childList: true, characterData: true, subtree: true });
    }
});
