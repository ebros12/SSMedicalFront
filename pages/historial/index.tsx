import React from 'react'
import { Layout } from '../../components/layout'
import Tablas from '../../components/home/tablas/Tablas'
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../components/hooks';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import TablaPaciente from '../../components/pacientes/TablaPaciente';


const historial = () => {
    //manejar variables de entorno
    const { status, checkAuthToken, rol, user } = useAuthStore();
  useEffect(() => {
    checkAuthToken()
  }, [])
  if(status === 'checking'){
    return(
      <h1>Cargando...</h1>
    )
  }
  console.log(user)
  return (
    <Layout>
      <Typography variant='h1'>Bienvenido {user.name}</Typography>
      <br/>
      <Grid container spacing={3}>
        <Grid item xs={12}>
            <Tablas />
        </Grid>
      </Grid>
      
    </Layout>
    
  )
}

export default historial