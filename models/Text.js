function Text(text, color, font){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "Text";

  var _text = text;
  var _color = (color == undefined ? "black" : color);

  var _font = {
    "font-style": "normal",
    "font-variant": null,
    "font-weight": null,
    "font-size": null,
    "font-family": "sans-serif",
  };

  this.getText = function(){ return _text; };
  this.setText = function(text){ _text = text; };

  this.getColor = function(){ return _color; };
  this.setColor = function(color){ _color = color; };
  
  this.getFont = function(){ return _font; };
  this.setFont = function(font){
    for(var key in font){
      if(key in _font) _font[key] = font[key];
    }
  }

  this.scale = function(scale){
    font = this.getFont();
    size = font["font-size"];
    size = size.substr(0,size.length-2);
    if(parseInt(size) > 0){
      size = parseInt(size)*scale;
      this.setFont({"font-size":size+"px"});
    }
  }

  this.getFontString = function(){
    var str = "";
    var font = this.getFont();
    for(var key in font){
      if(font[key] != null)
        str += (str==""?"":" ")+font[key];
    }
    return str;
  }

  if(font != undefined) this.setFont(font);

  this.getDrawRotation = function(){
    if(this.getRotation() > (Math.PI/2)){
      return this.getRotation()+Math.PI;
    }else{
      return this.getRotation();
    }
  }

  this.beforeDraw = function(context){
    _parent.beforeDraw(context);
    context.strokeStyle = this.getColor();
    context.fillStyle = this.getColor()
    context.font = this.getFontString();
    context.textBaseline = "top";
  }

  this.draw = function(context){
    context.fillText(
      this.getText(),
      0,
      0
    )
  }
  
  this.afterDraw = function(context){
    _parent.afterDraw(context);
  }

  this.getCalculatedWidth = function(){
    if(this.getLayer() != null){
      var context = this.getLayer().getApplication().getContext();
      context.save();
      context.strokeStyle = this.getColor();
      context.fillStyle = this.getColor()
      context.font = this.getFontString();
      var width = context.measureText(this.getText()).width;
      context.restore();
      return width;
    }else{
      return _parent.getWidth();
    }
  }

  this.getCalculatedHeight = function(){
    var font = this.getFont();
    var fontSize = font["font-size"];

    if( 
      fontSize != null &&
      fontSize.substring(fontSize.length-2) == "px" &&
      parseInt(fontSize.substring(0, fontSize.length-2)) > 0
    ){
      return parseInt(fontSize.substring(0,fontSize.length-2));
    }else{
      return this.getHeight();
    }
  }

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    // Update actual width, now that we have access to the canvas.
    this.setWidth(this.getCalculatedWidth());
    this.setHeight(this.getCalculatedHeight());
  }

}
