import React from 'react';
import { encodeData } from "../../utils/qrcodeHandler";
import QRCode from "../../utils/qrcode";

export interface RendererProps {
  qrcode?: QRCode,
  className?: string,
  value?: string,
  level?: string,
  styles?: any,
  logo?: string,
  logoScale?: number,
};

export type SFC<P = {}> = StyledFunctionComponent<P>;

export interface StyledFunctionComponent<P = {}> extends React.FunctionComponent<P> {
  defaultCSS?: any
};

export const RendererWrapper = <T extends RendererProps>(renderer: SFC<T>) => {
  const Renderer: SFC<T> = (props: T) => {
    let newProps: T = Object.assign({}, props);

    newProps.value = newProps.value || window.location.origin;
    newProps.qrcode = newProps.qrcode || encodeData({ text: newProps.value, correctLevel: newProps.level, typeNumber: -1 });
    newProps.styles = Object.assign(renderer.defaultCSS, props.styles);

    return (
      React.createElement(renderer, newProps)
    );
  }
  return Renderer;
}

export function drawIcon({ qrcode, logo, logoScale = 1 }: RendererProps) {
  if (!qrcode) return []
  if (!logo && logoScale <= 0) return null;

  const nCount = qrcode.getModuleCount();

  logoScale = (logoScale > 1 ? 1 : logoScale) * 0.33;
  const iconSize = Number(nCount * logoScale);
  const iconXY = (nCount - iconSize) / 2;

  const pointList = [];

  if (logo) {
    pointList.push(<rect width={iconSize} height={iconSize} fill="#FFFFFF" x={iconXY} y={iconXY} />);
    pointList.push(<image xlinkHref={logo} width={iconSize - 2} height={iconSize - 2} x={iconXY + 1} y={iconXY + 1}/>);
  }

  return pointList;
}
