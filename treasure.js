// ws/treasure.js - click the button many times to open the treasure chest

const CLICKS_NEEDED = 10;     // how many clicks it takes (change this number)
const DEGREES_PER_CLICK = 54; // how much the gear turns each click

const openBtn = document.getElementById('openBtn');
const ringFill = document.getElementById('ringFill');
const hint = document.getElementById('hint');
const gear = document.getElementById('gear');
const chest = document.getElementById('chest');
const character = document.getElementById('character');
const necklace = document.getElementById('necklace');
const msg = document.getElementById('msg');
const again = document.getElementById('again');

// the ring is a circle with radius 46; its length is 2 x pi x 46
const RING_LENGTH = 2 * Math.PI * 46;
ringFill.style.strokeDasharray = RING_LENGTH;

let clicks = 0;
let finished = false;

// draw the current progress: ring, gear and the small number under the button
function render() {
    ringFill.style.strokeDashoffset = RING_LENGTH * (1 - clicks / CLICKS_NEEDED);
    gear.style.transform = 'rotate(' + clicks * DEGREES_PER_CLICK + 'deg)';
    hint.textContent = clicks + ' / ' + CLICKS_NEEDED;
}

// replay a small CSS animation by removing and adding its class
function playClass(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;            // makes the browser restart the animation
    element.classList.add(className);
}

openBtn.addEventListener('click', () => {
    if (finished) return;

    clicks++;
    render();
    playClass(chest, 'shake');
    playClass(openBtn, 'pressed');
    setTimeout(() => openBtn.classList.remove('pressed'), 90);

    if (clicks >= CLICKS_NEEDED) openChest();
});

function openChest() {
    finished = true;
    openBtn.disabled = true;

    setTimeout(() => {
        if (!finished) return;                   // Back / reset was pressed in the meantime
        chest.classList.add('opened');           // closed chest -> open chest
        openBtn.classList.add('gone');
        hint.classList.add('gone');
        playClass(character, 'cheer');

        setTimeout(() => {
            if (!finished) return;
            necklace.classList.add('show');      // the necklace rises out of the chest
            msg.classList.add('show');
            again.classList.add('show');
        }, 600);
    }, 400);
}

again.addEventListener('click', () => {
    clicks = 0;
    finished = false;
    openBtn.disabled = false;

    chest.classList.remove('opened', 'shake');
    character.classList.remove('cheer');
    openBtn.classList.remove('gone', 'pressed');
    hint.classList.remove('gone');
    necklace.classList.remove('show');
    msg.classList.remove('show');
    again.classList.remove('show');

    gear.style.transition = 'none';              // turn the gear back without spinning backwards
    render();
    void gear.offsetWidth;
    gear.style.transition = '';
    openBtn.focus();
});

render();

// ---------- title screen + Back button ----------
const titleScreen = document.getElementById('titleScreen');
const backBtn = document.getElementById('backBtn');
const startBtn = document.getElementById('startBtn');

// Start -> the game
startBtn.addEventListener('click', () => {
    titleScreen.classList.add('leaving');                 // fade out
    setTimeout(() => {
        titleScreen.hidden = true;
        backBtn.hidden = false;
        openBtn.focus();                                  // keyboard users land on the click button
    }, 500);
});

// Back -> reset the game, then return to the title screen
backBtn.addEventListener('click', () => {
    again.click();                                        // reuse the "Play again" reset
    backBtn.hidden = true;
    titleScreen.classList.remove('leaving');
    titleScreen.hidden = false;
    startBtn.focus();
});