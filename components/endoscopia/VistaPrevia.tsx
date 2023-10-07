import { Grid, Typography, Button, IconButton, Divider } from '@mui/material';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'; // Importa el ícono de borrado
import ReplyIcon from '@mui/icons-material/Reply';
import { useProcedimientosStore } from '../hooks/useProcedimientosStore';
import { useDashboardStore } from '../hooks';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SeleccionEndoProps {
    seleccion: string;
    onSeleccionChange: (nuevaSeleccion: string) => void;
  }

const VistaPrevia: React.FC<SeleccionEndoProps> = ({
  seleccion,
  onSeleccionChange,
}) => {
    const [capturedPhotos, setCapturedPhotos] = useState<{ photo: string; name: string }[]>(() => {
        // Recuperar fotos almacenadas en el localStorage al inicializar el componente
        const savedPhotos = localStorage.getItem('capturedPhotos');
        return savedPhotos ? JSON.parse(savedPhotos) : [];
      });
    let storedPacienteData = localStorage.getItem('pacienteData');
    const { startObtenerModulos, startObtenerDoctor } = useProcedimientosStore();
    const { guardarRevision}  = useDashboardStore(); 
    const [modulos, setModulos] = useState<any[]>([]);
    const [doctores, setDoctores] = useState<any[]>([]);
    const [selectDoctor, setSelectDoctor] = useState('');
    const [pacienteData, setPacienteData] = useState({
        nombre: '',
        rut: '',
        fichaMedica: '',
        edad: '',
        referidoPor: '',
        motivo: '',
        premedicacion: '',
        tituloDesc: '',
        Desc: '',
        modulosData: [], // Array para almacenar el estado de selección de los módulos
        doctorSeleccionado: '', // Campo para almacenar el ID del doctor seleccionado
      });
    useEffect(() => {
        const fetchData = async () => {
          const searchParams = new URLSearchParams(window.location.search);
          const tipo = searchParams.get('TIPO');
    
          if (tipo) {
            const modulosResponse = await startObtenerModulos(tipo);
            const modulosData = modulosResponse.data || [];
            setModulos(modulosData);
    
            const doctoresResponse = await startObtenerDoctor();
            const doctoresData = doctoresResponse.data || [];
            setDoctores(doctoresData);

    
          }
        };
    
        fetchData();
    
        // Cargar los datos del paciente desde el localStorage si están almacenados
        const storedPacienteData = localStorage.getItem('pacienteData');
        if (storedPacienteData) {
          const parsedPacienteData = JSON.parse(storedPacienteData);
          setPacienteData(parsedPacienteData);
    
          // Verificar si hay un doctor seleccionado en los datos cargados y actualizar el estado
          if (parsedPacienteData.doctorSeleccionado) {
            setSelectDoctor(parsedPacienteData.doctorSeleccionado);
          }
        }
      }, []);

    storedPacienteData=JSON.parse(storedPacienteData)
    const searchParams = new URLSearchParams(window.location.search);
    const tipo = searchParams.get('TIPO');

    console.log(capturedPhotos,storedPacienteData,modulos,"kuki")

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
const savePhotosToServer = async () => {
  try {
    const formData = new FormData();
    const fotosUrl = [];

    for (let i = 0; i < capturedPhotos.length; i++) {
      const photoData = capturedPhotos[i];
      const file = dataURLtoFile(photoData.photo, `photo_${storedPacienteData.fichaMedica + '_' + i}.png`);
      formData.append('photos', file);
      fotosUrl.push(`photo_${storedPacienteData.fichaMedica + '_' + i}.png`);
    }

    storedPacienteData.fotos = fotosUrl;

    // Asegúrate de que la estructura de datos coincida con la esperada en el servidor
    const objeto = {
      desc: storedPacienteData.Desc,
      edad: storedPacienteData.edad,
      fichaMedica: storedPacienteData.fichaMedica,
      motivo: storedPacienteData.motivo,
      nombre: storedPacienteData.nombre,
      premedicacion: storedPacienteData.premedicacion,
      referidoPor: storedPacienteData.referidoPor,
      rut: storedPacienteData.rut,
      tituloDesc: storedPacienteData.tituloDesc,
      fotos: storedPacienteData.fotos,
    };

    // Enviar los datos al servidor utilizando Axios
    const response = await axios.post(
      process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/dashboard/guardarScanner',
      formData
    );

    console.log('Datos guardados en el servidor:', response.data);
    if (response.data.ok) {
      guardarRevision(objeto);

      Swal.fire({
        title: 'Datos Guardados',
        text: 'Se redirigirá al Home',
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
    console.error('Error al guardar los datos en el servidor:', error);
  }
};

const [imprimir, setImprimir] = useState(false)
const generatePDF = async () => {
  await setImprimir(true);
  const content = document.getElementById('content');
  
  if (content) {
    // Aumenta la calidad de la imagen generada por html2canvas
    const canvas = await html2canvas(content, { scale: 2 }); // Puedes ajustar el valor de escala según tus necesidades

    // Obtiene las dimensiones del contenido
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    // Crea un PDF con las dimensiones del contenido
    const pdf = new jsPDF('p', 'pt', [contentWidth, contentHeight]);

    // Convierte el canvas en una imagen de alta calidad
    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Ajusta el formato y la calidad aquí

    // Agrega la imagen al PDF sin aplicar un zoom
    pdf.addImage(imgData, 'JPEG', 0, 0, contentWidth, contentHeight);

    pdf.save('document.pdf');
  } else {
    console.error('Elemento con id "content" no encontrado.');
  }
};






  return (
  <>
  <Grid  container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12} className={`paciente`}>
          <Button className='btnVolver' onClick={() => onSeleccionChange('')}><ReplyIcon />Volver</Button>
      </Grid>
  </Grid>

  <Grid  id="content" container justifyContent="center" alignItems="center" spacing={2} >

        <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} mb={2} mt={3} id="content">
            <Grid item xs={7}>
            <Typography textAlign={'center'} variant="h1" >
                Unidad de {tipo?.toLocaleLowerCase()}
            </Typography>
            <hr />
            <Typography textAlign={'center'} variant="h2">
                Panendoscopía
            </Typography>
            <Typography variant="h5" sx={{ float: 'right' }}>Fecha: {moment().format('DD-MM-YYYY')}</Typography>
            <Grid container>
            <Grid item xs={12}>
                <Typography variant="h3">Paciente</Typography>
            </Grid>
            
                <Grid item xs={2}>
                <Typography variant="h5">Nombre </Typography>
                    <Typography variant="h5">Rut </Typography>
                    <Typography variant="h5">Ficha Médica </Typography>
                    <Typography variant="h5">Edad </Typography>


                </Grid>
                <Grid item xs={9}>
                    <Typography variant="h6">: {storedPacienteData.nombre}</Typography>
                    <Typography variant="h6">: {storedPacienteData.rut}</Typography>
                    <Typography variant="h6">: {storedPacienteData.fichaMedica}</Typography>
                    <Typography variant="h6">: {storedPacienteData.edad}</Typography> 

             
                </Grid>
            
            <Grid item xs={12}>
                <Typography variant="h3">Procedimiento</Typography>
            </Grid>
            <Grid item xs={2}>
                    <Typography variant="h5">Referido por</Typography>
                    <Typography variant="h5">Motivo</Typography>
                    <Typography variant="h5">Premedicación </Typography>
            </Grid>
            <Grid item xs={9}>
                    <Typography variant="h6">: {storedPacienteData.referidoPor} </Typography>
                    <Typography variant="h6">: {storedPacienteData.motivo} </Typography>
                    <Typography variant="h6">: {storedPacienteData.premedicacion} </Typography>    
            </Grid>
          </Grid>

            </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" spacing={2} padding={'2rem 15rem'}>
        {capturedPhotos?.map((item, index) => (
        <Grid item xs={3} key={index}>
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
          <Typography variant="h4" align="center">
            {item.name}
          </Typography>
        </Grid>
        
      ))}
        </Grid>

        <Grid item xs={12} border={'solid 2px'} margin={'0rem 15rem'} padding={'1rem 0rem'}>
          <Typography variant="h3">Descripción</Typography>

        </Grid>
      <Grid item xs={12} border={'solid 2px'} borderTop={'none'} margin={'0rem 15rem'} >
          {modulos ? (
            modulos.map((item, index) => (
                
                    item.estado=="1"?(<Grid container spacing={1} className='mb-1'>
                        <Grid item xs={12}>
                            <Typography variant="h3">{item.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">{storedPacienteData[item.nombre]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <Divider />
                        </Grid>
                        
                    </Grid>):''
                

                
            ))):
            <Typography variant="h5">No se encontraron módulos</Typography>
          }
          {modulos ? (
            modulos.map((item, index) => (
                
                    item.estado=="2"?(        <Grid container spacing={0} className=''>
                        
                    <Grid item xs={12} className='checkBoxHtml'>
                        <img alt={item.nombre} src={`./img/recursos/check.png`} width={'5%'} />
                        <Typography className='ml-1' variant="h5">{item.nombre}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                    <Divider />
                    </Grid>
                    
                </Grid>):''
                

                
            ))):
            <Typography variant="h5">No se encontraron módulos</Typography>
          }
        </Grid>


        <Grid item xs={9} padding={'1rem'}>
          <Typography variant="h5" textAlign={'center'}>
            Dr. (a) {storedPacienteData.doctorSeleccionado}
          </Typography>
        </Grid>


    </Grid>

  <Grid   container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} padding={'1rem'}>
        <Button onClick={generatePDF} color="primary">
              Descargar PDF
            </Button>
            <Button onClick={savePhotosToServer} color="primary">
              Guardar Fotos en el Servidor
            </Button>

        </Grid>
  </Grid>

  </>

      
  )
}

export default VistaPrevia