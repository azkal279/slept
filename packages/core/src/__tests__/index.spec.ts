import createList from '../index'

describe('createList', () => {
    test('base', () => {
      let actions = createList()
      let apiList = [
        "notify",
        "subscribe",
        "unSubscribe",
        "on",
        "removeListener",
        "refresh",
        "setLoading",
        "getLoading",
        "setValidateConfig",
        "getValidateConfig",                        
        "setUrl",
        "getUrl",               
        "setQuery",
        "getParams",
        "setParams",
        "getFilterEffects",
        "search",
        "clear",
        "reset",
        "setCurrentPage",
        "setPageSize",
        "getSelectionConfig",
        "setSelectionConfig",
        "disableSelectionConfig",
        "getSelections",
        "getEmptyStatus",
        "getTableProps",
        "setTableProps",
        "setPaginationDataSource",
        "getPaginationDataSource",
        "getSortConfig",
        "setSortConfig",
        "getMode",
        "getPageData",
        "setPageData",
        "getFilterData",
        "setFilterData",
        "getFilterProps",
        "getFilterInstance",
        "setFilterInstance",
        "setFormState",
        "getFormState",
        "setFieldState",
        "getFieldState",
        "getDataSource",
        "setDataSource",        
        "getMultipleData",
        "setMultipleData",
        "setMultiplePageSize",
        "getExpandStatus",
        "toggleExpandStatus",
        "appendMirrorFilterInstance",
        "getMirrorFilterInstanceList",
        "initSyncFilterData",
        "setResponseData",
        "getResponseData",
        "getAllColumns",
        "setAllColumns",
        "setColumns",
        "getColumns",
        "setEmptyStatus",
        "hasSetColumns"
      ]
      expect(Object.keys(actions)).toEqual(apiList)
    })
})

describe('lifecycles', () => {
  test('lifecycles', () => {
  })
})

describe('pagination', () => {
  test('get pagination', () => {
    let actions = createList()
    let pageData = actions.getPageData()
    expect(pageData).toEqual({
      pageSize: 10,
      currentPage: 1,
      total: 0,
      totalPages: 0
    })
  })

  test('set pagination', () => {
    let actions = createList()
    let data = {
      pageSize: 10,
      currentPage: 2,
      total: 50,
    }
    actions.setPageData(data)
    let pageData = actions.getPageData()
    expect(pageData).toEqual({
      ...data,
      totalPages: 0
    })
  })

  test('set currentPage', () => {
  })
})

describe('on', () => {
  test('on', () => {
  })
})

describe('dataSource', () => {
  test('get dataSource', () => {
    let actions = createList()
    let dataSource = actions.getDataSource()
    expect(dataSource).toEqual([])
  })

  test('set dataSource', () => {
    let actions = createList()
    let data = [{ id: 1, data: 1 }, { id: 2, data: 2 }]
    actions.setDataSource(data)
    let dataSource = actions.getDataSource()
    expect(dataSource).toEqual(data)
  })
})

describe('multipleData', () => {
  test('get multipleData', () => {
    let actions = createList()
    let multipleData = actions.getMultipleData()
    expect(multipleData).toEqual({})
  })

  test('set multipleData', () => {
    let actions = createList()
    let data = { list1: [], list2: [] }
    actions.setMultipleData(data)
    let multipleData = actions.getMultipleData()
    expect(multipleData).toEqual({
      "list1":  {
        "currentPage": 1,
        "dataList": [],
        "pageSize": 10,
        "paginationDataList": [],
        "total": 0,
        "totalPages": 0,
      },
      "list2":  {
        "currentPage": 1,
        "dataList": [],
        "pageSize": 10,
        "paginationDataList": [],
        "total": 0,
        "totalPages": 0,
      }
  })
  })
})

describe('clear', () => {
  test('clear', () => {
    
  })
})

describe('reset', () => {
  test('reset', () => {
    
  })
})

describe('refresh', () => {
  test('refresh', () => {
    
  })
})

describe('search', () => {
  test('search', () => {
    
  })
})

describe('setLoading', () => {
  test('setLoading', () => {
    
  })
})

describe('setUrl', () => {
  test('setUrl', () => {
    
  })
})

describe('setQuery', () => {
  test('setQuery', () => {
    
  })
})

describe('params', () => {
  test('get params', () => {
    
  })

  test('set params', () => {
    
  })
})

describe('filterData', () => {
  test('get filterData', () => {
    let actions = createList()
    let filterData = actions.getFilterData()
    expect(filterData).toEqual({})
  })

  test('set filterData', () => {
    // let actions = createList()
    // let data = { username: 'abc' }
    // actions.setFilterData(data)
    // let filterData = actions.getFilterData()
    // expect(filterData).toEqual(data)
  })
})
