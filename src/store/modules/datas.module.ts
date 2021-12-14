import actions from '../actions'
import { CurrencyService } from '@/services/currency.service'
import { RequestParams } from '@/core/http'
import state from '../state'
import { CountryService } from '@/services/country.service'
import { WareHouseService } from '@/services/warehouse.service'
import { UserService } from '@/services/user.service'
import { CompanyService } from '@/services/company.service'
import { PricelistService } from '@/services/pricelist.service'
import { GeneralCodeService } from '@/services/general_code.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'

export default {
    namespaced: true,
    state: {
        currencyList: [],
        countryList: [],
        warehouseList: [],
        systemUsers: [],
        companyList: [],
        shipTypeList: [],
        mvShipTypeList: [],
        vendorList: [],
        vendorFullNameList: [],
        departmentList: [],
        pickingNeedSave: '',
        titleSuffix: 'Woltu OMS',
        groupbyFlag: 0
    },
    mutations: {
        setCurrency(state, data) {
            state.currencyList = data
        },
        setCountry(state, data) {
            state.countryList = data
        },
        setWarehouse(state, data) {
            state.warehouseList = data
        },
        setSystemuser(state, data) {
            state.systemUsers = data
        },
        setCompany(state, data) {
            state.companyList = data
        },
        setShipType(state, data) {
            state.shipTypeList = data
        },
        setMvShipType(state, data) {
            state.mvShipTypeList = data
        },
        resetParams(state) {
            state.currencyList = []
            state.countryList = []
            state.warehouseList = []
            state.systemUsers = []
            state.companyList = []
            state.shipTypeList = []
            state.mvShipTypeList = []
            state.vendorList = []
            state.vendorFullNameList = []
            state.departmentList = []
        },
        setPickingSaveStatus(state, data) {
            state.pickingNeedSave = data
        },
        setTitleSuffix(state, data) {
            state.titleSuffix = data
        },
        setGroupbyFlag(state, data) {
            state.groupbyFlag = data
        },
        setVendorList(state, data) {
            state.vendorList = data
        },
        setVendorFullNameList(state, data) {
            state.vendorFullNameList = data
        },
        setDepartmentList(state, data) {
            state.departmentList = data
        }
    },
    actions: {
        getcurrency({ state, commit }) {
            if (state.currencyList.length == 0) {
                const pricelistService = new PricelistService()
                pricelistService
                    .getList(new RequestParams())
                    .subscribe(data => {
                        commit('setCurrency', data)
                    })
            }
        },
        getcountry({ state, commit }) {
            if (state.countryList.length == 0) {
                const countryService = new CountryService()
                countryService.getList(new RequestParams()).subscribe(data => {
                    commit('setCountry', data)
                })
            }
        },
        getWarehouse({ state, commit }) {
            if (state.warehouseList.length == 0) {
                const warehouseService = new WareHouseService()
                warehouseService
                    .getAvailable(new RequestParams())
                    .subscribe(data => {
                        commit('setWarehouse', data)
                    })
            }
        },
        getSystemuser({ state, commit }) {
            if (state.systemUsers.length == 0) {
                const userService = new UserService()
                userService.all(new RequestParams()).subscribe(data => {
                    let params = JSON.parse(JSON.stringify(data))
                    let domain = window.location.host
                    if (domain.includes('47.254.148.130:58180')) {
                        params = data.map(x => {
                            let arr = x.name.split('@')
                            if (typeof arr == 'object' && arr.length == 2) {
                                x.name = arr[0]
                            }
                            return x
                        })
                    }
                    commit('setSystemuser', params)
                })
            }
        },
        getcompany({ state, commit }) {
            if (state.companyList.length == 0) {
                const companyService = new CompanyService()
                companyService.getList(new RequestParams()).subscribe(data => {
                    commit('setCompany', data)
                })
            }
        },
        getShipType({ state, commit }) {
            if (state.shipTypeList.length == 0) {
                const generalCodeService = new GeneralCodeService()
                generalCodeService
                    .queryShipType(new RequestParams())
                    .subscribe(data => {
                        commit('setShipType', data)
                    })
            }
        },
        getMvShipType({ state, commit }) {
            if (state.mvShipTypeList.length == 0) {
                const generalCodeService = new GeneralCodeService()
                generalCodeService
                    .queryMvShipType(new RequestParams())
                    .subscribe(data => {
                        commit('setMvShipType', data)
                    })
            }
        },
        getTitleSuffix({ state, commit }) {
            let data = 'Woltu OMS'
            let domain = window.location.host
            if (domain == '47.242.83.231:8888') {
                data = 'WOWOSZ OMS'
            }
            commit('setTitleSuffix', data)
        },
        getVendorList({ state, commit }) {
            if (state.vendorList.length == 0) {
                let inneraction = new InnerActionService()
                const publicService = new PublicService()
                inneraction.setActionAPI(
                    '/vendor/get_vendor_list',
                    CommonService.getMenuCode('vendor-product-manage')
                )
                publicService
                    .query(
                        new RequestParams(
                            {},
                            {
                                innerAction: inneraction
                            }
                        )
                    )
                    .subscribe(data => {
                        commit('setVendorList', data)
                    })
            }
        },
        getVendorFullNameList({ state, commit }) {
            if (state.vendorFullNameList.length == 0) {
                let inneraction = new InnerActionService()
                const publicService = new PublicService()
                inneraction.setActionAPI(
                    '/vendor/get_vendor_full_name_list',
                    CommonService.getMenuCode('vendor-product-manage')
                )
                publicService
                    .query(
                        new RequestParams(
                            {},
                            {
                                innerAction: inneraction
                            }
                        )
                    )
                    .subscribe(data => {
                        commit('setVendorFullNameList', data)
                    })
            }
        },
        getDepartmentList({ state, commit }) {
            if (state.departmentList.length == 0) {
                let inneraction = new InnerActionService()
                const publicService = new PublicService()
                inneraction.setActionAPI(
                    'common/query_department_by_condition',
                    CommonService.getMenuCode('department-management')
                )
                publicService
                    .query(
                        new RequestParams(
                            {
                                query_condition: [
                                    {
                                        query_name: 'dept_type',
                                        operate: 'not in',
                                        value: [10000]
                                    }
                                ]
                            },
                            {
                                innerAction: inneraction
                            }
                        )
                    )
                    .subscribe(data => {
                        commit('setDepartmentList', data)
                    })
            }
        }
    }
}
