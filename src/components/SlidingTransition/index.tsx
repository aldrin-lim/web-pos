import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
type SlidingDirection = 'left' | 'right' | 'top' | 'bottom'

type SlidingTransitionProps = {
  children: React.ReactNode
  zIndex?: number
  direction?: SlidingDirection
}

const getAnimation = (direction: SlidingDirection) => {
  switch (direction) {
    case 'right':
      return {
        hidden: { x: '100%', opacity: 0 },
        visible: {
          x: '0',
          transition: { duration: 0.2 },
          opacity: 1,
        },
        exit: {
          x: '100%',
          transition: { duration: 0.2 },
          opacity: 0,
        },
      }
    case 'left':
      return {
        hidden: { x: '-100%', opacity: 0 },
        visible: {
          x: '0',
          transition: { duration: 0.2 },
          opacity: 1,
        },
        exit: {
          x: '-100%',
          transition: { duration: 0.2 },
          opacity: 0,
        },
      }
    case 'bottom':
      return {
        hidden: { y: '100%', opacity: 0 },
        visible: {
          y: '0',
          transition: { duration: 0.2 },
          opacity: 1,
        },
        exit: {
          y: '100%',
          transition: { duration: 0.2 },
          opacity: 0,
        },
      }
    case 'top':
      return {
        hidden: { y: '-100%', opacity: 0 },
        visible: {
          y: '0',
          transition: { duration: 0.2 },
          opacity: 1,
        },
        exit: {
          y: '-100%',
          transition: { duration: 0.2 },
          opacity: 0,
        },
      }
    default:
      return {
        hidden: { y: '100%' },
        visible: {
          y: 0,
          transition: { duration: 0.2 },
        },
        exit: {
          y: '100%',
          transition: { duration: 0.2 },
        },
      }
  }
}

const SlidingTransition: React.FC<SlidingTransitionProps> = ({
  children,
  zIndex = 10,
  direction = 'right',
}) => {
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const animation = getAnimation(direction)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animation}
      transition={{ duration: 0.5 }}
      className={`framer absolute top-0 h-full w-full bg-base-100 ${
        animationCompleted ? '' : 'overflow-hidden'
      }`}
      onAnimationComplete={() => setAnimationCompleted(true)}
      style={{
        zIndex,
      }}
    >
      {children}
    </motion.div>
  )
}

export default SlidingTransition
