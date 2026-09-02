const modal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalName = document.getElementById("modalProductName");
const modalPrice = document.getElementById("modalPrice");
const addToCart = document.getElementById("addToCart");

const meatOption = document.getElementById("meatOption");
const sizeOption = document.getElementById("sizeOption");
const sauceOption = document.getElementById("sauceOption");

const quantityValue = document.getElementById("quantityValue");
const minusQty = document.getElementById("minusQty");
const plusQty = document.getElementById("plusQty");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

let currentProduct = {
    name: "",
    price: 0,
    type: "normal"
};

let quantity = 1;

let cart = JSON.parse(localStorage.getItem("borowskaCart")) || [];


/* =========================
   MENU FILTER
========================= */

const categoryButtons = document.querySelectorAll(".category-btn");
const foodCards = document.querySelectorAll(".food-card");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => btn.classList.remove("active"));
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


/* =========================
   PRODUCT MODAL
========================= */

document.querySelectorAll(".choose-btn").forEach(button => {

    button.addEventListener("click", () => {

        currentProduct = {
            name: button.dataset.product,
            price: Number(button.dataset.price),
            type: button.dataset.type
        };

        quantity = 1;
        quantityValue.textContent = quantity;

        modalName.textContent = currentProduct.name;

        if (currentProduct.price > 0) {
            modalPrice.textContent = `${currentProduct.price} zł`;
        } else {
            modalPrice.textContent = "Cena na miejscu";
        }

        if (currentProduct.type === "kebab") {
            meatOption.style.display = "block";
            sizeOption.style.display = "block";
            sauceOption.style.display = "block";
        }

        else if (currentProduct.type === "falafel") {
            meatOption.style.display = "none";
            sizeOption.style.display = "block";
            sauceOption.style.display = "block";
        }

        else if (currentProduct.type === "sauce") {
            meatOption.style.display = "none";
            sizeOption.style.display = "none";
            sauceOption.style.display = "block";
        }

        else {
            meatOption.style.display = "none";
            sizeOption.style.display = "none";
            sauceOption.style.display = "none";
        }

        modal.classList.add("active");
        document.body.classList.add("modal-open");
    });

});


function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});


/* =========================
   MODAL CHOICES
========================= */

document.querySelectorAll(".choice-grid").forEach(grid => {

    grid.addEventListener("click", event => {

        const choice = event.target.closest(".choice");

        if (!choice) return;

        grid.querySelectorAll(".choice").forEach(item => {
            item.classList.remove("active");
        });

        choice.classList.add("active");
    });

});


/* =========================
   QUANTITY
========================= */

minusQty.addEventListener("click", () => {

    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
    }

});


plusQty.addEventListener("click", () => {

    if (quantity < 20) {
        quantity++;
        quantityValue.textContent = quantity;
    }

});


/* =========================
   ADD TO CART
========================= */

addToCart.addEventListener("click", () => {

    const selectedMeat =
        document.querySelector("[data-meat].active")?.dataset.meat || "";

    const selectedSize =
        sizeOption.style.display !== "none"
            ? sizeOption.querySelector(".choice.active")?.textContent || ""
            : "";

    const selectedSauce =
        sauceOption.style.display !== "none"
            ? document.getElementById("sauceSelect").value
            : "";

    const item = {
        id: Date.now(),
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: quantity,
        meat: selectedMeat,
        size: selectedSize,
        sauce: selectedSauce
    };

    cart.push(item);

    saveCart();
    renderCart();
    closeModal();

    cartPanel.classList.add("active");
});


/* =========================
   CART
========================= */

function saveCart() {
    localStorage.setItem("borowskaCart", JSON.stringify(cart));
}


function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <strong>Koszyk jest pusty.</strong>
                <span>Wybierz coś dobrego z menu.</span>
            </div>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0 zł";

        return;
    }


    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;


    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        count += item.quantity;


        const details = [
            item.meat ? `Mięso: ${item.meat}` : "",
            item.size ? `Rozmiar: ${item.size}` : "",
            item.sauce ? `Sos: ${item.sauce}` : ""
        ].filter(Boolean).join(" • ");


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-top">
                <span class="cart-item-name">
                    ${item.quantity}× ${item.name}
                </span>

                <span class="cart-item-price">
                    ${item.price > 0 ? itemTotal + " zł" : "—"}
                </span>
            </div>

            ${
                details
                    ? `<div class="cart-item-meta">${details}</div>`
                    : ""
            }

            <button class="cart-item-remove" data-id="${item.id}">
                USUŃ
            </button>
        `;

        cartItems.appendChild(cartItem);
    });


    cartCount.textContent = count;

    if (total > 0) {
        cartTotal.textContent = `${total} zł`;
    } else {
        cartTotal.textContent = "—";
    }


    document.querySelectorAll(".cart-item-remove").forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            cart = cart.filter(item => item.id !== id);

            saveCart();
            renderCart();
        });

    });

}


cartButton.addEventListener("click", () => {
    cartPanel.classList.add("active");
});


cartClose.addEventListener("click", () => {
    cartPanel.classList.remove("active");
});


/* =========================
   MOBILE MENU
========================= */

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
});


mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
});


mobileMenu.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

});


/* =========================
   ESC
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeModal();

        cartPanel.classList.remove("active");

        mobileMenu.classList.remove("active");
    }

});


/* =========================
   SCROLL ANIMATION
========================= */

const animatedElements = document.querySelectorAll(
    ".food-card, .intro-title, .intro-text, .meat-content, .sauce-head, .sauce-list, .contact-item"
);


const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.08
    }
);


animatedElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity .7s ease, transform .7s ease";

    observer.observe(element);

});


/* =========================
   INIT
========================= */

renderCart();
