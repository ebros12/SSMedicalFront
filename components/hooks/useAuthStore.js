import { authAPI } from "../api";
import { useSelector,useDispatch } from "react-redux";
import { clearErrorMessage, onLogin, onLogout, onChecking } from '../store/slices/login'

export const useAuthStore = () => {

    const { status,user,errorMessage,rol } = useSelector(state => state.login)
    const dispatch = useDispatch();

    const startLogin = async({email,password}) => {
        dispatch(onChecking());
        try{
            const {data} = await authAPI.post('/login',{email,password});
            localStorage.setItem('token',data.token)
            localStorage.setItem('token-init-date',new Date().getTime());
            const rol = data.rol===""?"public":data.rol;
            dispatch( onLogin({name:data.usuario, uid:data.id, rol}) );
            
              
        }catch(error){
           
            dispatch(onLogout('Credenciales incorrectas'));

            setTimeout(() =>{
                dispatch(clearErrorMessage());
            },100)
            
        }
    }


    const checkAuthToken = async() => {
        const token = localStorage.getItem('token')
        if(!token) return dispatch(onLogout());
        try{
            const { data } = await authAPI.get('/renew')
            localStorage.setItem('token',data.token)
            localStorage.setItem('token-init-date',new Date().getTime());
            const rol = data.rol===""?"public":data.rol;
            dispatch(onLogin({name:data.name, uid:data.uid, rol}));
        }catch(error){
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-dat');
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-dat');
        dispatch(onLogout())
    }





    return {
        //Propiedades
        status,
        user,
        errorMessage,
        rol,
        


        //*Metodos
        startLogin,
        checkAuthToken,
        startLogout
    }
}