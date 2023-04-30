const fs = require("fs");
const { prompt } = require("enquirer");

// Read in the questions
let rawData = fs.readFileSync("questions.json");

// Parse the questions
let questions = JSON.parse(rawData);
let questionsToRetry = [];

// Shuffling algorithm - https://bost.ocks.org/mike/shuffle/
const shuffle = (array) => {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array.slice(0, 50);
};

console.log(`Loaded ${questions.cybersecurity.length} cybersecurity questions`);
console.log(`Loaded ${questions.networking.length} networking questions`);
console.log(`Loaded ${questions.programming.length} programming questions`);

// Shuffle the questions per topic
questions.cybersecurity = shuffle(questions.cybersecurity);
questions.networking = shuffle(questions.networking);
questions.programming = shuffle(questions.programming);

const isValidAnswer = (userInput, possibleAnswers) => {
  // Pattern string created would look like '/hello|world/i'
  const patternString = possibleAnswers.join("|");
  const answerPattern = new RegExp(patternString, "i"); // 'i' means case-insensitive
  // Test the user input against the pattern and return the result
  return answerPattern.test(userInput);
};

const maskString = (str) => {
  let maskedString = "";
  for (let i = 0; i < str.length; i++) {
    if (i == 0 || str[i] == "/" || str[i] == " " || str[i] == "-") {
      maskedString += str[i];
    } else {
      maskedString += "*";
    }
  }
  return maskedString;
};

const answerQuestions = async (
  topic,
  topicName,
  showTimeUsed,
  showHint,
  retryIncorrectQuestions
) => {
  console.log(`\n~ ${topicName} REVIEW ~\n`);
  let score = 0,
    response = null;
  for (let i = 0; i < topic.length; i++) {
    // Start timer
    if (showTimeUsed) {
      console.time("Answered in: ");
    }
    // Prompt the user for input
    if (showHint) {
      response = await prompt({
        type: "input",
        name: "answer",
        message: topic[i].question,
        hint: maskString(topic[i].answer),
      });
    } else {
      response = await prompt({
        type: "input",
        name: "answer",
        message: topic[i].question,
      });
    }
    console.log();
    // First we check the possible answers of the question if multiple
    if (topic[i].answer.includes("/")) {
      // Then we split the possible answers
      let possibleAnswers = topic[i].answer.split("/");
      if (isValidAnswer(response.answer, possibleAnswers)) {
        console.log("CORRECT ✓");
        if (showTimeUsed) {
          console.timeEnd("Answered in: ");
        }
        score++;
        console.log();
        continue;
      } else {
        console.log("INCORRECT ✗  -> " + topic[i].answer);
        if (showTimeUsed) {
          console.timeEnd("Answered in: ");
        }
        if (retryIncorrectQuestions) {
          questionsToRetry.push(topic[i]);
        }
        console.log();
        continue;
      }
    }

    // If there is only one possible answer
    if (response.answer.toLowerCase() === topic[i].answer.toLowerCase()) {
      console.log("CORRECT ✓");
      if (showTimeUsed) {
        console.timeEnd("Answered in: ");
      }
      score++;
      console.log();
      continue;
    } else {
      console.log("INCORRECT ✗  -> " + topic[i].answer);
      if (showTimeUsed) {
        console.timeEnd("Answered in: ");
      }

      if (retryIncorrectQuestions) {
        questionsToRetry.push(topic[i]);
      }
      console.log();
      continue;
    }
  }
  return score;
};

const menu = async (menuItems) => {
  console.log(`\n~ Welcome to I.T Wizard Reviewer ~\n`);
  const response = await prompt({
    type: "select",
    name: "action",
    message: "Please select an action",
    choices: menuItems,
  });
  return response.action;
};

const freeplay = async () => {
  const cybersecurityScore = await answerQuestions(
    questions.cybersecurity,
    "CYBERSECURITY",
    true,
    false
  );
  console.log(
    `~ Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length} ~`
  );

  const networkingScore = await answerQuestions(
    questions.networking,
    "NETWORKING",
    true,
    false
  );
  console.log(
    `~ Networking Score: ${networkingScore}/${questions.networking.length} ~`
  );

  const programmingScore = await answerQuestions(
    questions.programming,
    "PROGRAMMING",
    true,
    false
  );
  console.log(
    `~ Programming Score: ${programmingScore}/${questions.programming.length} ~`
  );

  console.log(`

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length}
        Networking Score: ${networkingScore}/${questions.networking.length}
        Programming Score: ${programmingScore}/${questions.programming.length}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    `);
};

