import React, { useEffect, useState } from 'react';
import { useProcedimientosStore } from '../hooks/useProcedimientosStore';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import Swal from 'sweetalert2';

interface SeleccionEndoProps {
  seleccion: string;
  onSeleccionChange: (nuevaSeleccion: string) => void;
}

const InfoEndo: React.FC<SeleccionEndoProps> = ({
  seleccion,
  onSeleccionChange,
}) => {
  const { startObtenerModulos, startObtenerDoctor } = useProcedimientosStore();
  const [modulos, setModulos] = useState<any[]>([]);
  const [pacienteData, setPacienteData] = useState(null);
  const [doctores, setDoctores] = useState<any[]>([]);
  const [selectDoctor, setSelectDoctor] = useState('');

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
  
        // Inicializar modulosData para los módulos tipo 2
        const modulosTipo2Data = modulosData
          .filter((item) => item.estado === '2')
          .reduce((acc, item) => {
            acc[item.nombre] = false;
            return acc;
          }, {});

      }
    };
  
    fetchData();
  
  
    // Cargar los datos del paciente desde el localStorage si están almacenados
    const storedPacienteData = localStorage.getItem('pacienteData');

    if (storedPacienteData) {
      const parsedPacienteData = JSON.parse(storedPacienteData);
      console.log('first',parsedPacienteData)
      setPacienteData(parsedPacienteData);
  
      // Verificar si hay un doctor seleccionado en los datos cargados y actualizar el estado
      if (parsedPacienteData.doctorSeleccionado) {
        setSelectDoctor(parsedPacienteData.doctorSeleccionado);
      }
    }
  }, []); // <-- Asegúrate de pasar un array vacío como dependencia para que el useEffect se ejecute solo una vez al montar el componente
  

  const handleInputChange = (field: string, value: string) => {
    setPacienteData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (item) => {
    console.log(item)
    setPacienteData((prevData) => {
      const newModulosData = { ...prevData.modulosData };
      // Utiliza el nombre del módulo como clave y el valor del checkbox como su valor
      newModulosData[item.nombre] = !newModulosData[item.nombre];
      return {
        ...prevData,
        modulosData: newModulosData,
      };
    });
  };
  

  const handleGuardar = () => {
    // Guardar el doctor seleccionado en los datos del paciente
    setPacienteData((prevData) => ({
      ...prevData,
      doctorSeleccionado: selectDoctor,
    }));
  
    // Resto de la lógica para guardar otros datos si es necesario
  
    // Utiliza la función de devolución de llamada opcional de setPacienteData
    // para asegurarte de que los datos estén actualizados antes de guardarlos en localStorage
    setPacienteData((updatedData) => {
      // Guardar los datos actualizados en el localStorage
      localStorage.setItem('pacienteData', JSON.stringify(updatedData));
      console.log("final", updatedData);
      return updatedData; // Devuelve los datos actualizados para que setPacienteData tenga la versión más reciente
    });
  
    Swal.fire('Guardado Completado', '', 'success');
  };
  
  

  const handleClick = (nuevaSeleccion: string) => {
    // Llama a la función de manejo de cambios con la nueva selección
    onSeleccionChange(nuevaSeleccion);
  };


  return (
    <>
      <Grid container spacing={3} className='espacioContainer'>

        <Grid item xs={12} className={`paciente`} >
          <Button className='btnVolver' onClick={() => onSeleccionChange('')}>
            <ReplyIcon /> Volver
          </Button>
        </Grid>
        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Paciente</Typography>
        </Grid>

        <Grid item xs={12} md={6} className={`paciente`} display={'grid'}  gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'} gridAutoColumns={'40% 60%'} gridTemplateRows={'min-content'}>
          <Typography variant="subtitle2">
            Nombre:
          </Typography>
          <input
              id="nombre"
              type='text'
              value={pacienteData?.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
            />
          <Typography variant="subtitle2">
            Rut:
          </Typography>
          <input
              id="rut"
              type='text'
              value={pacienteData?.rut}
              onChange={(e) => handleInputChange('rut', e.target.value)}
            />
        </Grid>

        <Grid item xs={12} md={6} className={`paciente`} display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'}>
          <Typography variant="subtitle2">
            Ficha Médica:
          </Typography>
          <input
              id="FMedica"
              type='text'
              value={pacienteData?.fichaMedica}
              onChange={(e) => handleInputChange('fichaMedica', e.target.value)}
            />
          <Typography variant="subtitle2">
            Edad:
          </Typography>
          <input
              id="edad"
              type='text'
              value={pacienteData?.edad}
              onChange={(e) => handleInputChange('edad', e.target.value)}
            />
        </Grid>

        <Grid item xs={12} >
          <Divider />
        </Grid>

        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Motivo</Typography>
        </Grid>

        <Grid item xs={12} md={6} className={`paciente`} display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'}>
          <Typography variant="subtitle2">
            Referido por:
          </Typography>
          <input
              id="referido"
              type='text'
              value={pacienteData?.referidoPor}
              onChange={(e) => handleInputChange('referidoPor', e.target.value)}
            />
          <Typography variant="subtitle2">
            Motivo:
          </Typography>
          <input
              id="motivo"
              type='text'
              value={pacienteData?.motivo}
              onChange={(e) => handleInputChange('motivo', e.target.value)}
            />
          <Typography variant="subtitle2">
            Premedicación:
          </Typography>
          <input
              id="premedicacion"
              type='text'
              value={pacienteData?.premedicacion}
              onChange={(e) => handleInputChange('premedicacion', e.target.value)}
            />
        </Grid>

        <Grid item xs={12} md={6} display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'}>
          <Typography variant="subtitle1">
            título:
          </Typography>
          <input
              id="tituloDesc"
              type='text'
              value={pacienteData?.tituloDesc}
              onChange={(e) => handleInputChange('tituloDesc', e.target.value)}
            />
          <Typography variant="subtitle2">
            Descripción:
          </Typography>
          <input
              id="Desc"
              type="text"
              value={pacienteData?.Desc}
              onChange={(e) => handleInputChange('Desc', e.target.value)}
            />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Módulos</Typography>
        </Grid>

        <Grid item xs={12} md={6} display={'grid'} >
          {modulos ? (
            modulos.map((item, index) => (
              <Grid container key={index}>
                {item.estado === '1' ? (
                  <Grid container gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'}>
                  <Grid item xs={12} md={6} >
                      <Typography variant="subtitle2">
                          {item.nombre}:
                      </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} >
                      <input
                        id={`${item.nombre}`}
                        type="text"
                        value={pacienteData[`${item.nombre}`] || ''}
                        onChange={(e) => handleInputChange(`${item.nombre}`, e.target.value)}
                      />
                  </Grid>

                  </Grid>

                ) : (
                  ''
                )}
              </Grid>
            ))
          ) : (
            <Typography variant="subtitle2">No se encontraron módulos</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6} display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(2, 1fr)'}>
        {modulos ? (
  modulos.map((item, index) => (
    <div key={index}>
      {item.estado === '2' ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={pacienteData.modulosData?pacienteData.modulosData[item.nombre] : false }
              onChange={() => handleCheckboxChange(item)}
            />
          }
          label={item.nombre}
        />
      ) : null}
    </div>
  ))
) : (
  <Typography variant="subtitle2">No se encontraron módulos</Typography>
)}

        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} >
          <FormControl fullWidth>
            <InputLabel id="Doctor-label">Doctores</InputLabel>
            <Select
              labelId="Doctor-label"
              id="Doctor"
              value={selectDoctor}
              onChange={(e) => setSelectDoctor(e.target.value as string)}
              label="Doctores"
            >
              {doctores?.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.nombre}>
                  {doctor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid className="boton mt-1" justifyContent="center" alignItems="center" container>
          <Button color="primary" onClick={handleGuardar}>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default InfoEndo;
