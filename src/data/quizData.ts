export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "primary" | "accent" | "warning" | "destructive";
  questions: QuizQuestion[];
  timePerQuestion: number;
}

export const quizzes: Quiz[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Test your HTML, CSS & JavaScript mastery",
    icon: "🌐",
    color: "primary",
    timePerQuestion: 20,
    questions: [
      { id: 1, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], correctIndex: 0, category: "CSS", difficulty: "easy" },
      { id: 2, question: "Which HTML tag is used for the largest heading?", options: ["<heading>", "<h6>", "<h1>", "<head>"], correctIndex: 2, category: "HTML", difficulty: "easy" },
      { id: 3, question: "What is the correct way to declare a JavaScript variable?", options: ["variable x = 5", "v x = 5", "let x = 5", "declare x = 5"], correctIndex: 2, category: "JavaScript", difficulty: "easy" },
      { id: 4, question: "Which property is used to change the background color?", options: ["bgcolor", "background-color", "color-background", "bg-color"], correctIndex: 1, category: "CSS", difficulty: "easy" },
      { id: 5, question: "What does the '===' operator do in JavaScript?", options: ["Assignment", "Loose equality", "Strict equality", "Not equal"], correctIndex: 2, category: "JavaScript", difficulty: "medium" },
      { id: 6, question: "What is a closure in JavaScript?", options: ["A CSS animation", "A function with access to its outer scope", "A way to close the browser", "A type of loop"], correctIndex: 1, category: "JavaScript", difficulty: "hard" },
      { id: 7, question: "Which CSS layout model is used for 2D layouts?", options: ["Flexbox", "Grid", "Float", "Position"], correctIndex: 1, category: "CSS", difficulty: "medium" },
      { id: 8, question: "What is the purpose of the 'async' keyword?", options: ["Makes code synchronous", "Defines an async function that returns a Promise", "Stops execution", "Creates a loop"], correctIndex: 1, category: "JavaScript", difficulty: "medium" },
    ],
  },
  {
    id: "science",
    title: "Science & Nature",
    description: "Explore the wonders of the natural world",
    icon: "🔬",
    color: "accent",
    timePerQuestion: 25,
    questions: [
      { id: 1, question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correctIndex: 2, category: "Chemistry", difficulty: "easy" },
      { id: 2, question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctIndex: 1, category: "Astronomy", difficulty: "easy" },
      { id: 3, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correctIndex: 2, category: "Biology", difficulty: "easy" },
      { id: 4, question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correctIndex: 0, category: "Physics", difficulty: "medium" },
      { id: 5, question: "How many bones are in the adult human body?", options: ["186", "206", "226", "256"], correctIndex: 1, category: "Biology", difficulty: "medium" },
      { id: 6, question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctIndex: 2, category: "Earth Science", difficulty: "easy" },
      { id: 7, question: "What is Schrödinger's equation used for?", options: ["Classical mechanics", "Quantum mechanics", "Thermodynamics", "Electrostatics"], correctIndex: 1, category: "Physics", difficulty: "hard" },
      { id: 8, question: "What is the half-life of Carbon-14?", options: ["1,000 years", "5,730 years", "10,000 years", "50,000 years"], correctIndex: 1, category: "Chemistry", difficulty: "hard" },
    ],
  },
  {
    id: "pop-culture",
    title: "Pop Culture",
    description: "Movies, music, and everything trending",
    icon: "🎬",
    color: "warning",
    timePerQuestion: 15,
    questions: [
      { id: 1, question: "Who directed the movie 'Inception'?", options: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Martin Scorsese"], correctIndex: 1, category: "Movies", difficulty: "easy" },
      { id: 2, question: "Which band released 'Bohemian Rhapsody'?", options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correctIndex: 2, category: "Music", difficulty: "easy" },
      { id: 3, question: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], correctIndex: 2, category: "Tech", difficulty: "medium" },
      { id: 4, question: "Who played Iron Man in the MCU?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correctIndex: 1, category: "Movies", difficulty: "easy" },
      { id: 5, question: "What is the best-selling video game of all time?", options: ["Tetris", "Minecraft", "GTA V", "Wii Sports"], correctIndex: 1, category: "Gaming", difficulty: "medium" },
      { id: 6, question: "Which artist has the most Grammy Awards?", options: ["Beyoncé", "Taylor Swift", "Adele", "Stevie Wonder"], correctIndex: 0, category: "Music", difficulty: "hard" },
      { id: 7, question: "What was the first feature-length animated film?", options: ["Bambi", "Snow White", "Pinocchio", "Fantasia"], correctIndex: 1, category: "Movies", difficulty: "medium" },
      { id: 8, question: "Which social media platform launched first?", options: ["Facebook", "Twitter", "MySpace", "Instagram"], correctIndex: 2, category: "Tech", difficulty: "medium" },
    ],
  },
];
