function Key(character){
  var _self = inherit(this, new FilledRectangle("#CCCCCC","#000000",2));
  var _parent = _self._parent;
  this.className = "Key";

  this.setDraggable(false);
  
  var _character = character;
  this.setCharacter = function(character){ _character = character;};
  this.getCharacter = function(){ return _character; };

  var _group = new GraphicalGroup();
  _group.add(this);

  var _text = new Text(character,"black",{"font-size":"16px"});
  _text.setDraggable(false);
  _group.add(_text);

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    layer.add(_text);
    this.centerText();
  }

  this.scale = function(scale){
    _parent.scale(scale);
    this.centerText();
  }

  this.centerText = function(){
    tw = _text.getCalculatedWidth();
    th = _text.getCalculatedHeight();
    console.log("Text: "+tw+"x"+th);
    w = this.getWidth();
    h = this.getHeight();
    console.log("Key: "+w+"x"+h);
    _group.muteAll("onMove");
    dw = (w/2-(tw/2))-_text.getX()+this.getX();
    dh = (h/2-(th/2))-_text.getY()+this.getY();
    console.log("Text position: "+_text.getX()+","+_text.getY());
    console.log("New position: "+(_text.getX()+dw)+","+(_text.getY()+dh));
    _text.move(dw,dh);
    _group.unMuteAll("onMove");
  }

  /**
   * @overide FilledRectangle.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    _text.draw(context);
  }
}
