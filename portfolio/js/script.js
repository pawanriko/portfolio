// Pawan Kumar — portfolio scripts
// Theme toggle, mobile menu, scroll reveal, active nav highlighting.

(function () {
    "use strict";

    /* ---------- dark / light theme ---------- */
    var root = document.documentElement;
    var themeToggle = document.getElementById("themeToggle");

    function savedTheme() {
        try {
            return window.localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        try {
            window.localStorage.setItem("theme", theme);
        } catch (e) {
            /* private mode — theme just won't persist */
        }
    }

    var initial = savedTheme();
    if (!initial) {
        initial = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", initial);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
        });
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

        // Close the menu after picking a section (mobile).
        navLinks.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- reveal on scroll ---------- */
    var revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("in");
        });
    }

    /* ---------- highlight the nav link of the section in view ---------- */
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window && navAnchors.length && sections.length) {
        var current = null;
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    current = entry.target.id;
                    navAnchors.forEach(function (anchor) {
                        anchor.classList.toggle("active", anchor.getAttribute("href") === "#" + current);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px" });

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ---------- footer year ---------- */
    var year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
})();
