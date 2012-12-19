function FilledRectangle(fill, stroke, lineWidth){
  var _self = inherit(this, new Rectangle(stroke,lineWidth));
  var _parent = _self._parent;
  this.className = "FilledRectangle";

  var _fill = fill;

  this.setFill = function(fill){ _fill = fill; }
  this.getFill = function(){ return _fill; }

  /**
   * @overide Shape.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    context.fillStyle = this.getFill();
    context.fill();
  }
}
