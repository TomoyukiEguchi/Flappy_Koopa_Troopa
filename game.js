// select CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// game vars and consts
let frames = 0;
const DEGREE = Math.PI/180;

// load sprite image
const sprite = new Image();
sprite.src = "img/spriteMo.png";

// game state
const state = {
  current : 0,
  getReady : 0,
  game : 1,
  over : 2
}

// start button cord
const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
}

// control the game
cvs.addEventListener("click", function(evt){
  switch(state.current){
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      let rect = cvs.getBoundingClientRect();
      let clickX = evt.clientX - rect.left;
      let clickY = evt.clientY - rect.top;
      
      // check if we click on the start button
      if(clickX >= startBtn.x &&
         clickX <= startBtn.x + startBtn.w &&
         clickY >= startBtn.y &&
         clickY <= startBtn.y + startBtn.h
        ){
            pipes.reset();
            boos.reset();
            bombs.reset();
            rokets.reset();
            pikachu.reset();
            bird.speedReset();
            score.reset();
            yoshi.reset();
            peach.reset();
            state.current = state.getReady;
      }
      break;
  }
});

// load background image
const bg = new Image();
bg.src ="img/SuperMarioBrosBG.png";

// foreground
const fg = {
  sX: 277,
  sY: 0,
  w: 222,
  h: 80,
  x: 0,
  y: cvs.height - 80,
  
  dx: 2,
  
    draw : function() {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
      
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
  
    update : function(){
      if(state.current == state.game){
        this.x = (this.x - this.dx)%(this.w/1.85);
      }
    }
}

// bird
const bird = {
  animation : [
    {sX: 431, sY: 112},
    {sX: 431, sY: 147},
    {sX: 431, sY: 182},
    {sX: 431, sY: 147}
  ],
  x : 50,
  y : 150,
  w : 40,
  h : 34,
  
  frame : 0,
  
  gravity : 0.25,
  jump : 3.6,
  speed : 0,
  rotation : 0,
  
  draw : function() {
    let bird = this.animation[this.frame];
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
  
    ctx.restore();
  },
  
  flap : function() {
    this.speed = - this.jump;
  },
  
  update : function() {
    // if the game state is get ready state, the bird must flap slowly
    this.period = state.current == state.getReady ? 10 : 5;
    // increment the frame by 1, each period
    this.frame += frames%this.period == 0 ? 1 : 0;
    // frame goes from 0 to 4, then again to 0
    this.frame = this.frame%this.animation.length;
    
    if(state.current === state.getReady){
      this.y = 150; // -> reset position of the bird after game over
      this.rotation = 0 * DEGREE;
    }else{
      this.speed += this.gravity;
      this.y += this.speed;
      
      // when the bird is higher than the ground
      if(this.y + this.h/2 >= cvs.height - fg.h){
        // if the bird hits the ground
        this.y = cvs.height - fg.h - this.h/2;
        if(state.current == state.game){
            state.current = state.over;
        }
      }
      
      // if the speed is greater than the jump means the bird is falling down
      if(this.speed >= this.jump){
        this.rotation = 90 * DEGREE;
        this.frame = 1;  // -> flap stops when the bird hits the ground
      }else{
        this.rotation = -10 * DEGREE;
      }
    }
  },
  speedReset : function(){
    this.speed = 0;
  }
}

// get ready message
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 199,
  x: cvs.width/2 - 173/2,
  y: 80,
  
  draw: function() {
    if(state.current == state.getReady) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

// game over message
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width/2 - 225/2,
  y: 90,
  
  draw: function() {
    if(state.current == state.over) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

// boos
const boos = {
  position : [],
  animation : [
    {sX: 441, sY: 279},
    {sX: 441, sY: 228}
  ],

  w : 40,
  h : 51,
  dx : 1.5,
  
  radius : 12,
  
  frame : 0,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){

      let boos = this.animation[this.frame];
      let p = this.position[i];
    
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.drawImage(sprite, boos.sX, boos.sY, this.w, this.h, p.x - this.w/2, p.y - this.h/2, this.w, this.h);

      ctx.restore();
      
      //let p = this.position[i];
      //ctx.drawImage(sprite, this.front.sX, this.front.sY, this.w, this.h, p.x, p.y, this.w, this.h);
    }    
  },
  
  update : function() {
    if(state.current !== state.game) return;
    
    if(frames%720 == 0) {
      this.position.push({
        x: cvs.width,
        y: (Math.random()*300 + 60)
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      this.frame = 0;
      
      // collision detection
      if(bird.x - bird.w/2 > p.x){
        this.frame = 1;
      }
      if(bird.x + bird.w/2 > p.x - this.radius &&
         bird.x - bird.w/2 < p.x + this.radius &&
         bird.y + bird.h/2 > p.y - this.radius&&
         bird.y - bird.h/2 < p.y + this.radius
        ){
        state.current = state.over;
      }
      
      // move the boos to the left
      p.x -= this.dx;
      
      // if the boos go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.frame = 0;
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// pipes
const pipes = {
  position : [],
  
  top : {
    sX: 553,
    sY: 0
  },
  bottom : {
    sX: 502,
    sY: 0
  },
  
  w: 53,
  h: 400,
  gap: 155,
  maxYPos: -150,
  dx: 2,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      
      // top pipe
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
      
      // bottom pipe
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
    }
  },
  
  update : function() {
    if(state.current !== state.game) return;
    
    if(frames%220 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      let bottomYPos = p.y + this.h + this.gap;
      
      // collision detection
      // top pipe
      if(bird.x + bird.w/2 > p.x &&
         bird.x - bird.w/2 < p.x + this.w &&
         bird.y + bird.h/2 > p.y &&
         bird.y - bird.h/2 < p.y + this.h
        ){
        state.current = state.over;
      }
      // bottom pipe
      if(bird.x + bird.w/2 > p.x &&
         bird.x - bird.w/2 < p.x + this.w &&
         bird.y + bird.h/2 > bottomYPos &&
         bird.y - bird.h/2 < bottomYPos + this.h
        ){
        state.current = state.over;
      }
      
      // move the pipes to the left
      p.x -= this.dx;
      
      // if the pipes go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.position.shift();
        score.value += 1;
        
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// bombs
const bombs = {
  position : [],
  animation : [
    {sX: 610, sY: 5},
    {sX: 610, sY: 56},
    {sX: 610, sY: 109},
    {sX: 610, sY: 163},
    {sX: 610, sY: 216},
    {sX: 610, sY: 267},
    {sX: 610, sY: 216},
    {sX: 610, sY: 163},
    {sX: 610, sY: 109},
    {sX: 610, sY: 56}
  ],
  
  w : 44,
  h : 51,
 
  maxYPos: -75,
  dy: 0.5,
  
  frame : 0,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      
      let bombs = this.animation[this.frame];
      let p = this.position[i];
    
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.drawImage(sprite, bombs.sX, bombs.sY, this.w, this.h, p.x - this.w/2, p.y - this.h/2, this.w, this.h);
      
      ctx.restore();
    }
  },
  
  update : function() {
    if(state.current !== state.game) return;
    
    if(frames%970 == 0) {
      this.position.push({
        x: (Math.random()*260 + 75),
        y: this.maxYPos
      });
    }
    
    this.period = 10;
    // increment the frame by 1, each period
    this.frame += frames%this.period == 0 ? 1 : 0;
    // frame goes from 0 to 10, then again to 0
    this.frame = this.frame%this.animation.length;
    
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // move the bombs to the ground
      p.y += this.dy;
      
      // if the bombs go beyond canvas, we delete them from the array
      if(p.y - this.h >= 480){
        this.frame = 0;
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// yoshi
const yoshi = {
  position : [],
  sX : 614,
  sY : 338,
  w : 82,
  h : 49,
  
  dx : 0.5,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
    
      ctx.drawImage(sprite, yoshi.sX, yoshi.sY, this.w, this.h, p.x, p.y, this.w, this.h);
    }    
  },
  
  update : function() {
    if(state.current !== state.game){
      this.position = [];
      return;
    } 
    
    if(frames%1600 == 0) {
      this.position.push({
        x: - this.w,
        y: cvs.height - this.h - 15
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // move the mushroom to the left
      p.x += this.dx;
      
      // if the mushroom go beyond canvas, we delete them from the array
      if(p.x >= cvs.width){
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// peach
const peach = {
  position : [],
  animation : [
    {sX: 738, sY: 5},
    {sX: 738, sY: 80},
    {sX: 738, sY: 160},
    {sX: 738, sY: 80}
  ],
  
  w : 88,
  h : 70,
  
  dx : 3,
  
  frame : 0,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      let peach = this.animation[this.frame];
      let p = this.position[i];
    
      ctx.drawImage(sprite, peach.sX, peach.sY, this.w, this.h, p.x, p.y, this.w, this.h);
    }    
  },
  
  update : function() {
    if(state.current !== state.over){

      return;
    } 
    
    if(frames%450 == 0) {
      this.position.push({
        x: cvs.width,
        y: cvs.height - this.h - 5
      });
    }
    
    this.period = 10;
    // increment the frame by 1, each period
    this.frame += frames%this.period == 0 ? 1 : 0;
    // frame goes from 0 to 10, then again to 0
    this.frame = this.frame%this.animation.length;
    
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // move the mushroom to the left
      p.x -= this.dx;
      
      // if the mushroom go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// mushroom
const mushroom = {
  position : [],
  sX : 445,
  sY : 371,
  w : 35,
  h : 35,
  
  dx : 0.5,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
    
      ctx.drawImage(sprite, mushroom.sX, mushroom.sY, this.w, this.h, p.x, p.y, this.w, this.h);
    }    
  },
  
  update : function() {
    if(state.current !== state.getReady){
      this.position = [];
      return;
    } 
    
    if(frames%1000 == 0) {
      this.position.push({
        x: cvs.width + this.w,
        y: cvs.height - this.h - 80
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // move the mushroom to the left
      p.x -= this.dx;
      
      // if the mushroom go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.position.shift();
      }
    }
  }
}

// rokets
const rokets = {
  position : [],
  sX : 440,
  sY : 335,
  w : 39,
  h : 26,
  dx : 3.5,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
    
      ctx.drawImage(sprite, rokets.sX, rokets.sY, this.w, this.h, p.x, p.y, this.w, this.h);
    }    
  },
  
  update : function() {
    if(state.current !== state.game) return;
    
    if(frames%420 == 0) {
      this.position.push({
        x: cvs.width,
        y: (Math.random()*350 + 10)
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // collision detection
      if(bird.x + bird.w/2 > p.x + 3 &&
         bird.x - bird.w/2 < p.x + this.w &&
         bird.y + bird.h/2 > p.y &&
         bird.y - bird.h/2 < p.y + this.h
        ){
        state.current = state.over;
      }
      
      // move the rokets to the left
      p.x -= this.dx;
      
      // if the rokets go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.frame = 0;
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// pikachu
const pikachu = {
  position : [],
  animation : [
    {sX: 658, sY: 5},
    {sX: 658, sY: 68},
    {sX: 658, sY: 132},
    {sX: 658, sY: 196},
    {sX: 658, sY: 259},
    {sX: 658, sY: 196},
    {sX: 658, sY: 132},
    {sX: 658, sY: 68}
  ],
  
  w : 74,
  h : 61,
 
  y: cvs.height - 80,
  dx: 2,
  
  frame : 0,
  
  draw : function() {
    // loop for the position array
    for(let i = 0; i < this.position.length; i++){
      
      let pikachu = this.animation[this.frame];
      let p = this.position[i];
      let topYPos = p.y;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.drawImage(sprite, pikachu.sX, pikachu.sY, this.w, this.h, p.x, p.y - this.h, this.w, this.h);
      
      ctx.restore();
    }
  },
  
  update : function() {
    if(state.current !== state.game) return;
    
    if(frames%2100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.y
      });
    }
    
    this.period = 3;
    // increment the frame by 1, each period
    this.frame += frames%this.period == 0 ? 1 : 0;
    // frame goes from 0 to 8, then again to 0
    this.frame = this.frame%this.animation.length;
    
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      
      // move the rokets to the left
      p.x -= this.dx;
      
      // if the rokets go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.frame = 0;
        this.position.shift();
      }
    }
  },
  
  reset : function(){
    this.position = [];
  }
}

// score
const score = {
  best : parseInt(localStorage.getItem("best")) || 0,
  value : 0,
  
  draw : function() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    
    if(state.current == state.game){
      ctx.lineWidth = 2;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width/2, 50);
      ctx.strokeText(this.value, cvs.width/2, 50);
      
    }else if(state.current == state.over){
      // score value
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      // best value
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  
  reset : function(){
    this.value = 0;
  }
}

// draw
function draw() {
  ctx.drawImage(bg,0,0);
  
  boos.draw();
  pipes.draw();
  bombs.draw();
  rokets.draw();
  pikachu.draw();
  mushroom.draw();
  fg.draw();
  bird.draw();
  yoshi.draw();
  peach.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

// update
function update() {
  bird.update();
  fg.update();
  bombs.update();
  rokets.update();
  pikachu.update();
  boos.update();
  pipes.update();
  mushroom.update();
  yoshi.update();
  peach.update();
}

// loop
function loop() {
  update();
  draw();
  frames++;
  
  requestAnimationFrame(loop);
}

loop();