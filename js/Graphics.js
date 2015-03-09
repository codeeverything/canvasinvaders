var Graphics = {
	transparentColorOverlay: function(ctx, color, opacity, width, height, left, top) {
		c.save();
		c.globalAlpha = opacity || 0.2;
		c.fillStyle = color || '#fff';
		
		left = left || 0;
		top = top || 0;
		width = width || getCanvas().width;
		height = height || getCanvas().height;
		c.fillRect(left, top, width, height);

		c.restore();
	},
	addAnim: function(source, frameWidth) {
		
	},
	drawAnim: function(anim) {
		//more generic function to draw an animation
		
		// draw cropped image
	        var sourceX = anim.width;
	        var sourceY = anim.sourceY;
	        var sourceWidth = anim.width;
	        var sourceHeight = anim.sourceHeight;
	        var destWidth = anim.destWidth;
	        var destHeight = anim.destHeight;
	        var destX = 100;
	        var destY = 100;
	
		for(var i=0; i<exAnim.length; i++) {
			if(exAnim[i].frame > 13) {
				//exAnim[i] = null;	
				exAnim.splice(i);
				continue;
				//exAnim[i].frame = 0;
			}
	
			sourceX = anim.width * exAnim[i].frame;
			destX = exAnim[i].x;
			destY = exAnim[i].y;
	
			if(exAnim[i].timeout) timeout=exAnim[i].timeout;
			else timeout=0;
			
			//we can use the timeout function to delay animation and have explosions happen in sequence
			(function(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
				setTimeout(function() {
					c.drawImage(exImg, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
				}, timeout);
			})(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
	
			exAnim[i].frame++;
		}
	}
}