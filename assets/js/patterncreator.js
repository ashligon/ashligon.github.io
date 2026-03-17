
const container = document.querySelector('.grid-container');
const clearButton = document.querySelector('#clear-btn');
const eraserButton = document.querySelector('#eraser-btn');
const saveButton = document.querySelector('#save-btn');
const exportButton = document.querySelector('#export-btn');
const allButtons = document.getElementsByTagName('button');
const gridSlider = document.getElementById('grid-slider');
const mainWindow = document.querySelector('.main')

let gridSize = 28;
let gridBgColor = '#ffffff';
let gridInkColor = '#000000';
let inkEraser = false;
let mouseDown = false;
let db;

container.style.backgroundColor = gridBgColor;

/* grid */
function createGrid() {
    let savedGridSize = localStorage.getItem('saved-grid-size');
    if (savedGridSize !== null) {
      gridSize = savedGridSize;

      gridSlider.value = gridSize;
      let gridLabels = document.querySelectorAll('#range-value');
      for (let i = 0; i < gridLabels.length; i++) {
        gridLabels[i].textContent = gridSize;
      }
    }
    let savedGrid = localStorage.getItem('saved-progress');
    let savedGridMap = new Map();
    if (savedGrid !== null) {
      savedGridMap = new Map(Object.entries(JSON.parse(savedGrid)));
    }

    let gridWidth = container.offsetWidth / gridSize;
    container.style.gridTemplateColumns = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;

    for (let row = 0; row < gridSize; row++){
        for (let col = 0; col < gridSize; col++) {
            const square = document.createElement('div');
            square.classList.add('grid-item');
            square.classList.add('disable-selection');
            square.setAttribute('draggable', 'false');
            square.setAttribute('data-grid-col', col);
            square.setAttribute('data-grid-row', row);

            if (savedGridMap.get(`${col},${row}`) === 'true') {
              square.style.backgroundColor = gridInkColor;
              square.setAttribute('data-inked', 'true');
            } else {
              square.style.backgroundColor = gridBgColor;
            }

            // add numbering
            if (col == 0) {
                const num_label = document.createElement('p');
                num_label.classList.add('num-label');
                num_label.classList.add('disable-selection');
                num_label.classList.add('disable-selection-text');
                num_label.setAttribute('draggable', 'false');
                num_label.setAttribute('data-grid-col', col);
                num_label.setAttribute('data-grid-row', row);
                num_label.textContent += `${(gridSize-row)}`;
                square.appendChild(num_label);
            } else if (row == gridSize-1) {
                const num_label = document.createElement('p');
                num_label.classList.add('num-label');
                num_label.classList.add('disable-selection');
                num_label.classList.add('disable-selection-text');
                num_label.setAttribute('draggable', 'false');
                num_label.setAttribute('data-grid-col', col);
                num_label.setAttribute('data-grid-row', row);
                num_label.textContent += `${(col+1)}`;
                square.appendChild(num_label);
            }
            container.appendChild(square);
        }
    }
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeEventListener('mousedown', drawGridInk);
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

function mouseDownOn() {
  mouseDown = true;

  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mouseenter', drawGridInkHover);
  }
}

function mouseDownOff() {
  mouseDown = false;

  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].removeEventListener('mouseenter', drawGridInkHover);
  }
}

