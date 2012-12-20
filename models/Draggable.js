function Draggable(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "Draggable";

  var _dragListeners = [];
  var _dragTriggerActive = false, _dragging = false, _draggable = true;
  var _draggedOver = null;

  this.getDraggedOver = function(){ return _draggedOver; }
  
  this.getDraggable = function(){ return _draggable; }
  this.setDraggable = function(draggable){
    _draggable = draggable;
  }

  this.isDragging = function(){ return _dragging; }

  this.onMouseOver = function(e){return true; };

  this.onMouseDown = function(e){
    // Start waiting for movement
    // to trigger dragging
    if(this.getDraggable())
      _dragTriggerActive = true;
  }
  
  this.onMouseUp = function(e){
    // Stop waiting for movement
    // to trigger dragging
    _dragTriggerActive = false;

    // If we were currently dragging
    if(this.isDragging()){
      // Stop dragging
      _dragging = false;
      if(_draggedOver && _draggedOver.onDrop){
        e.draggedObject = this;
        _draggedOver.onDrop(e);
      }
      this.onDragEnd(e);
    }
  }

  this.onMouseMove = function(e){
    // If we were waiting for
    // movement to trigger dragging
    if(_dragTriggerActive){
      // Stop waiting
      _dragTriggerActive = false;
      // Start dragging
      _dragging = true;
      this.onDragStart(e);
      this.onDrag(e);
    }else if(this.getDraggable()){
      this.getLayer().getApplication()
        .getCanvas().style.cursor = "pointer";
    }else{
      this.getLayer().getApplication()
        .getCanvas().style.cursor = "default";
    }
  }

  this.onMouseOut = function(e){
    this.onMouseUp(e);
  }

  this.onDragStart = function(e){
    var object = e.draggedObject;
    var mouse = this.getLayer().getApplication().getMouse();
    if(mouse){
      _dragListeners[_dragListeners.length] = mouse.listen("onMouseMove", function(e){
        e.draggedObject = object;
        object.onDrag(e);
      })
      
      _dragListeners[_dragListeners.length] = mouse.listen("onMouseUp", function(e){
        e.draggedObject = object;
        object.onMouseUp(e);
      })
    }
  }

  this.onDrag = function(e){
    e.bubble = true;
  }
  
  this.onDraggedOver = function(draggedOver){
    if(
      _draggedOver != null &&
      _draggedOver != draggedOver &&
      _draggedOver.onDragOut
    ){
      _draggedOver.onDragOut(this);
    }
    _draggedOver = draggedOver;
  }

  this.onDragEnd = function(e){
    var mouse = this.getLayer().getApplication().getMouse();
    for(var i = 0; i < _dragListeners.length; i++){
      mouse.unlisten(_dragListeners[i]);
    }
    _draggedOver = null;
    _dragListeners = new Array();
  }

}
