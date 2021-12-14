import XLSX from 'xlsx'

export class XLSXUtil {
    private workbook

    constructor() {
        this.workbook = XLSX.utils.book_new()
    }

    public readFromJson(column, data, width: number | number[] = 100) {
        let size: number = 65500
        let count = Math.ceil(data.length / size)
        for (let i = 0; i < count; i++) {
            let subData = data.slice(size * i, size * (i + 1))
            const json = [column, ...subData]
            const sheet = XLSX.utils.json_to_sheet(json, {
                header: Object.keys(column),
                skipHeader: true
            })
            const cols =
                width instanceof Array
                    ? width.map(w => ({ wch: w }))
                    : Array.from(
                          { length: Object.keys(column).length },
                          () => ({
                              wch: width
                          })
                      )

            sheet['!cols'] = cols
            XLSX.utils.book_append_sheet(
                this.workbook,
                sheet,
                'sheet' + (i + 1)
            )
        }
    }

    public exportFile(filename) {
        const fileBlob = new Blob([
            XLSX.write(this.workbook, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'array'
            })
        ])

        this.saveAs(fileBlob, filename)
    }

    private saveAs(obj, fileName) {
        const tmpLink = document.createElement('a')
        tmpLink.download = fileName || 'download'
        tmpLink.href = URL.createObjectURL(obj)
        tmpLink.click()
        setTimeout(() => {
            URL.revokeObjectURL(obj)
        }, 1000)
    }
}
