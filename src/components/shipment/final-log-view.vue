<template>
    <section class="component data-table">
        <span style="float:right;margin-top:-40px;">
            <a-button type="primary" @click="exportLog">导出日志</a-button>
        </span>
        <a-table
            :dataSource="logs"
            style="table-layout:fixed;"
            rowKey="log_content"
            bordered
        >
            <a-table-column
                :title="$t('columns.log_content')"
                key="log_content"
                data-index="log_content"
                align="left"
                :ellipsis="true"
                width="30%"
            ></a-table-column>
            <a-table-column
                :title="$t('columns.instance')"
                key="instance"
                data-index="instance"
                align="center"
                width="10%"
            ></a-table-column>
            <a-table-column
                :title="$t('columns.log_type')"
                key="log_type"
                data-index="log_type"
                align="center"
                width="15%"
            ></a-table-column>
            <a-table-column
                :title="$t('columns.who_log')"
                key="who_log"
                data-index="who_log"
                align="center"
                width="15%"
            ></a-table-column>
            <a-table-column
                :title="$t('columns.log_date')"
                key="log_date"
                align="center"
                width="20%"
            >
                <template slot-scope="row">
                    {{ row.log_date }}
                </template>
            </a-table-column>
            <a-table-column
                title="IP"
                key="log_ip"
                data-index="log_ip"
                align="left"
            >
            </a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { OperateLogService } from '~/services/operatelog.service'
import { Mutation, namespace } from 'vuex-class'
import store from '~/store'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { XLSXUtil } from '../../shared/utils/xlsx.util'

@Component({
    components: {}
})
export default class FinalLogView extends Vue {
    @Prop()
    sku: any

    @Prop({ default: 0 })
    cnt: any

    @Prop()
    warehouse: any

    @Prop()
    pageName: any

    @Prop({ default: false })
    is_special_table: any

    private systemUsers: any = []

    private logs: any[] = []

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @Watch('record_code')
    onRecordCodeChange() {
        this.getLogs()
    }

    @Watch('cnt')
    onCntChange() {
        this.getLogs()
    }

    private created() {
        store.dispatch('datasModule/getSystemuser')
        this.getLogs()
    }

    private getLogs() {
        let params: any = {
            sku: this.sku,
            warehouse: this.warehouse
        }

        if (this.is_special_table) {
            params['is_special_table'] = true
        }
        this.innerAction.setActionAPI(
            'theoretical_final_freight/query_log',
            CommonService.getMenuCode(this.pageName)
        )
        this.publicService
            .query(
                new RequestParams(params, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    let users: any = store.state.datasModule.systemUsers
                    for (var item of data) {
                        var sysuser = users.find(x => x.code === item.who_log)
                        item['who_log'] = sysuser ? sysuser.name : item.who_log
                        let localTime = moment.utc(item['log_date']).toDate()
                        item['log_date'] = moment(localTime).format(
                            'YYYY-MM-DD HH:mm'
                        )
                    }
                    this.logs = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private exportLog() {
        if (!this.logs.length) {
            this.$message.error('日志数据为空')
            return
        }
        const xlsxUtil = new XLSXUtil()
        let columnList: any = {
            log_content: 'log_content',
            instance: 'instance',
            log_type: 'log_type',
            who_log: 'who_log',
            log_date: 'log_date',
            log_ip: 'log_ip'
        }
        let params: any = []
        let widths: any = []
        let fileName: any = 'log_file.xlsx'
        let _that = this
        for (let i in columnList) {
            widths.push(20)
        }

        params = _that.logs.map(x => {
            let rows: any = {}
            for (let k in columnList) {
                let vl: any = x[k]
                if (
                    x[k] != null &&
                    typeof x[k] == 'object' &&
                    x[k][1] != undefined
                ) {
                    vl = x[k][1]
                }
                rows[k] = vl
            }
            return rows
        })

        xlsxUtil.readFromJson(columnList, params, widths)
        xlsxUtil.exportFile(fileName)
    }
}
</script>
<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "log_content":"Content",
       "log_type":"Type",
       "who_log":"CreateUser",
       "log_date":"logDate",
       "IP":"IP",
       "instance":"Instance"
    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "log_content":"内容",
       "log_type":"类型",
       "who_log":"修改人",
       "log_date":"修改时间",
       "IP":"IP",
       "instance":"站点"
    }
  }
}
</i18n>
