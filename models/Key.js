function Key(character, superscript, subscript){
  var _self = inherit(this, new FilledRectangle("#CCCCCC","#000000",2));
  var _parent = _self._parent;
  this.className = "Key";

  _character = character;

  this.setDraggable(false);
  
  var _character = character;
  this.setCharacter = function(character){ _character = character;};
  this.getCharacter = function(){ return _character; };

  var _group = new GraphicalGroup();
  _group.add(this);

  var _text = new Text(character,"black",{"font-size":"16px"});
  _text.setDraggable(false);
  _group.add(_text);
  if(superscript != undefined && superscript != ""){
    var _supertext = new Text(superscript,"gray",{"font-size":"8px"});
    _supertext.setDraggable(false);
    _group.add(_supertext);
  }else{
    var _supertext = null;
  }
  if(subscript != undefined && subscript != ""){
    var _subtext = new Text(subscript,"gray",{"font-size":"6px"});
    _subtext.setDraggable(false);
    _group.add(_subtext);
  }else{
    var _subtext = null;
  }

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    layer.add(_text);
    if(_supertext != null){
      layer.add(_supertext);
    }
    if(_subtext != null){
      layer.add(_subtext);
    }
    this.centerText();
  }

  this.scale = function(scale){
    _parent.scale(scale);
    this.centerText();
  }

  this.centerText = function(){
    tw = _text.getCalculatedWidth();
    th = _text.getCalculatedHeight();
    w = this.getWidth();
    h = this.getHeight();
    _group.muteAll("onMove");
    dw = (w/2-(tw/2))-_text.getX()+this.getX();
    dh = (h/2-(th/2))-_text.getY()+this.getY();
    _text.move(dw,dh);
    if(_supertext != null){
      _supertext.move(dw,dh-(0.9*dh));
    }
    if(_subtext != null){
      _subtext.move(dw,dh+(2.1*dh));
    }
    _group.unMuteAll("onMove");
  }

  this.onDragOver = function(e){
    this.tell("onDragOver");
    e.draggedObject.onDraggedOver(this);
  }

  /**
   * @overide FilledRectangle.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    _text.draw(context);
    if(_supertext != null){
      _supertext.draw(context);
    }
    if(_subtext != null){
      _subtext.draw(context);
    }
  }
}
