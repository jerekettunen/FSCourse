interface TotalProps {
  total: number;
}

const Total = (props: TotalProps) => {
  return (
    <div>
      <h2>Total of {props.total} exercises</h2>
    </div>
  );
}
export default Total;