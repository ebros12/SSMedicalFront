import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button, Checkbox } from '@mui/material';
import { Layout } from '../../components/layout';
import TablaReact from '../../components/tablas/TablaReact';
import { useAuthStore } from '../../components/hooks';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Importa las escalas necesarias
import Usuarios from '../../components/configuracion/Usuarios';
import Modulos from '../../components/configuracion/Modulos';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const Config = () => {

  const [selectedUsers, setSelectedUsers] = useState([]); // Almacenar los usuarios seleccionados






// Datos de ejemplo para el gráfico
const chartData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'], // Etiquetas del eje X
  datasets: [
    {
      label: 'Procedimientos Mensuales',
      data: [12, 19, 3, 5, 2], // Datos del gráfico
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
      borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
      borderWidth: 1, // Ancho del borde
    },
  ],
};

const chartOptions = {
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};


const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

  return (
    <Layout>
     
      <Grid container padding={'1rem 10rem 0rem 6rem'} margin={'0rem'}>
        <Grid textAlign={'center'} item xs={12}>
            <h1>Panel de Control</h1>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={12} md={6}>
              <Bar data={chartData} options={chartOptions} width={'100%'} style={{ maxHeight:'50vh' }}/>
          </Grid>
          <Grid item xs={12} md={6}>
              <Pie data={data}  style={{ width:'100%', maxHeight:'50vh', textAlign:'center' }} />
          </Grid>
          
          
        </Grid>

        <Grid item xs={12} >
          <Usuarios />
          <Modulos />
        </Grid>



      </Grid>
    </Layout>
  );
};

export default Config;
