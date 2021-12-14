<template>
    <section class="component customer-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 19, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="22">
                    <a-form-item :label="$t('columns.group_name')" required>
                        <a-input
                            v-decorator="[
                                `email_group_name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.lang_id')" required>
                        <a-select
                            v-decorator="[
                                'lang_id',
                                {
                                    rules: rules.required
                                }
                            ]"
                            style="width: 120px;"
                            size="small"
                            placeholder="PLZ Select"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of langList"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.recv_email')" required>
                        <a-select
                            showSearch
                            :filterOption="filterSelectOption"
                            mode="multiple"
                            style="width: 100%"
                            :placeholder="$t('columns.recv_email_list')"
                            v-decorator="[
                                'recv_email_list',
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of recvEmailList"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.ticket_type_id')" required>
                        <a-select
                            showSearch
                            :filterOption="filterSelectOption"
                            mode="multiple"
                            style="width: 100%"
                            :placeholder="$t('columns.ticket_type_id')"
                            v-decorator="[
                                'ticket_type_ids',
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of ticketType"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.allot_customer')">
                        <a-checkbox-group
                            :options="daysOptions"
                            v-model="checkedValues"
                            @change="onDaysChange"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.memo')">
                        <a-textarea
                            rows="3"
                            v-decorator="['memo']"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div>
            <a-alert
                type="error"
                :message="errorMessage"
                banner
                v-show="errorMessage"
            />
            <a-button size="small" @click="addRule" style="margin-bottom:10px"
                >{{ $t('actions.add') }}
            </a-button>

            <a-table
                :dataSource="ruleData"
                rowKey="index"
                :customRow="
                    rowKey => ({
                        on: {
                            // 单击每行
                            click: () => {
                                currentRow = rowKey.index
                            }
                        }
                    })
                "
                bordered
                :scroll="{ x: '200%' }"
            >
                <a-table-column
                    title="ID"
                    dataIndex="id"
                    key="id"
                    width="8%"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.cs_group_name')"
                    key="status"
                    width="20%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-select
                            v-if="currentRow == row.index"
                            v-decorator="['cs_group_name']"
                            :value="row.cs_group_name"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '5%' }"
                            size="small"
                            @change="e => onRowChange(row, 'cs_group_name', e)"
                        >
                            <a-select-option
                                v-for="i of csGroup"
                                :key="i.code"
                                :value="i.code"
                            >
                                {{ i.code }}
                            </a-select-option>
                        </a-select>
                        <span v-else>
                            {{ row.cs_group_name }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.allot_user')"
                    key="user_id"
                    align="center"
                    width="20%"
                >
                    <template slot-scope="row">
                        <a-select
                            v-if="currentRow == row.index"
                            v-decorator="['user_id']"
                            :value="row.user_id"
                            :style="{ width: '100%' }"
                            :dropdown-match-select-width="false"
                            :dropdown-style="{ width: '10%' }"
                            size="small"
                            @change="e => onRowChange(row, 'user_id', e)"
                            showSearch
                            :filterOption="filterSelectOption"
                        >
                            <a-select-option
                                v-for="i of row.users"
                                :key="i.code"
                                :value="i.code"
                            >
                                {{ i.name }}
                            </a-select-option>
                        </a-select>
                        <span v-else>{{
                            row.user_id | dict2(customerList)
                        }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.mon_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            style="width:100%"
                            v-if="currentRow == row.index"
                            v-decorator="['mon_allot_ratio']"
                            :value="row.mon_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'mon_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.mon_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.mon_member_ratio')"
                    key="mon_member_ratio"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['mon_member_ratio']"
                            :value="row.mon_member_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.mon_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.mon_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['mon_cs_ratio']"
                            :value="row.mon_cs_ratio"
                            size="small"
                            :min="1"
                            style="width:100%"
                            disabled
                        />
                        <span v-else>{{ row.mon_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.tue_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['tue_allot_ratio']"
                            :value="row.tue_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            style="width:100%"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'tue_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.tue_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.tue_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['tue_member_ratio']"
                            :value="row.tue_member_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.tue_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.tue_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['tue_cs_ratio']"
                            :value="row.tue_cs_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.tue_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.wen_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['wen_allot_ratio']"
                            :value="row.wen_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            :formatter="limitNumber"
                            style="width:100%"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'wen_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.wen_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.wen_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['wen_member_ratio']"
                            :value="row.wen_member_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.wen_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.wen_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['wen_cs_ratio']"
                            :value="row.wen_cs_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.wen_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.thur_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['thur_allot_ratio']"
                            :value="row.thur_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            style="width:100%"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'thur_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.thur_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.thur_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['thur_member_ratio']"
                            :value="row.thur_member_ratio"
                            size="small"
                            :min="1"
                            style="width:100%"
                            disabled
                        />
                        <span v-else>{{ row.thur_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.thur_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['thur_cs_ratio']"
                            :value="row.thur_cs_ratio"
                            size="small"
                            :min="1"
                            style="width:100%"
                            disabled
                        />
                        <span v-else>{{ row.thur_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.fri_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['fri_allot_ratio']"
                            :value="row.fri_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            style="width:100%"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'fri_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.fri_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.fri_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['fri_member_ratio']"
                            :value="row.fri_member_ratio"
                            size="small"
                            :min="1"
                            disabled
                            style="width:100%"
                        />
                        <span v-else>{{ row.fri_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.fri_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['fri_cs_ratio']"
                            :value="row.fri_cs_ratio"
                            size="small"
                            :min="1"
                            style="width:100%"
                            disabled
                        />
                        <span v-else>{{ row.fri_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sat_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['sat_allot_ratio']"
                            :value="row.sat_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            style="width:100%"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'sat_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.sat_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sat_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['sat_member_ratio']"
                            :value="row.sat_member_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.sat_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sat_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['sat_cs_ratio']"
                            :value="row.sat_cs_ratio"
                            size="small"
                            :min="1"
                            style="width:100%"
                            disabled
                        />
                        <span v-else>{{ row.sat_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sun_allot_ratio')"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a-input-number
                            v-if="currentRow == row.index"
                            v-decorator="['sun_allot_ratio']"
                            :value="row.sun_allot_ratio"
                            size="small"
                            :min="0"
                            :precision="0"
                            style="width:100%"
                            :formatter="limitNumber"
                            :parser="limitNumber"
                            @change="
                                e => onRowChange(row, 'sun_allot_ratio', e)
                            "
                        />
                        <span v-else>{{ row.sun_allot_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sun_member_ratio')"
                    width="14%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['sun_member_ratio']"
                            :value="row.sun_member_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.sun_member_ratio }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.sun_cs_ratio')"
                    width="12%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-input
                            v-if="currentRow == row.index"
                            v-decorator="['sun_cs_ratio']"
                            :value="row.sun_cs_ratio"
                            size="small"
                            style="width:100%"
                            :min="1"
                            disabled
                        />
                        <span v-else>{{ row.sun_cs_ratio }}</span>
                    </template>
                </a-table-column>
                <!--                <a-table-column-->
                <!--                    :title="$t('columns.member_ratio')"-->
                <!--                    key='member_ratio'-->
                <!--                    width='14%'-->
                <!--                    align='center'-->
                <!--                >-->
                <!--                    <template slot-scope='row'>-->
                <!--                        <a-input-->
                <!--                            v-if='currentRow == row.index'-->
                <!--                            v-decorator="['member_ratio']"-->
                <!--                            :value='row.member_ratio'-->
                <!--                            size='small'-->
                <!--                            :min='1'-->
                <!--                            disabled-->
                <!--                        />-->
                <!--                        <span v-else>{{ row.member_ratio }}</span>-->
                <!--                    </template>-->
                <!--                </a-table-column>-->
                <!--                <a-table-column-->
                <!--                    :title="$t('columns.cs_ratio')"-->
                <!--                    key='cs_ratio'-->
                <!--                    width='12%'-->
                <!--                    align='center'-->
                <!--                >-->
                <!--                    <template slot-scope='row'>-->
                <!--                        <a-input-->
                <!--                            v-if='currentRow == row.index'-->
                <!--                            v-decorator="['cs_ratio']"-->
                <!--                            :value='row.cs_ratio'-->
                <!--                            size='small'-->
                <!--                            :min='1'-->
                <!--                            disabled-->
                <!--                        />-->
                <!--                        <span v-else>{{ row.cs_ratio }}</span>-->
                <!--                    </template>-->
                <!--                </a-table-column>-->
                <a-table-column
                    :title="$t('columns.status')"
                    width="15%"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-select
                            v-if="currentRow == row.index"
                            v-decorator="['status']"
                            :value="row.status"
                            style="width: 100%"
                            size="small"
                            @change="e => onRowChange(row, 'status', e)"
                        >
                            <a-select-option
                                v-for="i of $dict.EmailGroupStatus"
                                :key="i.value"
                                :value="i.value"
                            >
                                {{ $t(i.label) }}
                            </a-select-option>
                        </a-select>
                        <span style="color:red" v-else-if="row.status == 60">
                            {{
                                row.status
                                    | dict('EmailGroupStatus')
                                    | translate
                            }}
                        </span>
                        <span v-else>
                            {{
                                row.status
                                    | dict('EmailGroupStatus')
                                    | translate
                            }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.operate')"
                    key="action"
                    align="center"
                    width="15%"
                >
                    <template slot-scope="row">
                        <a @click="onDelete(row)">
                            {{ $t('actions.delete') }}
                        </a>
                        <a @click="e => onCancel(e)">
                            {{ $t('actions.cancel') }}
                        </a>
                    </template>
                </a-table-column>
            </a-table>
        </div>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('actions.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('actions.submit') }}
            </a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import PageContainer from '../../shared/components/page-container.vue'
import { CustomerService } from '../../services/customer.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import moment from 'moment'
import { HelpdeskService } from '../../services/helpdesk.service'
import UUID from 'uuidjs'
import { MailService } from '../../services/mail.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class EmailGroupEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private saveFlag

    @Prop()
    private info

    @Prop()
    private langList

    @Prop()
    private customerList

    @Prop()
    private recvEmailList

    @Prop()
    private csGroup

    private form: any

    // 分页服务
    private pageService = new PageService()

    private customerService = new CustomerService()

    private loadingService = new LoadingService()

    private helpdeskService = new HelpdeskService()

    private mailService = new MailService()

    private data: any[] = []

    private ruleData: any[] = []

    private ticketType: any = []

    private ticketDict: any = []

    private index: any = 0

    private moment = moment

    private id: any = 0

    private errorMessage: any = ''

    private currentRow: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.getTicketTypeList()
        this.form = this.$form.createForm(this)
    }

    public mounted() {
        this.id = this.info ? this.info.id : 0
        if (this.info) {
            this.ruleData = this.info.allot_ratio_details.map(x => {
                let group: any = this.csGroup.find(
                    i => i.code == x.cs_group_name
                )
                x['save_flag'] = 1
                x['index'] = UUID.generate()

                x['mon_cs_ratio'] = ''
                x['tue_cs_ratio'] = ''
                x['wen_cs_ratio'] = ''
                x['thur_cs_ratio'] = ''
                x['fri_cs_ratio'] = ''
                x['sat_cs_ratio'] = ''
                x['sun_cs_ratio'] = ''

                x['mon_member_ratio'] = ''
                x['tue_member_ratio'] = ''
                x['wen_member_ratio'] = ''
                x['thur_member_ratio'] = ''
                x['fri_member_ratio'] = ''
                x['sat_member_ratio'] = ''
                x['sun_member_ratio'] = ''

                x['users'] = group
                    ? this.customerList.filter(y => group.name.includes(y.code))
                    : this.customerList
                return x
            })

            this.refreshData()
        } else {
            this.checkedValues = [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday'
            ]
        }
    }

    //限制数字输入框只能输入整数
    private limitNumber(value) {
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(/\./g, '') : 0
        } else {
            return 0
        }
    }

    private getTicketTypeList() {
        this.mailService.query_ticket_type(new RequestParams()).subscribe(
            data => {
                this.ticketType = data
                for (let i of data) {
                    this.ticketDict[i.code] = i.name
                }
            },
            err => {
                this.$message.error(err.message)
            }
        )
    }

    private daysOptions: any[] = [
        { label: this.$t('columns.mon'), value: 'monday' },
        { label: this.$t('columns.tus'), value: 'tuesday' },
        { label: this.$t('columns.wed'), value: 'wednesday' },
        { label: this.$t('columns.thes'), value: 'thursday' },
        { label: this.$t('columns.fri'), value: 'friday' },
        { label: this.$t('columns.sat'), value: 'saturday' },
        { label: this.$t('columns.sun'), value: 'sunday' }
    ]

    private checkedValues: any[] = []
    private mon_allot_customer: boolean = true
    private tue_allot_customer: boolean = true
    private wen_allot_customer: boolean = true
    private thur_allot_customer: boolean = true
    private fri_allot_customer: boolean = true
    private sat_allot_customer: boolean = false
    private sun_allot_customer: boolean = false

    private hasCheckedValues: any[] = []

    private onDaysChange(values: []) {
        this.hasCheckedValues = values
    }

    public setFormValues() {
        //处理分配客户字段数据
        let arr: any[] = []
        let obj: any = {}
        if (this.info.mon_allot_customer) {
            arr.push('monday')
        }
        if (this.info.tue_allot_customer) {
            arr.push('tuesday')
        }
        if (this.info.wen_allot_customer) {
            arr.push('wednesday')
        }
        if (this.info.thur_allot_customer) {
            arr.push('thursday')
        }
        if (this.info.fri_allot_customer) {
            arr.push('friday')
        }
        if (this.info.sat_allot_customer) {
            arr.push('saturday')
        }
        if (this.info.sun_allot_customer) {
            arr.push('sunday')
        }
        if (!arr.length) {
            this.checkedValues = [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday'
            ]
        } else {
            this.checkedValues = arr
        }
        obj.email_group_name = this.info.email_group_name
        obj.lang_id = this.info.lang_id
        obj.recv_email_list = this.info.recv_email_list
        obj.ticket_type_ids = this.info.ticket_type_ids
        obj.memo = this.info.memo
        this.form.setFieldsValue(obj)
    }

    private onSubmit() {
        this.mon_allot_customer = this.hasCheckedValues.includes('monday')
        this.tue_allot_customer = this.hasCheckedValues.includes('tuesday')
        this.wen_allot_customer = this.hasCheckedValues.includes('wednesday')
        this.thur_allot_customer = this.hasCheckedValues.includes('thursday')
        this.fri_allot_customer = this.hasCheckedValues.includes('friday')
        this.sat_allot_customer = this.hasCheckedValues.includes('saturday')
        this.sun_allot_customer = this.hasCheckedValues.includes('sunday')
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['save_flag'] = this.saveFlag
                values['id'] = this.id
                values['mon_allot_customer'] = this.mon_allot_customer
                values['tue_allot_customer'] = this.tue_allot_customer
                values['wen_allot_customer'] = this.wen_allot_customer
                values['thur_allot_customer'] = this.thur_allot_customer
                values['fri_allot_customer'] = this.fri_allot_customer
                values['sat_allot_customer'] = this.sat_allot_customer
                values['sun_allot_customer'] = this.sun_allot_customer
                this.saveGroup(values)
            }
        })
    }

    private saveGroup(params) {
        //检查数据
        for (let i of this.ruleData) {
            if (!i.user_id || i.user_id < 1) {
                this.errorMessage = '请确认是否已选择客服'
                return
            }
            if (
                typeof i.mon_allot_ratio === 'undefined' ||
                typeof i.tue_allot_ratio === 'undefined' ||
                typeof i.wen_allot_ratio === 'undefined' ||
                typeof i.thur_allot_ratio === 'undefined' ||
                typeof i.fri_allot_ratio === 'undefined' ||
                typeof i.sat_allot_ratio === 'undefined' ||
                typeof i.sun_allot_ratio === 'undefined'
            ) {
                this.errorMessage = '请确认是否已填写比例'
                return
            }
        }

        params['allot_ratio_details'] = this.ruleData.map(x => {
            return {
                mon_allot_ratio: x.mon_allot_ratio,
                tue_allot_ratio: x.tue_allot_ratio,
                wen_allot_ratio: x.wen_allot_ratio,
                thur_allot_ratio: x.thur_allot_ratio,
                fri_allot_ratio: x.fri_allot_ratio,
                sat_allot_ratio: x.sat_allot_ratio,
                sun_allot_ratio: x.sun_allot_ratio,
                user_id: x.user_id,
                status: x.status,
                save_flag: x.save_flag,
                cs_group_name: x.cs_group_name,
                id: x.id ? x.id : 0
            }
        })
        this.helpdeskService
            .save_email_group(
                new RequestParams(params, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.errorMessage = ''
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private addRule() {
        // if (!this.id) {
        //     this.errorMessage = '请先创建分组'
        // }
        let index = UUID.generate()
        this.currentRow = index
        this.ruleData.push({
            index: index,
            mon_allot_ratio: 10,
            tue_allot_ratio: 10,
            wen_allot_ratio: 10,
            thur_allot_ratio: 10,
            fri_allot_ratio: 10,
            sat_allot_ratio: 10,
            sun_allot_ratio: 10,
            user_id: '',
            status: 20,
            save_flag: 0,
            cs_group_name: '',
            mon_cs_ratio: '',
            tue_cs_ratio: '',
            wen_cs_ratio: '',
            thur_cs_ratio: '',
            fri_cs_ratio: '',
            sat_cs_ratio: '',
            sun_cs_ratio: '',
            mon_member_ratio: '',
            tue_member_ratio: '',
            wen_member_ratio: '',
            thur_member_ratio: '',
            fri_member_ratio: '',
            sat_member_ratio: '',
            sun_member_ratio: '',

            users: this.customerList
        })
    }

    /**
     * 取消编辑数据
     */
    private onCancel(e) {
        e.stopPropagation()
        this.currentRow = ''
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target && value.target.value) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }

        if (
            column == 'cs_group_name' ||
            column == 'mon_allot_ratio' ||
            column == 'tue_allot_ratio' ||
            column == 'wen_allot_ratio' ||
            column == 'thur_allot_ratio' ||
            column == 'fri_allot_ratio' ||
            column == 'sat_allot_ratio' ||
            column == 'sun_allot_ratio' ||
            column == 'status'
        ) {
            this.refreshData()
            if (column == 'cs_group_name') {
                row['users'] = this.customerList.filter(y =>
                    this.csGroup
                        .find(x => x.code == row[column])
                        .name.includes(y.code)
                )
            }
            if (column == 'status' && value == 60) {
                row.mon_member_ratio = ''
                row.tue_member_ratio = ''
                row.wen_member_ratio = ''
                row.thur_member_ratio = ''
                row.fri_member_ratio = ''
                row.sat_member_ratio = ''
                row.sun_member_ratio = ''

                row.mon_cs_ratio = ''
                row.tue_cs_ratio = ''
                row.wen_cs_ratio = ''
                row.thur_cs_ratio = ''
                row.fri_cs_ratio = ''
                row.sat_cs_ratio = ''
                row.sun_cs_ratio = ''
            }
        }
    }

    private refreshData() {
        for (let i in this.ruleData) {
            if (this.ruleData[i].status == 20) {
                //cs_ratio
                this.ruleData[i].mon_cs_ratio = this.calSameGroupCsRatio(
                    'mon_allot_ratio',
                    i
                )
                this.ruleData[i].tue_cs_ratio = this.calSameGroupCsRatio(
                    'tue_allot_ratio',
                    i
                )
                this.ruleData[i].wen_cs_ratio = this.calSameGroupCsRatio(
                    'wen_allot_ratio',
                    i
                )
                this.ruleData[i].thur_cs_ratio = this.calSameGroupCsRatio(
                    'thur_allot_ratio',
                    i
                )
                this.ruleData[i].fri_cs_ratio = this.calSameGroupCsRatio(
                    'fri_allot_ratio',
                    i
                )
                this.ruleData[i].sat_cs_ratio = this.calSameGroupCsRatio(
                    'sat_allot_ratio',
                    i
                )
                this.ruleData[i].sun_cs_ratio = this.calSameGroupCsRatio(
                    'sun_allot_ratio',
                    i
                )
                //member_ratio
                this.ruleData[i].mon_member_ratio = this.calSameGroupAllotRatio(
                    'mon_allot_ratio',
                    i
                )
                this.ruleData[i].tue_member_ratio = this.calSameGroupAllotRatio(
                    'tue_allot_ratio',
                    i
                )
                this.ruleData[i].wen_member_ratio = this.calSameGroupAllotRatio(
                    'wen_allot_ratio',
                    i
                )
                this.ruleData[
                    i
                ].thur_member_ratio = this.calSameGroupAllotRatio(
                    'thur_allot_ratio',
                    i
                )
                this.ruleData[i].fri_member_ratio = this.calSameGroupAllotRatio(
                    'fri_allot_ratio',
                    i
                )
                this.ruleData[i].sat_member_ratio = this.calSameGroupAllotRatio(
                    'sat_allot_ratio',
                    i
                )
                this.ruleData[i].sun_member_ratio = this.calSameGroupAllotRatio(
                    'sun_allot_ratio',
                    i
                )
            }
        }
        this.setFormValues()
    }

    //计算组里个人占比
    private calSameGroupAllotRatio(name: string, i: any) {
        let sumRatio = this.ruleData
            .filter(
                x =>
                    x.cs_group_name == this.ruleData[i].cs_group_name &&
                    x.status == 20
            )
            .reduce((total, item) => {
                if (!item[name]) {
                    item[name] = 0
                }
                return total + parseInt(item[name])
            }, 0)
        if (!this.ruleData[i][name]) {
            return 0
        } //防止出现NaN
        return Math.floor((this.ruleData[i][name] * 1000) / sumRatio) / 10
    }

    //计算分组占比
    private calSameGroupCsRatio(name: string, index: any) {
        let groupArr: any = {}
        let totalRatio: number = 0 //所有组的比例和
        let sameGroupCsRatio: number = 0 //相同组的比例和
        for (let i in this.ruleData) {
            if (!this.ruleData[i][name]) {
                this.ruleData[i][name] = 0
            }
            totalRatio += this.ruleData[i][name]
            if (this.ruleData[i].status == 20) {
                if (groupArr[this.ruleData[i].cs_group_name] != undefined) {
                    groupArr[this.ruleData[i].cs_group_name].push(
                        this.ruleData[i]
                    )
                } else {
                    groupArr[this.ruleData[i].cs_group_name] = [
                        this.ruleData[i]
                    ]
                }
            }
        }

        groupArr[this.ruleData[index].cs_group_name].forEach(z => {
            sameGroupCsRatio += z[name]
        })
        if (!sameGroupCsRatio) {
            return 0
        } //防止出现NaN
        return Math.floor((sameGroupCsRatio * 1000) / totalRatio) / 10
    }

    private onDelete(row) {
        this.ruleData = this.ruleData.filter(x => x.index != row.index)
        this.refreshData()
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "group_name": "Group Name",
            "lang_id": "Languge",
            "recv_email": "Recv Email",
            "recv_email_list": "Redv Email List",
            "memo": "Memo",
            "allot_user": "Allot User",
            "allot_ratio": "Allot Ratio",
            "sun_allot_ratio": "Sun Allot Ratio",
            "mon_allot_ratio": "Mon Allot Ratio",
            "tue_allot_ratio": "Tue Allot Ratio",
            "wen_allot_ratio": "Wen Allot Ratio",
            "thur_allot_ratio": "Thur Allot Ratio",
            "fri_allot_ratio": "Fri Allot Ratio",
            "sat_allot_ratio": "Sat Allot Ratio",
            "status": "Status",
            "operate": "Action",
            "ticket_type_id": "Ticket Type",
            "cs_group_name": "CS Group Name",
            "mon_cs_ratio": "Mon CS Ratio(%)",
            "mon_member_ratio": "Mon Member Ratio(%)",
            "tue_cs_ratio": "Tue CS Ratio(%)",
            "tue_member_ratio": "Tue Member Ratio(%)",
            "wen_cs_ratio": "Wen CS Ratio(%)",
            "wen_member_ratio": "Wen Member Ratio(%)",
            "thur_cs_ratio": "Thur CS Ratio(%)",
            "thur_member_ratio": "Thur Member Ratio(%)",
            "fri_cs_ratio": "Fri CS Ratio(%)",
            "fri_member_ratio": "Fri Member Ratio(%)",
            "sat_cs_ratio": "Sat CS Ratio(%)",
            "sat_member_ratio": "Sat Member Ratio(%)",
            "sun_cs_ratio": "Sun CS Ratio(%)",
            "sun_member_ratio": "Sun Member Ratio(%))",
            "allot_customer": "Allot Customer",
            "mon": "Monday",
            "tus": "Tuesday",
            "wed": "Wednesday",
            "thes": "Thursday",
            "fri": "Friday",
            "sat": "Saturday",
            "sun": "Sunday"
        },
        "actions": {
            "delete": "Delete",
            "add": "Add",
            "cancel": "Cancel",
            "submit": "Submit"
        }
    },
    "zh-cn": {
        "columns": {
            "group_name": "分组名称",
            "lang_id": "语种",
            "recv_email": "收件邮箱",
            "recv_email_list": "邮箱列表",
            "memo": "备注",
            "allot_user": "客服",
            "allot_ratio": "分配比例",
            "sun_allot_ratio": "周日分配比例",
            "mon_allot_ratio": "周一分配比例",
            "tue_allot_ratio": "周二分配比例",
            "wen_allot_ratio": "周三分配比例",
            "thur_allot_ratio": "周四分配比例",
            "fri_allot_ratio": "周五分配比例",
            "sat_allot_ratio": "周六分配比例",
            "status": "状态",
            "operate": "操作",
            "ticket_type_id": "邮件类型",
            "cs_group_name": "CS 分组",
            "mon_cs_ratio": "周一分组占比(%)",
            "mon_member_ratio": "周一组里个人占比(%)",
            "tue_cs_ratio": "周二分组占比(%)",
            "tue_member_ratio": "周二组里个人占比(%)",
            "wen_cs_ratio": "周三分组占比(%)",
            "wen_member_ratio": "周三组里个人占比(%)",
            "thur_cs_ratio": "周四分组占比(%)",
            "thur_member_ratio": "周四组里个人占比(%)",
            "fri_cs_ratio": "周五分组占比(%)",
            "fri_member_ratio": "周五组里个人占比(%)",
            "sat_cs_ratio": "周六分组占比(%)",
            "sat_member_ratio": "周六组里个人占比(%)",
            "sun_cs_ratio": "周日分组占比(%)",
            "sun_member_ratio": "周日组里个人占比(%)",
            "allot_customer": "分配客户",
            "mon": "周一",
            "tus": "周二",
            "wed": "周三",
            "thes": "周四",
            "fri": "周五",
            "sat": "周六",
            "sun": "周日"
        },
        "actions": {
            "delete": "删除",
            "add": "新增",
            "cancel": "丢弃",
            "submit": "提交"
        }
    }
}
</i18n>