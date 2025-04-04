import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warning, setWarning] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning("");

    if (!email || !nombre || !apellido || !password || !confirmPassword) {
      setWarning("Por favor, completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setWarning("Las contraseñas no coinciden");
      return;
    }

    // Aquí iría la lógica de registro real
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <img
            src="/images/logoHalcon.png"
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
        {warning && (
          <div className="mb-4 text-red-500 text-sm text-center">{warning}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="example@correo.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Tu nombre"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Tu apellido"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Crea una contraseña"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-orange-500"
            placeholder="Repite la contraseña"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Registrarse
        </button>

        <div className="text-center mt-1">
          <a
            href="/"
            className="text-orange-500 hover:underline text-sm font-medium"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
}

export default Register;
