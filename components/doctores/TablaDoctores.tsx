import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { usePacientesStore } from '../hooks/usePacientesStore';
import Radio from '@mui/material/Radio';
import { Grid, Button, Modal, Box, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useProcedimientosStore } from '../hooks/useProcedimientosStore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'seleccion', label: 'Seleccion', minWidth: 170 },
  { id: 'nombre', label: 'Nombre', minWidth: 170 },
  { id: 'celular', label: 'Celular', minWidth: 100 },
];

interface Data {
  seleccion: string;
  nombre: string;
  celular: string;

}

const TablaDoctores = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const [dataObtenida, setDataObtenida] = useState<Data[]>([]);

  const { startObtenerDoctor, startAgregarDoctor,
    startEditarDoctor} = useProcedimientosStore();
  
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [actualizar, setActualizar] = useState(false)
  

  useEffect(() => {
    const fetchData = async () => {
      let response = await startObtenerDoctor();
      let data = response.data;
      setDataObtenida(data);
    };

    fetchData();
  }, [actualizar]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setNombre('');
    setRutInput('');
    setCelular('');
    setFichaMedica('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => {
    setNombre('');
    setRutInput('');
    setCelular('');
    setFichaMedica('');
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const [rutInput, setRutInput] = useState<string>(''); // Añadir el tipo de dato string
  const [rutValido, setRutValido] = useState(true);

  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [fichaMedica, setFichaMedica] = useState('');
  const [referido, setReferido] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleRutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let nuevoRut = event.target.value;
  
    // Eliminar cualquier carácter que no sea número, punto o guión
    nuevoRut = nuevoRut.replace(/[^0-9.-]/g, '');
  
    // Formatear el RUT con puntos y guion
    const rutFormateado = formatearRut(nuevoRut);
  
    // Validar el RUT
    const esValido = validarRut(nuevoRut);
  
    setRutInput(rutFormateado);
  };

  const validarRut = (rut: string) => {
    // Expresión regular para validar un RUT chileno
    const rutRegExp = /^(\d{1,3}(\.\d{3})*-[\dkK])$/;

    if (!rutRegExp.test(rut)) {
      return false;
    }

    const cleanRut = rut.replace(/[.-]/g, '');
    const dv = cleanRut.slice(-1).toUpperCase();
    const rutNumber = parseInt(cleanRut.slice(0, -1), 10);

    // Cálculo del dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = cleanRut.length - 2; i >= 0; i--) {
      sum += parseInt(cleanRut[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDV = 11 - (sum % 11);
    const expectedDV = calculatedDV === 11 ? '0' : calculatedDV === 10 ? 'K' : calculatedDV.toString();

    return expectedDV === dv;
  };

  const formatearRut = (rut: string) => {
    const cleanRut = rut.replace(/[.-]/g, '');
    const rutNumber = parseInt(cleanRut);
    if (isNaN(rutNumber)) {
      return rut;
    }

    const dv = cleanRut.slice(-1);
    const formattedRut = [...cleanRut.slice(0, -1)].reverse().reduce((acc, digit, index) => {
      return digit + (index > 0 && index % 3 === 0 ? '.' : '') + acc;
    }, '');

    if (validarRut(formattedRut + '-' + dv)) {
      setRutValido(true);
    } else {
      setRutValido(false);
    }
    console.log("first", validarRut(formattedRut + '-' + dv), rutValido);
    return formattedRut + '-' + dv;
  };

  const btnGuardarPaciente = async() => {
    console.log('Nombre:', nombre);
    console.log('celular:', celular);
    if(rutValido){
      const guardar = await startAgregarDoctor({  
        nombre:nombre,
        celular:celular
        })
        if(guardar){
          Swal.fire("Paciente Creado","","success")
        }else{
          Swal.fire("Paciente Ya Existe","","info")
        }
    }else{
      Swal.fire("Debe ser un rut valido","","warning")
    }

  };

  const editarPaciente  = async() => {
    if(rutValido){
      const guardar = await startEditarDoctor({   
        nombre:nombre,
        celular:celular,
        })
        if(guardar){
          Swal.fire("Paciente Editado Correctamente","","success")
          setActualizar(!actualizar)
        }else{
          Swal.fire("Paciente Ya Existe","","info")
        }
    }else{
      Swal.fire("Debe ser un rut valido","","warning")
    }
  }
  const editarSeleccion = async() => {
    if (selectedRow?.nombre !== undefined) {
      setNombre(selectedRow?.nombre);
      setCelular(selectedRow?.celular);
      setOpen2(true);


    } else {
      Swal.fire(
        'Ups',
        `Debes seleccionar una fila`,
        'info'
      );
    }
  };

  const nuevoProcedimiento = () => {
    if (selectedRow?.nombre !== undefined) {
      setNombre(selectedRow?.nombre);
      setCelular(selectedRow?.celular);
      const dataPersona = {
        doctorSeleccionado: selectedRow?.nombre,
      };
      localStorage.setItem('pacienteData', JSON.stringify(dataPersona)); // Corregir el nombre de la clave a "pacienteData"
      location.href = '/procedimiento';
    } else {
      Swal.fire(
        'Ups',
        `Debes seleccionar una fila`,
        'info'
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataObtenida.length > 0 ? (
                  dataObtenida
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell padding="checkbox">
                          <Radio
                            checked={selectedRow?.id === row.id}
                            onChange={() => setSelectedRow(row)}
                          />
                        </TableCell>
                        {columns.slice(1).map((column) => { // Empieza desde la segunda columna
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 25, 100]}
            component="div"
            count={dataObtenida.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} display={'grid'}>
        <Button variant="contained" color="primary" size="large" onClick={nuevoProcedimiento}>
          Nuevo Procedimiento
        </Button>
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={editarSeleccion}
        >
          Editar
        </Button>
        <Button
          onClick={handleOpen}
          variant="contained"
          color="secondary"
          size="large"
        >
          Crear Doctor
        </Button>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: '90%', maxWidth: 600 }}>
          <h2 id="parent-modal-title">Crear Paciente</h2>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                label="Nombre"
                className="inputs"
                id="nombreInputs"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
{/*               <TextField
                label="Rut"
                className="inputs"
                id="rutInputs"
                value={rutInput}
                onChange={handleRutChange}
                variant="outlined" // Agrega esta línea
                color={rutValido ? 'success' : 'error'} // Agrega esta línea
                focused
              /> */}

            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Celular"
                className="inputs"
                id="celularInputs"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />

            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              style={{ marginRight: '10px' }}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={btnGuardarPaciente}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: '90%', maxWidth: 600 }}>
          <h2 id="parent-modal-title">Crear Paciente</h2>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                label="Nombre"
                className="inputs"
                id="nombreInputs"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
{/*               <TextField
                label="Rut"
                className="inputs"
                id="rutInputs"
                value={rutInput}
                onChange={handleRutChange}
                variant="outlined" // Agrega esta línea
                color={rutValido ? 'success' : 'error'} // Agrega esta línea
                focused
              /> */}

            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Celular"
                className="inputs"
                id="celularInputs"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />

            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleClose2}
              variant="contained"
              color="secondary"
              style={{ marginRight: '10px' }}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="warning" onClick={editarPaciente}>
              Editar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default TablaDoctores;
