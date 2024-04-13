export interface GameState{
    turns: number,
    players: any,
    currentBoardState: any
}

export interface room{
    roomId: number
    players: number[]
    gameState: GameState
}
