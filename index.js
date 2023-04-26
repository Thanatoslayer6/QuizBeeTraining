const fs = require('fs');
const { prompt } = require('enquirer');

// Read in the questions
let rawData = fs.readFileSync('questions.json');
let cybersecurityScore = 0;
let networkingScore = 0;
let programmingScore = 0;

// Parse the questions
let questions = JSON.parse(rawData);

console.log(`Loaded ${questions.cybersecurity.length} cybersecurity questions`);
// console.log(`Loaded ${questions.networking.length} networking questions`);
// console.log(`Loaded ${questions.programming.length} programming questions`);

const isValidAnswer = (userInput, possibleAnswers) => {
    // Pattern string created would look like '/hello|world/i'
    const patternString = possibleAnswers.join('|');
    const answerPattern = new RegExp(patternString, 'i'); // 'i' means case-insensitive
    // Test the user input against the pattern and return the result
    return answerPattern.test(userInput);
}

const answerCybersecurity = async () => {
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


const main = async () => {
    await answerCybersecurity();
    console.log(`
        Cybersecurity Score: ${cybersecurityScore}/${questions.cybersecurity.length}
        Networking Score: ${networkingScore}/${questions.networking.length}
        Programming Score: ${programmingScore}/${questions.programming.length}
    `);
}

main();