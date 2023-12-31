import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import { useAuthStore, useDashboardStore } from '../hooks';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const CameraComponent = () => {
  //manejar variables de entorno
  const { status, checkAuthToken, rol, user } = useAuthStore();

 

  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataStorage, setDataStorage] = useState(false)
  const [datosPac, setDatosPac] = useState(true)
  const [recargar, setRecargar] = useState(false)
  const [imprimir, setImprimir] = useState(false)
  const { guardarRevision}  = useDashboardStore(); 
  useEffect(() => {
    let data = localStorage.getItem('patientData')
    if(data){
      setDataStorage(JSON.parse(data))
    }else{
      setDataStorage(false)
    }
  }, [recargar])
  
const agregarDatos = () =>{
  setDatosPac(!datosPac)
}



const guardarData = () => {
  // Obtener los valores de los inputs por su ID
  const nombreInput = document.getElementById('nombre') as HTMLInputElement;
  const rutInput = document.getElementById('rut') as HTMLInputElement;
  const fichaMedicaInput = document.getElementById('FMedica') as HTMLInputElement;
  const edadInput = document.getElementById('edad') as HTMLInputElement;
  const referidoPorInput = document.getElementById('referido') as HTMLInputElement;
  const motivoInput = document.getElementById('motivo') as HTMLInputElement;
  const premedicacionInput = document.getElementById('premedicacion') as HTMLInputElement;

  const tituloDescInput = document.getElementById('tituloDesc') as HTMLInputElement;
  const DescInput = document.getElementById('Desc') as HTMLInputElement;
  


  // Obtener los valores de los inputs utilizando la propiedad value
  const nombre = nombreInput.value;
  const rut = rutInput.value;
  const fichaMedica = fichaMedicaInput.value;
  const edad = edadInput.value;
  const referidoPor = referidoPorInput.value;
  const motivo = motivoInput.value;
  const premedicacion = premedicacionInput.value;

  const tituloDesc = tituloDescInput.value;
  const desc = DescInput.value;
  const dataPersona = {nombre,rut,fichaMedica,edad,referidoPor,motivo,premedicacion,tituloDesc,descripcion:desc}
  localStorage.setItem('patientData',JSON.stringify(dataPersona))
  setRecargar(!recargar)
}

