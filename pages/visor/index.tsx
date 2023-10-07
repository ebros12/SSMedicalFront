import React from 'react'
import { Layout } from '../../components/layout'
import Tablas from '../../components/home/tablas/Tablas'
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../components/hooks';
import { useEffect } from 'react';
import VisorComponent from '../../components/imagenes/VisorComponent';


const Foto = () => {
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
      <br/>
      <VisorComponent />
    </Layout>
    
  )
}

export default Foto