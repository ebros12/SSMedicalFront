import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authAPI } from "../api";
import { useAuthStore } from '../hooks';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    startLogin,
    errorMessage
} = useAuthStore();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, complete todos los campos");
      setIsLoading(false);
      return;
    }

    try {
        
        await startLogin({email,password})
      
    } catch (error) {
      console.error(error);
      setError("Correo electrónico o contraseña incorrectos");
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    if (e.target.id === "email") setEmail(e.target.value);
    if (e.target.id === "password") setPassword(e.target.value);
  };
  
  useEffect(() => {
    console.log("asdasdasd",errorMessage)
    if(errorMessage !== undefined && errorMessage !== 'authenticated'){
        toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
    }
    if(errorMessage === 'authenticated'){
        toast('💯 Bienvenido', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
             router.push("/home");
    }

  }, [errorMessage])
  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
       
        <img src="./img/Logo_fondo_blanco.jpg" width={'100%'}/>
        <h1>Iniciar sesión</h1>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={isLoading} className="buttons">
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </button>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />


      </form>
     
    </div>
  );
};

export default Login;
