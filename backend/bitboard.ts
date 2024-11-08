

interface BoardState{
    board:[number]   
}
//pawns,rooks,knights,bishops,queen,king,bpawns,brooks,...
//00000000,00000000,00000000.00000000.00000000,00000000,11111111,00000000 ->65280 ; white pawns
//00000000,00000000,00000000.00000000.00000000,00000000,00000000,10000001 ->129 ; white rooks
//00000000,00000000,00000000.00000000.00000000,00000000,00000000,01000010 ->66 ; white knights
//00000000,00000000,00000000.00000000.00000000,00000000,00000000,00100100 ->36 ; white bishops
//00000000,00000000,00000000.00000000.00000000,00000000,00000000,10010000 ->16 ; white queen
//00000000,00000000,00000000.00000000.00000000,00000000,00000000,10001000 ->8 ; white king
//00000000,11111111,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black pawns
//10000001,00000000,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black rooks
//01000010,00000000,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black knights
//00100100,00000000,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black bishops
//00001000,00000000,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black queen 
//00010000,00000000,00000000.00000000.00000000,00000000,00000000,00000000 ->8 ; black king

class BitBoard{
    boardState:bigint[]
    constructor(){
        this.boardState = [ 
            0b0000000000000000000000000000000000000000000000001111111100000000n,//black pawns
            0b0000000000000000000000000000000000000000000000000000000010000001n,//black rooks
            0b0000000000000000000000000000000000000000000000000000000001000010n,//black knights
            0b0000000000000000000000000000000000000000000000000000000000100100n,//black bishops
            0b0000000000000000000000000000000000000000000000000000000000001000n,//black queen 
            0b0000000000000000000000000000000000000000000000000000000000010000n,//black king 
            0b0000000011111111000000000000000000000000000000000000000000000000n,//white pawns 
            0b1000000100000000000000000000000000000000000000000000000000000000n,//white rooks
            0b0100001000000000000000000000000000000000000000000000000000000000n,//white knights
            0b0010010000000000000000000000000000000000000000000000000000000000n,//white bishops
            0b0000100000000000000000000000000000000000000000000000000000000000n,//white queen
            0b0001000000000000000000000000000000000000000000000000000000000000n,//white king
        ]
    }
    getBoardState(){
        return this.boardState
    }
    determinePieceIdx(tileIdx:number){
        const mask = 1n<<BigInt(tileIdx)
        for(let i = 0; i < this.boardState.length;i++){
            if((this.boardState[i]&mask)){
                return i
            }
        }
        return -1;
    }
    makeMove(from:number,to:number){
        
        const fpiece = this.determinePieceIdx(from)
        console.log(this.boardState[fpiece].toString(2))
        if(fpiece ==-1){
            console.log("Is not a selected piece")
        }
        const fromMask = 1n<< BigInt(from)
        const toMask = 1n << BigInt(to)
        this.boardState[fpiece] &= ~fromMask//remove bit from its place 
        this.boardState[fpiece] |= toMask
    }
    convertToString(){
        let translationMap = new Map<number,string>([
            [0,'p'],[1,'r'],[2,'n'],[3,'b'],[4,'q'],[5,'k'],[6,'P'],[7,'R'],[8,'N'],[9,'B'],[10,'Q'],[11,'K']
        ]);
        
        let pieceStrings:string[] = []
        let finalString = ''.padStart(64,'0')
        for(let i = 0; i<this.boardState.length;i++){
            let pieceString = this.boardState[i].toString(2).padStart(64,'0')
            const pieceAlias = translationMap.get(i)
            if(!pieceAlias){
                console.log('invalid alias')
                return
            }
            pieceString = pieceString.replaceAll('1',pieceAlias)
            finalString = this.combinePieceStrings(finalString,pieceString)
        }
        return finalString
    }
    combinePieceStrings(str1: string, str2: string): string {
        // Use map to combine the characters from str1 and str2 more efficiently
        const translationArray = ['p','r','n','b','q','k','P','R','N','B','Q','K']
        return Array.from(str1, (char, i) =>
            translationArray.includes(char) ? char : (translationArray.includes(str2[i]) ? str2[i] : '0')
        ).join('');
    }
    
}
export default BitBoard;
