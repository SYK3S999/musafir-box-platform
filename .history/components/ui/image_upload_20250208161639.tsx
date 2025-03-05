import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
}

const ImageUpload = ({ images, setImages, maxImages = 5 }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: { preventDefault: () => void; stopPropagation: () => void; type: string; }) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: Iterable<unknown> | ArrayLike<unknown>) => {
    const validImageFiles = Array.from(files).filter((file): file is File => 
      file instanceof File && file.type.startsWith('image/')
    ).slice(0, maxImages - images.length);

    validImageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev: string[]) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev: any[]) => prev.filter((_: any, i: any) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag and drop images here or click to select
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {`Up to ${maxImages} images allowed`}
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;