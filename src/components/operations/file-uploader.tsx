'use client';

import React, { useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2, Upload } from 'lucide-react';
import { AppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';

export function FileUploader({ isButton = false }: { isButton?: boolean }) {
  const { processAndSetTransactions, loading } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel'
      ) {
         toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid Excel file (.xlsx, .xls).",
        });
        return;
      }
      
      try {
        await processAndSetTransactions(file);
      } catch (error: any) {
         toast({
          variant: "destructive",
          title: "File Read Error",
          description: error.message || "Could not read the selected file.",
        });
      }
    }
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls"
        disabled={loading}
      />
      {isButton ? (
         <Button onClick={handleButtonClick} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload File
        </Button>
      ) : (
        <Button onClick={handleButtonClick} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileUp className="mr-2 h-4 w-4" />
          )}
          Upload & Process
        </Button>
      )}
    </>
  );
}
