class Canvas {
    
    constructor(gridSize) {

        // Canvas Element
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Bind UI buttons
        this.clearButton = document.getElementById('clear-button');
        this.startButton = document.getElementById('start-button');
        this.stopButton = document.getElementById('stop-button');
        this.setSpeed = document.getElementById('set-speed');

        this.animationRate = 1000;

        this.gridSize = gridSize;
        this.height = this.canvas.height / this.gridSize;
        this.width = this.canvas.width / this.gridSize;

        // Temporary array for drag-feature
        this.positions = [];

        this.grid = new Array(this.height).fill(null).map(() => new Array(this.width));
        this.grid.forEach(array => array.fill(0));

        // Keep track of mouse-event
        this.clicked = 1;
    }

    configure() {
        this.fillArray();
        this.drawGraph();

        // For adding co-ordinates
        this.canvas.addEventListener('click', (eve) => this.getMouseCoords(eve));

        this.canvas.addEventListener('mouseup', function () {
            this.clicked^=1;
        });

        let object_instance = this;
        this.canvas.addEventListener('mousedown', function (click_event, object = object_instance) {
            this.clicked^=1;

            // toggle cell state
            const {x, y} = object.getMouseCoords(click_event);

            object.positions.push([x, y]);
            object.grid[x][y]^=1;

            object.drawGraph();
        });

    }

    zoomEnabled() {
        return this.gridSize < 20;
    }

    fillArray() {
        this.grid = new Array(this.height).fill(null).map(() => new Array(this.width));
        this.grid.forEach(array => array.fill(0));
        this.grid[1][2] = 1;        
        this.grid[2][2] = 1;        
    }

    drawGraph() {
        const ctx = this.ctx, canvas = this.canvas, gridSize = this.gridSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(this.zoomEnabled() == false) {
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
    
        for(let x=0;x<this.height;x++) {
            for(let y=0;y<this.width;y++) {
                if(this.grid[x][y]) {
                    ctx.fillStyle = 'white';
                    // Remove to fit the length
                    const remove_length = this.zoomEnabled() ? 0 : -2;
                    // Add offset when grids are enabled
                    const offset = this.zoomEnabled() ? 0 : 1;
                    ctx.fillRect(x * gridSize + offset, y * gridSize + offset, gridSize + remove_length, gridSize + remove_length);
                }
            }
        }
    }


    getMouseCoords (click_event) {
        const rect = this.canvas.getBoundingClientRect();
        const res = {
            x: Math.floor((click_event.clientX - rect.left) / this.gridSize),
            y: Math.floor((click_event.clientY - rect.top) / this.gridSize)
        }
        console.log(res);
        return res;
    }

}

class Instance {

    constructor() {
        // Bind UI buttons
        this.zoomList = [2,5,10,20,50,80];
        this.zoomAt = 2;
        this.zoomIn = document.getElementById('zoom-in');
        this.zoomOut = document.getElementById('zoom-out');

        // default Button size
        this.gridSize;
    }

    configure() {

        this.zoomIn.addEventListener('click', () => {
            this.zoomAt = Math.min(this.zoomList.length-1, this.zoomAt+1);
            this.reconfigureCanvas();
        });
        this.zoomOut.addEventListener('click', () => {
            this.zoomAt = Math.max(0, this.zoomAt-1);
            this.reconfigureCanvas();
        });

        this.reconfigureCanvas();
    }

    setGridSize() {
        this.gridSize = this.zoomList[this.zoomAt];
    }

    reconfigureCanvas() {
        this.setGridSize();
        this.canvas = new Canvas(this.gridSize);
        this.canvas.configure();
    }

}

const instance = new Instance(); 
instance.configure();

/*

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

(function onStart() {
    grid[40][40] = grid[40][39] = grid[40][41] = grid[39][40] = grid[41][41] = 1;
})()

drawGraph(); 
*/
