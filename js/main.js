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