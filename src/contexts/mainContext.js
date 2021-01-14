import React, {useReducer} from 'react'
import reducer from '../reducers/main_reducer'
import initialState from '../data/initialState'

export const DataContext = React.createContext()

export const DataProvider = ({children}) => {

  const store = useReducer(reducer, initialState)

  return (
    <DataContext.Provider value={store}>
      {children}
    </DataContext.Provider>
  )
}