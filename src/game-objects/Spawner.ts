import { scaleRatio } from "../constants";
import { getRandomInt } from "@au-re/procgen";

interface SpawnableSprites {
   [key: string]: {
       texture: string,
       frame?: string | number
       // TODO: add randomizer weight
   }
}

export class Spawner extends Phaser.GameObjects.GameObject {
  spawnables: SpawnableSprites
  
  yMin = 0;
  xMin = 0;
  yMax = 1000;
  xMax = 1000;
    
  constructor(scene: Phaser.Scene, spawnables: SpawnableSprites) {
    super(scene, "spawner");
    this.spawnables = spawnables;
  }
  
  spawnAt(id: string, x: number, y: number) {
    if(!this.spawnables[id]) return;
    const sprite = new Phaser.GameObjects.Sprite(this.scene, x, y, this.spawnables[id].texture, this.spawnables[id].frame)
    sprite.setScale(scaleRatio);
    this.scene.add.existing(sprite);
  }
  
  // spawn random number of items at random locations
  // TODO: restrict the spawn area to a predefined area
  spawnRandom(maxItems: number = 10) {
      const numItems = getRandomInt(1, maxItems)
      for(let i = 0; i < numItems; i++) {
          const randomPos = { 
              x: getRandomInt(this.xMin, this.xMax), 
              y: getRandomInt(this.yMin, this.yMax) 
          }
        const randomItem = getRandomInt(0, Object.keys(this.spawnables).length)
        this.spawnAt(Object.keys(this.spawnables)[randomItem], randomPos.x, randomPos.y)
      }
  }
  
  // spawn a random spawnable single item at a single location
  spawnRandomAt() {
      
  }
}
