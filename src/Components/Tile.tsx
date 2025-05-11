import { Box,Image,Text } from "@chakra-ui/react";

interface TileProps {
    tileSize : string,
    tileIdx: number,
    tileKey:number,
    pieceLink: string|null|undefined,
    onMove:(from:number,to:number)=>void
}
function Tile({tileSize,tileIdx,tileKey,pieceLink,onMove}:TileProps){
    const dragStart = (e:React.DragEvent)=>{
        e.dataTransfer.setData("text/plain", tileKey.toString())
    }
    const dropOver = (e:React.DragEvent)=>{
        e.preventDefault()
    }
    const drop = (e:React.DragEvent)=>{
        e.preventDefault()
        const data = e.dataTransfer.getData("text/plain")
        onMove(Number(data),tileKey)
    }
    return (
        <Box
        width={tileSize}
        height={tileSize}
        bg={(tileIdx + Math.floor(tileIdx/8)) % 2 ? '#b58863' : '#f0d9b5'}
        onDragOver={dropOver}
        onDrop={drop}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{ opacity: 0.9 }}
      >
        {/* File and rank labels for the edge tiles */}
        {tileIdx < 8 && (
          <Text 
            position="absolute" 
            bottom="2px" 
            right="2px"
            fontSize="10px" 
            color={(tileIdx % 2) ? '#f0d9b5' : '#b58863'}
          >
            {String.fromCharCode(97 + (tileIdx % 8))}
          </Text>
        )}
        
        {tileIdx % 8 === 0 && (
          <Text 
            position="absolute" 
            top="2px" 
            left="2px"
            fontSize="10px" 
            color={(tileIdx % 2) ? '#f0d9b5' : '#b58863'}
          >
            {8 - Math.floor(tileIdx / 8)}
          </Text>
        )}
        
        {pieceLink && (
          <Image 
            src={pieceLink} 
            onDragStart={dragStart} 
            draggable={true}
            width="85%"
            height="85%"
            objectFit="contain"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)' }}
          />
        )}
      </Box>
    );

}
export default Tile;