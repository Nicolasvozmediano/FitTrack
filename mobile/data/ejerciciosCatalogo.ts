import type { ImageSourcePropType } from 'react-native';

export type EjercicioCatalogo = {
  id: string;
  nombre: string;
  grupo: string;
  material: string;
  musculoPrincipal: string;
  musculosSecundarios: string[];
  descripcion: string;
  instrucciones: string[];
  erroresComunes: string[];
  imagen?: ImageSourcePropType;
};

export const GRUPOS_MUSCULARES = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Pierna',
  'Glúteos',
  'Core',
];

export const ejerciciosCatalogo: EjercicioCatalogo[] = [
  {
    id: 'pecho-1',
    nombre: 'Press banca',
    grupo: 'Pecho',
    material: 'Barra',

    musculoPrincipal: 'Pectoral mayor',

    musculosSecundarios: [
      'Tríceps',
      'Deltoide anterior',
    ],

    descripcion:
      'Ejercicio básico de empuje para desarrollar fuerza y masa muscular en el pecho.',

    instrucciones: [
      'Túmbate en un banco plano con los pies firmemente apoyados en el suelo.',
      'Agarra la barra con las manos un poco más abiertas que los hombros.',
      'Baja la barra de forma controlada hacia la zona media del pecho.',
      'Empuja la barra hacia arriba hasta extender los brazos manteniendo el control.',
    ],

    erroresComunes: [
      'Rebotar la barra contra el pecho.',
      'Levantar los pies del suelo.',
      'Abrir excesivamente los codos.',
      'Perder el control durante la bajada.',
    ],

    imagen: require(
      '../assets/images/ejercicios/press-banca.png'
    ),
  },

  {
    id: 'pecho-2',
    nombre: 'Press inclinado con mancuernas',
    grupo: 'Pecho',
    material: 'Mancuernas',

    musculoPrincipal: 'Pectoral superior',

    musculosSecundarios: [
      'Tríceps',
      'Deltoide anterior',
    ],

    descripcion:
      'Variante de press enfocada especialmente en la zona superior del pectoral.',

    instrucciones: [
      'Ajusta el banco a una inclinación moderada.',
      'Coloca las mancuernas a ambos lados del pecho.',
      'Empuja las mancuernas hacia arriba manteniendo los hombros estables.',
      'Baja lentamente hasta recuperar la posición inicial.',
    ],

    erroresComunes: [
      'Utilizar demasiada inclinación en el banco.',
      'Bajar las mancuernas demasiado rápido.',
      'Perder estabilidad en los hombros.',
      'Chocar las mancuernas en la parte superior.',
    ],

    imagen: require(
      '../assets/images/ejercicios/press-inclinado-mancuernas.png'
    ),
  },

  {
    id: 'pecho-3',
    nombre: 'Aperturas en máquina',
    grupo: 'Pecho',
    material: 'Máquina',

    musculoPrincipal: 'Pectoral mayor',

    musculosSecundarios: [
      'Deltoide anterior',
    ],

    descripcion:
      'Ejercicio de aislamiento para concentrar el trabajo en el pectoral mediante un recorrido guiado.',

    instrucciones: [
      'Ajusta el asiento para que los brazos queden aproximadamente a la altura del pecho.',
      'Mantén la espalda apoyada y los hombros hacia atrás.',
      'Cierra los brazos de forma controlada hasta contraer el pecho.',
      'Regresa lentamente hasta sentir un estiramiento cómodo.',
    ],

    erroresComunes: [
      'Utilizar demasiado peso.',
      'Separar la espalda del respaldo.',
      'Mover los hombros hacia delante.',
      'Realizar la fase de vuelta demasiado rápido.',
    ],

    imagen: require(
      '../assets/images/ejercicios/aperturas-maquina.png'
    ),
  },

  {
    id: 'espalda-1',
    nombre: 'Jalón al pecho',
    grupo: 'Espalda',
    material: 'Polea',

    musculoPrincipal: 'Dorsal ancho',

    musculosSecundarios: [
      'Bíceps',
      'Romboides',
    ],

    descripcion:
      'Ejercicio de tirón vertical para desarrollar especialmente la amplitud de la espalda.',

    instrucciones: [
      'Siéntate y fija correctamente las piernas.',
      'Sujeta la barra con un agarre cómodo.',
      'Lleva la barra hacia la parte superior del pecho.',
      'Vuelve lentamente hasta extender los brazos.',
    ],

    erroresComunes: [
      'Balancear demasiado el torso.',
      'Llevar la barra detrás de la cabeza.',
      'No controlar la subida.',
    ],
  },

  {
    id: 'espalda-2',
    nombre: 'Remo con barra',
    grupo: 'Espalda',
    material: 'Barra',

    musculoPrincipal: 'Dorsal ancho',

    musculosSecundarios: [
      'Romboides',
      'Bíceps',
      'Lumbar',
    ],

    descripcion:
      'Ejercicio compuesto para desarrollar grosor y fuerza en la espalda.',

    instrucciones: [
      'Inclina el torso hacia delante manteniendo la espalda estable.',
      'Sujeta la barra aproximadamente al ancho de los hombros.',
      'Lleva la barra hacia el abdomen.',
      'Baja de forma controlada hasta extender los brazos.',
    ],

    erroresComunes: [
      'Redondear excesivamente la espalda.',
      'Utilizar demasiado impulso.',
      'Levantar demasiado el torso.',
    ],
  },

  {
    id: 'espalda-3',
    nombre: 'Remo en polea baja',
    grupo: 'Espalda',
    material: 'Polea',

    musculoPrincipal: 'Romboides',

    musculosSecundarios: [
      'Dorsal ancho',
      'Bíceps',
    ],

    descripcion:
      'Ejercicio de tirón horizontal que permite trabajar la espalda con un movimiento muy controlado.',

    instrucciones: [
      'Siéntate con el torso estable.',
      'Tira del agarre hacia el abdomen.',
      'Contrae la espalda al final del recorrido.',
      'Regresa lentamente a la posición inicial.',
    ],

    erroresComunes: [
      'Balancear demasiado el torso.',
      'Encoger los hombros.',
      'Perder el control durante la vuelta.',
    ],
  },

  {
    id: 'hombros-1',
    nombre: 'Press militar con mancuernas',
    grupo: 'Hombros',
    material: 'Mancuernas',

    musculoPrincipal: 'Deltoide anterior',

    musculosSecundarios: [
      'Tríceps',
      'Deltoide medio',
    ],

    descripcion:
      'Ejercicio de empuje vertical para desarrollar fuerza y masa muscular en los hombros.',

    instrucciones: [
      'Coloca las mancuernas aproximadamente a la altura de los hombros.',
      'Mantén el torso estable.',
      'Empuja las mancuernas hacia arriba.',
      'Baja de manera controlada.',
    ],

    erroresComunes: [
      'Arquear excesivamente la espalda.',
      'Utilizar demasiado peso.',
      'Bajar las mancuernas sin control.',
    ],
  },

  {
    id: 'hombros-2',
    nombre: 'Elevaciones laterales',
    grupo: 'Hombros',
    material: 'Mancuernas',

    musculoPrincipal: 'Deltoide medio',

    musculosSecundarios: [
      'Trapecio superior',
    ],

    descripcion:
      'Ejercicio de aislamiento dirigido principalmente al deltoide medio.',

    instrucciones: [
      'Sujeta una mancuerna en cada mano.',
      'Mantén una ligera flexión de los codos.',
      'Eleva los brazos lateralmente.',
      'Baja lentamente manteniendo tensión.',
    ],

    erroresComunes: [
      'Balancear el cuerpo.',
      'Utilizar demasiado peso.',
      'Encoger excesivamente los hombros.',
    ],
  },

  {
    id: 'biceps-1',
    nombre: 'Curl con barra',
    grupo: 'Bíceps',
    material: 'Barra',

    musculoPrincipal: 'Bíceps braquial',

    musculosSecundarios: [
      'Braquial anterior',
      'Antebrazo',
    ],

    descripcion:
      'Ejercicio clásico para desarrollar fuerza y masa muscular en los bíceps.',

    instrucciones: [
      'Sujeta la barra con las palmas orientadas hacia delante.',
      'Mantén los codos cerca del torso.',
      'Flexiona los brazos elevando la barra.',
      'Baja lentamente hasta la posición inicial.',
    ],

    erroresComunes: [
      'Balancear el cuerpo.',
      'Mover demasiado los codos.',
      'Realizar la bajada demasiado rápido.',
    ],
  },

  {
    id: 'triceps-1',
    nombre: 'Extensión de tríceps en polea',
    grupo: 'Tríceps',
    material: 'Polea',

    musculoPrincipal: 'Tríceps',

    musculosSecundarios: [
      'Antebrazo',
    ],

    descripcion:
      'Ejercicio de aislamiento para trabajar el tríceps mediante una polea.',

    instrucciones: [
      'Colócate frente a la polea.',
      'Mantén los codos cerca del cuerpo.',
      'Extiende los brazos hacia abajo.',
      'Regresa lentamente sin desplazar los codos.',
    ],

    erroresComunes: [
      'Separar demasiado los codos.',
      'Utilizar impulso.',
      'Mover excesivamente los hombros.',
    ],
  },

  {
    id: 'pierna-1',
    nombre: 'Sentadilla en multipower',
    grupo: 'Pierna',
    material: 'Máquina',

    musculoPrincipal: 'Cuádriceps',

    musculosSecundarios: [
      'Glúteos',
      'Isquiotibiales',
    ],

    descripcion:
      'Ejercicio de pierna realizado de forma guiada mediante una máquina Multipower.',

    instrucciones: [
      'Coloca la barra sobre la parte superior de la espalda.',
      'Sitúa los pies en una posición estable.',
      'Flexiona las rodillas y la cadera para descender.',
      'Empuja el suelo para volver a subir.',
    ],

    erroresComunes: [
      'Levantar los talones.',
      'Dejar caer las rodillas hacia dentro.',
      'Descender sin control.',
    ],
  },

  {
    id: 'pierna-2',
    nombre: 'Prensa de piernas',
    grupo: 'Pierna',
    material: 'Máquina',

    musculoPrincipal: 'Cuádriceps',

    musculosSecundarios: [
      'Glúteos',
      'Isquiotibiales',
    ],

    descripcion:
      'Ejercicio guiado para entrenar las piernas con una gran capacidad de carga.',

    instrucciones: [
      'Coloca los pies sobre la plataforma.',
      'Desbloquea la máquina.',
      'Desciende lentamente flexionando las rodillas.',
      'Empuja la plataforma hasta volver a la posición inicial.',
    ],

    erroresComunes: [
      'Despegar la cadera del respaldo.',
      'Bloquear bruscamente las rodillas.',
      'Perder el control de la bajada.',
    ],
  },

  {
    id: 'gluteos-1',
    nombre: 'Hip thrust',
    grupo: 'Glúteos',
    material: 'Barra',

    musculoPrincipal: 'Glúteo mayor',

    musculosSecundarios: [
      'Isquiotibiales',
      'Core',
    ],

    descripcion:
      'Ejercicio de extensión de cadera dirigido especialmente al desarrollo de los glúteos.',

    instrucciones: [
      'Apoya la zona superior de la espalda sobre un banco.',
      'Coloca la barra sobre la zona de la cadera.',
      'Eleva la cadera contrayendo los glúteos.',
      'Baja lentamente manteniendo el control.',
    ],

    erroresComunes: [
      'Hiperextender la zona lumbar.',
      'Colocar los pies demasiado lejos o demasiado cerca.',
      'Perder tensión durante la bajada.',
    ],
  },

  {
    id: 'core-1',
    nombre: 'Crunch en máquina',
    grupo: 'Core',
    material: 'Máquina',

    musculoPrincipal: 'Recto abdominal',

    musculosSecundarios: [
      'Oblicuos',
    ],

    descripcion:
      'Ejercicio guiado para entrenar la musculatura abdominal.',

    instrucciones: [
      'Ajusta correctamente el asiento.',
      'Selecciona una resistencia adecuada.',
      'Flexiona el tronco contrayendo el abdomen.',
      'Regresa lentamente a la posición inicial.',
    ],

    erroresComunes: [
      'Tirar excesivamente con los brazos.',
      'Realizar el movimiento demasiado rápido.',
      'No controlar la vuelta.',
    ],
  },
];