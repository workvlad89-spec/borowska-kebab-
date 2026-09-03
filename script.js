/* script.js */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MOBILE MENU
       ========================================================= */

    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileNav = document.querySelector(".mobile-nav");

    if (mobileMenuButton && mobileNav) {
        mobileMenuButton.addEventListener("click", () => {
            mobileNav.classList.toggle("open");
        });

        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("open");
            });
        });
    }


    /* =========================================================
       HEADER SCROLL
       ========================================================= */

    const header = document.querySelector(".site-header");

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });


    /* =========================================================
       SCROLL REVEAL
       ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }


    /* =========================================================
       MENU FILTERS
       ========================================================= */

    const filters = document.querySelectorAll(".filter");
    const menuCards = document.querySelectorAll(".menu-card");

    filters.forEach(filter => {
        filter.addEventListener("click", () => {

            filters.forEach(item => {
                item.classList.remove("active");
            });

            filter.classList.add("active");

            const category = filter.dataset.category;

            menuCards.forEach(card => {
                const cardCategory = card.dataset.category;

                if (
                    category === "all" ||
                    category === "wszystko" ||
                    !category
                ) {
                    card.classList.remove("hidden");
                } else if (cardCategory === category) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    /* =========================================================
       PRODUCT MODAL
       ========================================================= */

    const modal = document.querySelector(".product-modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    const modalClose = document.querySelector(".modal-close");

    const modalImage = document.querySelector(".modal-image");
    const modalTitle = document.querySelector(".modal-content h2");
    const modalDescription = document.querySelector(".modal-description");

    const chooseButtons = document.querySelectorAll(".choose-button");

    const optionButtons = document.querySelectorAll(".option");
    const quantityMinus = document.querySelector(".quantity button:first-child");
    const quantityPlus = document.querySelector(".quantity button:last-child");
    const quantityValue = document.querySelector(".quantity span");

    const addCartButton = document.querySelector(".add-cart");

    let currentProduct = null;
    let quantity = 1;


    const getProductData = button => {

        const card = button.closest(".menu-card");

        if (!card) return null;

        const image = card.querySelector(".card-image img");
        const title = card.querySelector(".card-top h3");
        const description = card.querySelector(".card-content > p");

        return {
            card,
            image: image ? image.src : "",
            title: title ? title.textContent.trim() : "",
            description: description ? description.textContent.trim() : ""
        };
    };


    const openModal = product => {

        if (!modal || !product) return;

        currentProduct = product;
        quantity = 1;

        if (modalImage) {
            modalImage.src = product.image;
            modalImage.alt = product.title;
        }

        if (modalTitle) {
            modalTitle.textContent = product.title;
        }

        if (modalDescription) {
            modalDescription.textContent = product.description;
        }

        if (quantityValue) {
            quantityValue.textContent = quantity;
        }

        optionButtons.forEach(option => {
            option.classList.remove("active");
        });

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    };


    const closeModal = () => {

        if (!modal) return;

        modal.classList.remove("open");
        document.body.style.overflow = "";

        currentProduct = null;
    };


    chooseButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const product = getProductData(button);

            if (product) {
                openModal(product);
            }
        });
    });


    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeModal);
    }


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (modal && modal.classList.contains("open")) {
                closeModal();
            }

            if (cart && cart.classList.contains("open")) {
                closeCart();
            }
        }
    });


    /* =========================================================
       PRODUCT OPTIONS
       ========================================================= */

    optionButtons.forEach(option => {

        option.addEventListener("click", () => {

            const group = option.closest(".option-group");

            if (!group) return;

            group.querySelectorAll(".option").forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");
        });
    });


    /* =========================================================
       QUANTITY
       ========================================================= */

    if (quantityMinus) {

        quantityMinus.addEventListener("click", () => {

            quantity = Math.max(1, quantity - 1);

            if (quantityValue) {
                quantityValue.textContent = quantity;
            }
        });
    }


    if (quantityPlus) {

        quantityPlus.addEventListener("click", () => {

            quantity = Math.min(20, quantity + 1);

            if (quantityValue) {
                quantityValue.textContent = quantity;
            }
        });
    }


    /* =========================================================
       CART
       ========================================================= */

    const cart = document.querySelector(".cart");
    const cartOverlay = document.querySelector(".cart-overlay");
    const cartButton = document.querySelector(".cart-button");
    const cartClose = document.querySelector(".cart-head button");
    const cartItems = document.querySelector(".cart-items");
    const cartCount = document.querySelector(".cart-button strong");

    let cartData = [];


    const updateCartCount = () => {

        if (!cartCount) return;

        const totalItems = cartData.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalItems;
    };


    const renderCart = () => {

        if (!cartItems) return;

        if (cartData.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span>🛒</span>
                    <p>Koszyk jest pusty</p>
                </div>
            `;

            updateCartCount();
            return;
        }


        cartItems.innerHTML = "";


        cartData.forEach((item, index) => {

            const element = document.createElement("div");

            element.className = "cart-item";

            element.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.quantity} × porcja</p>
                    <button class="remove-item" data-index="${index}">
                        USUŃ
                    </button>
                </div>
            `;

            cartItems.appendChild(element);
        });


        cartItems.querySelectorAll(".remove-item").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cartData.splice(index, 1);

                renderCart();
            });
        });


        updateCartCount();
    };


    const openCart = () => {

        if (!cart) return;

        cart.classList.add("open");

        if (cartOverlay) {
            cartOverlay.classList.add("open");
        }

        document.body.style.overflow = "hidden";
    };


    const closeCart = () => {

        if (!cart) return;

        cart.classList.remove("open");

        if (cartOverlay) {
            cartOverlay.classList.remove("open");
        }

        document.body.style.overflow = "";
    };


    if (cartButton) {
        cartButton.addEventListener("click", openCart);
    }

    if (cartClose) {
        cartClose.addEventListener("click", closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }


    /* =========================================================
       ADD TO CART
       ========================================================= */

    if (addCartButton) {

        addCartButton.addEventListener("click", () => {

            if (!currentProduct) return;

            const selectedOptions = [];

            const activeOptions = modal
                ? modal.querySelectorAll(".option.active")
                : [];

            activeOptions.forEach(option => {
                selectedOptions.push(option.textContent.trim());
            });


            const existingItem = cartData.find(item => {

                return (
                    item.title === currentProduct.title &&
                    JSON.stringify(item.options) ===
                    JSON.stringify(selectedOptions)
                );
            });


            if (existingItem) {

                existingItem.quantity += quantity;

            } else {

                cartData.push({
                    title: currentProduct.title,
                    image: currentProduct.image,
                    options: selectedOptions,
                    quantity: quantity
                });
            }


            renderCart();
            closeModal();
            openCart();
        });
    }


    /* =========================================================
       CHECKOUT
       ========================================================= */

    const checkoutButton = document.querySelector(".checkout-button");

    if (checkoutButton) {

        checkoutButton.addEventListener("click", event => {

            event.preventDefault();

            if (cartData.length === 0) {
                return;
            }

            const orderText = cartData
                .map(item => {

                    let text = `${item.title} — ${item.quantity} szt.`;

                    if (item.options.length) {
                        text += ` (${item.options.join(", ")})`;
                    }

                    return text;
                })
                .join("\n");


            const message =
                "Dzień dobry! Chciałbym zamówić:\n\n" +
                orderText;


            const encodedMessage = encodeURIComponent(message);


            /*
             * Zamówienie jest kierowane do zewnętrznego
             * kanału zamówień. Nie wyświetlamy tutaj cen.
             */

            const orderUrl =
                "https://food.bolt.eu/en/344-wroclaw/p/3142492-borowska-kebab/";


            window.open(orderUrl, "_blank", "noopener,noreferrer");
        });
    }


    /* =========================================================
       ADDRESS TOGGLE
       ========================================================= */

    const addressToggle = document.querySelector(".address-toggle");
    const addressPanel = document.querySelector(".address-panel");

    if (addressToggle && addressPanel) {

        addressToggle.addEventListener("click", () => {

            addressPanel.classList.toggle("open");

            const isOpen = addressPanel.classList.contains("open");

            addressToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }


    /* =========================================================
       SMOOTH ANCHOR LINKS
       ========================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });


    /* =========================================================
       IMAGE FALLBACK
       ========================================================= */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.visibility = "hidden";

            const parent = image.parentElement;

            if (parent && parent.classList.contains("card-image")) {
                parent.classList.add("no-photo");
            }
        });
    });


    /* =========================================================
       INITIAL CART
       ========================================================= */

    renderCart();

});
