import json
import time
from pathlib import Path

from deep_translator import GoogleTranslator


CARPETA = Path(__file__).resolve().parent

ARCHIVO_ENTRADA = (
    CARPETA / "fittrack-exercises-es-normalizado-v1.json"
)

ARCHIVO_SALIDA = (
    CARPETA / "fittrack-exercises-es-completo.json"
)

ARCHIVO_CACHE = (
    CARPETA / "traducciones_instrucciones_cache.json"
)


def cargar_json(ruta, valor_defecto):

    if not ruta.exists():
        return valor_defecto

    try:
        with open(
            ruta,
            "r",
            encoding="utf-8-sig"
        ) as archivo:

            return json.load(archivo)

    except Exception:
        return valor_defecto


def guardar_json(ruta, datos):

    with open(
        ruta,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            datos,
            archivo,
            ensure_ascii=False,
            indent=2
        )


def limpiar_texto(texto):

    if not texto:
        return texto

    texto = texto.replace(
        "Â¾",
        "¾"
    )

    texto = texto.replace(
        "Â½",
        "½"
    )

    texto = texto.replace(
        "Â¼",
        "¼"
    )

    return texto.strip()


def traducir_individual(
    texto,
    traductor
):

    for intento in range(5):

        try:

            traduccion = traductor.translate(
                texto
            )

            if traduccion:
                return traduccion.strip()

        except Exception as error:

            espera = (
                (intento + 1) * 2
            )

            print(
                f"   Error: {error}"
            )

            print(
                f"   Reintentando en "
                f"{espera} segundos..."
            )

            time.sleep(
                espera
            )

    return texto


def traducir_instrucciones(
    instrucciones,
    traductor,
    cache
):

    if not instrucciones:
        return []

    textos = [
        limpiar_texto(texto)
        for texto in instrucciones
    ]

    pendientes = []

    for texto in textos:

        if texto not in cache:

            pendientes.append(
                texto
            )

    if pendientes:

        try:

            traducciones = (
                traductor.translate_batch(
                    pendientes
                )
            )

            if (
                traducciones
                and
                len(traducciones)
                == len(pendientes)
            ):

                for original, traduccion in zip(
                    pendientes,
                    traducciones
                ):

                    if traduccion:

                        cache[original] = (
                            traduccion.strip()
                        )

                    else:

                        cache[original] = (
                            original
                        )

            else:
                raise Exception(
                    "El lote no devolvió "
                    "todas las traducciones."
                )

        except Exception as error:

            print("")
            print(
                "   El lote ha fallado."
            )

            print(
                "   Traduciendo una por una..."
            )

            print(
                f"   Motivo: {error}"
            )

            for texto in pendientes:

                cache[texto] = (
                    traducir_individual(
                        texto,
                        traductor
                    )
                )

    return [
        cache.get(
            texto,
            texto
        )
        for texto in textos
    ]


def main():

    if not ARCHIVO_ENTRADA.exists():

        print("")
        print(
            "ERROR: no se encuentra:"
        )

        print(
            ARCHIVO_ENTRADA
        )

        return


    ejercicios = cargar_json(
        ARCHIVO_ENTRADA,
        []
    )

    cache = cargar_json(
        ARCHIVO_CACHE,
        {}
    )

    traductor = GoogleTranslator(
        source="en",
        target="es"
    )

    resultado = []

    print("")
    print(
        "===================================="
    )

    print(
        "FITTRACK - TRADUCCIÓN INSTRUCCIONES"
    )

    print(
        "===================================="
    )

    print(
        f"Ejercicios: {len(ejercicios)}"
    )

    print("")


    for indice, ejercicio in enumerate(
        ejercicios,
        start=1
    ):

        nombre = ejercicio.get(
            "nombre",
            ejercicio.get(
                "nombreOriginal",
                ""
            )
        )

        print(
            f"[{indice}/{len(ejercicios)}] "
            f"{nombre}"
        )

        instrucciones_originales = (
            ejercicio.get(
                "instruccionesOriginales",
                []
            )
        )

        instrucciones_es = (
            traducir_instrucciones(
                instrucciones_originales,
                traductor,
                cache
            )
        )

        ejercicio_nuevo = (
            ejercicio.copy()
        )

        ejercicio_nuevo[
            "instrucciones"
        ] = instrucciones_es

        resultado.append(
            ejercicio_nuevo
        )


        if indice % 10 == 0:

            guardar_json(
                ARCHIVO_CACHE,
                cache
            )

            guardar_json(
                ARCHIVO_SALIDA,
                resultado
            )

            print(
                "   ✓ progreso guardado"
            )


        time.sleep(
            0.2
        )


    guardar_json(
        ARCHIVO_CACHE,
        cache
    )

    guardar_json(
        ARCHIVO_SALIDA,
        resultado
    )


    print("")
    print(
        "===================================="
    )

    print(
        "TRADUCCIÓN COMPLETADA"
    )

    print(
        "===================================="
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