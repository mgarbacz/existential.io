import { Shape } from './shape';
import { SnapPoint } from './snap_point';

export class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.bounds = this.canvas.getBoundingClientRect();
    // Create 9 snap points
    this.snapPoints = [
      //              x               y                id
      new SnapPoint(  this.width / 2, 0,               'top'       ),
      new SnapPoint(  0,              0,               'top-left'  ),
      new SnapPoint(  this.width,     0,               'top-right' ),
      new SnapPoint(  this.width / 2, this.height / 2, 'mid'       ),
      new SnapPoint(  0,              this.height / 2, 'mid-left'  ),
      new SnapPoint(  this.width,     this.height / 2, 'mid-right' ),
      new SnapPoint(  this.width / 2, this.height,     'bot'       ),
      new SnapPoint(  0,              this.height,     'bot-left'  ),
      new SnapPoint(  this.width,     this.height,     'bot-right' ),
    ];
    this.shapes = [];
  }

  init() {
    this.rectWidth = 0;
    this.rectHeight = 0;
    this.point = {};
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  selectTool(tool, action) {
    if (action === 'draw') {
      this.drawCanvas();
    } else {
      this.drawShapes();
    }

    if (tool === 'rect') {
      this.drawRect();
    } else {
      this.canvas.removeEventListener('mousedown', this);
    }

    return 'move your mouse near a snap point and click to ' + action;
  }

  drawCanvas() {
    this.clearCanvas();
    this.drawSnapPoints();
    this.drawShapes();
  }

  drawSnapPoints() {
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#333333';
    this.context.fillStyle = '#f0ad4e';
    for (var point of this.snapPoints) {
      this.context.beginPath();
      this.context.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
    }
  }

  drawShapes() {
    $('#controls-steps').html('<h5 class="text-info">Steps</5>');
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#333333';
    this.context.fillStyle = '#5BC0DE';
    for (var shape of this.shapes) {
      this.context.beginPath();
      this.context.rect(shape.x, shape.y, shape.width, shape.height);
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
      $('#control-steps').append(`<p class="alert alert-info">Draw a rectangle from ${shape.start} to ${shape.end}</p>`);
    }
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.handleMouseDown(event);
    } else if (event.type === 'mousemove') {
      this.handleMouseMove(event);
    } else if (event.type === 'mouseup') {
      this.canvas.removeEventListener('mousemove', this);
      window.removeEventListener('mouseup', this);
      const shape = new Shape(this.point.x, this.point.y, 
        this.rectWidth, this.rectHeight, this.point.id,
        `(${this.rectWidth} ${this.rectHeight})`, 'rect');
      this.shapes.push(shape);
    }
  }

  handleMouseMove(moveEvent) {
    this.rectWidth = moveEvent.clientX - this.bounds.left - this.point.x;
    this.rectHeight = moveEvent.clientY - this.bounds.top - this.point.y;

    const x = moveEvent.clientX - this.bounds.left;
    const y = moveEvent.clientY - this.bounds.top;

    this.drawCanvas();
    this.context.strokeStyle = '#333333';
    this.context.fillStyle = '#5BC0DE';
    this.context.beginPath();
    this.context.rect(this.point.x, this.point.y, this.rectWidth, this.rectHeight);
    this.context.stroke();
    this.context.fill();
    this.context.closePath();

    this.writeStep(this.point.id, `(${this.rectWidth},${this.rectHeight})`);
  }

  handleMouseDown(mouseEvent) {
    // Find the x and y within canvas
    const x = mouseEvent.clientX - this.bounds.left;
    const y = mouseEvent.clientY - this.bounds.top;

    for (var point of this.snapPoints) {
      // Is it near a snap point?
      const withinX = Math.abs(point.x - x) < point.radius;
      const withinY = Math.abs(point.y - y) < point.radius;

      if (withinX && withinY) {
        this.point = point;
        this.writeStep(this.point.id, this.point.id);
        // Listen for more mouse drags to draw rect
        this.canvas.addEventListener('mousemove', this);
        // Listen for mouseup to stop drawing
        this.canvas.addEventListener('mouseup', this);
        // Found our snap point, can break from for loop
        break;
      }
    }
  }

  writeStep(start, end) {
    $('#controls-steps').append(`<p id="rect-1" class="alert alert-info">Draw a rectangle from ${start} to ${end}</p>`);
  }

  drawRect() {
    this.canvas.addEventListener('mousedown', this);
  }
}