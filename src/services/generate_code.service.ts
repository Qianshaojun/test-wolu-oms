import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { GenerateCodeController } from '@/config/services/generate_code.controller'

/**
 * 订单API服务
 */
export class GeneralCodeService {
    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.query_all_code_list
    })
    public queryAllCodeList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.query_select_code
    })
    public querySelectCode(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.create_product_generate_code
    })
    public createProductGenerateCode(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.create_mix_product_generate_code
    })
    public createMixProductGenerateCode(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.query_category_list
    })
    public queryCategoryList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.query_color_list
    })
    public queryColorList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GenerateCodeController.delete_code
    })
    public deleteCode(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
