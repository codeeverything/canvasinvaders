var SoundManager = {
	soundQueuePos: 0,
	vol: 0.2,
	musicChannel: null,
	playSound: function(url) {
		if(this.soundQueuePos >= 8) this.soundQueuePos = 0;
	
		//get our player element
		var player = document.getElementById('aud'+this.soundQueuePos);
		player.pause();	//pause if it's still playing
		player.src = url;	//set to this sound
		player.volume = this.vol;
		player.play();	//play it
	
		//move to the next available player
		this.soundQueuePos++;	
	},
	playMusic: function(src) {
		if(src) {
			this.musicChannel.src = src;
		}
		this.musicChannel.play();
	},
	pauseMusic: function() {
		this.musicChannel.pause();
	},
	musicVolume: function(vol) {
		if(vol < 0) vol = 0;
		if(vol > 1) vol = 1;
		
		this.musicChannel.volume = vol;
	},
	volume: function(change) {
		if(!change) return this.vol;
		
		this.vol += change/10;
		
		if(this.vol < 0) this.vol = 0;
		if(this.vol > 1) this.vol = 1;
	},
	init: function(channels) {
		//create some audio elements to allow for layered sounds
		for(var i=0; i< channels; i++) {
			var aud = document.createElement('audio');
			aud.id = 'aud'+i;
			document.body.appendChild(aud);
		}
		
		//setup special music channel
		var music = document.createElement('audio');
		music.id = 'music';
		music.loop = true;
		document.body.appendChild(music);
		this.musicChannel = music;		
	}
}