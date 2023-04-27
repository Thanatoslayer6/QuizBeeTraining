const fs = require('fs');
const { prompt } = require('enquirer');

// Read in the questions
let rawData = fs.readFileSync('questions.json');

// Parse the questions
let questions = JSON.parse(rawData);

// Shuffling algorithm - https://bost.ocks.org/mike/shuffle/
const shuffle = (array) => {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

console.log(`Loaded ${questions.cybersecurity.length} cybersecurity questions`);
console.log(`Loaded ${questions.networking.length} networking questions`);
console.log(`Loaded ${questions.programming.length} programming questions`);

// Shuffle the questions per topic
questions.cybersecurity = shuffle(questions.cybersecurity);
questions.networking = shuffle(questions.networking);
questions.programming = shuffle(questions.programming);

const isValidAnswer = (userInput, possibleAnswers) => {
    // Pattern string created would look like '/hello|world/i'
    const patternString = possibleAnswers.join('|');
    const answerPattern = new RegExp(patternString, 'i'); // 'i' means case-insensitive
    // Test the user input against the pattern and return the result
    return answerPattern.test(userInput);
}

const answerQuestions = async (topic, topicName) => {
    console.log(`\n~ ${topicName} REVIEW ~\n`);
    let score = 0;
    for (let i = 0; i < topic.length; i++) {
        // Prompt the user for input
        const response = await prompt({
            type: 'input',
            name: 'answer',
            message: topic[i].question,
        });
        // First we check the possible answers of the question if multiple
        if (topic[i].answer.includes('/')) {
            // Then we split the possible answers
            let possibleAnswers = topic[i].answer.split('/');
            if (isValidAnswer(response.answer, possibleAnswers)) {
                console.log("CORRECT ✓\n");
                score++;
                continue;
            } else {
                console.log("INCORRECT ✗  -> " + topic[i].answer + "\n");
                continue;
            }
        } 

        // If there is only one possible answer
        if (response.answer.toLowerCase() === topic[i].answer.toLowerCase()) {
            console.log("CORRECT ✓\n");
            score++;
            continue;
        } else {
            console.log("INCORRECT ✗  -> " + topic[i].answer + "\n");
            continue;
        }

    }
    return score;
}

const menu = async (menuChoices) => {
    console.log(`\n~ Welcome to I.T Wizard Reviewer ~\n`);
    const response = await prompt({
        type: 'select',
        name: 'action',
        message: "Please select an action",
        choices: menuChoices,
    });
    return response.action
}

const freeplay = async () => {
    let cybersecurityScore = await answerQuestions(questions.cybersecurity, "CYBERSECURITY");
    console.log(`~ Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length} ~`)
    let networkingScore =  await answerQuestions(questions.networking, "NETWORKING");
    console.log(`~ Networking Score: ${networkingScore}/${questions.networking.length} ~`)
    let programmingScore =  await answerQuestions(questions.programming, "PROGRAMMING");
    console.log(`~ Programming Score: ${programmingScore}/${questions.programming.length} ~`)
    console.log(`

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length}
        Networking Score: ${networkingScore}/${questions.networking.length}
        Programming Score: ${programmingScore}/${questions.programming.length}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    `);
}

const main = async () => {
    // Ask user if he wants to review all of the terms
    const menuChoices = ["Freeplay (all topics)", "Train a specific topic", "Review a topic"]
    const menuAction = await menu(menuChoices);
    console.log(menuAction)
    if (menuAction == menuChoices[0]) {
        console.log("Testing")
        await freeplay();
    } else if (menuAction == menuChoices[1]) {

    } else if (menuAction == menuChoices[2]) {

    }
    // switch (menuAction) {
    //     case menuChoices[0]:
    //         console.log("Testing")
    //         await freeplay();
    //         break;
    //     case menuChoices[1]:
    //         break;
    //     case menuChoices[2]:
    //         break;
    //     default:
    //         break;
    // }
}

main();
