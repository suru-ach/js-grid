const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const points = [];
const gridSize = 20;

const height = canvas.height / gridSize;
const width = canvas.width / gridSize;

const grid = new Array(height * width);
grid.fill(0);

const get_grid = (x, y) => grid[x*canvas.width + y];

const set_grid = (x, y, value) => grid[x*canvas.width + y] = value;

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

canvas.addEventListener('click', function (click_event) {
    const {x, y} = getMouseCoords(click_event);

    const value = get_grid(x, y);

    if(value) {
        ctx.clearRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize-2, gridSize-2);
    }
    set_grid(x, y, value^1);
});

drawGraph(); 
