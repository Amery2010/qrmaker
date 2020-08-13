const svgHead = `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n`

export function saveSVG(name: string, content: string): void {
  const htmlContent = [svgHead + content]
  const data = new Blob(htmlContent, { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.target = 'download'
  a.download = name
  a.href = URL.createObjectURL(data)
  document.body.appendChild(a)
  a.click()
}

export function saveJpg(name: string, content: string, width: number = 512, height: number = 512) {
  const htmlContent = [svgHead + content]
  const data = new Blob(htmlContent, { type: 'image/svg+xml' })

  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', `${width}px`)
  canvas.setAttribute('height', `${height}px`)
  const ctx = canvas.getContext('2d')

  const image = document.createElement('img')
  image.setAttribute('src', URL.createObjectURL(data))
  image.onload = () => {
    if (!ctx) return false
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)

    const a = document.createElement('a')
    a.target = 'download'
    a.download = name
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
}