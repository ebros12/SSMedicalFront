import React from 'react'
import { Layout } from '../../components/layout'
import Tablas from '../../components/home/tablas/Tablas'
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../components/hooks';
import { useEffect } from 'react';
import CameraComponent from '../../components/imagenes/CameraComponent';
import Seleccion from '../../components/procedimiento/Seleccion';



const procedimiento = () => {
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

  return (
    <Layout>
{/*       <br/>
      <CameraComponent /> */}
      <Seleccion />
    </Layout>
    
  )
}

export default procedimiento