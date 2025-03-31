import { createContext } from 'react'
import { IFilterMode } from '../types'

let Context = createContext<IFilterMode>(null)

export default Context
