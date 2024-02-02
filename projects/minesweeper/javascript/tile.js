class Tile {
    constructor(x,y,element){
        this.x = x;
        this.y = y;
        this.bomb = false;
        this.number = 0;
        this.clicked = false;
        this.flag = false;
        this.element = element;
        this.openColor = null;
        this.closedColor = null;
    }

    clear(){
        if( this.flag || this.clicked) return;

        this.clearDOMTile();

        if( this.bomb ){
            GameOver = true;
            gameLost();
        } else {
            this.clicked = true;
            tilesClicked++;

            if( this.number == 0) this.clearZeroes();
        }
    }

    clearDOMTile(){
        if( this.bomb ){
            this.element.style.backgroundColor = "#f8484d";
        } else {
            this.element.style.backgroundColor = this.openColor;
            this.element.style.color = COLORS[this.number-1];
            if( this.number != 0){
                this.element.textContent = this.number;
            }
        }

       
    }

    getAdjTiles(){
        let tile = [];
        for(i = -1; i <= 1; i++){ 
            for(j = -1; j <= 1; j++){
                if( isValidTile(this.x+i,this.y+j) && !(i == 0 && j == 0)){
                    tile.push(board[this.x+i][this.y+j]);
                } 
            }
        }
        return tile;
    }   

    flagTile(){  
        if( this.clicked ) return;
        this.flag = !this.flag;

        if( this.flag ){
           this.element.style.backgroundColor = FLAG_COLORS[0];
           this.element.innerHTML = flagElement;
           this.element.firstChild.style.borderRight = `24px solid ${FLAG_COLORS[1]}`;

        } else {
            this.element.style.backgroundColor = this.closedColor;
            this.element.innerHTML = "";
        }
    }

    middleClick(){
        if( !this.clicked ) return;
        //
        const numOfAdjFlags = this.adjTiles.reduce((sum,tile) => sum+tile.flag, 0);
        if( this.number == numOfAdjFlags ){
            this.clearAdjTiles();
        }
    }

    clearAdjTiles(){
        this.adjTiles.forEach( adjTile => adjTile.clear());
    }

    clearZeroes(){
        if( this.number != 0 || this.flag || this.bomb ) return
        this.clearAdjTiles();
    }
}