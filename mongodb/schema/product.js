module.exports = {
    basic: {
        name: {type: String}, //产品名称
        nameAlias: {type: String},//产品名称
        code: {type: String, require: true, unique: true, index: true},//条形码等唯一产品编码，不可为空
        sequence: {type: Number},//序号
        description: {type: String, default: ''},//产品描述
        brand: {type: String},//商品品牌
        pictures: [
            {
                url: {type: String},
                no: {type: Number}
            }
        ],//宣传图（已配置好了图片,对外宣传显示的）
        copywriter: {type: String},//宣传文案
        createdOn: {type: Date, default: Date.now()},//创建时间
        createdBy: {type: String},//创建人
        modifiedOn: {type: Date, default: Date.now()},//修改时间
        modifiedBy: {type: String} //修改人
    },
    advance: {
        isPrintInTicket: {type: Boolean, default: true},//是否打印小票
        imagesTotalCount: {type: Number},//需要几张照片进行合成
        sku: [
            {
                skuCode: {type: String},
                skuInfo: {
                    productSize: {type: String},
                    productType: {type: String},
                    productColor: {type: String},
                    productPattern: {type: String},
                    productWeight: {weight: {type: Number}, unit: {type: String}}
                }
            }
        ],
        defaultPrintSetting: {
            printSize: {type: String},
            printMode: {type: String},
            printType: {type: String},
            info: {
                width: {type: Number},
                height: {type: Number}
            }
        },
        synthesisSettings: [
            {
                code: {type: String},
                name: {type: String},
                imagesTotalCount: {type: Number},
                synthesisJsons: [{
                    jsonFile: {type: String},
                    images: []
                }],
                ssConfig: {
                    foreground: [{
                        url: {type: String},
                        seq: {type: Number},
                        width: {type: Number},
                        height: {type: Number},
                        topMargin: {type: Number},
                        leftMargin: {type: Number}
                    }],
                    background: {
                        url: {type: String},
                        width: {type: Number},
                        height: {type: Number},
                        leftMargin: {type: Number},
                        topMargin: {type: Number}
                    },
                    output: {
                        width: {type: Number},
                        height: {type: Number}
                    },
                    middle: [
                        {
                            url: {type: String},
                            width: {type: Number},
                            height: {type: Number},
                            leftMargin: {type: Number},
                            topMargin: {type: Number},
                            rotate: {type: Number},//旋转角度
                            scale: {type: Number} //偏移度
                        }
                    ]
                }
            }
        ]
    },
    count: {
        visit: {type: Number, default: 0},//统计访问次数
        buys: {type: Number, default: 0}   //统计购买次数
    },
    control: {
        entityType: {type: Number},//是否为实体：1为实物，0为非实物
        keyword: {type: String}, //关键词
        isPost: {type: Boolean},//是否邮寄
        active: {type: Boolean},//商品状态,是否可用
        deleted: {type: Boolean, default: false}//商品状态,是否可用
    },
    help: {
        showStyle: {type: String},
        showStyle2: {type: String},
        isDefaultProduct: {type: Boolean}
    }
}