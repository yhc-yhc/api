var ary = [{
  siteId: 'x1',
  day: '170102',
  code: 'paxx11',
  url: 'aaaaaa'
}, {
  siteId: 'x1',
  day: '170103',
  code: 'paxx11',
  url: 'aaaaaa'
}, {
  siteId: 'x2',
  day: '170102',
  code: 'paxx11',
  url: 'aaaaaa'
}, {
  siteId: 'x3',
  day: '170102',
  code: 'paxx11',
  url: 'aaaaaa'
}, ]

const abcObj = ary.reduce((pre, cur) => {
  pre[cur.siteId] = pre[cur.siteId] || {}
  pre[cur.siteId][cur.day] = pre[cur.siteId][cur.day] || {}
  pre[cur.siteId][cur.day][cur.code] = pre[cur.siteId][cur.day][cur.code] || 0
  pre[cur.siteId][cur.day][cur.code] ++
  return pre
}, {})
console.log(abcObj)

// console.log(JSON.stringify(abcObj))