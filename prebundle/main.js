//! main.ts | https://edbart.github.io/snake/, https://github.com/edbart/ | Eddie Bart.
'use strict';
exports.__esModule = true;
var Phaser = require("phaser");
document.addEventListener('DOMContentLoaded', function () {
    var getCookie = function (name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match)
            return match[2];
    };
    var setCookie = function (key, value) {
        document.cookie = key + '=' + value + ';max-age=31536000';
    };
    // event handlers
    var optbtn = document.getElementById('optionsBtn'), aboutBtn = document.getElementById('aboutBtn'), dimBg = document.getElementById('dimBg'), optDiv = document.getElementById('optionsDiv'), closeBtns = Array.from(document.getElementsByClassName('closePopup')), aboutDiv = document.getElementById('aboutDiv'), sfxInput = document.getElementById('sfxVolume'), sfxLbl = document.getElementById('sfxVolumePct');
    var closeAll = function (dimBgOff) {
        if (dimBgOff === void 0) { dimBgOff = true; }
        var toClose = Array.from(document.getElementsByClassName('popupMenu'));
        toClose.forEach(function (element) {
            element.hidden = true;
        });
        if (dimBgOff) {
            dimBg.hidden = true;
        }
    };
    // options button
    optbtn.addEventListener('click', function () {
        dimBg.hidden = false;
        optDiv.hidden = false;
    });
    // about button
    aboutBtn.addEventListener('click', function () {
        dimBg.hidden = false;
        aboutDiv.hidden = false;
    });
    // dim background, closes menus
    dimBg.addEventListener('click', function () {
        closeAll();
    });
    // close buttons
    closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () { closeAll(); });
    });
    // sfx volume 
    sfxInput.addEventListener('input', function () {
        sfxLbl.textContent = sfxInput.value;
        setCookie('sfxVolume', sfxInput.value); // read cookie later
        game.sfxVolumeStr = sfxInput.value;
        game.sfxVolume = Number(sfxInput.value);
    });
    var game = {
        sfxVolume: Number(getCookie('sfxVolume')) || 50,
        sfxVolumeStr: getCookie('sfxVolume') || '50',
        gamepad: {
            flag: Number(getCookie('gamepadFlag')) === 1 || false,
            type: getCookie('gamepadType') || null
        },
        input: {
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        },
        gameSpeed: Number(getCookie('gameSpeed')) || 2,
        gridSize: Number(getCookie('gridSize')) || 2,
        darkmode: (function () {
            var cookie = getCookie('snakeDarkMode');
            switch (cookie) {
                case '0': return false;
                case '1': return true;
                default: return null;
            }
        })(),
        highScore: {
            overall: Number(getCookie('snakeOvHs')) || 0
        },
        stdTiles: Number(getCookie('stdTiles')) === 1 || false,
        getPoint: function (x, y) {
            var out = { x: null, y: null };
            out.x = (phaserConfig.width / 10) * (x);
            out.y = (phaserConfig.height / 10) * (y);
            return out;
        },
        obj: {
            bgTiles: {},
            layers: {
                bg: null
            }
        },
        handle: function () {
            sfxInput.value = game.sfxVolumeStr;
            sfxLbl.textContent = game.sfxVolumeStr;
        }
    };
    var phaserConfig = {
        type: Phaser.CANVAS,
        canvas: document.getElementById('canvas'),
        width: 1600,
        height: 1600,
        pixelArt: true,
        physics: {
            "default": 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };
    game.handle();
    var phaserGame = new Phaser.Game(phaserConfig);
    function preload() {
        this.load.setBaseURL(location.protocol + '//' + location.host + location.pathname + '/phaser/');
        this.load.spritesheet('snake', '16x16.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 24
        });
        this.load.spritesheet('playBtn', '32x16.png', {
            frameWidth: 32,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 9
        });
    }
    function create() {
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                game.obj.bgTiles['t' + x.toString() + '_' + y.toString()] = this.add.sprite(game.getPoint(x, y).x, game.getPoint(x, y).y, 'snake', (function () {
                    if (game.stdTiles) {
                        return 15;
                    }
                    else {
                        return Phaser.Math.Between(14, 19);
                    }
                })()).setOrigin(0, 0).setScale(10, 10);
                game.obj.bgTiles['t' + x.toString() + '_' + y.toString()].setDepth(-1);
            }
        }
        this.anims.create({
            key: 'blaze',
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('playBtn', { start: 0, end: 5 }),
            repeat: -1
        });
        var start = this.add.sprite(game.getPoint(3, 6).x, game.getPoint(3, 6).y, 'playBtn', 0).setOrigin(0, 0).setScale(20, 20).setInteractive();
        start.setDepth(1);
        start.on('pointerover', function () { start.play('blaze'); }).on('pointerout', function () { start.stop(); });
        var startLbl = this.add.sprite(game.getPoint(4, 8).x, game.getPoint(4, 8).y, 'playBtn', (function () {
            switch (game.gamepad.type) {
                case 'xinput': return 8;
                case 'standard': return 9;
                default: return 6;
            }
        })()).setOrigin(0, 0).setScale(10, 10);
        startLbl.setDepth(1);
        if (!game.gamepad.flag) {
            this.anims.create({
                key: 'startBlink',
                frameRate: 4,
                frames: this.anims.generateFrameNumbers('playBtn', { start: 6, end: 7 }),
                repeat: -1
            });
            startLbl.play('startBlink');
        }
    }
    global.$__game = game;
}); // ends DOMContentLoaded
