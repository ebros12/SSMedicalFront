import { useSelector,useDispatch } from "react-redux";


export const useScannStore = () => {

    const dispatch = useDispatch();


    const startSavePhoto = async({data}) => {
      


            try {
    
                const { resp } = await dashboardAPI.post('/guardarData', { data });
    
                return resp
    
            } catch (error) {
    
                dispatch(errorPost('Sin data'));
                setTimeout(() => {
                    dispatch(clearErrorMessageDash());
                }, 10)
    
            }
        
    }

    return {
        //Propiedades

        //*Metodos
        startSavePhoto,
    }
}