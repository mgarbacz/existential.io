Canvas = require 'modules/canvas'

# Check if key is a shortcut and select corresponding tool
handleKeyDown = (keyCode, reporter) ->
  switch keyCode
    # Draw
    when 82 then $('#shortcut-draw-rect').click()
    when 68 then $('#shortcut-draw-line').click()
    when 67 then $('#shortcut-draw-circle').click()
    # Adjust
    when 88 then $('#shortcut-adjust-move').click()
    when 83 then $('#shortcut-adjust-scale').click()
    when 69 then $('#shortcut-adjust-rotate').click()
    # Flow
    when 76 then $('#shortcut-flow-loop').click()

$ ->
  # Make sure canvas has proper height/width
  canvasElement = $('#guided-canvas')
  canvasElement[0].width = canvasElement.width()
  canvasElement[0].height = canvasElement.width() / 2

  # Load up the DYD magic
  canvas = new Canvas canvasElement[0]
  canvas.init()

  # Listen for keyboard events to check if shortcut
  $(document).keydown (e) ->
    handleKeyDown e.keyCode

  # Listen for click events on tool list
  $('#shortcuts dl > dt').click (e) ->
    # Highlight chosen tool
    $('#shortcuts dl > dt').removeClass 'highlight-tool'
    $(this).addClass 'highlight-tool'

    # Select the tool in the canvas
    tool = $(this).data('tool')
    action = $(this).data('action')
    $('#guided-step').text canvas.selectTool tool, action
