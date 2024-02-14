import React from "react";
import "./Tile.css"


export default function Tile({TileX,TileY}:{TileX:number,TileY:number}){
    if((TileX+TileY)%2){
        return <div id="Tile" className="black-tile">{TileX},{TileY}
        <img src = "b_queen.png" alt="black_queen"></img>
        </div>
    }
    else{
        return <div id="Tile" className="white-tile">{TileX},{TileY}</div>
    }
    
};