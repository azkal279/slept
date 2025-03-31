import { useContext, useEffect, useRef } from 'react'
import ListContext from '../context'
import { ListLifeCycleTypes, IList } from '@alist/core'
import useForceUpdate from '../hooks/useForceUpdate'
import { IFilterHook, IFilterProps } from '../types'

export let useFilter = (props: IFilterProps, propsList?: IList): IFilterHook => {
    let filterRef = useRef(props.form || null)
    let { useForm, effects, mirror } = props
    let list = propsList || useContext(ListContext)
    let filterProps = list.getFilterProps()
    let latestInstance = list.getFilterInstance()
    let mirrorProps: any = mirror ? { value: latestInstance.getFormState(state => state.values) } : {}

    let filterInstance = useForm({
        ...mirrorProps,
        ...props,
        ...filterProps,
        form: filterRef.current,
        effects: list.getFilterEffects({ effects: mirror ? latestInstance.originalEffects : effects }),
    })

    if (mirror && !filterRef.current) {
        list.appendMirrorFilterInstance(filterInstance)
    }
    
    filterRef.current = filterRef.current || filterInstance
    if (!latestInstance) {
        filterInstance.originalEffects = effects
        list.setFilterInstance(filterInstance)
    }

    useEffect(() => {
        if (mirror) {
            let idMirror = filterInstance.subscribe(({ type, payload }) => {
                if (type === 'onFieldChange') {
                    let fieldState = payload.getState()
                    let { name, value, props, values, editable } = fieldState
                    latestInstance.setFieldState(name, state => {
                        state.value = value
                        state.values = values
                        state.editable = editable
                        state.props = props
                    })
                }
            })
            return function cleanup() {
                filterInstance.unsubscribe(idMirror)
            }
        }        
    }, [])

    let forceUpdate = useForceUpdate()
    let refresh = () => {
        forceUpdate()
    }

    useEffect(() => {
        let id = list.subscribe(ListLifeCycleTypes.ON_LIST_FILTER_REFRESH, refresh)
        return function cleanup() {
            list.unSubscribe(id)
        }
    }, [])

    return {
        list,
        filterInstance,
    }
}

export default useFilter
