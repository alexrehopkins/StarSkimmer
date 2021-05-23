var starry = []; //array where classes for the stars are stored
var eNum = 150; //how many stars created
var vel;    //vector for the speed of ship
var xLoc = -1500;    //starting x position for the end planet/ship
var yLoc = 450; //starting y pos for end
var winner = 1.01;   //variable used to store the scale of the ship, somewhat tracks the gamestate too.
var dstv = 0; //magnitude of the speed
var time = 99999;    //current time left, used for time trial mode, but also tracks gamestate
var coinY = 180; //y position of the powerup
var coinX = -3000; //x position of the powerup

let song;  //standard soundtrack
let songfast; //tweaked standard soundtrack to increase tension
let boost;    //sound thats played while at high speed/getting boost star
let endwin;   //sound played upon winning
let endlose;  //sound played upon losing similar tune as winning with a few off notes

function setup() {    //self explanatory
	song = loadSound('sounds/starsong.wav');   //load song, learnt from in lesson workshop session, requires local server or to be uploaded to panel to run
	songfast = loadSound('sounds/starsongfast.wav'); //load song
	boost = loadSound('sounds/booster.wav'); //load song
	endwin = loadSound('sounds/endingwin.wav');  //load song
	endlose = loadSound('sounds/endinglose.wav');  //load song
  var canvs = createCanvas(700, 700);     //square canvas
  canvs.parent('sketch-holder'); //used technique I learned from first semester for centering the canvas
	rectMode(CENTER);      //this mode is my preference for coding with
	angleMode(DEGREES);         //same as above
  noStroke();        //no outlines for the art style
  for(let i = 0; i < eNum; i++) {      //loop that fills the array with the classes each with a different size
    starry.push(new starr());        //creates the star
    starry[i].construct(i);      //runs the initialising functions and sets up the randomised position
	}
	vel = createVector(0,0);    //vector for the speed of the ship
  
}

function draw() {      //run this every frame
  for(let i = 0; i < 100; i++) {      //loop for doing the gradient in the sky
    fill(i/3,i/3,i/1.2);  //decides the fill for the part of the sky, the bright value is a standard of 100 but increases when lightning strikes
		if (time != 99999) { //if time is not 99999 it is in time attack mode, so..
    fill(i/1.2,i/3,i/3); //change colour scheme of background
    }
    rect(width/2,(i*height/100)+(height/100/2), width, height/100+1) //does the pieces of the sky starting from the top
	}
  if (time < 9999 && winner != 0.01) { //if time is smaller than 9999 it is in time attack mode, so..
      time -= 1/60; //so decrease time left to reach goal, used 1/60 as the program typically runs 60 fps
    }
  if (time <= 0) {     //if time hits 0 then
      	ender("YOU LOSE");      //run end sequence with message 'you lose'
    }
  planet();    //function for spawning the end goal planet or alternate spaceship
  coin();     //function for spawning a boost coin
  if (vel.x == 0 && winner == 1.01) {  //menu
	endwin.stop();   //confirm that ending songs are not playing if the game has been reset
	endlose.stop(); //ditto
	winner = 1.01;  //used as a way to track game state
  	vel.y = -0.01;    //used to conteract the natural gravity
    vel.x = 0;     //to stop player starting without choosing mode
    fill(155,155,255);   //light blue
  	rect(width/3,height/3-10,2*width/3+20,50);  //stylised box shadow
    rect(width/5,height/3+70,2*width/5+20,50);  //ditto
    fill(255);    //sets menu as default white
    if (mouseY > height/3-45 && mouseY < height/3+5 && mouseX < 2*width/3) {     //check if mouse is over first button
    fill(255,200,220);  //is set as a pink if hovered over, to indicate it is interactive
    if (mouseIsPressed) {      //check if mouse is clicked
      starter(0);    //initiate casual game mode
      if (song.isPlaying() == 0) {       //check the song isnt already playing
      song.loop();        //loop the song
  	  }
      winner = 1;      //set as neutral gamestate
      }
    }
  rect(width/3,height/3-20,2*width/3,50);   //draw the appropriate coloured menu box
    fill(255);       //repeats process for timed theme mode menu option
	if (mouseY > height/3+35 && mouseY < height/3+85 && mouseX < 2*width/5) {  //ditto
    fill(255,200,220); //ditto
    if (mouseIsPressed) { //ditto
      starter(1); //initiate the game carrying value 1, this lets game know to start the timer
      if (songfast.isPlaying() == 0) { //ditto
      	songfast.loop(); //ditto
      }
      winner = 1; //ditto
      }
    }
  rect(width/5,height/3+60,2*width/5,50);    //draw the appropriate coloured menu box
	fill(155,155,255);      //light blue
	rect(width/4,height/2,width/2,7);  //long light beam for ship on menu
	fill(200,200,255);     //lighter blue
	rect(width/4,height/2,width/2,3);  //inner light beam for ship on menu
  fill(0);        //black to contrast the menu buttons
  textSize(30);    //big size for menu
  text('Casual Mode',width/3+15,height/3-10);    //describe menu
  text('Time Attack',width/8,height/3+70);    //describe menu
  textSize(15);     //smaller size for instructions to play
  fill(255);     //white to contrast dark background
	text('Hover mouse over stars to move.',60,height/3+200);   //hint text
	text('Follow this arrow to the landing site!',60,height/3+230);     //ditto
	text('Collect shooting stars to give you a boost!',60,height/3+260);  //ditto
	}
  
  if (winner < 0.02 && time > 1) {    //keeps track of size of the ship (if shrinks to certain size it is assumed player has reached end), though wont work if time has ran out
  	ender("YOU WIN");    //start end sequence with victory message
  }
  if (vel.y<8 && winner != 0.01){   //check for verticle speed and that game is not over
    vel.add(0,0.01);  //gravity, only slight drag so it is impossible for ship to get stuck with no stars to cling to
  }        
  push();     //in preparation for transformations
  translate(width/2,height/2);     //move origin to centre of screen
  grapple();     //run the function that deals with the ship, called grapple because originally you grappled to the stars
  pop();     //remove any set transformations
  for(let i = 0; i < eNum; i++) {     //iterate through all the stars in the array
    starry[i].make();       //run the main star function that draws the stars
	}
  vel.mult(0.995);  //decelerate the ship over time
  if (time < 9999) {  //if time is below 9999 it is in timed theme mode
    fill(255);  //white
    textSize(50); //big font
    text(int(time),50,50); //display time remaining
  }
}




