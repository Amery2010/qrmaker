import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Form, Tabs, Input, Select, AutoComplete, Button, Divider, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { QRNormal } from './components/QRCode'
import ColorPicker from './components/ColorPicker'
import { saveSVG, saveJpg } from './utils/downloader'
import imageConvert from './utils/imageConvert'

import styles from './global.module.scss'

type FormChangeValuesType = {
  [propName: string]: string
}
type HistoryOption = {
  value: string
}

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

const LOGO_DEFAULT_SIZE = 80
const HISTORY_DATA_NUM = 20

let localHistoryData: string[] = []
// 填充二维码生成历史记录
const data = window.localStorage.getItem('historyData')
if (data) {
  try {
    localHistoryData = JSON.parse(data)
  } catch (err) {
    console.error('初始化二维码生成历史记录数据失败！')
    window.localStorage.removeItem('historyData')
  }
}

const App: React.FC = () => {
  const qrcodeRef = useRef<HTMLDivElement>(null)
  const [qrValue, setQrValue] = useState<string>('')
  const [level, setLevel] = useState<string>('M')
  const [type, setType] = useState<string>('rect')
  const [posType, setPosType] = useState<string>('rect')
  const [lineDirection, setLineDirection] = useState<string>('h-v')
  const [size, setSize] = useState<number>(100)
  const [opacity, setOpacity] = useState<number>(100)
  const [posColor, setPosColor] = useState<string>('#000000')
  const [otherColor, setOtherColor] = useState<string>('#000000')
  const [logo, setLogo] = useState<string>('')
  const [logoScale, setLogoScale] = useState<number>(100)
  const [historyData, setHistoryData] = useState<HistoryOption[]>([])

  const handleValuesChange = async (changedValue: FormChangeValuesType) => {
    for (const [key, val] of Object.entries<string>(changedValue)) {
      switch (key) {
        case 'level':
          setLevel(val)
          break
        case 'type':
          setType(val)
          break
        case 'posType':
          setPosType(val)
          break
        case 'lineDirection':
          setLineDirection(val)
          break
        case 'size':
          setSize(parseInt(val))
          break
        case 'opacity':
          setOpacity(parseInt(val))
          break
        case 'posColor':
          setPosColor(val)
          break
        case 'otherColor':
          setOtherColor(val)
          break
        case 'logo':
          if (val === '') {
            setLogo('')
          } else {
            const dataUrl = await imageConvert(val, LOGO_DEFAULT_SIZE)
              .catch(err => message.error(err.msg || err.message))
            setLogo(dataUrl)
          }
          break
        case 'logoScale':
          setLogoScale(parseInt(val))
          break
        default:
          console.warn(`无法处理参数 ${key} 的修改`)
          break
      }
    }
  }
  const handleUrlChange = (value: string) => {
    setQrValue(value)
  }
  const handleSearch = (value: string) => {
    if (value) {
      const data = localHistoryData.filter(item => item.toLowerCase().indexOf(value.toLowerCase()) >= 0)
      setHistoryData(data.map(item => {
        return { value: item }
      }))
    } else {
      setHistoryData([])
    }
  }
  const saveUrlHistory = () => {
    const index = localHistoryData.indexOf(qrValue)
    const value = qrValue.trim()
    if (value !== '' && index !== 0) {
      if (index > 0) {
        localHistoryData.splice(index, 1)
      }
      localHistoryData.unshift(value)
      if (localHistoryData.length > HISTORY_DATA_NUM) {
        localHistoryData.splice(HISTORY_DATA_NUM - 1)
      }
      window.localStorage.setItem('historyData', JSON.stringify(localHistoryData))
    }
  }
  const handleValueChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQrValue(ev.target.value)
  }
  const handleDownload = (type: 'svg' | 'png') => {
    if (qrcodeRef.current) {
      const content = qrcodeRef.current.innerHTML
      if (type === 'svg') {
        saveSVG('qrcode.svg', content)
      } else {
        saveJpg('qrcode.png', content)
      }
    } else {
      message.error('获取二维码图片失败')
    }
  }

  useEffect(() => {
    document.title = '二维码生成工具'
    // 填充二维码生成历史记录
    setHistoryData(localHistoryData.map(item => {
      return { value: item }
    }))
  }, [])
  return (
    <div className={styles.app}>
      <main className={styles.content}>
        <Tabs className={styles.text} defaultActiveKey="1">
          <TabPane tab="网址" key="1">
            <AutoComplete
              style={{ width: '100%' }}
              options={historyData}
              onSearch={handleSearch}
              onChange={handleUrlChange}
              onBlur={saveUrlHistory}
              notFoundContent={null}
            >
            </AutoComplete>
            <p className={styles.tip}>如果链接较长，推荐使用生成短链接二维码模式</p>
          </TabPane>
          <TabPane tab="文本" key="2">
            <TextArea
              rows={2}
              maxLength={200}
              placeholder="请输入文本内容，限200字符"
              onChange={handleValueChange}
            />
          </TabPane>
        </Tabs>
        <Divider orientation="left" plain style={{ marginTop: 0 }}>参数设置</Divider>
        <div className={styles.setting}>
          <Form
            name="setting"
            className={styles.form}
            layout="vertical"
            initialValues={{
              level,
              type,
              posType,
              lineDirection,
              size,
              opacity,
              posColor,
              otherColor,
              logo,
              logoScale,
            }}
            onValuesChange={handleValuesChange}
          >
            <Row gutter={{ xs: 0, md: 24 }}>
              <Col xs={24} md={8}>
                <Form.Item name="level" label="容错级别">
                  <Select>
                    <Option value="L">L 7%</Option>
                    <Option value="M">M 15%</Option>
                    <Option value="Q">Q 25%</Option>
                    <Option value="H">H 30%</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="logo" label="Logo">
                  <Select>
                    <Option value="">无</Option>
                    <Option value="./logo192.png">Logo</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="logoScale" label="Logo缩放">
                  <Input type="number" max={100} min={20} disabled={!Boolean(logo)}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 0, md: 24 }}>
              <Col xs={24} md={8}>
                <Form.Item name="type" label="信息点样式">
                  <Select>
                    <Option value="rect">矩形</Option>
                    <Option value="line">线条</Option>
                    <Option value="star">星星</Option>
                    <Option value="round">圆点</Option>
                    <Option value="rand">随机圆点</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="size" label="信息点缩放">
                  <Input type="number" max={120} min={10}></Input>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="otherColor" label="信息点颜色">
                  <ColorPicker></ColorPicker>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 0, md: 24 }}>
              <Col xs={24} md={8}>
                <Form.Item name="opacity" label="信息点透明度">
                  <Input type="number" max={100} min={10}></Input>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="posType" label="定位点样式">
                  <Select>
                    <Option value="rect">矩形</Option>
                    <Option value="round">圆形</Option>
                    <Option value="planet">行星</Option>
                    <Option value="roundRect">圆角矩形</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="posColor" label="定位点颜色">
                  <ColorPicker></ColorPicker>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 0, md: 24 }}>
              <Col xs={24} md={8}>
                <Form.Item name="lineDirection" label="线条方向">
                  <Select disabled={type !== 'line'}>
                    <Option value="left-right">左右</Option>
                    <Option value="up-down">上下</Option>
                    <Option value="h-v">纵横</Option>
                    <Option value="loop">回环</Option>
                    <Option value="topLeft-bottomRight">左上右下</Option>
                    <Option value="topRight-bottomLeft">右上左下</Option>
                    <Option value="cross">交叉</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles.preview}>
            <div ref={qrcodeRef}>
              <QRNormal
                className={styles.qrcode}
                value={qrValue}
                level={level}
                type={type}
                lineDirection={lineDirection}
                posType={posType}
                posColor={posColor}
                otherColor={otherColor}
                size={size}
                opacity={opacity}
                logo={logo}
                logoScale={logoScale / 100}
              />
            </div>
            <Button.Group className={styles.download}>
              <Button icon={<DownloadOutlined />} onClick={() => handleDownload('svg')}>SVG</Button>
              <Button icon={<DownloadOutlined />} onClick={() => handleDownload('png')}>PNG</Button>
            </Button.Group>
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  )
}

export default App
