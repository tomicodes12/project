document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("hidden");
    });

    // Slider Functionality
    let index = 0;
    const slides = document.querySelectorAll(".slide");
    const slidesContainer = document.querySelector(".slides");

    function showSlide(n) {
        slidesContainer.style.transform = `translateX(${-100 * n}%)`;
    }

    function prevSlide() {
        index = (index > 0) ? index - 1 : slides.length - 1;
        showSlide(index);
    }

    function nextSlide() {
        index = (index < slides.length - 1) ? index + 1 : 0;
        showSlide(index);
    }

    document.querySelector(".prev").addEventListener("click", prevSlide);
    document.querySelector(".next").addEventListener("click", nextSlide);

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);

  

    // Text-to-Speech Functionality
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }

    // Enable Click-to-Speak on the Entire Page
    document.body.addEventListener("click", function (event) {
        if (event.target.tagName === "P" || event.target.tagName === "H1" || event.target.tagName === "H2" || event.target.tagName === "H3") {
            speakText(event.target.innerText);
        }
    });
});