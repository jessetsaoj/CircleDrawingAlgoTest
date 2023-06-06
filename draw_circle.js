p5.disableFriendlyErrors = true;

const canvas_width = 1920;
const canvas_height = 1080;
const rand_pos = [];
const numOfCircles = 3000;


function setup() {
    createCanvas(canvas_width, canvas_height);
    // randomize the positions of circles
    for(let i = 0; i < numOfCircles; ++i) 
        rand_pos.push([Math.floor(Math.random() * canvas_width), Math.floor(Math.random() * canvas_height)]);
}
  
function draw() {
    const radius = 100;
    background(220);
    testCircle(circleByScan, radius);
    
    background(220);
    testCircle(circleBySinCos, radius);

    background(220);
    testCircle(circleByRotationMatrix, radius);
    
    background(220);
    testCircle(circleByBresenham, radius);

    noLoop(); // so the function is called only once
}
  
function testCircle(fn, radius) {
    let startTime = performance.now();
    for(let i = 0; i < numOfCircles; i++) {
        fn(rand_pos[i][0], rand_pos[i][1], radius);
    }
    let endTime = performance.now();
    console.log(`Total time elapsed: ${endTime - startTime} milisec`);
    console.log(`Avg. time per circle ${(endTime - startTime) / numOfCircles} milisec`);
}
  
function dot_(x, y) {
    point(x, y);
}

function draw8Dots(cx, cy, x, y) {
    dot_(cx + x, cy + y);
    dot_(cx + x, cy - y);
    dot_(cx - x, cy + y);
    dot_(cx - x, cy - y);
    dot_(cx + y, cy + x);
    dot_(cx + y, cy - x);
    dot_(cx - y, cy + x);
    dot_(cx - y, cy - x);
}


/* 1. Scan Method */
function circleByScan(cx, cy, r) {
    for(let i = -r; i < r + 1; ++i) {
        for(let j = -r; j < r + 1; ++j) {
            if(Math.abs(i**2 + j**2 - r**2) < r) 
                dot_(cx + i, cy + j);
        }
    }
}
  
/* 2. Trigonometric method */
function circleBySinCos(cx, cy, r) {
    const delta = 1 / r;
    for(let theta = 0; theta < PI / 4; theta += delta)
        draw8Dots(cx, cy, Math.cos(theta) * r, Math.sin(theta) * r);
}
  
/* 3. Rotation matrix method */
function circleByRotationMatrix(cx, cy, r) {
    const delta = 1 / r;
    const cosAngle = Math.cos(delta);
    const sinAngle = Math.sin(delta);
    let vx = 1.0, vy = 0.0;  // unit vector
    for(let theta = 0; theta < PI/4; theta += delta) {
        vx = vx * cosAngle - vy * sinAngle;  // rotation matrix operates on unit vector
        vy = vx * sinAngle + vy * cosAngle;  //
        draw8Dots(cx, cy, vx * r, vy * r);
    }
}
  
/* 4. Bresenham method */
function circleByBresenham(cx, cy, r) {
    let x = r, y = 0;
    let d = 1 - r;
    draw8Dots(cx, cy, x, y);
    while(x > -y) {
        if(d < 0)
            d = d - 2 * y + 3;
        else {
            d = d - 2*(x + y) + 5;
            x--;
        }
        y--;
        draw8Dots(cx, cy, x, y);
    }
}