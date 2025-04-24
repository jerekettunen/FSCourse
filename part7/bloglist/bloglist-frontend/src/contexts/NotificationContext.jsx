import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return {
        message: null,
        isError: false,
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: null,
    isError: false,
  })
  const setNotification = (message, isError, timeout) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, isError } })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, timeout * 1000)
  }

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context[0]
}
export const useSetNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useSetNotification must be used within a NotificationProvider'
    )
  }
  return context[1]
}

export default NotificationContext
