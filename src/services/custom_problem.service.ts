import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { CustomProblemController } from '@/config/services/custom_problem.controller'

/**
 * 客户API服务
 */
export class CustomProblemService {
    /**
     * CP查询
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query
    })
    public query(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 产品下拉列表
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_product_drop_list
    })
    public queryProductDropList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 产品下拉列表
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_template_product_drop_list
    })
    public queryTemplateProductDropList(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 客服创建CP
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.save_custom_problem_by_cs
    })
    public csSave(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 仓库创建CP
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.save_custom_problem_by_rt
    })
    public rtSave(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * CP reason 下拉列表集合
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_cp_reason_enum
    })
    public queryCpReasonEnum(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * query_by_order_list
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_by_order_list
    })
    public queryByOrderList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * query_by_order_list
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.get_inital_cp
    })
    public getInitalCP(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * batchInReturnWH
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.batch_in_return_wh
    })
    public batchInReturnWH(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * delete CP
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.delete_cp
    })
    public deleteCP(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * create_cp_pic CP
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.create_cp_pic
    })
    public createCpPic(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * query_all_pic
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_all_pic
    })
    public queryAllPic(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * query_all_pic
     * @param requestParams
     */
    @Request({
        server: CustomProblemController.query_customer_problem_product
    })
    public queryCustomerProblemProduct(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
