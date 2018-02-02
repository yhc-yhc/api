
function asynclike() {
  return new Promise((resolve, reject) => {

    setTimeout(_=> {
      const ary = [1]
      resolve(ary)
    }, 3000)
  })
}

function asynclike_() {
  const Promise_ = require('bluebird')
  return new Promise_((resolve, reject) => {
    setTimeout(_=> {
      const ary = [2]
      resolve(ary)
    }, 2000)
  })
}



async function main() {
  let rs = await asynclike()
  console.log(rs)
  let rs_ = await asynclike_()
  console.log(rs_)
}
main()