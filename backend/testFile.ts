import BitBoard from "./bitboard";
import MoveGenerator from "./moveGenerator";
import RookMagicGenerator from "./rookMagicGen";

let rookGen = new RookMagicGenerator()
let mg = new MoveGenerator()
mg.getLegalRookMoves(0,1,new BitBoard())
