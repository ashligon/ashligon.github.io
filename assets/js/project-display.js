let images = [
  '/assets/img/crochet/granny-square-black.png',
  '/assets/img/crochet/granny-square-gray.png',
  '/assets/img/crochet/granny-square-pepper.png',
  '/assets/img/crochet/granny-square-white.png',
  // '/assets/img/crochet/work-in-progress.png',
  // '/assets/img/crochet/capybara.png',
  // '/assets/img/crochet/button-keychain.png',
  // '/assets/img/crochet/star-keychain.png',
]
let counter = 0;

function cycleImages() {
  displayImage = document.getElementById('display-img');

  var changeImage = function() {
    counter = (counter + 1) % images.length;
    displayImage.src = images[counter];
  }

  setInterval(changeImage, 500);
}

cycleImages();
