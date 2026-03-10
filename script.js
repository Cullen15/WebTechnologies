class JusticeSlide {
  constructor(title, image, description, author, year) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.author = author;
    this.year = year;
  }
}

let slide1 = new JusticeSlide(
  "Migrant Mother",
  "imgs/migrant-mother.jpg",
  "This photo shows a mother and her children during the Great Depression. To me it connects to poverty and labor rights because it shows how economic hardship hits families in a really direct way. I like that it feels human and personal instead of just historical.",
  "Dorothea Lange",
  "1936"
);

let slide2 = new JusticeSlide(
  "The Problem We All Live With",
  "imgs/problem-we-all-live-with.jpg",
  "This painting shows Ruby Bridges being escorted to school during desegregation. It connects to civil rights and equal access to education. I picked it because it makes racism feel real and not just like something you read about in a textbook.",
  "Norman Rockwell",
  "1964"
);

let slide3 = new JusticeSlide(
  "We Can Do It!",
  "imgs/we-can-do-it.jpg",
  "This poster shows a woman worker during World War II and became a bigger symbol of gender equity over time. It connects to labor and the idea that women have always been capable even when society tried to limit them. I like how simple it is but still really recognizable.",
  "J. Howard Miller",
  "1943"
);

let slide4 = new JusticeSlide(
  "Guernica",
  "imgs/guernica.jpg",
  "This painting was made after the bombing of Guernica in Spain. It connects to anti war justice and the way civilians carry the worst parts of violence. Even though it is older it still feels intense and relevant.",
  "Pablo Picasso",
  "1937"
);

let slide5 = new JusticeSlide(
  "Woman, Life, Freedom Mural",
  "imgs/woman-life-freedom.jpg",
  "This mural was made in solidarity with protests for women's rights in Iran. It connects to gender justice and freedom of expression. I wanted to include something more current because it shows how art can support movements across borders.",
  "Hooman Khalili and Benzi Brofman",
  "approx. 2022"
);

let slides = [slide1, slide2, slide3, slide4, slide5];

let lastIndex = -1;

function displaySlide(slide) {
  document.getElementById("slideImage").src = slide.image;
  document.getElementById("slideImage").alt = slide.title;
  document.getElementById("slideTitle").textContent = slide.title;
  document.getElementById("slideDescription").textContent = slide.description;
  document.getElementById("slideAuthor").textContent = slide.author;
  document.getElementById("slideYear").textContent = slide.year;
}

function getRandomIndex() {
  let randomIndex = Math.floor(Math.random() * slides.length);

  while (randomIndex === lastIndex) {
    randomIndex = Math.floor(Math.random() * slides.length);
  }

  lastIndex = randomIndex;
  return randomIndex;
}

function showRandomSlide() {
  let index = getRandomIndex();
  let chosenSlide = slides[index];
  displaySlide(chosenSlide);
}

document.getElementById("nextButton").addEventListener("click", showRandomSlide);

showRandomSlide();