// const fs = require('fs');

// let rawData = (fs.readFileSync('networking.txt')).toString();

// console.log(rawData.toString())
// for (let i = 0; i < rawData.)

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('networking.txt')
});

lineReader.on('line', function (line) {
    let stuff = line.split('-');
    let question = stuff[0].trimEnd();
    let answer = stuff[1].trim();
    console.log(`\{
       "question": "${question}",
       "answer": "${answer}"
    \},`);
    // console.log('Line from file:', line);
});

lineReader.on('close', function () {
    // console.log('all done, son');
});

