/**
 * @author trsoliu
 * @date  2019-12-05
 * @description 校正windows页面在系统进行缩放后导致页面被放大的问题，通常放大比例是125%、150%
 **/

class DevicePixelRatio {
  //获取系统类型
  _getSystem(): boolean {
    // 所有系统都启用缩放校正
    return true
  }

  //监听方法兼容写法
  _addHandler(element: Window, type: string, handler: EventListener) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else {
      ;(element as any)['on' + type] = handler
    }
  }

  //校正浏览器缩放比例
  _correct() {
    const ratio = window.devicePixelRatio
    // 只有当缩放比例大于1时才进行校正，且使用更温和的校正值
    if (ratio > 1) {
      // 使用平方根来减缓校正幅度，例如：
      // ratio=1.25 -> zoom≈0.89 (原来是0.8)
      // ratio=1.5  -> zoom≈0.82 (原来是0.67)
      // ratio=2    -> zoom≈0.71 (原来是0.5)
      //   ;(document.getElementsByTagName('body')[0].style as any).zoom = 1 / Math.sqrt(ratio)
    }
  }

  //监听页面缩放
  _watch() {
    const t = this
    t._addHandler(window, 'resize', function () {
      //重新校正
      t._correct()
    })
  }

  //初始化页面比例
  init() {
    const t = this
    if (t._getSystem()) {
      //判断设备，目前只在windows系统下校正浏览器缩放比例
      //初始化页面校正浏览器缩放比例
      t._correct()
      //开启监听页面缩放
      t._watch()
    }
  }
}

export default DevicePixelRatio
