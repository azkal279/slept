import { useEva, useList, ListLifeCycleTypes, ITableProps, ITableHook, IListSelectionConfig, ListContext } from '@alist/react'
import { useRef, useContext } from 'react'
import { createNextListActions, setSelectionsByInstance } from '../shared'

var useNextList = (props: ITableProps = {}): ITableHook => {
    var actionsRef = useRef<any>(null)
    var reuseList = useContext(ListContext)
    actionsRef.current = actionsRef.current || props.actions || reuseList || createNextListActions()

    var { implementActions } = useEva({
        actions: actionsRef.current
    })

    var hasRowSelectionCls = 'has-row-selection'

    implementActions({
        setSelections: (ids, records) => {
            setSelectionsByInstance(actionsRef.current, ids, records)
        },
        disableRowSelection: () => {
            var { className = '' } = actionsRef.current.getTableProps()
            actionsRef.current.setSelectionConfig(null)
            actionsRef.current.setTableProps({ // 刷新
                className: className.replace(` ${hasRowSelectionCls}`, ''),
                rowSelection: undefined
            })
        },
        getRowSelection: () => {
            var selectionConfig = actionsRef.current.getSelectionConfig()        
            let config = null
            if (selectionConfig) {
                var dataSource = actionsRef.current.getPaginationDataSource()
                var { ids, allIds, validRecords } = selectionConfig
                config = {
                    ...selectionConfig,
                    allIds,
                    dataSource,
                    selectedAll: (validRecords.length === (ids || []).length) && validRecords.length > 0,
                    selectedNone: (ids || []).length === 0
                }
            }

            return config
        },
        setRowSelection: (selectionConfig: IListSelectionConfig) => {
            actionsRef.current.setSelectionConfig(selectionConfig)
            var config = actionsRef.current.getSelectionConfig()
            var { className = '', primaryKey: defaultPrimaryKey } = actionsRef.current.getTableProps()
            if (config) {                    
                var { mode, ids, primaryKey = defaultPrimaryKey, getProps, ...others } = config
                actionsRef.current.setTableProps({ // 刷新
                    className: className.indexOf(hasRowSelectionCls) !== -1 ? className : `${className} ${hasRowSelectionCls}`,
                    rowSelection: {
                        ...others,
                        mode,
                        selectedRowKeys: ids,
                        primaryKey,
                        onSelect: (selected, record, records) => {
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT, {
                                selected, record, records
                            })
                        },
                        onSelectAll: (selected, records) => {
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT_ALL, {
                                selected, records
                            })
                        },
                        onChange: (changeIds: string[], records: any[]) => {
                            actionsRef.current.setSelectionConfig({
                                ids: changeIds,
                                records,
                            })
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT_CHANGE, {
                                ids: changeIds, records
                            })
                            var { rowSelection } = actionsRef.current.getTableProps()
                            actionsRef.current.setTableProps({
                                rowSelection: {
                                    ...rowSelection,
                                    selectedRowKeys: changeIds,
                                }
                            })
                        },
                        getProps,
                    }
                })
            } else {
                actionsRef.current.setTableProps({ // 刷新
                    className: className.replace(` ${hasRowSelectionCls}`, ''),
                    rowSelection: undefined
                })
            }
        }
    })
    var { effects } = props

    return {
        actions: actionsRef.current,
        list: useList({
            ...props,
            actions: actionsRef.current,
            effects: ($, actions) => {
                if (typeof effects === 'function') {
                    effects($, actions)
                }
            }
        })
    }
}

export default useNextList
