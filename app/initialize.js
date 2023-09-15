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
  const canvasEl = document.getElementById('guided-canvas');
  const scale = window.devicePixelRatio;
  const bounds = canvasEl.getBoundingClientRect();

  // Set display size (css pixels)
  canvasEl.style.width = `${Math.floor(bounds.width)}px`;
  canvasEl.style.height = `${Math.floor(bounds.height)}px`;

  // Set actual size in memory, scaled by pixel density
  canvasEl.width = Math.floor(bounds.width * scale);
  canvasEl.height = Math.floor(bounds.height * scale);

  const ctx = canvasEl.getContext('2d');
  ctx.scale(scale, scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const canvas = new Canvas(canvasEl, ctx);

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