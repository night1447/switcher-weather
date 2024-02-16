class Helper {
    static easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    static createRotationValues = (itemSelector = ".sixths") => {
        const items = document.querySelectorAll(itemSelector);
        const map = new Map();
        [...items].map((item, index) => {
            const id = item.querySelector("svg").getAttribute("id");
            map.set(id, 60 * index);
        })
        return map;
    }

    static clickTheButton() {
        const audio = new Audio("./sounds/button.mp3");
        audio.play();
        setTimeout(() => {
            audio.pause()
        }, 500);
    }
}

const rotateDiv = document.getElementById('rot');
const rotateIcons = document.getElementById('rot-icons');
const clickRotateDiv = document.getElementById('click-rot');
const tempElement = document.querySelector('.temp');

const STEP = 2;
const FIRST_COLOR = 'rgba(0,0,0,0.5)';
const SECOND_COLOR = 'rgba(0,0,0,0.1)';

let angle = 0;
let currentTempF = 34;
let isAnimating = false; // Add flag to indicate if animation is active
const rotationValues = Helper.createRotationValues();

function changeTemperature(element, newTemp) {
    let unit = element.innerHTML.includes("F") ? "°F" : "°C";
    let currentTemp = unit === "°F" ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
    let finalTemp = unit === "°F" ? newTemp : Math.round((newTemp - 32) * 5 / 9);

    let duration = 2000; // Duration of the animation in milliseconds
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }

        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        progress = Helper.easeInOutCubic(progress);

        let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
        element.innerHTML = `${tempNow}${unit}`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Update currentTempF once the animation is complete
            currentTempF = newTemp;
            isAnimating = false; // Reset the flag when animation is done
        }
    }

    isAnimating = true; // Set flag when animation starts
    requestAnimationFrame(animate);
}

const changeWeather = (angle, item) => {
    let temp = document.querySelector('.temp');
    const mountains = document.querySelector("#mountains");
    const sixthItem = item.closest(".sixths") ?? item;
    clickRotateDiv.querySelector(".sixths.active")?.classList.remove("active");
    sixthItem.classList.add('active');
    mountains.removeAttribute("class");
    switch (angle / 60) {
        case 0:
            mountains.classList.remove("snow", "clouds");
            changeTemperature(temp, 34);
            break;
        case 1:
            mountains.classList.add("sunset");
            changeTemperature(temp, 27);
            break;
        case 2:
            mountains.classList.remove("sunset");
            mountains.classList.add("moon");
            changeTemperature(temp, 14);
            break;
        case 3:
            mountains.classList.add("clouds");
            changeTemperature(temp, 16);
            break;
        case 4:
            mountains.classList.add("storm");
            changeTemperature(temp, 8);
            break;
        case 5:
            mountains.classList.remove("moon", "storm");
            mountains.classList.add("snow");
            changeTemperature(temp, -4);
            break;
    }

    let loadingBar = document.querySelector('.loading-bar');
    loadingBar.classList.add('active');

    setTimeout(() => {
        loadingBar.classList.remove('active');
    }, 1200);
}
const changeActiveWeatherHandler = (e) => {
    const item = e.target;
    let id = "";
    if (!item) return;
    if (item.tagName === "DIV") {
        id = item.querySelector("svg").getAttribute("id");
    } else {
        id = item.closest("svg").getAttribute("id");
    }
    angle = rotationValues.get(id);
    rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
    rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
    Helper.clickTheButton();
    changeWeather(angle, item)
};
clickRotateDiv.addEventListener("click", changeActiveWeatherHandler)


//FOR IMITATION WHEEl
let gradient = ' conic-gradient(';
for (let i = 0; i < 360; i += STEP) {
    const color = i % (2 * STEP) === 0 ? FIRST_COLOR : SECOND_COLOR;
    gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgba(187, 152, 248, 0.9)';

rotateDiv.style.background = gradient;

const changeToggleHandler = (toggle) => {
    if (toggle.classList.contains('active') || isAnimating) {
        return;
    }
    document.querySelector(".right-modal").querySelector(".toggle.active").classList.remove("active");
    toggle.classList.add('active');
    const tempValue = parseFloat(tempElement.textContent);
    if (toggle.id === 'toggle-cel') {
        const celsius = Math.round((tempValue - 32) * 5 / 9);
        tempElement.textContent = celsius + '°C';
    } else if (toggle.id === 'toggle-far') {
        const fahrenheit = Math.round(tempValue * 9 / 5 + 32);
        tempElement.textContent = fahrenheit + '°F';
    }
}

document.querySelector(".right-modal").addEventListener("click", e => {
    const target = e.target;
    if (target && target.classList.contains("toggle")) {
        Helper.clickTheButton();
        changeToggleHandler(target);
    }
})

const rocketButton = document.querySelector("._runRocket");
const powerButton = document.querySelector("._togglePower");
const monsterButton = document.querySelector("._runMonster");
const planeButton = document.querySelector("._runPlane");

powerButton.addEventListener("click", () => {
    document.querySelector('.outer-rim').classList.toggle('power-on');
    Helper.clickTheButton();
})
rocketButton.addEventListener("click", function () {
    if (!this.classList.contains('active')) {
        Helper.clickTheButton();
        const audio = new Audio("./sounds/rocket.mp3");
        audio.play();
        document.querySelector('g#rocket').style.animation = 'rocketAnimation 8s ease-in';
        this.classList.toggle('active');
        setTimeout(() => {
            audio.pause();
            this.classList.remove('active');
            document.querySelector('g#rocket').style.animation = 'none';
        }, 6000);
    }
})
monsterButton.addEventListener("click", function () {
    if (!this.classList.contains('active')) {
        Helper.clickTheButton();
        const audio = new Audio("./sounds/monster.mp3");
        audio.play();
        audio.loop = true;

        function loopFix() {
            if (audio.currentTime >= audio.duration - 0.05) {
                audio.currentTime = 0;
                audio.play();
            }
            requestAnimationFrame(loopFix);
        }

        loopFix();
        document.querySelector('g#monsterbody').style.animation = 'monsterAnimation 24s linear';
        this.classList.toggle('active');
        setTimeout(() => {
            this.classList.remove('active');
            audio.pause();
            document.querySelector('g#monsterbody').style.animation = 'none';
        }, 24000);
    }
})
planeButton.addEventListener("click", function () {
    if (!this.classList.contains('active')) {
        Helper.clickTheButton();
        const audio = new Audio("./sounds/plane.mp3");
        audio.play();
        document.querySelector('g#biplane').style.animation = 'biplaneAnimation 12s linear';
        this.classList.toggle('active');
        setTimeout(() => {
            this.classList.remove('active');
            document.querySelector('g#biplane').style.animation = 'none';
            audio.pause();
        }, 12000);
    }
})
