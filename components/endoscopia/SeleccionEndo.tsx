import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import React from 'react'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';

interface SeleccionEndoProps {
  seleccion: string;
  onSeleccionChange: (nuevaSeleccion: string) => void;
}


const SeleccionEndo: React.FC<SeleccionEndoProps> = ({ seleccion, onSeleccionChange }) => {
  const handleClick = (nuevaSeleccion: string) => {
    // Llama a la función de manejo de cambios con la nueva selección
    onSeleccionChange(nuevaSeleccion);
  };

  return (
    <>
              
          <Grid container spacing={2}> 
          <Grid item xs={12}>
          <Typography variant='h1'>Seleccione</Typography>
          <Typography variant='h6'>El orden no influye el termino del documento</Typography>
          </Grid>

                <Grid item xs={12} md={3} >
                <Button className='btnSelect' onClick={() => handleClick('Imagenes')}>
                    <Card variant="outlined" className='btnSelect'>
                        <CardContent className='text-center'>
                        <AddAPhotoIcon  fontSize="large" className='iconoBtn'/>
                        <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Imagenes</Typography>
                        </CardContent>
                    </Card>
                    </Button>

                </Grid>
                <Grid item xs={12} md={3} >
                <Button className='btnSelect' onClick={() => handleClick('Informacion')}>
                    <Card variant="outlined" className='btnSelect'>
                        <CardContent className='text-center'>
                        <ArticleIcon  fontSize="large" className='iconoBtn'/>
                        <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Información</Typography>
                        </CardContent>
                    </Card>
                    </Button>

                </Grid>
                <Grid item xs={12} md={3} >
                <Button className='btnSelect' onClick={() => handleClick('Visor')}>
                    <Card variant="outlined" className='btnSelect'>
                        <CardContent className='text-center'>
                        <ContentPasteSearchIcon  fontSize="large" className='iconoBtn'/>
                        <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Visor</Typography>
                        </CardContent>
                    </Card>
                    </Button>

                </Grid>
          </Grid>
    </>
  )
}

export default SeleccionEndo