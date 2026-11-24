// Device Mockup Maker
// Drop, paste, or pick a screenshot to place it on the device's screen.

(function () {
  const content = document.querySelector('.screen-content');
  if (!content) return;

  const device = content.closest('.device');
  const picker = document.querySelector('#file-picker');
  let objectUrl = null;
  let dragDepth = 0;

  // Stop the browser from opening a file that misses the screen.
  ['dragover', 'drop'].forEach(function (type) {
    window.addEventListener(type, function (evt) {
      evt.preventDefault();
    });
  });

  // Drag and drop onto the screen.
  content.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
    dragDepth++;
    content.classList.add('highlight');
  });

  content.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  });

  content.addEventListener('dragleave', function () {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) content.classList.remove('highlight');
  });

  content.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    dragDepth = 0;
    content.classList.remove('highlight');
    showScreenshot(firstImage(evt.dataTransfer.files));
  });

  // Paste a screenshot from the clipboard.
  document.addEventListener('paste', function (evt) {
    if (evt.target.matches && evt.target.matches('input')) return;
    const items = Array.from(evt.clipboardData ? evt.clipboardData.items : []);
    const item = items.find(function (i) { return i.type.startsWith('image/'); });
    if (item) {
      evt.preventDefault();
      showScreenshot(item.getAsFile());
    }
  });

  // Click (or Enter/Space) on the empty screen to choose a file.
  function openPicker() {
    if (picker && !device.classList.contains('has-image')) picker.click();
  }

  content.addEventListener('click', openPicker);
  content.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      openPicker();
    }
  });

  if (picker) {
    picker.addEventListener('change', function () {
      showScreenshot(firstImage(picker.files));
      picker.value = '';
    });
  }

  function firstImage(files) {
    return Array.from(files || []).find(function (f) {
      return f.type.startsWith('image/');
    });
  }

  function showScreenshot(file) {
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);

    const img = new Image();
    img.alt = 'Screenshot';
    img.onload = function () {
      content.replaceChildren(img);
      content.scrollTop = 0;
      device.classList.add('has-image');
    };
    img.src = objectUrl;
  }

  // Address field: size the input to its text so the padlock stays beside it,
  // and let Enter finish editing.
  document.querySelectorAll('.url-field input').forEach(function (input) {
    const fit = function () { input.size = Math.max(input.value.length, 1); };
    fit();
    input.addEventListener('input', fit);
    input.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') input.blur();
    });
  });
})();
