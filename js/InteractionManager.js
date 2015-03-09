var InteractionManager = {
	keyHeld: false,
	activeKeys: [],
	interactions: {'document': {}},
	add: function(obj, event, func) {
		var self = this;
		obj[event] = function(e) {
			for(var x=0; x < self.interactions['document'][event].length; x++) {
				var i = self.interactions['document'][event][x];
				i.call(self, e);
			}
		}
		
		if(!this.interactions['document'][event])
			this.interactions['document'][event] = [];
			
		this.interactions['document'][event].push(func);
		
		//console.log(self.interactions);
	},
	init: function() {
	}
}