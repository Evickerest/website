
// prevents right click and middle click on document
document.addEventListener('contextmenu', event => event.preventDefault());
document.body.onmousedown = function(e) { if (e.button === 1) return false; }

const isValidTile = (x,y) => !(x < 0 || x >= Width || y < 0 || y >= Height);


//
//  ******** BOARD CREATION *********
//

function getGameModeSelected(){
    let temp;
    gameButtons.forEach( button => {
        if( button.checked){
           temp = button.value;
        }
    })
    return temp;
}

function createBoard(w = 0,h = 0,b = 0){
    const gameModeSelected = getGameModeSelected();

    if( gameModeSelected == "Custom"){
        Width = parseInt(customWidthBox.value);
        Height = parseInt(customHeightBox.value);
        Bombs = parseInt(customMinesBox.value);
    } else if( gameModeSelected != "Custom"){
        Width = GAMES[gameModeSelected]["Width"];
        Height = GAMES[gameModeSelected]["Height"];
        Bombs = GAMES[gameModeSelected]["Mines"];
    } else {
        Width = w;
        Height = h;
        Bombs = b;
    }

    // type checking
    if( typeof(Width) === "string" || typeof(Height) === "string" || typeof(Bombs) == "string"){
        console.warn("Arguments must be integers!");
        return
    }

    // integer checking
    Width = Math.max(1, Math.round(Width));
    Height = Math.max(1, Math.round(Height));
    Bombs = Math.max( 0,  Math.min( Math.round(Bombs), Width * Height - 9));

    firstClick = true;
    GameOver = false;
    tilesClicked = 0;

    // create html elements
    document.querySelector(".board").textContent = "";
    const fragment = new DocumentFragment();
    
    document.documentElement.style.setProperty('--grid-width', Width);

    board = Array(Width).fill(0).map(x => Array(Height).fill(0));

    for( i = 0; i < Height; i++){ for(j = 0; j < Width; j++){  
            const element = document.createElement("div");
            element.className = "tile";
            element.onmouseup = click;
            board[j][i] = new Tile(j,i,element);
            element.tile = board[j][i];
            
            element.style.backgroundColor = TILE_COLORS[ (i + j)%2 ];
            board[j][i].openColor = TILE_COLORS[ (i+j) % 2 + 2];
            board[j][i].closedColor =  TILE_COLORS[ (i + j)%2 ];

            fragment.appendChild(element);
        }
        document.querySelector(".board").appendChild( fragment );
    } 

    // add adjacent tiles property to each tile 
    board.forEach( column => {
        column.forEach( tile => {
            tile.adjTiles = tile.getAdjTiles();
        });
    });
}

function createBombsAndNumbers(x,y){
    let bombsLeft = Bombs;
    while( bombsLeft > 0){
        const randomX = Math.floor(Math.random() * Width);
        const randomY = Math.floor(Math.random() * Height);
        const tile = board[randomX][randomY];

        // returns true if bomb is directly adjacent to first click
        const adjacentToClick = (Math.abs(tile.x-x) + Math.abs(tile.y-y)) < widthOfOpenSpace;

        if( tile.bomb || adjacentToClick) continue;

        tile.bomb = true;
        tile.adjTiles.forEach(adjTile => {
            adjTile.number++
        });
        bombsLeft--;   
    }
}

//
//  ******** HANDLE CLICKS *********
//

function click(e){
    if(GameOver) return;

    if( e.which == 1){
        if(firstClick){
            createBombsAndNumbers(this.tile.x,this.tile.y);
            firstClick = false;
        }
        if( !board[this.tile.x][this.tile.y].clicked ){
            this.tile.clear();  
        } else {
            this.tile.middleClick();
        }
    } else if( e.which == 2){
        this.tile.middleClick();

    } else if( e.which == 3){
        this.tile.flagTile();
    } 
    checkWin();
    checkAllBorders();
}

//
//  ******** END GAME *********
//

function checkWin(){
    if( tilesClicked != Width*Height - Bombs) return;
    GameOver = true;
    board.forEach(column => {
        column.forEach( tile => {
            if( tile.bomb && !tile.flag) tile.flagTile();
        });
    });
    alert("You have won")
}

function gameLost(){
    board.forEach(column => {
        column.forEach( tile => {
            if( tile.bomb){
                if( !tile.flag){
                    tile.element.innerHTML = "<div class='mine'></div>"
                    tile.element.style.backgroundColor = randomColor();
                    tile.element.firstChild.style.backgroundColor = MINE_COLOR[0];
                } else {
                    tile.element.backgroundColor = flagBgcolor;
                }
            } else if(tile.flag){
                tile.element.style.backgroundColor = "#f8484d";
            }
        });
    });
    alert("You have lost")
}


//
//  ******** BORDERS *********
//

function checkAllBorders(){
    board.forEach( row => {
        row.forEach( tile => {
            adjustTileBorders(tile);
        })
    })
}

function adjustTileBorders(tile){
    const x = tile.x;
    const y = tile.y;
    const borders = tile.element.querySelectorAll(".border");
    borders.forEach( border => border.remove());
    const flagBorders = tile.element.querySelectorAll(".flag-border");
    flagBorders.forEach( border => border.remove());

    if( !DisplayBorder ) return;

    if( tile.clicked ){
        for( var i = -2; i < 2; i++){
            xAd = x+((i+1) % 2);
            yAd = y+i%2;
            if( isValidTile(xAd,yAd) ){
                if(!board[xAd][yAd].clicked || board[xAd][yAd].flag){
                    tile.element.innerHTML += borderOrder[i+2];
                }
            }
        }
    } else if( !tile.flag && !tile.clicked){
        for( var i = -2; i < 2; i++){
            xAd = x+((i+1) % 2);
            yAd = y+i%2;
            if( isValidTile(xAd,yAd) ){
                if ( board[xAd][yAd].flag ){
                    tile.element.innerHTML += flagBorderOrder[i+2];
                }
            }
        }
    }
}


// Initlizae board
createBoard(30,16,99);
