/* =========================================================
   MUKESH SAH
   CINEMATIC MEMORY GALLERY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const TOTAL_PHOTOS = 20;

    /* 5 seconds */
    const AUTOPLAY_DELAY = 5000;


    /* =====================================================
       PHOTO PATHS
    ===================================================== */

    const photos = Array.from(
        { length: TOTAL_PHOTOS },
        (_, i) =>
            `../images/photo${i + 1}.jpg`
    );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const wall =
        document.getElementById("memoryWall");

    const sliderImage =
        document.getElementById("sliderImage");

    const sliderStage =
        document.getElementById("sliderStage");

    const sliderPrev =
        document.getElementById("sliderPrev");

    const sliderNext =
        document.getElementById("sliderNext");

    const sliderPlay =
        document.getElementById("sliderPlay");

    const sliderFullscreen =
        document.getElementById("sliderFullscreen");

    const counterCurrent =
        document.getElementById("counterCurrent");

    const counterTotal =
        document.getElementById("counterTotal");

    const sliderNumber =
        document.getElementById("sliderNumber");

    const sliderTitle =
        document.getElementById("sliderTitle");

    const progressFill =
        document.getElementById("progressFill");

    const dotsContainer =
        document.getElementById("sliderDots");

    const thumbsContainer =
        document.getElementById("sliderThumbnails");


    /* LIGHTBOX */

    const lightbox =
        document.getElementById("galleryLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");

    const lightboxCaption =
        document.getElementById("lightboxCaption");


    /* =====================================================
       STATE
    ===================================================== */

    let currentIndex = 0;

    let isPlaying = true;

    let autoplayTimer = null;

    let progressTimer = null;

    let progressStart = 0;

    let touchStartX = 0;

    let isLightboxOpen = false;


    /* =====================================================
       TITLES
    ===================================================== */

    const titles = [
        "A Beautiful Moment",
        "A Moment To Remember",
        "Beautiful Memories",
        "A Story Untold",
        "Moments That Matter",
        "A Special Memory",
        "Forever In Time",
        "A Beautiful Day",
        "Captured With Love",
        "Memories In Motion",
        "A Golden Moment",
        "The Little Things",
        "A Story Worth Keeping",
        "Timeless Memories",
        "One Beautiful Chapter",
        "Moments We Treasure",
        "A Memory Forever",
        "Beautifully Remembered",
        "A Moment That Stays",
        "Our Beautiful Story"
    ];


    /* =====================================================
       CREATE MEMORY WALL
    ===================================================== */

    function createMemoryWall() {

        if (!wall) return;

        wall.innerHTML = "";

        const shapes = [
            "shape-hex",
            "shape-circle",
            "shape-diamond",
            "shape-round",
            "shape-polaroid",
            "shape-soft"
        ];


        photos.forEach((src, i) => {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                `memory-card ${shapes[i % shapes.length]}`;

            card.style.setProperty(
                "--i",
                i
            );

            card.dataset.index = i;


            /* Inner */

            const inner =
                document.createElement("div");

            inner.className =
                "memory-card-inner";


            /* Image */

            const image =
                document.createElement("img");

            image.src = src;

            image.alt =
                `Memory ${String(i + 1).padStart(2, "0")}`;

            image.loading =
                i < 8
                    ? "eager"
                    : "lazy";


            /* Number */

            const number =
                document.createElement("span");

            number.className =
                "memory-index";

            number.textContent =
                String(i + 1).padStart(2, "0");


            inner.appendChild(image);

            inner.appendChild(number);

            card.appendChild(inner);

            wall.appendChild(card);


            /* Click */

            card.addEventListener(
                "click",
                () => {

                    card.classList.remove(
                        "active"
                    );

                    void card.offsetWidth;

                    card.classList.add(
                        "active"
                    );


                    showSlide(
                        i,
                        "next"
                    );


                    setTimeout(
                        () => {

                            openLightbox(i);

                        },
                        480
                    );

                }
            );

        });

    }


    /* =====================================================
       CREATE DOTS
    ===================================================== */

    function createDots() {

        if (!dotsContainer) return;

        dotsContainer.innerHTML = "";

        photos.forEach((_, i) => {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "slider-dot";

            dot.dataset.index = i;

            dot.setAttribute(
                "aria-label",
                `Go to memory ${i + 1}`
            );

            dot.addEventListener(
                "click",
                () => {

                    showSlide(
                        i,
                        i < currentIndex
                            ? "prev"
                            : "next"
                    );

                    restartAutoplay();

                }
            );

            dotsContainer.appendChild(dot);

        });

    }


    /* =====================================================
       CREATE THUMBNAILS
    ===================================================== */

    function createThumbnails() {

        if (!thumbsContainer) return;

        thumbsContainer.innerHTML = "";

        photos.forEach((src, i) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "slider-thumb";

            button.dataset.index = i;

            button.setAttribute(
                "aria-label",
                `Open memory ${i + 1}`
            );


            const image =
                document.createElement("img");

            image.src = src;

            image.alt =
                `Memory ${i + 1}`;

            image.loading =
                "lazy";


            button.appendChild(image);

            thumbsContainer.appendChild(
                button
            );


            button.addEventListener(
                "click",
                () => {

                    showSlide(
                        i,
                        i < currentIndex
                            ? "prev"
                            : "next"
                    );

                    restartAutoplay();

                }
            );

        });

    }


    /* =====================================================
       UPDATE UI
    ===================================================== */

    function updateUI() {

        const number =
            String(currentIndex + 1)
                .padStart(2, "0");


        if (counterCurrent) {
            counterCurrent.textContent =
                number;
        }


        if (sliderNumber) {
            sliderNumber.textContent =
                number;
        }


        if (sliderTitle) {

            sliderTitle.textContent =
                titles[currentIndex]
                || `Beautiful Memory ${number}`;

        }


        /* Dots */

        document
            .querySelectorAll(".slider-dot")
            .forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


        /* Thumbnails */

        document
            .querySelectorAll(".slider-thumb")
            .forEach((thumb, i) => {

                thumb.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


        /* Scroll thumbnail */

        const activeThumb =
            document.querySelector(
                `.slider-thumb[data-index="${currentIndex}"]`
            );

        if (activeThumb) {

            activeThumb.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });

        }

    }


    /* =====================================================
       SHOW SLIDE
    ===================================================== */

    function showSlide(
        newIndex,
        direction = "next"
    ) {

        if (!sliderImage) return;


        currentIndex =
            (newIndex + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;


        const src =
            photos[currentIndex];


        /* Remove animation */

        sliderImage.classList.remove(
            "cinematic-next",
            "cinematic-prev"
        );


        /* Force browser reflow */

        void sliderImage.offsetWidth;


        /* Set image */

        sliderImage.src = src;


        sliderImage.alt =
            `Memory ${currentIndex + 1}`;


        /* Add animation */

        sliderImage.classList.add(
            direction === "prev"
                ? "cinematic-prev"
                : "cinematic-next"
        );


        updateUI();

        resetProgress();

    }


    /* =====================================================
       NEXT
    ===================================================== */

    function nextSlide() {

        showSlide(
            currentIndex + 1,
            "next"
        );

    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousSlide() {

        showSlide(
            currentIndex - 1,
            "prev"
        );

    }


    /* =====================================================
       BUTTONS
    ===================================================== */

    sliderNext?.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoplay();

        }
    );


    sliderPrev?.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoplay();

        }
    );


    /* =====================================================
       AUTOPLAY
    ===================================================== */

    function startAutoplay() {

        stopAutoplay();

        if (!isPlaying) return;


        progressStart =
            performance.now();


        autoplayTimer =
            setTimeout(
                () => {

                    nextSlide();

                    startAutoplay();

                },
                AUTOPLAY_DELAY
            );


        animateProgress();

    }


    function stopAutoplay() {

        clearTimeout(
            autoplayTimer
        );

        autoplayTimer = null;


        cancelAnimationFrame(
            progressTimer
        );

    }


    function restartAutoplay() {

        stopAutoplay();

        if (isPlaying) {

            startAutoplay();

        }

    }


    /* =====================================================
       PROGRESS BAR
    ===================================================== */

    function animateProgress() {

        if (
            !isPlaying ||
            !progressFill
        ) {
            return;
        }


        const elapsed =
            performance.now()
            - progressStart;


        const percentage =
            Math.min(
                elapsed / AUTOPLAY_DELAY,
                1
            ) * 100;


        progressFill.style.width =
            `${percentage}%`;


        if (percentage < 100) {

            progressTimer =
                requestAnimationFrame(
                    animateProgress
                );

        }

    }


    function resetProgress() {

        if (!progressFill) return;

        progressFill.style.width =
            "0%";


        if (isPlaying) {

            progressStart =
                performance.now();

        }

    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    function updatePlayButton() {

        if (!sliderPlay) return;


        sliderPlay.textContent =
            isPlaying
                ? "Ⅱ  PAUSE"
                : "▶  PLAY";

    }


    sliderPlay?.addEventListener(
        "click",
        () => {

            isPlaying =
                !isPlaying;


            updatePlayButton();


            if (isPlaying) {

                startAutoplay();

            } else {

                stopAutoplay();

            }

        }
    );


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    function openLightbox(i) {

        currentIndex =
            (i + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;


        isLightboxOpen = true;


        if (lightboxImage) {

            lightboxImage.src =
                photos[currentIndex];

            lightboxImage.alt =
                `Memory ${currentIndex + 1}`;

        }


        updateLightboxCaption();


        lightbox?.classList.add(
            "open"
        );


        document.body.style.overflow =
            "hidden";


        stopAutoplay();

    }


    function closeLightbox() {

        isLightboxOpen = false;


        lightbox?.classList.remove(
            "open"
        );


        document.body.style.overflow =
            "";


        if (isPlaying) {

            startAutoplay();

        }

    }


    function updateLightboxCaption() {

        if (!lightboxCaption) return;


        lightboxCaption.textContent =
            `MEMORY ${String(currentIndex + 1).padStart(2, "0")} / ${String(TOTAL_PHOTOS).padStart(2, "0")}`;

    }


    function lightboxNextSlide() {

        currentIndex =
            (currentIndex + 1)
            % TOTAL_PHOTOS;


        updateLightboxImage();

    }


    function lightboxPreviousSlide() {

        currentIndex =
            (currentIndex - 1 + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;


        updateLightboxImage();

    }


    function updateLightboxImage() {

        if (!lightboxImage) return;


        lightboxImage.style.opacity =
            "0";

        lightboxImage.style.transform =
            "scale(.94)";


        setTimeout(() => {

            lightboxImage.src =
                photos[currentIndex];

            lightboxImage.alt =
                `Memory ${currentIndex + 1}`;


            lightboxImage.style.opacity =
                "1";

            lightboxImage.style.transform =
                "scale(1)";


            updateLightboxCaption();


            updateUI();

        }, 180);

    }


    lightboxClose?.addEventListener(
        "click",
        closeLightbox
    );


    lightboxNext?.addEventListener(
        "click",
        lightboxNextSlide
    );


    lightboxPrev?.addEventListener(
        "click",
        lightboxPreviousSlide
    );


    /* Click background */

    lightbox?.addEventListener(
        "click",
        event => {

            if (
                event.target.classList
                    .contains(
                        "lightbox-backdrop"
                    )
            ) {

                closeLightbox();

            }

        }
    );


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    sliderFullscreen?.addEventListener(
        "click",
        () => {

            openLightbox(
                currentIndex
            );

        }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {


            /* LIGHTBOX */

            if (isLightboxOpen) {

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    lightboxNextSlide();

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    lightboxPreviousSlide();

                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }

                return;
            }


            /* NORMAL */

            if (
                event.key ===
                "ArrowRight"
            ) {

                nextSlide();

                restartAutoplay();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousSlide();

                restartAutoplay();

            }


            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                isPlaying =
                    !isPlaying;

                updatePlayButton();


                if (isPlaying) {

                    startAutoplay();

                } else {

                    stopAutoplay();

                }

            }

        }
    );


    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    sliderStage?.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    sliderStage?.addEventListener(
        "touchend",
        event => {

            const touchEndX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) < 50
            ) {
                return;
            }


            if (distance < 0) {

                nextSlide();

            } else {

                previousSlide();

            }


            restartAutoplay();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       LIGHTBOX TOUCH SWIPE
    ===================================================== */

    let lightboxTouchStart = 0;


    lightbox?.addEventListener(
        "touchstart",
        event => {

            lightboxTouchStart =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    lightbox?.addEventListener(
        "touchend",
        event => {

            const end =
                event.changedTouches[0]
                    .screenX;


            const distance =
                end -
                lightboxTouchStart;


            if (
                Math.abs(distance) < 50
            ) {
                return;
            }


            if (distance < 0) {

                lightboxNextSlide();

            } else {

                lightboxPreviousSlide();

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       PAUSE WHEN HOVERING SLIDER
    ===================================================== */

    sliderStage?.addEventListener(
        "mouseenter",
        () => {

            if (isPlaying) {

                stopAutoplay();

            }

        }
    );


    sliderStage?.addEventListener(
        "mouseleave",
        () => {

            if (isPlaying) {

                startAutoplay();

            }

        }
    );


    /* =====================================================
       PAGE VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopAutoplay();

            } else if (
                isPlaying &&
                !isLightboxOpen
            ) {

                startAutoplay();

            }

        }
    );


    /* =====================================================
       PRELOAD IMAGES
    ===================================================== */

    function preloadImages() {

        photos.forEach(
            (src, i) => {

                if (i === 0) return;

                const image =
                    new Image();

                image.src = src;

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    createMemoryWall();

    createDots();

    createThumbnails();


    if (counterTotal) {

        counterTotal.textContent =
            String(TOTAL_PHOTOS)
                .padStart(2, "0");

    }


    showSlide(
        0,
        "next"
    );


    updatePlayButton();

    preloadImages();

    startAutoplay();

});