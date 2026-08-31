/* =========================================================
   GRAVITY — INTERACTIVE LECTURE
========================================================= */

let currentScene = 0;

let gravityOn = true;

let gravityValue = 100;

let gravityTimer = null;


/* =========================================================
   ELEMENTS
========================================================= */

const scenes =
    document.querySelectorAll(".scene");

const sceneCounter =
    document.getElementById("scene-counter");

const gravityStatus =
    document.getElementById("gravity-status");

const gravityText =
    document.getElementById("gravity-text");


/* =========================================================
   SCENE 4
========================================================= */

const bottomProgress =
    document.querySelector(".bottom-progress");

const gravityPercent =
    document.querySelector(".human-bottom strong");


/* =========================================================
   SCENE 5
========================================================= */

const waterState =
    document.getElementById("water-state-text");

const waterExplanation =
    document.getElementById("water-explanation");

const waterPercent =
    document.getElementById("water-percent");

const waterProgress =
    document.querySelector(".water-progress");


/* =========================================================
   SCENE 7 — MOON TEXT
========================================================= */

const moonExplanation =
    document.getElementById("moon-explanation");


/* =========================================================
   SCENE TEXTS (MOON)
========================================================= */

const MOON_TEXT_ON =
    "The Moon stays in orbit because Earth's gravity constantly bends its path into a circle.";

const MOON_TEXT_OFF =
    "With no gravity, the Moon travels in a straight line and slowly leaves Earth behind.";


function updateSceneTexts() {

    if (moonExplanation) {

        moonExplanation.textContent =
            gravityValue > 0
                ? MOON_TEXT_ON
                : MOON_TEXT_OFF;

    }

}


/* =========================================================
   PARTICLES (AIR / EARTH / FLOAT SCENES)
========================================================= */

function createParticleLayer(
    container,
    count,
    options
) {

    if (!container) {
        return;
    }


    const opts = options || {};


    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "air-particle" +
            (opts.extraClass
                ? " " + opts.extraClass
                : "");


        const dot =
            document.createElement("i");

        dot.style.animationDelay =
            (Math.random() * -8) + "s";

        dot.style.animationDuration =
            (5 + Math.random() * 6) + "s";

        particle.appendChild(dot);


        /* Position */

        let x;
        let y;


        if (opts.ring) {

            const angle =
                Math.random() * Math.PI * 2;

            const radius =
                opts.minR +
                Math.random() *
                (opts.maxR - opts.minR);

            x = 50 + Math.cos(angle) * radius;
            y = 50 + Math.sin(angle) * radius;

        } else {

            x = Math.random() * 100;
            y = Math.random() * 100;

        }


        const size =
            opts.minSize +
            Math.random() *
            (opts.maxSize - opts.minSize);


        particle.style.left = x + "%";
        particle.style.top = y + "%";
        particle.style.width = size + "px";
        particle.style.height = size + "px";


        /* Escape direction (used by gravity-off) */

        const escapeAngle =
            Math.random() * Math.PI * 2;

        const escapeDist =
            180 + Math.random() * 260;


        particle.style.setProperty(
            "--dx",
            (Math.cos(escapeAngle) * escapeDist).toFixed(0) + "px"
        );

        particle.style.setProperty(
            "--dy",
            (Math.sin(escapeAngle) * escapeDist).toFixed(0) + "px"
        );


        container.appendChild(particle);

    }

}


createParticleLayer(
    document.getElementById("air-particles"),
    42,
    {
        ring: true,
        minR: 30,
        maxR: 47,
        minSize: 4,
        maxSize: 9
    }
);


createParticleLayer(
    document.getElementById("ef-particles"),
    26,
    {
        ring: true,
        minR: 28,
        maxR: 46,
        minSize: 3,
        maxSize: 8
    }
);


createParticleLayer(
    document.getElementById("float-dust"),
    16,
    {
        ring: false,
        minSize: 3,
        maxSize: 7
    }
);


createParticleLayer(
    document.getElementById("float-drops"),
    8,
    {
        ring: false,
        minSize: 8,
        maxSize: 14,
        extraClass: "float-drop"
    }
);


/* =========================================================
   SHOW SCENE
========================================================= */

function showScene(index) {

    if (
        index < 0 ||
        index >= scenes.length
    ) {
        return;
    }


    scenes.forEach(
        (scene, i) => {

            scene.classList.toggle(
                "active",
                i === index
            );

        }
    );


    currentScene = index;


    if (sceneCounter) {

        sceneCounter.textContent =
            String(index + 1)
                .padStart(2, "0");

    }

}


/* =========================================================
   UPDATE GRAVITY VISUALS
========================================================= */

function updateGravityUI() {

    const progress =
        gravityValue / 100;


    /* =====================================
       HUMAN
    ===================================== */

    if (
        bottomProgress &&
        gravityPercent
    ) {

        gravityPercent.textContent =
            gravityValue + "%";


        bottomProgress.style.transform =
            `scaleX(${progress})`;

    }


    /* =====================================
       WATER
    ===================================== */

    if (
        waterProgress &&
        waterPercent
    ) {

        waterPercent.textContent =
            gravityValue + "%";


        waterProgress.style.transform =
            `scaleX(${progress})`;

    }

}


