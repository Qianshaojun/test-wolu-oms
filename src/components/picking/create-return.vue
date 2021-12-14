<template>
    <section class="component order-base-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.selected_ship_type')"
                        required
                    >
                        <a-checkbox
                            :defaultChecked="is_check"
                            v-model="is_check"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.ship_type')"
                        v-show="is_check"
                        required
                    >
                        <a-select
                            style="width: 100%"
                            placeholder="Please select"
                            v-model="ship_type"
                            size="small"
                        >
                            <a-select-option key="dpd" value="dpd">
                                DPD
                            </a-select-option>
                            <a-select-option key="gls" value="gls">
                                GLS
                            </a-select-option>
                            <a-select-option
                                key="ship_order"
                                value="ship_order"
                            >
                                DHL
                            </a-select-option>
                            <!-- <a-select-option key="RM_TR48" value="RM_TR48">
                                UK_RoyalMail
                            </a-select-option>
                            <a-select-option key="GB_DPD_C1" value="GB_DPD_C1">
                                UK_DPD
                            </a-select-option> -->
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-table
            :dataSource="demands"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="name"
            bordered
        >
            <a-table-column
                :title="$t('forms.name')"
                key="name"
                data-index="name"
                align="left"
            ></a-table-column>
            <a-table-column
                :title="$t('forms.product_qty')"
                key="product_qty"
                data-index="product_qty"
                align="right"
            >
                <template slot-scope="product_qty, row">
                    <a-input-number
                        decimalSeparator=","
                        :value="product_qty"
                        size="small"
                        @change="e => handleChange(e, row, 'product_qty')"
                    />
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('columns.Delete')"
                key="delete"
                align="center"
            >
                <template slot-scope="row">
                    <a-icon
                        @click="onDelete(row)"
                        type="delete"
                        style="color:red"
                    />
                </template>
            </a-table-column>
        </a-table>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.ok') }}
            </a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import { Form } from 'ant-design-vue'

interface move_lines {
    product_tmpl_id: number
    qty: number
}

@Component({
    components: {}
})
export default class CreateReturn extends Vue {
    @Emit('modal.submit')
    private submit() {
        return
    }

    @Emit('modal.cancel')
    private cancel() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
        return
    }

    @Prop()
    private picking_id

    @Prop()
    private changeSpinning

    private ship_type = 'dpd'
    private is_check: Boolean = false

    private form: any = {}
    private demands: any[] = []

    private created() {
        this.getDemands()
    }

    private pickingService = new PickingService()
    private loadingService = new LoadingService()

    private getDemands() {
        this.pickingService
            .queryStockMoveForReturn(
                new RequestParams({
                    picking_id: this.picking_id
                })
            )
            .subscribe(
                data => {
                    this.demands = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private handleChange(e, row, column) {
        row[column] = e
    }

    private onSubmit() {
        let values = []
        values['picking_id'] = this.picking_id
        values['selected_ship_type'] = this.is_check
        values['ship_type'] = this.ship_type
        let move_lines: any = []
        for (let i of this.demands) {
            if (!i['product_qty']) {
                this.$message.error('return qty is not correct.')
                return
            }

            move_lines.push({
                product_tmpl_id: i['product_tmpl_id'],
                qty: i['product_qty']
            })
        }
        values['move_lines'] = move_lines
        this.saveData(values)
    }

    private saveData(values) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .returnShipment(new RequestParams(values, loading))
            .subscribe(
                data => {
                    this.submit()
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        let index = this.demands.findIndex(x => x.name === row.name)
        this.demands.splice(index, 1)
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns": {
            "selected_ship_type": "Select Ship Type",
            "ship_type": "Ship Type",
            "product_qty": "QTY",
            "Delete": "Delete"
        },
        "forms": {
            "name": "sku",
            "product_qty": "QTY",
            "picking_type": "拣货类型"
        },
        "action": {
            "ok": "Commit"
        }
    },
    "zh-cn": {
        "columns": {
            "selected_ship_type": "手动选择",
            "ship_type": "物流方式",
            "product_qty": "数量",
            "Delete": "删除"
        },
        "forms": {
            "name": "sku",
            "product_qty": "数量",
            "picking_type": "拣货类型"
        },
        "action": {
            "ok": "提交"
        }
    }
}
</i18n>
