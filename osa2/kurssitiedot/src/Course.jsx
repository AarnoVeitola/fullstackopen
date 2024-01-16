const Header = (props) => {
    return (
      <h1>{props.course.name}</h1>
    )
  }
  
const Part = (props) => {
return (
    <p>
    {props.part} {props.exercise}
    </p>
)
}

const Content = ({ parts }) => {
console.log(parts)
return (
    <>
    {parts.map(part => 
        <Part key={part.name} part={part.name} exercise={part.exercises} />
    )}
    </>
)
}

const Total = ({ exercises }) => {
return (
    <b>
    total of {exercises.reduce((a, b) => a + b, 0)} exercises
    </b>
)
}

const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total exercises={course.parts.map(part => part.exercises)} />
      </div>
    )
}

export default Course