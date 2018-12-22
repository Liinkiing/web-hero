export const wait = (ms: number): Promise<TimerHandler> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
