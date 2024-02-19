import React, { MouseEvent } from "react";
import "./Tile.css"
import { useContext } from "react";
import GameContext from "../Game-classes/GameContext";
export default function Tile({TileX,TileY,imageLink=undefined}:{TileX:number,TileY:number,imageLink?:undefined|string}){
    let GameState = useContext(GameContext);
    function handleClick(e:MouseEvent){
        
        GameState.selectTile(TileX,TileY);
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