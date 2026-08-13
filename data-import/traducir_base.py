import json
from pathlib import Path


# --------------------------------------------------
# RUTAS
# --------------------------------------------------

CARPETA = Path(__file__).resolve().parent

ARCHIVO_ENTRADA = (
    CARPETA / "fittrack-exercises-clean.json"
)

ARCHIVO_SALIDA = (
    CARPETA / "fittrack-exercises-es-base.json"
)


# --------------------------------------------------
# TRADUCCIONES
# --------------------------------------------------

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


# --------------------------------------------------
# FUNCIONES
# --------------------------------------------------

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


def transformar_ejercicio(ejercicio):
    musculos_principales_originales = (
        ejercicio.get(
            "primaryMuscles",
            []
        )
    )

    musculos_secundarios_originales = (
        ejercicio.get(
            "secondaryMuscles",
            []
        )
    )

    musculos_principales = traducir_lista(
        musculos_principales_originales,
        MUSCULOS
    )

    musculos_secundarios = traducir_lista(
        musculos_secundarios_originales,
        MUSCULOS
    )

    musculo_principal = None

    if len(musculos_principales) > 0:
        musculo_principal = (
            musculos_principales[0]
        )

    return {
        "id": ejercicio.get("id"),

        # Lo conservamos en inglés por ahora.
        "nombreOriginal": ejercicio.get(
            "name"
        ),

        # Lo traduciremos en el siguiente paso.
        "nombre": ejercicio.get(
            "name"
        ),

        "grupoFitTrack": ejercicio.get(
            "grupoFitTrack"
        ),

        "equipamiento": traducir_valor(
            ejercicio.get("equipment"),
            EQUIPAMIENTO
        ),

        "musculoPrincipal":
            musculo_principal,

        "musculosPrincipales":
            musculos_principales,

        "musculosSecundarios":
            musculos_secundarios,

        # Conservamos las instrucciones originales
        # hasta que hagamos la traducción completa.
        "instruccionesOriginales":
            ejercicio.get(
                "instructions",
                []
            ),

        "instrucciones":
            ejercicio.get(
                "instructions",
                []
            ),

        "fuerza": traducir_valor(
            ejercicio.get("force"),
            FUERZA
        ),

        "nivel": traducir_valor(
            ejercicio.get("level"),
            NIVELES
        ),

        "mecanica": traducir_valor(
            ejercicio.get("mechanic"),
            MECANICA
        ),

        "categoria": traducir_valor(
            ejercicio.get("category"),
            CATEGORIAS
        ),

        "imagenes": ejercicio.get(
            "images",
            []
        ),
    }


# --------------------------------------------------
# PROGRAMA
# --------------------------------------------------

def main():

    if not ARCHIVO_ENTRADA.exists():
        print("")
        print("ERROR:")
        print(
            "No se encuentra:"
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


    ejercicios_traducidos = [
        transformar_ejercicio(
            ejercicio
        )
        for ejercicio in ejercicios
    ]


    with open(
        ARCHIVO_SALIDA,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            ejercicios_traducidos,
            archivo,
            ensure_ascii=False,
            indent=2
        )


    print("")
    print(
        "--------------------------------"
    )
    print(
        "FITTRACK - CONVERSIÓN COMPLETADA"
    )
    print(
        "--------------------------------"
    )

    print(
        f"Ejercicios procesados: "
        f"{len(ejercicios_traducidos)}"
    )

    print("")
    print(
        "Archivo generado:"
    )

    print(
        ARCHIVO_SALIDA
    )

    print("")

    if ejercicios_traducidos:

        ejemplo = (
            ejercicios_traducidos[0]
        )

        print(
            "Ejemplo:"
        )

        print(
            f"Nombre: "
            f"{ejemplo['nombre']}"
        )

        print(
            f"Grupo: "
            f"{ejemplo['grupoFitTrack']}"
        )

        print(
            f"Equipamiento: "
            f"{ejemplo['equipamiento']}"
        )

        print(
            f"Músculo principal: "
            f"{ejemplo['musculoPrincipal']}"
        )

    print("")


if __name__ == "__main__":
    main()