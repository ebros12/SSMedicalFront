import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    status: 'checking',
    data: '',
    errorMessage: undefined,
    dataEmis: ''
  },
  reducers: {
    onCotizacionesDash: (state, { payload }) => {
      state.status = 'load';
      state.data = payload;
      errorMessage: undefined
    },
    onEmisionesDash: (state, { payload }) => {
      state.status = 'load';
      state.dataEmis = payload;
      errorMessage: undefined
    },
    onCheckingDash: (state) => {
      state.status = 'checking';
      state.data = 0;
    },
    errorPost: (state) => {
      state.status = 'checking';
      state.data = 0;
      setTimeout(() => {
        dispatch(clearErrorMessageDash());
      }, 10)

    },
    clearErrorMessageDash: (state) => {
      state.errorMessage = undefined;
    }
  },
})

// Action creators are generated for each case reducer function
export const { onCotizacionesDash, onEmisionesDash,
  onCheckingDash,
  errorPost,
  clearErrorMessageDash, } = dashboardSlice.actions