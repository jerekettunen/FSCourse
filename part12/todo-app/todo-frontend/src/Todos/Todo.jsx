

const Todo = ({ todo, onClickDelete, onClickToggle }) => {
  const handleDelete = () => {
    onClickDelete(todo)
  }

  const handleToggle = () => {
    onClickToggle(todo)
  }
  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={handleDelete}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        <button onClick={handleDelete}> Delete </button>
        <button onClick={handleToggle}> Set as done </button>
      </span>
    </>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}
export default Todo