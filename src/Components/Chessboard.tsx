import { Box, Image, SimpleGrid } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
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
type selectPiece = {
    alias:string|null,
    fromTile:number|null,
    toTile:number|null

}
function ChessBoard({boardState,onMove}:{boardState:string,onMove:(from:number,to:number)=>void}){
    //setup board
    const chessboard = boardState.split('')
    
    return (
        <div>
            <SimpleGrid
                columns={8}
                spacing={0}
            >{chessboard.map((s,i)=>{
                return <Tile key={i} tileKey={i} tileIdx={i} pieceLink={findPieceLink(s)} onMove={onMove}  />
            })
            }
            </SimpleGrid>
        </div>
    )
}


export default ChessBoard;