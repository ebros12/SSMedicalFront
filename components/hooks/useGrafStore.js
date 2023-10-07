import { dashboardAPI } from "../api";


export const useGrafStore = () => {

    const startVentasAnioVsAnterior = async (fechaDesde, fechaHasta) => {
        try {

            const { data } = await dashboardAPI.post('/fuerza-de-venta-admin/anioVsAnterior');
            return data

        } catch (error) {
            console.log("error", error)
            dispatch(errorPost('Sin data'));
            setTimeout(() => {
                dispatch(clearErrorMessageDash());
            }, 10)

        }

    }

    return {
        //Propiedades
        
        //*Metodos
        startVentasAnioVsAnterior
    }
}