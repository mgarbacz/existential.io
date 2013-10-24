module.exports = class SnapPoint
  constructor: (@x, @y, @id) ->
    @radius = 4
    console.log @id + ' x:' + @x + ' y:' + @y
