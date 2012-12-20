function Layer(application,previousLayer){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "Layer";

  var _application = application;
  var _graphicals = new Array();
  this._context = null;

  var onMouseMoveTarget = null;

  this.getApplication = function(){ return _application; };
  this.setApplication = function(app){ _application = app; };

  // Link layer
  var _previousLayer = previousLayer;
  if(_previousLayer != null){
    _previousLayer.setNextLayer(this);
  }

  var _nextLayer = null;

  this.getPreviousLayer = function(){ return _previousLayer; }
  this.setPreviousLayer = function(layer){ _previousLayer = layer; }
  this.getNextLayer = function(){ return _nextLayer; }
  this.setNextLayer = function(layer){ _nextLayer = layer; }

  this.getTopLayer = function(){
    if(this.getNextLayer() != null){
      return this.getNextLayer().getTopLayer();
    }else{
      return this;
    }
  }
  
  this.getBottomLayer = function(){
    if(this.getPreviousLayer() != null){
      return this.getPreviousLayer().getBottomLayer();
    }else{
      return this;
    }
  }

  this.moveToTop = function(){
    if(this.getNextLayer() != null){
      var top = this.getTopLayer();
      var previous = this.getPreviousLayer();
      var next = this.getNextLayer();

      top.setNextLayer(this);
      this.setNextLayer(null);
      this.setPreviousLayer(top);
      
      if(previous != null){
        previous.setNextLayer(next);
      }
      next.setPreviousLayer(previous);
    }
    this.tell("onMoveToTop");
  }

  this.add = function(graphical){
    _graphicals[_graphicals.length] = graphical;
    graphical.setLayer(this);
  }

  this.remove = function(graphical){
    graphical.setLayer(null);
    var graphicals = new Array();
    var j = 0;
    for(var i = 0; i < _graphicals.length; i++){
      if( _graphicals[i] != graphical ){
        graphicals[j++] = _graphicals[i];
      }
    }
    _graphicals = graphicals;
  }

  this.paint = function(context){
    this._context = context;
    for(var i = 0; i < _graphicals.length; i++){
      _graphicals[i].paint(context)
    }

    // Propagate paint
    if(this.getNextLayer() != null){
      this.getNextLayer().paint(context);
    }
  }

  this.repaint = function(){
    if(this._context != null){
      if(this.getPreviousLayer() == null){
        this._context.clearRect(
          0,
          0,
          this._context.canvas.width,
          this._context.canvas.height
        );
      }
      this.paint(this._context);
    }
  }
  
  // Returns graphical that contains
  // position x and y. Or false if none
  this.containedBy = function(e){
    for(var i = _graphicals.length-1; i >= 0; i--){
      if(_graphicals[i].contains(e)){
        return _graphicals[i];
      }
    }
    return false;
  }

  this.onEvent = function(e, callback){
    var object = _self.containedBy(e);

    // Propagate event
    if(object){
      // Store onMouseMove Target
      if( callback == "onMouseMove" ){
        if( onMouseMoveTarget == null ){
          if("onMouseOver" in object) object.onMouseOver.call(object, e);
          else if(object.onEvent) object.onEvent.call(object, e, "onMouseOver");
        }else if( object != onMouseMoveTarget ){
          if("onMouseOut" in onMouseMoveTarget) onMouseMoveTarget.onMouseOut.call(onMouseMoveTarget, e);
          else if(onMouseMoveTarget.onEvent) onMouseMoveTarget.onEvent.call(onMouseMoveTarget, e, "onMouseOut");
          if("onMouseOver" in object) object.onMouseOver.call(object, e);
          else if(object.onEvent) object.onEvent.call(object, e, "onMouseOver");
        }
        if("onMouseMove" in object) object.onMouseMove.call(object, e);
        else if(object.onEvent) object.onEvent.call(object, e, "onMouseMove");
        onMouseMoveTarget = object;
      }else{
        if(object[callback]) object[callback].call(object,e);
        else if(object.onEvent) object.onEvent.call(object, e, callback);
      }
    }else if( callback == "onMouseMove" && onMouseMoveTarget != null){
      if("onMouseOut" in onMouseMoveTarget) onMouseMoveTarget.onMouseOut.call(onMouseMoveTarget, e);
      else if(onMouseMoveTarget.onEvent) onMouseMoveTarget.onEvent.call(onMouseMoveTarget, e, "onMouseOut");
      onMouseMoveTarget = null;
    }
    
    if(!object || e.bubble){
      if(_self.getPreviousLayer() != null){
        _self.getPreviousLayer().onEvent(e, callback);
      }
    }
  }
}
