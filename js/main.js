"use strict";

const revealElements = document.querySelectorAll(".reveal");

/* ============================================
   手機導覽選單
============================================ */

const menuButton = document.querySelector("#menu-button");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-menu-links a");

function closeMenu() {
    if (!menuButton || !navMenu) {
        return;
    }

    menuButton.classList.remove("active");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuButton.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});


/* ============================================
   核心概念 Accordion
============================================ */

const conceptItems =
    document.querySelectorAll(".concept-item");

conceptItems.forEach((item) => {
    const button =
        item.querySelector(".concept-toggle");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        const wasOpen =
            item.classList.contains("open");

        conceptItems.forEach((otherItem) => {
            otherItem.classList.remove("open");
        });

        if (!wasOpen) {
            item.classList.add("open");
        }
    });
});


/* ============================================
   Team Accordion
============================================ */

const memberCards =
    document.querySelectorAll(".member-card");

memberCards.forEach((card) => {
    const button =
        card.querySelector(".member-toggle");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        const wasOpen =
            card.classList.contains("open");

        memberCards.forEach((otherCard) => {
            otherCard.classList.remove("open");
        });

        if (!wasOpen) {
            card.classList.add("open");
        }
    });
});


/* ============================================
   成果展示滑動進度
============================================ */

const worksSlider =
    document.querySelector(".works-slider");

const worksProgressBar =
    document.querySelector("#works-progress-bar");

function updateWorksProgress() {
    if (!worksSlider || !worksProgressBar) {
        return;
    }

    const maxScroll =
        worksSlider.scrollWidth -
        worksSlider.clientWidth;

    if (maxScroll <= 0) {
        worksProgressBar.style.width = "100%";
        return;
    }

    const progress =
        worksSlider.scrollLeft / maxScroll;

    const barWidth =
        20 + progress * 80;

    worksProgressBar.style.width =
        `${barWidth}%`;
}

if (worksSlider) {
    worksSlider.addEventListener(
        "scroll",
        updateWorksProgress,
        { passive:true }
    );

    updateWorksProgress();
}


/* ============================================
   滾動淡入
============================================ */


if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold:.12,
                rootMargin:"0px 0px -45px 0px"
            }
        );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}


/* ============================================
   缺圖優雅降級
   team1.jpg、work1~3.jpg 等圖片還沒補齊前，
   以品牌漸層色卡取代瀏覽器預設的破圖示。
============================================ */

function buildFallbackImage(label) {
    const safeLabel =
        (label || "").trim().slice(0, 2) || "＋";

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#f7941d" />
                    <stop offset="100%" stop-color="#24589b" />
                </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#g)" />
            <text
                x="50%"
                y="54%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="'Noto Serif TC', serif"
                font-size="140"
                fill="rgba(255,255,255,.92)"
            >${safeLabel}</text>
        </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function applyImageFallback(img) {
    const wrapper =
        img.closest(".work-image, .member-toggle");

    const numberBadge =
        wrapper?.querySelector(".work-number");

    const label = numberBadge
        ? numberBadge.textContent
        : img.alt.charAt(0);

    img.src = buildFallbackImage(label);
    img.classList.add("img-fallback");
}

document
    .querySelectorAll(".work-image img, .member-toggle img")
    .forEach((img) => {
        /*
         * main.js 是在 </body> 前載入的，圖片若在本機
         * 早就 404，error 事件可能在這段程式執行前就已經
         * 觸發過了，所以要先檢查是否已經載入失敗。
         */
        if (img.complete && img.naturalWidth === 0) {
            applyImageFallback(img);
            return;
        }

        img.addEventListener(
            "error",
            () => applyImageFallback(img),
            { once:true }
        );
    });