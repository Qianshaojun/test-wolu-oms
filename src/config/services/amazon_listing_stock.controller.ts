import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'amazon_listing_stock'

/**
 * API接口配置
 * 订单服务配置
 */
export const AmazonListingStockController: ControllerConfig = {
    // Merge User
    mergeUser: {
        controller,
        action: 'merge_user',
        type: RequestMethod.Post
    },
    // Merge Auto
    mergeAuto: {
        controller,
        action: 'merge_auto',
        type: RequestMethod.Post
    },
    // Cancel Auto
    cancelAuto: {
        controller,
        action: 'cancel_auto',
        type: RequestMethod.Post
    },
    // save
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    //  Query All Listing
    queryAll: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // Query SingleListing
    querySingleListing: {
        controller,
        action: 'query_single_listing',
        type: RequestMethod.Post
    }
}
