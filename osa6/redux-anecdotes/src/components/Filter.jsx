import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    event.preventDefault()
    const filter = event.target.value
    console.log(filter)
    dispatch(filterChange(filter))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input 
        onChange={handleChange}
        name="filter"
        />
    </div>
  )
}

export default Filter