// Pawan Kumar — portfolio v6 "THE FILM" scripts
// Loader 0→100, cinematic hero (ken-burns + scroll parallax),
// horizontal project reel driven by vertical scroll,
// theme toggle, overlay menu, FAQ, scroll reveal, Delhi clock.

(function () {
    "use strict";

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- theme (dark is the home theme) ---------- */
    var root = document.documentElement;

    function savedTheme() {
        try {
            return window.localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    }

    root.setAttribute("data-theme", savedTheme() || "dark");

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

        menuOverlay.addEventListener("click", function (event) {
            if (event.target === menuOverlay) { setMenu(false); }
        });

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

    /* ---------- hero timecode: runs like a camera clock ---------- */
    var timecode = document.getElementById("timecode");
    if (timecode && !reducedMotion) {
        var tcStart = Date.now();
        window.setInterval(function () {
            var elapsed = Date.now() - tcStart;
            var totalSeconds = Math.floor(elapsed / 1000);
            var frames = Math.floor((elapsed % 1000) / 1000 * 24);
            var parts = [
                Math.floor(totalSeconds / 3600),
                Math.floor((totalSeconds % 3600) / 60),
                totalSeconds % 60,
                frames
            ];
            timecode.textContent = parts.map(function (n) {
                return (n < 10 ? "0" : "") + n;
            }).join(":");
        }, 42);
    }

    /* ---------- loader: 0 → 100, then the curtain lifts ---------- */
    var loader = document.getElementById("loader");
    var loaderCount = document.getElementById("loaderCount");
    var loaderBar = document.getElementById("loaderBar");
    var loaderStatus = document.getElementById("loaderStatus");

    function finishLoading() {
        document.body.classList.remove("is-loading");
        document.body.classList.add("loaded");
        if (loader) {
            window.setTimeout(function () {
                if (loader.parentNode) { loader.parentNode.removeChild(loader); }
            }, 1100);
        }
    }

    if (loader && !reducedMotion) {
        var statusWords = [
            [0, "LOADING REEL"],
            [34, "THREADING PROJECTOR"],
            [67, "ROLLING CREDITS"],
            [92, "FEATURE PRESENTATION"]
        ];
        var progress = 0;
        var heroReady = false;

        var heroPreload = new Image();
        heroPreload.onload = function () { heroReady = true; };
        heroPreload.onerror = function () { heroReady = true; };
        heroPreload.src = "images/hero-suit.jpg";

        var safety = window.setTimeout(function () { heroReady = true; }, 2600);

        var loaderTimer = window.setInterval(function () {
            var cap = heroReady ? 100 : 90;
            var step = progress < 55 ? (2 + Math.random() * 4) : (0.8 + Math.random() * 2);
            progress = Math.min(cap, progress + step);

            if (loaderCount) { loaderCount.textContent = String(Math.floor(progress)); }
            if (loaderBar) { loaderBar.style.width = progress + "%"; }
            if (loaderStatus) {
                for (var i = statusWords.length - 1; i >= 0; i--) {
                    if (progress >= statusWords[i][0]) {
                        loaderStatus.textContent = statusWords[i][1];
                        break;
                    }
                }
            }

            if (progress >= 100) {
                window.clearInterval(loaderTimer);
                window.clearTimeout(safety);
                if (loaderCount) { loaderCount.textContent = "100"; }
                window.setTimeout(function () {
                    loader.classList.add("done");
                    finishLoading();
                }, 320);
            }
        }, 46);
    } else {
        // Reduced motion (CSS hides the loader) or no loader element:
        // show the hero settled, skip the whole sequence.
        if (loader && loader.parentNode) { loader.parentNode.removeChild(loader); }
        finishLoading();
    }

    /* ---------- hero: parallax push-in + letterbox widen on scroll ---------- */
    var hero = document.getElementById("hero");
    var heroImg = document.getElementById("heroImg");
    var heroBars = document.querySelectorAll(".hero-bar");

    if (hero && heroImg && !reducedMotion) {
        var heroTicking = false;

        function updateHero() {
            heroTicking = false;
            var vh = window.innerHeight;
            var y = window.scrollY || window.pageYOffset;
            if (y > vh * 1.2) { return; }
            var p = Math.min(1, Math.max(0, y / vh)); // 0 at top → 1 one screen down

            var start = window.getComputedStyle(heroImg).transform;
            var baseScale = 1.14;
            try {
                var m = new DOMMatrixReadOnly(start);
                if (m && m.a) { baseScale = m.a; }
            } catch (e) { /* keep default */ }

            var scale = baseScale + p * 0.12;
            var translate = p * vh * 0.16;
            heroImg.style.transform = "translateY(" + translate + "px) scale(" + scale + ")";

            var barH = Math.max(0, 3.2 - p * 3.2); // vh units: bars shrink away
            heroBars.forEach(function (bar) { bar.style.height = barH + "vh"; });
        }

        window.addEventListener("scroll", function () {
            if (!heroTicking) {
                heroTicking = true;
                window.requestAnimationFrame(updateHero);
            }
        }, { passive: true });
    }

    /* ---------- projects: vertical scroll drives the reel sideways ---------- */
    var projects = document.getElementById("projects");
    var projectsPin = document.getElementById("projectsPin");
    var projectsViewport = projects ? projects.querySelector(".projects-viewport") : null;
    var projectsTrack = document.getElementById("projectsTrack");
    var projectsProgress = document.getElementById("projectsProgress");

    function railOverflow() {
        if (!projectsViewport || !projectsTrack) { return 0; }
        return Math.max(0, projectsTrack.scrollWidth - projectsViewport.clientWidth);
    }

    function setupRail() {
        if (!projects || !projectsViewport || !projectsTrack) { return; }
        var overflow = railOverflow();

        if (reducedMotion || overflow <= 24) {
            projects.classList.remove("is-pinned");
            projectsViewport.classList.add("native-scroll");
            projectsTrack.style.transform = "";
            if (projectsProgress) { projectsProgress.style.width = "100%"; }
            return;
        }

        projectsViewport.classList.remove("native-scroll");
        projects.classList.add("is-pinned");
        // Scroll distance: the sideways distance + most of a screen to travel it.
        var distance = overflow + window.innerHeight * 0.9;
        projects.style.setProperty("--projects-scroll", distance + "px");
        updateRail();
    }

    function updateRail() {
        if (!projects || !projects.classList.contains("is-pinned")) { return; }
        var rect = projects.getBoundingClientRect();
        var total = projects.offsetHeight - window.innerHeight;
        if (total <= 0) { return; }
        var p = Math.min(1, Math.max(0, -rect.top / total));
        var overflow = railOverflow();
        projectsTrack.style.transform = "translateX(" + (-overflow * p) + "px)";
        if (projectsProgress) { projectsProgress.style.width = (p * 100) + "%"; }
    }

    if (projects) {
        var railTicking = false;
        window.addEventListener("scroll", function () {
            if (!railTicking) {
                railTicking = true;
                window.requestAnimationFrame(function () {
                    railTicking = false;
                    updateRail();
                });
            }
        }, { passive: true });

        window.addEventListener("resize", setupRail);
        window.addEventListener("load", setupRail);
        setupRail();
    }

    /* ---------- cursor follower: dot + black/white circle + soft shadow ---------- */
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

        var mx = -100, my = -100;
        var rx = -100, ry = -100;
        var sx = -100, sy = -100;
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
