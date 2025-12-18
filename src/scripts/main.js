// src/main.js

// === Lenis (via CDN) ===
try {
    if (window.Lenis) {
        const lenis = new window.Lenis({
            autoRaf: true,
            lerp: 0.055,
        });
        window.myLenis = lenis;
        console.log("Lenis berhasil di-initialize");
    } else {
        console.warn("Lenis tidak ditemukan. Pastikan script CDN dimuat di layout .astro");
    }
} catch (e) {
    console.warn("Lenis gagal di-initialize:", e);
}

// === AOS (via CDN) ===
try {
    if (window.AOS) {
        window.AOS.init({
            once: true,
            anchorPlacement: "top-top",
        });
        console.log("AOS berhasil di-initialize");
    } else {
        console.warn("AOS tidak ditemukan. Pastikan script CDN dimuat di layout .astro");
    }
} catch (e) {
    console.warn("AOS gagal di-initialize:", e);
}

// GSAP Config
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    function createHash() {
        return Math.random().toString(36).substring(2, 8);
    }

    const items = document.querySelectorAll(".cc-animate");

    items.forEach((item) => {
        // simpan text asli
        const originalText = item.textContent.trim();
        item.setAttribute("aria-label", originalText);

        // tentuin tipe animasi
        const type =
            item.classList.contains("animate-line") ? "line" :
                item.classList.contains("animate-word") ? "word" :
                    item.classList.contains("animate-char") ? "char" :
                        item.dataset.type || "word";

        const hash = "cc-" + createHash();
        item.classList.add(hash);

        // split
        const text = new SplitType(item, {
            types: "lines, words, chars",
            lineClass: `${hash}-line`,
            wordClass: `${hash}-word`,
            charClass: `${hash}-char`
        });

        // kasih aria-hidden
        [...text.lines, ...text.words, ...text.chars].forEach((el) => {
            el.setAttribute("aria-hidden", "true");
        });

        // css auto
        const style = document.createElement("style");
        style.textContent = `
            .${hash} { display: inline-block; overflow: hidden; }
            .${hash}-line { display: block; overflow: hidden; }
        `;
        document.head.appendChild(style);

        // base anim config
        const baseConfig = {
            opacity: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true
            }
        };

        // animasi tipe
        if (type === "line") {
            gsap.from(text.lines, {
                ...baseConfig,
                y: "150%",
                stagger: 0.1
            });
        }

        if (type === "word") {
            gsap.from(text.words, {
                ...baseConfig,
                y: "120%",
                stagger: 0.06
            });
        }

        if (type === "char") {
            gsap.from(text.chars, {
                ...baseConfig,
                y: "120%",
                stagger: 0.02
            });
        }
    });
});

