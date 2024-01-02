import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup, Grid, IconButton, Typography, TextField, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

interface CameraProps {
  seleccion: string;
  onSeleccionChange: (nuevaSeleccion: string) => void;
}

const Camera: React.FC<CameraProps> = ({ seleccion, onSeleccionChange }) => {
  const [showCanvas, setShowCanvas] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<{ photo: string; name: string }[]>(() => {
    const savedPhotos = localStorage.getItem('capturedPhotos');
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });
  const [photoName, setPhotoName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (showCanvas) {
      startCamera();
    }
  }, [showCanvas]);

  useEffect(() => {
    // Actualizar el título por defecto "Sin título" cuando se cargan nuevas fotos
    setCapturedPhotos((prevPhotos) =>
      prevPhotos.map((photo) => ({
        ...photo,
        name: photo.name ,
      }))
    );
  }, [capturedPhotos]);

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

  const handleHideCanvas = () => {
    setShowCanvas(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const video = videoRef.current;

      if (context && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        const newPhoto = { photo: dataUrl, name: photoName };
        setCapturedPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
        setPhotoName('');

        const updatedPhotos = [...capturedPhotos, newPhoto];
        setCapturedPhotos(updatedPhotos);

        localStorage.setItem('capturedPhotos', JSON.stringify(updatedPhotos));
      }
    }
  };

  const deletePhoto = (index: number) => {
    const newPhotos = [...capturedPhotos];
    newPhotos.splice(index, 1);
    setCapturedPhotos(newPhotos);

    localStorage.setItem('capturedPhotos', JSON.stringify(newPhotos));
  };

  const handleEditTitle = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveTitle = (index: number, newTitle: string) => {
    const newPhotos = [...capturedPhotos];
    newPhotos[index].name = newTitle;
    setCapturedPhotos(newPhotos);

    localStorage.setItem('capturedPhotos', JSON.stringify(newPhotos));
    setEditingIndex(null);
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Button className='btnVolver' onClick={() => onSeleccionChange('')}><ReplyIcon />Volver</Button>
        </Grid>
        <Grid item xs={4} container>
          <Grid item xs={12} alignSelf={'center'}>
            <ButtonGroup orientation="vertical" size="large" aria-label="large button group">
              <Button onClick={startCamera} color="primary" variant="contained" size="large">
                Prender Cámara
              </Button>
              <Button onClick={handleHideCanvas} color="primary" size="large">
                Apagar Cámara
              </Button>
              <TextField
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
                label="Nombre de la foto"
                variant="outlined"
                size="small"
                fullWidth
                style={{ marginBottom: '8px' }}
              />
              <Button onClick={capturePhoto} color="primary" size="large">
                Sacar Foto
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={8} container justifyContent="center" alignItems="center" spacing={2}>
          {showCanvas ? <video ref={videoRef} autoPlay playsInline muted className="imagenes"></video> : ''}
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {capturedPhotos.map((item, index) => (
          <Grid item xs={4} key={index}>
            <div style={{ position: 'relative' }}>
              <img src={item.photo} alt={`Captured photo ${index}`} className="capturas" />
              <IconButton
                color="primary"
                aria-label="Borrar Foto"
                onClick={() => deletePhoto(index)}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            </div>

            {editingIndex === index ? (
              <div>
                <TextField
                  label="Nuevo Título"
                  variant="outlined"
                  size="small"
                  fullWidth
                  defaultValue={item.name}
                  onBlur={(e) => handleSaveTitle(index, e.target.value)}
                />
              </div>
            ) : (
              <Typography variant="subtitle1" align="center">
                {item.name ? item.name : <Button onClick={() => handleEditTitle(index)}>Ingresar Título</Button>}
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default Camera;
