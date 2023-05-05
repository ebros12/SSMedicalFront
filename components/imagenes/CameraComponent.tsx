import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Grid, Typography } from '@mui/material';
import moment from 'moment';



const CameraComponent = () => {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCanvas(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;
      context?.drawImage(videoRef.current, 0, 0, (canvas.width), canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      setCapturedPhotos((prevPhotos) => [...prevPhotos, dataUrl]);
      console.log("imagen",capturedPhotos)
      
    }
    
  };

  const clearPhotos = () => {
    setCapturedPhotos([]);
  };
  const handleHideCanvas = () => {
    setShowCanvas(false);
  };

  const generatePDF = async () => {
    const content = document.getElementById('content');
    if (content) {
      const pdf = new jsPDF();
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('document.pdf');
    }else{
      console.error('Elemento con id "content" no encontrado.');
    }
  };

  return (
    <Grid  container justifyContent="center" alignItems="center" spacing={2}> 
      <Grid item xs={12}>
        <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2}>
          {showCanvas?<video ref={videoRef} autoPlay playsInline muted className='imagenes'/>:''}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} mt={1}>
              
              <Button onClick={startCamera} color='primary'>Prender Camara</Button>
              <Button onClick={handleHideCanvas} color='primary'>Apagar Camara</Button>
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} mt={1}>
              
              <Button onClick={capturePhoto} color='primary'>Sacar Foto</Button>
              <Button onClick={clearPhotos} color='primary'>Borrar todas las Fotos</Button>
          </Grid>

        </Grid>
      </Grid>
      <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} id="content">
          <Grid item xs={8}>
              <Typography textAlign={'center'} variant='h1'>Unidad de Endoscopia</Typography>
              <hr />
              <Typography textAlign={'center'} variant='h1'>Panendoscopía</Typography>
              <Typography sx={{ float:'right' }}>Fecha: {moment().format("DD-MM-YYYY")}</Typography>

              <Typography variant='subtitle1'>Paciente</Typography>
              <Typography variant='subtitle2'>Nombre: Marcelo Antonio Salgado Duran</Typography>
              <Typography variant='subtitle2'>Rut: 18.247.442-8</Typography>
              <Typography variant='subtitle2'>Ficha Medica: </Typography>
              <Typography variant='subtitle2'>Edad: </Typography>

              <Typography variant='subtitle1'>Paciente</Typography>
              <Typography variant='subtitle2'>Referido por: HOSPITAL </Typography>
              <Typography variant='subtitle2'>Motivo: GASTRITIS </Typography>
              <Typography variant='subtitle2'>Premedicación: LIDOCAINA </Typography>

          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} >
            {capturedPhotos.map((photo, index) => (
                <a key={index} href={photo} target='_blank'><img key={index} src={photo} alt={`Captured photo ${index}`} className='capturas' /></a>
              ))}
          </Grid>
          <Grid item xs={8} border={'solid 2px'} padding={'1rem'} borderBottom={'none'}>
            <Typography variant='subtitle1'>Descripción</Typography>
          </Grid>
          <Grid item xs={8} border={'solid 2px'} padding={'1rem'}>
            <Typography variant='subtitle1'>ESOFAGO</Typography>
            <Typography variant='subtitle2'>Esofago ok</Typography>

            <Typography variant='subtitle2' mt={'1rem'}>
              <img width={'60rem'}  src="https://www.pngplay.com/wp-content/uploads/1/Letter-X-PNG-Stock-Photo.png" />
              TEST UREASA
            </Typography>
          </Grid>
          <Grid item xs={9}  padding={'1rem'}>
            <Typography variant='subtitle2' textAlign={'center'}>Dr. (a) JUAN MORENO HERRERA</Typography>
          </Grid>
          
      </Grid>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button onClick={generatePDF} color='primary'>Descargar PDF</Button>
    </Grid>
  );
};

export default CameraComponent;
