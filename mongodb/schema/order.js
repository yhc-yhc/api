/**
 * Created by storm.ki on 14-9-16.
 */

module.exports = {
    orderCode: { type: String, length: 16, index: true, unique: true }, //生成订单号(16位)终端2位,设备号2位,时间6位,序号6位（对内）
    flowNo: { type: Number, default: -1 }, //流水号
    transCode: { type: String, unique: true }, //交易号（对外）
    paymentResultInfo: { //第三方返回数据（wirecard， 支付宝）
        channel: { type: String }, // wirecard/Alipay
        status: { type: String }, //交易成功时间
        completionTimeStamp: { type: String }, //
        transactionId: { type: String }, //交易号（第三方平台生成）
        parentTransactionId: { type: String }, //父类交易号（第三方平台生成）
        groupTransactionId: { type: String }, //交易组号（第三方平台生成）,
        voidrequestId: { type: String }, //wirecard void-purchase info
        voidTransactionId: { type: String }, //wirecard void-purchase info
        voidParentTransactionId: { type: String }, //wirecard void-purchase info
        voidGroupTransactionId: { type: String }, //wirecard void-purchase info
        voidPrice: { type: String }, //wirecard void-purchase info
        voidCurrency: { type: String }, //wirecard void-purchase info
        completionTimeStamp: { type: String }, //wirecard void-purchase info
        refundPrice: { type: String }, //aliPay refund info
        refundTime: { type: String }, //aliPay refund info
        remark: { type: String } //备注
    },
    terminalId: { type: String }, //终端编号, 01 App, 02 Web, 03 线下
    outletId: { type: String }, //线下门店编号
    locationId: { type: String }, //locationId
    siteId: { type: String }, //siteId
    currency: { type: String, default: 'CNY' }, //currency
    dealPlatform: { type: String }, //交易平台，区分线上线下和移动端
    channelId: { type: String }, //渠道ID,推荐渠道id,channelId
    dealingKey: { type: String },
    orderProducts: { //所有商品项
        entity: [ //实物
            {
                productId: { type: String },
                productName: { type: String },
                productImage: { type: String },
                productSkuCode: { type: String }, //用于指定商品规格
                productEntityType: { type: Number }, //实体，虚拟商品（1，0）
                isPrintInTicket: { type: Boolean },
                storeId: { type: String },
                //siteId: {type: String},
                photoId: { type: String },
                currency: { type: String }, //货币类型
                unitPrice: { type: Number }, //单价
                count: { type: Number }, //数量
                qty: { type: Number },
                totalPrice: { type: Number },
                coupons: [{
                    code: { type: String },
                    discount: { type: Number } //减额
                }], //优惠券
                usePhotos: [{
                    photoId: { type: String },
                    photoUrl: { type: String },
                    photoStorageServerIP: { type: String },
                    photoIp: { type: String },
                    ppCodes: [{ type: String }],
                    locationId: { type: String }
                }],
                composePreviews: [
                    { type: String }
                ],
                softCopyCode: [{ type: String }]
            }
        ],
        virtualProducts: [ //虚拟货品数组
            {
                productId: { type: Array }, //虚拟货币的Code（一日卡，PP+），或者照片Id
                productType: { type: Number }, //虚拟货品，单张照片 0 一日卡 1
                productName: { type: String }, //虚拟货品名字
                photoDate: { type: Date }, //要激活的照片的时间
                PPCode: { type: String }, //ppCode
                //siteId: {type: String},
                currency: { type: String }, //货币类型
                unitPrice: { type: Number }, //单价
                count: { type: Number }, //数量
                coupons: [{
                    code: { type: String },
                    discount: { type: Number } //减额
                }], //优惠券
                straightwayPreferentialPrice: { type: Number, default: 0 }, //抵扣费用(优惠券)
                promotionPreferentialPrice: { type: Number, default: 0 }, //促销优惠(第二张80) --- 单个物品的优惠
                totalPrice: { type: Number }, //总价
                resultPrice: { type: Number }, //原始总价
                CNYCharge: { type: Number } //人民币总价
            }
        ],
        resume: {
            express: { type: String }, //计算公式(折扣)
            preferentialPrice: { type: Number }, //节省了多少钱(总共)
            totalPrice: { type: Number }, //实际总价
            totalCount: { type: Number }, //购物车内商品总数量
            straightwayPreferentialPrice: { type: Number, default: 0 }, //抵扣费用(优惠券)
            promotionPreferentialPrice: { type: Number, default: 0 }, //促销优惠 --- 整个购物车的优惠
            logisticsFee: { type: Number, defalut: 0 }, //邮费
            resultPrice: { type: Number }, //原始总价
            currency: { type: String } //订单实际支付的货币类型
        }
    },
    orderItems: [{ //打印商品项
        isPrintInTicket: { type: Boolean },
        itemCode: { type: String }, //orderCode－序列号
        productName: { type: String }, //商品名
        normalFileName: { type: String }, //文件名
        normalFilePath: { type: String }, //文件路径
        normalHttpFilePath: { type: String }, //文件网络路径,
        silverFileName: { type: String }, //银色layer文件名
        silverFilePath: { type: String }, //银色layer文件路径
        totalQuantity: { type: Number }, //总数量
        completedQuantity: { type: Number, default: 0 }, //已完成数量
        sourceIPAddress: { type: String }, //数据库以及文件服务器IP
        printSize: { type: String }, //打印尺寸
        printMode: { type: String }, //打印模式
        printType: { type: String } //打印类型
    }],
    orderStatus: {
        status: { type: Number, default: 1 }, //订单状态：1等待买家付款，2买家正在付款，3买家已付款（等待卖家发货），4卖家已发货（等待买家确认），5交易成功，6交易关闭,订单冻结, 7退款中，8退款成功, 9付款失败, 10订单数额异常
        onSitePayConfirm: { type: Boolean, default: false }, //线下付款确认
        remark: { type: String, default: '' } //订单状态备注
    },
    payInfo: {
        PrePayType: { type: Number }, //支付方式：
        payPrice: { type: Number }, //支付价格
        payType: { type: Number }, //支付方式：0 wireCard 1 支付宝
        payTime: { type: Date }, //支付时间
        payStatus: { type: String }, //支付状态
        payUser: { type: String }, //支付人签名（允许匿名）
        buyersUserId: { type: String }, //购买者
        buyTime: { type: Date, default: Date.now }, //购买者下单时间
        buyProductsInfo: { type: String }, //购买的商品信息
        buyersLocation: {
            area: { type: String }, //国家（区域）
            provinces: { type: String }, //省份
            city: { type: String }, //城市
            county: { type: String }, //区县
            detailedAddress: { type: String }, //详细地址
            zip: { type: String }, //邮编
            consignee: { type: String }, //收货人姓名
            mobileNum: { type: String }, //手机号码
            telephone: { type: String } //电话号码
        }, //送货地址
        verifyTime: { type: Date }, //确认时间
        buyerCardInfo: {
            // holder: { type: String }, //卡持有者姓名
            // payerAuth: { type: String }, //付款人认证状态, Y 已进行3D登记认证并已认证成功 N 已进行3D登记认证并认证失败 P 认证核对中 A 未在3D安全程序上登记  U 3D登记核对未经处理
            // payerIp: { type: String }, //付款人源ip地址
            // payMethod: { type: String }, //visa,master...
            // cardCountry: { type: String }, //发卡国家, HK香港...
            panFirstLast4: { type: String }, //卡号前后4四位,中间用*代替
            // paySign: { type: String }, //信用卡支付签名
            // payCur: { type: String }, //币种
            // payTransactionTime: { type: String }, //信用卡交易时间
            // payApprovalCode: { type: String } //信用卡核准码
        }
    },
    invoiceInfo: {
        invoiceType: { type: Number }, //发票类型,0,纸质发票,1 电子发票
        invoiceTitle: { type: Number }, //发票抬头,0 个人 1 单位
        invoiceCompanyName: { type: String }, //单位名称
        invoiceContent: { type: String }, //发票内容,0 固定为影像服务
        invoiceAddress: { //发票邮寄地址
            area: { type: String }, //国家（区域）
            provinces: { type: String }, //省份
            city: { type: String }, //城市
            county: { type: String }, //区县
            detailedAddress: { type: String }, //详细地址
            zip: { type: String }, //邮编
            consignee: { type: String }, //收货人姓名
            mobileNum: { type: String }, //手机号码
            telephone: { type: String } //电话号码
        }
    },
    logisticsInfo: {
        code: { type: String }, //物流单号
        company: { type: String }, //物流公司
        sendTime: { type: Date }, //发货时间
        logisticsType: { type: String }, //快递方式
        fee: { type: Number }, //快递费用
        payment: { type: Number } //物流分账
    },
    couponsList: [{ type: String }],
    usePPCodes: [{ type: String }],
    deliveryType: { type: Number }, //送货方式,物流(0)、自提(1)、直送(2),虚拟类商品无须快递(3)
    costPrice: { type: Number }, //成本总价，用于结算统计，后期拓展
    charge: { type: Number, default: 0 }, //订单支付总价
    CNYCharge: { type: Number, default: 0 }, //订单支付总价(人民币)
    orderPrintStatus: { type: Number, default: 1 }, //1.未打印,2.打印中,3.打印完成,4.打印出错
    isBack: { type: Boolean, default: false },
    isPick: { type: Boolean, default: false }, //是否可提货
    collected: { type: Boolean, default: false }, //运营商提取状态
    createdOn: { type: Date, default: Date.now }, //订单创建时间
    createdBy: { type: String }, //创建人
    modifiedOn: { type: Date, default: Date.now }, //修改时间
    modifiedBy: { type: String }, //修改人
    remark: { type: String, default: '' },
    isDelete: { type: Boolean, default: false }, //是否被用户删除

    staffId: { type: String }, //下单员
    //================assist Fields
    actionHistory: [
        { actionDate: { type: Date }, actionContent: { type: String } }
    ],
    Freeze: {
        previousOrderStatus: { type: String }, //冻结前状态
        FreezeTimeLong: { type: Number } //订单冻结时间（在提交订单N分钟以后不可操作，待商量），值：－20  当20分钟后订单已提交且支付成功后，不可操作该订单)
    },
    softCopyCodeSet: []
}
