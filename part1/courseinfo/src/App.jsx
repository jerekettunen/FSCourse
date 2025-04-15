const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  // Functions
  const Header = (props) => {
    return (
      <div>
        <h1>{props.course.name}</h1>
      </div>
    )
  }
  const Content = (props) => {
    return (
      <div>
        <Part info = {props.course.parts} no = {0}/>
        <Part info = {props.course.parts} no = {1}/>
        <Part info = {props.course.parts} no = {2}/>
      </div>
    )
  }
  const Total = (props) => {
    return (
      <div>
        <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
      </div>
    )
  }
  const Part = (props) => {
    return (
      <div>
        <p>{props.info[props.no].name} {props.info[props.no].exercises}</p>
      </div>
    )
  }

  return (
    <div>
      <Header course = {course}/>
      <Content course = {course}/>
      <Total parts = {course.parts}/>
    </div>
  )
}

export default App