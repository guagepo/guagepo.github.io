window.addEventListener("scroll", () => {

    const title = document.querySelector(".speci-title");

    let scrollY = window.scrollY;

    let scale = 1 - scrollY / 1000;

    if(scale < 0.3){
        scale = 0.3;
    }

    title.style.transform = `scale(${scale})`;
});