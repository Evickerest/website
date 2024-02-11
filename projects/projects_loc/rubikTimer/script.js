let timerStartingStage = true;
let timerDelayReady = false;
let milliseconds = 0;
let solveNumber = 1;
let scramble = "";
let lastScramble = "";
let currentScramble = "";
const timer = document.querySelector(".timer");
const scrambleText = document.querySelector(".scramble");
const timerWrapper = document.querySelector(".times-wrapper");
const timesTable = document.querySelector(".times-table")
const closeModal = document.querySelector(".close");
const modal = document.querySelector(".time-modal");
const modalSolve = document.querySelector(".time-modal > h1");
const modalTime = document.querySelector(".solve-time");
const modalScramble = document.querySelector(".solve-scramble");
const modalDelete = document.querySelector("#delete");
const modalPlusTwo = document.querySelector("#plustwo");
const scrambleModal = document.querySelector(".scramble-modal");
const scrambleModalConfirm = document.querySelector("#confirm");
const scrambleModalClose = document.querySelector("#close");
const nextScrambleButton = document.querySelector("#next-scramble");
const lastScrambleButton = document.querySelector("#last-scramble");
const saveButton = document.querySelector("#save");
const displayButton = document.querySelector("#display");
let TIMER_DELAY_MS = 600;
let SCRAMBLE_LENGTH = 20;


//key = number, values = time and scramble
let times = [];

const scrambleDict = {
    "L": ["L","L'","L2"],
    "R": ["R","R'","R2"],
    "U": ["U","U'","U2"],
    "D": ["D","D'","D2"],
    "B": ["B","B'","B2"],
    "F": ["F","F'","F2"],
}

const scrambleList = ["F","F'","F2","B","B'","B2","U","U'","U2","D","D'","D2","R","R'","R2","L","L'","L2"];

const button = document.querySelector(".timer-button");

// when pressing down stop, and the second time up start again
document.body.onkeyup = function(e){
    if(e.code != "Space") return;
    if(timerDelayReady && timerStartingStage){
        startTimer();
        timerStartingStage = false;
    } else {
        timerStartingStage = true;
    }
    timer.style.backgroundColor = "white";
    clearTimeout(c);
}

document.body.onkeydown = function(e){ 
    if(e.repeat || e.code != "Space") return;
    if(timerStartingStage){
        c = setTimeout(timerDelay, TIMER_DELAY_MS);
        timer.style.backgroundColor = "red";
    } else {
        stopTimer(); 
        timerDelayReady = false;
        timerStartingStage = true;
    }
} 

function timerDelay(){
    timerDelayReady = true;
    timer.style.backgroundColor = "lightgreen";
}

function startTimer(){
    timerClock = setInterval( changeTimer, 1);
    offset = Date.now();
}
function changeTimer(){
    milliseconds += getOffset();
    timer.innerHTML = getTimeString();
}
function stopTimer(){
    timer.style.color = "black";
    clearInterval(timerClock);
    saveTime();
    addTime();
    generateScramble();               
}
function saveTime(){
    times.push( {"time": milliseconds/1000, "scramble": scramble });
}
 
function getOffset(){
    now = Date.now();
    delta = now - offset;
    offset = now;
    return delta;
}

function addTime(){
    const row = timesTable.insertRow(1);
    row.insertCell(0).textContent = solveNumber++;
    row.insertCell(1).textContent = getTimeString();
    row.cells[1].dataset.value = 2;
    row.onclick = openModal;
    milliseconds = 0;
}  

function openModal(){
    modal.showModal();
    modal.dataset.solve = timesTable.rows.length - this.rowIndex
    modalSolve.textContent = `Solve: ${modal.dataset.solve}`;
    modalTime.textContent = times[modal.dataset.solve - 1]["time"];
    modalScramble.textContent = times[modal.dataset.solve - 1]["scramble"];
}

closeModal.addEventListener("click", () => {
    modal.close();
});

modalDelete.addEventListener("click", ()=> {
    rowNum = modal.dataset.solve;
    timesTable.deleteRow(rowNum);
    times.splice(rowNum, 1);
    resetRowNumbers(rowNum);
    modal.close();
});

modalPlusTwo.addEventListener("click", ()=> {
    rowNum = modal.dataset.solve;
    row = timesTable.rows[solveNumber - rowNum];
    time = row.cells[1];
    time.textContent = (parseFloat(time.textContent) + parseInt(time.dataset.value)).toFixed(3) * 1;
    time.textContent = time.textContent + (time.dataset.value > 0 ? "+" : "");
    modalTime.textContent = time.textContent;
    time.dataset.value *= -1;
});

function resetRowNumbers(rowNum){
    for(i = 1; i < rowNum; i++){
        timesTable.rows[i].cells[0].textContent--;
    }
    solveNumber = timesTable.rows.length; 
}

//converts all times into 000:00.000 
//but if no minutes, then 0.000
function getTimeString(){
    mins = Math.floor(milliseconds / 60000);
    secs = Math.floor(milliseconds / 1000) % 60;
    mils = String(milliseconds % 1000).padStart(3, "0");
    return ((mins != 0) ? mins + ":" + ("0" + secs).slice(-2) : secs) + "." + mils;
}

function generateScramble(){
    lastScrambleButton.style.backgroundColor = "lightcyan";
    lastScramble = scramble;
    let previous = "";
    let letter = "";
    let tempScramble = "";
    for(i = 0; i < SCRAMBLE_LENGTH; i++){
        while(previous == letter || (scrambleDict[letter[0]]).includes(previous)){
            ranNum = Math.floor(Math.random() * scrambleList.length);
            letter = scrambleList[ranNum];
        }
        tempScramble += (letter) + "  ";
        previous = letter;
    }
    scramble = tempScramble;
    scrambleText.textContent = scramble;
  
}

generateScramble();

scrambleText.addEventListener("click", ()=> {
    scrambleModal.showModal();
});

scrambleModalClose.addEventListener("click", ()=> {
    scrambleModal.close();
});

scrambleModalConfirm.addEventListener("click", ()=> {
    SCRAMBLE_LENGTH = document.querySelector("#scramble-length").value;
    generateScramble();
    scrambleModal.close();
});

nextScrambleButton.addEventListener("click", ()=> {
    generateScramble();
});

lastScrambleButton.addEventListener("click", ()=> {
    if( lastScramble == "") return;
    scrambleText.textContent = lastScramble;
    scramble = lastScramble;
    lastScrambleButton.style.backgroundColor = "lightgrey";
});

function saveData(){
    localStorage.setItem("data", JSON.stringify(times));
}

function getData(){
    return ( localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : "noData");
}

function displaySavedData(){
    retrievedData = getData();
    if( retrievedData == "noData" || times.length == 0) return;

    for(let i = 0; i < retrievedData.length; i++){
        const row = timesTable.insertRow(1);
        row.insertCell(0).textContent = solveNumber++;
        row.insertCell(1).textContent = retrievedData[i]["time"];
        row.cells[1].dataset.value = 2;
        row.onclick = openModal;

    }

    times =JSON.parse(retrievedData);
}

saveButton.onclick = saveData;

displayButton.onclick = displaySavedData;