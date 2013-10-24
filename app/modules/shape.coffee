module.exports = class Shape
  constructor: (@x, @y, @width, @height, @id) ->
    console.log @id + ' x:' + @x + ' y:' + @y + ' w:' + @width + ' h:' + @height
