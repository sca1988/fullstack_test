import { Button } from '@mui/material';
import React from 'react';

export interface IProps {
    name?:string;
    email?: string;
}

const DownloadXmlButton = (props: IProps) => {
  const handleDownload = async () => {
    try {
    const params = new URLSearchParams();
        //Filters parameters
        if (props.name) {
            params.append("name", props.name);
        }
        if (props.email) {
            params.append("email", props.email);
        }
    
        const apiUrl = `/api/customers/xmlexport?${params.toString()}`;

       
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.xml');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    
     <Button variant="contained" color="primary" onClick={handleDownload}>
      Export XML
    </Button>
  );
};

export default DownloadXmlButton;
