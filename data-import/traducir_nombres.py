import json
import time
from pathlib import Path

from deep_translator import GoogleTranslator


# ==================================================
# RUTAS
# ==================================================

CARPETA = Path(__file__).resolve().parent

ARCHIVO_ENTRADA = (
    CARPETA / "fittrack-exercises-clean.json"
)

ARCHIVO_SALIDA = (
    CARPETA / "fittrack-exercises-es.json"
)

ARCHIVO_CACHE = (
    CARPETA / "traducciones_nombres_cache.json"
)


# ==================================================
# TRADUCCIONES FIJAS
# ==================================================

EQUIPAMIENTO = {
    "barbell": "Barra",
    "dumbbell": "Mancuernas",
    "cable": "Polea",
    "machine": "Máquina",
    "body only": "Peso corporal",
    "kettlebells": "Kettlebell",
    "bands": "Bandas elásticas",
    "e-z curl bar": "Barra EZ",
}


MUSCULOS = {
    "abdominals": "Abdominales",
    "abductors": "Abductores",
    "adductors": "Aductores",
    "biceps": "Bíceps",
    "calves": "Gemelos",
    "chest": "Pectoral",
    "forearms": "Antebrazos",
    "glutes": "Glúteos",
    "hamstrings": "Isquiotibiales",
    "lats": "Dorsales",
    "lower back": "Zona lumbar",
    "middle back": "Espalda media",
    "quadriceps": "Cuádriceps",
    "shoulders": "Hombros",
    "traps": "Trapecios",
    "triceps": "Tríceps",
}


FUERZA = {
    "push": "Empuje",
    "pull": "Tirón",
    "static": "Estático",
}


NIVELES = {
    "beginner": "Principiante",
    "intermediate": "Intermedio",
    "expert": "Avanzado",
}


MECANICA = {
    "compound": "Compuesto",
    "isolation": "Aislamiento",
}


CATEGORIAS = {
    "strength": "Fuerza",
    "powerlifting": "Powerlifting",
}


# ==================================================
# ALGUNOS NOMBRES QUE QUEREMOS CONTROLAR
# MANUALMENTE
# ==================================================

NOMBRES_MANUALES = {
    "Ab Crunch Machine":
        "Crunch abdominal en máquina",

    "Alternate Hammer Curl":
        "Curl martillo alterno",

    "Arnold Dumbbell Press":
        "Press Arnold con mancuernas",

    "Barbell Bench Press - Medium Grip":
        "Press de banca con barra - agarre medio",

    "Barbell Curl":
        "Curl de bíceps con barra",

    "Barbell Deadlift":
        "Peso muerto con barra",

    "Barbell Full Squat":
        "Sentadilla con barra",

    "Barbell Glute Bridge":
        "Puente de glúteos con barra",

    "Barbell Hip Thrust":
        "Hip thrust con barra",

    "Barbell Shoulder Press":
        "Press de hombros con barra",

    "Barbell Shrug":
        "Encogimientos con barra",
}


# ==================================================
# FUNCIONES
# ==================================================

def traducir_valor(valor, diccionario):

    if valor is None:
        return None

    return diccionario.get(
        valor,
        valor
    )


def traducir_lista(lista, diccionario):

    if not lista:
        return []

    return [
        diccionario.get(
            elemento,
            elemento
        )
        for elemento in lista
    ]


def cargar_cache():

    if not ARCHIVO_CACHE.exists():
        return {}

    try:
        with open(
            ARCHIVO_CACHE,
            "r",
            encoding="utf-8"
        ) as archivo:

            return json.load(archivo)

    except Exception:
        return {}


def guardar_cache(cache):

    with open(
        ARCHIVO_CACHE,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            cache,
            archivo,
            ensure_ascii=False,
            indent=2
        )


def traducir_nombre(
    nombre,
    traductor,
    cache
):

    if not nombre:
        return nombre

    # ------------------------------
    # Traducción manual prioritaria
    # ------------------------------

    if nombre in NOMBRES_MANUALES:

        traduccion = (
            NOMBRES_MANUALES[nombre]
        )

        cache[nombre] = traduccion

        return traduccion

    # ------------------------------
    # Ya traducido anteriormente
    # ------------------------------

    if nombre in cache:
        return cache[nombre]

    # ------------------------------
    # Traductor automático
    # ------------------------------

    for intento in range(5):

        try:

            traduccion = traductor.translate(
                nombre
            )

            if traduccion:

                traduccion = (
                    traduccion.strip()
                )

                cache[nombre] = traduccion

                return traduccion

        except Exception as error:

            espera = (
                (intento + 1) * 2
            )

            print(
                f"Error traduciendo "
                f"'{nombre}'"
            )

            print(
                f"Reintentando en "
                f"{espera} segundos..."
            )

            time.sleep(espera)

    print(
        f"AVISO: no se pudo traducir "
        f"'{nombre}'"
    )

    return nombre


