const Course = ({id, course}) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div key={id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total total={total} />
      </div>
    )
  }  
  
  const Header = (props) => <h2>{props.course}</h2>
  
  const Content = ({parts}) => (
    <div>
      {parts.map(part =>
       <p key={part.id}>
        {part.name} {part.exercises}
       </p>
       )}
    </div>
  )
  
  const Total = (props) => <p>Number of exercises {props.total}</p>

  export default Course
  