function KeyboardScene(){
  var _self = inherit(this, new Scene());
  var _parent = _self._parent;

  this.load = function(app){
    _parent.load.call(this, app);
    keys = ["q","w","e","r","t","y","u","i","o","p","[","]"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.move(i*31,0);
    }
    keys = ["a","s","d","f","g","h","j","k","l",":","'"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.move(15+i*31,31);
    }
    keys = ["z","x","c","v","b","n","m",",",".","?"];
    for(var i = 0; i < keys.length; i++){
      key = new Key(keys[i]);
      app.getFloorLayer().add(key);
      key.move(31+i*31,62);
    }
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.scene = "Keyset";
    return ex;
  }

  this.loadDefault = function(){}
}
