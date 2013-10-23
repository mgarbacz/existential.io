Shape = require 'modules/shape'
SnapPoint = require 'modules/snap_point'

module.exports = class Canvas
  constructor: (@canvas) ->
    @context = @canvas.getContext '2d'
    @width = @canvas.width
    @height = @canvas.height
    # Create 9 snap points
    @snapPoints = [
      #              x           y            name
      new SnapPoint  @width / 2, 0,           'top'
      new SnapPoint  0,          0,           'top-left'
      new SnapPoint  @width,     0,           'top-right'
      new SnapPoint  @width / 2, @height / 2, 'mid'
      new SnapPoint  0,          @height / 2, 'mid-left'
      new SnapPoint  @width,     @height / 2, 'mid-right'
      new SnapPoint  @width / 2, @height,     'bot'
      new SnapPoint  0,          @height,     'bot-left'
      new SnapPoint  @width,     @height,     'bot-right'
    ]

  init: ->

  clearCanvas: ->
    @context.clearRect 0, 0, @width, @height

  # Select tool passed in
  selectTool: (tool, action) ->
    if action is 'draw' then @drawSnapPoints() else @clearCanvas()

    if tool is 'rect' then @drawRect()

    'move your mouse near a snap point and click to ' + action

  drawSnapPoints: ->
    @clearCanvas()
    @context.lineWidth = 1
    @context.strokeStyle = '#333333'
    @context.fillStyle = '#f0ad4e'
    for point in @snapPoints
      @context.beginPath()
      @context.arc point.x, point.y, point.radius, 0, Math.PI * 2, false
      @context.stroke()
      @context.fill()
      @context.closePath()

  drawRect: ->
    @canvas.addEventListener 'mousedown', (e) =>
      # Find the x and y within canvas
      bounds = @canvas.getBoundingClientRect()
      x = e.clientX - bounds.left
      y = e.clientY - bounds.top

      # TODO - generalize this to any step
      writeStep = (start, end) ->
        $('#rect-1')
          .html('<p class="alert alert-info">Draw a rectangle from ' +
            start + ' to ' + end + '</p>')

      for point in @snapPoints
        # Is it near a snap point?
        withinX = Math.abs(point.x - x) < point.radius
        withinY = Math.abs(point.y - y) < point.radius

        if withinX and withinY
          # TODO - generalize this to any step
          $('#controls-steps').append '<p id="rect-1"></p>'
          writeStep point.name, point.name

          # Listen for mouse drags to draw rect
          window.addEventListener 'mousemove', (moveEvent) =>
            rectWidth = moveEvent.clientX - bounds.left
            rectHeight = moveEvent.clientY - bounds.top

            @drawSnapPoints()
            @context.strokeStyle = '#333333'
            @context.fillStyle = '#5BC0DE'
            @context.beginPath()
            @context.rect point.x, point.y,
                          - (point.x - rectWidth)
                          - (point.y - rectHeight)
            @context.stroke()
            @context.fill()
            @context.closePath()

            writeStep point.name, rectWidth + ' ' + rectHeight

            # Save context of mousemove event
            dragListener = arguments.callee
            @canvas.addEventListener 'mouseup', (e) =>
              # Stop listening for drag events
              window.removeEventListener 'mousemove', dragListener
          # Found our snap point, can break from for loop
          break


