function Graphical(){
  var _self = inherit(this, new Draggable());
  var _parent = _self._parent;
  this.className = "Graphical";

  var _x = 0;
  var _y = 0;
  var _width = 30;
  var _height = 30;
  var _rotate = 0;

  var _hide = false;
  
  var _enlarged = false;

  var _layer = null;
  
  this.getX = function(){ return Math.round(_x); }
  this.setX = function(x){ _x = x; }
  this.getY = function(){ return Math.round(_y); }
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

  this.hide = function(){ _hide = true; };
  this.show = function(){ _hide = false; };
  this.isHidden = function(){ return _hide; };
  
  this.scale = function(scale){
    this.setWidth(this.getWidth()*scale);
    this.setHeight(this.getHeight()*scale);
    this.tell("onScale",{"scale":scale});
  }

  this.rotate = function(rotate){
    _rotate = rotate;
  }

  this.getRotation = function(){ return _rotate; }
  
  this.getDrawRotation = function(){
    return this.getRotation();
  }
  
  /**
   * Scale to fit inside box
   * int bw        - Width of box
   * int bh        - Height of box
   * boolean force - Force upscale
   */
  this.scaleToBox = function(bw, bh, force){
    var w = this.getWidth(); 
    var h = this.getHeight();
    if( w > h ){
      if( force || w > bw ){
        this.setWidth(bw);
        this.setHeight((h/w)*bw);
      }
    }else{
      if( force || h > bh ){
        this.setWidth((w/h)*bh);
        this.setHeight(bh);
      }
    }
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

  this.moveToCenter = function(){
    this.move(
      (this.getLayer().getApplication().getWidth()/2)-(this.getWidth()/2),
      (this.getLayer().getApplication().getHeight()/2)-(this.getHeight()/2)
    )
  }

  this.beforeDraw = function(context){
    context.save();
    context.translate(this.getX(),this.getY());
    //context.rotate(Math.PI*2*(_rotate/360));
    context.rotate(this.getDrawRotation());
  }
  this.draw = function(context){}
  this.afterDraw = function(context){
    context.restore();

  }

  this.paint = function(context){
    if(!this.isHidden()){
      this.beforeDraw(context);
      this.draw(context);
      this.afterDraw(context);
    }
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
    group.listen("onMemberScale", function(e){
      if(e.groupMember != object){
        object.scale(e.scale);
      }
    });
  }
}
