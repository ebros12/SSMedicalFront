import { createContext } from 'react'


interface ContextProps{
     isLoggedIn: boolean;
     user?: {
        uid:string,
        name:string,
        rol:string
     };

     loginUser: (email: string, password: string) => Promise<boolean>
     
}

export const AuthContext = createContext({} as ContextProps);