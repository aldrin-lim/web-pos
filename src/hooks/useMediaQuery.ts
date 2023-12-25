import { useEffect, useState } from 'react'

// Adding 'xs' to the SCREEN_SIZES array
const SCREEN_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
export type ScreenSize = (typeof SCREEN_SIZES)[number]

// Updating the Breakpoint type to include 'xs'
type Breakpoint = {
  [key in ScreenSize]: number
}

// Adding 'xs' to the BREAKPOINT_MAP with a value of 320
const BREAKPOINT_MAP: Breakpoint = {
  xs: 320, // Added xs breakpoint
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Updating getBreakPoint function to include 'xs'
const getBreakPoint = (width: number) => {
  const { xs, sm, md, lg, xl, '2xl': xxl } = BREAKPOINT_MAP

  if (width <= xs) {
    return 'xs'
  } else if (width > xs && width < sm) {
    return 'sm'
  } else if (width >= sm && width < md) {
    return 'md'
  } else if (width >= md && width < lg) {
    return 'lg'
  } else if (width >= lg && width < xl) {
    return 'xl'
  } else {
    return '2xl'
  }
}

// Updated hook definition
type UseMediaQueryOption = {
  updateOnResize: boolean
}

const useMediaQuery = (
  option: UseMediaQueryOption = { updateOnResize: false },
) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [currentBreakpoint, setCurrentBreakPoint] = useState<ScreenSize>('xs') // Default to 'xs'
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    if (option && option.updateOnResize) {
      const updateWindowDimensions = () => {
        setScreenWidth(window.innerWidth)
      }
      window.addEventListener('resize', updateWindowDimensions)
      return () => window.removeEventListener('resize', updateWindowDimensions)
    }
  }, [option])

  useEffect(() => {
    const breakpoint = getBreakPoint(screenWidth)
    breakpoint !== currentBreakpoint && setCurrentBreakPoint(breakpoint)
  }, [screenWidth, currentBreakpoint])

  useEffect(() => {
    setIsDesktop(
      currentBreakpoint !== 'xs' &&
        currentBreakpoint !== 'sm' &&
        currentBreakpoint !== 'md',
    )
  }, [currentBreakpoint])

  return {
    currentBreakpoint,
    isDesktop,
    breakpoints: BREAKPOINT_MAP,
    screenSizes: SCREEN_SIZES,
  }
}

export default useMediaQuery
