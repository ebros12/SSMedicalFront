import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const dataSlice = createSlice({
  name: 'datapicker',
  initialState: {
    status: 'checking',
    dataInicio: moment().subtract(1, 'months').format("YYYY/MM/DD"),
    dataFinal: moment().format("YYYY/MM/DD"),
  },
  reducers: {
    onDataPicker: (state, { payload }) => {
      state.dataInicio = payload.fechaFin
      state.dataFinal = payload.fechaInicio
    },
  },
})

// Action creators are generated for each case reducer function
export const { onDataPicker } = dataSlice.actions