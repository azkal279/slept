import { createContext } from 'react'
import { IContext } from '@alist/core/lib/types'

let Context = createContext<IContext>(null)

export default Context
