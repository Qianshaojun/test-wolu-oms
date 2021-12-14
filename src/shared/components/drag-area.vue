<template>
    <section class="component">
        <div
            ref="container"
            id="drag-area"
            :style="{ height: getDragAreaHeight }"
            :class="{ moving: moving, 'flex-column': true }"
            @mouseup="mouseUp"
            @mousemove="mouseMove"
            @mouseleave="mouseLeave"
        >
            <a-card class="margin-y up-div" :style="{ height: getUpDivHeight }">
                <div v-if="this.$slots.up" class="top-wrapper flex-auto">
                    <slot name="up"></slot>
                </div>
            </a-card>
            <div
                class="split"
                ref="split"
                @mousedown="splitMouseDown"
                @mouseup="splitMouseUp"
            ></div>
            <a-card
                class="margin-y down-div down-wrap"
                :style="{ height: getDownDivHeight }"
            >
                <div v-if="this.$slots.down">
                    <slot name="down"></slot>
                </div>
            </a-card>
        </div>
    </section>
</template>

<style lang="less" scoped>
.split {
    width: 100%;
    height: 1px;
    background: rgb(200, 200, 200);
    width: 100%;
    height: 2px;
    padding: 2px 0;
    border: 2px;
    &:hover {
        cursor: row-resize;
    }
}

.up-div {
    width: 100%;
    height: auto;
    overflow: hidden;
}
.down-div {
    width: 100%;
    height: 300px;
    overflow: visible;
}

#drag-area {
    width: 100%;
    display: block;
    overflow: hidden;
    overflow-y: scroll;
    &.moving {
        cursor: row-resize !important;
    }
}
</style>

<script lang="tsx">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator'

@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        }
    }
})
export default class DragArea extends Vue {
    @Ref('split')
    private split!: HTMLDivElement

    @Ref('container')
    private container!: HTMLDivElement

    @Prop()
    private formShow: any

    @Watch('formShow')
    private onFormShowChange() {
        this.offtop = this.container.offsetTop + 125
        this.getDragAreaHeight
        // this.upHeight = Math.ceil(this.dragAreaHeight * 0.6)
        this.downHeight += this.diffByDrag

        this.$emit('traggle', [this.upHeight, this.downHeight])
    }

    private dragAreaHeight: any = 0
    private offtop: any = 0
    private upHeight = 0
    private downHeight = 0
    private moving = false
    private diffByDrag = 0 //隐藏查询按钮前后，content部分的高度差
    private get getUpDivHeight() {
        return `${this.upHeight}px`
    }
    private get getDownDivHeight() {
        return `${this.downHeight}px`
    }

    private get getDragAreaHeight() {
        let cHeight = document.documentElement.clientHeight
        let old = this.dragAreaHeight
        this.dragAreaHeight = Math.ceil(cHeight - this.offtop)
        this.dragAreaHeight =
            this.dragAreaHeight >= 500 ? this.dragAreaHeight : 500
        this.diffByDrag = this.dragAreaHeight - old
        return `${this.dragAreaHeight}px`
    }

    public created() {}

    public mounted() {
        this.offtop = this.container.offsetTop + 125
        this.getDragAreaHeight
        this.upHeight = Math.ceil(this.dragAreaHeight * 0.6)
        this.downHeight = this.dragAreaHeight - this.upHeight
        // this.setupDrag()
        this.$emit('traggle', [this.upHeight, this.downHeight])
        let _that = this
        document.onmouseup = function() {
            _that.moving = false
            // _that.container.onmousemove = null
            // _that.container.onmouseup = null
        }
    }

    // private setupDrag() {
    //     let _that = this

    //     this.container.onmouseleave = () => (this.moving = false)
    //     this.split.addEventListener('onmousedown', function() {
    //         _that.moving = true

    // _that.container.onmousemove = ({ movementY }) => {
    //     if (!_that.moving) return
    //     if (
    //         (movementY < 0 && _that.upHeight <= 200) ||
    //         (movementY > 0 && _that.downHeight <= 200)
    //     ) {
    //         _that.moving = false
    //         return
    //     }

    //     _that.upHeight = Math.max(_that.upHeight + movementY, 200)
    //     _that.downHeight = Math.max(
    //         _that.dragAreaHeight - _that.upHeight,
    //         200
    //     )
    //     _that.$emit('traggle', [_that.upHeight, _that.downHeight])
    // }
    // _that.container.onmouseup = () => (_that.moving = false)
    //     })
    //     document.onmouseup = function() {
    //         _that.moving = false
    //         _that.container.onmousemove = null
    //         _that.container.onmouseup = null
    //     }
    // }

    private preventDrag(event) {
        event.preventDefault()
    }

    private splitMouseDown() {
        this.moving = true
    }

    private splitMouseUp() {
        this.moving = false
    }

    private mvY: any = 0

    private mouseMove(e) {
        if (this.moving) {
            e.preventDefault()
            let movementY = e.movementY

            this.mvY += movementY

            if (
                (movementY < 0 && this.upHeight <= 200) ||
                (movementY > 0 && this.downHeight <= 200)
            ) {
                this.moving = false
                return
            }

            this.upHeight = Math.max(this.upHeight + movementY, 200)

            this.downHeight = Math.max(this.dragAreaHeight - this.upHeight, 200)
            // this.$emit('traggle', [this.upHeight, this.downHeight])
        }
    }

    private mouseUp() {
        this.moving = false
        this.mvY = 0
        this.$emit('traggle', [this.upHeight, this.downHeight])
    }

    private mouseLeave() {
        this.moving = false
    }
}
</script>

<i18n>
{
  "en-us":{
    "search":"Search",
    "reset":"Reset",
    "more":"More",
    "save_search":"Save Search",
    "conditions":"Favorite",
    "filter_conditions": "Filters"
  },
  "zh-cn":{
    "search":"查询",
    "reset":"重置",
    "more":"更多",
    "save_search":"收藏",
    "conditions":"用户收藏",
    "filter_conditions": "固定条件"
  }
}
</i18n>
