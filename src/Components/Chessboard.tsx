import { Box, Image, SimpleGrid } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const Pieces:Piece[] = [
    {name:'Pawn',colour:'white',imageLink:'/public/pieces-basic-png/white-pawn.png',alias:'P'},
    {name:'Rook',colour:'white',imageLink:'/public/pieces-basic-png/white-rook.png',alias:'R'},
    {name:'Knight',colour:'white',imageLink:'/public/pieces-basic-png/white-knight.png',alias:'N'},
    {name:'Bishop',colour:'white',imageLink:'/public/pieces-basic-png/white-bishop.png',alias:'B'},
    {name:'Queen',colour:'white',imageLink:'/public/pieces-basic-png/white-queen.png',alias:'Q'},
    {name:'King',colour:'white',imageLink:'/public/pieces-basic-png/white-king.png',alias:'K'},
    {name:'Pawn',colour:'black',imageLink:'/public/pieces-basic-png/black-pawn.png',alias:'p'},
    {name:'Rook',colour:'black',imageLink:'/public/pieces-basic-png/black-rook.png',alias:'r'},
    {name:'Knight',colour:'black',imageLink:'/public/pieces-basic-png/black-knight.png',alias:'n'},
    {name:'Bishop',colour:'black',imageLink:'/public/pieces-basic-png/black-bishop.png',alias:'b'},
    {name:'Queen',colour:'black',imageLink:'/public/pieces-basic-png/black-queen.png',alias:'q'},
    {name:'King',colour:'black',imageLink:'/public/pieces-basic-png/black-king.png',alias:'k'},
]
type Piece = {
    name: string,
    colour: string,
    imageLink: string,
    alias:string
}

function ChessBoard({boardState}:{boardState:string}){
    const [chessboard,setchessboard] = useState<JSX.Element[]>([])
    useEffect(() => {
        console.log(boardState)
        const board = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tileIdx = i + j;
                const key = i*8 +j
                let pieceLink = null;
                const piece = Pieces.find(piece => piece.alias === boardState[key]);
                if (piece) {
                    pieceLink = piece.imageLink; // Get the image link if the piece exists
                }
                board.push(<Tile key={key} tileIdx={tileIdx} pieceLink={pieceLink} />); // Use key prop for elements in lists
            }
        }
        setchessboard(board); // Set the chessboard state with the new board array
    }, [boardState]);

    return (
        <SimpleGrid
            columns={8}
            spacing={0}
            border="2px solid #333"
            
        >{chessboard}
        </SimpleGrid>
    )
}

interface TileProps {
    tileIdx: number,
    pieceLink: string|null|undefined
}
function Tile({tileIdx,pieceLink}:TileProps){
    return (
    <Box
        width="60px"
        height="60px"
        bg={tileIdx%2 ? '#b58863' : '#f0d9b5'}
    >
        {pieceLink && (
            <Image src={pieceLink}/>
        )}
    </Box>
    )

}
export default ChessBoard;