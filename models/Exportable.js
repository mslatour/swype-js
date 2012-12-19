function Exportable(){
  var _uid = UID.next();
  this.className = "Exportable";
  this.getUniqueId = function(){ return _uid; }
  this.setUniqueId = function(uid){ _uid = uid; }
  var _exportable = true;

  this.setExportable = function(bool){ _exportable = bool; }
  this.isExportable = function(){ return _exportable; }

 
  this.export = function(){
    return {
      class: this.className
    }
  }

  this.import = function(elemStruct, references){}
}

UID = {uid:0, next:function(){ return "Obj"+this.uid++; }}
