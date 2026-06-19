import { motion, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"

interface CountdownProps {
  start: number
  duration: number
  time?: number
}

const millisToSeconds = (millis: number) => `${(millis / 1000).toFixed(1)}s`

export const Countdown = ({ start, duration, time }: CountdownProps) => {
  const remainingTime = time ? start + duration - time : duration
  const spring = useSpring(remainingTime, {
    bounce: 0
  })
  const remainingTimeDisplay = useTransform(spring, (current) => {
    if (current <= 500) {
      return "Go!"
    }

    return millisToSeconds(current)
  })

  useEffect(() => {
    spring.set(remainingTime)
  }, [spring, remainingTime])

  return <motion.span>{remainingTimeDisplay}</motion.span>
}
