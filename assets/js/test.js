const container = document.querySelector('.grid-container');
const clearButton = document.querySelector('#clear-grid-btn');
const eraserButton = document.querySelector('#eraser-btn');
const allButtons = document.getElementsByTagName('button');

let gridSize = 28;
let gridBgColor = '#ffffff';
let gridInkColor = '#000000';
let inkEraser = false;

container.style.backgroundColor = gridBgColor;

// grid
function createGrid() {
    let gridWidth = container.offsetWidth / gridSize;
    container.style.gridTemplateColumns = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;

    for (let row = 0; row < gridSize; row++){
        for (let col = 0; col < gridSize; col++) {
            const square = document.createElement('div');
            square.classList.add('grid-item');
            square.style.backgroundColor = gridBgColor;

            // add numbering
            // TODO: fix formatting when numbers get too big
            // maybe we only want nums when we export to pdf
            // if (col == 0) {
            //     const num_label = document.createElement('div');
            //     num_label.style.backgroundColor = gridBgColor;
            //     num_label.style.float = 'left';
            //     num_label.innerHTML += `<p class='num-label'>${(gridSize-row)}</p>`;
            //     square.appendChild(num_label);
            // } else if (row == gridSize-1) {
            //     const num_label = document.createElement('div');
            //     num_label.style.backgroundColor = gridBgColor;
            //     num_label.style.float = 'bottom';
            //     num_label.innerHTML += `<p class='num-label'>${(col+1)}</p>`;
            //     square.appendChild(num_label);
            // }

            container.appendChild(square);
        }
    }
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeEventListener('mousedown', drawGridClick);
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

function drawGridClick(e) {
  if (inkEraser) {
    e.target.style.backgroundColor = gridBgColor;
    e.target.removeAttribute('data-inked');
  } else {
    e.target.style.backgroundColor = gridInkColor;
    e.target.setAttribute('data-inked', 'true');
  }
}

// slider
function rangeSlider(value) {
  gridSize = parseInt(value);
  deleteGrid();
  createGrid();
  listen();
}

function rangeSliderValue(value) {
  let gridLabels = document.querySelectorAll('#range-value');
  for (let i = 0; i < gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }
}

// clear
function clearGrid() {
  if (confirm("are you sure you want to clear your work?")) {
    gridItems = document.querySelectorAll('.grid-item');
    for (let i = 0; i < gridItems.length; i++) {
      gridItems[i].style.backgroundColor = gridBgColor;
      gridItems[i].removeAttribute('data-inked');
    }
    container.style.backgroundColor = gridBgColor;
  }

  setTimeout(function () {
    clearButton.classList.remove('btn-on');
  }, 800);
}

// listeners
function listen() {
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', drawGridClick);
  }

  eraserButton.addEventListener('click', () => {
    if (inkEraser) {
      inkEraser = false;
    } else {
      inkEraser = true;
    }
  });

  clearButton.addEventListener('click', clearGrid); 

  // toggle button styling when clicked
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', () => {
      allButtons[i].classList.toggle('btn-on');
    });
  }
}

// initial calls
createGrid();
listen();