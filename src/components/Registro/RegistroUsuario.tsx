import { useState, type FormEvent, type ChangeEvent } from "react";

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
    <form className="auth-card form-stack" onSubmit={handleSubmit}>
      <span className="eyebrow">NUEVO USUARIO</span>
      <h2>Crear cuenta</h2>
      <p className="auth-subtitle">Regístrate para acceder a SpaceHub.</p>

      <div className="field"><label>Nombre completo</label>
      <input required name="nombreCompleto" value={data.nombreCompleto} onChange={handleChange} /></div>

      <div className="field"><label>Correo institucional</label>
      <input required type="email" name="correoInstitucional" value={data.correoInstitucional} onChange={handleChange} /></div>

      <div className="field"><label>Rol</label>
      <input required name="rol" value={data.rol} onChange={handleChange} /></div>

      <div className="field"><label>Número de ficha</label>
      <input required name="numeroFicha" value={data.numeroFicha} onChange={handleChange} /></div>

      <button className="primary-button" type="submit">Registrarme</button>
    </form>
  );
}