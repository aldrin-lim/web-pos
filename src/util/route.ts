import {
  useNavigate,
  useLocation,
  useResolvedPath,
  NavigateOptions,
} from 'react-router-dom'

export const useCustomRoute = <T extends Record<string, string>>(paths: T) => {
  const path = Object.keys(paths).reduce(
    (acc, key) => {
      acc[key as keyof T] = paths[key]
      return acc
    },
    {} as Record<keyof T, string>,
  )

  const navigate = useNavigate()

  const location = useLocation()

  const resolvedPath = useResolvedPath('')

  const isParentScreen = resolvedPath.pathname === location.pathname

  const currentScreen = location.pathname.replace(
    `${resolvedPath.pathname}/`,
    '',
  ) as T[keyof T]

  const navigateToParent = () => {
    navigate(resolvedPath.pathname)
  }

  const navigateTo = (screen: string, options?: NavigateOptions) => {
    navigate(`${location.pathname}/${screen}`, options)
  }

  return {
    path,
    isParentScreen,
    currentScreen,
    navigateToParent,
    navigateTo,
  }
}
