document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. EFEK TYPING (MENGETIK OTOMATIS) ---
    const words = ["Creative Engineer.", "Video Editor Lead.", "IoT Developer.", "Tech Leader."];
    let i = 0;
    let timer;
    const typingTextElement = document.getElementById("typing-text");

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                typingTextElement.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000); // Tunggu 2 detik sebelum menghapus
                return false;
            }
            timer = setTimeout(loopTyping, 100); // Kecepatan mengetik
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typingTextElement.innerHTML = word.join("");
            } else {
                // Pindah ke kata berikutnya
                i = (i + 1) % words.length;
                setTimeout(typingEffect, 500); // Jeda sebelum kata baru muncul
                return false;
            }
            timer = setTimeout(loopDeleting, 50); // Kecepatan menghapus
        };
        loopDeleting();
    }

    // Mulai efek typing
    typingEffect();


    // --- 2. EFEK SCROLL REVEAL (MUNCUL SAAT DI-SCROLL) ---
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        for (let i = 0; i < reveals.length; i++) {
            let windowHeight = window.innerHeight;
            let elementTop = reveals[i].getBoundingClientRect().top;
            let elementVisible = 100; // Jarak trigger dari bawah layar

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }

    // Jalankan saat layar di-scroll
    window.addEventListener("scroll", revealOnScroll);
    
    // Jalankan sekali saat pertama kali dimuat
    revealOnScroll();
});
