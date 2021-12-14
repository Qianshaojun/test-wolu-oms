### 项目中用到的公共组件，缓存，其它小工具等

## 缓存

页面中用到的缓存都放在 src\store 中，包括用户的登录信息等。
其中 src\store\modules 中的缓存，在页面使用时需要用 namespace 引入。
例如：

    ```
    const datasModule = namespace('datasModule')  //引入

    @datasModule.State                            //声明
    private currencyList

    @datasModule.Action                           //声明
    private getcurrency

    ```

## 过滤

页面中的参数可使用 管道符（|）来使用 filter 函数进行进一步的处理，项目中用到到 filter 函数都集中放在 src\shared\filters 目录下

## 公共组件

项目中用到到公共组件都集中放在 src\shared\components 目录下，使用时在页面中引入相应的组件即可,个别组件放在了src/components/common 目录下

## 菜单

--- 早期版本
开发新页面时，需要先在菜单中添加相应的名称，菜单文件位于 src\json 目录下， 分 PC 和手机端两个菜单文件
示例：

    ```
    {
        "id": 15,
        "name": "product",
        "children": [
            {
                "id": 16,
                "icon": "shop",
                "name": "product-manage"
            },
            {
                "id": 3,
                "icon": "edit",
                "name": "product-edit"
            },
            {
                "id": 62,
                "icon": "search",
                "name": "product-query"
            }
        ]
    }
    ```

--- 现在的版本菜单已从后端接口返回

## 登录
用户登录后的信息都存储在 src\store\moduled\user.module.ts 中,使用时需要先在页面中引入userModule


## 认证
对用户权限的认证使用的是vue的路由守卫， 主要文件目录 src\bootstrap\boots\guard.boot.ts

## 请求的异常处理
对http请求的返回数据的处理及异常情况处理等，都在 src\bootstrap\boots\http.boot.ts 中

## 组件间传值，监测值变化等
使用@prop(), @Emit, @Watch('要监测的变量')


