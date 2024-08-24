let grid = null;

class Algorithm {
    constructor() {
    }
    next_state() {
        console.log("next_state");
    }
}

class GameOfLife extends Algorithm {
    constructor() {
        super();
        this.generation = 0;
        this.next_grid = null;
        this.height;
        this.width;
    }

    set setWidth(width_val) { this.width = width_val; }
    set setHeight(height_val) { this.height = height_val; }

    setIntialGlyph() {
        if(40 < this.height && 40 < this.width)
            [[40,24],[40,26],[40,25],[39,25],[41,26]].map(([x, y]) => grid[x][y] = 1);
    }

    getNeighbours(i, j) {
        // Adding the follwing pattern will let you go to all the neighbours

        let pattern = [1,-1,0,1,1,0,-1,-1,1];
        let count = 0;
        for(let p=1;p<pattern.length;p++) {
            let x = i+pattern[p-1];
            let y = j+pattern[p];

            // Out of bounds range
            if(x < 0 || y < 0 || x >= this.width || y >= this.height) continue;

            count += grid[x][y];
        }
        return count;
    }

    next_state() {
        // Set the previous values
        this.generation++;
        console.log("Generation: "+this.generation);

        const { height, width } = this;

        // set temporary array
        if(this.next_grid == null) {
            this.next_grid = new Array(width).fill(null).map((arr, idx) => Array.from(grid[idx]));
        } else {
            for(let x=0;x<width;x++) {
                for(let y=0;y<height;y++) {
                    this.next_grid[x][y] = grid[x][y];
                }
            }
        }

        // Algorithm
        // if isalive => if_alive_neighbours_in_range (2, 3) ? stay_alive : kill_your_self
        // if dead => if_alive_neighbours_in_range (3) ? become alive : stay_dead
        for(let x=0;x<width;x++) {
            for(let y=0;y<height;y++) {
                let neighbours = this.getNeighbours(x, y);
                if(neighbours > 3 || neighbours < 2) this.next_grid[x][y] = 0;
                else if(neighbours == 3) this.next_grid[x][y] = 1;
            }
        }

        for(let x=0;x<width;x++) {
            for(let y=0;y<height;y++) {
                grid[x][y] = this.next_grid[x][y];
            }
        }
    }
}
class Canvas {
    
    constructor(gridSize, algorithm = null) {

        // Canvas Element
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Bind UI buttons
        this.clearButton = document.getElementById('clear-button');
        this.startButton = document.getElementById('start-button');
        this.stopButton = document.getElementById('stop-button');
        this.speedButton = document.getElementById('set-speed');

        this.timer = null;

        this.animationRate = 1000;

        this.gridSize = gridSize;
        this.height = this.canvas.height / this.gridSize;
        this.width = this.canvas.width / this.gridSize;

        // Temporary array for drag-feature
        this.positions = [];

        grid = null;
        grid = new Array(this.width).fill(null).map(() => new Array(this.height));

        // Keep track of mouse-event
        this.clicked = 1;

        // Algorithm
        this.algorithm = algorithm;
        this.algorithm.setWidth = this.width;
        this.algorithm.setHeight = this.height;
    }

    configure() {
        this.fillArray();
        this.algorithm.setIntialGlyph();
        this.drawGraph();

        this.events = Object.create(null);

        this.events['click'] = (eve) => this.getMouseCoords(eve);
        // For adding co-ordinates
        let object_instance = this;

        this.events['mouseup'] = () => this.clicked^=1;

        this.events['mousedown'] = (click_event, object = object_instance) => {
            this.clicked^=1;

            // toggle cell state
            const {x, y} = object.getMouseCoords(click_event);

            object.positions.push([x, y]);
            grid[x][y]^=1;

            object.drawGraph();
        };

        this.events['mousemove'] = (click_event, object = object_instance) => {

            // toggle cell state
            const {x, y} = object.getMouseCoords(click_event);

            // save the values in set not to update it on every event trigger
            if(this.clicked
                || object.positions.find(([a, b]) => x == a && b == y))
                return;

            object.positions.push([x, y]);
            grid[x][y]^=1;

            object.drawGraph();
        };

        this.events['start'] = () => this.start();

        this.events['stop'] = () => this.stop();

        this.events['set-speed'] = (event) => this.setSpeed(event);

        this.events['clear-screen'] = () => {
            this.stopButton.click();
            this.fillArray();
            this.drawGraph();
        }

        this.canvas.addEventListener('click', this.events['click']);
        this.canvas.addEventListener('mouseup', this.events['mouseup']);
        this.canvas.addEventListener('mousedown', this.events['mousedown']);
        this.canvas.addEventListener('mousemove', this.events['mousemove']);
        this.startButton.addEventListener('click', this.events['start']);
        this.stopButton.addEventListener('click', this.events['stop']);
        this.speedButton.addEventListener('change', this.events['set-speed']);
        this.clearButton.addEventListener('click', this.events['clear-screen']);
    }

    destruct() {
        this.canvas.removeEventListener('click', this.events['click']);
        this.canvas.removeEventListener('mouseup', this.events['mouseup']);
        this.canvas.removeEventListener('mousedown', this.events['mousedown']);
        this.canvas.removeEventListener('mousemove', this.events['mousemove']);
        this.startButton.removeEventListener('click', this.events['start']);
        this.stopButton.removeEventListener('click', this.events['stop']);
        this.speedButton.removeEventListener('change', this.events['set-speed']);
        this.clearButton.removeEventListener('click', this.events['clear-screen']);
        clearInterval(this.timer);
    }

    zoomEnabled() {
        return this.gridSize < 20;
    }

    fillArray() {
        //if(grid == undefined || grid == null)
        //    grid = new Array(this.width).fill(null).map(() => new Array(this.height));
        grid.forEach(array => array.fill(0));
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
    
        for(let x=0;x<this.width;x++) {
            for(let y=0;y<this.height;y++) {
                if(grid[x][y]) {
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
        return {
            x: Math.floor((click_event.clientX - rect.left) / this.gridSize),
            y: Math.floor((click_event.clientY - rect.top) / this.gridSize)
        }
    }

    start() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.algorithm.next_state();
            this.drawGraph();
        } ,this.animationRate);
    }

    stop() {
        clearInterval(this.timer);
    }

    setSpeed(event) {
        this.animationRate = event.target.value;
        this.stop();
        this.start();
    }

}

class Instance {

    constructor(algorithm = null) {
        // Bind UI buttons
        this.zoomList = [2,5,10,20,50,80];
        this.zoomAt = 2;
        this.zoomIn = document.getElementById('zoom-in');
        this.zoomOut = document.getElementById('zoom-out');

        // default Button size
        this.gridSize;

        // Algorithm reference
        this.algorithm = algorithm;
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
        if(this.canvas) this.canvas.destruct();
        this.setGridSize();
        this.canvas = new Canvas(this.gridSize, this.algorithm);
        this.canvas.configure();
    }

}

const gameOfLife = new GameOfLife();
const instance = new Instance(gameOfLife); 
instance.configure();
