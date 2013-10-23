module.exports = class SnapPoint
  constructor: (@x, @y, @name) ->
    @radius = 4
    console.log @name + ' x: ' + @x + ' y: ' + @y
