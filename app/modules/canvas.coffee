Shape = require 'modules/shape'
SnapPoint = require 'modules/snap_point'

module.exports = class Canvas
  constructor: (@canvas) ->
    @context = @canvas.getContext '2d'
    @width = @canvas.width
    @height = @canvas.height
    @bounds = @canvas.getBoundingClientRect()
    # Create 9 snap points
    @snapPoints = [
      #              x           y            id
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
    @shapes = []
    console.log(this)

  init: ->
    @rectWidth = 0
    @rectHeight = 0
    @point = {}

  clearCanvas: ->
    @context.clearRect 0, 0, @width, @height

  # Select tool passed in
  selectTool: (tool, action) ->
    if action is 'draw' then @drawCanvas() else @drawShapes()

    if tool is 'rect' then @drawRect() else @canvas.removeEventListener 'mousedown', @

    'move your mouse near a snap point and click to ' + action

  drawCanvas: ->
    @clearCanvas()
    @drawSnapPoints()
    @drawShapes()

  drawSnapPoints: ->
    @context.lineWidth = 1
    @context.strokeStyle = '#333333'
    @context.fillStyle = '#f0ad4e'
    for point in @snapPoints
      @context.beginPath()
      @context.arc point.x, point.y, point.radius, 0, Math.PI * 2, false
      @context.stroke()
      @context.fill()
      @context.closePath()

  drawShapes: ->
    $('#controls-steps').html '<h5 class="text-info">Steps</h5>'
    @context.lineWidth = 1
    @context.strokeStyle = '#333333'
    @context.fillStyle = '#5BC0DE'
    for shape in @shapes
      @context.beginPath()
      @context.rect shape.x, shape.y, shape.width, shape.height
      @context.stroke()
      @context.fill()
      @context.closePath()
      $('#controls-steps')
        .append('<p class="alert alert-info">Draw a rectangle from ' +
          shape.start + ' to ' + shape.end + '</p>')

  handleEvent: (event) ->
    if (event.type is 'mousedown')
      @handleMouseDown(event)
    if (event.type is 'mousemove')
      @handleMouseMove(event)
    else if (event.type is 'mouseup')
      @canvas.removeEventListener 'mousemove', @
      window.removeEventListener 'mouseup', @
      shape = new Shape(@point.x, @point.y, @rectWidth, @rectHeight, @point.id,
        '(' + @rectWidth + ' ' + @rectHeight + ')','rect')
      @shapes.push shape

  handleMouseMove: (moveEvent) ->
    @rectWidth = moveEvent.clientX - @bounds.left - @point.x
    @rectHeight = moveEvent.clientY - @bounds.top - @point.y

    x = moveEvent.clientX - @bounds.left
    y = moveEvent.clientY - @bounds.top

    console.log 'x: %s, y: %s', x, y

    @drawCanvas()
    @context.strokeStyle = '#333333'
    @context.fillStyle = '#5BC0DE'
    @context.beginPath()
    @context.rect @point.x, @point.y, @rectWidth, @rectHeight
    @context.stroke()
    @context.fill()
    @context.closePath()

    @writeStep @point.id, '(' + @rectWidth + ',' + @rectHeight + ')'

  handleMouseDown: (e) ->
    # Find the x and y within canvas
    x = e.clientX - @bounds.left
    y = e.clientY - @bounds.top

    for point in @snapPoints
      # Is it near a snap point?
      withinX = Math.abs(point.x - x) < point.radius
      withinY = Math.abs(point.y - y) < point.radius

      if withinX and withinY
        @point = point
        @writeStep @point.id, @point.id
        # Listen for mouse drags to draw rect
        @canvas.addEventListener 'mousemove', @
        # Listen for mouseup to stop drawing
        window.addEventListener 'mouseup', @
        # Found our snap point, can break from for loop
        break

  # TODO - generalize this to any step
  writeStep: (start, end) ->
    $('#controls-steps').append('<p id="rect-1" class="alert alert-info">Draw a rectangle from ' + start + ' to ' + end + '</p>')

  drawRect: ->
    @canvas.addEventListener 'mousedown', @
