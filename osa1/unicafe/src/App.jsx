import { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, bad, neutral }) => {
  const total = good + neutral + bad
  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={total} />
        <StatisticsLine text="average" value={(good - bad) / total} />
        <StatisticsLine text="positive" value={good / total * 100 + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    console.log("Number of goods", good + 1)
    setGood(good + 1)
  }

  const addNeutral = () => {
    console.log("Number of neutrals", neutral + 1)
    setNeutral(neutral + 1)
  }

  const addBad = () => {
    console.log("Number of bads", bad + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' handleClick={addGood} />
      <Button text='neutral' handleClick={addNeutral} />
      <Button text='bad' handleClick={addBad} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}  />
    </div>
  )
}

export default App