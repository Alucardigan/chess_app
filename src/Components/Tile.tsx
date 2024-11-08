import { Box,Image } from "@chakra-ui/react";

interface TileProps {
    tileIdx: number,
    tileKey:number,
    pieceLink: string|null|undefined,
    onMove:(from:number,to:number)=>void
}
function Tile({tileIdx,tileKey,pieceLink,onMove}:TileProps){
    const dragStart = (e:React.DragEvent)=>{
        e.dataTransfer.setData("text/plain", tileKey.toString())
    }
    const dropOver = (e:React.DragEvent)=>{
        e.preventDefault()
    }
    const drop = (e:React.DragEvent)=>{
        e.preventDefault()
        const data = e.dataTransfer.getData("text/plain")
        console.log(data,tileKey)
        onMove(Number(data),tileKey)
    }
    return (
    <Box
        width="60px"
        height="60px"
        bg={(tileIdx+Math.floor(tileIdx/8))%2 ? '#b58863' : '#f0d9b5'}
        onDragOver={dropOver}
        onDrop={drop}
    >
        {pieceLink && (
            <Image src={pieceLink} onDragStart={dragStart} draggable={true}/>
        )}
    </Box>
    )

}
export default Tile;