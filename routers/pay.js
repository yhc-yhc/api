const router = new Router()
const uuid = require('uuid')
const services = loaddir('services')

//后端发起支付请求，再转给app进行支付
router.post('wxpayFromApp', async (ctx, next) => {
    const order = {
        appid: 'wxb41738d7ee3af024',
        attach: 'fdfdf',
        body: 'abc1',
        mch_id: '1267007301', //'1264174301',
        nonce_str: (uuid.v4()).replace(/-/g, ''),
        notify_url: 'https://dev.pictrueair.com/ai/pay/notifyFromWechat',
        out_trade_no: 'kfc' + (+new Date),
        spbill_create_ip: ctx.request.ip.replace(/::ffff:/g, ''),
        total_fee: 1,
        trade_type: 'APP'
    }

    const objStr = services.pay.objTostring(order)
    const preSign = objStr + 'key=3ebbd8d903e74e70844340d2fc66cbab'
    order.sign = crypto.createHash('md5').update(preSign, 'utf8').digest('hex').toUpperCase()
    const xml = services.pay.objToXml(order)
    const data = await request.postAsync({
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        body: xml
    })
    console.log("返回的信息： " + JSON.stringify(data.body));
    const result = await services.pay.parseStringAsync(data.body)

    const paysign2 = {
        appid: result.xml.appid,
        partnerid: result.xml.mch_id,
        prepayid: result.xml.prepay_id,
        package: 'Sign=WXPay',
        noncestr: (uuid.v4()).replace(/-/g, ''),
        timestamp: new Date().getTime()
    }

    const payPrestr = services.pay.objTostring(paysign2) + 'key=3ebbd8d903e74e70844340d2fc66cbab'
    //二次签名后将数据返回给app前端，由app进行支付吊起
    paysign2.sign = crypto.createHash('md5').update(payPrestr, 'utf8').digest('hex').toUpperCase()
    log(paysign2)
    ctx.body = JSON.stringify(paysign2)
})
//回调，验证是否支付成功
router.post('wxNotifyToAppPay', async (message, req, res, next) => {
    log('返回调用支付：'+message)
    
    const data = await services.pay.parseStringAsync(message)
    var payQuery = {}
    payQuery.appid = data.xml.appid
    payQuery.mch_id = data.xml.mch_id
    payQuery.transaction_id = data.xml.transaction_id //微信订单号
    payQuery.out_trade_no = data.xml.out_trade_no
    payQuery.nonce_str = (uuid.v4()).replace(/-/g, '')

    var payQueryString = services.pay.objTostring(xmlParser) + 'key=3ebbd8d903e74e70844340d2fc66cbab'
    payQuery.sign = crypto.createHash('md5').update(payQueryString, 'utf8').digest('hex').toUpperCase()
    //查询订单是否支付成功
    const data1 = await request.postAsync({
        url: 'https://api.mch.weixin.qq.com/pay/orderquery',
        body: services.pay.objToXml(payQuery)
    })

    const result = await services.pay.parseStringAsync(data1.body)
    if (result.xml.return_code && result.xml.return_code == 'SUCCESS' && result.xml.trade_state == 'SUCCESS') {
     

    }


})


//退款
router.post('apprefund', (ctx, next) => {
    var payRefund = {
        appid: ctx.request.appid,
        mch_id: ctx.request.mch_id,
        transaction_id: ctx.request.transaction_id,
        appid: ctx.request.appid


    }


})


module.exports = router