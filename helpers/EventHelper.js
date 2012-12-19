EventHelper = {
  listeners: [],
  registerListener: function(listener){
    if(listener.element.addEventListener){
      listener.element.addEventListener(
        listener.on,
        listener.callback,
        false
      );
      this.listeners[this.listeners.length] = listener;
    }else if(listener.element.attachEvent){
      listener.element.attachEvent(
        listener.on,
        listener.callback
      );
      this.listeners[this.listeners.length] = listener;
    }else if(listener.element["on"+listener.on]){
      listener.element["on"+listener.on] = listener.callback;
      this.listeners[this.listeners.length] = listener;
    }else{
      return false;
    }
    return (this.listeners.length-1);
  },
  
  unregisterListener: function(listenerId){
    listener = this.listeners[listenerId];
    if(listener){
      if(listener.element.removeEventListener){
        var result = listener.element.removeEventListener(
          listener.on,
          listener.callback,
          false
        );
      }else if(listener.element.detachEvent){
        listener.element.detachEvent(
          listener.on,
          listener.callback,
          false
        );
      }else if(listener.element["on"+listener.on]){
        listener.element["on"+listener.on] = null;
      }else{
        return false;
      }
      return true;
    }
  }
}
