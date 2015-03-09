function enemy(x,y,health, motion, timeout) {
	this.x = x;
	this.y = y;
	this.w = 50;
	this.move = 0;
	this.fire = 40;
	this.health = (health || 4) + (Math.random()*2);
	this.deltaX = 5;
	this.enemyImg = null;
	this.motion = motion || function() {
		//move back and fore
		if(this.x <= (0 + (this.w/2)) || this.x >= (getCanvas().width - this.w)) {
			this.deltaX *= -1;
			this.move = 5;
		}

		this.x += this.deltaX;
	};
	this.timeout = timeout || 0;

	this.ec = null;

	this.damage = 0;
	this.state = 0;

	this.init = function(img) {
		//var ecanvas = document.createElement('enemyCanvas');
		//this.ec = ecanvas.getContext('2d');
		//ec.drawImage(enemyImg, 0, 0, this.w, this.w);	
		
		var enemyImg = new Image();
		enemyImg.src = img;
		
		this.enemyImg = enemyImg;
	}

	this.draw = function(c) {
		if(this.state == 0) {
			c.drawImage(this.enemyImg, this.x, this.y, this.w, this.w);

			
		} else {
			this.state--;
		}
	}

	this.getBounds = function() {
		return {x1: this.x, x2: this.x + this.w, y1: this.y, y2: this.y + this.w};
	}

	this.update = function(hit) {
		hit = hit || 0;
		
		if(this.move > 0) {
			this.y += 10;
			this.move--;
		}

		if(this.fire == 0) {
			console.log('enemy fired');
			bullets.push(new bullet(this.x + (this.w/2), this.y, "player"));
			this.fire = 40;
		} else {
			this.fire--;
		}
		
		
		if(hit > 0) {
			this.damage += hit;
			this.state = 0;
			//this.move = 5;
			
			//play a explosion!
			SoundManager.playSound('resources/11263_1396702878.mp3');
			player.shotsOnTarget++;	//we hit something

			//draw explosion	
			exAnim.push({frame: 0, x: this.x, y: this.y});
		}
		
		//console.log('enemy health: '+this.health+', damage: '+this.damage);
		if(this.damage >= this.health) {
			exAnim.push({frame: 0, x: this.x + 10, y: this.y + 10, timeout: 100});			
			exAnim.push({frame: 0, x: this.x + 5, y: this.y + 20, timeout: 200});
			exAnim.push({frame: 0, x: this.x + 10, y: this.y + 15, timeout: 300});
			exAnim.push({frame: 0, x: this.x + 20, y: this.y + 12, timeout: 500});

			//log a score
			game.score += 100;
			
			//imcrease player size a little, for funzies
			player.health += 1;
			
			//finally kill off the ship
			return false;	//he dead
		}
		
		//fell off the bottom of the screen - dead
		if(this.y > getCanvas().height + 50) return false;

		this.motion();

		return true;
	}
}