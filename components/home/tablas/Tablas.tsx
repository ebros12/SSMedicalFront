import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDashboardStore } from '../../hooks';

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'nombre', label: 'Nombre', minWidth: 170 },
  { id: 'rut', label: 'Rut', minWidth: 100 },
  {
    id: 'edad',
    label: 'Edad',
    minWidth: 170,
    align: 'right',
  },
    {
    id: 'fichaMedica',
    label: 'Ficha Medica',
    minWidth: 170,
    align: 'right',
  },
  

  {
    id: 'referido',
    label: 'Referido',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'motivo',
    label: 'Motivo',
    minWidth: 170,
    align: 'right',
  },
];

interface Data {
  id: number;
  fichaMedica: string;
  rut: string;
  edad: number;
  nombre: string;
  fecha: string;
  actualizacion: string;
  pacienteID: number;
  referido: string;
  motivo: string;
  premedicacion: string;
  tituloDesc: string;
  descripcion: string;
  fotos: string[];
}

const Tablas = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const [dataObtenida, setDataObtenida] = useState<Data[]>([]);
  const { obtenerData } = useDashboardStore();
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let response = await obtenerData();
      let data = response.data;
      setDataObtenida(data);
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (row: Data) => {
    setSelectedRow(row);
    localStorage.setItem('patientData', JSON.stringify(row));
    window.location.href = '/visor';
  };

  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataObtenida.length > 0 ? (
              dataObtenida
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => handleRowClick(row)}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 25, 100]}
        component="div"
        count={dataObtenida.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Tablas;
