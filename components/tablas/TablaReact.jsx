import React, { useState } from 'react';
import { Col, Form, InputGroup, Row, Table, Container } from 'react-bootstrap';
import { Button } from '@mui/material'
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import { BsChevronBarExpand, BsChevronBarDown, BsChevronBarUp } from "react-icons/bs";

const TablaReact = ({ columns, data, size = 'sm', Ncolum = 10, titulo, onRowClick, selectedUser }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: Ncolum }, // Initial page index and page size
    },
    useGlobalFilter,
    useSortBy, // Habilita la ordenación
    usePagination
  );

  const [selectedRadio, setSelectedRadio] = useState(null);

  const handleRadioChange = (rowId) => {
    setSelectedRadio(rowId);
    // Call the callback function with the selected value
    onRadioChange(rowId);
  };

  return (
    <div className='tablaCaja'>
      <Container fluid>
        <Row>
          <Col xs='auto' style={{ display:'grid' }}>
            <h1 style={{ margin:'2rem 0rem' }} htmlFor='inlineFormInputGroup' visuallyHidden>
              {titulo}
            </h1>
            <InputGroup className='mb-2'>
              <InputGroup.Text>🔎</InputGroup.Text>
              <Form.Control
                id='inlineFormInputGroup'
                placeholder='Buscar...'
                value={globalFilter || ''}
                onChange={(e) => {
                  setGlobalFilter(e.target.value || undefined);
                }}
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Table
            responsive
            hover
            size={size}
            className='compact-table'
            {...getTableProps()}
          >
            <thead className='headerTabla'>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())} // Agrega las propiedades de ordenación
                      style={{ whiteSpace: 'nowrap' }} // Evita que el texto se divida en varias líneas
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ?  <BsChevronBarUp className='ml-05' /> : <BsChevronBarDown className='ml-05' />) :  <BsChevronBarExpand className='ml-05' />}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                  {...row.getRowProps()}
                  onClick={() => onRowClick(row.original)}
                  className={row.original === selectedUser ? 'selected-row' : ''}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ textTransform:'capitalize',textAlign:cell.column.textAlign?cell.column.textAlign:'left' }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Col className='contenedorB'>
            <div className='btnTabla'>
              <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                Anterior
              </Button>
            </div>
            <div>
              <span>
                Página{' '}
                <strong>
                  {pageIndex + 1} de {pageCount}
                </strong>{' '}
              </span>
            </div>
            <div className='btnTabla'>
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                Siguiente
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TablaReact;
