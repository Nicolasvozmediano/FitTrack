import { useState, useEffect } from 'react'
import './App.css'

function App() {
const [pantalla, setPantalla] = useState('inicio')

const [email, setEmail] = useState('')
const [contrasena, setContrasena] = useState('')
const [mensaje, setMensaje] = useState('')

const [usuario, setUsuario] = useState(null)
const [entrenamientos, setEntrenamientos] = useState([])

const iniciarSesion = async (e) => {
e.preventDefault()
setMensaje('')


try {
  const respuesta = await fetch(
    'http://localhost:8080/api/usuarios/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        contrasena: contrasena,
      }),
    }
  )

  if (respuesta.ok) {
    const usuarioEncontrado = await respuesta.json()

    setUsuario(usuarioEncontrado)
    setMensaje(`Bienvenido, ${usuarioEncontrado.nombre}`)

    setPantalla('entrenamientos')
  } else if (respuesta.status === 401) {
    setMensaje('Correo o contraseña incorrectos')
  } else {
    setMensaje('Ha ocurrido un error')
  }
} catch (error) {
  console.error(error)
  setMensaje('No se puede conectar con el servidor')
}


}

useEffect(() => {
if (!usuario) {
return
}


fetch(
  `http://localhost:8080/api/entrenamientos/usuario/${usuario.id}`
)
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error('Error al obtener entrenamientos')
    }

    return respuesta.json()
  })
  .then((datos) => {
    setEntrenamientos(datos)
  })
  .catch((error) => {
    console.error(
      'Error al cargar entrenamientos:',
      error
    )
  })


}, [usuario])

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
            onChange={(e) =>
              setContrasena(e.target.value)
            }
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

if (pantalla === 'entrenamientos') {
return ( <div className="app"> <header className="header"> <h1>FitTrack</h1> <p>
Bienvenido, {usuario?.nombre} </p> </header>


    <main className="main">
      <section className="welcome">
        <h2>Mis entrenamientos</h2>

        {entrenamientos.length === 0 ? (
          <p>
            Todavía no tienes entrenamientos.
          </p>
        ) : (
          <div>
            {entrenamientos.map((entrenamiento) => (
              <div
                key={entrenamiento.id}
                className="entrenamiento"
              >
                <h3>
                  {entrenamiento.nombre}
                </h3>

                <p>
                  Tipo: {entrenamiento.tipo}
                </p>

                <p>
                  Fecha: {entrenamiento.fecha}
                </p>

                <p>
                  Duración: {entrenamiento.duracion} minutos
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          className="secondary"
          onClick={() => {
            setPantalla('inicio')
            setUsuario(null)
            setEntrenamientos([])
            setEmail('')
            setContrasena('')
            setMensaje('')
          }}
        >
          Cerrar sesión
        </button>
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
        Organiza tus entrenamientos, controla tu
        progreso y alcanza tus objetivos.
      </p>

      <div className="buttons">
        <button
          onClick={() => {
            setPantalla('login')
            setMensaje('')
          }}
        >
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
