const traverseButton = document.getElementById('traverse-button');
const clearButton = document.getElementById('clear-button');

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const setSpeed = document.getElementById('set-speed');

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
function drawGraph(gridparam = null) {
    let grid_arr = gridparam;
    if(gridparam == null)
        grid_arr = grid;


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
            if(grid_arr[x][y]) {
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

// == new Module

class GameOfLife {

    constructor(grid, speed) {
        this.timer = null;
        this.grid = grid;
        this.speed = speed;
        this.generation = 0;
        this.number_of_live = 0;
        this.next_state = new Array(grid.length).fill(null).map((val, idx) => Array.from(grid[idx]));
    }

    start() {
        if(this.timer == null) {
            this.timer = setInterval(() => this.generate(), this.speed);
        }
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    setSpeed(speed) {
        this.speed = speed;
        this.stop();
        this.start();
    }

    getNeighbours(i, j) {
        // Adding the follwing pattern will let you go to all the neighbours
        let pattern = [1,-1,0,1,1,0,-1,-1,1];
        let count = 0;
        for(let p=1;p<pattern.length;p++) {
            let x = i+pattern[p-1];
            let y = j+pattern[p];

            // Out of bounds range
            if(x < 0 || y < 0 || x >= width || y >= height) continue;

            count += this.grid[x][y];
        }
        return count;
    }

    generate() {

        // Set the previous values
        this.generation++;
        console.log("Generation: "+this.generation);

        for(let x=0;x<width;x++) {
            for(let y=0;y<height;y++) {
                this.next_state[x][y] = this.grid[x][y];
            }
        }

        // Algorithm
        // if isalive => if_alive_neighbours_in_range (2, 3) ? stay_alive : kill_your_self
        // if dead => if_alive_neighbours_in_range (3) ? become alive : stay_dead
        for(let x=0;x<width;x++) {
            for(let y=0;y<height;y++) {
                let neighbours = this.getNeighbours(x, y);
                //console.log(neighbours);
                if(neighbours > 3 || neighbours < 2) this.next_state[x][y] = 0;
                else if(neighbours == 3) this.next_state[x][y] = 1;
            }
        }

        for(let x=0;x<width;x++) {
            for(let y=0;y<height;y++) {
                this.grid[x][y] = this.next_state[x][y];
            }
        }
        drawGraph(this.grid);
    }
}

let gol = new GameOfLife(grid, setSpeed.value);

startButton.addEventListener('click', () => gol.start());
stopButton.addEventListener('click', () => gol.stop());
setSpeed.addEventListener('change', (eve) => gol.setSpeed(eve.target.value));

drawGraph(); 
