import { ReactNode, useReducer, useEffect } from 'react';
import { AuthContext, authReducer } from './';
import { authAPI } from '../../components/api';
import Cookies from 'js-cookie';

export interface AuthState {
    isLoggedIn: boolean;
    user?: {
        uid: string;
        name: string;
        rol: string;
    };
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider: React.FC = ({ children }: { children?: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)


    useEffect(() => {

        checkToken();

    }, [])

    const checkToken = async() =>{
        try{
            const {data} = await authAPI.get('/renew');
            const { token, uid, name, rol  } = data;
            Cookies.set('token', token);
            localStorage.setItem('token',token)
            localStorage.setItem('token-init-date',''+new Date().getTime());
            dispatch({type: '[Auth] - Login',payload: {uid, name, rol}});
            return true
        }catch (error){
            Cookies.remove('token');
        }
    }
    

    const loginUser = async(email: string, password: string):Promise<boolean> => {
        try{
            const {data} = await authAPI.post('/login',{email,password});
            const { token, uid, name, rol  } = data;
            Cookies.set('token', token);
            localStorage.setItem('token',token)
            localStorage.setItem('token-init-date',''+new Date().getTime());
            dispatch({type: '[Auth] - Login',payload: {uid, name, rol}});
            return true
        }catch (error){
            return false
        }
    }
    return (
        <AuthContext.Provider value={{
            ...state,


            //metodos
            loginUser,
            
        }}>
            {children}
        </AuthContext.Provider>
    )
}
