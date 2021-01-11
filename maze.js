const COLUMNS = 20;
const ROWS = 20;
const CONTAINER_ID = 'maze-container';
const DIRECTIONS = ['right', 'left', 'bottom', 'top'];
let lastCell;
let firstCell;

const generateMazeTable = () => {
    let mazeContainer = document.getElementById(CONTAINER_ID);
    let maze = document.createElement('table');

    for (i = 0; i < ROWS; i++) {
        let row = document.createElement('tr');

        for (j = 0; j < COLUMNS; j++) {
            let column = document.createElement('td');
            column.style.borderBottom = '1px #000000 solid';
            column.style.borderTop = '1px #000000 solid';
            column.style.borderRight = '1px #000000 solid';
            column.style.borderLeft = '1px #000000 solid';
            column.setAttribute('id', (i * ROWS) + j);
            row.appendChild(column);
        }

        maze.appendChild(row);
    }

    mazeContainer.appendChild(maze);
    
    lastCell = document.getElementById(ROWS * COLUMNS - 1);
    firstCell = document.getElementById(0);
    lastCell.innerHTML = 'end';
    firstCell.innerHTML = 'start';
}

const pavePath = (currentCell, stopAtDeadEnd) => {
    let index;
    let nextID;
    let prevCellsIndexes = [];
    let nextOptions = [];
    
    while (+currentCell.id < +lastCell.id) {
        nextOptions = getNextCellsAvailable(currentCell);

        if (nextOptions.length === 0) {
            currentCell.classList.add('occupied'); // to prevent going over this cell again

            if (stopAtDeadEnd) {
                break;
            } 

            currentCell = document.getElementById(prevCellsIndexes[prevCellsIndexes.length - 1]); // go back
            prevCellsIndexes.pop(); // pop last cell which is not the current cell
            continue;
        }

        index = getRandomInt(nextOptions.length);

        switch(nextOptions[index]) {
            case 'right': {
                nextID = +currentCell.id + 1;
                document.getElementById(nextID).style.borderLeft = 'none';
                break;
            }
            case 'left': {
                nextID = +currentCell.id - 1;
                document.getElementById(nextID).style.borderRight = 'none';
                break;
            }
            case 'bottom': {
                nextID = +currentCell.id + ROWS;
                document.getElementById(nextID).style.borderTop = 'none';
                break;
            }
            case 'top': {
                nextID = +currentCell.id - ROWS;
                document.getElementById(nextID).style.borderBottom = 'none';
                break;
            }
        }
        currentCell.style['border-' + nextOptions[index]] = 'none';
        currentCell.classList.add('occupied');
        prevCellsIndexes.push(currentCell.id);
        currentCell = document.getElementById(nextID);
    }
}

const getNextCellsAvailable = (currentCell) => {
    let nextOptions = [];

    let currentRow = Math.floor(+currentCell.id / ROWS);

    for (i = 0; i < DIRECTIONS.length; i++) {
        switch(DIRECTIONS[i]) {
            case 'right':
                nextRow = Math.floor((+currentCell.id + 1) / ROWS);
                nextPossibleCell =  (nextRow !== currentRow) ?
                                    null :
                                    document.getElementById(+currentCell.id + 1);
                break;
            case 'left':
                lastRow = Math.floor((+currentCell.id - 1) / ROWS);
                nextPossibleCell =  (lastRow !== currentRow) ?
                                    null :
                                    document.getElementById(+currentCell.id - 1);
                break;
            case 'bottom':
                nextPossibleCell = document.getElementById(+currentCell.id + ROWS);
                break;
            case 'top':
                nextPossibleCell = document.getElementById(+currentCell.id - ROWS);
                break;
        }
        if (nextPossibleCell !== null && !nextPossibleCell.classList.contains('occupied')) { 
            nextOptions.push(DIRECTIONS[i]);
        }
    }

    return nextOptions;
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

(function() {
    generateMazeTable();

    pavePath(firstCell, false);

    for (r = 0; r < ROWS; r++) {
        for(c = 0; c < COLUMNS; c++) {
            const index = (r * ROWS) + c;
            let startCell = document.getElementById(index);
            pavePath(startCell, true);
        }
    }
 })();

