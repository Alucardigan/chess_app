import React from "react";
import "./Tile.css"


export default function Tile({TileX,TileY,imageLink=undefined}:{TileX:number,TileY:number,imageLink?:undefined|string}){
    if((TileX+TileY)%2){
        return <div id="Tile" className="black-tile">
        <img src = {imageLink} alt =""></img>
        </div>
    }
    else{
        return <div id="Tile" className="white-tile">
            <img src = {imageLink} alt =""></img>
        </div>
    }
    
};