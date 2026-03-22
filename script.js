$(function(){

let images=[
"imgs/image1.jpg",
"imgs/image2.jpg",
"imgs/image3.jpg"
];

let text=[
"breathe",
"rest matters",
"stay curious",
"connect",
"keep going"
];

let colors=["#ffb74d","#81d4fa","#a5d6a7"];

let imgIndex=0;
let textIndex=0;
let shapeIndex=0;

function randomPos(max){
return Math.floor(Math.random()*max);
}

function imageLoop(){
$("#mainImage").attr("src",images[imgIndex]);

$("#imageBox")
.css({left:randomPos(500),top:randomPos(400)})
.fadeIn(800)
.animate({left:randomPos(500),top:randomPos(400)},3000)
.fadeOut(800,function(){
imgIndex=(imgIndex+1)%images.length;
imageLoop();
});
}

function textLoop(){
$("#textBox")
.fadeOut(300,function(){
$(this)
.text(text[textIndex])
.css({left:randomPos(600),top:randomPos(400)})
.fadeIn(300);
});

textIndex=(textIndex+1)%text.length;
}

function shapeLoop(){
$(".shape").each(function(){
$(this)
.removeClass("circle square pill")
.addClass(["circle","square","pill"][shapeIndex])
.css({
background:colors[shapeIndex],
left:randomPos(600),
top:randomPos(400)
});
});

shapeIndex=(shapeIndex+1)%3;
}

imageLoop();
textLoop();
shapeLoop();

setInterval(textLoop,4000);
setInterval(shapeLoop,3000);

});
