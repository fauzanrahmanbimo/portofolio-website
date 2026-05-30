document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. EFEK TYPING (MENGETIK OTOMATIS) ---
    const words = ["Creative Engineer.", "Video Editor Lead.", "IoT Developer.", "Tech Leader."];
    let i = 0;
    let timer;
    const typingTextElement = document.getElementById("typing-text");

    function typingEffect() {
        let word = words[i].split("");
        const loopTyping = function() {
            if (word.length > 0) {
                typingTextElement.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000); 
                return false;
            }
            timer = setTimeout(loopTyping, 100); 
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        const loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typingTextElement.innerHTML = word.join("");
            } else {
                i = (i + 1) % words.length;
                setTimeout(typingEffect, 500); 
                return false;
            }
            timer = setTimeout(loopDeleting, 50); 
        };
        loopDeleting();
    }

    typingEffect();

    // --- 2. EFEK SCROLL REVEAL (MUNCUL SAAT DI-SCROLL) ---
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        for (let i = 0; i < reveals.length; i++) {
            let windowHeight = window.innerHeight;
            let elementTop = reveals[i].getBoundingClientRect().top;
            let elementVisible = 100; 

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger sekali saat halaman pertama dimuat
});
