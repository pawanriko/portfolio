// Pawan Kumar — portfolio v4 scripts
// Theme toggle, mobile menu, FAQ accordion, scroll reveal,
// active nav highlighting, live Delhi clock.

(function () {
    "use strict";

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- theme (light is the home theme) ---------- */
    var root = document.documentElement;

    function savedTheme() {
        try {
            return window.localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    }

    root.setAttribute("data-theme", savedTheme() || "light");

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

    /* ---------- full-screen overlay menu ---------- */
    var navToggle = document.getElementById("navToggle");
    var menuOverlay = document.getElementById("menuOverlay");
    var menuClose = document.getElementById("menuClose");

    function setMenu(open) {
        if (!menuOverlay || !navToggle) { return; }
        menuOverlay.classList.toggle("open", open);
        menuOverlay.setAttribute("aria-hidden", open ? "false" : "true");
        document.body.classList.toggle("menu-open", open);
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (navToggle && menuOverlay) {
        navToggle.addEventListener("click", function () {
            setMenu(!menuOverlay.classList.contains("open"));
        });

        if (menuClose) {
            menuClose.addEventListener("click", function () { setMenu(false); });
        }

        // Click the dimmed backdrop (outside the panel) to close.
        menuOverlay.addEventListener("click", function (event) {
            if (event.target === menuOverlay) { setMenu(false); }
        });

        // Any menu link closes the menu before jumping to the section.
        menuOverlay.addEventListener("click", function (event) {
            if (event.target.closest(".menu-links a")) { setMenu(false); }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") { setMenu(false); }
        });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".faq").forEach(function (item) {
        var button = item.querySelector(".faq-q");
        var panel = item.querySelector(".faq-a");
        if (!button || !panel) { return; }

        button.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");

            // Close everything else first — one answer open at a time.
            document.querySelectorAll(".faq.open").forEach(function (other) {
                other.classList.remove("open");
                other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
                other.querySelector(".faq-a").style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("open");
                button.setAttribute("aria-expanded", "true");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    /* ---------- reveal on scroll ---------- */
    var revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reducedMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add("in"); });
    }

    /* ---------- active nav link ---------- */
    var navAnchors = document.querySelectorAll('.menu-links a[href^="#"]');
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

    /* ---------- hero portrait: colour reveals in a circle at the cursor ---------- */
    var heroPhoto = document.getElementById("heroPhoto");

    if (heroPhoto && !reducedMotion) {
        var colorImg = heroPhoto.querySelector(".hero-img-color");

        if (colorImg) {
            var REVEAL_R = 130;

            heroPhoto.addEventListener("pointermove", function (e) {
                var rect = heroPhoto.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var clip = "circle(" + REVEAL_R + "px at " + x + "px " + y + "px)";
                colorImg.style.clipPath = clip;
                colorImg.style.webkitClipPath = clip;
            });

            heroPhoto.addEventListener("pointerleave", function () {
                var rect = heroPhoto.getBoundingClientRect();
                var clip = "circle(0px at " + (rect.width / 2) + "px " + (rect.height / 2) + "px)";
                colorImg.style.clipPath = clip;
                colorImg.style.webkitClipPath = clip;
            });
        }
    }

    /* ---------- cursor follower: dot + black/white circle + soft shadow ---------- */
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (finePointer && !reducedMotion) {
        var shadow = document.createElement("div");
        shadow.className = "cursor-shadow";
        var ring = document.createElement("div");
        ring.className = "cursor-ring";
        var dot = document.createElement("div");
        dot.className = "cursor-dot";
        document.body.appendChild(shadow);
        document.body.appendChild(ring);
        document.body.appendChild(dot);

        var mx = -100, my = -100;          // mouse target
        var rx = -100, ry = -100;          // ring position (lags)
        var sx = -100, sy = -100;          // shadow position (lags more)
        var shown = false;

        document.addEventListener("mousemove", function (e) {
            mx = e.clientX;
            my = e.clientY;
            if (!shown) {
                rx = sx = mx;
                ry = sy = my;
                document.body.classList.add("has-cursor");
                shown = true;
            }
            dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
        });

        document.addEventListener("mouseleave", function () {
            document.body.classList.remove("has-cursor");
            shown = false;
        });

        (function followCursor() {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            sx += (mx - sx) * 0.07;
            sy += (my - sy) * 0.07;
            var ringHalf = ring.classList.contains("is-hover") ? 29 : 19;
            ring.style.transform = "translate(" + (rx - ringHalf) + "px," + (ry - ringHalf) + "px)";
            shadow.style.transform = "translate(" + (sx - 32) + "px," + (sy - 32) + "px)";
            window.requestAnimationFrame(followCursor);
        })();

        var hoverables = "a, button, .faq-q, input, textarea, [data-cursor]";
        document.addEventListener("mouseover", function (e) {
            if (e.target.closest(hoverables)) {
                ring.classList.add("is-hover");
            }
        });
        document.addEventListener("mouseout", function (e) {
            if (e.target.closest(hoverables)) {
                ring.classList.remove("is-hover");
            }
        });
    }
})();
