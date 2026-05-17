import gameObby from "@/assets/game-obby.png";
import gameBattle from "@/assets/game-battle.png";
import gameTycoon from "@/assets/game-tycoon.png";
import gameRacing from "@/assets/game-racing.png";
import mentorOleksiy from "@/assets/mentor-oleksiy.png";
import mentorMariia from "@/assets/mentor-mariia.png";
import mentorDenys from "@/assets/mentor-denys.png";
import sgZombie from "@/assets/sg-zombie.png";
import sgSky from "@/assets/sg-sky.png";
import sgCity from "@/assets/sg-city.png";
import sgDragon from "@/assets/sg-dragon.png";
import sgPizza from "@/assets/sg-pizza.png";
import sgSpace from "@/assets/sg-space.png";

const byFile: Record<string, (typeof gameObby)> = {
  "game-obby.png": gameObby,
  "game-battle.png": gameBattle,
  "game-tycoon.png": gameTycoon,
  "game-racing.png": gameRacing,
  "mentor-oleksiy.png": mentorOleksiy,
  "mentor-mariia.png": mentorMariia,
  "mentor-denys.png": mentorDenys,
  "sg-zombie.png": sgZombie,
  "sg-sky.png": sgSky,
  "sg-city.png": sgCity,
  "sg-dragon.png": sgDragon,
  "sg-pizza.png": sgPizza,
  "sg-space.png": sgSpace,
};

export function getAsset(fileName: string) {
  const asset = byFile[fileName];
  if (!asset) {
    throw new Error(`Unknown asset: ${fileName}`);
  }
  return asset;
}
