export type GrupoMuscular =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Cuádriceps'
  | 'Isquios'
  | 'Glúteos'
  | 'Gemelos'
  | 'Core';


export type Material =
  | 'Barra'
  | 'Mancuernas'
  | 'Máquina'
  | 'Polea'
  | 'Peso corporal'
  | 'Multipower'
  | 'Kettlebell';


export type EjercicioCatalogo = {
  id: string;
  nombre: string;
  grupo: GrupoMuscular;
  material: Material;
};


export const GRUPOS: {
  nombre: GrupoMuscular;
  icono: string;
}[] = [
  { nombre: 'Pecho', icono: '◉' },
  { nombre: 'Espalda', icono: '◆' },
  { nombre: 'Hombros', icono: '▲' },
  { nombre: 'Bíceps', icono: '●' },
  { nombre: 'Tríceps', icono: '●' },
  { nombre: 'Cuádriceps', icono: '▰' },
  { nombre: 'Isquios', icono: '▰' },
  { nombre: 'Glúteos', icono: '⬢' },
  { nombre: 'Gemelos', icono: '▮' },
  { nombre: 'Core', icono: '✦' },
];


export const MATERIALES: (
  | 'Todos'
  | Material
)[] = [
  'Todos',
  'Barra',
  'Mancuernas',
  'Máquina',
  'Polea',
  'Peso corporal',
  'Multipower',
  'Kettlebell',
];


