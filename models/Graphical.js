function Graphical(){
  var _self = inherit(this, new Draggable());
  var _parent = _self._parent;
  this.className = "Graphical";

  var _x = 0;
  var _y = 0;
  var _width = 30;
  var _height = 30;
  
  var _enlarged = false;
  var _snapped = false;

  var _layer = null;
  
  this.getX = function(){ return _x; }
  this.setX = function(x){ _x = x; }
  this.getY = function(){ return _y; }
  this.setY = function(y){ _y = y; }

  this.getHeight = function(){ return _height; };
  this.getWidth = function(){ return _width; };
  this.setHeight = function(height){
    _height = Math.floor(height);
    this.tell("onChangeHeight", {height:Math.floor(height)});
  };
  this.setWidth = function(width){
    _width = Math.floor(width);
    this.tell("onChangeWidth", {width:Math.floor(width)});
  };

  this.scale = function(scale){
    this.setWidth(this.getWidth()*scale);
    this.setHeight(this.getHeight()*scale);
  }

  this.isEnlarged = function(){ return _enlarged; };

  this.doEnlarge = function(){ this.scale(2); }
  this.enlarge = function(){
    if(!this.isEnlarged()){
      _enlarged = true;
      this.doEnlarge();
      this.tell("onEnlarge");
    }
  }
  
  this.doReduce = function(){ this.scale(0.5); }
  this.reduce = function(){
    if(this.isEnlarged()){
      _enlarged = false;
      this.doReduce();
      this.tell("onReduce");
    }
  }

  this.setLayer = function(layer){
    _layer = layer; 
    this.tell("onAddToLayer", {layer:layer});
  };

  this.getLayer = function(){ return _layer; };

  this.getSnapped = function(){ return _snapped; };
  this.setSnapped = function(region){
    _snapped = region;
  }

  this.contains = function(e){
    var x = e.canvasX, y = e.canvasY;
    return (
      x >= this.getX() && 
      x <= this.getX()+this.getWidth() &&
      y >= this.getY() && 
      y <= this.getY()+this.getHeight()
    );
  }

  this.move = function(x,y){
    this.setX(this.getX()+x);
    this.setY(this.getY()+y);
    this.tell("onMove", {x:x, y:y});
  }

  this.beforeDraw = function(context){}
  this.draw = function(context){}
  this.afterDraw = function(context){}

  this.paint = function(context){
    this.beforeDraw(context);
    this.draw(context);
    this.afterDraw(context);
  }

  this.onDragStart = function(e){
    e.draggedObject = this;
    if( _parent.onDragStart ) _parent.onDragStart.call(this,e);
    this.getLayer().moveToTop();
    this.getLayer().getBottomLayer().repaint();
    this.tell("onDragStart",e);
  }

  this.onDragEnd = function(e){
    this.getLayer().getApplication().getCanvas().style.cursor = "default";
    if( _parent.onDragEnd ) _parent.onDragEnd.call(this,e);
    this.tell("onDragEnd", e);
  }
  
  this.onDrag = function(e){
    if( _parent.onDrag ) _parent.onDrag(e);
    this.move(
      e.relPos.x,
      e.relPos.y
    );
    this.getLayer().getApplication()
      .getCanvas().style.cursor = "move";
    this.getLayer().getApplication().onEvent(e, "onDragOver"); 
    this.getLayer().getBottomLayer().repaint();
    this.tell("onDrag", e);
  }

  this.onSnap = function(region){
    this.setSnapped(region);
    var object = this;
    var moveToTopListener,
    moveToTopListener = region.getLayer().listen("onMoveToTop", function(e){
      moveToTopListener.mute = true;
      object.getLayer().moveToTop();
      moveToTopListener.mute = false;
    });
    var regionMoveListener, ownMoveListener;
    ownMoveListener = this.listen("onMove", function(e){
      region.unlisten(regionMoveListener); 
      region.getLayer().unlisten(moveToTopListener); 
      object.setSnapped(false);
    });
    regionMoveListener = region.listen("onMove", function(e){
      ownMoveListener.mute = true;
      object.move(e.x, e.y)
      ownMoveListener.mute = false;
    });
  }

  this.onAddedToGroup = function(group){
    var object = this;
    group.listen("onMemberMove", function(e){
      if(e.groupMember != object){
        object.move(e.x,e.y);
      }
    });
    group.listen("onMemberReduce", function(e){
      if(e.groupMember != object){
        object.reduce();
      }
    });
    group.listen("onMemberEnlarge", function(e){
      if(e.groupMember != object){
        object.enlarge();
      }
    });
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.x = this.getX();
    ex.y = this.getY();
    ex.width = this.getWidth();
    ex.height = this.getHeight();
    ex.enlarged = this.isEnlarged();
    ex.layer = this.getLayer().getUniqueId();
    if(this.getSnapped())
      ex.snappedBy = this.getSnapped().getUniqueId();
    return ex;
  }

  this.import = function(elemStruct, references){
    _parent.import.call(this, elemStruct, references);
    if(elemStruct.x) this.move(elemStruct.x-this.getX(),0);
    if(elemStruct.y) this.move(0,elemStruct.y-this.getY());
    if(elemStruct.width) this.setWidth(elemStruct.width);
    if(elemStruct.height) this.setHeight(elemStruct.height);
    if(elemStruct.enlarged) _enlarged = true;
    if(elemStruct.layer && elemStruct.layer in references){
      this.setLayer(references[elemStruct.layer]);
      references[elemStruct.layer].add(this);
    }
    if(elemStruct.snappedBy && elemStruct.snappedBy in references){
      references[elemStruct.snappedBy].attachGraphical(this);
    }
  }
}
