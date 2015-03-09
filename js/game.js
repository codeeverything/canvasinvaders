var game = {
	paused: false,
	music: true,
	score: 0,
	entities: {
		bullets: [],
		enemies: []
	},
	stages: [],
	currentStage: 0,
	currentStageFrameCount: 0,
	reset: function() {
		this.score = 0;
		player.init();
		player.y = getCanvas().height - player.w;
		player.draw(c);
		
		this.loop();
	},
	init: function() {
		InteractionManager.add(document, 'onkeypress', function(e) {
			console.log(e.keyCode);

			if(e.keyCode == 112) {
				//P for pause
				game.paused = !game.paused;
				return false;
			}
		
			if(e.keyCode == 109) {
				//M for music
				game.music = !game.music;
		
				if(!game.music) SoundManager.pauseMusic();
				else SoundManager.playMusic();
			}
		
			if(e.keyCode == 43) {
				//+ to increase volume
				SoundManager.volume(1);
			}
		
			if(e.keyCode == 45) {
				//- to decrease volume
				SoundManager.volume(-1);
			}
		});
		
		
		//setup the star field
		var sc = getStar().getContext('2d');

		var grd=sc.createRadialGradient(30,30,2,30,30,20);
		grd.addColorStop(0,"#EDE5A4");
		grd.addColorStop(1,"transparent");
		
		// Fill with gradient
		sc.fillStyle=grd;
		sc.fillRect(10,10,50,50);
		
		//populate some stars
		var stars = [];
		for(var i=0; i<30; i++) {
			stars[i] = {x: Math.random() * getCanvas().width, y: Math.random() * getCanvas().height, scale: 1 + Math.random(), speed: Math.random() * 3};
		}
		
		this.stars = stars;

		//setup some sound stuff		
		SoundManager.init(16);
		//get the music going
		SoundManager.musicVolume(0.2);
		SoundManager.playMusic('resources/music.wav');
		SoundManager.volume(0);

		//make the game window the height of the screen
		getCanvas().height = document.documentElement.clientHeight;

		player.init('resources/battleship2.gif');
		player.y = getCanvas().height - player.w;
		player.draw(c);
		
		
		
		//fire up the first stage
		this.stages[0]();
		
		//begin looping over, running the game
		this.loop();
	},
	render: function() {

	},
	loop: function() {
		//if paused do nothing and move on
		if(game.paused) {
			//call loop again for the next frame
			var self = this;
			setTimeout(function() {
				self.loop();
			}, 35);
			return;
		}
		
		if(enemies.length == 0 && exAnim.length == 0) {
			console.log('stage complete!');

			this.currentStage++;
			this.currentStageFrameCount = 0;
			
			game.paused = true;
			
			if(this.stages[this.currentStage]) {
				this.stages[this.currentStage]();
				
				//c.clearRect(0, 0, getCanvas().width, getCanvas().height);
				c.font="30px system";
				c.fillStyle = '#fff';
				c.fillText("STAGE "+this.currentStage+" COMPLETE!", (getCanvas().width/2)-150, getCanvas().height/2);
				c.font="15px monospace";
				c.fillText("PRESS P TO CONTINUE", (getCanvas().width/2)-100, (getCanvas().height/2)+35);
				
				var self = this;
				setTimeout(function() {
					self.loop();
				}, 35);
			} else {
				alert('game over');
			}
			
			return;
		}
	
		if(!player.isAlive) {
			c.clearRect(0, 0, getCanvas().width, getCanvas().height);
			c.font="20px Arial";
			c.fillStyle = '#fff';
			c.fillText("Press space to reset", getCanvas().width/2, getCanvas().height/2);
			
			return;
		}
		
		//if no more enemies, we won that stage!
		//if we have another stage then call that one and start it when the user presses space
	
		if(InteractionManager.keyHeld || enemies.length > 0 || bullets.length > 0 || exAnim.length > 0)
			c.clearRect(0, 0, getCanvas().width, getCanvas().height);
	
		var stars = this.stars;
		for(var i=0; i<stars.length; i++) {
			c.save();
			c.scale(stars[i].scale, stars[i].scale);
			c.drawImage(getStar(), stars[i].x, stars[i].y);
			c.restore();
			
			stars[i].y += stars[i].speed;
			
			if(stars[i].y > getCanvas().height + 20) {
				stars[i] = {x: Math.random() * getCanvas().width, y: -20, scale: 1 + Math.random(), speed: Math.random() * 3};
			}	
			
		}	
	
		if(InteractionManager.keyHeld && player) {
			player.update();
		}
	
		if(player) player.draw(c);
	
		if(enemies.length) {
			for(var i=0; i<enemies.length; i++) {
				//check if its time for this enemy to appear yet
				if(this.currentStageFrameCount < enemies[i].timeout) continue;
				
				var eu = enemies[i].update();
				if(eu)
					enemies[i].draw(c);
				else {
					enemies.splice(i, 1);
				}
			}
		} else {
			c.clearRect(0, 0, getCanvas().width, getCanvas().height);
			c.font="20px Arial";
			c.fillText("Press space to reset", getCanvas().width/2, getCanvas().height/2);
		}
	
		if(bullets.length > 0) {
			for(var i=0; i<bullets.length; i++) {
				var pos = bullets[i].target == 'enemy' ? 15:-15;
				if(bullets[i].update(pos)) {
					//only draw a bullet if we don't return false which means its not on screen anymore
					bullets[i].draw(c);
				} else {
					//kill that bullet
					bullets.splice(i, 1);
				}
			}
		}
	
	
		if(exAnim.length > 0) drawExpl();
	
		if(player.hit > 0) {
			Graphics.transparentColorOverlay(c, '#ff0000', 0.2);
		}
	
		
	
		c.save();		
		c.fillStyle = '#fff';
		c.font = '12pt arial';
		c.fillText('Score: '+this.score, 10, 20);
		c.restore();
		
		
		//increment the frame we're on
		this.currentStageFrameCount++;
		
		//call loop again for the next frame
		var self = this;
		setTimeout(function() {
			self.loop();
		}, 35);
	}	
}