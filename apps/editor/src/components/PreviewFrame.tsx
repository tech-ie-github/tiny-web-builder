import type { FC } from 'react';

const DEVICE_WIDTH: Record<string, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px'
};

interface PreviewFrameProps {
  src: string;
  device: keyof typeof DEVICE_WIDTH;
  refreshToken: number;
}

export const PreviewFrame: FC<PreviewFrameProps> = ({ src, device, refreshToken }) => {
  const width = DEVICE_WIDTH[device] ?? DEVICE_WIDTH.desktop;
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const url = new URL(src, base);
  url.searchParams.set('r', refreshToken.toString());

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-200 p-6">
      <div className="h-full max-h-[800px] w-full" style={{ maxWidth: width }}>
        <iframe
          key={refreshToken}
          src={url.toString()}
          title="Preview"
          className="h-full w-full rounded-xl border bg-white shadow-lg"
        />
      </div>
    </div>
  );
};
