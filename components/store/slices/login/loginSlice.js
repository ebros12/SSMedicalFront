import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'login',
  initialState:{
    status:'checking',
    user:{},
    rol:'',
    errorMessage:undefined,
  },
  reducers: {
    onChecking: ( state ) => {
      state.status = 'checking';
      state.user = {};
      state.errorMessage = undefined;
    },
    onLogin: ( state, { payload } ) => {
      state.status = 'authenticated';
      state.user = payload;
      if(payload.rol !== "admin"){
        state.rol = "public"
      }else{
        state.rol = payload.rol;
      }
      
      state.errorMessage = 'authenticated';
    },
    onLogout: (state,{payload}) =>{
      state.status = 'not-authenticated';
      state.user = {};
      console.log("asasasas",payload)
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) =>{
      state.errorMessage = undefined;
    }
  },
})

// Action creators are generated for each case reducer function
export const { onChecking,onLogin,onLogout,clearErrorMessage } = loginSlice.actions