const borrarDatos = () =>{
  setRecargar(true)
  localStorage.removeItem('patientData');
  
}
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
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      setCapturedPhotos((prevPhotos) => [...prevPhotos, dataUrl]);
    }
  };

  const clearPhotos = () => {
    setCapturedPhotos([]);
  };

  const savePhotosToServer = async () => {
    try {
      const formData = new FormData();
      let fotosUrl = []
      capturedPhotos.forEach((photo, index) => {
        const file = dataURLtoFile(photo, `photo_${dataStorage.fichaMedica+'_'+index}.png`);
        formData.append('photos', file);
        fotosUrl.push(`photo_${dataStorage.fichaMedica+'_'+index}.png`)
       
      });
      dataStorage.fotos = fotosUrl
      localStorage.setItem('patientData',JSON.stringify(dataStorage))
      const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL+'/dashboard/guardarScanner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Fotos guardadas en el servidor:', response.data);
      if(response.data.ok){
        guardarRevision(dataStorage)

          Swal.fire({
            title: 'Datos Guardados',
            text: 'Se redirigira al Home',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Gracias',
          }).then((result) => {
            if (result.isConfirmed) {
              // Se confirma la acción, guardar revisión y redireccionar
              window.location.href = '/home';
            }
          });

        
      
      }
    } catch (error) {
      console.error('Error al guardar las fotos en el servidor:', error);
    }
  };

  const dataURLtoFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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
  
  const deletePhoto = (index: number) => {
    setCapturedPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    await setImprimir(true)
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

    } else {
      console.error('Elemento con id "content" no encontrado.');
    }
  };
  

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12} container>
        <Grid item xs={9} container  justifyContent="center" alignItems="center" spacing={2}>
          {showCanvas ? <video ref={videoRef} autoPlay playsInline muted className="imagenes" /> : ''}
        </Grid>
        <Grid item xs={3} alignSelf={'center'}>
        <ButtonGroup orientation="vertical" size="large" aria-label="large button group">
            <Button onClick={startCamera} color="primary" variant="contained" size='large'>
              Prender Cámara
            </Button>
            <Button onClick={handleHideCanvas} color="primary" size='large'>
              Apagar Cámara
            </Button>

            <Button onClick={capturePhoto} color="primary" size='large'>
              Sacar Foto
            </Button>
            <Button onClick={clearPhotos} color="primary" size='large'>
              Borrar todas las Fotos
            </Button>
            
          </ButtonGroup>
          <ButtonGroup className='mt-1' orientation="vertical" size="large" aria-label="large button group">
            <Button size='large' color='success' variant="contained" onClick={agregarDatos}>{datosPac?'Ocultar datos':'Agregar Datos'}</Button>
            <Button size='large' color='error' variant="contained" onClick={borrarDatos}>Borrar Datos</Button>
          </ButtonGroup>
        </Grid>
        
      </Grid>

      <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} id="content">
        
      {
        datosPac?(        <Grid item xs={8}>
          <Typography textAlign={'center'} variant="h1">
            Unidad de Endoscopia
          </Typography>
          <hr />
          <Typography textAlign={'center'} variant="h1">
            Panendoscopía
          </Typography>
          <Typography sx={{ float: 'right' }}>Fecha: {moment().format('DD-MM-YYYY')}</Typography>
          {dataStorage?(<div className={`paciente`}>
            <Typography variant="subtitle1">Paciente</Typography>
            <Typography variant="subtitle2">Nombre: {dataStorage.nombre}</Typography>
            <Typography variant="subtitle2">Rut: {dataStorage.rut}</Typography>
            <Typography variant="subtitle2">Ficha Médica: {dataStorage.fichaMedica}</Typography>
            <Typography variant="subtitle2">Edad: {dataStorage.edad}</Typography>
          </div>):(<div className={`paciente`}>
            <Typography variant="subtitle1">Paciente</Typography>
            <Typography variant="subtitle2">Nombre: <input id="nombre" type='text' /></Typography>
            <Typography variant="subtitle2">Rut: <input id="rut" type='text' /></Typography>
            <Typography variant="subtitle2">Ficha Médica: <input id="FMedica" type='text' /></Typography>
            <Typography variant="subtitle2">Edad: <input id="edad" type='text' /></Typography>
          </div>)}

          {dataStorage?(<div className={`paciente`}>
            <Typography variant="subtitle1">Motivo</Typography>
            <Typography variant="subtitle2">Referido por: {dataStorage.referidoPor} </Typography>
            <Typography variant="subtitle2">Motivo: {dataStorage.motivo} </Typography>
            <Typography variant="subtitle2">Premedicación: {dataStorage.premedicacion} </Typography>
          </div>):(<div className={`paciente`}>
            <Typography variant="subtitle1">Motivo</Typography>
            <Typography variant="subtitle2">Referido por: <input id="referido" type='text' /> </Typography>
            <Typography variant="subtitle2">Motivo: <input id="motivo" type='text' /> </Typography>
            <Typography variant="subtitle2">Premedicación: <input id="premedicacion" type='text' /> </Typography>
            <Grid className="boton mt-1"  justifyContent="center" alignItems="center" container>
              <Button color='primary' onClick={guardarData}>Guardar</Button> 
            </Grid>
            
          </div>)}

          <div className={`motivo ${dataStorage?'':'hide'}`}>

          </div>

        </Grid>):''
      }
        
        <Grid item xs={8} container justifyContent="center" alignItems="center" spacing={2} mb={2}>
  {capturedPhotos.map((photo, index) => (
    <Grid item xs={4} key={index}>
      <a href={photo} target="_blank">
        <img src={photo} alt={`Captured photo ${index}`} className="capturas" />
      </a>
      <Button onClick={() => deletePhoto(index)} color="primary" className={`${imprimir? 'hide':''}`}>
        Borrar Foto
      </Button>
    </Grid>
  ))}
{Array.isArray(dataStorage.fotos) && dataStorage.fotos.length > 0 && (
  <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mt={2}>
    {dataStorage.fotos.map((photo, index) => (
      <Grid item xs={4} key={index}>
        <a href={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL+'/uploads/'+photo} target="_blank">
          <img src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL+'/uploads/'+photo} alt={`Stored photo ${index}`} className="capturas" />
        </a>
      </Grid>
    ))}
  </Grid>
)}
</Grid>
        <Grid container className={`descBox ${datosPac?'':'hide'}`} justifyContent="center" alignItems="center" ml={2}>
        <Grid item xs={8} border={'solid 2px'} padding={'1rem'} >
          <Typography variant="subtitle1">Descripción</Typography>
        </Grid>
        {dataStorage?(<Grid item xs={8} border={'solid 2px'} borderTop={'none'} padding={'1rem'}>
          <Typography variant="subtitle1">{dataStorage.tituloDesc}</Typography>
          <Typography variant="subtitle2">{dataStorage.descripcion}</Typography>

          <Typography variant="subtitle2" mt={'1rem'}>
            <img width={'60rem'} src="https://www.pngplay.com/wp-content/uploads/1/Letter-X-PNG-Stock-Photo.png" alt="Test Ureasa" />
            TEST UREASA
          </Typography>
        </Grid>):(<Grid item xs={8} border={'solid 2px'} borderTop={'none'} padding={'1rem'}>
          <Typography variant="subtitle1">titulo: <input id="tituloDesc" type='text' /> </Typography>
          <Typography variant="subtitle2">descripcion: <input id="Desc" type='text' /> </Typography>

          <Typography variant="subtitle2" mt={'1rem'}>
            <img width={'60rem'} src="https://www.pngplay.com/wp-content/uploads/1/Letter-X-PNG-Stock-Photo.png" alt="Test Ureasa" />
            TEST UREASA
          </Typography>
        </Grid>)
        
      
        }
        </Grid>


        <Grid item xs={9} padding={'1rem'}>
          <Typography variant="subtitle2" textAlign={'center'}>
            Dr. (a) {user.name}
          </Typography>
        </Grid>
      </Grid>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button onClick={generatePDF} color="primary">
        Descargar PDF
      </Button>
      <Button onClick={savePhotosToServer} color="primary">
        Guardar Fotos en el Servidor
      </Button>
    </Grid>
  );
};

export default CameraComponent;
