function DragField(){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "DragField";

  _dragpoint = null;
  _draglayer = null;
  _dragtrack = new Array();
  _dragcoords = new Array();

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    _draglayer = new Layer(this.getLayer().getApplication(), this.getLayer());
  }

  this.onDragStart = function(e){
    _dragpoint = new GraphicalCoordinate(e.canvasX, e.canvasY);
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
        _dragcoords.push([e.canvasX,e.canvasY]);
      }
    });
    _draglayer.add(_dragpoint);
    _dragpoint.onDragStart(e);
    _dragpoint.onDrag(e);
  }

  this.onDrag = function(e){
    _dragpoint.onDrag(e);
  }

  this.onDragEnd = function(e){
    _dragpoint.onDragEnd(e);
    this.tell("onTrackEnd", {"track":_dragtrack});
    _dragtrack = new Array();
    _dragcoords = new Array();
  }

  this.paint = function(context){
    _parent.paint(context);
    if(_dragcoords.length > 0){
      context.beginPath();
      context.fillStyle = 'blue';
      context.strokeStyle = 'blue';
      context.lineWidth = 3;
      context.moveTo(_dragcoords[0][0], _dragcoords[0][1]);
      for(var i = 1; i < _dragtrack.length; i++){
        context.lineTo(_dragcoords[i][0], _dragcoords[i][1]);
        context.arc(_dragcoords[i][0], _dragcoords[i][1], 2, 0 , 2 * Math.PI, false);
      }
      context.stroke();
      context.closePath();
    }
  }

}
