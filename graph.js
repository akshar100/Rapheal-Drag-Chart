
var Rg = function(config){
	
	this.container = config.container || document; 
	this.xaxis = config.x; 
	this.yaxis = config.y;  
	this.snap = true || config.snap;
	this.separator = 35 || config.separator;
	this.yseparator = 50;
	this.dotsize = 5 || config.dotsize;
	this.xlen = this.xaxis.length*(this.dotsize+this.separator); 
	this.ylen = this.yaxis.length*(this.yseparator+this.dotsize);
	this.paper = null;
	this.dotStack = [];
	this.gridStack = [ ];
	this.pathStack = [];
	this.minWidth = config.minWidth || 400; 
	

	if(this.xlen<200)
	{
		this.xlen = 400; 
		this.separator = this.xlen/this.xaxis.length - this.dotsize;
	}
	
	
	this.Line = function(startX, startY, endX, endY, raphael,color,width) {
		color = color || '#aaa';
		width = width || 5;
	    var start = {
	        x: startX,
	        y: startY
	    };
	    var end = {
	        x: endX,
	        y: endY
	    };
	    var getPath = function() {
	        return "M" + start.x + " " + start.y + " L" + end.x + " " + end.y;
	    };
	    var redraw = function() {
	        node.attr("path", getPath());
	    }
	
	    var node = raphael.path(getPath()).attr({fill: color, stroke: color, 'stroke-width': width});
	    return node;
	};

	
	 
	this.render = function()
	{
		this.container.style.width = this.xlen+30+'px';
		this.container.style.height = (this.ylen+30)+'px';
		this.paper = new Raphael(this.container, this.xlen+30, this.ylen+30);
		this.Line(0,this.ylen,this.xlen,this.ylen,this.paper,'#000',2);
		this.Line(this.dotsize+15,0,this.dotsize+15,this.ylen+30,this.paper,'#000',2);
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
		var parent = this;
		for(var dot in this.xaxis)
		{
			circle = this.paper.circle(i*(this.separator),this.ylen-this.dotsize*2,this.dotsize).attr({
				fill:this.randomColor(),
				cursor:'pointer',
				opacity: 1
			});
			circle._data_id = dot; 
			var text =  this.xaxis[dot]; 
			circle.mouseover((function(c,t){ return function(){
				if(c.tooltip && typeof c.tooltip.remove =="function")
				{
					c.tooltip.remove();
				}
				
				c.attr({r:dotsize+3});
				c.tooltip =  c.paper.text(c.attrs.cx+15,c.attrs.cy-15, t).attr({
					fill:'#f00'
				});
			};
		})(circle,text) 
			);
			
			circle.mouseout(function(){
				this.attr({r:dotsize});
				if(this.tooltip && typeof this.tooltip.remove =="function")
				{
					this.tooltip.remove();
				}
			});
			
			i++;
			
			
			var start = function () {
			    // storing original coordinates
			    this.ox = this.attr("cx");
			    this.oy = this.attr("cy");
			    this.attr({opacity: 0.5});
			    this.attr({r:dotsize});
			    if(this.tooltip && typeof this.tooltip.remove =="function")
				{
					this.tooltip.remove();
				}
			    
			},
			move = function (dx, dy) {
	
			    if((this.oy+dy)<initial_position && (this.oy + dy - dotsize)>0)
			 	{			   	
			   		this.attr({cx: this.ox, cy: this.oy + dy});
			   		this.__y = this.oy + dy;
			   		redraw(parent);
			   	}
			   	this.attr({r:dotsize+3});
			   	if(this.tooltip && typeof this.tooltip.remove =="function")
				{
					this.tooltip.remove();
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
			    				
			    				this.attr({cx: this.ox, cy: gridStack[i-1]});
			    			}
			    			else
			    			{
			    				this.attr({cx: this.ox, cy: gridStack[i]});
			    			}
			    			redraw(parent);
			    		}
			    	}
			    }
			    this.attr({opacity: 1});
			    this.attr({r:dotsize});
			    if(this.tooltip && typeof this.tooltip.remove =="function")
				{
					this.tooltip.remove();
				}
			};
			
			circle.drag(move, start, up);  
			this.dotStack.push(circle);
		}
		redraw(this);
		
		
	};
	var redraw = function(parent)
	{
		for(var path in parent.pathStack)
		{
			parent.pathStack[path].remove();
		}
		for(var i=0; i<parent.dotStack.length-1;i++)
		{
			
			var line = parent.Line(parent.dotStack[i].attrs.cx, parent.dotStack[i].attrs.cy, parent.dotStack[i+1].attrs.cx,parent.dotStack[i+1].attrs.cy, parent.paper); 
			parent.dotStack[i].toFront();
			parent.dotStack[i+1].toFront();
			parent.pathStack.push(line);
			
		}
		//Line from origin
		
		line = parent.Line( parent.dotsize+15 ,parent.ylen , parent.dotStack[0].attrs.cx,parent.dotStack[0].attrs.cy, parent.paper); 
		parent.dotStack[0].toFront();
		parent.dotStack[0].toFront();
		parent.pathStack.push(line);
		
	}
	this.randomColor = function(){
		
		var letters = '0123456789ABCDEF'.split('');
    	var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;

	};
	
	this.getPoints=function()
	{
		var that = this; 
		var point = function(id,x,y){
			
			var ymin = Math.min.apply(null,that.yaxis);
			var ymax = Math.max.apply(null,that.yaxis);  
			//console.log(ymax,ymin);
			if(y == that.dotsize*2) { y = 0; }
			else{ y += that.dotsize*2; } 
			var y_val = Math.round.apply(null,ymax*y/that.ylen);
						
			return {
				x:x,
				y:y_val,
				id:id
			};
			
		};
		var points = [];
		for(var p in this.dotStack)
		{
			points.push(new point(this.dotStack[p]._data_id,this.dotStack[p].attrs.cx,this.ylen - this.dotStack[p].attrs.cy) );	
		}
		
		return points; 
	}
	
	
	
	
	
	
}
