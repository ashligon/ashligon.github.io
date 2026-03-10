
const container = document.querySelector('.grid-container');
const clearButton = document.querySelector('#clear-btn');
const eraserButton = document.querySelector('#eraser-btn');
const saveButton = document.querySelector('#save-btn');
const allButtons = document.getElementsByTagName('button');
const gridSlider = document.getElementById('grid-slider');

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
            square.setAttribute('draggable', 'false');
            square.setAttribute('data-grid-col', col);
            square.setAttribute('data-grid-row', row);
            square.style.backgroundColor = gridBgColor;

            // add numbering
            if (col == 0) {
                const num_label = document.createElement('div');
                num_label.classList.add('num-label');
                num_label.classList.add('disable-selection');
                num_label.setAttribute('draggable', 'false');
                num_label.setAttribute('data-grid-col', col);
                num_label.setAttribute('data-grid-row', row);
                num_label.innerHTML += `<p class="disable-selection" draggable="false">${(gridSize-row)}</p>`;
                square.appendChild(num_label);
            } else if (row == gridSize-1) {
                const num_label = document.createElement('div');
                num_label.classList.add('num-label');
                num_label.classList.add('disable-selection');
                num_label.setAttribute('draggable', 'false');
                num_label.setAttribute('data-grid-col', col);
                num_label.setAttribute('data-grid-row', row);
                num_label.innerHTML += `<p class="disable-selection draggable="false"">${(col+1)}</p>`;
                square.appendChild(num_label);
            }
            container.appendChild(square);
        }
    }
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeEventListener('mousedown', drawGridClick);
    container.removeEventListener('mouseenter', drawGridClickHover);
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

function drawGridClick(e) {
  gridCol = e.target.getAttribute('data-grid-col');
  gridRow = e.target.getAttribute('data-grid-row');
  // grab num label from grid item
  const label = document.querySelector(`div.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"] p`);

  if (inkEraser) {
    e.target.style.backgroundColor = gridBgColor;
    e.target.removeAttribute('data-inked');
    if (label != null) {
      label.style.color = gridInkColor;
    }
  } else {
    e.target.style.backgroundColor = gridInkColor;
    e.target.setAttribute('data-inked', 'true');
    if (label != null) {
      label.style.color = gridBgColor;
    }
  }
}

// draw when hovering into a grid with the mouse held down
function drawGridClickHover(e) {
  if (e.shiftKey) {
    gridCol = e.target.getAttribute('data-grid-col');
    gridRow = e.target.getAttribute('data-grid-row');
    // grab num label from grid item
    const label = document.querySelector(`div.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"] p`);

    if (inkEraser) {
      e.target.style.backgroundColor = gridBgColor;
      e.target.removeAttribute('data-inked');
      if (label != null) {
        label.style.color = gridInkColor;
      }
    } else {
      e.target.style.backgroundColor = gridInkColor;
      e.target.setAttribute('data-inked', 'true');
      if (label != null) {
        label.style.color = gridBgColor;
      }
    }
  }
}

// eraser
function toggleEraser(e) {
  if (inkEraser) {
    inkEraser = false;
    e.target.textContent = 'toggle eraser';
    e.target.classList.remove('btn-on');
  } else {
    inkEraser = true;
    e.target.textContent = 'untoggle eraser';
    e.target.classList.toggle('btn-on');
  }
}

// clear
function clearGrid() {
  if (confirm("are you sure you want to clear your work?")) {
    gridItems = document.querySelectorAll('.grid-item');
    for (let i = 0; i < gridItems.length; i++) {
      gridItems[i].style.backgroundColor = gridBgColor;
      gridItems[i].removeAttribute('data-inked');

      gridCol = gridItems[i].getAttribute('data-grid-col');
      gridRow = gridItems[i].getAttribute('data-grid-row');
      const label = document.querySelector(`div.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"] p`);
      if (label) {
        label.style.color = gridInkColor;
      }
    }
    container.style.backgroundColor = gridBgColor;
  }

  setTimeout(function () {
    clearButton.classList.remove('btn-on');
  }, 800);
}

// save
function savePattern() {
  html2canvas(document.querySelector("#capture")).then(canvas => {
    var base64image = canvas.toDataURL("image/png");
    window.open(base64image , "_blank");
  });

  setTimeout(function () {
    saveButton.classList.remove('btn-on');
  }, 800);
}

// slider
function rangeSlider(e) {
  var redraw = true;

  // if ink is on the grid, prompt the user before clearing and resizing
  const inkFound = document.querySelectorAll("div[data-inked='true']");
  if ((inkFound) && (inkFound.length > 0) && !confirm("are you sure you want to clear your work?")) {
    redraw = false;
  }

  if (redraw) {
    gridSize = parseInt(e.target.value);
    deleteGrid();
    createGrid();
    listen();
  } else {
    // revert slider back to current grid size
    e.target.value = gridSize;
    updateRangeSliderValues(gridSize);
  }
}

function updateRangeSliderValues(e) {
  let gridLabels = document.querySelectorAll('#range-value');
  for (let i = 0; i < gridLabels.length; i++) {
    gridLabels[i].textContent = e.target.value;
  }
}

// listeners
function listen() {
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', drawGridClick);
    gridItems[i].addEventListener('mouseenter', drawGridClickHover);
  }
  eraserButton.addEventListener('click', toggleEraser);
  clearButton.addEventListener('click', clearGrid); 
  saveButton.addEventListener('click', savePattern);
  gridSlider.addEventListener('change', rangeSlider); 
  gridSlider.addEventListener('mousemove', updateRangeSliderValues); 
}

// initial calls
createGrid();
listen();