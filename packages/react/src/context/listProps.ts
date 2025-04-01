import { createContext } from 'react'
import { ITableProps } from '../types'

let Context = createContext<ITableProps>(null)

export default Context
