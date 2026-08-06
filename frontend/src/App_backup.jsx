import { useState } from 'react'
import './App.css'

function App() {
const [pantalla, setPantalla] = useState('inicio')
const [email, setEmail] = useState('')
const [contrasena, setContrasena] = useState('')
const [mensaje, setMensaje] = useState('')
const [usuario, setUsuario] = useState(null)

const [entrenamientos, setEntrenamientos] = useState([
{
id: 1,
nombre: 'Entrenamiento de fuerza',
fecha: '05/08/2026',
duracion: '60 minutos'
},
{
id: 2,
nombre: 'Cardio',
fecha: '04/08/2026',
duracion: '30 minutos'
}
])

const iniciarSesion = async (e) => {
e.preventDefault()
setMensaje('')


try {
  const respuesta = await fetch(
    'http://localhost:8080/api/usuarios/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        contrasena: contrasena
      })
    }
  )

  if (respuesta.ok) {
    const datosUsuario = await respuesta.json()

    setUsuario(datosUsuario)
    setPantalla('principal')
    setEmail('')
    setContrasena('')
  } else if (respuesta.status === 401) {
    setMensaje('Correo o contraseña incorrectos')
  } else {
    setMensaje('Ha ocurrido un error')
  }
} catch (error) {
  setMensaje('No se puede conectar con el servidor')
}


}

const cerrarSesion = () => {
setUsuario(null)
setPantalla('inicio')
setMensaje('')
}

const eliminarEntrenamiento = (id) => {
setEntrenamientos(
entrenamientos.filter(
(entrenamiento) => entrenamiento.id !== id
)
)
}

if (pantalla === 'login') {
return ( <div className="app"> <header className="header"> <h1>FitTrack</h1> <p>Tu entrenamiento, tu progreso.</p> </header>


    <main className="main">
      <section className="welcome">
        <h2>Iniciar sesión</h2>

        <form onSubmit={iniciarSesion}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit">
            Entrar
          </button>
        </form>

        {mensaje && (
          <p className="mensaje">
            {mensaje}
          </p>
        )}

        <button
          className="secondary"
          onClick={() => {
            setPantalla('inicio')
            setMensaje('')
          }}
        >
          Volver
        </button>
      </section>
    </main>
  </div>
)


}

if (pantalla === 'principal' && usuario) {
return ( <div className="app"> <header className="header"> <h1>FitTrack</h1> <p>Tu entrenamiento, tu progreso.</p> </header>


    <main className="main">
      <section className="welcome">
        <h2>Bienvenido, {usuario.nombre}</h2>

        <p>
          Gestiona tus entrenamientos y consulta tu progreso.
        </p>

        <div className="buttons">
          <button
            onClick={() => setPantalla('entrenamientos')}
          >
            Mis entrenamientos
          </button>

          <button>
            Mi progreso
          </button>

          <button
            className="secondary"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  </div>
)


}

if (pantalla === 'entrenamientos' && usuario) {
return ( <div className="app"> <header className="header"> <h1>FitTrack</h1> <p>Mis entrenamientos</p> </header>


    <main className="main">
      <section className="welcome">
        <h2>Mis entrenamientos</h2>

        {entrenamientos.length === 0 ? (
          <p>No tienes entrenamientos registrados.</p>
        ) : (
          <div className="entrenamientos">
            {entrenamientos.map((entrenamiento) => (
              <div
                className="entrenamiento"
                key={entrenamiento.id}
              >
                <h3>{entrenamiento.nombre}</h3>

                <p>
                  Fecha: {entrenamiento.fecha}
                </p>

                <p>
                  Duración: {entrenamiento.duracion}
                </p>

                <button
                  className="secondary"
                  onClick={() =>
                    eliminarEntrenamiento(entrenamiento.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="buttons">
          <button
            onClick={() => setPantalla('principal')}
          >
            Volver al menú
          </button>
        </div>
      </section>
    </main>
  </div>
)


}

return ( <div className="app"> <header className="header"> <h1>FitTrack</h1> <p>Tu entrenamiento, tu progreso.</p> </header>


  <main className="main">
    <section className="welcome">
      <h2>Bienvenido a FitTrack</h2>

      <p>
        Organiza tus entrenamientos, controla tu progreso
        y alcanza tus objetivos.
      </p>

      <div className="buttons">
        <button onClick={() => setPantalla('login')}>
          Iniciar sesión
        </button>

        <button className="secondary">
          Crear cuenta
        </button>
      </div>
    </section>
  </main>
</div>


)
}

export default App
