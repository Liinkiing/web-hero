import {action, computed, observable} from 'mobx'
import GuitarInput from "../input/GuitarInput";
import {Fret} from "../utils/interfaces";

class GameStore {

  @observable public guitarInput: GuitarInput = new GuitarInput();

  public isFretPressed = (fret: Fret): boolean => {
    return this.guitarInput.pressedFrets.includes(fret)
  }

}

const gameStore = new GameStore()
export default gameStore
