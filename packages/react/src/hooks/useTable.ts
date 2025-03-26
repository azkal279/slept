import { useContext, useEffect, useMemo } from 'react'
import ListContext from '../context'
import ListPropsContext from '../context/listProps'
import MultipleContext from '../context/multiple'
import { ListLifeCycleTypes, IListKVMap, IListResponse, IList } from '@alist/core'
import useForceUpdate from './useForceUpdate'
import { ITableProps, ITableHook } from '../types'

export var useTable = (props: ITableProps = {}, propList?: IList): ITableHook => {
    var { pickInitialTableProps, multipleId: propsMultipleId } = props
    var list = propList || useContext(ListContext)
    var { id: contextMultipleId } = useContext(MultipleContext) || {}
    var listProps = useContext(ListPropsContext) || {}
    var multipleId = propsMultipleId || contextMultipleId
    var loading = list ? list.getLoading() : props.loading
    let hideWhenInvalid = listProps.hideWhenInvalid || false
    let dataSource: any[]

    let primaryKey: any

    useMemo(() => {
        // 初始化加载时收集tableProps相关信息
        if (typeof pickInitialTableProps === 'function') {
            var initialTableProps = pickInitialTableProps(props)
            primaryKey = initialTableProps.primaryKey
            list && list.setTableProps(initialTableProps)
        }
    }, [])

    // 多列表实例模式
    if (multipleId !== undefined) {
        var multipleData = list.getMultipleData()
        var { paginationDataList } = multipleData[multipleId] as IListKVMap<IListResponse> || {}
        dataSource = paginationDataList as any [] || []
    } else {
        if (list) {
            dataSource = list.getPaginationDataSource()
        } else {
            dataSource = props.dataSource
        }        
    }
    
    var forceUpdate = useForceUpdate()
    var refresh = (opts) => {
        var { payload } = opts;
        var { notifyId } = payload || {}
        if (notifyId) {
            if (multipleId !== undefined) {
                if (notifyId && notifyId.some(id => id === multipleId)) {
                    forceUpdate()
                }
            } else {
                forceUpdate()
            }
        } else {
            forceUpdate()
        }
    }

    useEffect(() => {
        if (list) {
            var id = list.subscribe(ListLifeCycleTypes.ON_LIST_TABLE_REFRESH, refresh)
            return function cleanup () {
                list.unSubscribe(id)
            }
        }
    }, [list])

    var tableProps = list ? list.getTableProps() : {}

    return {
        tableProps,
        list,
        dataSource,
        loading,
        primaryKey,
        hideWhenInvalid,
    }
}

export default useTable
