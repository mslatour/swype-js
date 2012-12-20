function KeyboardScene(){
  var _self = inherit(this, new Scene());
  var _parent = _self._parent;

  this.load = function(app){
    _parent.load.call(this, app);
    // Key scale (1 == 31px x 31px)
    scale = app.getCanvas().width/384;

    // Top row of characters
    characters = ["q","w","e","r","t","y","u","i","o","p","[","]"];
    for(var i = 0; i < characters.length; i++){
      key = this.createKey(characters[i], scale);
      app.getFloorLayer().add(key);
      key.move(i*key.getCalculatedWidth(),0);
    }
    // Center row of characters
    characters = ["a","s","d","f","g","h","j","k","l",":","'"];
    for(var i = 0; i < characters.length; i++){
      key = this.createKey(characters[i], scale);
      app.getFloorLayer().add(key);
      key.move((i+0.5)*key.getCalculatedWidth(),key.getCalculatedHeight());
    }
    // Bottom row of characters
    characters = ["z","x","c","v","b","n","m",",",".","?"];
    for(var i = 0; i < characters.length; i++){
      key = this.createKey(characters[i], scale);
      app.getFloorLayer().add(key);
      key.move((i+1)*key.getCalculatedWidth(),2*key.getCalculatedHeight());
    }
    drawlayer = new Layer(app, app.getFloorLayer());
    field = new DragField();
    field.setWidth(app.getWidth());
    field.setHeight(app.getHeight());
    field.listen("onTrackEnd", function(e){
      document.getElementById("log").innerHTML = e.track.join("\n");
    });
    drawlayer.add(field);
  }

  this.createKey = function(character,scale){
    key = new Key(character);
    key.scale(scale);
    return key;
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.scene = "characterset";
    return ex;
  }

  this.loadDefault = function(){}
}
