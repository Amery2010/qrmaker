import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import * as serviceWorker from './serviceWorker'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
