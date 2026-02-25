const container = document.querySelector('.grid-container');

let gridSize = 8;
let bgColor = '#ffffff';
container.style.backgroundColor = bgColor;

// grid

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
            // TODO: fix formatting when numbers get too big
            // maybe we only want nums when we export to pdf
            if (col == 0) {
                square.innerHTML += `<p class='num-label'>${(gridSize-row)}</p>`
            } else if (row == gridSize-1) {
                square.innerHTML += `<p class='num-label'>${(col+1)}</p>`
            }

            container.appendChild(square);
        }
    }
}

function deleteGrid() {
  while (container.firstChild) {
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

// slider

function rangeSlider(value) {
  gridSize = parseInt(value);
  deleteGrid();
  createGrid();
}

function rangeSliderValue(value) {
  let gridLabels = document.querySelectorAll('#range-value');
  for (let i = 0; i < gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }
}

// calls

createGrid();