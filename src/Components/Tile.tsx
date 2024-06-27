import React, { MouseEvent, useState } from "react";
import "./Tile.css"
import { useContext } from "react";


interface mouseHandlerType{
    (a:MouseEvent,key:number):void;
}


export default function Tile({TileX,TileY,cookie,piece=undefined,mouseHandler,isSelected}:{TileX:number,TileY:number,cookie:number,piece?:undefined|string,mouseHandler:mouseHandlerType,isSelected:boolean}){
    
    const tileClass = `${isSelected? 'selected': (TileX+TileY)%2?'black-tile':'white-tile'}`
    
    if((TileX+TileY)%2){
        
        return <div id="Tile"  onMouseDown={(e)=>mouseHandler(e,cookie)} className={tileClass} style= {{backgroundImage:`url(/${piece})`}}>
        
        </div>
    }
    else{
        return <div id="Tile"  onMouseDown={(e)=>mouseHandler(e,cookie)}  className={tileClass} style= {{backgroundImage:`url(/${piece})`}}>
           
        </div>
    }
    
};