const traverseButton = document.getElementById('traverse-button');
const clearButton = document.getElementById('clear-button');

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const points = [];
const gridSize = 20;

// Count of the cells
const height = canvas.height / gridSize;
const width = canvas.width / gridSize;

// State of the cell, Array of arrays
const grid = new Array(height).fill(new Array(width).fill(0));
grid.forEach(arr => arr.fill(0));

// drag-populate set and flag variable
let positions = new Set();
let clicked = 0;

// render the grid
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e0e0e0';
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

}

function getMouseCoords (click_event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((click_event.clientX - rect.left) / gridSize),
        y: Math.floor((click_event.clientY - rect.top) / gridSize)
    }
}


canvas.addEventListener('mouseup', function () {
    clicked^=1;
});

canvas.addEventListener('mousedown', function (click_event) {
    clicked^=1;
    positions.clear();

    const {x, y} = getMouseCoords(click_event);

    if(grid[x][y]) {
        ctx.clearRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    }
    grid[x][y]^=1;
});

canvas.addEventListener('mousemove', function (click_event) {
    const {x, y} = getMouseCoords(click_event);

    // save the values in set not to update it on every event trigger
    let set_pos = x * canvas.width + y;
    if(!clicked || positions.has(set_pos)) return;
    positions.add(set_pos);

    if(grid[x][y]) {
        ctx.clearRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    }
    grid[x][y]^=1;
});

clearButton.addEventListener('click', function() {
    grid.forEach(arr => arr.fill(0)); 
    drawGraph(); 
});

drawGraph(); 