function drawGridInk(e) {
  // grab num label from grid item
  gridCol = e.target.getAttribute('data-grid-col');
  gridRow = e.target.getAttribute('data-grid-row');
  const label = document.querySelector(`p.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"]`);

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

function drawGridInkHover(e) {
  // make sure left-click mouse button is pressed
  if (mouseDown && (e.buttons > 0 && e.buttons === 1)) {
    // grab num label from grid item
    gridCol = e.target.getAttribute('data-grid-col');
    gridRow = e.target.getAttribute('data-grid-row');
    const label = document.querySelector(`p.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"]`);

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

function inkFound() {
  const inkFound = document.querySelectorAll("div[data-inked='true']");
  return (inkFound) && (inkFound.length > 0)
}

/* eraser */
function toggleEraser(e) {
  e.preventDefault()
  if (inkEraser) {
    inkEraser = false;
    eraserButton.textContent = 'toggle eraser';
    eraserButton.classList.remove('btn-on');
  } else {
    inkEraser = true;
    eraserButton.textContent = 'untoggle eraser';
    eraserButton.classList.toggle('btn-on');
  }
}

/* clear */
function clearGrid() {
  if (inkFound() && confirm('are you sure you want to clear your work?')) {
    gridItems = document.querySelectorAll('.grid-item');
    for (let i = 0; i < gridItems.length; i++) {
      gridItems[i].style.backgroundColor = gridBgColor;
      gridItems[i].removeAttribute('data-inked');

      gridCol = gridItems[i].getAttribute('data-grid-col');
      gridRow = gridItems[i].getAttribute('data-grid-row');
      const label = document.querySelector(`p.num-label[data-grid-col="${gridCol}"][data-grid-row="${gridRow}"]`);
      if (label) {
        label.style.color = gridInkColor;
      }
    }
    container.style.backgroundColor = gridBgColor;
    localStorage.clear();
  }

  setTimeout(function () {
    clearButton.classList.remove('btn-on');
  }, 800);
}

/* save */
function savePatternProgress(e) {
  gridMap = new Map();
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridMap.set(`${gridItems[i].getAttribute('data-grid-col')},${gridItems[i].getAttribute('data-grid-row')}`, gridItems[i].getAttribute('data-inked'));
  }
  const objFromMap = Object.fromEntries(gridMap);
  console.log(JSON.stringify(objFromMap))

  localStorage.setItem('saved-grid-size', gridSize)
  localStorage.setItem('saved-progress', JSON.stringify(objFromMap))

  var toast = document.getElementById('toast-notification-box');
  toast.textContent = 'progress saved';
  toast.className = 'show';

  setTimeout(function() {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}

/* export */
function exportPattern(e) {
  // e.preventDefault();

  html2canvas(document.querySelector("#capture"), {
    scale: window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio
  }).then(canvas => {
    // TODO: bring back once saved patterns are supported
    // canvas.toBlob(function(blob) {
    //   // TODO: add pop-up form so user can name their saved pattern
    //   addData("pattern1", blob);
    // }, 'image/png');
    var base64image = canvas.toDataURL("image/png");
    window.open(base64image , "_blank");
  });
}

/* db */
function initDB() {
  const openRequest = window.indexedDB.open("pattern_db", 1);

  openRequest.addEventListener("error", () =>
    console.error("database failed to open"),
  );

  openRequest.addEventListener("success", () => {
    console.log("database opened successfully");
    db = openRequest.result;
  });

  // set up db tables
  openRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;

    const objectStore = db.createObjectStore("patterns_os", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("imageBlob", "imageBlob", { unique: false });

    console.log("database setup complete");
  });
}

function addData(name, imageBlob) {
  const transaction = db.transaction(["patterns_os"], "readwrite");
  const objectStore = transaction.objectStore("patterns_os");

  const newItem = { name: name, imageBlob: imageBlob };
  const addRequest = objectStore.add(newItem);

  addRequest.addEventListener("success", () => {
    exportButton.classList.remove('btn-on');
  });

  transaction.addEventListener("complete", () => {
    console.log("transaction completed: database modification finished");
    displayData(name, imageBlob);
  });

  transaction.addEventListener("error", () =>
    console.log("transaction not opened due to error"),
  );
}

function deleteData(e) {
  // IDB key values are type-sensitive
  const patternId = Number(e.target.parentNode.getAttribute("data-pattern-id"));

  // open a database transaction and delete the task, finding it using the id we retrieved above
  const transaction = db.transaction(["patterns_os"], "readwrite");
  const objectStore = transaction.objectStore("patterns_os");
  const deleteRequest = objectStore.delete(patternId);

  transaction.addEventListener("complete", () => {
    console.log(`pattern ${patternId} deleted`);
  });
}

function displayData(name, imageBlob) {
  const section = document.querySelector('#saved-patterns-display')
  const imageURL = URL.createObjectURL(imageBlob);
  // TODO: add html
}

/* slider */
function rangeSlider(e) {
  var redraw = true;

  // if ink is on the grid, prompt the user before clearing and resizing
  if (inkFound() && !confirm("are you sure you want to clear your work?")) {
    redraw = false;
  }

  if (redraw) {
    gridSize = parseInt(e.target.value);
    localStorage.clear();
    deleteGrid();
    createGrid();
    listen();
  } else {
    // user cancelled, revert slider back to current grid size
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

/* window */
const handleOrientationChange = (e) => {
  if (e.matches) {
    document.getElementById('orientation-warning').style.display = "block";
    mainWindow.style.overflow = 'hidden';
  } else {
    document.getElementById('orientation-warning').style.display = "none";
    mainWindow.style.overflow = 'scroll';
  }
};

/* listeners */
function listen() {
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', drawGridInk);
  }
  mainWindow.addEventListener('contextmenu', toggleEraser);
  window.matchMedia('(orientation: portrait)').addEventListener('change', handleOrientationChange); 
  document.addEventListener('mousedown', mouseDownOn);
  document.addEventListener('mouseup', mouseDownOff);
  eraserButton.addEventListener('click', toggleEraser);
  clearButton.addEventListener('click', clearGrid);
  saveButton.addEventListener('click', savePatternProgress);
  exportButton.addEventListener('click', exportPattern);
  gridSlider.addEventListener('mousemove', updateRangeSliderValues);
  gridSlider.addEventListener('change', rangeSlider);
}

// initial calls
createGrid();
listen();
initDB();
handleOrientationChange(window.matchMedia('(orientation: portrait)'));