function starter(gm) { //function for starting a game
	vel.add(10,0);  //shoot off the ship to the right
  winner = 1.01; //set ship size
	while (dist(0,0,xLoc,yLoc) < 2000) {  //if the location of the planet is too close to start it selects a new random, until it finds one far enough away
		xLoc = random(-4000,4000);  //find the random x value
		yLoc = random(-4000,4000); //find the random y value
	}
  if (gm == 1) { //reads the 'gm' value to tell if you clicked time trial or casual mode, if it is 1 then
  	time = dist(0,0,xLoc,yLoc)/47+5;  //it selects a time limit according to the distance away you are
  }
}

function planet() {  //function for dealing with drawing the end goal
  if (time != 99999) {   //if time is not 99999, then it is in time trial mode
    fill(200,100,100);   //red
    ellipse(xLoc,yLoc,500,500); //outer planet drawn at location of xLoc and yLoc
    fill(200,110,105);   //reddish
    ellipse(xLoc,yLoc,480,480); //not quite outer
    fill(200,115,110);    //lighter red
    ellipse(xLoc,yLoc,440,440); //inner shade
    fill(200,120,115);  //light red
    ellipse(xLoc,yLoc,400,400); //innermost shade
    fill(180,150,150);  //pinkish tint grey to indicate the station is beneath the red atmosphere
    rect(xLoc,yLoc,40,40); //station
    ellipse(xLoc+20,yLoc-20,20,20); //stationpod
    ellipse(xLoc+20,yLoc+20,30,30); //ditto
    ellipse(xLoc-20,yLoc+20,20,20); //ditto
    ellipse(xLoc-20,yLoc-20,30,30); //ditto
    fill(210,180,180); //lighter version of above
    rect(xLoc+2,yLoc-27,5,15); //station
    ellipse(xLoc-20,yLoc-20,15,15); //stationpod
    ellipse(xLoc+2,yLoc-33,10,10); //ditto
    ellipse(xLoc+20,yLoc+20,15,15); //ditto
  }
  else {
    push(); //used a translation since all the elements were confusing to keep track of with just xLoc and yLoc
    translate(xLoc,yLoc); //translate all following elements
    fill(155,155,255,50); //glows
    ellipse(30,-123,20,20); //light glow
    ellipse(30,-123,10,10); //ditto
    ellipse(50,-133,20,20); //ditto
    ellipse(50,-133,10,10); //ditto
    ellipse(-140,-42,120,30); //booster
    ellipse(-140,-42,100,20); //booster
    ellipse(-140,-42,80,10); //booster
    fill(180); //light grey
    quad(-150,0,250,0,150,-71,-50,-71); //piece of central body
    rect(50,-20,3,230); //ditto
    rect(30,-10,3,230); //ditto
    rect(20,-60,60,60); //ditto
    rect(60,-50,60,60); //ditto
    rect(-80,-40,60,40); //ditto
    fill(150); //shading grey
    quad(-100,0,200,0,100,50,0,50);//piece of central body
    rect(-115,-42,10,30);//ditto
    fill(50); //dark grey
    rect(20,20,60,20); //holes
    rect(50,-20,240,5); //details
    rect(50,-30,200,5); //details
    rect(50,-40,160,5); //details
    pop(); //remove transformations
  }
  push(); //new transformations for the arrow guidance
  translate(constrain(xLoc,30,width-30), constrain(yLoc,30,height-30)); //translate to side of screen but no further
  rotate(atan2(yLoc,xLoc)); //rotate accordingly to point to end goal
  fill(255); //white
  rect(-6,0,15,15); //piece of arrow
  triangle(0,-22.5,0,22.5,22.5,0); //ditto
  scale(0.8); //scale down for the center piece of arrow
  fill(constrain(255-dist(width/2,height/2,xLoc,yLoc)/10,0,255),0,10); //change colour according to distance away
  rect(-3,0,18,10); //piece of arrow
  triangle(5,-15,5,15,20,0); //ditto
  pop(); //remove transformations
  xLoc -= vel.x/20; //move planet according to speed of ship to imply the ship is moving towards it
  yLoc -= vel.y/20; //used a small value to imply the planet was so big and also far in the background so it moved slower relative to the ship and larger stars
  if (dist(xLoc,yLoc,width/2,height/2) < 100) { //conditional for checking if the ship is near to the end
  winner -= 0.01; //if its true it begins to shrink the ship, implies the ship is flying away to end goal
  } else if ( winner < 1 && time > 1 ) { //if the ship goes out of range the ship will increase in size again
      winner += 0.01; //implies ship is moving back to foreground
  }
}

