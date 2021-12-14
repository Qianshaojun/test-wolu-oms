<template>
    <section class="component order-detail">
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                1. {{ $t('title-1') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_mfn_lowest_price')"
                    key="de_mfn_lowest_price"
                    data-index="de_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('gb_own_lowest_price')"
                    key="gb_own_lowest_price"
                    data-index="gb_own_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_mfn_lowest_price')"
                    key="fr_mfn_lowest_price"
                    data-index="fr_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('it_mfn_lowest_price')"
                    key="it_mfn_lowest_price"
                    data-index="it_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('es_mfn_lowest_price')"
                    key="es_mfn_lowest_price"
                    data-index="es_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('nl_mfn_lowest_price')"
                    key="nl_mfn_lowest_price"
                    data-index="nl_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('pl_mfn_lowest_price')"
                    key="pl_mfn_lowest_price"
                    data-index="pl_mfn_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                2. {{ $t('title-2') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_fba_lowest_price')"
                    key="de_fba_lowest_price"
                    data-index="de_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_fba_lowest_price')"
                    key="fr_fba_lowest_price"
                    data-index="fr_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('gb_own_fba_lowest_price')"
                    key="gb_own_fba_lowest_price"
                    data-index="gb_own_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('it_fba_lowest_price')"
                    key="it_fba_lowest_price"
                    data-index="it_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('es_fba_lowest_price')"
                    key="es_fba_lowest_price"
                    data-index="es_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('nl_fba_lowest_price')"
                    key="nl_fba_lowest_price"
                    data-index="nl_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('se_fba_lowest_price')"
                    key="se_fba_lowest_price"
                    data-index="se_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('pl_fba_lowest_price')"
                    key="pl_fba_lowest_price"
                    data-index="pl_fba_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                3. {{ $t('title-3') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_b2c_lowest_price')"
                    key="de_b2c_lowest_price"
                    data-index="de_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_b2c_lowest_price')"
                    key="fr_b2c_lowest_price"
                    data-index="fr_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('gb_b2c_lowest_price')"
                    key="gb_b2c_lowest_price"
                    data-index="gb_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('it_b2c_lowest_price')"
                    key="it_b2c_lowest_price"
                    data-index="it_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('es_b2c_lowest_price')"
                    key="es_b2c_lowest_price"
                    data-index="es_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('nl_b2c_lowest_price')"
                    key="nl_b2c_lowest_price"
                    data-index="nl_b2c_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                4. {{ $t('title-4') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_ae_lowest_price')"
                    key="de_ae_lowest_price"
                    data-index="de_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_ae_lowest_price')"
                    key="fr_ae_lowest_price"
                    data-index="fr_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <!-- <a-table-column
                    :title="$t('gb_ae_lowest_price')"
                    key="gb_ae_lowest_price"
                    data-index="gb_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column> -->
                <a-table-column
                    :title="$t('gb_own_ae_lowest_price')"
                    key="gb_own_ae_lowest_price"
                    data-index="gb_own_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('it_ae_lowest_price')"
                    key="it_ae_lowest_price"
                    data-index="it_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('es_ae_lowest_price')"
                    key="es_ae_lowest_price"
                    data-index="es_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('at_ae_lowest_price')"
                    key="at_ae_lowest_price"
                    data-index="at_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('be_ae_lowest_price')"
                    key="be_ae_lowest_price"
                    data-index="be_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('lu_ae_lowest_price')"
                    key="lu_ae_lowest_price"
                    data-index="lu_ae_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                5. {{ $t('title-5') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;width:320px;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_prime_normal_price')"
                    key="de_prime_normal_price"
                    data-index="de_prime_normal_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('de_prime_fee')"
                    key="de_prime_discount_price"
                    data-index="de_prime_discount_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                6. {{ $t('title-6') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;width:320px;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('fr_cd_mfn_price')"
                    key="fr_cd_mfn_price"
                    data-index="fr_cd_mfn_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_cd_fbc_price')"
                    key="fr_cd_fbc_price"
                    data-index="fr_cd_fbc_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                7. {{ $t('title-10') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="'DE-速卖通' + $t('bhs_lowest_price')"
                    key="de_ae_untax_lowest_price"
                    data-index="de_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'FR-速卖通' + $t('bhs_lowest_price')"
                    key="fr_ae_untax_lowest_price"
                    data-index="fr_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'GB英仓-速卖通' + $t('bhs_lowest_price')"
                    key="gb_ae_untax_lowest_price"
                    data-index="gb_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'IT-速卖通' + $t('bhs_lowest_price')"
                    key="it_ae_untax_lowest_price"
                    data-index="it_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'ES-速卖通' + $t('bhs_lowest_price')"
                    key="es_ae_untax_lowest_price"
                    data-index="es_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'AT-速卖通' + $t('bhs_lowest_price')"
                    key="at_ae_untax_lowest_price"
                    data-index="at_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'BE-速卖通' + $t('bhs_lowest_price')"
                    key="be_ae_untax_lowest_price"
                    data-index="be_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'LU-速卖通' + $t('bhs_lowest_price')"
                    key="lu_ae_untax_lowest_price"
                    data-index="lu_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'PL-速卖通' + $t('bhs_lowest_price')"
                    key="pl_ae_untax_lowest_price"
                    data-index="pl_ae_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                8. {{ $t('title-11') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="'DE-WishExpress' + $t('bhs_lowest_price')"
                    key="de_we_untax_lowest_price"
                    data-index="de_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'FR-WishExpress' + $t('bhs_lowest_price')"
                    key="fr_we_untax_lowest_price"
                    data-index="fr_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'GB英仓-WishExpress' + $t('bhs_lowest_price')"
                    key="gb_we_untax_lowest_price"
                    data-index="gb_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'IT-WishExpress' + $t('bhs_lowest_price')"
                    key="it_we_untax_lowest_price"
                    data-index="it_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'ES-WishExpress' + $t('bhs_lowest_price')"
                    key="es_we_untax_lowest_price"
                    data-index="es_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'AT-WishExpress' + $t('bhs_lowest_price')"
                    key="at_we_untax_lowest_price"
                    data-index="at_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'NL-WishExpress' + $t('bhs_lowest_price')"
                    key="nl_we_untax_lowest_price"
                    data-index="nl_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'PL-WishExpress' + $t('bhs_lowest_price')"
                    key="pl_we_untax_lowest_price"
                    data-index="pl_we_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                9. {{ $t('title-12') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="'DE-WishExpress' + $t('hs_lowest_price')"
                    key="de_we_lowest_price"
                    data-index="de_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'FR-WishExpress' + $t('hs_lowest_price')"
                    key="fr_we_lowest_price"
                    data-index="fr_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'GB英仓-WishExpress' + $t('hs_lowest_price')"
                    key="gb_we_lowest_price"
                    data-index="gb_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'IT-WishExpress' + $t('hs_lowest_price')"
                    key="it_we_lowest_price"
                    data-index="it_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'ES-WishExpress' + $t('hs_lowest_price')"
                    key="es_we_lowest_price"
                    data-index="es_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'AT-WishExpress' + $t('hs_lowest_price')"
                    key="at_we_lowest_price"
                    data-index="at_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'NL-WishExpress' + $t('hs_lowest_price')"
                    key="nl_we_lowest_price"
                    data-index="nl_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'PL-WishExpress' + $t('hs_lowest_price')"
                    key="pl_we_lowest_price"
                    data-index="pl_we_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                10. {{ $t('title-13') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="'DE-WishStandard' + $t('bhs_lowest_price')"
                    key="de_ws_untax_lowest_price"
                    data-index="de_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'FR-WishStandard' + $t('bhs_lowest_price')"
                    key="fr_ws_untax_lowest_price"
                    data-index="fr_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'GB英仓-WishStandard' + $t('bhs_lowest_price')"
                    key="gb_ws_untax_lowest_price"
                    data-index="gb_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'IT-WishStandard' + $t('bhs_lowest_price')"
                    key="it_ws_untax_lowest_price"
                    data-index="it_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'ES-WishStandard' + $t('bhs_lowest_price')"
                    key="es_ws_untax_lowest_price"
                    data-index="es_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'AT-WishStandard' + $t('bhs_lowest_price')"
                    key="at_ws_untax_lowest_price"
                    data-index="at_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'NL-WishStandard' + $t('bhs_lowest_price')"
                    key="nl_ws_untax_lowest_price"
                    data-index="nl_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'PL-WishStandard' + $t('bhs_lowest_price')"
                    key="pl_ws_untax_lowest_price"
                    data-index="pl_ws_untax_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                11. {{ $t('title-14') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="'DE-WishStandard' + $t('hs_lowest_price')"
                    key="de_ws_lowest_price"
                    data-index="de_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'FR-WishStandard' + $t('hs_lowest_price')"
                    key="fr_ws_lowest_price"
                    data-index="fr_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'GB英仓-WishStandard' + $t('hs_lowest_price')"
                    key="gb_ws_lowest_price"
                    data-index="gb_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'IT-WishStandard' + $t('hs_lowest_price')"
                    key="it_ws_lowest_price"
                    data-index="it_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'ES-WishStandard' + $t('hs_lowest_price')"
                    key="es_ws_lowest_price"
                    data-index="es_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'AT-WishStandard' + $t('hs_lowest_price')"
                    key="at_ws_lowest_price"
                    data-index="at_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'NL-WishStandard' + $t('hs_lowest_price')"
                    key="nl_ws_lowest_price"
                    data-index="nl_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="'PL-WishStandard' + $t('hs_lowest_price')"
                    key="pl_ws_lowest_price"
                    data-index="pl_ws_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
        <a-card>
            <h3 style="margin-top:10px;color:#000;font-weight:600;">
                12. {{ $t('title-15') }}
            </h3>
            <a-table
                :dataSource="[data]"
                :pagination="false"
                style="table-layout:fixed;width:320px;"
                rowKey="index"
                bordered
            >
                <a-table-column
                    :title="$t('de_manomano_lowest_price')"
                    key="de_mano_lowest_price"
                    data-index="de_mano_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
                <a-table-column
                    :title="$t('fr_manomano_lowest_price')"
                    key="fr_mano_lowest_price"
                    data-index="fr_mano_lowest_price"
                    align="center"
                    width="100px"
                ></a-table-column>
            </a-table>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { Form } from 'ant-design-vue'

@Component({
    components: {}
})
export default class PreProductPriceCheckViewItem extends Vue {
    @Prop()
    detail: any

    private id: any = 0

    private data: any = {}

    private activeKey: any = ''

    private activeSubKey: any = ''
    private subDefaultKey: any = ''
    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Watch('detail')
    private onDetailChange() {
        if (this.detail) {
            this.data = Object.assign({}, this.detail)
        } else {
            this.data = {}
        }
    }

    private mounted() {
        if (this.detail) {
            this.data = Object.assign({}, this.detail)
        }
    }
}
</script>

<i18n>
{
  "en-us":{
    "at_ae_lowest_price":"at_ae_lowest_price",
    "be_ae_lowest_price":"be_ae_lowest_price",
    "de_ae_lowest_price":"de_ae_lowest_price",
    "de_b2c_lowest_price":"de_b2c_lowest_price",
    "de_fba_lowest_price":"de_fba_lowest_price",
    "de_mfn_lowest_price":"de_mfn_lowest_price",
    "de_prime_fee":"de_prime_fee",
    "de_prime_normal_price":"de_prime_normal_price",
    "es_ae_lowest_price":"es_ae_lowest_price",
    "es_b2c_lowest_price":"es_b2c_lowest_price",
    "es_fba_lowest_price":"es_fba_lowest_price",
    "es_mfn_lowest_price":"es_mfn_lowest_price",
    "fr_ae_lowest_price":"fr_ae_lowest_price",
    "fr_b2c_lowest_price":"fr_b2c_lowest_price",
    "fr_cd_fbc_price":"fr_cd_fbc_price",
    "fr_cd_mfn_price":"fr_cd_mfn_price",
    "fr_fba_lowest_price":"fr_fba_lowest_price",
    "fr_mfn_lowest_price":"fr_mfn_lowest_price",
    "gb_ae_lowest_price":"gb_ae_lowest_price",
    "gb_b2c_lowest_price":"gb_b2c_lowest_price",
    "gb_own_ae_lowest_price":"gb_own_ae_lowest_price",
    "gb_own_fba_lowest_price":"gb_own_fba_lowest_price",
    "gb_own_lowest_price":"gb_own_lowest_price",
    "it_ae_lowest_price":"it_ae_lowest_price",
    "it_b2c_lowest_price":"it_b2c_lowest_price",
    "it_fba_lowest_price":"it_fba_lowest_price",
    "it_mfn_lowest_price":"it_mfn_lowest_price",
    "lu_ae_lowest_price":"lu_ae_lowest_price",
    "nl_b2c_lowest_price":"nl_b2c_lowest_price",
    "nl_fba_lowest_price":"nl_fba_lowest_price",
    "nl_mfn_lowest_price":"nl_mfn_lowest_price",
    "pl_fba_lowest_price":"pl_fba_lowest_price",
    "pl_mfn_lowest_price":"pl_mfn_lowest_price",
    "se_fba_lowest_price":"se_fba_lowest_price",
    "shipping_fee":"shipping_fee",
    "title-1":"MFN最低定价",
    "title-2":"FBA最低定价",
    "title-3":"B2C最低定价",
    "title-4":"速卖通最低定价",
    "title-5":"Prime最低定价",
    "title-6":"CD最低定价",
    "title-7":"预调价备注",
    "title-8":"参考市价",
    "title-9":"运营审核意见",
    "title-10":"速卖通不含税最低定价",
    "title-11":"Wish Express不含税最低定价",
    "title-12":"Wish Express含税最低定价",
    "title-13":"Wish Standard不含税最低定价",
    "title-14":"Wish Standard含税最低定价",
    "title-15":"Manomano最低定价",
    "de_mfn_price":"de_mfn_price",
    "uk_mfn_price":"uk_mfn_price",
    "pass":"passed",
    "no_pass":"not_passed",
    "memo":"Memo",
    "reason":"Approve Reason",
    "is_pass":"Is Pass",
    "de_manomano_lowest_price":"de_manomano_lowest_price",
    "fr_manomano_lowest_price":"fr_manomano_lowest_price",
    "hs_lowest_price": "-hs-Lowest-Price",
    "bhs_lowest_price": "-bhs-Lowest-Price"
  },
  "zh-cn":{
    "at_ae_lowest_price":"AT-速卖通最低定价",
    "be_ae_lowest_price":"BE-速卖通最低定价",
    "de_ae_lowest_price":"DE-速卖通最低定价",
    "de_b2c_lowest_price":"DE-B2C最低定价",
    "de_fba_lowest_price":"DE-FBA最低定价",
    "de_mfn_lowest_price":"DE-MFN最低定价",
    "de_prime_fee":"DE-Prime折扣定价",
    "de_prime_normal_price":"DE-Prime正常定价",
    "es_ae_lowest_price":"ES-速卖通最低定价",
    "es_b2c_lowest_price":"ES-B2C最低定价",
    "es_fba_lowest_price":"ES-FBA最低定价",
    "es_mfn_lowest_price":"ES-MFN最低定价",
    "fr_ae_lowest_price":"FR-速卖通最低定价",
    "fr_b2c_lowest_price":"FR-B2C最低定价",
    "fr_cd_fbc_price":"FR-CD-FBC最低定价",
    "fr_cd_mfn_price":"FR-CD-MFN最低定价",
    "fr_fba_lowest_price":"FR-FBA最低定价",
    "fr_mfn_lowest_price":"FR-最低定价",
    "gb_ae_lowest_price":"GB-速卖通最低定价",
    "gb_b2c_lowest_price":"GB-B2C最低定价",
    "gb_own_ae_lowest_price":"GB英仓速卖通最低定价",
    "gb_own_fba_lowest_price":"英国仓发FBA最低定价",
    "gb_own_lowest_price":"GB-英仓最低定价",
    "it_ae_lowest_price":"IT-速卖通最低定价",
    "it_b2c_lowest_price":"IT-B2C最低定价",
    "it_fba_lowest_price":"IT-FBA最低定价",
    "it_mfn_lowest_price":"IT-MFN最低定价",
    "lu_ae_lowest_price":"LU-速卖通最低定价",
    "nl_b2c_lowest_price":"NL-B2C最低定价",
    "nl_fba_lowest_price":"NL-FBA最低定价",
    "nl_mfn_lowest_price":"NL-MFN最低定价",
    "pl_fba_lowest_price":"PL-FBA最低定价",
    "pl_mfn_lowest_price":"PL-MFN最低定价",
    "se_fba_lowest_price":"SE-FBA最低定价",
    "shipping_fee":"shipping_fee",
    "title-1":"MFN最低定价",
    "title-2":"FBA最低定价",
    "title-3":"B2C最低定价",
    "title-4":"速卖通最低定价",
    "title-5":"Prime最低定价",
    "title-6":"CD最低定价",
    "title-7":"预调价备注",
    "title-8":"参考市价",
    "title-9":"运营审核意见",
    "title-10":"速卖通不含税最低定价",
    "title-11":"Wish Express不含税最低定价",
    "title-12":"Wish Express含税最低定价",
    "title-13":"Wish Standard不含税最低定价",
    "title-14":"Wish Standard含税最低定价",
    "title-15":"Manomano最低定价",
    "de_mfn_price":"参考DE-MFN-市价",
    "uk_mfn_price":"参考UK-MFN-市价",
    "pass":"通过",
    "no_pass":"不通过",
    "memo":"备注",
    "reason":"审核原因",
    "is_pass":"是否通过",
    "de_manomano_lowest_price":"DE Manomano最低定价",
    "fr_manomano_lowest_price":"FR Manomano最低定价",
    "hs_lowest_price": "含税最低定价",
    "bhs_lowest_price": "不含税最低定价"
  }
}
</i18n>
