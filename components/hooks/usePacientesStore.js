import { useSelector, useDispatch } from "react-redux";
import pacienteAPI from "../api/pacienteAPI";


export const usePacientesStore = () => {

    const dispatch = useDispatch();

    const obtenerPaciente = async () => {

        try {

            const { data } = await pacienteAPI.post('/obtenerPaciente');
            return data

        } catch (error) {
            console.log(error)
        }
    }

    const startCrearPaciente = async (paciente) => {

        try {

            const { data } = await pacienteAPI.post('/crearPaciente',{paciente});
            return data

        } catch (error) {
            console.log(error)
        }
    }

    
    const startEditarPaciente = async (paciente) => {

        try {

            const { data } = await pacienteAPI.post('/editarData',{paciente});
            return data

        } catch (error) {
            console.log(error)
        }
    }


    



    return {
        //Propiedades

        //*Metodos

        obtenerPaciente,
        startCrearPaciente,
        startEditarPaciente
    }
}