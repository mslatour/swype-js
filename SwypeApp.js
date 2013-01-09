function SwypeApp(canvas){
  var _ref = this;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  var _mouse = null;
  var _scene = null;

  var _floor = new Layer(this, null);
  _floor.setUniqueId("FloorLayer");
  _floor.setExportable(false);

  var _defaultReferences = {};

  this.getFloorLayer = function(){ return _floor };
  this.setFloorLayer = function(floor){ _floor = floor; };

  this.getCanvas = function(){ return this.canvas; };
  this.setCanvas = function(canvas){ this.canvas = canvas };
  this.getContext = function(){ return this.context; };

  this.getHeight = function(){ return this.getCanvas().height; };
  this.getWidth = function(){ return this.getCanvas().width; };

  this.addDefaultReference = function(reference, object){
    _defaultReferences[reference] = object;
  }

  this.getDefaultReferences = function(){
    _defaultReferences["app"] = this;
    _defaultReferences[this.getFloorLayer().getUniqueId()] = this.getFloorLayer();
    return _defaultReferences;
  }

  this.initMouse = function(){
    _mouse = new Mouse(this.getCanvas());
  };
  this.getMouse = function(){ return _mouse; };

  this.addListeners = function(){
    this.getMouse().listen("onMouseDown", function(e){
      _ref.onEvent(e,"onMouseDown")
    });
    this.getMouse().listen("onMouseUp", function(e){
      _ref.onEvent(e,"onMouseUp")
    });
    this.getMouse().listen("onMouseOut", function(e){
      _ref.onEvent(e,"onMouseOut")
    });
    this.getMouse().listen("onMouseMove", function(e){
      _ref.onEvent(e,"onMouseMove")
    });
    this.getMouse().listen("onMouseClick", function(e){
      _ref.onEvent(e,"onMouseClick")
    });
  }

  this.onEvent = function(e, callback){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= this.canvas.offsetLeft;
    y -= this.canvas.offsetTop;
    e.canvasX = x;
    e.canvasY = y;

    this.getFloorLayer().getTopLayer().onEvent(e, callback);
    this.getFloorLayer().repaint();
  }

  this.loadScene = function(scene){
    _scene = scene;
    scene.load(this);
  }
  this.getScene = function(){ return _scene; }

  this.run = function(static){
    if(!static){
      this.initMouse();
      this.addListeners();
    }
    this.getFloorLayer().paint(this.getContext());
  };
}
