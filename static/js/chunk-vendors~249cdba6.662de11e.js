(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-vendors~249cdba6"],{

/***/ "10d5":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("250d")


/***/ }),

/***/ "250d":
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e(__webpack_require__("313e")):undefined}(this,function(t){return function(t){function e(n){if(o[n])return o[n].exports;var a=o[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var o={};return e.m=t,e.c=o,e.i=function(t){return t},e.d=function(t,o,n){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=4)}([function(e,o){e.exports=t},function(t,e,o){function n(t,e){this._amap=t,this.dimensions=["lng","lat"],this._mapOffset=[0,0],this._api=e}var a=o(0);n.prototype.dimensions=["lng","lat"],n.prototype.setZoom=function(t){this._zoom=t},n.prototype.setCenter=function(t){this._center=this._amap.lnglatToPixel(t)},n.prototype.setMapOffset=function(t){this._mapOffset=t},n.prototype.getAMap=function(){return this._amap},n.prototype.dataToPoint=function(t){var e=new AMap.LngLat(t[0],t[1]),o=this._amap.lngLatToContainer(e),n=this._mapOffset;return[o.x-n[0],o.y-n[1]]},n.prototype.pointToData=function(t){var e=this._mapOffset,t=this._amap.containerToLngLat({x:t[0]+e[0],y:t[1]+e[1]});return[t.lng,t.lat]},n.prototype.getViewRect=function(){var t=this._api;return new a.graphic.BoundingRect(0,0,t.getWidth(),t.getHeight())},n.prototype.getRoamTransform=function(){return a.matrix.create()};n.dimensions=n.prototype.dimensions,n.create=function(t,e){var o,r=e.getDom();t.eachComponent("amap",function(t){var i=e.getZr().painter.getViewportRoot();if("undefined"==typeof AMap)throw new Error("AMap api is not loaded");if(o)throw new Error("Only one amap component can exist");if(!t.__amap){var p=r.querySelector(".ec-extension-amap");p&&(i.style.left="0px",i.style.top="0px",r.removeChild(p)),p=document.createElement("div"),p.style.cssText="width:100%;height:100%",p.classList.add("ec-extension-amap"),r.appendChild(p);var s=t.get()||{};s=t.__options=a.util.clone(s);var c=t.__amap=new AMap.Map(p,s),f=t.__layer=new AMap.CustomLayer(i);f.setMap(c)}var c=t.getAMap(),f=t.getLayer();f.hide();var m=c.getZoom(),u=c.getCenter();o=new n(c,e),o.setMapOffset(t.__mapOffset||[0,0]),o.setZoom(m),o.setCenter([u.lng,u.lat]),t.coordinateSystem=o,f.show()}),t.eachSeries(function(t){"amap"===t.get("coordinateSystem")&&(t.coordinateSystem=o)})},t.exports=n},function(t,e,o){function n(t,e){return t&&e&&t[0]===e[0]&&t[1]===e[1]}t.exports=o(0).extendComponentModel({type:"amap",getAMap:function(){return this.__amap},getLayer:function(){return this.__layer},getMapOptions:function(){return this.__options},setCenterAndZoom:function(t,e){this.option.center=t,this.option.zoom=e},centerOrZoomChanged:function(t,e){var o=this.option;return!(n(t,o.center)&&e===o.zoom)},defaultOption:{center:[116.397475,39.908695],zoom:4}})},function(t,e,o){function n(t,e,o){var n,a,r,i;return i=function(){n=!1,a&&(r.apply(o,a),a=!1)},r=function(){n?a=arguments:(t.apply(o,arguments),setTimeout(i,e),n=!0)}}var a=o(0);t.exports=o(0).extendComponentView({type:"amap",render:function(t,e,o){function r(){p||o.dispatchAction({type:"amapRoam"})}function i(t){a.getInstanceByDom(o.getDom()).resize(),m.call(this,t)}var p=!0,s=t.getAMap(),c=o.getZr().painter.getViewportRoot(),f=t.coordinateSystem,m=function(e){if(!p){var n=c.parentNode.parentNode.parentNode,a=[-parseInt(n.style.left,10)||0,-parseInt(n.style.top,10)||0];c.style.left=a[0]+"px",c.style.top=a[1]+"px",f.setMapOffset(a),t.__mapOffset=a,o.dispatchAction({type:"amapRoam"})}},u=n(i,300,s);s.off("movestart",this._oldMoveHandler),s.off("zoomend",this._oldZoomEndHandler),s.off("moveend",this._oldZoomEndHandler),s.off("complete",this._oldZoomEndHandler),t.get("resizeEnable")&&s.off("resize",this._oldResizeHandler),s.on("movestart",m),s.on("zoomend",r),s.on("moveend",r),s.on("complete",r),t.get("resizeEnable")&&s.on("resize",u),this._oldMoveHandler=m,this._oldZoomEndHandler=r,this._oldResizeHandler=u,p=!1}})},function(t,e,o){o(0).registerCoordinateSystem("amap",o(1)),o(2),o(3),o(0).registerAction({type:"amapRoam",event:"amapRoam",update:"updateLayout"},function(t,e){e.eachComponent("amap",function(t){var e=t.getAMap(),o=e.getCenter();t.setCenterAndZoom([o.lng,o.lat],e.getZoom())})}),t.exports={version:"1.0.0-rc.6"}}])});
//# sourceMappingURL=echarts-amap.min.js.map

/***/ })

}]);