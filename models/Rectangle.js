function Rectangle(stroke, lineWidth){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Rectangle";

  var _stroke = stroke;
  var _lineWidth = lineWidth;

  this.getStroke = function(){ return _stroke; }
  this.setStroke = function(stroke){ _stroke = stroke; }

  this.getLineWidth = function(){ return _lineWidth; }
  this.setLineWidth = function(lineWidth){ _lineWidth = lineWidth; }

  /**
   * @overide Shape.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    context.rect(
      this.getX(),
      this.getY(),
      this.getWidth(),
      this.getHeight()
    );
    context.lineWidth = this.getLineWidth();
    context.strokeStyle = this.getStroke();
    context.stroke();
  }

  this.getCalculatedWidth = function(){
    if(parseInt(this.getLineWidth())>0){
      return _parent.getWidth()+2*parseInt(this.getLineWidth());
    }else{
      return _parent.getWidth();
    }
  }
  
  this.getCalculatedHeight = function(){
    if(parseInt(this.getLineWidth())>0){
      return _parent.getHeight()+2*parseInt(this.getLineWidth());
    }else{
      return _parent.getHeight();
    }
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.stroke = this.getStroke();
    ex.lineWidth = this.getLineWidth();
    return ex;
  }

  this.import = function(elemStruct, references){
    _parent.import.call(this, elemStruct, references);
    if(elemStruct.stroke) this.setStroke(elemStruct.stroke);
    if(elemStruct.lineWidth) this.setLineWidth(elemStruct.lineWidth);
  }
}
