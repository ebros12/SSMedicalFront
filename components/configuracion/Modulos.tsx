import { Checkbox, Grid, Button, Box, Modal, Typography, TextField, FormControl, InputLabel, MenuItem, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import TablaReact from '../tablas/TablaReact';
import { useProcedimientosStore } from '../hooks/useProcedimientosStore';
import moment from 'moment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
interface Usuario {
    nombre: string;
    tipo: string;
    descripcion: string;
    fecha: string;

    // Otros campos y tipos
  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Modulos = () => {
const { startObtenerTodosModulos, startObtenerTipoModulo
   } = useProcedimientosStore();


  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Especifica el tipo Usuario
  const [tipoModulo, setTipoModulo] = useState(); // Especifica el tipo Usuario
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]); // Especifica el tipo Usuario para selectedUsers

    useEffect(() => {
      const fetchData = async () => {
        let response = await startObtenerTodosModulos();
        let data = response.data;
        setUsuarios(data);

        let response2 = await startObtenerTipoModulo();
        let data2 = response2.data;
        setTipoModulo(data2)
      };
  
      fetchData();

      
    }, []);
  
    const columns = React.useMemo(
      () => [
        {
          Header: 'Seleccionar',
          accessor: 'checkbox', // Nuevo campo para el checkbox
          textAlign:'center',
          Cell: ({ row }) => (
            <Checkbox
              onChange={() => handleCheckboxChange(row.original)}
              checked={selectedUsers.includes(row.original)}
            />
          ),
        },
        {
          Header: 'Nombre',
          accessor: 'nombre',
        },
        {
          Header: 'Tipo',
          accessor: 'tipo',
        },
        {
          Header: 'Descripcion',
          accessor: 'descripcion',
        },
        {
            Header: 'Fecha',
            accessor: 'fecha',
            Cell: ({ value }) => moment(value).format('DD/MM/YYYY'), // Formatea la fecha usando Moment.js
          },
          {
            Header: 'Desactivar',
            accessor: 'estado', // Nuevo campo para el checkbox
            textAlign:'center',
            Cell: ({ row }) => (
              <IconButton aria-label="delete" size="large">
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              
            ),
          },
      ],
      [selectedUsers] // Agregar selectedUsers como dependencia
    );
  /*   <Button color='primary' variant="outlined" size='large'>🗑️</Button> */
    const handleCheckboxChange = (user) => {
      if (selectedUsers.includes(user)) {
        setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
        
      } else {
        setSelectedUsers([...selectedUsers, user]);
        console.log("selecuser",selectedUsers)
      }
    };
    // Resto del componente
const handleModificarUsuarios = () => {
    // Implementa la lógica para modificar usuarios seleccionados en un modal aquí
    // Puedes acceder a la lista de usuarios seleccionados a través de selectedUsers
    // Abre un modal o realiza las acciones necesarias para modificar los usuarios
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  console.log("first",tipoModulo)
  return (
    <Grid container spacing={3} >
    <Grid item xs={12}>
      {usuarios ? (
        <TablaReact titulo="Modulos" Ncolum={20} columns={columns} data={usuarios} />
      ) : (
        ''
      )}
    </Grid>
    <Grid item xs={12} display={'grid'} gridTemplateColumns={'repeat(4,1fr)'}>
      <Button color="primary" onClick={handleOpen}>Crear Usuario</Button>
      <Button color="secondary">Editar Usuario</Button>
      <Button color="inherit">Desactivados</Button>
      <Button color="inherit">Agregar Modulo</Button>
    </Grid>

    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2" className='mb-2'>
      Crear Modulos
    </Typography>
    <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField id="nombre-basic" label="nombre" variant="outlined" />
          <TextField id="Descripcion-basic" label="Descripcion" variant="outlined" className='mt-1' />
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Tipo"
              onChange={handleChange}
            >
              {
                tipoModulo?tipoModulo.map((item,key) => (
                    <MenuItem key={key} value={item.tipo}>{item.tipo}</MenuItem>
                )):''
              }

            </Select>
          </FormControl>
          <FormControl fullWidth className='mt-1'>
            <Button color={'primary'} >Crear Modulos</Button>
          </FormControl>
          
        </Grid>
    </Grid>
  </Box>
</Modal>
  </Grid>
  )
}

export default Modulos