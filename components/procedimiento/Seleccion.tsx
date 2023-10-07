import { Grid, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const Seleccion = () => {
  return (
    <>
              
          <Grid container spacing={4}> 
                <Grid item xs={12} md={3} >
                <a href='/endoscopia?TIPO=COLONOSCOPIA' className='textBtn'>
                    <Card variant="outlined">
                        <CardContent className='text-center'>
                        <PrecisionManufacturingIcon  fontSize="large" className='iconoBtn'/>
                        <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Colonoscopía</Typography>
                        </CardContent>
                    </Card>
                    </a>

                </Grid>
                <Grid item xs={12} md={3} >
                <a href='/endoscopia?TIPO=PANENDOSCOPIA' className='textBtn'>
                    <Card variant="outlined">
                        <CardContent className='text-center'>
                        <PrecisionManufacturingIcon  fontSize="large" className='iconoBtn'/>
                        <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Panendoscopía</Typography>
                        </CardContent>
                    </Card>
                    </a>

                </Grid>
          </Grid>
    </>
  )
}

export default Seleccion