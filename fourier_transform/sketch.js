let starting = false;
let candraw = true;
let path = [];
let fourierx;
let drawing = [];
let state = 'user';
let time = 0;
let orbits = -1;

function setup() {
    createCanvas(windowWidth, windowHeight);
}


function draw() {

  background(0);
  translate(windowWidth/2, windowHeight/2);//translating origin to center of the screen::

  //draw axis::
  stroke(255,255,255,50);
  line(0,-height/2,0, height/2);
  line(-width/2,0,width/2,0);

  if (starting == false) {
    fill(0);
    stroke(255);
    strokeWeight(1.5)
    textAlign(CENTER);
    textSize(32);
    text("Draw Here", 0, 0);
  }
  draw_path();
  if(state=='fourier'){
    draw_epicycles(0,0,fourierx,orbits.value());
    const dt = 2*PI/fourierx.length;
    time += dt;
    draw_drawing();
    console.log(orbits.value());
    display_epicycles_no();
    if (time > TWO_PI) {
      time = 0;
      drawing = [];
    }
  }
}

function display_epicycles_no(){
  push();
  fill(255);
  stroke(255);
  strokeWeight(0.5);
  textAlign(CENTER);
  textSize(16);
  text( orbits.value() + ' epicycles', 0, height/2);
  pop();
}


function draw_path(){
  push();
  beginShape();
  noFill(); 
  strokeWeight(4);
  for(let i=0;i<path.length;i++){
    vertex(path[i].x, path[i].y)
  }
  endShape();
  pop();
}

function draw_drawing(){
  push();
  beginShape();
  noFill(); 
  stroke(0,255,0,255);
  strokeWeight(1);
  for(let i=0;i<drawing.length;i++){
    vertex(drawing[i].x, drawing[i].y)
  }
  endShape();
  pop();
}

function draw_epicycles(x,y,fourierx,sizef){
  push();
  beginShape();
  noFill(); 
  strokeWeight(1);
  stroke(255,0,0,100);
  let prevx = x;
  let prevy = y;
  for(let i=0; i<sizef-1; i++){
    let freq = fourierx[i].freq;
    let radius  = fourierx[i].amp;
    let phase = fourierx[i].phase;

    x += radius*cos(freq*time+phase);
    y += radius*sin(freq*time+phase);
    ellipse(prevx,prevy, radius*2);
    line(prevx,prevy,x,y);
    
    prevx = x;
    prevy = y;
  }
  endShape();
  pop();
  drawing.push(createVector(x,y));
}

function resetSize(sizef) {
  orbits = createSlider(1, sizef, sizef, 1);
  orbits.position(windowWidth/2-150, windowHeight-50);
  orbits.style('width', '300px');
  orbits.changed(emptyFourier);
}

function emptyFourier() {
  drawing = [];
  time = 0;
}
//
function mousePressed(){
  if(mouseY>windowHeight-100){
    candraw = false;
  }
  else{
    candraw = true;
    state = 'user';
    drawing = [];
    path = [];
    starting = true;
  }
}

function mouseDragged() {
    if(candraw){
    if (
      mouseX < width - 5 &&
      mouseY < height - 5 &&
      mouseX > 5 &&
      mouseY > 5
    ) {
      let point = createVector(mouseX - width / 2, mouseY - height / 2);
      path.push(point);
    }
  }
}

function mouseReleased(){
  if(candraw){
  fourierx = dft(path);
  fourierx.sort((a,b) => b.amp - a.amp);
  state = 'fourier';
  resetSize(fourierx.length);
  }
}
