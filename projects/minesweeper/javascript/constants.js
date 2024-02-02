let board = [];
let Width = 5;
let Height = 5;
let Bombs = 5;
let firstClick = true;
let GameOver = false;
let tilesClicked = 0;
let isSettingsShowing = false;
let DisplayBorder = true;

// DOM elements
const customWidthBox = document.querySelector("#custom-width");
const customHeightBox = document.querySelector("#custom-height");
const customMinesBox = document.querySelector("#custom-mines");

const gameButtons = document.querySelectorAll("input[name='game']");
gameButtons[2].checked = true;



// determines how large the open area is upon first click
// "3" represents a 3x3 box, e.g. 7 would represent a 7x7 box
let widthOfOpenSpace = 3;

let COLORS = ["#0000ff","#008000","#ff0000","#00008b","#a52a2a","#00ffff","#000000","#808080"];

// Cover Colors
//     ->  Lighter, Darker
// Open Colors
//     ->  Lighter, Darker
const TILE_COLORS = ["#a4ffa4","#61fd6d","white","aliceblue"];

// possible mine colors
const MINE_COLORS = [0,360,  90,100   ,50,70];

// flag colors
const FLAG_COLORS = ["#ffff00", "#000000"];

// mine color
const MINE_COLOR = ["#000000"];

//border surrounding open tiles
const TILE_BORDER_SIZE = "3";
const TILE_BORDER_COLOR = "black";


// all border types
const borderOrder = [
    "<div class='left border'></div>",
    "<div class='top border'></div>",
    "<div class='right border'></div>",
    "<div class='bottom border'></div>"
];
const flagBorderOrder = [
    "<div class='flag-left flag-border'></div>",
    "<div class='flag-top flag-border'></div>",
    "<div class='flag-right flag-border'></div>",
    "<div class='flag-bottom flag-border'></div>"
];

const flagElement = "<div class='triangle-left'></div>";

// different game types
const GAMES = {
    "Easy": {
        "Width": 9,
        "Height": 9,
        "Mines": 10,
    },
    "Moderate": {
        "Width": 16,
        "Height": 16,
        "Mines": 40
    },
    "Severe": {
        "Width": 30,
        "Height": 16,
        "Mines": 99
    },
    "Chaos": {
        "Width": 30,
        "Height": 20,
        "Mines": 145,
    }
}

//presets
const presets = {
    "Default": ["#a4ffa4","#61fd6d", "#ffffff","#F0F8FF","0","360","90","100","50","70",["#0000ff","#008000","#ff0000","#00008b","#a52a2a","#00ffff","#000000","#808080"],"#000000","#ffff00","#000000",true,"#000000",3],
    "Summer": ["#ffd9a3","#febc9f", "#f0ffd1","#ffffff","0","360","90","100","50","70",["#0000ff","#008000","#ff0000","#00008b","#a52a2a","#00ffff","#000000","#808080"],"#000000","#9c7126","#000000",true,"#79510c",3],
    "1s and 0s": ["#000000","#000000", "#000000","#000000","0","0","0","0","0","0",["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],"#ffffff","#000000","#ffffff",true,"#ffffff",3],
    "Good Luck": ["#ff0000","#ff0000", "#000000","#000000","360","360","100","100","50","50",["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"],"#ff0000","#ff0000","#000000",false,"#000000",3],
}

