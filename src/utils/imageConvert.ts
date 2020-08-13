function imageConvert(src: string, size: number): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const img = document.createElement('img')
  img.src = src
  /**
     * 使用 crossOrigin 属性可以让 canvas 支持绘制非当前域名下的图片，比如 CDN 上的图片资源
     * ios 10.2 版本对本地图片资源不允许使用 crossOrigin 属性，因此需要使用以下兼容代码
     */
  if (src && /^http(s)?:\/\//.test(src)) img.crossOrigin = 'anonymous'
  return new Promise((resolve) => {
    img.onload = () => {
      if (!ctx) return false
      canvas.width = size
      canvas.height = size
      ctx.drawImage(img, 0, 0, size, size)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
  })
}

export default imageConvert
