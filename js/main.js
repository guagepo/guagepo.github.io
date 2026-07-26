window.addEventListener("scroll", () => {

    const title = document.querySelector(".speci-title");

    let scrollY = window.scrollY;

    let scale = 1 - scrollY / 1000;

    if(scale < 0.3){
        scale = 0.3;
    }

    title.style.transform = `scale(${scale})`;
});
"use strict";

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
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
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});
"use strict";

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