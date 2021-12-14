<template>
    <a-table
        :dataSource="logs"
        style="table-layout:fixed;"
        rowKey="log_content"
        :pagination="false"
        bordered
    >
        <a-table-column
            :title="$t('columns.log_content')"
            key="log_content"
            data-index="log_content"
            align="left"
            width="40%"
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { OperateLogService } from '~/services/operatelog.service'
import { Mutation, namespace } from 'vuex-class'
import store from '~/store'

@Component({
    components: {}
})
export default class LogView extends Vue {
    @Prop()
    object_name: any

    @Prop()
    record_code: any

    @Prop({ default: false })
    is_special_table: any

    private systemUsers: any = []

    private logs: any[] = []

    private loadingService = new LoadingService()
    private operateLogService = new OperateLogService()

    @Watch('record_code')
    onRecordCodeChange() {
        this.getLogs()
    }

    private created() {
        store.dispatch('datasModule/getSystemuser')
        this.getLogs()
    }

    private getLogs() {
        let params: any = {
            object_name: this.object_name,
            record_code: this.record_code.toString()
        }

        if (this.is_special_table) {
            params['is_special_table'] = true
        }
        this.operateLogService
            .viewUserOperateChangedLog(
                new RequestParams(params, { loading: this.loadingService })
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
       "IP":"IP"
    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "log_content":"内容",
       "log_type":"类型",
       "who_log":"修改人",
       "log_date":"修改时间",
       "IP":"IP"
    }
  }
}
</i18n>
