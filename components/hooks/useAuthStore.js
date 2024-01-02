import {useState, useContext} from  'react'
import { authAPI } from "../api";
import { useSelector,useDispatch } from "react-redux";
import { clearErrorMessage, onLogin, onLogout, onChecking } from '../store/slices/login'
import { AuthContext } from "../../context";
import { useRouter } from "next/router";


export const useAuthStore = () => {

    const { status,user,errorMessage,rol } = useSelector(state => state.login)
    const dispatch = useDispatch();
    const { loginUser}  = useContext(AuthContext);
    const router = useRouter()

    const startLogin = async({email,password}) => {
        const isValidLogin = await loginUser(email, password)
        dispatch(onChecking());
        if (!isValidLogin){
            dispatch(onLogout('Credenciales incorrectas'));

            setTimeout(() =>{
                dispatch(clearErrorMessage());
            },100)
            return;
        }

        //todo bien
        router.replace('/home')
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

    const startObtenerUsuarios = async() => {
        try {

            const { data } = await authAPI.post('/obtenerUsuarios');
            return data

        } catch (error) {
            console.log("error", error)
            dispatch(errorPost('Sin data'));
            setTimeout(() => {
                dispatch(clearErrorMessageDash());
            }, 10)

        }
    }

    const startCrearUsuario = async(usuario, email, rol, pass) => {
        try {

            const  data  = await authAPI.post('/crearUsuario',{usuario, email, rol, pass});
            return data

        } catch (error) {
            console.log("error", error)
            return error
        }
    }

    const startEditarUsuario = async(usuario, email, rol, pass) => {
        try {

            const  data  = await authAPI.post('/modificarUsuario',{usuario, email, rol, pass});
            return data

        } catch (error) {
            console.log("error", error)
            return error
        }
    }


    const startEliminarUsuario = async(email) => {
        try {

            const  data  = await authAPI.post('/eliminarUsuario',{email});
            return data

        } catch (error) {
            console.log("error", error)
            return error
        }
    }


    
    const startObtenerEliminados = async() => {
        try {

            const  {data}  = await authAPI.post('/obtenerEliminados');
            return data

        } catch (error) {
            console.log("error", error)
            return error
        }
    }

    const startAgregarUsuario = async(email) => {
        try {

            const  data  = await authAPI.post('/agregarUsuario',{email});
            return data

        } catch (error) {
            console.log("error", error)
            return error
        }
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
        startLogout,
        startObtenerUsuarios,
        startCrearUsuario,
        startEditarUsuario,
        startEliminarUsuario,
        startObtenerEliminados,
        startAgregarUsuario
    }
}