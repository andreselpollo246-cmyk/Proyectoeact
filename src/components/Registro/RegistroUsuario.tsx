import { useState, type FormEvent, type ChangeEvent } from "react";
import "./RegistroUsuario.css";

interface RegistroData {
  nombreCompleto: string;
  correoInstitucional: string;
  rol: string;
  numeroFicha: string;
}

export default function RegistroForm() {
  const [data, setData] = useState<RegistroData>({
    nombreCompleto: "",
    correoInstitucional: "",
    rol: "",
    numeroFicha: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrarse</h1>

      <label>Nombre completo</label>
      <input name="nombreCompleto" value={data.nombreCompleto} onChange={handleChange} />

      <label>Correo institucional</label>
      <input name="correoInstitucional" value={data.correoInstitucional} onChange={handleChange} />

      <label>Rol</label>
      <input name="rol" value={data.rol} onChange={handleChange} />

      <label>Número de ficha</label>
      <input name="numeroFicha" value={data.numeroFicha} onChange={handleChange} />

      <button type="submit">Registrarme</button>
    </form>
  );
}