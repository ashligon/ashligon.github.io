const container = document.querySelector('.grid-container');

let gridSize = 8;
let bgColor = '#ffffff';
container.style.backgroundColor = bgColor;

function createGrid() {
    let gridWidth = container.offsetWidth / gridSize;
    container.style.gridTemplateColumns = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;

    for (let row = 0; row < gridSize; row++){
        for (let col = 0; col < gridSize; col++) {
            const square = document.createElement('div');
            square.classList.add('grid-item');
            square.style.backgroundColor = bgColor;

            // add numbering
            if (col == 0) {
                square.innerHTML += "<p class='num-label'>" + (gridSize-row) + "</p>"
            } else if (row == gridSize-1) {
                square.innerHTML += "<p class='num-label'>" + (col+1) + "</p>"
            }

            container.appendChild(square);
        }
    }
}

createGrid();

