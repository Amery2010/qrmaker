import React from 'react';
import { rand, defaultViewBox } from '../../utils/helper';
import { getTypeTable, QRPointType } from '../../utils/qrcodeHandler';
import { RendererWrapper, RendererProps, SFC, drawIcon } from './RendererWrapper';

enum Type {
  Rect = 'rect',
  Round = 'round',
  Line = 'line',
  Rand = 'rand',
  Star = 'star'
}

enum PosType {
  Rect = 'rect',
  Round = 'round',
  Planet = 'planet',
  RoundRect = 'roundRect'
}

enum LineDirection {
  LeftToRight = 'left-right',
  UpToDown = 'up-down',
  HAndV = 'h-v',
  Loop = 'loop',
  TopLeftToBottomRight = 'topLeft-bottomRight',
  TopRightToBottomLeft = 'topRight-bottomLeft',
  Cross = 'cross'
}

interface QRNormalProps extends RendererProps {
  type?: Type | string,
  posType?: PosType | string,
  lineDirection?: LineDirection | string,
  size?: number,
  opacity?: number,
  otherColor?: string,
  posColor?: string,
}

const QRNormal: SFC<QRNormalProps> = (props) => {
  const { qrcode, className, styles } = props;
  return (
    <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={defaultViewBox(qrcode)} fill="white"
      xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      {listPoints(props)}
      {drawIcon(props)}
    </svg>
  );
}


