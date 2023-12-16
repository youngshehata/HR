const Question = require("../models/SecretQuestionsModel");
const Section = require("../models/SectionModel");

const secretQuestionsArray = [
  { question: "What's the name of your first pet?", id: 1 },
  { question: "What's your secondary school name?", id: 2 },
  { question: "What's the model of your first car?", id: 3 },
  { question: "A name your family used to call you", id: 4 },
  { question: "A secret word or number", id: 5 },
];

const sectionsArray = [
  { sectionName: "Web Developers", administrator: "Omar A.Shehata" },
  { sectionName: "HR", administrator: "Yousef Mohamed" },
  { sectionName: "Media", administrator: "James Waan" },
  { sectionName: "Security", administrator: "Ryan Waan" },
  { sectionName: "CEO", administrator: "Laila A.Shehata" },
];

const seedData = async () => {
  await Question.deleteMany({});
  await Question.insertMany(secretQuestionsArray);
  await Section.deleteMany({});
  await Section.insertMany(sectionsArray);
};

module.exports = seedData;
