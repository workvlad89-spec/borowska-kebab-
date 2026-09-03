/* script.js */

const BOLT_URL = "https://food.bolt.eu/en/344-wroclaw/p/3142492-borowska-kebab/";

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
});


/* MOBILE MENU */

const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileNav = document.querySelector(".mobile-nav");

if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });

    document.querySelectorAll(".mobile-nav a").forEach(link => {
        link.addEventListener("click", () => {
            mobileNav.classList.remove("open");
        });
    });
}


/* SMOOTH SCROLL */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


/* MENU FILTERS */

const filters = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".menu-card");

filters.forEach(filter => {
    filter.addEventListener("click", () => {

        filters.forEach(item => item.classList.remove("active"));
        filter.classList.add("active");

        const selected = filter.dataset.filter;

        menuCards.forEach(card => {
            if (
                selected === "all" ||
                card.dataset.category === selected
            ) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


/* PRODUCT MODAL */

const modal = document.getElementById("productModal");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalClose = document.querySelector(".modal-close");

const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalImage = document.getElementById("modalImage");
const modalPrice = document.getElementById("modalPrice");
const sizeGroup = document.getElementById("sizeGroup");

const chooseButtons = document.querySelectorAll(".choose-button");

let currentProduct = null;
let currentQuantity = 1;

chooseButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentProduct = {
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image || "",
            description: button.dataset.description || "",
            size: button.dataset.size === "true"
        };

        currentQuantity = 1;

        const quantityElement = document.getElementById("quantity");

        if (quantityElement) {
            quantityElement.textContent = "1";
        }

        if (modalName) {
            modalName.textContent = currentProduct.name;
        }

        if (modalDescription) {
            modalDescription.textContent = currentProduct.description;
        }

        if (modalImage) {
            if (currentProduct.image) {
                modalImage.src = currentProduct.image;
                modalImage.style.display = "block";
            } else {
                modalImage.style.display = "none";
            }
        }

        if (sizeGroup) {
            sizeGroup.style.display =
                currentProduct.size ? "block" : "none";
        }

        updateModalPrice();

        if (modal) {
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        }
    });
});


function closeModal() {

    if (!modal) return;

    modal.classList.remove("open");
    document.body.style.overflow = "";
}


if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* OPTIONS */

document.querySelectorAll(".option-buttons").forEach(group => {

    group.addEventListener("click", event => {

        const button = event.target.closest(".option");

        if (!button) return;

        group.querySelectorAll(".option").forEach(option => {
            option.classList.remove("active");
        });

        button.classList.add("active");
    });
});


/* QUANTITY */

const quantityElement = document.getElementById("quantity");
const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");

if (minusButton && quantityElement) {
    minusButton.addEventListener("click", () => {

        if (currentQuantity > 1) {
            currentQuantity--;

            quantityElement.textContent =
                currentQuantity;

            updateModalPrice();
        }
    });
}


if (plusButton && quantityElement) {
    plusButton.addEventListener("click", () => {

        if (currentQuantity < 20) {
            currentQuantity++;

            quantityElement.textContent =
                currentQuantity;

            updateModalPrice();
        }
    });
}


function updateModalPrice() {

    if (!currentProduct || !modalPrice) return;

    const total =
        currentProduct.price * currentQuantity;

    if (currentProduct.price > 0) {
        modalPrice.textContent =
            `${total} zł`;
    } else {
        modalPrice.textContent =
            "CENA ONLINE";
    }
}


/* CART */

const cart = document.getElementById("cart");
const cartButton = document.getElementById("cartButton");
const closeCartButton = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartCountElement = document.getElementById("cartCount");

let cartItems = [];

try {
    cartItems =
        JSON.parse(
            localStorage.getItem("borowskaCart")
        ) || [];
} catch (error) {
    cartItems = [];
}


function saveCart() {
    localStorage.setItem(
        "borowskaCart",
        JSON.stringify(cartItems)
    );
}


function openCart() {

    if (cart) {
        cart.classList.add("open");
    }

    if (cartOverlay) {
        cartOverlay.classList.add("open");
    }
}


function closeCart() {

    if (cart) {
        cart.classList.remove("open");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("open");
    }
}


if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}


/* ADD TO CART */

const addToCartButton =
    document.getElementById("addToCart");

if (addToCartButton) {

    addToCartButton.addEventListener("click", () => {

        if (!currentProduct) return;

        const size =
            document.querySelector(
                "#sizeGroup .option.active"
            )?.dataset.value || "";

        const meat =
            document.querySelector(
                ".option-group:nth-of-type(2) .option.active"
            )?.dataset.value || "";

        const sauce =
            document.querySelector(
                ".option-group:nth-of-type(3) .option.active"
            )?.dataset.value || "";

        const item = {

            id: Date.now(),

            name: currentProduct.name,

            price: currentProduct.price,

            quantity: currentQuantity,

            image: currentProduct.image,

            size: size,

            meat: meat,

            sauce: sauce
        };

        cartItems.push(item);

        saveCart();

        renderCart();

        closeModal();

        openCart();
    });
}


/* RENDER CART */

function renderCart() {

    if (
        !cartItemsElement ||
        !cartTotalElement ||
        !cartCountElement
    ) {
        return;
    }


    if (cartItems.length === 0) {

        cartItemsElement.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <p>Twój koszyk jest pusty.</p>
            </div>
        `;

        cartTotalElement.textContent = "0 zł";

        cartCountElement.textContent = "0";

        return;
    }


    let total = 0;
    let count = 0;

    cartItemsElement.innerHTML = "";


    cartItems.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total += itemTotal;

        count += Number(item.quantity);


        const element =
            document.createElement("div");

        element.className = "cart-item";


        element.innerHTML = `
            ${
                item.image
                ? `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >
                  `
                : `
                    <div
                        style="
                            width:70px;
                            height:70px;
                            background:#111;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            color:#ed2924;
                            font-size:28px;
                        "
                    >
                        B
                    </div>
                  `
            }

            <div>
                <h4>${item.name}</h4>

                <p>
                    ${
                        item.size
                        ? item.size + "<br>"
                        : ""
                    }

                    ${
                        item.meat
                        ? item.meat + "<br>"
                        : ""
                    }

                    ${
                        item.sauce
                        ? "Sos: " + item.sauce
                        : ""
                    }

                    <br>

                    Ilość: ${item.quantity}
                </p>

                <button
                    class="remove-item"
                    data-id="${item.id}"
                >
                    USUŃ
                </button>
            </div>

            <span class="cart-item-price">
                ${
                    item.price > 0
                    ? itemTotal + " zł"
                    : "—"
                }
            </span>
        `;


        cartItemsElement.appendChild(element);
    });


    cartTotalElement.textContent =
        `${total} zł`;

    cartCountElement.textContent =
        count;


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    cartItems =
                        cartItems.filter(
                            item =>
                                item.id !== id
                        );

                    saveCart();

                    renderCart();
                }
            );
        });
}


renderCart();


/* YEAR */

const yearElement =
    document.getElementById("year");

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* IMAGE FALLBACK */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.display = "none";

                if (image.parentElement) {
                    image.parentElement.classList.add(
                        "no-photo"
                    );
                }
            }
        );
    });


/* SCROLL REVEAL */

const revealElements =
    document.querySelectorAll(".reveal");


if (
    "IntersectionObserver" in window &&
    revealElements.length
) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: 0.15,

                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    revealElements.forEach(
        element =>
            revealObserver.observe(element)
    );

} else {

    revealElements.forEach(
        element =>
            element.classList.add("is-visible")
    );
}


/* ADDRESS — "JAK DOJECHAĆ" */

const addressToggle =
    document.getElementById("addressToggle");

const addressPanel =
    document.getElementById("addressPanel");


if (addressToggle && addressPanel) {

    addressToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                addressPanel.classList.toggle(
                    "open"
                );

            addressToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        }
    );
}
