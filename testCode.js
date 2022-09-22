let totalGameNum = 4
let nowEndNum = 0

class Game{
  constructor( gameID, clientID ){
    this.gameID = gameID
    this.hostID = clientID
    this.joinID = ""
    this.score = 0
    this.rank = 0
    this.listNum = 0
  }
}

let userJoinMap = new Map()

const game1 = new Game("test", "test2")
game1.score = 300
const game2 = new Game("test", "test2")
game2.score = 400
const game3 = new Game("test", "test2")
game3.score = 800
const game4 = new Game("test", "test2")
game4.score = 600



userJoinMap.set("1", game1 )
userJoinMap.set("2", game2 )
userJoinMap.set("3", game3 )
userJoinMap.set("4", game4 )

console.log( userJoinMap )

const testMap = new Map([...userJoinMap.entries()].sort((a, b) => b[1].score - a[1].score));
console.log(testMap);

for (let [key, obj] of testMap) {     // get data sorted
  console.log(key + ' ' + obj.score);
}

