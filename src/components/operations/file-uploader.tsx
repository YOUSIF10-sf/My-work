'use client';

import React, { useContext, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2, Upload, FileCheck2, XCircle } from 'lucide-react';
import { AppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/i18n'; // استيراد hook الترجمة

export function FileUploader() {
  const { processAndSetTransactions, loading } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const t = useTranslations(); // استخدام الترجمات
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'application/vnd.ms-excel'
    ) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: t.fileProcessingError, // استخدام الترجمة
      });
      return;
    }

    try {
      toast({
        title: t.loading, // استخدام الترجمة
        description: t.processingFile,
      });
      await processAndSetTransactions(file);
      toast({
        title: t.success, // استخدام الترجمة
        description: t.fileProcessed,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t.error, // استخدام الترجمة
        description: error.message || t.fileProcessingError,
      });
    }

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] as File);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] as File);
  }, [handleFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out 
        ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-background'}
        ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls"
        disabled={loading}
      />
        <div className="flex flex-col items-center justify-center space-y-4">
            {
                loading ? <Loader2 className="h-12 w-12 text-primary animate-spin" />
                : <Upload className="h-12 w-12 text-muted-foreground" />
            }
            <p className="text-muted-foreground">{t.dragAndDrop}</p>
            <Button variant="outline" disabled={loading}> 
                {t.uploadFile}
            </Button>
        </div>
    </div>
  );
}
