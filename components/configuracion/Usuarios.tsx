import { Checkbox, Grid, Button, IconButton, Box, Modal, TextField, FormControl, InputLabel, MenuItem, Select, Container } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../hooks';
import TablaReact from '../tablas/TablaReact';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import AddCircleIcon from '@mui/icons-material/AddCircle';




interface ApiResponseSuccess {
  success: boolean;
  // Otras propiedades que puedas tener
}

interface ApiResponseError {
  error: {
    message: string;
    // Otras propiedades que puedas tener
  };
  // Otras propiedades que puedas tener
}




interface Usuario {
    usuario: string;
    email: string;
    rol: string;
    // Otros campos y tipos
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const Usuarios = () => {
const { startObtenerUsuarios, startCrearUsuario,
   startEditarUsuario, startEliminarUsuario, 
   startObtenerEliminados, startAgregarUsuario } = useAuthStore();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Especifica el tipo Usuario
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]); // Especifica el tipo Usuario para selectedUsers
  const [eliminados, setEliminados] = useState<Usuario[] | undefined>(undefined);

  
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [rol, setRol] = useState(['Admin','Doctor'])
  const [rolSelect, setRolSelect] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [recargar, setRecargar] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);

  const [usuario2, setUsuario2] = useState('')
  const [rolSelect2, setRolSelect2] = useState('')
  const [email2, setEmail2] = useState('')
  const [pass2, setPass2] = useState('')





  
    useEffect(() => {
      const fetchData = async () => {
        let response = await startObtenerUsuarios();
        let data = response.data;
        setUsuarios(data);


        let response2 = await startObtenerEliminados();
        let data2 = response2.data;
        setEliminados(data2);

      };
  
      fetchData();
    }, [recargar]);
  
    const columns = React.useMemo(
      () => [
        {
          Header: 'Seleccionar',
          accessor: 'checkbox', // Nuevo campo para el checkbox
          textAlign:'center',
          Cell: ({ row }: any) => (
            <Checkbox
              onChange={() => handleCheckboxChange(row.original)}
              checked={selectedUsers.includes(row.original)}
            />
          ),
        },
        {
          Header: 'Usuario',
          accessor: 'usuario',
        },
        {
          Header: 'E-mail',
          accessor: 'email',
        },
        {
          Header: 'Rol',
          accessor: 'rol',
        },
        {
          Header: 'Desactivar',
          accessor: 'estado', // Nuevo campo para el checkbox
          textAlign:'center',
          Cell: ({ row }) => (
            <IconButton aria-label="delete" size="large" onClick={() => EliminarUsuario(row.original)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            
          ),
        },
      ],
      [selectedUsers] // Agregar selectedUsers como dependencia
    );
  

    // Resto del componente
  const handleClose = () => {
    setOpen(false)
  };
  const handleOpen = () => {
    setOpen(true)
  };

  const handleClose2 = () => {
    setOpen2(false)
  };
  const handleOpen2 = () => {
    if (selectedUser) {
      setOpen2(true);
    }
  };

  const handleClose3 = () => {
    setOpen3(false)
  };
  const handleOpen3 = () => {
      setRecargar(!recargar);
      setOpen3(true);

  };




  
  
  const crearUsuario = async () => {
    try {
      if (usuario !== '' && rolSelect !== '' && email !== '' && pass !== '') {
        let responseUsuario: any = await startCrearUsuario(usuario, email, rolSelect, pass);
       
        if (responseUsuario && responseUsuario.response !== undefined && responseUsuario.response.status === 200) {
          Swal.fire("Usuario Creado", "Se creó correctamente", "success");
          setOpen(false);
          setRecargar(!recargar);
        } else {
          Swal.fire("Ocurrió un problema", JSON.parse(responseUsuario.request.response).msg, "info");
        }
      } else {
        Swal.fire("Faltan campos", "Favor complete todos los campos", "warning");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      // Manejar errores si es necesario
    }
  };
  

  const modificarUsuario = async () => {
    try {
      if (usuario2 !== '' && rolSelect2 !== '' && email2 !== '') {
        let responseUsuario: any = await startEditarUsuario(usuario2, email2, rolSelect2, pass2);
        console.log(responseUsuario,"asdasd")
        if (responseUsuario && !responseUsuario.response && responseUsuario.status === 200) {
          Swal.fire("Usuario modificado", "Se modificó correctamente", "success");
          setOpen2(false);
          setRecargar(!recargar);
        } else {
          Swal.fire("Ocurrió un problema", JSON.parse(responseUsuario.request.response).msg, "info");
        }
      } else {
        Swal.fire("Faltan campos", "Favor complete todos los campos", "warning");
      }
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      // Manejar errores si es necesario
    }
  };
  



const EliminarUsuario = async (emailSelect:any) => {
  try {
    await startEliminarUsuario(emailSelect.email);
    setUsuarios((prevUsers) => prevUsers.filter((user) => user.email !== emailSelect.email));
    setRecargar(!recargar);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    // Manejar errores si es necesario
  }
};



const AgregarUsuario = async(emailSelect:any) =>{
  let data = await startAgregarUsuario(emailSelect);
  setRecargar(!recargar);
}

const handleCheckboxChange = (user:any) => {
  if (selectedUsers.includes(user)) {
    setSelectedUsers([]);
    setOpen2(false);  // Cerrar el modal si está abierto
    setSelectedUser(null);  // Reiniciar el usuario seleccionado al deseleccionar
  } else {
    setSelectedUsers([user]);
    setSelectedUser(user);
    setOpen2(true);   // Abrir el modal al seleccionar un checkbox
  }
};

const handleRowClick = (userData:any) => {
  setSelectedUsers([]);
  setSelectedUser(userData);
  setUsuario2(userData.usuario || '');
  setEmail2(userData.email || '');
  setRolSelect2(userData.rol || '');
  setPass2(''); // Asumo que no deseas prellenar el campo de contraseña al abrir el modal
  setOpen2(false);  // Cerrar el modal al hacer clic en una fila
};

useEffect(() => {
  // Verifica si selectedUser existe y actualiza los estados correspondientes
  if (selectedUser) {
    const user = selectedUser as Usuario; // Asegurando que selectedUser tiene el tipo Usuario
    setUsuario2(user.usuario || '');
    setEmail2(user.email || '');
    setRolSelect2(user.rol || '');
    // Asumo que no deseas prellenar el campo de contraseña al abrir el modal
    setPass2('');
  }
}, [selectedUser]);



  
  return (
    <Grid container spacing={3} >
    <Grid item xs={12}>
      {usuarios ? (
        <TablaReact onRowClick={handleRowClick} titulo="usuarios" Ncolum={20} columns={columns} data={usuarios} selectedUser={selectedUser} />
      ) : (
        ''
      )}
    </Grid>
    <Grid item xs={12} display={'grid'} gridTemplateColumns={'repeat(3,1fr)'}>
      <Button color="primary" onClick={handleOpen}>Crear Usuario</Button>
      <Button color="secondary" onClick={handleOpen2}>Editar Usuario</Button>
      <Button color="inherit" onClick={handleOpen3}>Desactivados</Button>
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
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            
            <TextField
                label="Email"
                className="inputs"
                id="emailInputs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            
            </Grid>
            <Grid item xs={6}>

            <FormControl fullWidth className=''>
                <InputLabel className='selects' id="demo-simple-select-label">Rol</InputLabel>
                    <Select
                    className='selects'
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={rolSelect}
                      label="Rol"
                      onChange={(e) => setRolSelect(e.target.value)}
                    >
                      {
                        rol?rol.map((item,key) => (
                            <MenuItem key={key} value={item}>{item}</MenuItem>
                        )):''
                      }

                    </Select>
              </FormControl>
              <TextField
                label="Contraseña"
                className="inputs"
                id="passInputs"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
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
            <Button variant="contained" color="primary" onClick={crearUsuario}>
              Crear
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
  id="nombreInputs2"
  value={usuario2 || ''}
  onChange={(e) => setUsuario2(e.target.value)}
/>
<TextField
  label="Email"
  className="inputs"
  id="emailInputs2"
  value={email2 || ''}
  onChange={(e) => setEmail2(e.target.value)}
/>
<FormControl fullWidth className="">
  <InputLabel className="selects" id="demo-simple-select-label">
    Rol
  </InputLabel>
  <Select
    className="selects"
    labelId="demo-simple-select-label"
    id="demo-simple-select2"
    value={rolSelect2}
    label="Rol"
    onChange={(e) => setRolSelect2(e.target.value)}
  >
    {rol
      ? rol.map((item, key) => (
          <MenuItem key={key} value={item}>
            {item}
          </MenuItem>
        ))
      : ''}
  </Select>
</FormControl>
<TextField
  label="Contraseña"
  className="inputs"
  id="passInputs2"
  value={pass2}
  onChange={(e) => setPass2(e.target.value)}
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
            <Button variant="contained" color="warning" onClick={modificarUsuario} >
              Editar
            </Button>
          </Box>
        </Box>
    </Modal>


    <Modal
        open={open3}
        onClose={handleClose3}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box textAlign={'center'} sx={{ ...style, width: '90%', maxWidth: 600 }}>
          <h3>Lista de Eliminados</h3>
          <Grid container>
            
          {
  eliminados instanceof Array
    ? eliminados.map((item: Usuario, key: number) => (
        <Grid key={key} container className='cuadroEliminados'>
          <Grid item xs={6}>
            <p>{item.usuario}</p>
          </Grid>
          <Grid item xs={6} alignSelf={'center'} textAlign={'center'}>
            <Button onClick={() => AgregarUsuario(item.email)}>
              <AddCircleIcon />
            </Button>
          </Grid>
        </Grid>
      ))
    : ''
}




            

            

          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleClose3}
              variant="contained"
              color="secondary"
              style={{ marginRight: '10px' }}
            >
              cerrar
            </Button>
          </Box>
        </Box>
    </Modal>
  </Grid>
  )
}

export default Usuarios