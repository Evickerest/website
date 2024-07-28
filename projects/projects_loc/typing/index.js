const wordsBox = document.querySelector(".words");
timerLength = 30000;
WordsList = [];
WordsSize = 0;
secondLine = false;
totalCharacters = 0;
totalCorrect = 0;
textBuffer = [];

function getNextWord(){
    const randomInteger = Math.floor(Math.random() * WordsSize);
    return WordsList[randomInteger];
}

function addWordToDom(){
    const nextWord = getNextWord();
    const charList = nextWord.split("");

    let wordElement = '<div class="word">';
    for( char of charList){
        wordElement += `<div class="letter">${char}</div>`;
    }
    wordsBox.innerHTML += ( wordElement + "</div" );
}

async function readWordsFromFile(){
    try {
        const result = await fetch("words.txt");
        const text = await result.text();

        WordsList = text.split("\n");
        WordsSize = WordsList.length;

        displayWords();
    } catch( err ){
        console.log(err);
    }
}

function displayWords(){
    wordsBox.innerHTML = "";
    for( j = 0; j < 50; j++){
        addWordToDom();
    }
    lastLineHeight = document.querySelector(".word").getBoundingClientRect().y;
    currentLineHeight = lastLineHeight;
}

function isAlphabet(char){
    return /[a-zA-Z]/.test(char);
}

currentLine = [0,0];
lastLine = [0,0];

function getWordOffset(word){
    const rect = word.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.top
    }
}

function checkForNewLine( word ){
    currentLine = getWordOffset( word );
    
    if( lastLine.y > currentLine.y && !secondLine){
        return;
    }
    
    if( lastLine.x > currentLine.x && lastLine.y < currentLine.y){
       if( secondLine ){
            deleteRowOfWords();
            addRowOfWords();
       } else {
            secondLine = true;
        }
    }

    lastLine = currentLine;
}

function deleteRowOfWords(){
    const words = document.querySelectorAll(".word"),
          lineXStart = words[0].getBoundingClientRect().x,
          toRemove = [];
    var currentX = lineXStart;

    words.forEach( word => {
        if( word.getBoundingClientRect().x > lineXStart){
            toRemove.push( word);
        }       
    });

    toRemove.forEach( element => element.remove());    
}




function addRowOfWords(){
    for( i = 0; i < 10; i++){
        addWordToDom();
    }
}

document.addEventListener("DOMContentLoaded",  () => {
    readWordsFromFile();
});

const timerElement = document.querySelector("#timer");
const startElement = document.querySelector("#start");
const restartElement = document.querySelector("#restart");
const timesBox = document.querySelector(".times");

started = false;
done = false;
timer = timerLength;
milliseconds = 0;

function startTimer(){
    timerClock = setInterval( changeTimer, 1);
    offset = Date.now();
    startElement.style.display = "none";
}

function changeTimer(){
    timer -= getOffset();
    timerElement.textContent = Math.ceil(timer / 1000).toString();
    if( timer <= 0) stopTimer();
}

function getOffset(){
    now = Date.now();
    delta = now - offset;
    offset = now;
    return delta;
}

function stopTimer(){
    done = true;
    clearInterval(timerClock);
    appendResults();
    restartElement.style.display = "inline";
}

function appendResults(){
    var WPM = (totalCorrect / 5) / ((timerLength / 1000) / 60);
    timesBox.innerHTML += 
    `<div class="time">
    <span>WPM: ${WPM}</span>
    <span>Correct Characters: ${totalCorrect}</span>
    <span>Incorrect Characters: ${totalCharacters-totalCorrect}</span>
    <span>Characters: ${totalCharacters}</span>
    </div>`;
}

restartElement.addEventListener("click", () => {
    if( !done ) return;

    started = false;
    done = false;
    timer = timerLength;
    milliseconds = 0;
    secondLine = false;

    startElement.style.display = "inline";
    restartElement.style.display = "none";
    timerElement.textContent = timerLength/1000;

    displayWords();
})

document.addEventListener("keydown", e => {
    if( done ) return;
    if( !started ){
        startTimer();
        started = true;
        totalCharacters = 0;
        totalCorrect = 0;
    }

    const frontWord = document.querySelector(".word:not(.correct-word):not(.incorrect-word)");
    const frontLetter = frontWord.querySelector(".letter:not(.correct-letter):not(.incorrect-letter)");
    const letter = e.key;

    if( e.code == "Backspace"){
        const previousWord = frontWord.previousSibling;

        if( frontLetter != frontWord.firstChild ){
            if( frontLetter == null ){
                var previousLetter = frontWord.lastChild;
            } else {
                var previousLetter = frontLetter.previousSibling;
            }
            totalCharacters--;
            if( previousLetter.classList.contains("correct-letter")){
                totalCorrect--;
            }

            previousLetter.classList.remove("correct-letter");
            previousLetter.classList.remove("incorrect-letter");
        
        } else {
            previousWord.classList.remove("incorrect-word");
            // secondLine = false;
        }
    } else if( e.code == "Space"){
        if( frontWord.querySelector(".incorrect-letter") ){
           frontWord.classList.add("incorrect-word");
        } else if( !frontWord.querySelector(".letter:not(.correct-letter)")){
            frontWord.classList.add("correct-word");
        } else {
            frontWord.classList.add("incorrect-word");
        }
        const nextWord = frontWord.nextElementSibling;
        checkForNewLine( nextWord );

    } else if( isAlphabet(letter)) {
        if( frontLetter == null) return;
        if( frontLetter.textContent == letter){
            frontLetter.classList.add("correct-letter");
            totalCorrect++;
        } else {
            frontLetter.classList.add("incorrect-letter");
        }
        totalCharacters++;
    }
});
