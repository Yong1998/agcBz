export function formatTime (date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

function formatNumber (n: number) {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

// 深拷贝
export function deepClone (obj: any) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  const newObj = new obj.constructor()
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key])
    }
  }
  return newObj
}

// 防抖 ts
let timer: any
export function debounce (fn: Function, delay: number) {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    // @ts-ignore
    fn.apply(this, arguments);
  }, delay);
}

// 节流 ts
export function throttle (fn: Function, delay: number) {
  let flag = true
  return function() {
    // @ts-ignore
    const context = this
    const args = arguments
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(context, args)
      flag = true
    }, delay)
  }
}