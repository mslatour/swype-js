function Observable(){
  var _self = inherit(this, new Exportable());
  var _parent = _self._parent;
  this.className = "Observable";

  var _listeners = {};

  this.listen = function(on, callback){
    var object = this;
    var listener = {
      on: on,
      object: object,
      callback:callback,
      mute: false
    };

    if(_listeners[on])
      _listeners[on][_listeners[on].length] = listener
    else
      _listeners[on] = [listener];
    
    return listener;
  }
  
  this.unlisten = function(listener){
    var newListeners = new Array();
    for(var i = 0, j = 0; i < _listeners[listener.on].length; i++){
      if(_listeners[listener.on][i] != listener)
        newListeners[j++] = _listeners[listener.on][i];
    }
    _listeners[listener.on] = newListeners;
  }

  this.tell = function(on, context){
    if(_listeners[on]){
      if(!context) context = {object: this};
      else context["object"] = this;

      for(var i = 0; i < _listeners[on].length; i++){
        if(!_listeners[on][i].mute)
          _listeners[on][i].callback(context);
      }
    }
  }

  this.toDebugString = function(){
    return this.className;
  }
}
