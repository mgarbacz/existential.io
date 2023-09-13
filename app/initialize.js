import { Canvas } from "./modules/canvas";
import { KeyCodes } from "./helpers/key_codes";

// Check if key is a shortcut and select corresponding tool
const handleKeyDown = function(keyCode, reporter) {
  switch (keyCode) {
    // Draw
    case KeyCodes.r:
      return $('#shortcut-draw-rect').click();
    case KeyCodes.d:
      return $('#shortcut-draw-line').click();
    case KeyCodes.c:
      return $('#shortcut-draw-circle').click();
    // Adjust
    case KeyCodes.x:
      return $('#shortcut-adjust-move').click();
    case KeyCodes.s:
      return $('#shortcut-adjust-scale').click();
    case KeyCodes.e:
      return $('#shortcut-adjust-rotate').click();
    // Flow
    case KeyCodes.l:
      return $('#shortcut-flow-loop').click();
  }
};

$(function() {
  // Make sure canvas has proper height/width
  const canvasWrapper = $('#guided-canvas');
  const canvasEl = document.getElementById('guided-canvas');
  const scale = window.devicePixelRatio;
  const canvasSize = canvasWrapper.width();

  // Set display size (css pixels)
  canvasEl.style.width = `${Math.floor(canvasSize)}px`;
  canvasEl.style.height = `${Math.floor(canvasSize / 2)}px`;

  // Set actual size in memory, scaled by pixel density
  canvasEl.width = Math.floor(canvasSize * scale);
  canvasEl.height = Math.floor(canvasSize / 2 * scale);

  const canvas = new Canvas(canvasEl, scale);
  canvas.context.scale(scale, scale);

  // Load up the DYD magic
  canvas.init();

  // Listen for keyboard events to check if shortcut
  $(document).keydown(function(e) {
    return handleKeyDown(e.keyCode);
  });

  // Listen for click events on tool list
  $('#shortcuts dl > dt').click((e) => {
    // Highlight chosen tool
    $('#shortcuts dl > dt').removeClass('highlight-tool');
    $(e.currentTarget).addClass('highlight-tool');

    console.log('toto');

    // Select the tool in the canvas
    const tool = $(e.currentTarget).data('tool');
    const action = $(e.currentTarget).data('action');
    $('#guided-step').text(canvas.selectTool(tool, action));
  });
});