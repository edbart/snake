//! main.ts | https://edbart.github.io/snake/, https://github.com/edbart/ | Eddie Bart.
'use strict';

import Phaser = require('phaser');

const getCookie = (name: String) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

let fileConfig = {
    sfxVolume: Number(getCookie('snakeSfxVolume')) || 50,
    sfxVolumeStr: getCookie('snakeSfxVolume') || '50',
    usingGamepad: Number(getCookie('snakeUsingGamepad')) === 1 || false,
    upButton: 'up',
    downButton: 'down',
    leftButton: 'left',
    rightButton: 'right',
    gameSpeed: 1, // 0, 1, 2, 3
    gridSize: 1, // 0, 1, 2
    darkmode: (() => { // true, false, undefined
        const cookie = getCookie('snakeDarkMode');
        switch (cookie) {case '0': return false; case '1': return true; default: return null;}
    })(),
    highScore: Number(getCookie('snakeHighScore')) || 0
}

document.addEventListener('DOMContentLoaded', () => {

// event handlers
const optbtn = document.getElementById('optionsBtn'),
aboutBtn = document.getElementById('aboutBtn'),
dimBg = document.getElementById('dimBg'),
optDiv = document.getElementById('optionsDiv'),
closeBtns = Array.from(document.getElementsByClassName('closePopup')) as HTMLElement[],
aboutDiv = document.getElementById('aboutDiv'),
sfxInput = document.getElementById('sfxVolume') as HTMLInputElement,
sfxLbl = document.getElementById('sfxVolumePct');

const closeAll = (dimBgOff = true) => {
    const toClose = Array.from(document.getElementsByClassName('popupMenu')) as HTMLElement[];
    toClose.forEach(element => {
        element.hidden = true;
    });
    if (dimBgOff) {
        dimBg.hidden = true;
    }
}

// options button
optbtn.addEventListener('click', () => {
    dimBg.hidden = false;
    optDiv.hidden = false;
});

// about button
aboutBtn.addEventListener('click', () => {
    dimBg.hidden = false;
    aboutDiv.hidden = false;
});

// dim background, closes menus
dimBg.addEventListener('click', () => {
    closeAll();
});

// close buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {closeAll();});
});

// sfx volume 
sfxInput.addEventListener('input', () => {
    sfxLbl.textContent = sfxInput.value;
    document.cookie = 'snakeSfxVolume='+sfxInput.value+';max-age=31536000'; // read cookie later
    fileConfig.sfxVolumeStr = sfxInput.value;
    fileConfig.sfxVolume = Number(sfxInput.value);
});

// end event handlers

var config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
    width: 1600,
    height: 1600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload (this: Phaser.Scene) {
    
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create (this: Phaser.Scene) {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

}); /*ends domcontentloaded*/