function coin() { //function that deals with boost power up
  while (dist(0,0,coinX,coinY) > 1000) { //while the booster is more than 1000 units away from ship it will find a new location
  	coinY = random(-1000,1000); //new random y val
  	coinX = random(-1000,1000); //new random x val
    if (coinX < 400 && coinX > -400 && coinY < 400 && coinY > -400) { //if the x and y coordinates would end up showing the boost appearing on the current screen then
    	coinX = 10000; //then it sends the coin far away to redo the while statement and find another random location
    }
  }
  push(); //new transformations
  translate(width/2+coinX,height/2+coinY);  //move to center of screen and to the point where booster is
  coinX -= vel.x/4; //move booster accordingly to ships speed, is faster than planet but not as much as some closer stars, indicates it is more in fore ground
  coinY -= vel.y/4; //ditto
  fill(250,200,100,100); //orange translucent
  ellipse(0,0,25,25); //circle
  ellipse(0,0,10,60); //verticle glimmer
  ellipse(0,0,60,10); //horizontal glimmer
  rotate(135); //rotate to do diagonal glimmers
  ellipse(0,0,5,45); //smaller glimmer
  ellipse(0,0,45,5); //ditto
  fill(250,250,150); //whiteish-yellow
  
  for(let i = 0; i < 18; i++) { //iterate 18 times for a selection of particles
    ellipse(i*random(1,6),i*random(1,3),6,6); //generate tiny particles in random positions within a triangle, they are generated according to the iteration, to give effect of sparking star
  }
  pop(); //remove transformations
  if (dist(0,0,coinX,coinY) < 40) { //if ship is less than 40 units away then 
  	coinY = 2000; //set a new position for the coin
  	coinX = 2000; //despite only having and picking up one coin, this gives the illusion there are many the player may find
    if (vel.mag() < 400)  { //if player is not already going super fast (if you chain too many boosts...)
  	vel.mult(5); //then multiply the player velocity, acts as a booster, but can be an obstacle and should be avoided if you cant steer into it at the correct angle
    }
  }
}

