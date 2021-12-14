import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { AmazonListingStockController } from '@/config/services/amazon_listing_stock.controller'

/**
 * 订单API服务
 */
export class AmazonListingStockService {
    /**
     * Merge user
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.mergeUser
    })
    public mergeUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Merge auto
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.mergeAuto
    })
    public mergeAuto(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Cancel auto
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.cancelAuto
    })
    public cancelAuto(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * save
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Query All Listing
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.queryAll
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Query All Listing
     * @param requestParams
     */
    @Request({
        server: AmazonListingStockController.querySingleListing
    })
    public querySingleListing(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
