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



/*
const answerNetworking = async () => {
    console.log(`\n~ NETWORKING REVIEW ~\n`);
    for (let i = 0; i < questions.networking.length; i++) {
        // Prompt the user for input
        const response = await prompt({
            type: 'input',
            name: 'answer',
            message: questions.networking[i].question,
        });
        // First we check the possible answers of the question if multiple
        if (questions.networking[i].answer.includes('/')) {
            // Then we split the possible answers
            let possibleAnswers = questions.networking[i].answer.split('/');
            if (isValidAnswer(response.answer, possibleAnswers)) {
                console.log("CORRECT ✓\n");
                networkingScore++;
                continue;
            } else {
                console.log("INCORRECT ✗  -> " + questions.networking[i].answer + "\n");
                continue;
            }
        } 

        // If there is only one possible answer
        if (response.answer.toLowerCase() === questions.networking[i].answer.toLowerCase()) {
            console.log("CORRECT ✓\n");
            networkingScore++;
            continue;
        } else {
            console.log("INCORRECT ✗  -> " + questions.networking[i].answer + "\n");
            continue;
        }
    }
}

const answerCybersecurity = async () => {
    console.log(`\n~ CYBERSECURITY REVIEW ~\n`);
    for (let i = 0; i < questions.cybersecurity.length; i++) {
        // Prompt the user for input
        const response = await prompt({
            type: 'input',
            name: 'answer',
            message: questions.cybersecurity[i].question,
        });
        // First we check the possible answers of the question if multiple
        if (questions.cybersecurity[i].answer.includes('/')) {
            // Then we split the possible answers
            let possibleAnswers = questions.cybersecurity[i].answer.split('/');
            if (isValidAnswer(response.answer, possibleAnswers)) {
                console.log("CORRECT ✓\n");
                cybersecurityScore++;
                continue;
            } else {
                console.log("INCORRECT ✗  -> " + questions.cybersecurity[i].answer + "\n");
                continue;
            }
        } 

        // If there is only one possible answer
        if (response.answer.toLowerCase() === questions.cybersecurity[i].answer.toLowerCase()) {
            console.log("CORRECT ✓\n");
            cybersecurityScore++;
            continue;
        } else {
            console.log("INCORRECT ✗  -> " + questions.cybersecurity[i].answer + "\n");
            continue;
        }
    }
}
*/

const main = async () => {
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

main();
