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

    const startObtenerDoctor = async () => {

        try {

            const { data } = await procedimientosAPI.post('/obtenerDoctor');
            return data

        } catch (error) {
            console.log(error)
        }
    }





    return {
        //Propiedades

        //*Metodos

        startObtenerModulos,
        startObtenerDoctor
    }
}