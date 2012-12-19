function Key(character){
  var _self = inherit(this, new FilledRectangle("#CCCCCC","#000000",2));
  var _parent = _self._parent;
  this.className = "Key";
  
  var _character = character;
  this.setCharacter = function(character){ _character = character;};
  this.getCharacter = function(){ return _character; };

  var _group = new GraphicalGroup();
  _group.add(this);
  var _text = new Text(character,"black",{"font-size":"16px"});
  _text.move(10,5);
  _group.add(_text);

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    layer.add(_text);
  }

  /**
   * @overide FilledRectangle.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    _text.draw(context);
  }
}
