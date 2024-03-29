window.addEventListener('dragover', function(evt) {
  evt.preventDefault();
}, false);

window.addEventListener('drop', function(evt) {
  evt.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('div#content').addEventListener('drop', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    unhighlight();
    let data = evt.dataTransfer;
    let files = data.files;
    handleFiles(files);
  }, false);

  document.querySelector('div#content').addEventListener('dragenter', highlight, false);
  document.querySelector('div#content').addEventListener('dragover', highlight, false);
  document.querySelector('div#content').addEventListener('dragleave', unhighlight, false);
});

function handleFiles(files) {
	let filename = URL.createObjectURL(files[0]);
	let imageElement = document.createElement('img');
  imageElement.setAttribute('id', 'screenshot');
	imageElement.setAttribute('src', filename);
  document.querySelector('div#content').innerHTML = '';
	document.querySelector('div#content').appendChild(imageElement);

  setTimeout(function() {
    resizeBrowser();
  }, 500);
}

function highlight() {
  document.querySelector('div#content').classList.add('highlight');
}

function unhighlight() {
  document.querySelector('div#content').classList.remove('highlight');
}

function resizeBrowser() {
  let viewportElement = document.querySelector('section#device-viewport');
  let imgHeight = document.querySelector('img#screenshot').height;
  let headerHeight = 70;
  viewportElement.style.height = imgHeight + headerHeight + 'px';
}