const retryIncorrectQuestions = async () => {
  while (questionsToRetry.length != 0) {
    console.log(`\n~ Retrying incorrectly answered questions ~`);
    for (let i = 0; i < questionsToRetry.length; i++) {
      const response = await prompt({
        type: "input",
        name: "answer",
        message: questionsToRetry[i].question,
      });

      // First we check the possible answers of the question if multiple
      if (questionsToRetry[i].answer.includes("/")) {
        // Then we split the possible answers
        let possibleAnswers = questionsToRetry[i].answer.split("/");
        if (isValidAnswer(response.answer, possibleAnswers)) {
          console.log("CORRECT ✓");
          console.log();
          questionsToRetry.splice(i, 1);
          i--;
          continue;
        } else {
          console.log("INCORRECT ✗  -> " + questionsToRetry[i].answer);
          console.log();
          continue;
        }
      }

      // If there is only one possible answer
      if (
        response.answer.toLowerCase() ===
        questionsToRetry[i].answer.toLowerCase()
      ) {
        console.log("CORRECT ✓");
        console.log();
        questionsToRetry.splice(i, 1);
        i--;
        continue;
      } else {
        console.log("INCORRECT ✗  -> " + questionsToRetry[i].answer);
        console.log();
        continue;
      }
    }
  }
};

const training = async () => {
  // Ask user which topic
  const topic = await prompt({
    type: "select",
    name: "input",
    message: "Please select a topic",
    choices: ["Cybersecurity", "Networking", "Programming"],
  });

  // Ask if user wants hints
  const promptShowHint = await prompt({
    type: "select",
    name: "input",
    message: "Would you like to show hints?",
    choices: ["Yes", "No"],
  });

  const showHint = promptShowHint.input === "Yes";

  if (topic.input == "Cybersecurity") {
    const cybersecurityScore = await answerQuestions(
      questions.cybersecurity,
      "CYBERSECURITY",
      true,
      showHint,
      true
    );
    console.log(
      `~ Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length} ~`
    );
  } else if (topic.input == "Networking") {
    const networkingScore = await answerQuestions(
      questions.networking,
      "NETWORKING",
      true,
      showHint,
      true
    );
    console.log(
      `~ Networking Score: ${networkingScore}/${questions.networking.length} ~`
    );
  } else if (topic.input == "Programming") {
    const programmingScore = await answerQuestions(
      questions.programming,
      "PROGRAMMING",
      true,
      showHint,
      true
    );
    console.log(
      `~ Programming Score: ${programmingScore}/${questions.programming.length} ~`
    );
  }

  retryIncorrectQuestions();
};

const review = async () => {
  // Ask user which topic
  const topic = await prompt({
    type: "select",
    name: "input",
    message: "Please select a topic",
    choices: ["Cybersecurity", "Networking", "Programming"],
  });
  if (topic.input == "Cybersecurity") {
    console.log(questions.cybersecurity);
    // let cybersecurityScore = await answerQuestions(questions.cybersecurity, "CYBERSECURITY", true, true);
    // console.log(`~ Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length} ~`);
  } else if (topic.input == "Networking") {
    console.log(questions.networking);
    // let networkingScore =  await answerQuestions(questions.networking, "NETWORKING", true, true);
    // console.log(`~ Networking Score: ${networkingScore}/${questions.networking.length} ~`);
  } else if (topic.input == "Programming") {
    console.log(questions.programming);
    // let programmingScore =  await answerQuestions(questions.programming, "PROGRAMMING", true, true);
    // console.log(`~ Programming Score: ${programmingScore}/${questions.programming.length} ~`);
  }
};

const main = async () => {
  // Ask user if he wants to review all of the terms
  const menuChoices = [
    "Freeplay (all topics)",
    "Training (specific topic)",
    "Review a topic",
  ];
  // console.log(testerino)
  const menuAction = await menu([
    "Freeplay (all topics)",
    "Training (specific topic)",
    "Review a topic",
  ]);

  switch (menuAction) {
    case menuChoices[0]: // Freeplay
      await freeplay();
      break;
    case menuChoices[1]:
      await training();
      break;
    case menuChoices[2]:
      await review();
      break;
    default:
      break;
  }
};

main();
