import { CONFIG, get, post, postAdmin } from './request/index'
import md5 from 'md5';

export const getImgList = (params= {
    page: 1,
    size: 10
}) => {
    const pages = {
        total: 100,
        page: params.page,
        size: params.size
    }
    // 根据分页参数，生成随机图片数据列表
    // 生成随机图片数据列表
    const list = []
    for(let i = 0; i < pages.total; i++) {
        list.push({
            id: i,
            sub: Math.floor(Math.random() * 4) + 1,
            width: 200,
            height: 100 * (Math.floor(Math.random() * 4) + 1),
            img: `https://picsum.photos/200/${100 * (Math.floor(Math.random() * 4) + 1)}?random=${i}`,
        })
    }
    return Promise.resolve({
        code: 200,
        data: {
            list: list.slice((params.page - 1) * params.size, params.page * params.size),
            total: pages.total,
        },
        message: 'success'
    })

}


export const login = async () => {
  const res = await wx.login();
  const data = {
    code: res.code,
    wxAppId: CONFIG.appId,
    channelId: 'MiniProgram',
    fromChannel: '',
    fromOrderNum: '',
    // sourceUserId: '',
    // sourceType: '',
    gdt_vid: '',
    platformSource: 0,
    trafficSource: 0,
    mobileModel: wx.getSystemInfoSync().model,
    mobileBrand: wx.getSystemInfoSync().brand,
  }
  return post('/mbuy/intf/account/wxDdtLogin', data, { contentType: 'application/x-www-form-urlencoded' })
}

export const getGlobalAttr = async (key: string) => {
  const res = await get('/mbuy/intf/app/globalAttr', { attrName: key }) as any
  const result = JSON.parse(res.data.data.list[0].attrValue)
  return result
}

export const saveGlobalAttr = async (data: Record<string, any>) => {
  // 先登录管理后台后保存
  const loginParams = {
    account: 'zhongweiyong',
    md5Password: md5('OefjfQ54NS'),
  }
  await postAdmin('/mbuy-admin/hbadmin/login', loginParams)
  const params = {
    appId: '',
    attrDesc: '1',
    attrName: 'test-mangement',
    attrType: 2,
    id: 1182,
    attrValue: '',
    ...data,
  }
  return postAdmin('/mbuy-admin/hbadmin/app/attr/createOrUpdate', params)
}