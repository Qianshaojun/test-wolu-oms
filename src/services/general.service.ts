import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { GeneralController } from '@/config/services/general.controller'

/**
 * 订单API服务
 */
export class GeneralService {
    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GeneralController.query_picking_need_resend
    })
    public queryResendMemo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 语言列表 id->code
     * @param requestParams
     */
    @Request({
        server: GeneralController.queryLangList
    })
    public queryLangList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询表对应的所有列
     * @param requestParams
     */
    @Request({
        server: GeneralController.query_table_schema
    })
    public query_table_schema(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询表对应的所有模板
     * @param requestParams
     */
    @Request({
        server: GeneralController.query_table_schema_export_template
    })
    public query_table_schema_export_template(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 导出模板对应的列
     * @param requestParams
     */
    @Request({
        server: GeneralController.query_table_schema_export_template_column
    })
    public query_table_schema_export_template_column(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存导出模板
     * @param requestParams
     */
    @Request({
        server: GeneralController.save_table_schema_export_template
    })
    public save_table_schema_export_template(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除导出模板
     * @param requestParams
     */
    @Request({
        server: GeneralController.delete_table_schema_export_template
    })
    public delete_table_schema_export_template(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
