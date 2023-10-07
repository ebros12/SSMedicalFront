import React, { useEffect, useState } from 'react';
import { useProcedimientosStore } from '../hooks/useProcedimientosStore';
import {
  Button,
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
          .map(() => false);

        setPacienteData((prevData) => ({
          ...prevData,
          modulosData: modulosTipo2Data,
        }));
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

  const handleInputChange = (field: string, value: string) => {
    setPacienteData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newModulosData = [...pacienteData.modulosData];
    newModulosData[index] = event.target.checked;

    setPacienteData((prevData) => ({
      ...prevData,
      modulosData: newModulosData,
    }));
  };

  const handleGuardar = () => {
    // Guardar el doctor seleccionado en los datos del paciente
    setPacienteData((prevData) => ({
      ...prevData,
      doctorSeleccionado: selectDoctor,
    }));

    // Resto de la lógica para guardar otros datos si es necesario

    // Puedes actualizar los cambios en el estado local para que se reflejen de inmediato
    // Esto actualizará los campos con los nuevos valores después de hacer clic en "Guardar"
    // Si estás utilizando un estado global para manejar los datos, deberías actualizarlo aquí
    // Ejemplo: dispatch({ type: 'ACTUALIZAR_DATOS_PACIENTE', payload: pacienteData });

    // Guardar los datos actualizados en el localStorage
    localStorage.setItem('pacienteData', JSON.stringify(pacienteData));

    Swal.fire('Guardado Completado', '', 'success');
  };

  const handleClick = (nuevaSeleccion: string) => {
    // Llama a la función de manejo de cambios con la nueva selección
    onSeleccionChange(nuevaSeleccion);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} className={`paciente`}>
          <Button className='btnVolver' onClick={() => onSeleccionChange('')}>
            <ReplyIcon /> Volver
          </Button>
        </Grid>
        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Paciente</Typography>
        </Grid>

        <Grid item xs={6} className={`paciente`}>
          <Typography variant="subtitle2">
            Nombre:
            <input
              id="nombre"
              type='text'
              value={pacienteData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
            />
          </Typography>
          <Typography variant="subtitle2">
            Rut:
            <input
              id="rut"
              type='text'
              value={pacienteData.rut}
              onChange={(e) => handleInputChange('rut', e.target.value)}
            />
          </Typography>
        </Grid>

        <Grid item xs={6} className={`paciente`}>
          <Typography variant="subtitle2">
            Ficha Médica:
            <input
              id="FMedica"
              type='text'
              value={pacienteData.fichaMedica}
              onChange={(e) => handleInputChange('fichaMedica', e.target.value)}
            />
          </Typography>
          <Typography variant="subtitle2">
            Edad:
            <input
              id="edad"
              type='text'
              value={pacienteData.edad}
              onChange={(e) => handleInputChange('edad', e.target.value)}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Motivo</Typography>
        </Grid>

        <Grid item xs={6} className={`paciente`}>
          <Typography variant="subtitle2">
            Referido por:
            <input
              id="referido"
              type='text'
              value={pacienteData.referidoPor}
              onChange={(e) => handleInputChange('referidoPor', e.target.value)}
            />
          </Typography>
          <Typography variant="subtitle2">
            Motivo:
            <input
              id="motivo"
              type='text'
              value={pacienteData.motivo}
              onChange={(e) => handleInputChange('motivo', e.target.value)}
            />
          </Typography>
          <Typography variant="subtitle2">
            Premedicación:
            <input
              id="premedicacion"
              type='text'
              value={pacienteData.premedicacion}
              onChange={(e) => handleInputChange('premedicacion', e.target.value)}
            />
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle1">
            título:
            <input
              id="tituloDesc"
              type='text'
              value={pacienteData.tituloDesc}
              onChange={(e) => handleInputChange('tituloDesc', e.target.value)}
            />
          </Typography>
          <Typography variant="subtitle2">
            Descripción:
            <input
              id="Desc"
              type="text"
              value={pacienteData.Desc}
              onChange={(e) => handleInputChange('Desc', e.target.value)}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} className={`paciente`}>
          <Typography variant="subtitle1">Módulos</Typography>
        </Grid>

        <Grid item xs={6}>
          {modulos ? (
            modulos.map((item, index) => (
              <div key={index}>
                {item.estado === '1' ? (
                  <Typography variant="subtitle2">
                    {item.nombre}:
                    <input
                      id={`${item.nombre}`}
                      type="text"
                      value={pacienteData[`${item.nombre}`]}
                      onChange={(e) => handleInputChange(`${item.nombre}`, e.target.value)}
                    />
                  </Typography>
                ) : (
                  ''
                )}
              </div>
            ))
          ) : (
            <Typography variant="subtitle2">No se encontraron módulos</Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          {modulos ? (
            modulos.map((item, index) => (
              <div key={index}>
                {item.estado === '2' ? (
                  <label>
                    {item.nombre}:
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange(index)}
                      checked={pacienteData.modulosData[index]}
                    />
                  </label>
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
        <Grid item xs={12}>
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
