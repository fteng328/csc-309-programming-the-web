    
    
    // An indicator for what the mouse is currently doing
    var mouseStatus = 0;
    // 0 : Select Mode
    // 1 : Drawing, haven't click starting point
    // 2 : Drawing, clicked starting point
    // 4 : Dragging, haven't click target object
    // 5 : Dragging, clicked target object 
    // 6 : Resize, haven't click starting point
    // 7 : Resize, clicked target object
    
    
    var shapes = [];	// List of shapes
    var shapeSelect = 0;	// states which shape user selected to draw, 0 for not selecting anything
    var isSelected = -1;	// states if a shape is currently selected, -1 when not selecting anything
	
    var nextHighestZ = 0;// Stores the next value for z-index that is larger than any shape's in the list
	


	
     // A few of the functions triggered by buttons that changes mouseStatus rightaway 
    function selectTriangle(){
	shapeSelect = 2;
	mouseStatus = 1;
    };
    function selectLine(){
	shapeSelect = 1;
	mouseStatus = 1;
    };
    function selectSquare(){
	shapeSelect = 3;
	mouseStatus = 1;
    };
    function justSelect(){
	shapeSelect = 0;
	mouseStatus = 0;
    };
    
    
    function activateDrag(){
	if(mouseStatus == 0|4){
	    mouseStatus = 4;
	};
    };
    
    function activateResize(){
	if(mouseStatus == 0|6){
	    mouseStatus = 6;
	};
    };
    
    
    var backup;	// a secondary canvas, use for displaying during drawing	    
    
    // variables stores the coordinates of mouse when start drawing
    var clickX = 0;
    var clickY = 0;
    
    // Variables stores starting coordinates for Drag & Resize 
    var mouseDragStartX = 0;
    var mouseDragStartY = 0;
    var mouseResizeX = 0;
    var mouseResizeY = 0;
	
    function setUpStart(event) {
	switch (mouseStatus) {
		case 0:										
			if ( event.target.tagName == "CANVAS" ){			// detecting if the mouse is on canvas					
			    var temp0 = 0;
			    var findOrNot = false;	// if is clicked on a shape or not
			    shapes.reverse();								
			    while (temp0 != shapes.length){	// traverse through the shape list to find which shape is clicked on				
				if ( shapes[temp0].testHit(event.pageX, event.pageY) == true) {	
					shapes[temp0].zIndex = nextHighestZ;  // update zIndex			
					nextHighestZ++;						
					redraw();						
					isSelected = shapes.length-1;
					findOrNot = true;
					updateReport();
					break;}							
				temp0++;								
			    };
			    if ( findOrNot == false ){
				isSelected = -1;
				updateReport();
			    };
			};									
			break;									
		case 1:
			mouseStatus = 2;
			context.moveTo(event.pageX, event.pageY);
			clickX = event.pageX;
			clickY = event.pageY;
			context.putImageData(backup, 0, 0);
			break;
		case 4:
			if ( isSelected == -1){
			    mouseStatus = 0;
			    alert("No object is selected!!");
			}else{
			    if (shapes[isSelected].testHit(event.pageX, event.pageY) == true){
				mouseDragStartX = event.pageX;
				mouseDragStartY = event.pageY;
				mouseStatus = 5;
			    }else{
				mouseStatus = 0;
				alert("Didn't click on any shapes!!");
			    }
			};
			break;
		case 6:
			if ( isSelected == -1){
			    mouseStatus = 0;
			    alert("No object is selected!!");
			}else{
			    mouseResizeX = event.pageX;
			    mouseResizeY = event.pageY;
			    mouseStatus = 7;
			};
			break;
	};
    };
	
	
    
    function updateMouseCoordinates(event)  {
      	if ( event.target.tagName == "CANVAS" ){
	    var coordinates = document.getElementById("c01");
	    coordinates.innerHTML = event.target.tagName + " (" + event.pageX + ", " + event.pageY + ")";
	    switch(mouseStatus){
		case 2:
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.putImageData(backup, 0, 0);
            var Color  = changeColor();
		  	var OutColor = changeOutColor();
		  	var Width = changeWidth();
		    switch(shapeSelect){                                              //depending on differnt shapes, we call different shape constructors
			case 1:

		    	drawLine(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
		    	break;
			case 2:

		    	drawTriangle(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
		    	break;
			case 3:

			    drawSquare(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
			    break;}
		    break;
		case 5:	// drag, measure the relative movement of mouse since clicked the target shape to move the shape
		    var distanceX = event.pageX - mouseDragStartX;
		    var distanceY = event.pageY - mouseDragStartY; 
		    shapes[isSelected].x1 = shapes[isSelected].x1 + distanceX;
		    shapes[isSelected].x2 = shapes[isSelected].x2 + distanceX;
		    shapes[isSelected].y1 = shapes[isSelected].y1 + distanceY;
		    shapes[isSelected].y2 = shapes[isSelected].y2 + distanceY;
		    mouseDragStartX = event.pageX;
		    mouseDragStartY = event.pageY;
		    redraw();
		    break;
		case 7:	// resize, measure the relative movement of mouse to enlarge or shrink the shape 
		    var distanceX = event.pageX - mouseResizeX;
		    var distanceY = event.pageY - mouseResizeY; 
		    shapes[isSelected].x2 = shapes[isSelected].x2 + distanceX;
		    shapes[isSelected].y2 = shapes[isSelected].y2 + distanceY;
		    mouseResizeX = event.pageX;
		    mouseResizeY = event.pageY;
		    redraw();
		    break;
	      };
      	};
    };


      


	
    function finishDrawing(event) {
	switch(mouseStatus){
	    case 0:
		backup = context.getImageData(0, 0, canvas.width, canvas.height);
		break;
	    case 2:
		backup = context.getImageData(0, 0, canvas.width, canvas.height);
        var Color  = changeColor();
	    var OutColor = changeOutColor();
		var Width = changeWidth();
		switch(shapeSelect) {                                               //push differnt shapes we draw into the shape[] array
		    case 1:

			shapeSelect = 1;
			var shape = new Line(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
			shapes.push(shape);
			mouseStatus = 1;
			break;
		    case 2:

			shapeSelect = 2;
			var shape = new Triangle(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
			shapes.push(shape);
			mouseStatus = 1;
			break;
		    case 3:

			shapeSelect = 3;
			var shape = new Square(clickX, clickY, event.pageX, event.pageY,Color,OutColor,Width);
			shapes.push(shape);
			mouseStatus = 1;
			break;
			};
		break;
	    case 5:
		mouseStatus = 0;
		break;
	    case 7:
		mouseStatus = 0;
		break;
	};
    };
    
    

    function redraw(){
	var index = 0;
	context.clearRect(0, 0, canvas.width, canvas.height);
	shapes.sort(zSort);					
	while ( index != shapes.length ){
	    var temp = shapes[index];
	    switch(temp.type){
		case 1:  
		    drawLine(temp.x1, temp.y1, temp.x2, temp.y2,temp.colorInside,temp.colorBorder,temp.widthBorder);
		    break;
		case 2:
		    drawTriangle(temp.x1, temp.y1, temp.x2, temp.y2,temp.colorInside,temp.colorBorder,temp.widthBorder);
		    break;
		case 3:	
		    drawSquare(temp.x1, temp.y1, temp.x2, temp.y2,temp.colorInside,temp.colorBorder,temp.widthBorder);
		    break;
	    };
	    index++;
	};
    };
    	

	
    
    /*********************************************************************************
	*******************Not so important supporting functions**************************
	**********************************************************************************/ 
    
   // specific function support the sorting of shape list according to z-index
    function zSort(a, b){
	return (a.zIndex - b.zIndex);
    };

    //  shows user which shape is currently clicked on
    function updateReport(){
	var report = document.getElementById("c02");
	var shape;
	if (isSelected == -1){
	    shape = "Nothing";
	}else{
	    switch (shapes[isSelected].type){
		case 1:
		    shape = shapes[isSelected].colorBorder + " Line";
		    break;
		case 2:
		    shape = shapes[isSelected].colorInside + " Triangle";
		    break;
		case 3:
		    shape = shapes[isSelected].colorInside + " Square";
		    break;
	    };
	};
	report.innerHTML = "Now Selecting : " + shape;
    }; 
   
    
    
    
    
    
    /*********************************************************************************
	*******************Other Button-triggered functions*******************************
	**********************************************************************************/
	
	
	// Called by button erase
	function eraseShape(){
	    if (isSelected == -1){
		alert("Nothing is Selected!");
	    }else{
		shapes.pop();
		redraw();
		nextHighestZ = nextHighestZ - 1;
		isSelected = -1;
		updateReport();
	    };
	};
	
	
	// Called by button copyAndPaste
	function copyPaste(){
	    if (isSelected == -1){
		alert("Nothing is Selected!");
	    }else{
		var temp;
		var old = shapes[isSelected];
		switch(old.type){
		    case 1:
			temp = new Line(old.x1+10, old.y1+10, old.x2+10, old.y2+10,old.colorInside,old.colorBorder,old.widthBorder);
			break;
		    case 2:
			temp = new Triangle(old.x1+10, old.y1+10, old.x2+10, old.y2+10,old.colorInside,old.colorBorder,old.widthBorder);
			break;
		    case 3:
			temp = new Square(old.x1+10, old.y1+10, old.x2+10, old.y2+10,old.colorInside,old.colorBorder,old.widthBorder);
			break;
		};
		temp.zIndex = nextHighestZ;
		nextHighestZ++;
		shapes.push(temp);
		redraw();
		isSelected = -1;
		updateReport();
	    };
	};
	
	
	// called by button ClearCanvas
	function deleteAll(){
	    shapes.length = 0;
	    redraw();
	    nextHighestZ = 0;
	    isSelected = -1;
	    updateReport();
	};

	
	// called by button Submit
	function submitChange(){
	    if (isSelected == -1){
		alert("Nothing is Selected!");
	    }else{
		var tempFill = readColor();
		var tempBorder = readOutColor();
		var tempWidth = readWidth();
		shapes[isSelected].colorInside = tempFill;
		shapes[isSelected].colorBorder = tempBorder;
		shapes[isSelected].widthBorder = tempWidth;
		redraw();
		updateReport();
	    };
	};
	
	
	

	
    
    /*********************************************************************************
	*******************Functions for reading inputs from forms*************************
	**********************************************************************************/
	

	function changeColor()
	{
	var x=document.getElementById("fillcolor").selectedIndex; //get select
	var y=document.getElementsByTagName("option"); //read options
	return y[x].text;
	}

	function changeOutColor()
	{
	var x=document.getElementById("outlinecolor").selectedIndex;
	var y=document.getElementsByTagName("option");
	return y[x+6].text;
	}

	function changeWidth(){
	var x=document.getElementById("outlinewidth").selectedIndex;
	var y=document.getElementsByTagName("option");
	return y[x+12].text;
	}
	
	
	

	
	function readColor()
	{
	var x=document.getElementById("cfillcolor").selectedIndex; //get select
	var y=document.getElementsByTagName("option"); //read options
	return y[x+18].text;
	}

	function readOutColor()
	{
	var x=document.getElementById("coutlinecolor").selectedIndex;
	var y=document.getElementsByTagName("option");
	return y[x+24].text;
	}

	function readWidth(){
	var x=document.getElementById("coutlinewidth").selectedIndex;
	var y=document.getElementsByTagName("option");
	return y[x+30].text;
	}	
	
	/*********************************************************************************
	*******************Specific Functions for drawing each shape**********************
	**********************************************************************************/
	
    function drawLine(clickX, clickY, x, y,color,stroke_color,width){
    	var fillCol= color;
     	var strokeCol = stroke_color;
	context.beginPath();
	context.moveTo(clickX, clickY);
	context.lineTo(x, y);
	context.fillStyle = fillCol;
	context.strokeStyle = strokeCol;
	context.fill();
   	context.lineWidth = width;
	context.stroke();

    };

      
    function drawTriangle(clickX, clickY, x, y,color,stroke_color,width) {
    	var fillCol= color;
     	var strokeCol = stroke_color;
	context.beginPath();
	context.moveTo(clickX, clickY);
	context.lineTo(x, clickY);
	var length = Math.abs(clickX-x);    
	if ( clickX > x ){
	    context.lineTo(x+(length)/2, clickY-length);}
	else{
	  context.lineTo(x-(length)/2, clickY-length);};
	context.closePath();
	context.fillStyle = fillCol;
	context.strokeStyle = strokeCol;
	context.fill();
	context.lineWidth = width;
	context.stroke();;
    };
      
      
    function drawSquare(clickX, clickY, x, y, color, stroke_color, width) {
	context.beginPath();
	context.moveTo(clickX, clickY);
	context.lineTo(x, clickY);	
	var fillCol= color;
	var strokeCol = stroke_color;
	var length = Math.abs(clickX-x);
	    context.lineTo(x, clickY-length);
	    context.lineTo(clickX, clickY-length);
	context.closePath();
	context.fillStyle = fillCol;
	context.strokeStyle = strokeCol;
	context.fill();
	context.lineWidth = width;
	context.stroke();;
	};	
	
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	////////////////Data Structures////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	
	
	function Triangle(x1, y1, x2, y2,fillColor,outlineColor,outlineWidth){
		this.type = 2;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.colorInside = fillColor;
  	    this.colorBorder = outlineColor;
  	    this.widthBorder = outlineWidth;
	    this.zIndex = nextHighestZ;
	    nextHighestZ++;
                                                 //hittest for Triangle checks
		this.testHit = function(x, y){      
			var length = Math.abs(this.x1-this.x2);
  	    	var xMid  = (this.x1 + this.x2) / 2;
  	    	var yTop = this.y1 - length; 
			
			var slope1 = (yTop - this.y1)/(xMid - this.x1);
	  	  	var slope2 = (this.y1 - yTop)/(this.x2 - xMid);
  		  	var intercept1 = this.y1 - this.x1*slope1; 
  	  		var intercept2 = yTop - xMid*slope2;

			var y_expected1 = x * slope1 + intercept1;
  	  		var y_expected2 = x * slope2 + intercept2;
 
  	  		if (this.x1 < this.x2){            //when we draw Triangles from the left to right
	  	  		if(x > this.x1 & x < xMid){
	  	  			//console.log("leftside");
	  	  			if (y > y_expected1- 45 & y < this.y1+45){
	  	  				return true;}
	  	  			else {return false};
	  	  		}
	  	  		else if (x > xMid & x < this.x2){
	  	  			//console.log("rightside");
	  	  			if (y > y_expected2-45 & y < this.y1+45){
	  	  				return true;}
	  	  			else {return false;}
	  	  		}
	  	  	}
	  	  	else if(this.x1 > this.x2) {          //when we draw Triangles from right to left

	  	  		if(x > xMid & x < this.x1){
	  	  			if (y > y_expected1-45 & y < this.y1 + 45)
	  	  				return true;
	  	  		}
	  	  		else if(x < xMid & x > this.x2){
	  	  			if (y > y_expected2-45 & y < this.y1 + 45)
	  	  				return true;
	  	  		}
	  	  	}
	  	  	else return false;
		}
	};
    

    function Line(x1, y1, x2, y2,fillColor,outlineColor,outlineWidth ) {
	  	this.type = 1;
    	this.x1 = x1;
      	this.y1 =  y1;
    	this.x2 = x2;
  	    this.y2 =  y2;
		this.colorInside = fillColor;
  	    this.colorBorder = outlineColor;
  	    this.widthBorder = outlineWidth;
	    this.zIndex = nextHighestZ;
	    nextHighestZ++;
  	    
  	    var slope = (this.y2 - this.y1)/(this.x2 - this.x1);
  	    this.slope = slope;
  	    var intercept = this.y1 - this.x1 * slope;
  	    this.intercept = intercept;
  		this.testHit = function(x,y){
  	    						// define a line y = ax + b for btween the 2 points and then use this line to define a hitbox
  	    						//for a line that draws from left to right
  	    	if(this.x1 < this.x2){
  	    		if(this.x1<x & this.x2>x){	
	  	    	    var y_expected = x * (slope) + intercept;
	  	    	    return (y < y_expected +15) & (y > y_expected - 15);
	  	    	}
	  	    	else return false;
	  	    }
	  	    else if (this.x1 > this.x2)	{
	  	    	if(this.x1>x & this.x2<x){
  	    		    var y_expected = x * (slope) + intercept;
	  	        	return (y < y_expected +15) & (y > y_expected - 15);
	  	    	}
	  	    	else return false;
	  	    }
  	    };

  };
  
  	function Square(x1, y1, x2, y2,fillColor,outlineColor,outlineWidth) {
	    this.type = 3;
	    this.zIndex = nextHighestZ;
	    nextHighestZ++;
	    this.x1 = x1;
	    this.y1 = y1;
	    this.x2 = x2;
	    this.y2 = y2;
	    this.colorInside = fillColor;
  	    this.colorBorder = outlineColor;
  	    this.widthBorder = outlineWidth;
  	    this.testHit = function(x,y){
			      var length = Math.abs(this.x1-this.x2);
			      if ( this.x1 < this.x2){
				  return ((x > this.x1)&(x < this.x2))&
					  ((y < this.y1)&(y > this.y1-length));
			      }else{
				  return ((x > this.x2)&(x < this.x1))&
					  ((y < this.y1)&(y > this.y1-length));};
			      };

	};
    
    

    
    
    
       
