function Mouse(area){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "Mouse";

  var _area = area;

  this.getArea = function(){ return _area; };

  // Previous mouse position
  var _pMouse = {x:null, y:null}
  // Current mouse position
  var _cMouse = {x:null, y:null}

  this.getPreviousPosition = function(){ return _pMouse; }
  this.setPreviousPosition = function(mouse){ _pMouse = mouse; }
  this.getCurrentPosition = function(){ return _cMouse; }
  this.setCurrentPosition = function(mouse){ _cMouse = mouse; }
  this.getRelativePosition = function(){
    var p = this.getPreviousPosition();
    var c = this.getCurrentPosition();
    return { x: c.x - p.x, y: c.y - p.y };
  }

  this.updatePosition = function(x,y){
    this.setPreviousPosition(this.getCurrentPosition());
    this.setCurrentPosition({x:x, y:y});
  }

  this.addAreaPosition = function(e){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= this.getArea().offsetLeft;
    y -= this.getArea().offsetTop;
    e.areaX = x;
    e.areaY = y;
  }
  
  // Event handlers
  this.onMouseUp = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseUp", e);
  };
  this.onMouseDown = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseDown", e);
  };
  this.onMouseMove = function(e){
    this.addAreaPosition(e);
    this.updatePosition(e.areaX, e.areaY);
    e.relPos = this.getRelativePosition();
    e.mouse = this;
    this.tell("onMouseMove", e);
  };
  this.onMouseOut = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseOut", e);
  };

  EventHelper.registerListener({
    element: _area,
    on: "mouseup",
    callback: function(e){ _self.onMouseUp(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "touchend",
    callback: function(e){ _self.onMouseUp(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "mousedown",
    callback: function(e){ _self.onMouseDown(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "touchstart",
    callback: function(e){ _self.onMouseDown(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "mousemove",
    callback: function(e){ _self.onMouseMove(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "touchmove",
    callback: function(e){ _self.onMouseMove(e) }
  });
  
  EventHelper.registerListener({
    element: _area,
    on: "mouseout",
    callback: function(e){ _self.onMouseOut(e) }
  });
}
