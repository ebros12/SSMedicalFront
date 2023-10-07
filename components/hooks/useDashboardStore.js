import { dashboardAPI } from "../api";
import { useSelector, useDispatch } from "react-redux";


export const useDashboardStore = () => {

    const dispatch = useDispatch();
    const guardarRevision = async (objeto) => {

        try {
            console.log(objeto)
            const { data } = await dashboardAPI.post('/saveData', { objeto });
            return data

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerData = async () => {

        try {

            const { data } = await dashboardAPI.post('/obtenerData');
            return data

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerPaciente = async () => {

        try {

            const { data } = await dashboardAPI.post('/obtenerPaciente');
            return data

        } catch (error) {
            console.log(error)
        }
    }





    return {
        //Propiedades

        //*Metodos
        guardarRevision,
        obtenerData,
        obtenerPaciente
    }
}