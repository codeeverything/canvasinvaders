var player = {
	x: 400,
	y: 400 - 30,
	w: 60,
	delta:0,
	deltaY:0,
	velocity: 10,
	imageObj: null,
	shotsFired: 0,
	shotsOnTarget: 0,
	hit: 0,
	health: 100,
	isAlive: true,
	draw: function(c) {
		//c.fillStyle = '#AAA';
		//c.fillRect(this.x, this.y, this.w, this.w);
		//(img,sx,sy,swidth,sheight,x,y,width,height);
		c.drawImage(this.imageObj, this.x, this.y, this.w, this.w);
		
		if(this.hit > 0) {
			this.hit--;
		}
		
		c.save();
		c.fillStyle = '#fff';
		c.fillRect(20, getCanvas().height - 20 - (this.health * 5), 10, this.health * 5);
		c.restore();
	},
	update: function(posx, posy) {
		this.x += this.delta;
		this.y += this.deltaY;
		
		if(this.x < 0) this.x = 0;
		if(this.y > (getCanvas().height - this.w)) this.y = getCanvas().height - this.w;
		if(this.x > (getCanvas().width - this.w)) this.x = getCanvas().width - this.w;
		if(this.y < 0) this.y = 0;
		
		if(enemies.length) {
			for(var i=0; i<enemies.length; i++) {
				var e = enemies[i];
				var bounds = e.getBounds();
				if(this.x >= bounds.x1 && this.x <= bounds.x2 && this.y >= bounds.y1 && this.y <= bounds.y2) {
					//player = null;	//player collided with enemy, they dead
					this.takeDamage();
					return false;
				}
			}
		}

		//var accuracy = 0;
		//accuracy = (this.shotsOnTarget/this.shotsFired)*100;
		//console.log("Accuracy: "+accuracy+"%");
	},
	getBounds: function() {
		return {x1: this.x, x2: this.x + this.w, y1: this.y, y2: this.y + this.w};
	},
	takeDamage: function() {
		this.hit = 5;
		
		this.health--;
		if(this.health <= 0) {
			this.isAlive = false;
		}
		
		//play a explosion!
		SoundManager.playSound('resources/11263_1396702878.mp3');

		//draw explosion	
		exAnim.push({frame: 0, x: this.x, y: this.y});
	},
	init: function(img) {
		if(img) {
			var imageObj = new Image();
			imageObj.src = img;
			this.imageObj = imageObj;
		}
		
		InteractionManager.add(document, 'onkeypress', function(e) {
			console.log(e.keyCode);
		
			if(e.keyCode == 32) {
				//space
		
				if(enemies.length == 0 || !player.isAlive) {
					//reset everything as a hack for now
					game.reset();
					stage1();
				}
		
				//alternate bullets from left and right guns
				if(this.leftGun == true) {
					bullets.push(new bullet(player.x + (player.w/2) - 16, player.y + 10, "enemy"));
				} else {
					bullets.push(new bullet(player.x + (player.w/2) + 16, player.y + 10, "enemy"));
				}
				
				this.leftGun = !this.leftGun;
		
				//console.log(bullets);
				
				//play a laser sound!
				SoundManager.playSound('resources/87402^LASER.mp3');
				player.shotsFired++;
		
				return false;
			}
		});
		
		InteractionManager.add(document, 'onkeydown', function(e) {
			this.keyHeld = true;
		
			//reset player motion, and recompute below
			player.delta = player.deltaY = 0;
			
			var activeKeys = this.activeKeys;
			
			activeKeys[e.keyCode] = true;
		
			if(activeKeys[39] == true) {
				//right arrow
				//player.deltaY = 0;
				player.delta = player.velocity;
			} 
		
			if(activeKeys[37] == true) {
				//left arrow
				//player.deltaY = 0;
				player.delta = -player.velocity;
			}
		
			if(activeKeys[38] == true) {
				//up arrow
				//player.delta = 0;
				player.deltaY = -player.velocity;
				return false;
			}
		
			if(activeKeys[40] == true) {
				//up arrow
				//player.delta = 0;
				player.deltaY = player.velocity;
				return false;
			}
		
		
			//console.log(e.keyCode);
		});
		
		InteractionManager.add(document, 'onkeyup', function(e) {
			this.keyHeld = e.keyCode == 32 ? true:false;
			player.delta = e.keyCode != 32 ? 0:player.delta;
			player.deltaY = e.keyCode != 32 ? 0:player.deltaY;
			this.activeKeys[e.keyCode] = false;
		});
		
		this.isAlive = true;
		this.health = 10;		
		this.w = 60;
	}
};