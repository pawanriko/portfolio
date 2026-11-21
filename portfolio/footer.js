
      // ============================================================
      //  EDIT THIS: replace with Pawan's real email address.
      //  The contact form sends to this address via the visitor's
      //  own email app (mailto) — nothing is stored or sent to a server.
      // ============================================================
      var CONTACT_EMAIL = "pawanriko@gmail.com";

      /* ============================================================
         CROWD — individual animated characters, like the reference
         video: every walker is a different person (coat, puffer,
         hoodie, dress… cap, beanie, headscarf, bun… backpack, tote,
         briefcase…) whose legs and arms swing and whose body bobs
         as they cross at their own speed. Three depths flow past
         Pawan — far and back rows left → right behind him, the
         front row right → left in front of him.
         ============================================================ */
      (function buildCrowd() {
        var seed = 987654321;
        function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
        function pick(a) { return a[Math.floor(rnd() * a.length)]; }
        function range(a, b) { return a + rnd() * (b - a); }

        /* coat fill + the hatch colour that shades it — mostly paper-light
           like a pencil sketch, a few mid greys and the odd dark coat */
        var COATS = [["#f4f3f0","#9a978f"], ["#e9e8e4","#8f8c85"], ["#dbdad5","#83807a"], ["#c7c6c1","#74726c"], ["#efeeea","#a3a099"], ["#5b5955","#cfccc4"], ["#33312e","#bdbab2"], ["#d3d0c9","#7e7a72"]];
        var PANTS = ["#4a4a47", "#5d5d59", "#373735", "#6a6a65", "#2f2f2d", "#55534e"];
        var SKINS = ["#ffffff", "#f7f3ea", "#efe9dc", "#f3f0e8"];
        var HAIRS = ["#2b2b2b", "#454545", "#5d5d5d", "#1f1f1f", "#6e6e6e", "#3a3a3a"];
        var HATS  = ["cap", "beanie", "flat", "scarf", "bun", "curly", "long", "bald", "hood", "short", "cap", "beanie", "long", "short"];
        var TOPS  = ["coat", "puffer", "hoodie", "blazer", "coat", "puffer", "dress", "coat", "hoodie"];
        var BAGS  = ["backpack", "tote", "briefcase", "shoulder", "none", "backpack", "tote", "none", "shoulder"];

        function figure(ink) {
          var pair = pick(COATS), coat = pair[0], hatch = pair[1];
          var pants = pick(PANTS), skin = pick(SKINS), hair = pick(HAIRS);
          var hat = pick(HATS), top = pick(TOPS), bag = pick(BAGS);
          var neckScarf = rnd() < 0.28;
          var s = "";
          var sw  = 'stroke="' + ink + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
          var swT = 'stroke="' + ink + '" stroke-width="1.1" stroke-linecap="round" fill="none" opacity=".5"';
          var ht  = 'stroke="' + hatch + '" stroke-width="1.1" stroke-linecap="round" fill="none" opacity=".6"';

          /* soft ground shadow */
          s += '<ellipse cx="40" cy="133.5" rx="18" ry="2.6" fill="#000" opacity=".10"/>';
          /* backpack sits behind the body */
          if (bag === "backpack") {
            s += '<path d="M15 47 Q14 41 20 40.5 L28 40.5 Q32 40.5 32 47 L32 66 Q32 71.5 26 71.5 L19 71.5 Q13.5 71.5 14 65 Z" fill="' + pants + '" ' + sw + '/>';
            s += '<path d="M18 50.5 h10 M18 58 h10" ' + ht + '/>';
          }
          /* legs — two segments each: thigh from the hip, shin from
             the knee, shoe flat on the ground. Drawn near-vertical;
             the gait keyframes make the stride and the knee bend
             ends the old stiff scissor look. Far leg first, softer. */
          s += '<g class="lg-b" opacity=".8"><path d="M38 78 L39 101" fill="none" stroke="' + ink + '" stroke-width="7.4" stroke-linecap="round"/><path d="M38 78 L39 101" fill="none" stroke="' + pants + '" stroke-width="5" stroke-linecap="round"/><g class="sn-b"><path d="M39 101 L39 124" fill="none" stroke="' + ink + '" stroke-width="6.8" stroke-linecap="round"/><path d="M39 101 L39 124" fill="none" stroke="' + pants + '" stroke-width="4.6" stroke-linecap="round"/><path d="M32.5 128 Q33 123.6 40 123.8 L47.5 125.2 Q49.6 126 48.6 128 Z" fill="' + ink + '"/></g></g>';
          s += '<g class="lg-a"><path d="M38 78 L39 101" fill="none" stroke="' + ink + '" stroke-width="7.6" stroke-linecap="round"/><path d="M38 78 L39 101" fill="none" stroke="' + pants + '" stroke-width="5.2" stroke-linecap="round"/><g class="sn-a"><path d="M39 101 L39 124" fill="none" stroke="' + ink + '" stroke-width="7" stroke-linecap="round"/><path d="M39 101 L39 124" fill="none" stroke="' + pants + '" stroke-width="4.8" stroke-linecap="round"/><path d="M32.5 128 Q33 123.6 40 123.8 L47.5 125.2 Q49.6 126 48.6 128 Z" fill="' + ink + '"/></g></g>';
          /* far arm — behind the torso, hanging from the SAME shoulder
             point as the near arm, so its hand rests on the correct
             side of the body; the hand is a small mitten at the cuff,
             not a floating ball */
          s += '<g class="ar-a" opacity=".85"><path d="M38 46 L35 61" fill="none" stroke="' + ink + '" stroke-width="6" stroke-linecap="round"/><path d="M38 46 L35 61" fill="none" stroke="' + coat + '" stroke-width="3.6" stroke-linecap="round"/><g class="fo-a"><path d="M35 61 L37 75" fill="none" stroke="' + ink + '" stroke-width="5.4" stroke-linecap="round"/><path d="M35 61 L37 75" fill="none" stroke="' + coat + '" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="37.4" cy="77.6" rx="2.3" ry="3.1" fill="' + skin + '" stroke="' + ink + '" stroke-width="1.2"/></g></g>';
          /* torso by outfit — sketchy outline, a second offset line for
             the hand-drawn wobble, pencil hatching for shade */
          if (top === "dress") {
            s += '<path d="M31 40 Q39 34.5 45.5 41 L54 84 Q40 90.5 26 85.5 L27.5 48 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M28 62 Q40 66 52 62" ' + swT + '/><path d="M31 72 l8 3 M30 79 l9 3" ' + ht + '/>';
          } else if (top === "puffer") {
            s += '<path d="M29 41 Q38 35 47 41 L49.5 76 Q38 81.5 26.5 76.5 L25.5 48 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M26.5 52 Q38 55.5 49 52 M26.8 62 Q38 65.5 49.2 62 M27.2 71 Q38 74.5 48.8 71" ' + ht + '/>';
          } else if (top === "blazer") {
            s += '<path d="M29 41 Q38 35 47 41 L49.5 78 Q38 83.5 26.5 78.5 L25.5 48 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M33.5 40.5 L38.5 55 L44 40.5 L38.5 47 Z" fill="#ffffff" ' + sw + '/>';
            s += '<path d="M30 68 l8 3 M29.5 75 l8 3" ' + ht + '/>';
          } else if (top === "hoodie") {
            s += '<path d="M29 41 Q38 35 47 41 L49.5 77 Q38 82.5 26.5 77.5 L25.5 48 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M24.5 40 Q26 33 33 32.5 L34 40 Q28 41 24.5 40 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M31 64 h14 v8 h-14 Z" fill="none" ' + swT + '/><path d="M30 56 l7 2.5" ' + ht + '/>';
          } else { /* long coat */
            s += '<path d="M29 41 Q38 35 47 41 L51 86 Q38 91.5 25 86.5 L25 48 Z" fill="' + coat + '" ' + sw + '/>';
            s += '<path d="M38 44 L37.5 84" ' + swT + '/><circle cx="41.5" cy="56" r="1.1" fill="' + ink + '"/><circle cx="41.8" cy="66" r="1.1" fill="' + ink + '"/>';
            s += '<path d="M28 66 l8 3 M27.5 74 l8 3 M27.5 82 l8 3" ' + ht + '/>';
          }
          /* shoulder bag hangs at the back hip */
          if (bag === "shoulder") {
            s += '<path d="M45 42 L29 64" fill="none" ' + sw + '/>';
            s += '<rect x="17" y="63" width="15" height="12" rx="2" fill="' + pants + '" ' + sw + '/>';
          }
          /* knotted neck scarf on some figures */
          if (neckScarf) {
            s += '<path d="M30.5 39.5 Q38 44 46.5 39.5 L46.5 45 Q38 49 30.5 45 Z" fill="' + hair + '" ' + sw + '/>';
            s += '<path d="M42.5 45.5 L44.5 56 L49.5 54.5 L46.8 44.8 Z" fill="' + hair + '" ' + sw + '/>';
          }
          /* neck */
          s += '<path d="M34.5 31 L34.5 41.5 L43 41.5 L42.5 30.5 Q38.5 34 34.5 31 Z" fill="' + skin + '" ' + sw + '/>';
          /* near arm — in front of the torso, same shoulder point as
             the far arm; its hand carries the tote / briefcase */
          s += '<g class="ar-b"><path d="M38 46 L42 61" fill="none" stroke="' + ink + '" stroke-width="6.2" stroke-linecap="round"/><path d="M38 46 L42 61" fill="none" stroke="' + coat + '" stroke-width="3.8" stroke-linecap="round"/><g class="fo-b"><path d="M42 61 L40 75" fill="none" stroke="' + ink + '" stroke-width="5.6" stroke-linecap="round"/><path d="M42 61 L40 75" fill="none" stroke="' + coat + '" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="39.6" cy="77.6" rx="2.3" ry="3.1" fill="' + skin + '" stroke="' + ink + '" stroke-width="1.2"/>';
          if (bag === "tote") {
            s += '<path d="M39.6 78 L35.5 86 M39.6 78 L43.7 86" fill="none" ' + sw + '/>';
            s += '<rect x="31.5" y="86" width="16" height="14" rx="1.5" fill="#ffffff" ' + sw + '/>';
            s += '<path d="M35 92 l9 3 M35 96.5 l9 3" ' + ht + '/>';
          } else if (bag === "briefcase") {
            s += '<path d="M35.1 79.5 h9" fill="none" ' + sw + '/>';
            s += '<rect x="30.5" y="81" width="19" height="13" rx="1.5" fill="' + pants + '" ' + sw + '/>';
            s += '<path d="M30.5 87.5 h19" ' + ht + '/>';
          }
          s += '</g></g>';
          /* head in profile — rounder skull, a smaller nose and a
             softer jaw than before, with eye, brow, mouth and ear,
             so the face reads calm and natural, not pointed */
          s += '<g class="hd"><path d="M29 21 Q27.5 9.5 37 6.5 Q47.5 4.5 50.5 13.5 Q51.8 17.5 50.6 21.2 L53 25.8 Q53.6 27.6 51.8 28 L50.6 28.3 Q51 31.8 48.6 34.6 Q44.5 38.6 37.5 37.4 Q30.5 36.2 29.3 28.5 Q28.7 24.8 29 21 Z" fill="' + skin + '" ' + sw + '/>';
          s += '<circle cx="44.8" cy="20.5" r="1.15" fill="' + ink + '"/>';
          s += '<path d="M42 16.8 Q44.8 15.8 47.4 16.8" ' + swT + '/>';
          s += '<path d="M47.2 32.2 Q48.8 32.6 50 31.9" ' + swT + '/>';
          s += '<path d="M35.8 23 a3 3.4 0 1 1 -.5 5" ' + swT + '/>';
          if (hat === "cap") {
            s += '<path d="M27.8 19.5 Q27.2 8 38 7.2 Q49.5 7 50.4 16.8 L50.4 19 Q38.5 13.8 27.8 19.5 Z" fill="' + hair + '" ' + sw + '/><path d="M49.8 16.8 L60.5 18.8 L50 20.4 Z" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "beanie") {
            s += '<path d="M27.8 18.5 Q28 7.5 39 7.2 Q50.2 7.5 50.4 17.5 L50.4 19.5 Q39 14.5 27.8 19.5 Z" fill="' + hair + '" ' + sw + '/><circle cx="39" cy="6" r="3" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "flat") {
            s += '<path d="M28.5 15.5 Q38 6 49 11.8 L58.5 16.8 L49.5 18 Q36.5 13.5 28.5 17.8 Z" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "scarf") {
            s += '<path d="M25.8 22 Q24.8 5.5 38.5 5 Q52 5.5 52.8 19.5 L53.8 41 Q54 46 47.5 45 L46.8 31 Q50.2 26.5 49.6 20 Q49 11 39 10.6 Q29.2 11 29.4 21.5 Q29.5 27.5 33 31.5 L32.2 45 Q25.8 45.5 26.2 39 Z" fill="' + coat + '" ' + sw + '/>';
          } else if (hat === "bun") {
            s += '<path d="M27.8 19.5 Q27.2 8 38 7.2 Q49.5 7 50.4 16.8 L50.4 18.8 Q38.5 13.6 27.8 19.5 Z" fill="' + hair + '" ' + sw + '/><circle cx="25.8" cy="9" r="3.7" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "curly") {
            s += '<circle cx="30.5" cy="11.5" r="3.8" fill="' + hair + '" ' + sw + '/><circle cx="37.5" cy="8.3" r="4.1" fill="' + hair + '" ' + sw + '/><circle cx="44.5" cy="9.8" r="3.9" fill="' + hair + '" ' + sw + '/><circle cx="49.5" cy="14.5" r="3.2" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "long") {
            s += '<path d="M27 21 Q25.5 6.5 38.5 6 Q50.5 6.5 51.2 16 L50.6 19.5 Q45 11.8 36.5 12.2 Q29.5 12.6 29.8 22 L30.2 47.5 Q25.8 48.5 25.2 43 Z" fill="' + hair + '" ' + sw + '/>';
          } else if (hat === "hood") {
            s += '<path d="M24.8 27 Q21.5 7.5 38.5 5.5 Q53 6.5 53.2 21" fill="none" stroke="' + ink + '" stroke-width="5" stroke-linecap="round"/><path d="M24.8 27 Q21.5 7.5 38.5 5.5 Q53 6.5 53.2 21" fill="none" stroke="' + coat + '" stroke-width="2.8" stroke-linecap="round"/>';
          } else if (hat === "short") {
            s += '<path d="M27.8 19.5 Q27.2 8 38 7.2 Q49.5 7 50.4 16.8 L50.4 18.5 Q44 12.8 35 13.2 Q30.5 13.5 27.8 19.5 Z" fill="' + hair + '" ' + sw + '/>';
          } else { /* bald — just a shine line */
            s += '<path d="M33 10.8 Q37 8.6 41.5 9.6" ' + swT + '/>';
          }
          s += '</g>';

          return '<svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '</svg>';
        }

        function populate(layerId, cfg) {
          var layer = document.getElementById(layerId);
          if (!layer) return;
          var small = window.innerWidth < 640;
          var count = Math.round(cfg.count * (small ? 0.6 : 1));
          for (var i = 0; i < count; i++) {
            var dur = range(cfg.dur[0], cfg.dur[1]);
            var stride = range(cfg.stride[0], cfg.stride[1]);
            var bottom = range(cfg.bottom[0], cfg.bottom[1]);
            var el = document.createElement("div");
            el.className = "walker" + (cfg.dir === "l" ? " dir-l" : "");
            el.style.height = range(cfg.height[0], cfg.height[1]) * (small ? 0.82 : 1) + "vh";
            el.style.bottom = bottom + "%";
            el.style.zIndex = String(100 - Math.round(bottom * 2));
            el.style.opacity = (cfg.opacity * range(0.85, 1)).toFixed(2);
            el.style.setProperty("--dur", dur.toFixed(1) + "s");
            el.style.setProperty("--delay", (-rnd() * dur).toFixed(1) + "s");
            el.style.setProperty("--stride", stride.toFixed(2) + "s");
            el.style.setProperty("--cycle", (stride * 2).toFixed(2) + "s");
            el.innerHTML = '<div class="walker-bob' + (cfg.dir === "l" ? " flip" : "") + '">' + figure(cfg.ink) + "</div>";
            /* the flip lives on the bob wrapper's svg */
            if (cfg.dir === "l") el.firstChild.classList.add("flip");
            layer.appendChild(el);
          }
        }

        /* far row — smallest, palest, slowest, left → right */
        populate("crowdFar",   { count: 11, height: [12.5, 15.5], bottom: [33, 35.5],  dur: [88, 125], stride: [0.72, 0.92], dir: "r", ink: "#6f6f6f", opacity: 0.62 });
        /* back row — mid size, behind Pawan, left → right */
        populate("crowdBack",  { count: 12, height: [18, 22],     bottom: [24.5, 27],  dur: [58, 84],  stride: [0.6, 0.78],  dir: "r", ink: "#434343", opacity: 0.88 });
        /* front row — biggest, boldest, in front of Pawan, right → left */
        populate("crowdFront", { count: 11, height: [26.5, 31.5], bottom: [-0.5, 1],   dur: [36, 56],  stride: [0.5, 0.68],  dir: "l", ink: "#161616", opacity: 0.98 });
      })();

      (function () {
        /* ---------- Contact panel ---------- */
        var openBtn = document.getElementById("contactOpen");
        var overlay = document.getElementById("contactOverlay");
        var sheet = document.getElementById("contactSheet");
        var closeBtn = document.getElementById("contactClose");
        var form = document.getElementById("contactForm");
        var sentNote = document.getElementById("sentNote");
        var lastFocus = null;

        function openSheet() {
          lastFocus = document.activeElement;
          sheet.hidden = false;
          // force reflow so the transition runs
          void sheet.offsetWidth;
          overlay.classList.add("open");
          sheet.classList.add("open");
          document.getElementById("cfName").focus();
          document.addEventListener("keydown", onKeydown);
        }
        function closeSheet() {
          overlay.classList.remove("open");
          sheet.classList.remove("open");
          document.removeEventListener("keydown", onKeydown);
          setTimeout(function () { sheet.hidden = true; }, 380);
          if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        function onKeydown(e) {
          if (e.key === "Escape") closeSheet();
        }
        openBtn.addEventListener("click", openSheet);
        closeBtn.addEventListener("click", closeSheet);
        overlay.addEventListener("click", closeSheet);

        /* ---------- Form → mailto ---------- */
        function markInvalid(id, invalid) {
          document.getElementById(id).classList.toggle("invalid", invalid);
          return !invalid;
        }
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var name = document.getElementById("cfName").value.trim();
          var email = document.getElementById("cfEmail").value.trim();
          var phone = document.getElementById("cfPhone").value.trim();
          var company = document.getElementById("cfCompany").value.trim();
          var topic = document.getElementById("cfSubject").value;
          var replyVia = document.getElementById("cfReply").value;
          var msg = document.getElementById("cfMsg").value.trim();

          var ok = true;
          ok = markInvalid("fieldName", !name) && ok;
          ok = markInvalid("fieldEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;
          /* phone is optional, but if given it should look like a number */
          ok = markInvalid("fieldPhone", !!phone && !/^[+()\-\s\d]{7,20}$/.test(phone)) && ok;
          ok = markInvalid("fieldMsg", !msg) && ok;
          if (!ok) return;

          var subject = topic + " — from " + name;
          var body =
            "Hi Pawan,\n\n" + msg +
            "\n\n— " + name +
            (company ? "\nCompany: " + company : "") +
            "\nEmail: " + email +
            (phone ? "\nPhone / WhatsApp: " + phone : "") +
            "\nBest way to reply: " + replyVia;
          var href = "mailto:" + CONTACT_EMAIL +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

          sentNote.textContent =
            "Your email app should now open with your message pre-filled, addressed to Pawan. " +
            "If nothing opened, you can email him directly at " + CONTACT_EMAIL + ".";
          sentNote.classList.add("show");
          window.location.href = href;
        });

        ["cfName", "cfEmail", "cfPhone", "cfMsg"].forEach(function (id) {
          document.getElementById(id).addEventListener("input", function () {
            this.closest(".field").classList.remove("invalid");
          });
        });
      })();
    