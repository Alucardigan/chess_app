import React, { MouseEvent } from "react";
import "./Tile.css"


export default function Tile({TileX,TileY,imageLink=undefined}:{TileX:number,TileY:number,imageLink?:undefined|string}){
    function handleClick(e:MouseEvent){
        

        
    }
    
    if((TileX+TileY)%2){
        return <div id="Tile" onClick={e=>handleClick(e)} className="black-tile" style= {{backgroundImage:`url(${imageLink})`}}>
        
        </div>
    }
    else{
        return <div id="Tile" onClick={e=>handleClick(e)}   className="white-tile" style= {{backgroundImage:`url(${imageLink})`}}>
           
        </div>
    }
    
};