import { GetServerSideProps } from 'next'
import React from 'react'
import { Layout } from '../../components/layout'
import Tablas from '../../components/home/tablas/Tablas'
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../components/hooks';
import { useEffect } from 'react';
import { Button, Card, CardContent, Grid } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { useRouter } from 'next/router';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const home = () => {
    //manejar variables de entorno
    const { status, checkAuthToken, rol, user } = useAuthStore();
    const router = useRouter()
  useEffect(() => {
    checkAuthToken()
  }, [])
  if(status === 'checking'){
    return(
      <h1>Cargando...</h1>
    )
  }else if(status === 'not-authenticated' ){
    router.replace('/')
    return false
  }
  

  console.log(user)
  return (
    <Layout>
      <Grid container spacing={4}> 
          <Grid item xs={12} md={12} >
              <Card>
                <CardContent >
                  <Typography variant='h1'>Bienvenido {user.name}</Typography>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={12} md={3} >
          <a href='/pacientes' className='textBtn'>
              <Card variant="outlined">
                <CardContent className='text-center'>
                  <PersonOutlineOutlinedIcon  fontSize="large" className='iconoBtn'/>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Pacientes</Typography>
                </CardContent>
              </Card>
            </a>

          </Grid>

          <Grid item xs={12} md={3} >
          <a href='/doctores' className='textBtn'>
              <Card variant="outlined">
                <CardContent className='text-center'>
                  <LocalHospitalIcon  fontSize="large" className='iconoBtn'/>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Doctores</Typography>
                </CardContent>
              </Card>
            </a>

          </Grid>

          <Grid item xs={12} md={3} >
            <a href='/procedimiento' className='textBtn'>
            <Card variant="outlined">
              <CardContent className='text-center'>
                <ChecklistRtlIcon  fontSize="large" className='iconoBtn'/>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Procedimiento </Typography>
              </CardContent>
            </Card>
            </a>

          </Grid>

          <Grid item xs={12} md={3} >
          <a href='/historial' className='textBtn'>
            <Card variant="outlined">
              <CardContent className='text-center'>
                <AccessTimeOutlinedIcon  fontSize="large" className='iconoBtn'/>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Historial </Typography>
              </CardContent>
            </Card>
            </a>
          </Grid>

          <Grid item xs={12} md={3}>
          <a href='/configuracion' className='textBtn'>
            <Card variant="outlined">
              <CardContent className='text-center'>
                <SettingsSuggestOutlinedIcon  fontSize="large" className='iconoBtn'/>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Configuración</Typography>
              </CardContent>
            </Card>
            </a>
          </Grid>

      </Grid>

    </Layout>
    
  )
}

/*  // You should use getServerSideProps when:
 // - Only if you need to pre-render a page whose data must be fetched at request time

 
 export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const {token = ''} = req.cookies;
  let userId = '';
  let isValidToken = false;
  try{ 
    userId = await jwt

  }catch(error){

  }
 
  return {
    props: {
      
    }
  }
 } */
export default home