import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { VendorController } from '@/config/services/vendor.controller'

/**
 * 仓库API服务
 */
export class VendorService {
    /**
     * 可用销售代表查询
     * @param requestParams
     */
    @Request({
        server: VendorController.get_vendor_ref_list
    })
    public get_vendor_ref_list(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存供应商
     * @param requestParams
     */
    @Request({
        server: VendorController.save_vendor
    })
    public save_vendor(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
