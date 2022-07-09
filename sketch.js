const tiles = [];
const tileImages = [];

let grid = [];

const DIM = 20;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const rules = [
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK, DOWN],
        [BLANK, LEFT]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [UP, DOWN, LEFT],
        [BLANK, DOWN],
        [UP, RIGHT, DOWN]
    ],
    [
        [RIGHT, DOWN, LEFT],
        [UP, LEFT, DOWN],
        [RIGHT, UP, LEFT],
        [BLANK, LEFT]
    ],
    [
        [BLANK, UP],
        [LEFT, UP, DOWN],
        [LEFT, RIGHT, UP],
        [RIGHT, UP, DOWN]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [BLANK, RIGHT],
        [RIGHT, LEFT, UP],
        [UP, DOWN, RIGHT]
    ]
];

function preload() {
    const path = "tiles";
    tiles[0] = loadImage(`${path}/blank.png`);
    tiles[1] = loadImage(`${path}/up.png`);
    tiles[2] = loadImage(`${path}/right.png`);
    tiles[3] = loadImage(`${path}/down.png`);
    tiles[4] = loadImage(`${path}/left.png`);
}

function setup() {
    createCanvas(800, 800);

    for(let i = 0; i < DIM * DIM; i++) {
        grid[i] = {
            collapsed: false,
            options: [BLANK, UP, RIGHT, DOWN, LEFT]
        }
    }
}

function checkValid(arr, valid) {
    for(let i = arr.length - 1; i >= 0; i--) {
        let element = arr[i];
        if(!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

function mousePressed() {
    redraw();
}

function draw() {
    background(151);

    const w = width / DIM;
    const h = height / DIM;

    for(let y = 0; y < DIM; y++) {
        for(let x = 0; x < DIM; x++) {
            let cell = grid[x + y * DIM];
            if(cell.collapsed) {
                let index = cell.options[0];
                image(tiles[index], x * w, y * h, w, h);
            } else {
                fill(0);
                stroke(51);
                rect(x * w, y * h, w, h);
            }
        }
    }

    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter(x => !x.collapsed);

    if(gridCopy.length == 0) {
        return;
    }

    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length;
    });
    
    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
        if(gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }
    if(stopIndex > 0) {
        gridCopy.splice(stopIndex);
    }

    const cell = random(gridCopy);
    cell.collapsed = true;
    const pick = random(cell.options);
    cell.options = [pick];

    const nextGrid = [];
    for(let y = 0; y < DIM; y++) {
        for(let x = 0; x < DIM; x++) {
            let index = x + y * DIM;

            if(grid[index].collapsed) {
                nextGrid[index] = grid[index];
            }
            else {
                let options = [BLANK, UP, RIGHT, DOWN, LEFT];
                
                // Look up
                if(y > 0) {
                    let up = grid[x + (y - 1) * DIM];
                    let validOptions = [];
                    for (const option of up.options) {
                        let valid = rules[option][2];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }

                // Look right
                if(x < DIM - 1) {
                    let right = grid[x + 1 + y * DIM];
                    let validOptions = [];
                    for (const option of right.options) {
                        let valid = rules[option][3];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }

                // Look down
                if(y < DIM - 1) {
                    let down = grid[x + (y + 1) * DIM];
                    let validOptions = [];
                    for (const option of down.options) {
                        let valid = rules[option][0];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }

                // Look left
                if(x > 0) {
                    let left = grid[x - 1 + y * DIM];
                    let validOptions = [];
                    for (const option of left.options) {
                        let valid = rules[option][1];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }


                nextGrid[index] = { 
                    options,
                    collapsed: false 
                };
            }
        }
    }

    grid = nextGrid;
}