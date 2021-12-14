import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { ShipmentController } from '@/config/services/shipment.controller'

/**
 * 产品API服务
 */
export class ShipmentService {
    /**
     * 物流类型查询
     * @param requestParams
     */
    @Request({
        server: ShipmentController.query_all_ship_type
    })
    public queryAllShipType(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 物流类型保存
     * @param requestParams
     */
    @Request({
        server: ShipmentController.save_ship_type
    })
    public saveShipType(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取发送RT邮件数据
     * @param requestParams
     */
    @Request({
        server: ShipmentController.getSendData
    })
    public getSendData(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * done_picking_get_shipping_label
     * @param requestParams
     */
    @Request({
        server: ShipmentController.done_picking_get_shipping_label
    })
    public donePickingGetLabel(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * done_picking_get_shipping_label
     * @param requestParams
     */
    @Request({
        server: ShipmentController.delete_shipment_order
    })
    public deleteShipmentOrder(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * done_picking_get_shipping_label
     * @param requestParams
     */
    @Request({
        server: ShipmentController.query_all_shipment
    })
    public getShipmentList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }    
}