function listPoints({ qrcode, lineDirection, type, size, opacity, posType, otherColor, posColor }: QRNormalProps) {
  if (!qrcode) return []

  const nCount = qrcode.getModuleCount();
  const typeTable = getTypeTable(qrcode);
  const pointList = new Array(nCount);

  size = size! / 100;
  opacity = opacity! / 100;
  let id = 0;

  let available: Array<Array<boolean>> = [];
  let ava2: Array<Array<boolean>> = [];
  for (let x = 0; x < nCount; x++) {
    available[x] = [];
    ava2[x] = [];
    for (let y = 0; y < nCount; y++) {
      available[x][y] = true;
      ava2[x][y] = true;
    }
  }

  const vw = [3, -3];
  const vh = [3, -3];
  const sq25 = "M32.048565,-1.29480038e-15 L67.951435,1.29480038e-15 C79.0954192,-7.52316311e-16 83.1364972,1.16032014 87.2105713,3.3391588 C91.2846454,5.51799746 94.4820025,8.71535463 96.6608412,12.7894287 C98.8396799,16.8635028 100,20.9045808 100,32.048565 L100,67.951435 C100,79.0954192 98.8396799,83.1364972 96.6608412,87.2105713 C94.4820025,91.2846454 91.2846454,94.4820025 87.2105713,96.6608412 C83.1364972,98.8396799 79.0954192,100 67.951435,100 L32.048565,100 C20.9045808,100 16.8635028,98.8396799 12.7894287,96.6608412 C8.71535463,94.4820025 5.51799746,91.2846454 3.3391588,87.2105713 C1.16032014,83.1364972 5.01544207e-16,79.0954192 -8.63200256e-16,67.951435 L8.63200256e-16,32.048565 C-5.01544207e-16,20.9045808 1.16032014,16.8635028 3.3391588,12.7894287 C5.51799746,8.71535463 8.71535463,5.51799746 12.7894287,3.3391588 C16.8635028,1.16032014 20.9045808,7.52316311e-16 32.048565,-1.29480038e-15 Z";
  const starPath = "M0.5,0 C0.462313513,0.148911114 0.405974902,0.262220217 0.330984168,0.339927309 C0.255993434,0.417634401 0.145665378,0.470991965 0,0.5 C0.150360661,0.538976221 0.260688717,0.595140155 0.330984168,0.668491803 C0.401279618,0.741843451 0.457618229,0.852346183 0.5,1 C0.532866057,0.85565173 0.589433875,0.745148998 0.669703453,0.668491803 C0.749973031,0.591834608 0.86007188,0.535670674 1,0.5 C0.86007188,0.47133484 0.749973031,0.417977276 0.669703453,0.339927309 C0.589433875,0.261877343 0.532866057,0.148568239 0.5,0 Z";

  if (size <= 0) size = 1.0

  for (let x = 0; x < nCount; x++) {
    for (let y = 0; y < nCount; y++) {
      if (qrcode.isDark(x, y) === false) continue;

      if (typeTable[x][y] === QRPointType.ALIGN_CENTER || typeTable[x][y] === QRPointType.ALIGN_OTHER || typeTable[x][y] === QRPointType.TIMING) {
        if (type === Type.Rect)
          pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={otherColor} x={x + (1 - size) / 2} y={y + (1 - size) / 2} shapeRendering="crispEdges" />)
        else if (type === Type.Round)
          pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
        else if (type === Type.Rand)
          pointList.push(<circle key={id++} opacity={opacity} fill={otherColor} cx={x + 0.5} cy={y + 0.5} r={size / 2} />)
      } else if (typeTable[x][y] === QRPointType.POS_CENTER) {
        if (posType === PosType.Rect) {
          pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y} shapeRendering="crispEdges" />);
        } else if (posType === PosType.Round) {
          pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
          pointList.push(<circle key={id++} fill="none" strokeWidth={size} stroke={posColor} cx={x + 0.5} cy={y + 0.5} r={3} />)
        } else if (posType === PosType.Planet) {
          pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
          pointList.push(<circle key={id++} fill="none" strokeWidth="0.15" strokeDasharray="0.5,0.5" stroke={posColor} cx={x + 0.5} cy={y + 0.5} r={3} />)
          for (let w = 0; w < vw.length; w++) {
            pointList.push(<circle key={id++} fill={posColor} cx={x + vw[w] + 0.5} cy={y + 0.5} r={0.5} />)
          }
          for (let h = 0; h < vh.length; h++) {
            pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + vh[h] + 0.5} r={0.5} />)
          }
        } else if (posType === PosType.RoundRect) {
          pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
          pointList.push(<path key={id++} d={sq25} stroke={posColor} strokeWidth={100 / 6 * (1 - (1 - size) * 0.75)} fill="none" transform={'translate(' + String(x - 2.5) + ',' + String(y - 2.5) + ') scale(' + String(6 / 100) + ',' + String(6 / 100) + ')'} />)
        }
      } else if (typeTable[x][y] === QRPointType.POS_OTHER) {
        if (posType === PosType.Rect) {
          pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y} shapeRendering="crispEdges" />);
        }
      } else {
        if (type === Type.Rect) {
          pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={otherColor} x={x + (1 - size) / 2} y={y + (1 - size) / 2} shapeRendering="crispEdges" />)
        } else if (type === Type.Round) {
          pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
        } else if (type === Type.Rand) {
          pointList.push(<circle opacity={opacity} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} r={0.5 * rand(0.33, 1.0)} />)
        } else if (type === Type.Line) {
          if (lineDirection === LineDirection.LeftToRight) {
            if (x === 0 || (x > 0 && (!qrcode.isDark(x - 1, y) || !ava2[x - 1][y]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && x + end < nCount) {
                if (qrcode.isDark(x + end, y) && ava2[x + end][y]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x + i][y] = false;
                  available[x + i][y] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + end - start - 0.5} y2={y + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }

          if (lineDirection === LineDirection.UpToDown) {
            if (y === 0 || (y > 0 && (!qrcode.isDark(x, y - 1) || !ava2[x][y - 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && y + end < nCount) {
                if (qrcode.isDark(x, y + end) && ava2[x][y + end]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x][y + i] = false;
                  available[x][y + i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + 0.5} y2={y + end - start - 1 + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }
          if (lineDirection === LineDirection.HAndV) {
            if (y === 0 || (y > 0 && (!qrcode.isDark(x, y - 1) || !ava2[x][y - 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && y + end < nCount) {
                if (qrcode.isDark(x, y + end) && ava2[x][y + end] && end - start <= 3) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x][y + i] = false;
                  available[x][y + i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + 0.5} y2={y + end - start - 1 + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (x === 0 || (x > 0 && (!qrcode.isDark(x - 1, y) || !ava2[x - 1][y]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && x + end < nCount) {
                if (qrcode.isDark(x + end, y) && ava2[x + end][y] && end - start <= 3) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x + i][y] = false;
                  available[x + i][y] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + end - start - 0.5} y2={y + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }

          if (lineDirection === LineDirection.Loop) {
            if (Number(x > y) ^ Number(x + y < nCount)) {
              if (y === 0 || (y > 0 && (!qrcode.isDark(x, y - 1) || !ava2[x][y - 1]))) {
                let start = 0;
                let end = 0;
                let ctn = true;
                while (ctn && y + end < nCount) {
                  if (qrcode.isDark(x, y + end) && ava2[x][y + end] && end - start <= 3) {
                    end++;
                  } else {
                    ctn = false;
                  }
                }
                if (end - start > 1) {
                  for (let i = start; i < end; i++) {
                    ava2[x][y + i] = false;
                    available[x][y + i] = false;
                  }
                  pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + 0.5} y2={y + end - start - 1 + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
                }
              }
            } else {
              if (x === 0 || (x > 0 && (!qrcode.isDark(x - 1, y) || !ava2[x - 1][y]))) {
                let start = 0;
                let end = 0;
                let ctn = true;
                while (ctn && x + end < nCount) {
                  if (qrcode.isDark(x + end, y) && ava2[x + end][y] && end - start <= 3) {
                    end++;
                  } else {
                    ctn = false;
                  }
                }
                if (end - start > 1) {
                  for (let i = start; i < end; i++) {
                    ava2[x + i][y] = false;
                    available[x + i][y] = false;
                  }
                  pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + end - start - 0.5} y2={y + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
                }
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }
          if (lineDirection === LineDirection.TopLeftToBottomRight) {
            if (y === 0 || x === 0 || ((y > 0 && x > 0) && (!qrcode.isDark(x - 1, y - 1) || !ava2[x - 1][y - 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && y + end < nCount && x + end < nCount) {
                if (qrcode.isDark(x + end, y + end) && ava2[x + end][y + end]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x + i][y + i] = false;
                  available[x + i][y + i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + end - start - 1 + 0.5} y2={y + end - start - 1 + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }
          if (lineDirection === LineDirection.TopRightToBottomLeft) {
            if (x === 0 || y === nCount - 1 || ((x > 0 && y < nCount - 1) && (!qrcode.isDark(x - 1, y + 1) || !ava2[x - 1][y + 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && x + end < nCount && y - end >= 0) {
                if (qrcode.isDark(x + end, y - end) && available[x + end][y - end]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x + i][y - i] = false;
                  available[x + i][y - i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + (end - start - 1) + 0.5} y2={y - (end - start - 1) + 0.5} strokeWidth={size} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (available[x][y]) {
              pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
            }
          }
          if (lineDirection === LineDirection.Cross) {
            if (x === 0 || y === nCount - 1 || ((x > 0 && y < nCount - 1) && (!qrcode.isDark(x - 1, y + 1) || !ava2[x - 1][y + 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && x + end < nCount && y - end >= 0) {
                if (qrcode.isDark(x + end, y - end) && ava2[x + end][y - end]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  ava2[x + i][y - i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + (end - start - 1) + 0.5} y2={y - (end - start - 1) + 0.5} strokeWidth={size / 2 * rand(0.3, 1)} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            if (y === 0 || x === 0 || ((y > 0 && x > 0) && (!qrcode.isDark(x - 1, y - 1) || !available[x - 1][y - 1]))) {
              let start = 0;
              let end = 0;
              let ctn = true;
              while (ctn && y + end < nCount && x + end < nCount) {
                if (qrcode.isDark(x + end, y + end) && available[x + end][y + end]) {
                  end++;
                } else {
                  ctn = false;
                }
              }
              if (end - start > 1) {
                for (let i = start; i < end; i++) {
                  available[x + i][y + i] = false;
                }
                pointList.push(<line opacity={opacity} x1={x + 0.5} y1={y + 0.5} x2={x + end - start - 1 + 0.5} y2={y + end - start - 1 + 0.5} strokeWidth={size / 2 * rand(0.3, 1)} stroke={otherColor} strokeLinecap="round" key={id++} />)
              }
            }
            pointList.push(<circle opacity={opacity} r={0.5 * rand(0.33, 0.9)} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} />)
          }
        } else if (type === Type.Star) {
          pointList.push(<path key={id++} d={starPath} opacity={opacity} fill={otherColor} transform={'translate(' + String(x + (1 - size) / 2) + ',' + String(y + (1 - size) / 2) + ') scale(' + String(size) + ',' + String(size) + ')'} />)
        }
      }
    }
  }

  return pointList;
}

QRNormal.defaultCSS = {
  svg: {
  }
}

QRNormal.defaultProps = {
  styles: {},
  type: Type.Rect,
  size: 100,
  opacity: 100,
  posType: PosType.Rect,
  otherColor: '#000000',
  posColor: '#000000',
}

export default RendererWrapper(QRNormal);
