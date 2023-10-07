import React from 'react'
import SeleccionEndo from '../../components/endoscopia/SeleccionEndo'
import { Typography, Grid } from '@mui/material'
import { Layout } from '../../components/layout'
import { useState, useEffect } from 'react';
import Camera from '../../components/endoscopia/Camera';
import InfoEndo from '../../components/endoscopia/InfoEndo';
import VistaPrevia from '../../components/endoscopia/VistaPrevia';

const index = () => {
    const [seleccion, setSeleccion] = useState(''); // Inicialmente seleccionado en 'Imagenes'

    useEffect(() => {
        // Aquí puedes realizar acciones basadas en la selección actual (seleccion)
        // Por ejemplo, puedes condicionar el contenido del componente Endoscopia
        console.log('Selección actual:', seleccion);
      }, [seleccion]);
  return (
    <Layout>
    <Grid container spacing={1}>
      <Grid item xs={12}>
        
        {
            seleccion===''?
            <SeleccionEndo seleccion={seleccion} onSeleccionChange={setSeleccion}/>
            :
                seleccion==='Imagenes'?
                <Camera seleccion={seleccion} onSeleccionChange={setSeleccion}/>
                :
                seleccion==='Visor'?
                <VistaPrevia seleccion={seleccion} onSeleccionChange={setSeleccion}/>
                :
                
                <InfoEndo seleccion={seleccion} onSeleccionChange={setSeleccion}/>
        }
      </Grid>
    </Grid>
    
  </Layout>
    
  )
}

export default index