function DragField(){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "DragField";

  _dragpoint = null;
  _draglayer = null;
  _dragtrack = new Array();

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    _draglayer = new Layer(this.getLayer().getApplication(), this.getLayer());
  }

  this.onDragStart = function(e){
    _dragpoint = new GraphicalCoordinate(e.canvasX, e.canvasY);
    _dragpoint.move(e.canvasX, e.canvasY);
    _dragpoint.listen("onDragEnd", function(e){
      _draglayer.remove(_dragpoint);
      _dragpoint = null;
    });
    _dragpoint.listen("onDrag", function(e){
      if(
        _dragpoint.getDraggedOver() != null &&
        _dragpoint.getDraggedOver().className == "Key"
      ){
        _dragtrack.push(+new Date+","+e.canvasX+","+e.canvasY+","+_dragpoint.getDraggedOver().getCharacter());
      }
    });
    _draglayer.add(_dragpoint);
    _dragpoint.onDragStart(e);
  }

  this.onDrag = function(e){
    _dragpoint.onDrag(e);
  }

  this.onDragEnd = function(e){
    _dragpoint.onDragEnd(e);
    this.tell("onTrackEnd", {"track":_dragtrack});
    _dragtrack = new Array();
  }


}
