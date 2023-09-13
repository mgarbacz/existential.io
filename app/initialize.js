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
  const canvasElement = $('#guided-canvas');
  canvasElement[0].width = canvasElement.width();
  canvasElement[0].height = canvasElement.width() / 2;

  // Load up the DYD magic
  const canvas = new Canvas(canvasElement[0]);
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