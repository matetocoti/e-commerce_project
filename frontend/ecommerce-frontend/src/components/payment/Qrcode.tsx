import { QRCodeSVG } from "qrcode.react";

interface QrcodeProps {
  readonly value: string;
  readonly size?: number;
}

export function Qrcode({ value, size = 160 }: QrcodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      marginSize={0}
      className="max-w-full h-auto rounded-lg mx-auto"
    />
  );
}
