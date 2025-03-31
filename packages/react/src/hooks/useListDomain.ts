import { useMemo } from 'react'
import { ListDomain } from '../shared'

export let useListDomain = () => {
    let listDomain = useMemo(() => {
        return new ListDomain()
    }, [])
    return listDomain
}

export default useListDomain
