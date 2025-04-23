import { useNotification } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const notification = useNotification()

  return (
    <div style={{...style, display: notification ? '' : 'none'}}>
      {notification}
    </div>
  )
}

export default Notification
