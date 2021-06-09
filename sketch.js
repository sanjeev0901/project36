var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feedTheDog;

//create feed and lastFed variable here
var feed,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedTheDog=createButton("Feed The Dog")
  feedTheDog.position(700,95);
  feedTheDog.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime=database.ref('FeedTime'); 
  feedTime.on("value",function(data){
    lastFed=data.val();
  })
  
 
  //write code to display text lastFed time here
  fill("blue");
  textSize(20);
  if(lastFed>=12){
    text("lastFed: "+lastFed%12+" PM",350,350)
  }else if(lastFed===0){
    text("lastFed: 12 AM",350,350);
  }else{
    text("lastFed"+lastFed+" AM",350,350);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
 
  //write code here to update food stock and last fed time
  var food_stock_value=foodObj.getFoodStock();
  if(food_stock_value<0){
    foodObj.updateFoodStock(food_stock_value * 0);
  }else{
    foodObj.updateFoodStock(food_stock_value -1)
  }

  database.ref('/').update({
    Feed:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

  



//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
