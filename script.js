const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
});


/* =========================
   MOBILE MENU
========================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileNav = document.getElementById("mobileNav");
const mobileClose = document.getElementById("mobileClose");

function closeMobileMenu() {
    mobileNav.classList.remove("open");
    document.body.style.overflow = "";
}

mobileMenuButton.addEventListener("click", () => {
    mobileNav.classList.add("open");
    document.body.style.overflow = "hidden";
});

mobileClose.addEventListener("click", closeMobileMenu);

mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});


/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            const offset = 80;
            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });
        }
    });
});


/* =========================
   CATEGORY FILTER
========================= */

const categoryTabs = document.querySelectorAll(".category-tab");
const menuCategories = document.querySelectorAll(".menu-category");
const menuCards = document.querySelectorAll(".menu-card");
const smallCards = document.querySelectorAll(".small-menu-card");
const drinkCards = document.querySelectorAll(".drink-card");

categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {

        categoryTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const filter = tab.dataset.filter;

        menuCategories.forEach(category => {

            const categoryType = category.dataset.category;

            if (filter === "all") {
                category.style.display = "";
                return;
            }

            category.style.display =
                categoryType === filter ? "" : "none";
        });

        menuCards.forEach(card => {
            if (filter === "all") {
                card.classList.remove("hidden-by-filter");
            } else {
                card.classList.toggle(
                    "hidden-by-filter",
                    card.dataset.category !== filter
                );
            }
        });

        smallCards.forEach(card => {
            if (filter === "all") {
                card.classList.remove("hidden-by-filter");
            } else {
                card.classList.toggle(
                    "hidden-by-filter",
                    card.dataset.category !== filter
                );
            }
        });

        drinkCards.forEach(card => {
            if (filter === "all") {
                card.classList.remove("hidden-by-filter");
            } else {
                card.classList.toggle(
                    "hidden-by-filter",
                    card.dataset.category !== filter
                );
            }
        });
    });
});


/* =========================
   PRODUCT MODAL
========================= */

const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");

const modalProductName = document.getElementById("modalProductName");
const modalProductDescription =
    document.getElementById("modalProductDescription");

const modalTotal = document.getElementById("modalTotal");

const meatGroup = document.getElementById("meatGroup");

const quantityMinus = document.getElementById("quantityMinus");
const quantityPlus = document.getElementById("quantityPlus");
const quantityValue = document.getElementById("quantityValue");

const addToCartButton = document.getElementById("addToCart");

let currentProduct = {
    name: "",
    price: 0,
    description: ""
};

let quantity = 1;

let selectedMeat = "Kurczak";
let selectedSauce = "Czosnkowy";


function openProductModal(product) {

    currentProduct = {
        name: product.name,
        price: Number(product.price),
        description: product.description || ""
    };

    quantity = 1;

    quantityValue.textContent = quantity;

    modalProductName.textContent = currentProduct.name;
    modalProductDescription.textContent = currentProduct.description;

    document.querySelectorAll(".addon input").forEach(input => {
        input.checked = false;
    });

    document.querySelectorAll(".option").forEach(option => {
        option.classList.remove("active");
    });

    const firstMeat = document.querySelector(
        "#meatGroup .option"
    );

    const firstSauce = document.querySelector(
        ".option-group:nth-of-type(2) .option"
    );

    if (firstMeat) {
        firstMeat.classList.add("active");
        selectedMeat = firstMeat.dataset.option;
    }

    const firstSauceButton =
        document.querySelectorAll(".option")[3];

    if (firstSauceButton) {
        firstSauceButton.classList.add("active");
        selectedSauce = firstSauceButton.dataset.option;
    }

    const noMeatProducts = [
        "Knysza falafel",
        "Tortilla falafel",
        "Zestaw falafel",
        "Zestaw smażony ser",
        "Zestaw filet mintaja",
        "Sałatka grecka",
        "Frytki",
        "Sos",
        "Falafel",
        "Woda niegazowana",
        "Woda gazowana",
        "Ayran 0,33 l",
        "Coca-Cola",
        "Pepsi",
        "Mirinda",
        "Sok mango"
    ];

    meatGroup.style.display =
        noMeatProducts.includes(currentProduct.name)
            ? "none"
            : "";

    updateModalPrice();

    productModal.classList.add("open");
    document.body.classList.add("modal-open");
}


function closeProductModal() {
    productModal.classList.remove("open");
    document.body.classList.remove("modal-open");
}

modalClose.addEventListener("click", closeProductModal);

productModal.addEventListener("click", event => {
    if (event.target === productModal) {
        closeProductModal();
    }
});


/* =========================
   PRODUCT BUTTONS
========================= */

document.querySelectorAll(".menu-card").forEach(card => {

    const button = card.querySelector(".order-btn");

    button.addEventListener("click", () => {
        openProductModal({
            name: card.dataset.product,
            price: card.dataset.price,
            description: card.dataset.description
        });
    });
});


document.querySelectorAll(".quick-add").forEach(button => {

    button.addEventListener("click", () => {
        openProductModal({
            name: button.dataset.product,
            price: button.dataset.price,
            description: button.dataset.description
        });
    });
});


