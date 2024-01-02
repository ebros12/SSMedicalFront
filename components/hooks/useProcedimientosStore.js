import { useSelector, useDispatch } from "react-redux";
import procedimientosAPI from "../api/procedimientosAPI";


export const useProcedimientosStore = () => {

    const dispatch = useDispatch();

    const startObtenerModulos = async (tipo) => {

        try {

            const { data } = await procedimientosAPI.post('/obtenerModulos',{tipo});
            return data

        } catch (error) {
            console.log(error)
        }
    }

    const startObtenerTodosModulos = async () => {

        try {

            const { data } = await procedimientosAPI.post('/obtenerTodosModulos');
            return data

        } catch (error) {
            console.log(error)
        }
    }

    
    
    const startObtenerTipoModulo = async () => {

        try {

            const { data } = await procedimientosAPI.post('/obtenerTipoModulo');
            return data

        } catch (error) {
            console.log(error)
        }
    }



    const startObtenerDoctor = async () => {

        try {

            const { data } = await procedimientosAPI.post('/obtenerDoctor');
            return data

        } catch (error) {
            console.log(error)
        }
    }

    

    
    const startAgregarDoctor = async (doctor) => {

        try {

            const { data } = await procedimientosAPI.post('/agregarDoctor', {doctor});
            return data

        } catch (error) {
            console.log(error)
        }
    }

    const startEditarDoctor = async (doctor) => {

        try {

            const { data } = await procedimientosAPI.post('/editarDoctor', {doctor});
            return data

        } catch (error) {
            console.log(error)
        }
    }

    
    



    return {
        //Propiedades

        //*Metodos

        startObtenerModulos,
        startObtenerDoctor,
        startObtenerTipoModulo,
        startObtenerTodosModulos,
        startAgregarDoctor,
        startEditarDoctor
    }
}