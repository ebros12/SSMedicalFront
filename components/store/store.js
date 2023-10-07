import { configureStore } from '@reduxjs/toolkit'
import { counterSlice} from './slices/counter' 
import { dashboardSlice } from './slices/dashboard'
import { loginSlice} from './slices/login/loginSlice'
import { dataSlice } from './slices/datapicker'

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    login: loginSlice.reducer,
    dashboard: dashboardSlice.reducer,
    datapicker:dataSlice.reducer
  },
})