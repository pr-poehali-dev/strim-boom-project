import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface ImageCropEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onCropComplete: (croppedImage: Blob) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropArea,
  rotation = 0,
  brightness = 100,
  contrast = 100,
  saturation = 100,
  filterPreset = 'none'
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  
  if (filterPreset === 'grayscale') {
    filterString += ' grayscale(100%)';
  } else if (filterPreset === 'sepia') {
    filterString += ' sepia(80%)';
  } else if (filterPreset === 'vintage') {
    filterString += ' sepia(40%) contrast(110%) brightness(95%)';
  } else if (filterPreset === 'dramatic') {
    filterString += ' contrast(140%) saturate(130%) brightness(90%)';
  } else if (filterPreset === 'cool') {
    filterString += ' hue-rotate(180deg) saturate(120%)';
  } else if (filterPreset === 'warm') {
    filterString += ' sepia(20%) saturate(120%) brightness(105%)';
  }
  
  ctx.filter = filterString;
  ctx.drawImage(canvas, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/jpeg', 0.95);
  });
};

type FilterPreset = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'dramatic' | 'cool' | 'warm';

const filterPresets: { name: string; value: FilterPreset; icon: string }[] = [
  { name: 'Оригинал', value: 'none', icon: 'ImageOff' },
  { name: 'Ч/Б', value: 'grayscale', icon: 'Moon' },
  { name: 'Сепия', value: 'sepia', icon: 'Film' },
  { name: 'Винтаж', value: 'vintage', icon: 'Camera' },
  { name: 'Драма', value: 'dramatic', icon: 'Zap' },
  { name: 'Холод', value: 'cool', icon: 'Snowflake' },
  { name: 'Тепло', value: 'warm', icon: 'Flame' },
];

export const ImageCropEditor = ({ open, onOpenChange, imageUrl, onCropComplete }: ImageCropEditorProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('none');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaChange = useCallback((_: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast,
        saturation,
        filterPreset
      );
      onCropComplete(croppedImage);
      onOpenChange(false);
    } catch (error) {
      console.error('Crop error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setZoom(1);
    setFilterPreset('none');
  };

  const applyFilterPreset = (preset: FilterPreset) => {
    setFilterPreset(preset);
    if (preset === 'none') {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-lg border-primary/30 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Crop" size={24} />
            Редактировать фото
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterPresets.map((preset) => (
              <Button
                key={preset.value}
                variant={filterPreset === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyFilterPreset(preset.value)}
                className="flex-shrink-0 gap-1 text-xs"
              >
                <Icon name={preset.icon as any} size={14} />
                {preset.name}
              </Button>
            ))}
          </div>

          <div className="relative h-96 bg-black/50 rounded-lg overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaChange}
              style={{
                containerStyle: {
                  filter: filterPreset === 'none' 
                    ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                    : filterPreset === 'grayscale'
                    ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(100%)`
                    : filterPreset === 'sepia'
                    ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(80%)`
                    : filterPreset === 'vintage'
                    ? `sepia(40%) contrast(110%) brightness(95%)`
                    : filterPreset === 'dramatic'
                    ? `contrast(140%) saturate(130%) brightness(90%)`
                    : filterPreset === 'cool'
                    ? `hue-rotate(180deg) saturate(120%)`
                    : filterPreset === 'warm'
                    ? `sepia(20%) saturate(120%) brightness(105%)`
                    : `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                }
              }}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="ZoomIn" size={16} />
                  Масштаб
                </label>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="RotateCw" size={16} />
                  Поворот
                </label>
                <span className="text-xs text-muted-foreground">{rotation}°</span>
              </div>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => setRotation(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Sun" size={16} />
                  Яркость
                </label>
                <span className="text-xs text-muted-foreground">{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                min={50}
                max={150}
                step={1}
                onValueChange={(value) => setBrightness(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Contrast" size={16} />
                  Контраст
                </label>
                <span className="text-xs text-muted-foreground">{contrast}%</span>
              </div>
              <Slider
                value={[contrast]}
                min={50}
                max={150}
                step={1}
                onValueChange={(value) => setContrast(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Palette" size={16} />
                  Насыщенность
                </label>
                <span className="text-xs text-muted-foreground">{saturation}%</span>
              </div>
              <Slider
                value={[saturation]}
                min={0}
                max={200}
                step={1}
                onValueChange={(value) => setSaturation(value[0])}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="w-full gap-2"
            >
              <Icon name="RotateCcw" size={16} />
              Сбросить фильтры
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="Check" size={16} />
                Применить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};