function ender(msg) { //function that deals with the end sequence
	song.stop(); //stop current song
	songfast.stop(); //ditto
	if (msg == 'YOU WIN') { //if message carried is you win
		if (endwin.isPlaying() == 0) { //check song isnt playing
			endwin.loop(); //play winning soundtrack
		}
	}
	else { //otherwise assume player lost
		if (endlose.isPlaying() == 0) { //check song isnt playing
			endlose.loop(); //loop the losing song, an offbeat alternative to winning song
		}
	}
	vel.set(0,0); //reset the ship velocity
  winner = 0.01; //render ship practically invisible and to allow the ending function to be ran again next frame
  fill(0); //black
  textSize(50); //big
  text(msg,width/2,height/2-20); //display the end message shadowing
  fill(250); // white
  text(msg,width/2+5,height/2-25); //display end message slightly above shadowing to give 3d effect
  fill(155,155,255); //blue
	rect(width/3-5,2*height/3-10,2*width/3+30,50); //box shadow again
  fill(255); //white
	if (mouseY > 2*height/3-45 && mouseY < 2*height/3+5 && mouseX < 2*width/3) { //another menu option checking for mouse
    fill(255,200,220); //pink
    if (mouseIsPressed) { //check for mouse clicks
      winner = 1.01; //reset gamestates
			time = 99999; //ditto
			vel.x = 0; //ditto
			xLoc = -1500; //ditto
      yLoc = 450; //ditto
      coinX = 3000; //ditto
      for(let i = 0; i < eNum; i++) { //reset the star positions
    		starry[i].construct(i); //construct the stars
			}
    }
  }
  rect(width/3,2*height/3-20,2*width/3,50); //the interactive menu box that updates to proper colour if hovered over
  fill(0); //black
  textSize(30); //biggish
  text('Main Menu',width/3+50,2*height/3-10); //text for box
}

function grapple() { //function for dealing with ship
	push(); //new transformations
	rotate(90); //rotate so ship starts on horizontal
	if (vel.x < 0) { //if ship is moving to the left
		rotate(180); //rotate by 180
	}
	rotate(atan(vel.y/vel.x)); //then rotate to face the direction your moving
  scale(winner); //scale the ship parts accordingly to the gamestate
	fill(200); //light grey
  rect(0, 0, 40, 20); //ship parts
  fill(255); //white
	rect(0, -10, 20, 40); //ship
	rect(0, -15, 10, 60); //ship
  fill(25,25,75); //dark blue
  rect(0,-15,10,15) //ship
  fill(230); //light grey
  rect(20, 0, 5, 30); //ship
  rect(-20, 0, 5, 30); //ship
  rect(0,-16,10,3) //ship
  rectMode(CORNER); //change rect mode to corner for easier drawing of the booster flames
  fill(155,155,255); //light blue
  dstv = vel.mag();  //magnitude of the velocity, originally used pythagoras
  rect(-2.5, 17.5, 5, dstv); //first part of flame
  fill(155,155,255,120); //slightly more transparent
  rect(-2.5, 17.5+dstv, 5, dstv); //next part of flame
  fill(155,155,255,70); //and so on
  rect(-2.5, 17.5+dstv*2, 5, dstv) //ditto
  fill(155,155,255,50); //ditto
  rect(-2.5, 17.5+dstv*3, 5, dstv) //ditto
  fill(155,155,255,30); //ditto
  rect(-2.5, 17.5+dstv*4, 5, dstv) //ditto
  fill(155,155,255,10); //nearly entirely transparent
  rect(-2.5, 17.5+dstv*5, 5, dstv) //last piece of flame
  if (dstv > 40) { //if ship is travelling faster than 40 units, normally only achieved through successful boost
  	if (boost.isPlaying() == 0) { //check if boost soundtrack isnt already playing to prevent multiple instances
  		boost.loop() //loop the short soundtrack
  	}
    fill(255,155,155,80); //red
  	rect(-22.5, 17.5, 5, (dstv-39)*10); //secondary flames on wings
    rect(17.5, 17.5, 5, (dstv-39)*10); //ditto
    rect(-20, 17.5, 2, (dstv-39)*10); //ditto
    rect(20, 17.5, 2, (dstv-39)*10); //ditto
    fill(255,(dstv-39)*10); //white more transparent as speed lowers back to 40, when it finally turns off
    rect(random(-300,300), -height/1.5, 1, 2*height); //random lines streak across centre of canvas
    rect(random(-300,300), -height/1.5, 1, 2*height); //they give the effect of high speed
    rect(random(-300,600), -height/1.5, 1, 2*height); //changing to new place every frame actually works well for them
  }
  else { //if speed isnt over 40
  	boost.stop(); //stop soundtrack
  }
	pop(); //remove transformations
}

