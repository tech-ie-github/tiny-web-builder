import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Device {
  name: string;
  width: number;
  height: number;
}

interface PreviewFrameProps {
  device: Device;
  siteId: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ device, siteId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRotated, setIsRotated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const previewUrl = `http://localhost:4321/preview/${siteId}`;

  // Calculate responsive dimensions
  const getDisplayDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const containerHeight = containerRef.current?.offsetHeight || 600;
    
    // Use rotated dimensions if needed
    const deviceWidth = isRotated ? device.height : device.width;
    const deviceHeight = isRotated ? device.width : device.height;
    
    // Calculate scale to fit container with padding
    const maxWidth = containerWidth - 80; // Account for device frame padding
    const maxHeight = containerHeight - 120; // Account for header and controls
    
    const scaleX = maxWidth / deviceWidth;
    const scaleY = maxHeight / deviceHeight;
    const baseScale = Math.min(scaleX, scaleY, 1);
    const finalScale = baseScale * zoomLevel;
    
    return {
      width: deviceWidth,
      height: deviceHeight,
      scale: finalScale,
      displayWidth: deviceWidth * finalScale,
      displayHeight: deviceHeight * finalScale
    };
  }, [device, isRotated, zoomLevel]);

  const displayDimensions = getDisplayDimensions();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [siteId]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load preview');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleRotate = () => {
    setIsRotated(prev => !prev);
  };

  const canRotate = device.name === 'Mobile' || device.name === 'Tablet';

  return (
    <div className="flex flex-col h-full">
      {/* Preview Controls */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {device.name} {isRotated && '(Rotated)'}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(displayDimensions.scale * 100)}%
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Device Rotation */}
          {canRotate && (
            <button
              onClick={handleRotate}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title={`Rotate to ${isRotated ? 'portrait' : 'landscape'}`}
              aria-label={`Rotate device to ${isRotated ? 'portrait' : 'landscape'} orientation`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 border border-gray-200 rounded-md">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-md transition-colors"
              title="Zoom out"
              aria-label="Zoom out preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
              title="Reset zoom"
              aria-label="Reset zoom to fit"
            >
              Fit
            </button>
            
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-md transition-colors"
              title="Zoom in"
              aria-label="Zoom in preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Device Frame Container */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Device Frame */}
          <div 
            className={`relative transition-all duration-300 ${
              device.name === 'Mobile' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-600' 
                : device.name === 'Tablet'
                ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl shadow-2xl border border-gray-500'
                : 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-2xl shadow-2xl border border-gray-400'
            }`}
            style={{ 
              width: displayDimensions.displayWidth + (device.name === 'Mobile' ? 24 : device.name === 'Tablet' ? 32 : 40),
              height: displayDimensions.displayHeight + (device.name === 'Mobile' ? 48 : device.name === 'Tablet' ? 64 : 80)
            }}
          >
            {/* Device Header */}
            <div className="flex items-center justify-center px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium tracking-wide ${
                  device.name === 'Mobile' 
                    ? 'text-gray-200' 
                    : device.name === 'Tablet'
                    ? 'text-gray-100'
                    : 'text-gray-100'
                }`}>
                  {device.name}
                </span>
              </div>
            </div>

            {/* Device Screen */}
            <div 
              className={`relative bg-white overflow-hidden shadow-inner ${
                device.name === 'Mobile' 
                  ? 'mx-3 mb-3 rounded-[1.5rem] border border-gray-200' 
                  : device.name === 'Tablet'
                  ? 'mx-4 mb-4 rounded-2xl border border-gray-200'
                  : 'mx-5 mb-5 rounded-xl border border-gray-200'
              }`}
              style={{
                width: displayDimensions.displayWidth,
                height: displayDimensions.displayHeight
              }}
            >
              {/* Screen Content */}
              <div 
                className="relative overflow-hidden bg-white"
                style={{ 
                  width: displayDimensions.width,
                  height: displayDimensions.height,
                  transform: `scale(${displayDimensions.scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                    <div className="text-gray-600 text-sm font-medium">Loading preview...</div>
                    <div className="text-gray-400 text-xs mt-1">This may take a moment</div>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-red-600 text-sm font-medium mb-1">Preview Error</div>
                    <div className="text-red-500 text-xs text-center max-w-xs">{error}</div>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Preview Iframe */}
                <iframe
                  id="preview-frame"
                  src={previewUrl}
                  className="w-full h-full border-0"
                  onLoad={handleLoad}
                  onError={handleError}
                  title={`${device.name} preview of site`}
                />
              </div>
            </div>

            {/* Device-specific indicators */}
            {device.name === 'Mobile' && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-1 bg-gray-500 rounded-full shadow-sm"></div>
              </div>
            )}
            {device.name === 'Tablet' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            )}
            {device.name === 'Desktop' && (
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-1 bg-gray-400 rounded-full opacity-50"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Open in new tab</span>
          </a>
        </div>
        
        <div className="text-xs text-gray-500">
          {device.width} × {device.height}px
        </div>
      </div>
    </div>
  );
};
