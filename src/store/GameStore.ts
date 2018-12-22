import {observable} from 'mobx'
import GuitarInput from "../input/GuitarInput";
import {Fret} from '../utils/interfaces';
import Color from 'color';
import {mapFretToColor} from '../components/guitar/FretButton';

class GameStore {

  @observable public guitarInput: GuitarInput = new GuitarInput();

  public isFretPressed = (fret: Fret): boolean => {
    return this.guitarInput.pressedFrets.includes(fret)
  }

  public get backgroundColor(): string {
    if (this.guitarInput.pressedFrets.length === 0) {
      return '#282c34'
    }

    return this.guitarInput.pressedFrets.reduce((acc, fret) => {
      return acc.mix(Color(mapFretToColor(fret)))
    }, Color(mapFretToColor(this.guitarInput.pressedFrets.first()))).toString()
  }

}

const gameStore = new GameStore()
export default gameStore
