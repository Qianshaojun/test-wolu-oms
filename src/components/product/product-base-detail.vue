<template>
    <section class="component order-base-data">
        <div style="padding:0 20px 10px 0px;">
            <a-button @click="editBtn" v-if="!editable" type="primary"
                >{{ $t('edit') }}
            </a-button>
            <a-popconfirm
                v-else
                :title="$t('actions.confirm_cancel')"
                :okText="$t('actions.ok')"
                :cancelText="$t('actions.cancel')"
                placement="left"
                @confirm="editBtn()"
            >
                <a-button type="primary">{{ $t('cancel_edit') }}</a-button>
            </a-popconfirm>

            <a-button @click="saveBtn" type="primary" style="margin-left:10px;"
                >{{ $t('save') }}
            </a-button>

            <a-button
                @click="changeCategory"
                type="primary"
                style="margin-left:10px;"
                >{{ $t('change_category') }}
            </a-button>
            <!-- <a-button @click="cancelBtn" style="margin-left:10px;">{{
                $t('cancel')
            }}</a-button> -->
        </div>
        <p
            style="color: #fff;font-weight: 600;font-size:18px;margin: 0; border-bottom:3px solid #ccc;"
        >
            <span class="side_label">
                {{ $t('actions.part1_name') }}
            </span>
        </p>
        <div class="pic-box">
            <div class="pic">
                <img :src="data.product_link" style="width:100%;" alt="" />
            </div>
            <div class="prod-name">
                <p>
                    <span
                        v-if="data.product_url && data.product_url.length > 10"
                    >
                        <a
                            title="Download the Product Manual(产品说明书)"
                            @click="
                                view_old_manual_pdf(
                                    data.product_url.replace(
                                        /Introduction@@/g,
                                        ''
                                    )
                                )
                            "
                            >{{ data.default_code }}
                        </a></span
                    >
                    <span v-else>{{ data.default_code }}</span>
                </p>
            </div>
            <div class="ck-box">
                <ul>
                    <!-- <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.sale_ok"
                            @change="
                                e => handleChange(e.target.checked, 'sale_ok')
                            "
                        />
                        {{ $t('sale_ok') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.purchase_ok"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        'purchase_ok'
                                    )
                            "
                        />
                        {{ $t('purchase_ok') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.on_sale"
                            @change="
                                e => handleChange(e.target.checked, 'on_sale')
                            "
                        />
                        {{ $t('on_sale') }}
                    </li> -->
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.is_purchase_product"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        'is_purchase_product'
                                    )
                            "
                        />
                        {{ $t('is_purchase_product') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.is_set"
                            @change="
                                e => handleChange(e.target.checked, 'is_set')
                            "
                        />
                        {{ $t('is_set') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.is_pack"
                            @change="
                                e => handleChange(e.target.checked, 'is_pack')
                            "
                        />
                        {{ $t('is_pack') }}
                    </li>
                    <li>
                        <a-checkbox
                            id="is_edit_group"
                            :disabled="!editable"
                            :checked="data.is_edit_group"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        'is_edit_group'
                                    )
                            "
                        />
                        {{ $t('is_edit_group') }}
                    </li>
                </ul>
            </div>
            <div class="ck-box">
                <ul>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.is_to_switch"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.checked,
                                        'is_to_switch'
                                    )
                            "
                        />
                        {{ $t('is_to_switch') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.is_fba"
                            @change="
                                e => handleChange(e.target.checked, 'is_fba')
                            "
                        />
                        {{ $t('is_fba') }}
                    </li>
                    <li>
                        <a-checkbox
                            :disabled="!editable"
                            :checked="data.active"
                            @change="
                                e => handleChange(e.target.checked, 'active')
                            "
                        />
                        {{ $t('active') }}
                    </li>
                    <li>
                        <a-checkbox disabled :checked="!!data.new_product" />
                        {{ $t('new_product') }}
                    </li>
                </ul>
            </div>
            <div class="ck-box">
                <ul></ul>
            </div>
        </div>
        <table class="xgtb">
            <!-- <tr>
                <td class="title">{{ $t('new_product') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="true"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.new_product"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'new_product')
                        "
                    />
                </td>
            </tr> -->
            <tr>
                <td class="title">{{ $t('type') }}</td>
                <td class="content">
                    <a-select
                        v-if="editable"
                        v-decorator="['type']"
                        :value="data.type"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Select Type"
                        @change="e => handleChange(e, 'type')"
                    >
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.ProductType"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ data.type | dict('ProductType') | translate }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('name') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.name"
                        size="small"
                        @change="e => handleChange(e.target.value, 'name')"
                    />
                    <span v-else>
                        {{ data.name }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('default_code') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.default_code"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'default_code')
                        "
                    />
                    <span v-else>
                        {{ data.default_code }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('product_number') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_number"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'product_number')
                        "
                    />
                    <span v-else>
                        {{ data.product_number }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('common_sku') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.common_sku"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'common_sku')
                        "
                    />
                    <span v-else>
                        {{ data.common_sku }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('edit_group_sku') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.edit_group_sku"
                        :disabled="!edit_group_sku_able"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'edit_group_sku')
                        "
                    />
                    <span v-else>
                        {{ data.edit_group_sku }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('product_color') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_color"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'product_color')
                        "
                    />
                    <span v-else>
                        {{ data.product_color }}
                    </span>
                </td>
            </tr>
            <!-- <tr>
                <td class="title">{{ $t('product_color_chinese') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_color_chinese"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    'product_color_chinese'
                                )
                        "
                    />
                    <span v-else>
                        {{ data.product_color_chinese }}
                    </span>
                </td>
            </tr> -->
            <tr>
                <td class="title">{{ $t('pack_material') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.pack_material"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'pack_material')
                        "
                    />
                    <span v-else>
                        {{ data.pack_material }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('weight') }}</td>
                <td class="content">
                    <a-input-number
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.weight"
                        size="small"
                        :min="0"
                        @change="e => handleChange(e, 'weight')"
                    />
                    <span v-else>
                        {{ data.weight }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('weight1') }}</td>
                <td class="content">
                    <a-input-number
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.weight1"
                        size="small"
                        :min="0"
                        @change="e => handleChange(e, 'weight1')"
                    />
                    <span v-else>
                        {{ data.weight1 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('basic_size') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.basic_size"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'basic_size')
                        "
                    />
                    <span v-else> {{ data.basic_size }} </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('max_size') }}</td>
                <td class="content">
                    <template v-if="editable">
                        <a-input-number
                            size="small"
                            style="width:25%;margin-right: 1%"
                            v-model="data.package_length"
                            :placeholder="this.$t('length')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            style="width:25%;margin-right: 1%"
                            v-model="data.package_width"
                            :placeholder="this.$t('width')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            style="width:25%"
                            v-model="data.package_height"
                            :placeholder="this.$t('height')"
                        ></a-input-number>
                    </template>
                    <!--                    <a-input-->
                    <!--                        v-if="editable"-->
                    <!--                        style="width:90%;margin: 3px 0"-->
                    <!--                        :value="data.max_size"-->
                    <!--                        size="small"-->
                    <!--                        @change="e => handleChange(e.target.value, 'max_size')"-->
                    <!--                    />-->
                    <span v-else>
                        {{ data.max_size }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('carton_size') }}</td>
                <td class="content">
                    <template v-if="editable">
                        <a-input-number
                            size="small"
                            style="width:25%;margin-right: 1%"
                            v-model="data.carton_length"
                            :placeholder="this.$t('length')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            style="width:25%;margin-right: 1%"
                            v-model="data.carton_width"
                            :placeholder="this.$t('width')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            style="width:25%"
                            v-model="data.carton_height"
                            :placeholder="this.$t('height')"
                        ></a-input-number>
                    </template>
                    <!--                    <a-input-->
                    <!--                        v-if="editable"-->
                    <!--                        style="width:90%;margin: 3px 0"-->
                    <!--                        :value="data.carton_size"-->
                    <!--                        size="small"-->
                    <!--                        @change="-->
                    <!--                            e => handleChange(e.target.value, 'carton_size')-->
                    <!--                        "-->
                    <!--                    />-->
                    <span v-else>
                        {{ data.carton_size }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('package_size_container') }}</td>
                <td class="content">
                    <template v-if="editable">
                        <a-input-number
                            size="small"
                            style="width:25%;margin-right: 1%"
                            v-model="data.size1"
                            :placeholder="this.$t('length')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            v-model="data.size2"
                            style="width:25%;margin-right: 1%"
                            :placeholder="this.$t('width')"
                        ></a-input-number>
                        <a-input-number
                            size="small"
                            style="width:25%"
                            v-model="data.size3"
                            :placeholder="this.$t('height')"
                        ></a-input-number>
                    </template>
                    <!--                    <a-input-->
                    <!--                        v-if="editable"-->
                    <!--                        style="width:90%;margin: 3px 0"-->
                    <!--                        :value="data.package_size_container"-->
                    <!--                        size="small"-->
                    <!--                        @change="-->
                    <!--                            e =>-->
                    <!--                                handleChange(-->
                    <!--                                    e.target.value,-->
                    <!--                                    'package_size_container'-->
                    <!--                                )-->
                    <!--                        "-->
                    <!--                    />-->
                    <span v-else>
                        {{ data.package_size_container }}
                    </span>
                </td>
            </tr>
            <!--            <tr>-->
            <!--                <td class="title">{{ $t('size1') }}</td>-->
            <!--                <td class="content">-->
            <!--                    <a-input-number-->
            <!--                        v-if="editable"-->
            <!--                        style="width:90%;margin: 3px 0"-->
            <!--                        :value="data.size1"-->
            <!--                        size="small"-->
            <!--                        :min="0"-->
            <!--                        @change="e => handleChange(e, 'size1')"-->
            <!--                    />-->
            <!--                    <span v-else>-->
            <!--                        {{ data.size1 }}-->
            <!--                    </span>-->
            <!--                </td>-->
            <!--            </tr>-->
            <!--            <tr>-->
            <!--                <td class="title">{{ $t('size2') }}</td>-->
            <!--                <td class="content">-->
            <!--                    <a-input-number-->
            <!--                        v-if="editable"-->
            <!--                        style="width:90%;margin: 3px 0"-->
            <!--                        :value="data.size2"-->
            <!--                        size="small"-->
            <!--                        :min="0"-->
            <!--                        @change="e => handleChange(e, 'size2')"-->
            <!--                    />-->
            <!--                    <span v-else>-->
            <!--                        {{ data.size2 }}-->
            <!--                    </span>-->
            <!--                </td>-->
            <!--            </tr>-->
            <!--            <tr>-->
            <!--                <td class="title">{{ $t('size3') }}</td>-->
            <!--                <td class="content">-->
            <!--                    <a-input-number-->
            <!--                        v-if="editable"-->
            <!--                        style="width:90%;margin: 3px 0"-->
            <!--                        :value="data.size3"-->
            <!--                        size="small"-->
            <!--                        :min="0"-->
            <!--                        @change="e => handleChange(e, 'size3')"-->
            <!--                    />-->
            <!--                    <span v-else>-->
            <!--                        {{ data.size3 }}-->
            <!--                    </span>-->
            <!--                </td>-->
            <!--            </tr>-->
            <tr>
                <td class="title">{{ $t('min_pack') }}</td>
                <td class="content">
                    <a-input-number
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.min_pack"
                        size="small"
                        :min="0"
                        @change="e => handleChange(e, 'min_pack')"
                    />
                    <span v-else>
                        {{ data.min_pack }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('pack_cate') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.pack_cate"
                        size="small"
                        @change="e => handleChange(e.target.value, 'pack_cate')"
                    />
                    <span v-else>
                        {{ data.pack_cate }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('location_code') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.location_code"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'location_code')
                        "
                    />
                    <span v-else>
                        {{ data.location_code }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('is_seasonal_product') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="!editable"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.season_prod"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'season_prod')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('peek_season_month') }}</td>
                <td class="content">
                    <a-select
                        mode="multiple"
                        v-if="editable"
                        v-decorator="['hot_sale_month']"
                        :default-value="data.hot_sale_month"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please Select"
                        @change="e => handleChange(e, 'hot_sale_month')"
                    >
                        <a-select-option v-for="item in 12" :key="item"
                            >{{ item }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{
                            data.hot_sale_month
                                ? data.hot_sale_month.join(',')
                                : ''
                        }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="xgtb" style="border-left: 1px solid #ccc;">
            <tr>
                <td class="title">{{ $t('category') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.category"
                        size="small"
                        @change="e => handleChange(e.target.value, 'category')"
                    />
                    <span v-else>
                        {{ data.category }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('z_category') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.z_category"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'z_category')
                        "
                    />
                    <span v-else>
                        {{ data.z_category }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('sub_category') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.sub_category"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'sub_category')
                        "
                    />
                    <span v-else>
                        {{ data.sub_category }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('z_sub_category') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.z_sub_category"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'z_sub_category')
                        "
                    />
                    <span v-else>
                        {{ data.z_sub_category }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">
                    {{ $t('department') }} <span style="color:#f00;">*</span>
                </td>
                <td class="content">
                    <a-select
                        v-if="editable"
                        v-decorator="['dept_id']"
                        :value="data.dept_id"
                        :style="{ width: '90%' }"
                        size="small"
                        @change="e => handleChange(e, 'dept_id')"
                    >
                        <a-select-option
                            v-for="i of topDepartmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                    <span v-else>
                        {{ this.getDepartName(data.dept_id) }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('operator') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.operator"
                        size="small"
                        @change="e => handleChange(e.target.value, 'operator')"
                    />
                    <span v-else>
                        {{ data.operator }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('purchase_method') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.purchase_method"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'purchase_method')
                        "
                    />
                    <span v-else>
                        {{ data.purchase_method }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('prime_group') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.prime_group"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'prime_group')
                        "
                    />
                    <span v-else>
                        {{ data.prime_group }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('pre_sale') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="!editable"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.pre_sale"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'pre_sale')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('uk_pre_sale') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="!editable"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.uk_pre_sale"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'uk_pre_sale')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('amazon_sale_only') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="!editable"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.amazon_sale_only"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.checked,
                                    'amazon_sale_only'
                                )
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('share_stock_country') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.share_stock_country"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    'share_stock_country'
                                )
                        "
                    />
                    <span v-else>
                        {{ data.share_stock_country }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('uk_warehouse') }}</td>
                <td class="content">
                    <a-checkbox
                        :disabled="!editable"
                        style="width:3%;margin: 3px 0"
                        :checked="!!data.uk_warehouse"
                        size="small"
                        @change="
                            e => handleChange(e.target.checked, 'uk_warehouse')
                        "
                    />
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('product_link') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_link"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'product_link')
                        "
                    />
                    <span v-else>
                        {{ data.product_link }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('product_ve') }}1</td>
                <td class="content">
                    <a-input-number
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_ve"
                        size="small"
                        :min="0"
                        @change="e => handleChange(e, 'product_ve')"
                    />
                    <span v-else>
                        {{ data.product_ve }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('purchase_ve') }}</td>
                <td class="content">
                    <a-input-number
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.purchase_ve"
                        size="small"
                        :min="0"
                        @change="e => handleChange(e, 'purchase_ve')"
                    />
                    <span v-else>
                        {{ data.purchase_ve }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('product_storage_condition') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.product_storage_condition"
                        size="small"
                        @change="
                            e =>
                                handleChange(
                                    e.target.value,
                                    'product_storage_condition'
                                )
                        "
                    />
                    <span v-else>
                        {{ data.product_storage_condition }}
                    </span>
                </td>
            </tr>
            <!-- <tr>
                <td class="title">{{ $t('hs_code') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.hs_code"
                        size="small"
                        @change="e => handleChange(e.target.value, 'hs_code')"
                    />
                    <span v-else>
                        {{ data.hs_code }}
                    </span>
                </td>
            </tr> -->
            <!-- <tr>
                <td class="title">{{ $t('china_hs_code') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.china_hs_code"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'china_hs_code')
                        "
                    />
                    <span v-else>
                        {{ data.china_hs_code }}
                    </span>
                </td>
            </tr> -->
            <!-- <tr>
                <td class="title">{{ $t('europe_hs_code') }}</td>
                <td class="content">
                    <a-input
                        v-if="editable"
                        style="width:90%;margin: 3px 0"
                        :value="data.europe_hs_code"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'europe_hs_code')
                        "
                    />
                    <span v-else>
                        {{ data.europe_hs_code }}
                    </span>
                </td>
            </tr> -->
            <tr>
                <td class="title">{{ $t('stock_calculated_time') }}</td>
                <td class="content">
                    <a-date-picker
                        v-if="editable"
                        show-time
                        style="width:90%;margin: 3px 0"
                        :value="data.stock_calculated_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'stock_calculated_time')"
                    />
                    <span v-else>
                        {{ data.stock_calculated_time }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('first_stock_time') }}</td>
                <td class="content">
                    <a-date-picker
                        v-if="editable"
                        show-time
                        style="width:90%;margin: 3px 0"
                        :value="data.first_stock_time"
                        size="small"
                        format="YYYY-MM-DD HH:mm:ss"
                        @change="e => handleChange(e, 'first_stock_time')"
                    />
                    <span v-else>
                        {{ data.first_stock_time }}
                    </span>
                </td>
            </tr>
        </table>

        <p
            style="color: #fff;font-weight: 600;font-size:18px;clear:both;margin: 0; border-bottom: 3px solid #ccc;"
        >
            <span class="side_label">
                {{ $t('actions.part2_name') }}
            </span>
        </p>
        <table class="xgtb-full">
            <tr>
                <td class="title">{{ $t('frei_field_1') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_1"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_1')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_1 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_2') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_2"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_2')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_2 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_3') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_3"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_3')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_3 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_4') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_4"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_4')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_4 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_5') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_5"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_5')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_5 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_6') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_6"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_6')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_6 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_7') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_7"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_7')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_7 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_8') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_8"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_8')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_8 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_9') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_9"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_9')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_9 }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="title">{{ $t('frei_field_10') }}</td>
                <td class="content">
                    <a-textarea
                        v-if="editable"
                        auto-size
                        style="width:95%;margin: 3px 0"
                        :value="data.frei_field_10"
                        size="small"
                        @change="
                            e => handleChange(e.target.value, 'frei_field_10')
                        "
                    />
                    <span v-else>
                        {{ data.frei_field_10 }}
                    </span>
                </td>
            </tr>
        </table>

        <p
            style="color: #fff;font-weight: 600;font-size:18px;clear:both;margin: 0; border-bottom: 3px solid #ccc;"
        >
            <span class="side_label">
                {{ $t('actions.part3_name') }}
            </span>
        </p>
        <div style="padding:0 20px 10px 0px; margin-top:10px;">
            <a-button @click="editBtn2" v-if="!editable2" type="primary"
                >{{ $t('edit') }}
            </a-button>
            <a-popconfirm
                v-else
                :title="$t('actions.confirm_cancel')"
                :okText="$t('actions.ok')"
                :cancelText="$t('actions.cancel')"
                placement="left"
                @confirm="editBtn2()"
            >
                <a-button type="primary">{{ $t('cancel_edit') }}</a-button>
            </a-popconfirm>
            <a-button
                @click="addExtraInfo"
                type="primary"
                style="margin-left:10px;"
                >{{ $t('add') }}
            </a-button>
            <a-button
                @click="saveExtraInfo"
                type="primary"
                style="margin-left:10px;"
                >{{ $t('save') }}
            </a-button>
        </div>
        <a-table
            :dataSource="extraInfoList"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="index"
            bordered
        >
            <a-table-column
                :title="$t('product_attr')"
                key="product_attr"
                align="left"
                width="40%"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="editable2"
                        style="width:90%;margin: 3px 0"
                        :value="row.product_attr"
                        size="small"
                        @change="
                            e =>
                                handleExtraChange(
                                    e.target.value,
                                    'product_attr',
                                    row.index
                                )
                        "
                    />
                    <span v-else>
                        {{ row.product_attr }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_value')"
                key="product_value"
                align="left"
                width="50%"
            >
                <template slot-scope="row">
                    <a-input
                        v-if="editable2"
                        style="width:90%;margin: 3px 0"
                        :value="row.product_value"
                        size="small"
                        @change="
                            e =>
                                handleExtraChange(
                                    e.target.value,
                                    'product_value',
                                    row.index
                                )
                        "
                    />
                    <span v-else>
                        {{ row.product_value }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('operate')"
                key="action"
                align="center"
                width="10%"
            >
                <template slot-scope="row">
                    <a @click="onDelete(row)">{{ $t('delete') }}</a>
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>
<style>
.xgtb {
    width: 50%;
    float: left;
    border: 1px solid #eee;
    margin-bottom: 20px;
}

.xgtb .title {
    padding-left: 5px;
    width: 20%;
    background: #f8f8f8;
}

.xgtb .content {
    width: 76%;
    padding-left: 1%;
}

.xgtb-full {
    width: 100%;
    border: 1px solid #eee;
    margin-bottom: 20px;
}

.xgtb-full .title {
    padding-left: 6px;
    width: 8%;
    background: #f8f8f8;
}

.xgtb-full .content {
    width: 90%;
    padding-left: 1%;
}

.xgtb tr,
.xgtb-full tr {
    border-bottom: 1px solid #eee;
}

.xgtb tr td,
.xgtb-full tr td {
    line-height: 30px;
    border-right: 1px solid #eee;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PickingService } from '../../services/picking.service'
import { GeneralService } from '../../services/general.service'
import { GeneralCodeService } from '../../services/general_code.service'
import { RequestParams } from '../../core/http'
import { LoadingService } from '../../bootstrap/services/loading.service'
import router from '@/router'
import { SellerInstanceService } from '../../services/seller-instance.service'
import { namespace } from 'vuex-class'
import { ProductService } from '../../services/product.service'
import UUID from 'uuidjs'
import appConfig from '@/config/app.config'
import { CommonService } from '@/shared/utils/common.service'
import SelectProductCategory from './select-product-category.vue'
import { PageService } from '../../bootstrap/services/page.service'

const datasModule = namespace('datasModule')

@Component({
    components: {}
})
export default class ProductBasedata extends Vue {
    @Prop()
    info: any

    @Prop()
    id: any

    @Prop()
    countryList

    @Prop()
    systemUsers

    @Prop({ default: 0, type: Number })
    private saveDetail

    @Prop({
        default: false
    })
    private pageShow

    @Prop()
    changeSpinning

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private topDepartmentList: any[] = []

    private loadingService = new LoadingService()

    private productService = new ProductService()

    private data: any = {}

    private extraInfoList: any[] = []

    private editable: any = false

    private editable2: any = false

    private pre_sale: any = false

    private originData: any[] = []

    private extraInfoListOrigin: any[] = []

    private edit_group_sku_able: any = true

    private created() {
        this.getDepartmentList()
    }

    private mounted() {
        // this.info['is_edit_group'] = true
        this.data = Object.assign({}, this.info)
        this.originData = Object.assign({}, this.info)
        if (this.data.id) {
            this.getExtraInfo(this.data.id)
        }
        if (this.data.is_edit_group) {
            this.edit_group_sku_able = false
            this.data['edit_group_sku'] = this.data.default_code
        }

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )
    }

    @Watch('info')
    private onInfoChange() {
        // this.info['is_edit_group'] = true
        this.data = Object.assign({}, this.info)
        this.originData = Object.assign({}, this.info)
        if (this.data.id) {
            this.getExtraInfo(this.data.id)
        }
        if (this.data.is_edit_group) {
            this.edit_group_sku_able = false
            this.data['edit_group_sku'] = this.data.default_code
        }
    }

    private editBtn() {
        this.editable = !this.editable
        if (!this.editable) {
            this.data = Object.assign({}, this.info)
        }
    }

    private editBtn2() {
        this.editable2 = !this.editable2
        if (!this.editable2) {
            this.extraInfoList = this.extraInfoListOrigin.map(x => x)
        }
    }

    public handleChange(value, key) {
        let that = this
        if (key === 'is_edit_group') {
            if (value == false) {
                this.$confirm({
                    title: '警告',
                    content:
                        '该维护组SKU关联的其它SKU将失去与该SKU的关联关系。此操作不可恢复。确认取消？',
                    onOk() {
                        that.data[key] = false
                        that.edit_group_sku_able = true
                        that.data['edit_group_sku'] = ''
                    },
                    onCancel() {
                        let dom: any = window.document.getElementById(
                            'is_edit_group'
                        )
                        dom.checked = true
                        return
                    }
                })
            } else {
                this.data[key] = value
                this.data['edit_group_sku'] = this.data.default_code
                this.edit_group_sku_able = false
            }
        } else {
            this.data[key] = value
        }
    }

    public handleExtraChange(value, key, index) {
        let item = this.extraInfoList.find(x => x.index === index)
        if (item) {
            item[key] = value
        }
    }

    private compareData(data1, data2) {
        let ret = 0
        for (var i in data1) {
            if ((data1[i] || data2[i]) && data1[i] !== data2[i]) {
                ret = 1
                break
            }
        }
        return ret
    }

    private calcStyle(state) {
        if (state === 'ok') {
            return 'green'
        } else if (state === 'error') {
            return 'red'
        } else {
            return 'blue'
        }
    }

    private saveBtn() {
        this.data['save_flag'] = 1
        if (!this.data.dept_id) {
            this.$message.error('department is required')
            return
        }
        if (this.data.season_prod && !this.data.hot_sale_month.length) {
            this.$message.error('旺季月份(peek_season_month) is required')
            return
        }

        this.productService
            .save(
                new RequestParams(this.data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.handleUnit()
                    this.originData = Object.assign({}, this.data)
                    this.editable = false
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    handleUnit() {
        this.data.max_size = `${
            this.data.package_length ? this.data.package_length : ''
        }${this.data.package_width ? 'x' + this.data.package_width : ''}${
            this.data.package_height ? 'x' + this.data.package_height : ''
        }`
        this.data.carton_size = `${
            this.data.carton_length ? this.data.carton_length : ''
        }${this.data.carton_width ? 'x' + this.data.carton_width : ''}${
            this.data.carton_height ? 'x' + this.data.carton_height : ''
        }`
        this.data.package_size_container = `${
            this.data.size1 ? this.data.size1 : ''
        }${this.data.size2 ? 'x' + this.data.size2 : ''}${
            this.data.size3 ? 'x' + this.data.size3 : ''
        }`
    }

    private cancelBtn() {
        this.data = Object.assign({}, this.info)
    }

    private addExtraInfo() {
        this.extraInfoList.push({
            save_flag: 0,
            index: UUID.generate(),
            product_attr: '',
            product_value: ''
        })
        this.editable2 = true
    }

    private getExtraInfo(id) {
        this.productService
            .query_product_extra_value(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.extraInfoList = this.extraInfoListOrigin = data.map(
                        x => {
                            x['index'] = UUID.generate()
                            x['save_flag'] = 1
                            return x
                        }
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private saveExtraInfo() {
        let params: any[] = []
        // params = this.extraInfoList.map(x => {
        //     delete x.index
        //     x['product_template_id'] = parseInt(this.id)
        //     return x
        // })
        for (var i of this.extraInfoList) {
            params.push({
                id: i.id,
                product_attr: i.product_attr,
                product_template_id: parseInt(this.id),
                product_value: i.product_value,
                save_flag: i.save_flag
            })
        }
        this.productService
            .save_product_extra_value(
                new RequestParams(
                    { extra_list: params },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.editable2 = false
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        if (!row.id) {
            this.extraInfoList = this.extraInfoList.filter(
                x => x.index !== row.index
            )
            this.editable2 = false
            return
        }
        this.productService
            .delete_extra_value(
                new RequestParams(
                    {
                        id: row.id
                    },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.delete_success')
                    this.$message.success(msg)
                    this.extraInfoList = this.extraInfoList.filter(
                        x => x.index !== row.index
                    )
                    this.editable2 = false
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private view_old_manual_pdf(product_url) {
        if (product_url == '') {
            this.$message.info('说明书链接不存在.')
            return
        }

        window.open(
            appConfig.server +
                '/product/get_product_manual_pdf?product_url=' +
                product_url
        )
    }

    private getDepartName(dept_id) {
        let ret: any = dept_id
        let item = this.departmentList.find(x => x.id == dept_id)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }

    private changeCategory() {
        this.$modal
            .open(
                SelectProductCategory,
                {
                    idList: [this.id]
                },
                {
                    title: this.$t('change_category')
                }
            )
            .subscribe(data => {
                this.$message.success('update success')
                this.refrushCategoryInfo()
            })
    }

    private pageService = new PageService()

    private refrushCategoryInfo() {
        this.productService
            .query_product_basic_info(
                new RequestParams(
                    { product_tmpl_id: parseInt(this.id) },
                    {
                        page: this.pageService,
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    this.data.cn_main_category = data[0].cn_main_category
                    this.data.de_main_category = data[0].de_main_category
                    this.data.category = data[0].category
                    this.data.category_id = data[0].category_id
                    this.data.z_category = data[0].z_category
                    this.data.z_sub_category = data[0].z_sub_category
                    this.data.sub_category = data[0].sub_category
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>
<style>
.progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    width: 100px;
    text-align: center;
}

.progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}

.progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}

.progress-bar li {
    padding-left: 25px;
}

.progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}

.progress-bar li:first-child:before {
    display: none;
}

.progress-bar li.active {
    background-color: #50abe4;
}

.progress-bar li.active:after {
    border-left-color: #50abe4;
}

.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

.bar-date span {
    font-size: 12px;
    color: #999;
}

.pic-box {
    width: 100%;
    height: 120px;
}

.pic-box .pic {
    margin: 10px 0px;
    width: 100px;
    height: 100px;
    display: inline-block;
    background-image: url('~@/assets/images/no_picture.png');
    background-size: cover;
    background-position: 50%;
    float: left;
}

.pic-box .prod-name {
    width: 200px;
    height: 120px;
    font-size: 16px;
    overflow: hidden;
    float: left;
}

.pic-box .prod-name p {
    text-align: center;
    margin: 40px auto;
}

.pic-box .ck-box {
    width: 200px;
    padding-top: 10px;
    float: left;
}

.pic-box .ck-box ul li {
    list-style-type: none;
    line-height: 24px;
}
</style>

<i18n>
{
    "en-us": {
        "edit": "Edit",
        "save": "Save",
        "change_category": "Change Category",
        "add": "Add",
        "operate": "Operate",
        "delete": "Delete",
        "cancel": "Discard",
        "cancel_edit": "Cancel",
        "frei_field_1": "Freifield1",
        "frei_field_2": "Freifield2",
        "frei_field_3": "Freifield3",
        "frei_field_4": "Freifield4",
        "frei_field_5": "Freifield5",
        "frei_field_6": "Freifield6",
        "frei_field_7": "Freifield7",
        "frei_field_8": "Freifield8",
        "frei_field_9": "Freifield9",
        "frei_field_10": "Freifield10",
        "product_attr": "Product Attr",
        "product_value": "Product Value",
        "default_code": "Default code",
        "name": "Product Name",
        "product_number": "Product number",
        "common_sku": "Common sku",
        "type": "Type",
        "hs_code": "Hs code",
        "category": "Category",
        "z_category": "Chinese category",
        "sub_category": "Sub category",
        "z_sub_category": "Chinese sub category",
        "department": "Department",
        "operator": "Operator",
        "product_color": "Product color",
        "product_color_chinese": "Product color chinese",
        "weight": "Weight",
        "weight1": "Brutto Weight",
        "basic_size": "Basic size",
        "max_size": "Package size",
        "carton_size": "Carton size",
        "package_size_container": "Package size container",
        "stock_calculated_time": "Stock calculated time",
        "min_pack": "Min pack",
        "pack_cate": "Pack cate",
        "purchase_method": "Purchase method",
        "location_code": "Location code",
        "prime_group": "Prime group",
        "pre_sale": "DE Pre sale",
        "uk_pre_sale": "UK Pre sale",
        "amazon_sale_only": "Amazon sale only",
        "share_stock_country": "Share stock country",
        "uk_warehouse": "Uk warehouse",
        "pack_material": "Pack material",
        "product_link": "Product link",
        "product_ve": "Product ve",
        "purchase_ve": "Purchase ve",
        "product_storage_condition": "Product storage condition",
        "china_hs_code": "China hs code",
        "europe_hs_code": "Europe hs code",
        "size1": "Size1",
        "size2": "Size2",
        "size3": "Size3",
        "new_product": "New product",
        "first_stock_time": "First stock time",
        "sale_ok": "Can be Sold",
        "purchase_ok": "Can be Purchased",
        "on_sale": "On Sale",
        "is_purchase_product": "Is Purchase Product",
        "is_set": "Is Variant Set",
        "is_pack": "Is Product Pack",
        "is_to_switch": "Is W=Z",
        "is_fba": "FBA Product",
        "is_seasonal_product": "Seasonal Product",
        "peek_season_month": "Peek Season Month",
        "length": "length(cm)",
        "width": "width(cm)",
        "height": "height(cm)",
        "is_edit_group": "Is Edit SKU",
        "edit_group_sku": "Edit Group SKU",
        "actions": {
            "part1_name": "General Infomation",
            "part2_name": "Freifield",
            "part3_name": "Product Extra Attributes",
            "confirm_cancel": "Are you sure cancel?",
            "ok": "Ok",
            "cancel": "Cancel"
        },
        "columns": {
            "prod_status": "Prod Status",
            "prod_status_sale": "Sale",
            "prod_status_stop": "Stop",
            "prod_status_waiting": "Waiting",
            "prod_status_sz_prod": "SZ Prod",
            "prod_status_uk_sale": "UK Sale",
            "prod_status_tort_stop": "Tort Stop"
        }
    },
    "zh-cn": {
        "edit": "编辑",
        "save": "保存",
        "change_category": "修改产品品类",
        "add": "新增",
        "operate": "操作",
        "delete": "删除",
        "cancel": "丢弃",
        "cancel_edit": "取消",
        "frei_field_1": "Freifield1",
        "frei_field_2": "Freifield2",
        "frei_field_3": "Freifield3",
        "frei_field_4": "Freifield4",
        "frei_field_5": "Freifield5",
        "frei_field_6": "Freifield6",
        "frei_field_7": "Freifield7",
        "frei_field_8": "Freifield8",
        "frei_field_9": "Freifield9",
        "frei_field_10": "Freifield10",
        "product_attr": "产品属性",
        "product_value": "属性值",
        "default_code": "货号SKU",
        "name": "产品名称",
        "product_number": "Product number",
        "common_sku": "通用货号",
        "type": "类型",
        "hs_code": "Hs Code",
        "category": "德文分类",
        "z_category": "中文分类",
        "sub_category": "德文子类",
        "z_sub_category": "中文子类",
        "department": "主体部门",
        "operator": "运营",
        "product_color": "产品颜色",
        "product_color_chinese": "产品颜色(中文)",
        "weight": "净重",
        "weight1": "毛重",
        "basic_size": "Basic size",
        "max_size": "Package size",
        "carton_size": "Carton size",
        "package_size_container": "Package Size Container",
        "stock_calculated_time": "库存计算时间",
        "min_pack": "最大混合数",
        "pack_cate": "包裹分类",
        "purchase_method": "采购方式",
        "location_code": "库位代码",
        "prime_group": "Prime组类",
        "pre_sale": "DE预售",
        "uk_pre_sale": "UK预售",
        "amazon_sale_only": "只在Amazon销售",
        "share_stock_country": "共享库存国家",
        "uk_warehouse": "英仓标志",
        "pack_material": "产品材质",
        "product_link": "产品链接",
        "product_ve": "产品VE",
        "purchase_ve": "采购VE",
        "product_storage_condition": "产品存储条件",
        "china_hs_code": "中国HS Code",
        "europe_hs_code": "欧洲HS Code",
        "size1": "第一长边",
        "size2": "第二长边",
        "size3": "第三长边",
        "new_product": "是否新品",
        "first_stock_time": "第一次入库时间",
        "sale_ok": "Can be Sold",
        "purchase_ok": "Can be Purchased",
        "on_sale": "On Sale",
        "is_purchase_product": "Is Purchase Product",
        "is_set": "Is Variant Set",
        "is_pack": "Is Product Pack",
        "is_to_switch": "Is W=Z",
        "is_fba": "FBA Product",
        "active": "Active",
        "is_seasonal_product": "季节性产品",
        "peek_season_month": "旺季月份",
        "length": "长(cm)",
        "width": "宽(cm)",
        "height": "高(cm)",
        "is_edit_group": "是否维护组SKU",
        "edit_group_sku": "关联维护组SKU",
        "actions": {
            "part1_name": "基础信息",
            "part2_name": "Freifield",
            "part3_name": "产品额外属性",
            "confirm_cancel": "确定要取消编辑吗?",
            "ok": "确定",
            "cancel": "取消"
        },
        "columns": {
            "prod_status": "产品状态",
            "prod_status_sale": "正常在售",
            "prod_status_stop": "淘汰停售",
            "prod_status_waiting": "待观察",
            "prod_status_sz_prod": "深圳产品",
            "prod_status_uk_sale": "UK正常在售",
            "prod_status_tort_stop": "侵权停售"
        }
    }
}
</i18n>
