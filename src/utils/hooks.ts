import {useEffect, useState, useLayoutEffect, InputIdentityList} from "react"
import {List} from "./extensions"
import {GuitarEvents} from "../input/GuitarInput";
import gameStore from "../store/GameStore";

export const useGamepads = (): List<Gamepad> => {
  const [gamepads, setGamepads] = useState<List<Gamepad>>(new List<Gamepad>())
  useEffect(() => {
    const listener = () => {
      setGamepads(new List<Gamepad>(navigator.getGamepads()! as Gamepad[]))
    }
    window.addEventListener("gamepadconnected", listener)
    window.addEventListener("gamepaddisconnected", listener)

    return () => {
      window.removeEventListener('gamepadconnected', listener)
      window.removeEventListener('gamepaddisconnected', listener)
    }
  })

  return new List<Gamepad>(gamepads.filter(Boolean)! as Gamepad[])
}

export const useGuitarEvent = (event: GuitarEvents, listener: () => void, inputs?: InputIdentityList) => {
  const { guitarInput } = gameStore

  useEffect(() => {
    guitarInput.addListener(event, listener)

    return () => {
      guitarInput.removeListener(event, listener)
    }
  }, inputs)
}

export const useRaf = (delay: number = 0): number => {
  const [elapsed, set] = useState<number>(0);

  useLayoutEffect(() => {
    let raf: number, start: number;

    const onFrame = (delta: number) => {
      set(delta)
      loop();
    };
    const loop = () => {
      raf = requestAnimationFrame(onFrame);
    };
    const onStart = () => {
      start = Date.now();
      loop();
    };
    const timerDelay = setTimeout(onStart, delay);

    return () => {
      clearTimeout(timerDelay);
      cancelAnimationFrame(raf);
    };
  }, [delay]);

  return elapsed;
};
