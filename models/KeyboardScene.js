function KeyboardScene(){
  var _self = inherit(this, new Scene());
  var _parent = _self._parent;

  this.load = function(app){
    _parent.load.call(this, app);
    // Key scale (1 == 31px x 31px)
    scale = app.getCanvas().width/384;

    // Top row of keys
    keys = ["q","w","e","r","t","y","u","i","o","p","[","]"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.scale(scale);
      key.move(i*key.getCalculatedWidth(),0);
    }
    // Center row of keys
    keys = ["a","s","d","f","g","h","j","k","l",":","'"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.scale(scale);
      key.move((i+0.5)*key.getCalculatedWidth(),key.getCalculatedHeight());
    }
    // Bottom row of keys
    keys = ["z","x","c","v","b","n","m",",",".","?"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.scale(scale);
      key.move((i+1)*key.getCalculatedWidth(),2*key.getCalculatedHeight());
    }
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.scene = "Keyset";
    return ex;
  }

  this.loadDefault = function(){}
}
