
var Rg = function(config){
	
	this.container = config.container || document; 
	this.xaxis = config.x; 
	this.yaxis = config.y;  
	this.snap = false || config.snap;
	this.separator = 35 || config.separator;
	this.yseparator = 50;
	this.dotsize = 5 || config.dotsize;
	this.xlen = this.xaxis.length*(this.dotsize+this.separator); 
	this.ylen = this.yaxis.length*(this.yseparator+this.dotsize);
	this.paper = null;
	this.dotStack = [];
	this.gridStack = [ ];
	
	 
	this.render = function()
	{
		this.container.style.width = this.xlen+'px';
		this.container.style.height = this.ylen+'px';
		this.paper = new Raphael(this.container, this.xlen, this.ylen);
		
		var i = 1 ; 
		var circle; 
		var spacing = this.ylen/this.yaxis.length -5;
		
		for(var dot in this.yaxis)
		{
			this.paper.text(this.dotsize, this.ylen-spacing*i, this.yaxis[dot] ); i++;
			this.gridStack.push(this.ylen-spacing*i+this.yseparator)
		}
		this.gridStack = this.gridStack.reverse();
		this.gridStack[this.gridStack.length] = this.ylen-this.dotsize*2;
		
		i=1;
		var initial_position = this.ylen-this.dotsize*2;
		var dotsize = this.dotsize; 
		var snap = this.snap;
		var previous  = this.dotStack.length>0 && this.dotStack[this.dotStack.length-1] ;
		var gridStack = this.gridStack ;
		var ylen = this.ylen; 
		for(var dot in this.xaxis)
		{
			circle = this.paper.circle(i*(this.separator),this.ylen-this.dotsize*2,this.dotsize).attr({
				fill:this.randomColor(),
				cursor:'pointer',
				opacity: 1
			});
			i++;
			
			console.log(gridStack);
			var start = function () {
			    // storing original coordinates
			    this.ox = this.attr("cx");
			    this.oy = this.attr("cy");
			    this.attr({opacity: 0.5});
			    
			    
			},
			move = function (dx, dy) {
			
			
			
				
			    
			    if((this.oy+dy)<initial_position && (this.oy + dy - dotsize)>0)
			 	{			   	
			   		this.attr({cx: this.ox, cy: this.oy + dy});
			   		this.__y = this.oy + dy;
			   	}
			    
				
			   
			   
			},
			up = function () {
			    var c_y =  this.__y;
			    if(snap){
			    	
			    	for(var i=1; i<gridStack.length;i++ )
			    	{
			    		
			    		
			    		if(gridStack[i-1]<=c_y && c_y<gridStack[i])
			    		{
							
			    			if( (gridStack[i-1] - c_y ) > (c_y - gridStack[i]) )
			    			{
			    				console.log(c_y);
			    				this.attr({cx: this.ox, cy: gridStack[i-1]});
			    			}
			    			else
			    			{
			    				this.attr({cx: this.ox, cy: gridStack[i]});
			    			}
			    		}
			    	}
			    }
			    this.attr({opacity: 1});
			};
			
			circle.drag(move, start, up);  
			this.dotStack.push(circle);
		}
		
	};
	
	this.randomColor = function(){
		
		var letters = '0123456789ABCDEF'.split('');
    	var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;

	};
	
	
	
	
	
	
}
