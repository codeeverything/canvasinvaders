var bullet = function(x, y, target) {
	this.x = x;
	this.y = y;
	this.target = target;

	this.draw = function(c) {
		c.save();
		
		if(this.target == 'enemy')
			c.fillStyle = '#FFBF00';
		else 
			c.fillStyle = '#00ff33';
			
		var w = 5 - enemies.length;
		if(w < 2) w = 2;
		c.fillRect(this.x, this.y, w, w);
		
		c.restore();
	}

	this.update = function(pos) {
		this.y -= pos;
		//if we're past 0 then remove us from the list of bullets, and assume we're the first on the list
		//if(this.y <= 0 || this.y >= getCanvas().height) {
		if(this.y <= 0) {
			game.score--;
			if(game.score < 0) game.score = 0;
			return false;
		}

		//check for hit
		if(this.target == "enemy" && enemies.length > 0 && pos > 0) {
			for(var i=0; i<enemies.length; i++) {
				var e = enemies[i];
				var bounds = e.getBounds();
				if(this.x >= bounds.x1 && this.x <= bounds.x2 && this.y >= bounds.y1 && this.y <= bounds.y2) {
					var eu = e.update(1);	//damage him
					if(!eu) enemies.splice(i, 1);

					game.score += 1;

					return false;
				}
			}
		}

		if(this.target == "player") {
			var e = player;
			var bounds = e.getBounds();
			//console.log('checking player bounds');
			if(this.x >= bounds.x1 && this.x <= bounds.x2 && this.y >= bounds.y1 && this.y <= bounds.y2) {
				e.takeDamage();

				return false;
			}
		}
		return true;
	}
};