export const CATALOGO_EJERCICIOS:
  EjercicioCatalogo[] = [

  // =========================
  // PECHO
  // =========================

  {
    id: 'pecho-1',
    nombre: 'Press banca con barra',
    grupo: 'Pecho',
    material: 'Barra',
  },

  {
    id: 'pecho-2',
    nombre: 'Press banca con mancuernas',
    grupo: 'Pecho',
    material: 'Mancuernas',
  },

  {
    id: 'pecho-3',
    nombre: 'Press inclinado con barra',
    grupo: 'Pecho',
    material: 'Barra',
  },

  {
    id: 'pecho-4',
    nombre: 'Press inclinado con mancuernas',
    grupo: 'Pecho',
    material: 'Mancuernas',
  },

  {
    id: 'pecho-5',
    nombre: 'Press inclinado en Multipower',
    grupo: 'Pecho',
    material: 'Multipower',
  },

  {
    id: 'pecho-6',
    nombre: 'Press de pecho en máquina',
    grupo: 'Pecho',
    material: 'Máquina',
  },

  {
    id: 'pecho-7',
    nombre: 'Pec Deck',
    grupo: 'Pecho',
    material: 'Máquina',
  },

  {
    id: 'pecho-8',
    nombre: 'Aperturas con mancuernas',
    grupo: 'Pecho',
    material: 'Mancuernas',
  },

  {
    id: 'pecho-9',
    nombre: 'Aperturas en polea',
    grupo: 'Pecho',
    material: 'Polea',
  },

  {
    id: 'pecho-10',
    nombre: 'Cruce de poleas',
    grupo: 'Pecho',
    material: 'Polea',
  },

  {
    id: 'pecho-11',
    nombre: 'Fondos para pecho',
    grupo: 'Pecho',
    material: 'Peso corporal',
  },

  {
    id: 'pecho-12',
    nombre: 'Flexiones',
    grupo: 'Pecho',
    material: 'Peso corporal',
  },


  // =========================
  // ESPALDA
  // =========================

  {
    id: 'espalda-1',
    nombre: 'Dominadas',
    grupo: 'Espalda',
    material: 'Peso corporal',
  },

  {
    id: 'espalda-2',
    nombre: 'Dominadas asistidas',
    grupo: 'Espalda',
    material: 'Máquina',
  },

  {
    id: 'espalda-3',
    nombre: 'Jalón al pecho',
    grupo: 'Espalda',
    material: 'Polea',
  },

  {
    id: 'espalda-4',
    nombre: 'Jalón agarre neutro',
    grupo: 'Espalda',
    material: 'Polea',
  },

  {
    id: 'espalda-5',
    nombre: 'Jalón unilateral',
    grupo: 'Espalda',
    material: 'Polea',
  },

  {
    id: 'espalda-6',
    nombre: 'Remo con barra',
    grupo: 'Espalda',
    material: 'Barra',
  },

  {
    id: 'espalda-7',
    nombre: 'Remo con mancuerna',
    grupo: 'Espalda',
    material: 'Mancuernas',
  },

  {
    id: 'espalda-8',
    nombre: 'Remo sentado en polea',
    grupo: 'Espalda',
    material: 'Polea',
  },

  {
    id: 'espalda-9',
    nombre: 'Remo en máquina',
    grupo: 'Espalda',
    material: 'Máquina',
  },

  {
    id: 'espalda-10',
    nombre: 'Remo pecho apoyado',
    grupo: 'Espalda',
    material: 'Máquina',
  },

  {
    id: 'espalda-11',
    nombre: 'Pullover en polea',
    grupo: 'Espalda',
    material: 'Polea',
  },

  {
    id: 'espalda-12',
    nombre: 'Peso muerto',
    grupo: 'Espalda',
    material: 'Barra',
  },


  // =========================
  // HOMBROS
  // =========================

  {
    id: 'hombro-1',
    nombre: 'Press militar con barra',
    grupo: 'Hombros',
    material: 'Barra',
  },

  {
    id: 'hombro-2',
    nombre: 'Press militar con mancuernas',
    grupo: 'Hombros',
    material: 'Mancuernas',
  },

  {
    id: 'hombro-3',
    nombre: 'Press de hombros en máquina',
    grupo: 'Hombros',
    material: 'Máquina',
  },

  {
    id: 'hombro-4',
    nombre: 'Elevaciones laterales con mancuernas',
    grupo: 'Hombros',
    material: 'Mancuernas',
  },

  {
    id: 'hombro-5',
    nombre: 'Elevaciones laterales en polea',
    grupo: 'Hombros',
    material: 'Polea',
  },

  {
    id: 'hombro-6',
    nombre: 'Elevaciones laterales en máquina',
    grupo: 'Hombros',
    material: 'Máquina',
  },

  {
    id: 'hombro-7',
    nombre: 'Pájaros con mancuernas',
    grupo: 'Hombros',
    material: 'Mancuernas',
  },

  {
    id: 'hombro-8',
    nombre: 'Reverse Pec Deck',
    grupo: 'Hombros',
    material: 'Máquina',
  },

  {
    id: 'hombro-9',
    nombre: 'Face Pull',
    grupo: 'Hombros',
    material: 'Polea',
  },


  // =========================
  // BÍCEPS
  // =========================

  {
    id: 'biceps-1',
    nombre: 'Curl con barra',
    grupo: 'Bíceps',
    material: 'Barra',
  },

  {
    id: 'biceps-2',
    nombre: 'Curl con mancuernas',
    grupo: 'Bíceps',
    material: 'Mancuernas',
  },

  {
    id: 'biceps-3',
    nombre: 'Curl martillo',
    grupo: 'Bíceps',
    material: 'Mancuernas',
  },

  {
    id: 'biceps-4',
    nombre: 'Curl inclinado con mancuernas',
    grupo: 'Bíceps',
    material: 'Mancuernas',
  },

  {
    id: 'biceps-5',
    nombre: 'Curl predicador',
    grupo: 'Bíceps',
    material: 'Máquina',
  },

  {
    id: 'biceps-6',
    nombre: 'Curl en polea',
    grupo: 'Bíceps',
    material: 'Polea',
  },

  {
    id: 'biceps-7',
    nombre: 'Curl Bayesian',
    grupo: 'Bíceps',
    material: 'Polea',
  },

  {
    id: 'biceps-8',
    nombre: 'Curl unilateral en polea',
    grupo: 'Bíceps',
    material: 'Polea',
  },


  // =========================
  // TRÍCEPS
  // =========================

  {
    id: 'triceps-1',
    nombre: 'Extensión de tríceps en polea',
    grupo: 'Tríceps',
    material: 'Polea',
  },

  {
    id: 'triceps-2',
    nombre: 'Extensión con cuerda',
    grupo: 'Tríceps',
    material: 'Polea',
  },

  {
    id: 'triceps-3',
    nombre: 'Extensión unilateral en polea',
    grupo: 'Tríceps',
    material: 'Polea',
  },

  {
    id: 'triceps-4',
    nombre: 'Extensión de tríceps por encima de la cabeza',
    grupo: 'Tríceps',
    material: 'Polea',
  },

  {
    id: 'triceps-5',
    nombre: 'Extensión Katana',
    grupo: 'Tríceps',
    material: 'Polea',
  },

  {
    id: 'triceps-6',
    nombre: 'Press francés con barra',
    grupo: 'Tríceps',
    material: 'Barra',
  },

  {
    id: 'triceps-7',
    nombre: 'Press cerrado',
    grupo: 'Tríceps',
    material: 'Barra',
  },

  {
    id: 'triceps-8',
    nombre: 'Fondos para tríceps',
    grupo: 'Tríceps',
    material: 'Peso corporal',
  },


  // =========================
  // CUÁDRICEPS
  // =========================

  {
    id: 'quad-1',
    nombre: 'Sentadilla con barra',
    grupo: 'Cuádriceps',
    material: 'Barra',
  },

  {
    id: 'quad-2',
    nombre: 'Sentadilla en Multipower',
    grupo: 'Cuádriceps',
    material: 'Multipower',
  },

  {
    id: 'quad-3',
    nombre: 'Hack Squat',
    grupo: 'Cuádriceps',
    material: 'Máquina',
  },

  {
    id: 'quad-4',
    nombre: 'Prensa de piernas',
    grupo: 'Cuádriceps',
    material: 'Máquina',
  },

  {
    id: 'quad-5',
    nombre: 'Extensión de cuádriceps',
    grupo: 'Cuádriceps',
    material: 'Máquina',
  },

  {
    id: 'quad-6',
    nombre: 'Sentadilla búlgara',
    grupo: 'Cuádriceps',
    material: 'Mancuernas',
  },

  {
    id: 'quad-7',
    nombre: 'Zancadas con mancuernas',
    grupo: 'Cuádriceps',
    material: 'Mancuernas',
  },

  {
    id: 'quad-8',
    nombre: 'Goblet Squat',
    grupo: 'Cuádriceps',
    material: 'Kettlebell',
  },


  // =========================
  // ISQUIOS
  // =========================

  {
    id: 'isquios-1',
    nombre: 'Peso muerto rumano con barra',
    grupo: 'Isquios',
    material: 'Barra',
  },

  {
    id: 'isquios-2',
    nombre: 'Peso muerto rumano con mancuernas',
    grupo: 'Isquios',
    material: 'Mancuernas',
  },

  {
    id: 'isquios-3',
    nombre: 'Curl femoral sentado',
    grupo: 'Isquios',
    material: 'Máquina',
  },

  {
    id: 'isquios-4',
    nombre: 'Curl femoral tumbado',
    grupo: 'Isquios',
    material: 'Máquina',
  },

  {
    id: 'isquios-5',
    nombre: 'Curl femoral unilateral',
    grupo: 'Isquios',
    material: 'Máquina',
  },

  {
    id: 'isquios-6',
    nombre: 'Buenos días con barra',
    grupo: 'Isquios',
    material: 'Barra',
  },

  {
    id: 'isquios-7',
    nombre: 'Nordic Curl',
    grupo: 'Isquios',
    material: 'Peso corporal',
  },


  // =========================
  // GLÚTEOS
  // =========================

  {
    id: 'gluteos-1',
    nombre: 'Hip Thrust con barra',
    grupo: 'Glúteos',
    material: 'Barra',
  },

  {
    id: 'gluteos-2',
    nombre: 'Hip Thrust en máquina',
    grupo: 'Glúteos',
    material: 'Máquina',
  },

  {
    id: 'gluteos-3',
    nombre: 'Hip Thrust en Multipower',
    grupo: 'Glúteos',
    material: 'Multipower',
  },

  {
    id: 'gluteos-4',
    nombre: 'Patada de glúteo en polea',
    grupo: 'Glúteos',
    material: 'Polea',
  },

  {
    id: 'gluteos-5',
    nombre: 'Abducción de cadera en máquina',
    grupo: 'Glúteos',
    material: 'Máquina',
  },

  {
    id: 'gluteos-6',
    nombre: 'Step Up con mancuernas',
    grupo: 'Glúteos',
    material: 'Mancuernas',
  },

  {
    id: 'gluteos-7',
    nombre: 'Puente de glúteo',
    grupo: 'Glúteos',
    material: 'Peso corporal',
  },


  // =========================
  // GEMELOS
  // =========================

  {
    id: 'gemelos-1',
    nombre: 'Elevación de gemelos de pie',
    grupo: 'Gemelos',
    material: 'Máquina',
  },

  {
    id: 'gemelos-2',
    nombre: 'Elevación de gemelos sentado',
    grupo: 'Gemelos',
    material: 'Máquina',
  },

  {
    id: 'gemelos-3',
    nombre: 'Gemelos en prensa',
    grupo: 'Gemelos',
    material: 'Máquina',
  },

  {
    id: 'gemelos-4',
    nombre: 'Gemelos en Multipower',
    grupo: 'Gemelos',
    material: 'Multipower',
  },

  {
    id: 'gemelos-5',
    nombre: 'Elevación unilateral de gemelos',
    grupo: 'Gemelos',
    material: 'Peso corporal',
  },


  // =========================
  // CORE
  // =========================

  {
    id: 'core-1',
    nombre: 'Crunch abdominal',
    grupo: 'Core',
    material: 'Peso corporal',
  },

  {
    id: 'core-2',
    nombre: 'Crunch en máquina',
    grupo: 'Core',
    material: 'Máquina',
  },

  {
    id: 'core-3',
    nombre: 'Crunch en polea',
    grupo: 'Core',
    material: 'Polea',
  },

  {
    id: 'core-4',
    nombre: 'Elevación de piernas',
    grupo: 'Core',
    material: 'Peso corporal',
  },

  {
    id: 'core-5',
    nombre: 'Elevación de rodillas colgado',
    grupo: 'Core',
    material: 'Peso corporal',
  },

  {
    id: 'core-6',
    nombre: 'Plancha abdominal',
    grupo: 'Core',
    material: 'Peso corporal',
  },

  {
    id: 'core-7',
    nombre: 'Plancha lateral',
    grupo: 'Core',
    material: 'Peso corporal',
  },

  {
    id: 'core-8',
    nombre: 'Pallof Press',
    grupo: 'Core',
    material: 'Polea',
  },

];