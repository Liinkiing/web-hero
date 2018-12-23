import {List} from '../utils/extensions';
import {EventEmitter} from 'events';
import {GUITAR_VARIABLES, GuitarAxes, GuitarButtons} from './bindings';
import {Fret} from '../utils/interfaces';

export enum GuitarEvents {
  Strum = 'strum',
  StrumRelease = 'strum_release',
  StrumUp = 'strum_up',
  StrumDown = 'strum_down'
}

export default class GuitarInput extends EventEmitter {

  private _guitar?: Gamepad;
  private _elapsed: number
  private _flags = {
    strummed: false
  }

  constructor() {
    super()
    window.addEventListener('gamepadconnected', this.updateGamepad)
    window.addEventListener('gamepaddisconnected', this.updateGamepad)
    this._elapsed = requestAnimationFrame(this.update)
  }

  public addListener = (event: GuitarEvents, listener: (...args: any[]) => void): this => {
    return super.addListener(event, listener);
  }

  public removeListener = (event: GuitarEvents, listener: (...args: any[]) => void): this => {
    return super.removeListener(event, listener);
  }

  public once = (event: GuitarEvents, listener: (...args: any[]) => void): this => {
    return super.once(event, listener);
  }

  public emit = (event: GuitarEvents, ...args: any[]): boolean => {
    return super.emit(event, args);
  }

  public get pressedButtons(): string[] {
    if (!this._guitar) {
      return []
    }
    return this._guitar.buttons
      .filter(button => button.pressed)
      .map(button => GuitarButtons[this._guitar!.buttons.indexOf(button)])
  }

  public get pressedFrets(): List<Fret> {
    if (!this._guitar) {
      return new List<Fret>()
    }

    const fretsButton: number[] = [
      GuitarButtons.GREEN_FRET,
      GuitarButtons.RED_FRET,
      GuitarButtons.YELLOW_FRET,
      GuitarButtons.BLUE_FRET,
      GuitarButtons.ORANGE_FRET
    ]

    return new List<Fret>(this._guitar.buttons
      .filter((button, index) => button.pressed && fretsButton.includes(index))
      .map(button => GuitarButtons[this._guitar!.buttons.indexOf(button)]) as Fret[]
    )
  }

  private retrieveGuitarGamepad = (): Gamepad | undefined => {
    const gamepads = (new List<Gamepad>(navigator.getGamepads()! as Gamepad[])).filter(Boolean);
    return gamepads.find(gamepad => /(guitar)|(hero)/i.test(gamepad.id))
  }

  private updateGamepad = () => {
    this._guitar = this.retrieveGuitarGamepad()
  }

  private tick = () => {
    this._elapsed = requestAnimationFrame(this.update)
    this.updateGamepad()
  }

  private update = () => {
    this.tick()
    if (this._guitar) {
      this.handleStrums()
    }
  }

  private handleStrums = () => {
    if (this._guitar!.axes[GuitarAxes.MEDIATOR_AXE] === GUITAR_VARIABLES.MEDIATOR_UP && !this._flags.strummed) {
      this.emit(GuitarEvents.Strum, this.pressedFrets)
      this.emit(GuitarEvents.StrumUp, this.pressedFrets)
      this._flags.strummed = true
    }
    if (this._guitar!.axes[GuitarAxes.MEDIATOR_AXE] === GUITAR_VARIABLES.MEDIATOR_NEUTRAL && this._flags.strummed) {
      this.emit(GuitarEvents.StrumRelease)
      this._flags.strummed = false
    }
    if (this._guitar!.axes[GuitarAxes.MEDIATOR_AXE] === GUITAR_VARIABLES.MEDIATOR_DOWN && !this._flags.strummed) {
      this.emit(GuitarEvents.Strum, this.pressedFrets)
      this.emit(GuitarEvents.StrumDown, this.pressedFrets)
      this._flags.strummed = true
    }
  }

}
