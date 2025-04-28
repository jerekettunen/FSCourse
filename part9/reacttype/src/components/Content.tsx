import Part from "./Part";
import { CoursePart } from "../App";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {

  return (
    <div>
      {courseParts.map((course, index) =>(
        <Part key={index} course={course} />
      ))}
    </div>
  )
}
export default Content;