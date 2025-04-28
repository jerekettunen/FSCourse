import { CoursePart } from "../App";

const Part = ({course}: {course: CoursePart}) => {
  switch (course.kind) {
    case "basic":
      return (
      <div style={{ lineHeight: "0.5" }}>
        <h3 style={{ paddingTop: "5px" }}>
        {course.name} <span style={{ marginLeft: "8px" }}>{course.exerciseCount}</span>
        </h3>
        <p><i>{course.description}</i></p>
      </div>
      );
    case "group":
      return (
      <div style={{ lineHeight: "0.5" }}>
        <h3 style={{ paddingTop: "5px" }}>
        {course.name} <span style={{ marginLeft: "8px" }}>{course.exerciseCount}</span>
        </h3>
        <p>Group Projects: {course.groupProjectCount}</p>
      </div>
      );
    case "background":
      return (
      <div style={{ lineHeight: "0.5" }}>
        <h3 style={{ paddingTop: "5px" }}>
        {course.name} <span style={{ marginLeft: "8px" }}>{course.exerciseCount}</span>
        </h3>
        <p><i>{course.description}</i></p>
        <p>
        Background Material:{" "}
        <a href={course.backgroundMaterial}>{course.backgroundMaterial}</a>
        </p>
      </div>
      );
    case "special":
      return (
      <div style={{ lineHeight: "0.5" }}>
        <h3 style={{ paddingTop: "5px" }}>
        {course.name} <span style={{ marginLeft: "8px" }}>{course.exerciseCount}</span>
        </h3>
        <p><i>{course.description}</i></p>
        <p>Requirements: {course.requirements.join(", ")}</p>
      </div>
      );
    default:
      return null;
  }
}

export default Part;
