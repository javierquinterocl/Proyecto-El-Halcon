import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Limpia advertencias previas
    setWarning("");

    if (!username || !password) {
      setWarning("Por favor, ingresa usuario y contraseña");
      return;
    }

    // Aquí iría la lógica de autenticación
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <img
            src="/public/images/logoHalcon.png"
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {warning && (
          <div className="mb-4 text-red-500 text-sm text-center">{warning}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-3 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-3 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <div className="text-right mb-4 flex justify-center">
          <a
            href="#"
            className="text-orange-500 hover:underline text-sm font-medium"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Iniciar sesion
        </button>
        <a
          href="/register"
          className="text-orange-500 hover:underline text-sm font-medium"
        >
          ¿No tienes cuenta? Regístrate
        </a>
      </form>
    </div>
  );
}

export default Login;
