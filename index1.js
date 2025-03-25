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

    // Chatbot Functionality
    const chatbox = document.getElementById("chatbox");
    function addMessage(message, sender = "bot") {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("p-2", "rounded", "mt-2");
        msgDiv.classList.add(sender === "bot" ? "bg-purple-700 text-white" : "bg-gray-700 text-white text-right");
        msgDiv.textContent = message;
        chatbox.appendChild(msgDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
        speakText(message); // Speak the chatbot message
    }

    function handleUserInput(input) {
        const responses = {
            "hello": "Hi there! How can I assist you?",
            "rooms": "We have luxurious rooms available. Would you like to see our offers?",
            "amenities": "We offer free Wi-Fi, a swimming pool, and a spa.",
            "booking": "Would you like to check room availability and book a stay?",
            "bye": "Goodbye! Have a great day!"
        };

        addMessage(input, "user");
        setTimeout(() => {
            const response = responses[input.toLowerCase()] || "I'm sorry, I didn't understand that.";
            addMessage(response);
        }, 1000);
    }

    window.handleKeyPress = function (event) {
        if (event.key === "Enter") {
            const inputField = document.getElementById("userInput");
            if (inputField.value.trim() !== "") {
                handleUserInput(inputField.value.trim());
                inputField.value = "";
            }
        }
    };

    window.openChatbot = function () {
        document.getElementById("chatbot").classList.remove("hidden");
    };

    window.closeChatbot = function () {
        document.getElementById("chatbot").classList.add("hidden");
    };

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