export default {
    namespaced: true,
    state: {
        instanceEditParams: [],
        sellerEditParams: [],
        orderEditParams: [],
        invoiceEditParams: [],
        vendorDetailParams: [],
        replenishEditParams: [],
        vendorProductDetailParams: [],
        purchaseContractParams: [],
        shipContractParams: [],
        purchasePackageParams: [],
        commonPageInfo: []
    },
    mutations: {
        changeInstance(state, data) {
            state.instanceEditParams = data
        },
        changeSeller(state, data) {
            state.sellerEditParams = data
        },
        changeOrder(state, data) {
            state.orderEditParams = data
        },
        changeInvoice(state, data) {
            state.invoiceEditParams = data
        },
        changeVendor(state, data) {
            state.vendorDetailParams = data
        },

        changeReplenish(state, data) {
            state.replenishEditParams = data
        },
        changeVendorProduct(state, data) {
            state.vendorProductDetailParams = data
        },
        changePurchaseContract(state, data) {
            state.purchaseContractParams = data
        },
        changeShipContract(state, data) {
            state.shipContractParams = data
        },
        changePurchasePackage(state, data) {
            state.purchasePackageParams = data
        },
        addCommonPageInfo(state, data) {
            let item = state.commonPageInfo.find(x => x.index == data.index)
            if (!item) {
                state.commonPageInfo.push(data)
            } else {
                item.info = data.info
            }
        },
        resetCommonPageInfo(state, data) {
            state.commonPageInfo = data
        },
        resetPageParams(state) {
            state.instanceEditParams = []
            state.sellerEditParams = []
            state.orderEditParams = []
            state.invoiceEditParams = []
            state.vendorDetailParams = []
            state.replenishEditParams = []
            state.vendorProductDetailParams = []
            state.purchaseContractParams = []
            state.shipContractParams = []
            state.purchasePackageParams = []
            state.commonPageInfo = []
        }
    }
}
