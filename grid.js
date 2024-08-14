const traverseButton = document.getElementById('traverse-button');
const clearButton = document.getElementById('clear-button');

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const points = [];
const gridSize = 10;

// Count of the cells
const height = canvas.height / gridSize;
const width = canvas.width / gridSize;

// State of the cell, Array of arrays
const grid = new Array(width).fill(null).map(() => new Array(height));
grid.forEach(arr => arr.fill(0));

// drag-populate set and flag variable
let positions = [];
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

    for(let x=0;x<width;x++) {
        for(let y=0;y<height;y++) {
            if(grid[x][y]) {
                ctx.fillStyle = 'white';
                ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
            }
        }
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

    // toggle cell state
    const {x, y} = getMouseCoords(click_event);

    positions.push([x, y]);
    grid[x][y]^=1;

    drawGraph();
});

canvas.addEventListener('mousemove', function (click_event) {
    const {x, y} = getMouseCoords(click_event);

    // save the values in set not to update it on every event trigger
    if(!clicked
        || positions.find(([a, b]) => x == a && y == b))
        return;

    // toggle cell state
    positions.push([x, y]);
    grid[x][y]^=1;

    drawGraph();
});

clearButton.addEventListener('click', function() {
    grid.forEach(arr => arr.fill(0)); 
    drawGraph(); 
});

drawGraph(); 
