import { action, observable } from 'mobx'
import GuitarInput from "../input/GuitarInput";

class GameStore {

  @observable public guitarInput: GuitarInput = new GuitarInput();

}

const gameStore = new GameStore()
export default gameStore