document.querySelectorAll(
    ".small-menu-card, .drink-card"
).forEach(card => {

    const button =
        card.querySelector(".small-add") ||
        card.querySelector(".drink-add");

    button.addEventListener("click", () => {
        openProductModal({
            name: card.dataset.product,
            price: card.dataset.price,
            description: card.dataset.description
        });
    });
});


/* =========================
   MODAL OPTIONS
========================= */

document.querySelectorAll(".option").forEach(option => {

    option.addEventListener("click", () => {

        const group = option.closest(".option-group");

        group.querySelectorAll(".option").forEach(item => {
            item.classList.remove("active");
        });

        option.classList.add("active");

        if (group.id === "meatGroup") {
            selectedMeat = option.dataset.option;
        } else {
            selectedSauce = option.dataset.option;
        }
    });
});


/* =========================
   QUANTITY
========================= */

quantityMinus.addEventListener("click", () => {

    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
        updateModalPrice();
    }
});


quantityPlus.addEventListener("click", () => {

    if (quantity < 20) {
        quantity++;
        quantityValue.textContent = quantity;
        updateModalPrice();
    }
});


/* =========================
   MODAL PRICE
========================= */

function getAddonTotal() {

    let total = 0;

    document.querySelectorAll(".addon input:checked").forEach(input => {
        total += Number(input.dataset.price);
    });

    return total;
}


function getSingleProductPrice() {
    return currentProduct.price + getAddonTotal();
}


function updateModalPrice() {

    const total =
        getSingleProductPrice() * quantity;

    modalTotal.textContent =
        `${total.toFixed(0)} zł`;
}


/* =========================
   CART
========================= */

let cart = JSON.parse(
    localStorage.getItem("borowskaCart") || "[]"
);

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const goToMenu = document.getElementById("goToMenu");


function saveCart() {
    localStorage.setItem(
        "borowskaCart",
        JSON.stringify(cart)
    );
}


function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.classList.add("cart-open");

    renderCart();
}


function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.classList.remove("cart-open");
}


cartButton.addEventListener("click", openCart);

cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


function addCurrentProductToCart() {

    const addons = [];

    document.querySelectorAll(".addon input:checked")
        .forEach(input => {
            addons.push({
                name: input.dataset.name,
                price: Number(input.dataset.price)
            });
        });

    const item = {
        id: Date.now(),
        name: currentProduct.name,
        description: currentProduct.description,
        basePrice: currentProduct.price,
        meat: meatGroup.style.display === "none"
            ? ""
            : selectedMeat,
        sauce: selectedSauce,
        addons,
        quantity,
        unitPrice: getSingleProductPrice()
    };

    cart.push(item);

    saveCart();

    closeProductModal();

    renderCart();

    showToast(
        currentProduct.name,
        quantity
    );
}


addToCartButton.addEventListener(
    "click",
    addCurrentProductToCart
);


/* =========================
   CART RENDER
========================= */

function renderCart() {

    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Koszyk jest pusty</h3>
                <p>Dodaj coś dobrego z menu.</p>
                <button id="goToMenu">ZOBACZ MENU</button>
            </div>
        `;

        const newMenuButton =
            document.getElementById("goToMenu");

        newMenuButton.addEventListener("click", () => {
            closeCart();

            document
                .getElementById("menu")
                .scrollIntoView({
                    behavior: "smooth"
                });
        });

    } else {

        cartItems.innerHTML = cart.map(item => {

            const options = [];

            if (item.meat) {
                options.push(item.meat);
            }

            if (item.sauce) {
                options.push(item.sauce);
            }

            if (item.addons.length) {
                options.push(
                    item.addons
                        .map(addon => addon.name)
                        .join(", ")
                );
            }

            return `
                <div class="cart-item">

                    <div>
                        <h4>
                            ${escapeHTML(item.name)}
                            × ${item.quantity}
                        </h4>

                        <p>
                            ${escapeHTML(options.join(" • "))}
                        </p>
                    </div>

                    <div class="cart-item-right">

                        <div class="cart-item-price">
                            ${(item.unitPrice * item.quantity).toFixed(0)} zł
                        </div>

                        <button
                            class="cart-remove"
                            data-id="${item.id}">
                            USUŃ
                        </button>

                    </div>

                </div>
            `;
        }).join("");

        document.querySelectorAll(".cart-remove")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        Number(button.dataset.id);

                    cart = cart.filter(
                        item => item.id !== id
                    );

                    saveCart();
                    renderCart();
                });
            });
    }

    updateCartSummary();
}


function updateCartSummary() {

    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) =>
            sum + item.unitPrice * item.quantity,
        0
    );

    cartCount.textContent = count;
    cartTotal.textContent =
        `${total.toFixed(0)} zł`;
}


/* =========================
   TOAST
========================= */

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

let toastTimer;


function showToast(name, amount) {

    toastText.textContent =
        `${name}${amount > 1 ? ` × ${amount}` : ""}`;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeProductModal();
        closeCart();
        closeMobileMenu();
    }
});


/* =========================
   INIT
========================= */

renderCart();
