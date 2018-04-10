const Router = require('koa-router')
const router = new Router()

/*
 微信登录,获取用户信息
*/
router.post('wxlogin',async(ctx,next)=>{

   console.log('请求来了：access_token='+ctx.request.access_token+'&'+'openid='+ctx.request.openid+'type='+ctx.request.type)

   const questString = 'access_token='+ctx.request.access_token+'&'+'openid='+ctx.request.openid
   const validateLogin = await request.getAsync({
    	url:'https://api.weixin.qq.com/sns/auth?'+questString
	})
   console.log('validateLogin: '+validateLogin)
   if(validateLogin.errcoide == 0 && userInfo.validateLogin == 'ok'){
	   	/*
	      1.获取到微信返回的用户信息
	   	*/
	   	const userinfo =  await request.getAsync({
	   	 	url:'https://api.weixin.qq.com/sns/userinfo?'+questString
   	 	 })
	   	console.log('获取微信返回的用户信息：'+userinfo)
	   	const userdoc = await model.user.update({userName:userinfo.nickname},{$set:{
	   		userName:userinfo.nickname,
	   		 name:userinfo.nickname,
	   		 openIds:userinfo.openIds,
	   		 gender  :userinfo.sex,
             country :userinfo.country,
             addresses:addressArr,
             coverHeaderImage:userinfo.headimgurl,
             unionid:userinfo.unionid,//用户的unionid是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，unionid是相同的
             registerTerminal:ctx.request.type //终端类型ios,adriod

	   	}},{upsert:true})
        ctx.body = userdoc
   }else{
     	ctx.body = 'err,无效的oppen_id／auth_token'
   }

})

module.exports = router