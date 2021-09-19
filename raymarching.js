
//a second canvas which holds the found geometries
let canvas2;
let main;
function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(60);
    rayRad = Math.max(windowWidth, windowHeight)
    angle = 0;
    main = new Main(width/2, height/2, 0);
    main.buildScene();

    canvas2 = createGraphics(width, height);
    canvas2.clear();
}

function draw(){
    background(0);
    //ray origin point for visibility
    fill("white");
    ellipse(width/2, height/2, 5,5);

    main.drawScene();
    if(main.angle == 360){
        main.angle = 0;
    }
    main.angle = main.angle + 0.01;

    image(canvas2, 0,0)
}

class Main{
    //Ray
    constructor(x,y, angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    buildScene(){
        let s1 = new Circle(200, 300, 50);
        let s2 = new Circle(1200, 500, 100);
        let s3 = new Circle(1000, 100, 20);
        let s4 = new Circle(100, 700, 200);

        let r1 = new Rectangle(500, 100, 150, 45);

        //adding shapes to the sceneList
        let scList = [s1, s2, s3, s4, r1];
        let scene = new Scene(scList);

        return scene;
    }

    drawScene(){
        let x = this.x;
        let y = this.y;
        let scene = this.buildScene();
        let dist = Number.MAX_VALUE;

        while(dist > 0.1){
            dist = scene.nearestDist(x,y);
            let ray = new Ray(x, y, this.angle, dist);
            ray.draw();
            let circle = new Circle(x, y, dist);
            noFill();
            circle.draw();
            x = x + Math.cos(this.angle) * dist;
            y = y + Math.sin(this.angle) * dist;

            //break the loop if the ray is already past the edges of the screen.
            if(x > width || x < 0 || y > height || y < 0){
                break;
            }
        }
        //draw the intersections with the scene(on a second canvas so that they won't get drawn over with the next draw cycle)
        canvas2.fill("yellow");
        canvas2.ellipse(x,y, 2,2);
    }
}

class Scene{
    //list of objects in scene
    constructor(objects){
        this.objects = objects
    }

    //compares the distances from a given point to each object in the scene and returns the min.
    nearestDist(x, y){
        let distance = Number.MAX_VALUE;
        for(let i = 0; i < this.objects.length; i++){
            let obj = this.objects[i];
            let objDist = obj.distance(x, y);
            if(distance > objDist){
                distance = objDist;
            }
        }
        return distance;
        
    }
}

/*****************
 * 2D Primitives *
 *****************/
class Circle{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
    }
    //distance to a given point is calculated using the pythagorean formula
    distance(x, y){
        let c = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) - this.r;
        return c;
    }

    draw(){
        stroke(50);
        color("white");
        ellipse(this.x, this.y, this.r *2 , this.r * 2);
    }
}

class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//axis-aligned rectangle
class Rectangle{
    //Position of top-left corner, width, height
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    distance(x,y){
        //defining the min and max values for each axis
        let minX = this.x;
        let minY = this.y;
        let maxX = this.x + this.w;
        let maxY = this.y+ this.h;

        //distance between a given points x-coordinate and 
        let distX = Math.max(0, minX - x, x - maxX);
        let distY = Math.max(0, minY - y, y - maxY);
        let distance = Math.sqrt(distX * distX + distY * distY);

        return distance;
    }

    draw(){
        rect(this.x, this.y, this.w, this.h);
    }
}

class Ray{
    //2D Ray defined by start point, angle, and length to make sure that the ray moves along the curve of a circle
    constructor(x, y, angle, length){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
    }

    draw(){
        //calculate the end point of the ray based on angle and length
        let x2 = this.x + Math.cos(this.angle) * this.length;
        let y2 = this.y + Math.sin(this.angle) * this.length;
        stroke(200);
        color("white");
        line(this.x,this.y, x2, y2);
    }
}