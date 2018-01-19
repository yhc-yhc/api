/**
 * Created by storm.ki on 14-9-16.
 */

module.exports = {
    orderCode: {type: String, length: 20, index: true},//终端2位,时间6位,设备号4位,序号8位
    flowNo: {type: Number, default: -1},//流水号
    transCode: {type: String},//交易号
    terminalId: {type: String},//终端编号
    outletId: {type: String},//线下门店编号
    locationId: {type: String},//locationId
    parkId: {type: String},//parkId
    dealPlatform: {type: String},//交易平台，区分线上线下和移动端
    channelId: {type: String},//渠道ID,推荐渠道id,channelId
    uId: {type: String},//未知id
    orderProducts: { //所有商品项
        items: [
            {
                productId: {type: String},
                productName: {type: String},
                productImage: {type: String},
                productSkuCode: {type: String},//用于指定商品规格
                productEntityType: {type: Number},//实体，虚拟商品（1，0）
                isPrintInTicket: {type: Boolean},
                storeId: {type: String},
                photoId: {type: String},
                unitPrice: {type: Number},
                qty: {type: Number},
                totalPrice: {type: Number},
                usePhotos: [
                    {
                        photoId: {type: String},
                        photoUrl: {type: String},
                        photoStorageServerIP: {type: String},
                        photoIp: {type: String},
                        ppCodes: [
                            {type: String}
                        ]
                    }
                ],
                composePreviews: [
                    {type: String}
                ],
                softCopyCode: [{type: String}]
            }
        ],
        virtualProducts: [//虚拟货品数组
            {
                productId: {type: String},
                productType: {type: String},//pp＋等虚拟货品
                code: {type: String}//pp＋等虚拟货品的Code
            }
        ],
        resume: {
            express: {type: String},//计算公式
            preferentialPrice: {type: Number},//节省了多少钱(总共)
            totalPrice: {type: Number},//总价
            totalCount: {type: Number},//购物车内商品总数量
            straightwayPreferentialPrice: {type: Number, default: 0},//抵扣费用(优惠券)
            promotionPreferentialPrice: {type: Number, default: 0},//促销优惠(第二张80)
            resultPrice: {type: Number} //原始总价
        }
    },
    orderItems: [
        {//打印商品项
            isPrintInTicket: {type: Boolean},
            itemCode: {type: String},//orderCode－序列号
            productName: {type: String},//商品名
            normalFileName: {type: String},//文件名
            normalFilePath: {type: String},//文件路径
            normalHttpFilePath: {type: String},//文件网络路径,
            silverFileName: {type: String},//银色layer文件名
            silverFilePath: {type: String},//银色layer文件路径
            totalQuantity: {type: Number},//总数量
            completedQuantity: {type: Number, default: 0},//已完成数量
            sourceIPAddress: {type: String},//数据库以及文件服务器IP
            printSize: {type: String},//打印尺寸
            printMode: {type: String},//打印模式
            printType: {type: String}//打印类型
        }
    ],
    orderStatus: {
        status: {type: Number},//订单状态：1等待买家付款，2买家已付款（等待卖家发货），3卖家已发货（等待买家确认），4交易成功，5交易关闭,订单冻结
        onSitePayConfirm: {type: Boolean, default: false},//线下付款确认
        remark: {type: String, default: ''} //订单状态备注
    },
    payInfo: {
        payPrice: {type: Number},//支付价格
        payType: {type: Number},//支付方式：0 支付宝 1 银联  2 VISA信用卡 3 代付 4 分期 5自提,6.paypal,7webchat,8iPayLink,9 零元支付
        payTime: {type: Date},//支付时间
        payStatus: {type: String},//支付状态
        payUser: {type: String},//支付人签名（允许匿名）
        buyersUserId: {type: String},//购买者
        buyTime: {type: Date},//购买者下单时间(成交时间)
        buyProductsInfo: {type: String},//购买的商品信息
        buyersLocation: {
            area: {type: String},//国家（区域）
            provinces: {type: String},//省份
            city: {type: String},//城市
            county: {type: String},//区县
            detailedAddress: {type: String},//详细地址
            zip: {type: String},//邮编
            consignee: {type: String},//收货人姓名
            mobileNum: {type: String},//手机号码
            telephone: {type: String}//电话号码
        },//送货地址
        verifyTime: {type: Date},//确认时间
        buyerCardInfo: {
            holder: {
                type: String
            }, //卡持有者姓名
            payerAuth: {
                type: String
            }, //付款人认证状态, Y 已进行3D登记认证并已认证成功 N 已进行3D登记认证并认证失败 P 认证核对中 A 未在3D安全程序上登记  U 3D登记核对未经处理
            payerIp: {
                type: String
            }, //付款人源ip地址
            payMethod: {
                type: String
            }, //visa,master...
            cardCountry: {
                type: String
            }, //发卡国家, HK香港...
            panFirstLast4: {
                type: String
            }, //卡号前后4四位,中间用*代替
            paySign: {
                type: String
            }, //信用卡支付签名
            payCur: {
                type: String
            }, //币种
            payApprovalCode: {
                type: String
            }, //信用卡核对码
            payTransactionTime: {
                type: String
            } //信用卡交易时间
        }
    },
    invoiceInfo: {
        invoiceType: {type: Number},//发票类型,0,纸质发票,1 电子发票
        invoiceTitle: {type: Number},//发票抬头,0 个人 1 单位
        invoiceCompanyName: {type: String},//单位名称
        invoiceContent: {type: String},//发票内容,0 固定为影像服务
        invoiceAddress: {//发票邮寄地址
            area: {type: String},		    //国家（区域）
            provinces: {type: String},		//省份
            city: {type: String},		    //城市
            county: {type: String},		    //区县
            detailedAddress: {type: String},//详细地址
            zip: {type: String},		    //邮编
            consignee: {type: String},		//收货人姓名
            mobileNum: {type: String},		//手机号码
            telephone: {type: String}		//电话号码
        }
    },
    logisticsInfo: {
        code: {type: String},//物流单号
        company: {type: String},//物流公司
        sendTime: {type: Date},//发货时间
        logisticsType: {type: String},//快递方式
        fee: {type: Number},//快递费用
        payment: {type: Number} //物流分账
    },
    couponsList: [{type: String}],
    usePPCodes: [{type: String}],
    deliveryType: {type: Number},//送货方式,物流(0)、自提(1)、直送(2),虚拟类商品无须快递(3)
    costPrice: {type: Number},//成本总价，用于结算统计，后期拓展
    charge: {type: Number, default: 0},//订单支付总价
    orderPrintStatus: {type: Number, default: 1},//1.未打印,2.打印中,3.打印完成,4.打印出错
    isBack: {type: Boolean, default: false},
    isPick: {type: Boolean, default: false},//是否可提货
    collected: {type: Boolean, default: false},//运营商提取状态
    createdOn: {type: Date, default: Date.now},//订单创建时间
    createdBy: {type: String},//创建人
    modifiedOn: {type: Date, default: Date.now},//修改时间
    modifiedBy: {type: String},//修改人
    remark: {type: String, default: ''},

    isDelete: {type: Boolean, default: false},//是否被用户删除

    //================assist Fields
    actionHistory: [
        {actionDate: {type: Date}, actionContent: {type: String}}
    ],
    Freeze: {
        previousOrderStatus: {type: String},//冻结前状态
        FreezeTimeLong: {type: Number} //订单冻结时间（在提交订单N分钟以后不可操作，待商量），值：－20  当20分钟后订单已提交且支付成功后，不可操作该订单)
    },
    softCopyCodeSet: []
}
