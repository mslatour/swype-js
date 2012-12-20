/**
 * GraphicalGroup
 * A group of graphicals that maintains the same distance 
 * between each member. It uses the listen function of the
 * Observable class to stay updated on movements.
 *
 * It stores the location of each member when they are
 * added to the group. When a new location is reached for
 * one of the members, the group calculates the distance
 * to its previous location and moves the other members.
 */

function GraphicalGroup(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "GraphicalGroup";
  
  var _elements = {};

  var _ears = new Object();

  this.add = function(graphical){
    var moveListener;
    var object = this;

    _elements[graphical.getUniqueId()] = graphical;
   
    this.addGroupEar(graphical, "onMove", "onMemberMove");
    this.addGroupEar(graphical, "onReduce", "onMemberReduce");
    this.addGroupEar(graphical, "onEnlarge", "onMemberEnlarge");
    this.addGroupEar(graphical, "onScale", "onMemberScale");
    
    graphical.onAddedToGroup(this);
  }

  this.addGroupEar = function(graphical, listen, tell){
    var object = this;
    this.addEar(graphical.listen(listen, function(e){
      e.groupMember = graphical;
      object.muteAll(listen);
      object.tell(tell, e);
      object.unMuteAll(listen);
    }));
  }

  this.addEar = function(ear){
    if(_ears[ear.on]){
      _ears[ear.on][_ears[ear.on].length] = ear;
    }else{
      _ears[ear.on] = [ear];
    }
  }

  this.muteAll = function(on){
    for(var i = 0; i < _ears[on].length; i++){
      _ears[on][i].mute = true;
    }
  }
  
  this.unMuteAll = function(on){
    for(var i = 0; i < _ears[on].length; i++){
      _ears[on][i].mute = false;
    }
  }
}
