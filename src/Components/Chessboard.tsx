import { Box, SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import Tile from "./Tile"


const Pieces:Piece[] = [
    {name:'Pawn',colour:'white',imageLink:'/pieces-basic-png/white-pawn.png',alias:'P'},
    {name:'Rook',colour:'white',imageLink:'/pieces-basic-png/white-rook.png',alias:'R'},
    {name:'Knight',colour:'white',imageLink:'/pieces-basic-png/white-knight.png',alias:'N'},
    {name:'Bishop',colour:'white',imageLink:'/pieces-basic-png/white-bishop.png',alias:'B'},
    {name:'Queen',colour:'white',imageLink:'/pieces-basic-png/white-queen.png',alias:'Q'},
    {name:'King',colour:'white',imageLink:'/pieces-basic-png/white-king.png',alias:'K'},
    {name:'Pawn',colour:'black',imageLink:'/pieces-basic-png/black-pawn.png',alias:'p'},
    {name:'Rook',colour:'black',imageLink:'/pieces-basic-png/black-rook.png',alias:'r'},
    {name:'Knight',colour:'black',imageLink:'/pieces-basic-png/black-knight.png',alias:'n'},
    {name:'Bishop',colour:'black',imageLink:'/pieces-basic-png/black-bishop.png',alias:'b'},
    {name:'Queen',colour:'black',imageLink:'/pieces-basic-png/black-queen.png',alias:'q'},
    {name:'King',colour:'black',imageLink:'/pieces-basic-png/black-king.png',alias:'k'},
]
function findPieceLink(alias:string){
    let fpiece =  Pieces.find((piece)=>piece.alias===alias)
    if(fpiece){
        return fpiece.imageLink
    }
    return fpiece
}
type Piece = {
    name: string,
    colour: string,
    imageLink: string,
    alias:string
}
function ChessBoard({boardState,isWhite, onMove}:{boardState:string,isWhite: boolean,onMove:(from:number,to:number)=>void}){
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
    const tileSize = isLargerThan800 ? "80px" : "11vw"; // Responsive tile sizing
    //setup board
    const chessboard = isWhite ? boardState.split('') : boardState.split('').reverse()
    
    return (
    <Box 
      bg="#272522" 
      p={3} 
      borderRadius="md"
      width="fit-content"
      margin="0 auto"
    >
      <SimpleGrid
        columns={8}
        spacing={0}
        width="fit-content"
        boxShadow="lg"
        borderRadius="sm"
        overflow="hidden"
      >
        {chessboard.map((s, i) => {
          const index = isWhite ? i : 63 - i;
          return (
            <Tile
              key={index}
              tileKey={index}
              tileIdx={index}
              pieceLink={findPieceLink(s)}
              onMove={onMove}
              tileSize={tileSize}
            />
          );
        })}
      </SimpleGrid>
    </Box>
  );

}


export default ChessBoard;