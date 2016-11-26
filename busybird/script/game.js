(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

    

var canvas = document.getElementById("main"),
    ctx = canvas.getContext("2d"),
    width = 400,
    height = 420,
    player = {
      x : width*0.3,
      y : 50,  /*fix*/
      width : 50,
      height : 50,
      speed: 5,
      velX: 0,
      velY: 0,
      jumping: false,
      passed: false
    },
    keys = [],
    friction = 0.9,
    gravity = 0.5,
    
    objectgap = 0.35, /*35% gap between top and bottom objects.. we can make the gap smaller to make it harder*/
    /*random object length*/
    ol = Math.floor(Math.random() * (8)),
    object_length = [{t:.3, b:1.7}, 
                     {t:.7, b:1.3}, 
                     {t:1.7, b:.3},
                     {t:1.3, b:.7},
                     {t:1.5, b:.5},
                     {t:.5, b:1.5},
                     {t:.6, b:1.4},
                     {t:1.4, b:.6}
                    ],
    object_top = {
        x: width*0.8,
        y: 0,
        width: 50,
        height: height*objectgap*object_length[ol].t,
        speed: 2
    },
    object_bottom = {
        x: width*0.8,
        y: height -10, //to be a little bit above the ground
        width: 50,
        height: -height*objectgap*object_length[ol].b,
        speed: 2
    },
    /*number of object passed succesfully*/
    passed_objects = 0; 

  
canvas.width = width;  
canvas.height = height;

    
/****************************************
 * Background
 ****************************************/
var bgc = document.getElementById("background");
var ctx0 = bgc.getContext("2d");
    bgc.width = width;
    bgc.height = height;
//draw Image
 var velocity=100;
 var bgImage = new Image();
 bgImage.addEventListener('load',drawImage,false);
 bgImage.src = "imgs/bg1.png"; 
function drawImage(time){ 
  var framegap=time-lastRepaintTime;
  lastRepaintTime=time;
  var translateX=velocity*(framegap/1000);
  ctx0.clearRect(0,0,canvas.width,canvas.height);
  var pattern=ctx.createPattern(bgImage,"repeat-x");
  ctx0.fillStyle=pattern;
  ctx0.rect(translateX,0,bgImage.width,bgImage.height);
  ctx0.fill();
  ctx0.translate(-translateX,0); 
  requestAnimationFrame(drawImage);
}
 var lastRepaintTime=window.performance.now();
    
/**************************************
 * cool imgs :)
 **************************************/
var bird_img = new Image();  bird_img.src = "imgs/PNG/frame-1.png";
var wall_img = new Image();  wall_img.src = "imgs/wall3.png";
var fire = new Image();      fire.src = "imgs/fir3.png";

// to count frames for the bird    
var img_int = 0;
    
    
    
//Game!!!!    
function update(){
    
  //init
  var th = object_top.height = height*objectgap*object_length[ol].t;
  var bh = object_bottom.height =  -height*objectgap*object_length[ol].b;
    
    // bird animation.. let me know if you figure a better way to do it lol
    // this will switch imgs every 3 frames
     if(img_int <= 5){
         bird_img.src = "imgs/PNG/frame-1.png";
     }else if (img_int <= 10){
         bird_img.src = "imgs/PNG/frame-2.png";
     }else if (img_int <= 15){
         bird_img.src = "imgs/PNG/frame-3.png";
     }else if (img_int <= 20){
         bird_img.src = "imgs/PNG/frame-4.png";
     }else{
         img_int = 0;
         bird_img.src = "imgs/PNG/frame-1.png";
     }
    
  // check keys
   if (keys[38] || keys[32]) {
     // up arrow or space
     if(!player.jumping){
       player.jumping = false;
       player.velY = -player.speed*2;
     }
   }
   if (keys[39]) {
       // right arrow
       if (player.velX < player.speed) {                         
           player.velX++;                  
       }          
   }          
   if (keys[37]) {                 
        // left arrow                  
       if (player.velX > -player.speed) {
           player.velX--;
       }
   }
    
   player.velX *= friction;
   player.velY += gravity*2;
   player.x += player.velX;
   player.y += player.velY;
   object_top.x -= object_top.speed;
   object_bottom.x -= object_top.speed;
   
   if (player.x >= width-player.width) {
    player.x = width-player.width;
    } else if (player.x <= 0) {
        player.x = 0;
   }
    
    // make the top & bottom objects come back after they reach the end
    if (object_bottom.x >= width-object_bottom.width) {
        object_bottom.x = width-object_bottom.width;
        } else if (object_bottom.x <= 0) {
            object_bottom.x = width;
    }
    if (object_top.x >= width-object_top.width) {
        object_top.x = width-object_top.width;
        } else if (object_top.x <= 0) {
            object_top.x = width;
            
            //reseting
            ol = Math.floor(Math.random() * (8));
            player.passed = false;            
    }
    
    // reset the game if the player hits top & bottom objects
    if (  player.x < object_top.x + object_top.width &&
		  player.x + player.width > object_top.x &&
		  player.y < object_top.y + object_top.height &&
		  player.height + player.y > object_top.y) 
		  {
			//prompt("Game Over! Enter your name to save your score.");
			alert("Game Over!");
			console.log("YIKES");
			
			// reset
			resetGame();
    }
    if (  player.x < object_bottom.x + object_bottom.width &&
		  player.x + player.width > object_bottom.x &&
		  player.y > object_bottom.y + object_bottom.height &&
		  player.height + player.y < object_bottom.y) 
		  {
			//prompt("Game Over! Enter your name to save your score.");
			alert("Game Over!");
			console.log("YIKES");
			
			// reset
			resetGame();
    }        
    // if player passes the objects, give him/her a cookie.. I mean a point!
    if (object_top.x < player.x && player.passed == false){
        passed_objects++; // add a point if passed thru
        player.passed = true;
    }
    
   
   if(player.y >= canvas.height){
    //console.log("seconds");
    player.y = height - player.height;
    player.jumping = false;
    alert("Game Over!");
    resetGame();
   }
    

    // make sure the player doesn't go above the screen
    if(player.y < 0){
    console.log("wait.. come back");
    player.y = 0; 
    //player.jumping = false;
   }
    
    // draw our player
    ctx.clearRect(0,0, canvas.width,canvas.height);
    ctx.fillStyle = "red";
    
    //player
    ctx.drawImage(bird_img, player.x, player.y, player.width, player.height);
    
    //objects
   // ctx.drawImage(wall_img,object_top.x, object_top.y, object_top.width, object_top.height);
   // ctx.drawImage(wall_img,object_bottom.x, object_bottom.y, object_bottom.width, object_bottom.height);
    

    ctx.fillStyle = ctx.createPattern(fire,"repeat");
    ctx.fillRect(object_top.x, object_top.y+th, object_top.width,10);
    ctx.fillRect(object_bottom.x, object_bottom.y + bh - 10, object_bottom.width, 20);
    
    ctx.fillStyle = ctx.createPattern(wall_img,"repeat");
    ctx.fillRect(object_top.x, object_top.y, object_top.width, object_top.height);
    ctx.fillRect(object_bottom.x, object_bottom.y, object_bottom.width, object_bottom.height);
    
    ctx.strokeStyle = "#131212";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeRect(object_top.x, object_top.y, object_top.width, object_top.height);
    ctx.strokeRect(object_bottom.x, object_bottom.y, object_bottom.width, object_bottom.height);

    // record the score, we might add this to the database..
    document.getElementById("score").innerText = passed_objects;
    // run through the loop again
    img_int++;
    requestAnimationFrame(update);
    
}
    
function resetGame(){
      player.x = width*0.3;
      player.y = -5;  //fix
      player.velX= 0;
      player.velY= 0;
      jumping= false;
      passed= false;
      
      passed_objects = 0;
      
      object_bottom.x = width*0.8;
      object_top.x = width*0.8;
      ol = Math.floor(Math.random() * (8));
      keys = [];
      img_int = 0;
    };
    
    
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function(){
  update();
});