<script lang="tsx">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
@Component({
    components: {
        Vnodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        }
    }
})
export default class FilterDropdownDom extends Vue {
    @Prop()
    private data: any

    private filterValue: any = ''

    private onSelectChange(e) {
        this.filterValue = e.target.value
    }

    private onFilter() {
        this.$emit('filter', this.filterValue)
    }

    private onClear() {
        this.filterValue = ''
        this.$emit('clear')
    }

    private render(h) {
        let radioStyle: any = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        }
        return (
            <div>
                <div style="padding:10px 20px;">
                    <a-radio-group
                        onchange={e => this.onSelectChange(e)}
                        v-model={this.filterValue}
                    >
                        {this.data.map(x => (
                            <a-radio style={radioStyle} value={x.value}>
                                {x.text}
                            </a-radio>
                        ))}
                    </a-radio-group>
                </div>
                <p style="margin:0;padding:5px;border-top:1px solid #ccc;">
                    <a-button
                        type="primary"
                        size="small"
                        onClick={() => this.onFilter()}
                    >
                        {this.$t('action.submit')}
                    </a-button>
                    <a-button
                        type="default"
                        size="small"
                        style="float:right;"
                        onClick={() => this.onClear()}
                    >
                        {this.$t('action.reset')}
                    </a-button>
                </p>
            </div>
        )
    }
}
</script>
<i18n>
{
  "en-us": {
    "more": "More",
    "action": {
        "submit": "Submit",
        "reset": "Reset"
    }
  },
  "zh-cn": {
    "more": "更多",
    "action": {
        "submit": "确定",
        "reset": "重置"
    }
  }
}
</i18n>
