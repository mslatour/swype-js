function Scene(){
  var _app = null;
  var _additionalExportables = new Array();

  this.setApplication = function(app){ _app = app; };
  this.getApplication = function(){ return _app; };

  var _references = new Array();
  this.getReferences = function(){ return _references; }
  this.setReferences = function(references){ _references = references; }
  this.removeReference = function(reference){
    if(reference in _references)
      delete _references[reference];
  }

  this.addReference = function(reference, object){
    _references[reference] = object;
  }

  this.addAdditionalExportable = function(exportable){
    _additionalExportables.push(exportable);
  }
  this.getAdditionalExportables = function(){ return _additionalExportables; };
  
  this.load = function(app){
    this.setApplication(app);
    this.setReferences(app.getDefaultReferences());
  }
  
  this.export = function(){
    var _self = this;
    var scene = {
      scene: "Scene",
      snapRegions: {},
      layers: {},
      elems: {}
    };
    scene = _self.getApplication().getFloorLayer().exportAll(scene);
    for(var i = 0; i < _additionalExportables.length; i++){
      scene = _additionalExportables[i].export(scene);
    }
    return scene;
  }

  this.getImportedScene = function(struct){
    if(struct.scene){
      eval("var s = new "+struct.scene+"()");
      if(s) return s;
    }
    return false;
  }

  this.import = function(struct){
    if(struct.elems && struct.layers && struct.snapRegions){
      // Pre scan for objects
      for(var id in struct.elems){
        if(struct.elems[id].class){
          eval("var e = new "+struct.elems[id].class+"(this)");
          if(e){
            e.setUniqueId(id);
            this.addReference(id, e);
          }
        }
      }
      // Pre scan for layers
      for(var id in struct.layers){
        if(struct.layers[id].class){
          eval("var l = new "+struct.layers[id].class+"(this)");
          if(l){
            l.setUniqueId(id);
            this.addReference(id, l);
          }
        }
      }
      //Retrieve the collected references
      var references = this.getReferences();
      
      // Import each layer
      for(var id in struct.layers){
        if(
          id in references &&
          references[id].import
        ){
          references[id].import(
            struct.layers[id],
            references
          );
        }
      }
      
      // Import each snap region
      for(var id in struct.snapRegions){
        if(
          id in references &&
          references[id].import
        ){
          references[id].import(
            struct.snapRegions[id],
            references
          );
        }
      }

      // Import each object
      for(var id in struct.elems){
        if(
          id in references &&
          references[id].import
        ){
          references[id].import(
            struct.elems[id],
            references
          );
        }
      }
    }
  }
}
