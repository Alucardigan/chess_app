import React, { MouseEvent, useState } from "react";
import "./Tile.css"
import { useContext } from "react";
import GameContext from "../Game-classes/GameContext";
import { Game } from "../Game-classes/Game";
import { Piece } from "../Game-classes/Piece";

interface mouseHandlerType{
    (a:MouseEvent,key:number):void;
}


export default function Tile({TileX,TileY,cookie,piece=undefined,mouseHandler}:{TileX:number,TileY:number,cookie:number,piece?:undefined|Piece,mouseHandler:mouseHandlerType}){
    
    
    
    if((TileX+TileY)%2){
        
        return <div id="Tile"  onMouseDown={(e)=>mouseHandler(e,cookie)} className="black-tile" style= {{backgroundImage:`url(${piece?.imageLink})`}}>
        
        </div>
    }
    else{
        return <div id="Tile"  onMouseDown={(e)=>mouseHandler(e,cookie)}  className="white-tile" style= {{backgroundImage:`url(${piece?.imageLink})`}}>
           
        </div>
    }
    
};