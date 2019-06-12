"use strict";
const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 100;
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.1;
const TOOL_BRUSH = 0;
const TOOL_BUCKET = 1;
const TOOL_ERASER = 2;
const TOOL_EYEDROPPER = 3;
let image = [];
let image_width = DEFAULT_WIDTH;
let image_height = DEFAULT_HEIGHT;
let zoom = 1;
let offset_x = 0;
let offset_y = 0;
let penDown = false;
let penColor = { r: 100, g: 5, b: 200 };
let penSize = 5;
let toolSelected = 0;
function getPos(el) {
    for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent)
        ;
    return { x: lx, y: ly };
}
function createDiv(parent, className) {
    let div = document.createElement('div');
    div.className = className;
    parent.appendChild(div);
    return div;
}
function createInterface() {
    let holder = createDiv(document.body, 'holder');
    let topBar = createDiv(holder, 'topBar');
    let button1 = createDiv(topBar, 'topButton');
    let button2 = createDiv(topBar, 'topButton');
    var mainSection = createDiv(holder, 'mainSection');
    let canvas = createDiv(mainSection, 'canvas');
    window.onkeydown = (event) => {
        let modifier = 1;
        if (event.shiftKey) {
            modifier = 1.5;
        }
        else if (event.ctrlKey) {
            modifier = 0.5;
        }
        if (event.keyCode === 38) {
            zoom += 0.5 * modifier;
            if (zoom > MAX_ZOOM) {
                zoom = MAX_ZOOM;
            }
        }
        else if (event.keyCode === 40) {
            zoom -= 0.5 * modifier;
            if (zoom < MIN_ZOOM) {
                zoom = MIN_ZOOM;
            }
        }
        else {
            return;
        }
        sizeCanvas(canvas, mainSection);
        console.log(zoom);
    };
    mainSection.onmousemove = (event) => {
        if (penDown) {
            let coords = getPos(canvas);
            let innerX = event.clientX - coords.x;
            let innerY = event.clientY - coords.y;
            if (!(innerX < 0 || innerX > canvas.clientWidth || innerY < 0 || innerY > canvas.clientHeight)) {
                massPaint(canvas, Math.floor((innerX / canvas.clientWidth) * image_width), Math.floor((innerY / canvas.clientHeight) * image_height), penSize, penColor);
            }
        }
    };
    mainSection.onmousedown = () => {
        penDown = true;
    };
    mainSection.onmouseup = () => {
        penDown = false;
    };
    window.onresize = () => sizeCanvas(canvas, mainSection);
    fillCanvas(canvas, image_width, image_height);
    sizeCanvas(canvas, mainSection);
}
function sizeCanvas(canvas, parent) {
    let width = (image_width * zoom);
    let height = (image_height * zoom);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.gridTemplateColumns = ('1fr ').repeat(image_width);
    canvas.style.gridTemplateRows = ('1fr ').repeat(image_height);
    canvas.style.left = ((parent.clientWidth - width) / 2) + 'px';
    canvas.style.top = ((parent.clientHeight - height) / 2) + 'px';
}
function fillCanvas(canvas, width, height) {
    while (canvas.hasChildNodes()) {
        canvas.removeChild(canvas.lastChild);
    }
    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            createDiv(canvas, 'pixel').style.backgroundColor = 'white';
        }
    }
}
async function massPaint(canvas, x, y, s, color) {
    let halfS = Math.floor(s / 2);
    for (let i = 0; i < s; ++i) {
        for (let j = 0; j < s; ++j) {
            subPaint(canvas, x + i - halfS, y + j - halfS, color);
        }
    }
}
async function subPaint(canvas, x, y, color) {
    canvas.children[y * image_width + x].style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
}
createInterface();
