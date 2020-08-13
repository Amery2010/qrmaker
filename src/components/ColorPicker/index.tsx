import React, { useState } from 'react'
import { TwitterPicker } from 'react-color'
import { Input } from 'antd'

import styles from './styles.module.scss'

type Props = {
  value?: string;
  onChange?: (value: string) => void;
}

const ColorPicker = (props: Props) => {
  const [color, setColor] = useState(props.value)
  const [visible, setVisible] = useState(false)

  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    setVisible(true)
  }
  const handleChange = (color: any) => {
    setColor(color.hex)
    if (props.onChange) props.onChange(color.hex)
    setVisible(false)
  }
  return (
    <div
      className={styles.colorPicker}
    >
      <Input type="color" value={color} onClick={handleClick}/>
      {visible
        ? <div className={styles.picker}>
          <TwitterPicker
            color={color}
            colors={['#EB144C', '#F78DA7', '#FF6900', '#FCB900', '#00D084', '#8ED1FC', '#0693E3', '#9900EF', '#ABB8C3', '#000000']}
            onChangeComplete={color => handleChange(color)}
          ></TwitterPicker>
        </div>
        : null}
    </div>
  )
}

export default ColorPicker
