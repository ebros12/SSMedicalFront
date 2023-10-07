import { useSelector,useDispatch } from "react-redux";
import { onDataPicker } from '../store/slices/datapicker'

export const useDateStore = () => {

    const dispatch = useDispatch();
    const { fechaInicio, fechaFin } = useSelector(state => state.datapicker);

    const startDataPicker = async({fechaInicio,fechaFin}) => {
        try{

            dispatch( onDataPicker({fechaInicio, fechaFin}) );

        }catch(error){

            console.log("error date",error)
            
        }
    }

    return {
        //Propiedades
        fechaInicio,
        fechaFin,
        //*Metodos
        startDataPicker,
    }
}