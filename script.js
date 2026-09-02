/* script.js */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
});


/* SMOOTH SCROLL */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target = document.querySelector(link.getAttribute("href"));

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* MOBILE MENU */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("mobile-open");

    });

}


/* CATEGORY FILTER */

const categoryButtons = document.querySelectorAll(".category-btn");
const foodCards = document.querySelectorAll(".food-card");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        foodCards.forEach(card => {

            if (category === "all" || card.dataset.category === category) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }

        });

    });

});


/* PRODUCT MODAL */

const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalImage = document.getElementById("modalImage");

const chooseButtons = document.querySelectorAll(".choose-btn");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");

let selectedProduct = "";
let selectedPrice = 0;
let quantity = 1;


const productImages = {

    "Zestaw Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Tortilla Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Rollo Amerykańskie": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Bułka Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Fryto Bułka Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Box Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Kapsalon Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Sałatka z mięsem Kebab": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Zestaw Ser Smażony": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Zestaw Filet z Mintaja": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Sałatka Grecka": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Zestaw Falafel": "https://images.unsplash.com/photo-1786174045057-89e6449f47d9?auto=format&fit=crop&w=1000&q=85",

    "Box Falafel": "https://images.unsplash.com/photo-1786174045057-89e6449f47d9?auto=format&fit=crop&w=1000&q=85",

    "Tortilla Falafel": "https://images.unsplash.com/photo-1786174045057-89e6449f47d9?auto=format&fit=crop&w=1000&q=85",

    "Zestaw Nuggets": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85",

    "Frytki": "https://images.unsplash.com/photo-1529259266118-cf22737f713f?auto=format&fit=crop&w=1000&q=85",

    "Sos": "https://images.unsplash.com/photo-1778168199427-4e839943d20f?auto=format&fit=crop&w=1000&q=85"

};


function openModal(product, price) {

    selectedProduct = product;
    selectedPrice = Number(price);

    quantity = 1;

    modalTitle.textContent = product;
    modalPrice.textContent = `${selectedPrice} zł`;

    document.getElementById("quantity").textContent = quantity;

    if (productImages[product]) {
        modalImage.style.backgroundImage = `url("${productImages[product]}")`;
    }

    modal.classList.add("open");
    document.body.classList.add("modal-open");

}


chooseButtons.forEach(button => {

    button.addEventListener("click", () => {

        openModal(
            button.dataset.product,
            button.dataset.price
        );

    });

});


function closeModal() {

    modal.classList.remove("open");
    document.body.classList.remove("modal-open");

}


modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeModal();
    }

});


/* OPTIONS */

document.querySelectorAll(".options").forEach(group => {

    group.querySelectorAll(".option").forEach(option => {

        option.addEventListener("click", () => {

            group.querySelectorAll(".option").forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");

        });

    });

});


/* QUANTITY */

const quantityElement = document.getElementById("quantity");

document.getElementById("plus").addEventListener("click", () => {

    quantity++;

    quantityElement.textContent = quantity;

});


document.getElementById("minus").addEventListener("click", () => {

    if (quantity > 1) {
        quantity--;
    }

    quantityElement.textContent = quantity;

});


/* CART */

let cart = JSON.parse(localStorage.getItem("borowskaCart")) || [];

const cartElement = document.getElementById("cart");
const cartButton = document.getElementById("cartButton");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


function saveCart() {

    localStorage.setItem(
        "borowskaCart",
        JSON.stringify(cart)
    );

}


function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Twój koszyk jest pusty.
            </p>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0 zł";

        return;
    }


    let total = 0;
    let count = 0;


    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        count += item.quantity;


        const element = document.createElement("div");

        element.className = "cart-item";

        element.innerHTML = `
            <div>
                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-meta">
                    ${item.quantity} × ${item.price} zł
                </div>
            </div>

            <div>
                <div class="cart-item-price">
                    ${itemTotal} zł
                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    style="
                        margin-top:7px;
                        background:none;
                        border:0;
                        color:#666;
                        cursor:pointer;
                        font-size:9px;
                    "
                >
                    USUŃ
                </button>
            </div>
        `;

        cartItems.appendChild(element);

    });


    cartCount.textContent = count;
    cartTotal.textContent = `${total} zł`;


    document.querySelectorAll(".remove-item").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            saveCart();
            renderCart();

        });

    });

}


document.querySelector(".modal-add").addEventListener("click", () => {

    const activeMeat =
        document.querySelector(".option-group:nth-of-type(1) .option.active");

    const activeSauce =
        document.querySelector(".option-group:nth-of-type(2) .option.active");


    cart.push({

        name: selectedProduct,

        price: selectedPrice,

        quantity: quantity,

        meat: activeMeat ? activeMeat.textContent : "",

        sauce: activeSauce ? activeSauce.textContent : ""

    });


    saveCart();
    renderCart();

    closeModal();

    cartElement.classList.add("open");

});


cartButton.addEventListener("click", () => {

    renderCart();

    cartElement.classList.add("open");

});


cartClose.addEventListener("click", () => {

    cartElement.classList.remove("open");

});


renderCart();


/* CARD ANIMATION */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },

    {
        threshold: .08
    }

);


foodCards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(25px)";
    card.style.transition =
        "opacity .6s ease, transform .6s ease, border-color .35s ease";

    observer.observe(card);

});