# ==================================================
# PROGRAMA PRINCIPAL
# ==================================================

def main():

    if not ARCHIVO_ENTRADA.exists():

        print("")
        print(
            "ERROR: no se encuentra:"
        )
        print(
            ARCHIVO_ENTRADA
        )
        print("")

        return


    with open(
        ARCHIVO_ENTRADA,
        "r",
        encoding="utf-8-sig"
    ) as archivo:

        ejercicios = json.load(
            archivo
        )


    print("")
    print(
        "================================"
    )
    print(
        "FITTRACK - TRADUCCIÓN DE NOMBRES"
    )
    print(
        "================================"
    )
    print("")

    print(
        f"Ejercicios encontrados: "
        f"{len(ejercicios)}"
    )

    print("")


    cache = cargar_cache()

    traductor = GoogleTranslator(
        source="en",
        target="es"
    )


    resultado = []


    for indice, ejercicio in enumerate(
        ejercicios,
        start=1
    ):

        nombre_original = ejercicio.get(
            "name"
        )

        print(
            f"[{indice}/{len(ejercicios)}] "
            f"{nombre_original}"
        )


        nombre_espanol = traducir_nombre(
            nombre_original,
            traductor,
            cache
        )


        principales_originales = (
            ejercicio.get(
                "primaryMuscles",
                []
            )
        )

        secundarios_originales = (
            ejercicio.get(
                "secondaryMuscles",
                []
            )
        )


        principales_es = traducir_lista(
            principales_originales,
            MUSCULOS
        )

        secundarios_es = traducir_lista(
            secundarios_originales,
            MUSCULOS
        )


        musculo_principal = None

        if principales_es:
            musculo_principal = (
                principales_es[0]
            )


        ejercicio_es = {

            "id":
                ejercicio.get("id"),

            "nombreOriginal":
                nombre_original,

            "nombre":
                nombre_espanol,

            "grupoFitTrack":
                ejercicio.get(
                    "grupoFitTrack"
                ),

            "equipamiento":
                traducir_valor(
                    ejercicio.get(
                        "equipment"
                    ),
                    EQUIPAMIENTO
                ),

            "musculoPrincipal":
                musculo_principal,

            "musculosPrincipales":
                principales_es,

            "musculosSecundarios":
                secundarios_es,

            "instruccionesOriginales":
                ejercicio.get(
                    "instructions",
                    []
                ),

            # Todavía en inglés.
            # Las traduciremos después.
            "instrucciones":
                ejercicio.get(
                    "instructions",
                    []
                ),

            "fuerza":
                traducir_valor(
                    ejercicio.get(
                        "force"
                    ),
                    FUERZA
                ),

            "nivel":
                traducir_valor(
                    ejercicio.get(
                        "level"
                    ),
                    NIVELES
                ),

            "mecanica":
                traducir_valor(
                    ejercicio.get(
                        "mechanic"
                    ),
                    MECANICA
                ),

            "categoria":
                traducir_valor(
                    ejercicio.get(
                        "category"
                    ),
                    CATEGORIAS
                ),

            "imagenes":
                ejercicio.get(
                    "images",
                    []
                ),
        }


        resultado.append(
            ejercicio_es
        )


        # Guardamos el progreso regularmente.
        if indice % 20 == 0:

            guardar_cache(
                cache
            )

            print(
                "   ✓ progreso guardado"
            )


        # Pequeña pausa para evitar
        # demasiadas peticiones seguidas.
        time.sleep(0.25)


    guardar_cache(
        cache
    )


    with open(
        ARCHIVO_SALIDA,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            resultado,
            archivo,
            ensure_ascii=False,
            indent=2
        )


    print("")
    print(
        "================================"
    )
    print(
        "TRADUCCIÓN TERMINADA"
    )
    print(
        "================================"
    )

    print(
        f"Ejercicios procesados: "
        f"{len(resultado)}"
    )

    print("")
    print(
        "Archivo generado:"
    )

    print(
        ARCHIVO_SALIDA
    )

    print("")


if __name__ == "__main__":
    main()