/* =========================================================
   UPDATE WATER TEXT
========================================================= */

function updateWaterUI() {

    if (
        !waterState ||
        !waterExplanation
    ) {
        return;
    }


    if (gravityValue > 0) {

        waterState.textContent =
            "GRAVITY ON";

        waterExplanation.textContent =
            "Water stays inside the glass because gravity pulls it down.";

    } else {

        waterState.textContent =
            "GRAVITY OFF";

        waterExplanation.textContent =
            "Without gravity, water forms a floating sphere.";

    }

}


/* =========================================================
   GRAVITY ANIMATION
========================================================= */

function startGravityAnimation() {

    /* Stop previous animation */

    if (gravityTimer) {

        clearInterval(
            gravityTimer
        );

        gravityTimer = null;

    }


    /* =====================================
       TURN GRAVITY OFF
    ===================================== */

    if (gravityOn) {

        gravityOn = false;


        document.body.classList.add(
            "gravity-off"
        );


        if (gravityStatus) {

            gravityStatus.innerHTML =
                "GRAVITY: <strong>FADING</strong>";

        }


        if (gravityText) {

            gravityText.textContent =
                "FADING";

        }


        /*
         * Start from current value.
         *
         * Example:
         *
         * 100
         * 99
         * 98
         * ...
         * 1
         * 0
         */

        gravityTimer =
            setInterval(
                () => {

                    if (
                        gravityValue > 0
                    ) {

                        gravityValue--;

                        updateGravityUI();

                    }


                    if (
                        gravityValue <= 0
                    ) {

                        gravityValue = 0;

                        updateGravityUI();

                        clearInterval(
                            gravityTimer
                        );

                        gravityTimer = null;


                        if (gravityStatus) {

                            gravityStatus.innerHTML =
                                "GRAVITY: <strong>OFF</strong>";

                        }


                        if (gravityText) {

                            gravityText.textContent =
                                "OFF";

                        }


                        updateWaterUI();

                        updateSceneTexts();

                    }

                },

                10
            );

    }

    /* =====================================
       TURN GRAVITY BACK ON
    ===================================== */

    else {

        gravityOn = true;


        document.body.classList.remove(
            "gravity-off"
        );


        if (gravityStatus) {

            gravityStatus.innerHTML =
                "GRAVITY: <strong>RESTORING</strong>";

        }


        if (gravityText) {

            gravityText.textContent =
                "RESTORING";

        }


        gravityTimer =
            setInterval(
                () => {

                    if (
                        gravityValue < 100
                    ) {

                        gravityValue++;

                        updateGravityUI();

                    }


                    if (
                        gravityValue >= 100
                    ) {

                        gravityValue = 100;

                        updateGravityUI();

                        clearInterval(
                            gravityTimer
                        );

                        gravityTimer = null;


                        if (gravityStatus) {

                            gravityStatus.innerHTML =
                                "GRAVITY: <strong>ON</strong>";

                        }


                        if (gravityText) {

                            gravityText.textContent =
                                "ON";

                        }


                        updateWaterUI();

                        updateSceneTexts();

                    }

                },

                10
            );

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener(
    "keydown",
    function(event) {


        /* =====================================
           G — GRAVITY
        ===================================== */

        if (
            event.code === "KeyG"
        ) {

            event.preventDefault();

            startGravityAnimation();

            return;
        }


        /* =====================================
           ENTER
        ===================================== */

        if (
            event.code === "Enter" &&
            currentScene === 0
        ) {

            showScene(1);

            return;
        }


        /* =====================================
           RIGHT ARROW
        ===================================== */

        if (
            event.code === "ArrowRight"
        ) {

            showScene(
                Math.min(
                    currentScene + 1,
                    scenes.length - 1
                )
            );

            return;
        }


        /* =====================================
           LEFT ARROW
        ===================================== */

        if (
            event.code === "ArrowLeft"
        ) {

            showScene(
                Math.max(
                    currentScene - 1,
                    0
                )
            );

            return;
        }

    }
);


/* =========================================================
   MOBILE BUTTONS
========================================================= */

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnGravity = document.getElementById("btn-gravity");

if (btnPrev) {
    btnPrev.addEventListener("click", function () {
        showScene(Math.max(currentScene - 1, 0));
    });
}

if (btnNext) {
    btnNext.addEventListener("click", function () {
        if (currentScene === 0) {
            showScene(1);
        } else {
            showScene(Math.min(currentScene + 1, scenes.length - 1));
        }
    });
}

if (btnGravity) {
    btnGravity.addEventListener("click", function () {
        startGravityAnimation();
    });
}


/* =========================================================
   INITIAL STATE
========================================================= */

gravityValue = 100;

gravityOn = true;

updateGravityUI();

updateWaterUI();

updateSceneTexts();

showScene(0);