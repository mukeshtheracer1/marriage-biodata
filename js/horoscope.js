/* =========================================================
   HOROSCOPE PAGE JAVASCRIPT
   Mukesh Sah Marriage Biodata
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       SETTINGS
    ====================================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;



    /* =====================================================
       BIRTH DATE
       
       05 July 1992
       20:29
    ====================================================== */

    const birthDate = new Date(
        1992,
        6,
        5,
        20,
        29,
        0
    );



    /* =====================================================
       PAD NUMBER
    ====================================================== */

    function pad(value) {

        return String(value).padStart(2, "0");

    }



    /* =====================================================
       DAYS IN MONTH
    ====================================================== */

    function daysInMonth(year, month) {

        return new Date(
            year,
            month + 1,
            0
        ).getDate();

    }



    /* =====================================================
       CALCULATE CALENDAR AGE
       
       IMPORTANT:
       This does NOT calculate total hours/minutes
       from 1992.

       It first calculates:

       Years
       ↓
       Months
       ↓
       Days
       ↓
       Hours
       ↓
       Minutes
       ↓
       Seconds
    ====================================================== */

    function calculateAge(now) {

        if (now < birthDate) {

            return {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };

        }


        /* ---------------------------------------------
           YEARS
        --------------------------------------------- */

        let years =
            now.getFullYear() -
            birthDate.getFullYear();


        let anniversary =
            new Date(
                birthDate.getFullYear() + years,
                birthDate.getMonth(),
                birthDate.getDate(),
                birthDate.getHours(),
                birthDate.getMinutes(),
                birthDate.getSeconds()
            );


        if (now < anniversary) {

            years--;

            anniversary =
                new Date(
                    birthDate.getFullYear() + years,
                    birthDate.getMonth(),
                    birthDate.getDate(),
                    birthDate.getHours(),
                    birthDate.getMinutes(),
                    birthDate.getSeconds()
                );

        }



        /* ---------------------------------------------
           MONTHS
        --------------------------------------------- */

        let months =
            now.getMonth() -
            anniversary.getMonth();


        if (months < 0) {

            months += 12;

        }


        let monthAnchor =
            new Date(anniversary);


        monthAnchor.setMonth(
            monthAnchor.getMonth() + months
        );


        if (monthAnchor > now) {

            months--;

            monthAnchor =
                new Date(anniversary);

            monthAnchor.setMonth(
                monthAnchor.getMonth() + months
            );

        }



        /* ---------------------------------------------
           REMAINING TIME
        --------------------------------------------- */

        let remaining =
            now.getTime() -
            monthAnchor.getTime();


        const millisecondsPerSecond =
            1000;

        const millisecondsPerMinute =
            millisecondsPerSecond * 60;

        const millisecondsPerHour =
            millisecondsPerMinute * 60;

        const millisecondsPerDay =
            millisecondsPerHour * 24;


        const days =
            Math.floor(
                remaining /
                millisecondsPerDay
            );


        remaining -=
            days *
            millisecondsPerDay;


        const hours =
            Math.floor(
                remaining /
                millisecondsPerHour
            );


        remaining -=
            hours *
            millisecondsPerHour;


        const minutes =
            Math.floor(
                remaining /
                millisecondsPerMinute
            );


        remaining -=
            minutes *
            millisecondsPerMinute;


        const seconds =
            Math.floor(
                remaining /
                millisecondsPerSecond
            );


        return {

            years,
            months,
            days,
            hours,
            minutes,
            seconds

        };

    }



    /* =====================================================
       UPDATE AGE DISPLAY
    ====================================================== */

    function updateLiveAge() {

        const now =
            new Date();


        const age =
            calculateAge(now);


        const years =
            document.getElementById(
                "age-years"
            );


        const months =
            document.getElementById(
                "age-months"
            );


        const days =
            document.getElementById(
                "age-days"
            );


        const hours =
            document.getElementById(
                "age-hours"
            );


        const minutes =
            document.getElementById(
                "age-minutes"
            );


        const seconds =
            document.getElementById(
                "age-seconds"
            );


        if (!years) return;


        years.textContent =
            pad(age.years);


        months.textContent =
            pad(age.months);


        days.textContent =
            pad(age.days);


        hours.textContent =
            pad(age.hours);


        minutes.textContent =
            pad(age.minutes);


        seconds.textContent =
            pad(age.seconds);

    }



    /* =====================================================
       START LIVE AGE
    ====================================================== */

    function initLiveAge() {

        updateLiveAge();


        setInterval(
            updateLiveAge,
            1000
        );

    }



    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    function initScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".horoscope-page .reveal"
            );


        if (!elements.length) return;


        if (
            reduceMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                (element) => {

                    element.classList.add(
                        "is-visible",
                        "visible"
                    );

                }
            );

            return;

        }


        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible",
                                "visible"
                            );


                            obs.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        elements.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );

    }



    /* =====================================================
       ASTRO ITEM HOVER GLOW
    ====================================================== */

    function initAstroItems() {

        if (
            reduceMotion ||
            !finePointer
        ) return;


        const items =
            document.querySelectorAll(
                ".astro-item"
            );


        items.forEach(
            (item) => {

                item.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            item.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        item.style.setProperty(
                            "--mouse-x",
                            `${x}px`
                        );


                        item.style.setProperty(
                            "--mouse-y",
                            `${y}px`
                        );

                    }
                );


                item.addEventListener(
                    "pointerleave",
                    () => {

                        item.style.removeProperty(
                            "--mouse-x"
                        );


                        item.style.removeProperty(
                            "--mouse-y"
                        );

                    }
                );

            }
        );

    }



    /* =====================================================
       KUNDLI HOVER EFFECT
    ====================================================== */

    function initKundliEffect() {

        if (
            reduceMotion ||
            !finePointer
        ) return;


        const frame =
            document.querySelector(
                ".kundli-image-frame"
            );


        const image =
            document.querySelector(
                ".kundli-image"
            );


        if (!frame || !image) return;


        frame.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    frame.getBoundingClientRect();


                const x =
                    (event.clientX -
                        rect.left) /
                        rect.width -
                    0.5;


                const y =
                    (event.clientY -
                        rect.top) /
                        rect.height -
                    0.5;


                const rotateX =
                    (-y * 2).toFixed(2);


                const rotateY =
                    (x * 2).toFixed(2);


                image.style.transform =
                    `perspective(1200px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     scale(1.01)`;

            }
        );


        frame.addEventListener(
            "pointerleave",
            () => {

                image.style.transform =
                    "";

            }
        );

    }



    /* =====================================================
       AGE NUMBER MICRO ANIMATION
    ====================================================== */

    function initAgeNumberEffect() {

        if (reduceMotion) return;


        const seconds =
            document.getElementById(
                "age-seconds"
            );


        if (!seconds) return;


        let previousValue =
            seconds.textContent;


        setInterval(
            () => {

                const currentValue =
                    seconds.textContent;


                if (
                    currentValue ===
                    previousValue
                ) {
                    return;
                }


                seconds.style.transform =
                    "translateY(-3px)";


                requestAnimationFrame(
                    () => {

                        setTimeout(
                            () => {

                                seconds.style.transform =
                                    "";

                            },
                            120
                        );

                    }
                );


                previousValue =
                    currentValue;

            },
            200
        );

    }



    /* =====================================================
       BACK TO TOP
    ====================================================== */

    function initBackToTop() {

        const button =
            document.querySelector(
                ".footer-top-button"
            );


        if (!button) return;


        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                window.scrollTo({

                    top: 0,

                    behavior:
                        reduceMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );

    }



    /* =====================================================
       INITIALIZE HOROSCOPE PAGE
    ====================================================== */

    function initHoroscopePage() {

        if (
            document.body.dataset.page !==
            "horoscope"
        ) {
            return;
        }


        initLiveAge();

        initScrollReveal();

        initAstroItems();

        initKundliEffect();

        initAgeNumberEffect();

        initBackToTop();

    }



    /* =====================================================
       START
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initHoroscopePage
    );

})();