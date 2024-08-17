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
        this.points = [];

    }

    fillArray() {
        this.grid = new Array(this.height).fill(null).map(() => new Array(this.width));
        this.grid.forEach(array => array.fill(0));
    }
}

class Instance {

    constructor() {
        // Bind UI buttons
        this.zoomList = [2,5,10,20,50,80];
        this.zoomAt = 2;
        this.zoomIn = document.getElementById('zoom-in');
        this.zoomOut = document.getElementById('zoom-out');

        this.zoomIn.addEventListener('click', () => {
            this.zoomAt = Math.min(this.zoomList.length-1, this.zoomAt+1);
            this.reconfigureCanvas();
        });
        this.zoomOut.addEventListener('click', () => {
            this.zoomAt = Math.max(0, this.zoomAt-1);
            this.reconfigureCanvas();
        });

        // default Button size
        this.gridSize;
        this.reconfigureCanvas();
    }

    setGridSize() {
        this.gridSize = this.zoomList[this.zoomAt];
    }

    reconfigureCanvas() {
        this.setGridSize();
        this.canvas = new Canvas(this.gridSize);
    }

}

const instance = new Instance(); 
