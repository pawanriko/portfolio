// Pawan Kumar — portfolio v3 scripts
// Preloader, theme, custom cursor, magnetic buttons, scroll
// progress, reveal animations, live Delhi clock.

(function () {
    "use strict";

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    /* ---------- theme (dark is the default look) ---------- */
    var root = document.documentElement;

    function savedTheme() {
        try {
            return window.localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    }

    var initialTheme = savedTheme() || "dark";
    root.setAttribute("data-theme", initialTheme);

    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try {
                window.localStorage.setItem("theme", next);
            } catch (e) { /* private mode — fine */ }
        });
    }

    /* ---------- preloader ---------- */
    var preloader = document.getElementById("preloader");
    var counter = document.getElementById("preloaderCount");

    function finishLoad() {
        document.body.classList.add("loaded");
        if (preloader) {
            preloader.classList.add("done");
            window.setTimeout(function () {
                preloader.style.display = "none";
            }, 900);
        }
    }

    if (reducedMotion || !preloader || !counter) {
        if (preloader) { preloader.style.display = "none"; }
        document.body.classList.add("loaded");
    } else {
        var value = 0;
        var timer = window.setInterval(function () {
            value += Math.floor(Math.random() * 14) + 6;
            if (value >= 100) {
                value = 100;
                window.clearInterval(timer);
                window.setTimeout(finishLoad, 120);
            }
            counter.textContent = value + "%";
        }, 90);
    }

    /* ---------- mobile menu ---------- */
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinks.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- custom cursor ---------- */
    if (finePointer && !reducedMotion) {
        var dot = document.getElementById("cursorDot");
        var ring = document.getElementById("cursorRing");
        var mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

        document.addEventListener("mousemove", function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            if (dot) {
                dot.style.left = mouseX + "px";
                dot.style.top = mouseY + "px";
            }
        });

        (function animateRing() {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            if (ring) {
                ring.style.left = ringX + "px";
                ring.style.top = ringY + "px";
            }
            window.requestAnimationFrame(animateRing);
        })();

        document.querySelectorAll("a, button").forEach(function (el) {
            el.addEventListener("mouseenter", function () {
                if (ring) { ring.classList.add("grow"); }
            });
            el.addEventListener("mouseleave", function () {
                if (ring) { ring.classList.remove("grow"); }
            });
        });
    }

    /* ---------- magnetic buttons ---------- */
    if (finePointer && !reducedMotion) {
        document.querySelectorAll(".magnetic").forEach(function (el) {
            el.addEventListener("mousemove", function (event) {
                var rect = el.getBoundingClientRect();
                var x = event.clientX - rect.left - rect.width / 2;
                var y = event.clientY - rect.top - rect.height / 2;
                el.style.transform = "translate(" + x * 0.22 + "px," + y * 0.28 + "px)";
            });
            el.addEventListener("mouseleave", function () {
                el.style.transform = "";
            });
        });
    }

    /* ---------- scroll progress + reveal + active nav ---------- */
    var progress = document.getElementById("progress");

    function onScroll() {
        if (!progress) { return; }
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var done = height > 0 ? (window.scrollY / height) * 100 : 0;
        progress.style.width = done + "%";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reducedMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add("in"); });
    }

    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window && navAnchors.length && sections.length) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navAnchors.forEach(function (anchor) {
                        anchor.classList.toggle("active", anchor.getAttribute("href") === "#" + entry.target.id);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px" });

        sections.forEach(function (section) { sectionObserver.observe(section); });
    }

    /* ---------- live Delhi clock + year ---------- */
    var clock = document.getElementById("localTime");

    function tickClock() {
        if (!clock) { return; }
        try {
            clock.textContent = new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
        } catch (e) {
            clock.textContent = new Date().toLocaleTimeString();
        }
    }

    tickClock();
    window.setInterval(tickClock, 20000);

    var year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
})();
