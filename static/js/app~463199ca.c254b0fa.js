(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app~463199ca"],{

/***/ "afbc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8c4f");
/* harmony import */ var mobile_detect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c6c6");
/* harmony import */ var mobile_detect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mobile_detect__WEBPACK_IMPORTED_MODULE_1__);

 // import OrderWrapper from '@/pages/orders/order-wrapper.vue'
// import PickingWrapper from '@/pages/picking/picking-wrapper.vue'
// import ProductWrapper from '@/pages/product/product-wrapper.vue'
// import PresaleWrapper from '@/pages/presale/presale-wrapper.vue'
// import VendorWrapper from '@/pages/purchase/vendor-wrapper.vue'
// import CommonWrapper from '@/pages/common/page-wrapper.vue'
// import ListPageWrapper from '@/pages/common/list-page-wrapper.vue'
// import SwapWrapper from '@/pages/common/swap-wrapper.vue'
// 首页入口

var home = {
  mobile: '/mobile/dashboard',
  pc: '/dashboard/workspace'
};
var originalPush = vue_router__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"].prototype.push;

vue_router__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"].prototype.push = function push(location) {
  return originalPush.call(this, location).catch(function (err) {
    return err;
  });
};

/* harmony default export */ __webpack_exports__["a"] = (new vue_router__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]({
  mode: 'hash',
  base: "/",
  routes: [{
    path: '/',
    redirect: function redirect() {
      var detect = new mobile_detect__WEBPACK_IMPORTED_MODULE_1___default.a(navigator.userAgent);
      var device = detect.mobile() ? 'mobile' : 'pc';
      return home[device];
    }
  }, {
    name: 'user-order',
    path: '/order/user-order/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("2dfd")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'picking-detail',
    path: '/picking/picking-detail/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("f32d")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'product-detail',
    path: '/product/product-detail/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("1e2c")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'vendor-detail-multi',
    path: '/purchase/vendor-detail-multi/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("c65c")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'presale-detail',
    path: '/presale/presale-detail/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("55e0")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'common-page',
    path: '/common/common-page/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("99f4")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'swap-page',
    path: '/common/swap-page/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("5ba1")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'list-page',
    path: '/common/list-page/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("2e63")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'sent-email-detail',
    path: '/common/sent-email-detail/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("c111")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    name: 'depo-detail',
    path: '/purchase/depo-detail/:id/:name',
    component: function component(resolve) {
      return Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("029b")]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe);
    },
    props: true
  }, {
    path: '*',
    redirect: '/exception/404'
  }]
}));

/***/ })

}]);