class starr{ //class for the stars
  construct(sizer) {
 	  this.yPos = random(-1000,1000); //find random y position
    this.xPos = random(-1000,1000); //random x position
    while (this.yPos > -100 && this.yPos < 100+height && this.xPos > -100 && this.xPos < 100+width) { //check it isnt onscreen when it first spawns
  	 this.yPos = random(-1000,1000); //if so find a new value until it isnt
  	 this.xPos = random(-1000,1000); //ditto
    }
    this.size = sizer/3+10; //size value is according to the iteration in the loop it was made, no two stars are same size
    this.xVel = 0; //starting velocity at 0
    this.yVel = 0; //ditto
	  this.timer = 0; //timer variable keeps track of where the star is in the animation
  }
	make() { //main function for drawing the stars
    this.timer += 1; //increase timer value every frame
    if (this.timer > 20) { //if value is over 20
      this.timer = this.timer*-1; //then make it negative for the cycle to begin again
    }
    this.xPos += 1/80*-vel.x*this.size; //update position based on ships speed similar to goal and booster
    this.yPos += 1/80*-vel.y*this.size; //however also accounts for the size of the star, a smaller star moving slower to indicate distance from ship
    fill(255-constrain(this.yPos/4,0,105),150+constrain(this.yPos/4,0,105),250); //colour star according to position on screen
    if (time != 99999) { //if time is not 99999, then in timed mode
    	fill(250,255-constrain(this.yPos/4,0,105),150+constrain(this.yPos/4,0,105)); //use different colour scheme
    }
    if (dist(this.xPos, this.yPos, mouseX, mouseY) < 50 && dist(width/2,height/2,this.xPos,this.yPos) < 380 && winner != 0.01 && winner != 1.01 && vel.mag() < 40) {
      vel.add((this.xPos-width/2)*0.025-vel.x*0.25,(this.yPos-height/2)*0.025-vel.y*0.25);
      fill(250,200,200); //light red
    }
		push(); //new transformations
		translate(this.xPos,this.yPos); //apply shapes to position of the coordinates of the star
		quad((this.size+dist(0,0,0,this.timer))/2,0,0,-this.size/8,-(this.size+dist(0,0,0,this.timer))/2,0,0,this.size/8); //create a quadrilateral that scales according to the timer and size of star
		rotate(90); //rotate 90
		quad((this.size+dist(0,0,0,this.timer))/2,0,0,-this.size/8,-(this.size+dist(0,0,0,this.timer))/2,0,0,this.size/8); //same shape again to make star shape
		fill(255-constrain(this.yPos/4,0,105),150+constrain(this.yPos/4,0,105),250,20); //same colour but with a alpha value to make it translucent for the glow effect
    if (time != 99999) { //if time is not 99999
    	fill(250,255-constrain(this.yPos/4,0,105),150+constrain(this.yPos/4,0,105),20); //colour is updated
    }
    ellipse(0,0,this.size,this.size); //draw first glow
    ellipse(0,0,2*this.size/3,2*this.size/3); //draw second glow
    pop(); //remove transformations
    fill(255); //white
    if (dist(this.xPos,this.yPos,width/2,height/2) > 2000) { //if distance from centre of screen is more than 2000 then
    	this.construct((this.size-10)*3); //run construct again to reset this stars position, gives effect that there are seemingless endless stars, while remaining easier on the computer
    } 
	}  
}