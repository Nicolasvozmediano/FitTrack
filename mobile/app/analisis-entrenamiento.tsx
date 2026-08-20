import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';


const API_URL =
  'http://192.168.1.128:8080';


type AnalisisResponse = {
  entrenamientoId: number;
  nombreEntrenamiento: string;
  analisis: string;
};


type SeccionesAnalisis = {
  resumen: string;
  puntosPositivos: string;
  aMejorar: string;
  proximaSesion: string;
};


export default function AnalisisEntrenamiento() {

  const {
    entrenamientoId,
    entrenamientoNombre,
  } =
    useLocalSearchParams<{
      entrenamientoId?: string;
      entrenamientoNombre?: string;
    }>();


  const [
    cargando,
    setCargando,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );


  const [
    analisis,
    setAnalisis,
  ] =
    useState<AnalisisResponse | null>(
      null
    );


  /*
   * OBTENER TOKEN
   */

  const obtenerToken =
    async () => {

      const token =
        await AsyncStorage.getItem(
          'fittrack_token'
        );


      if (!token) {

        router.replace('/');

        return null;
      }


      return token;
    };


  /*
   * ANALIZAR ENTRENAMIENTO
   */

  const analizarEntrenamiento =
    async () => {

      if (!entrenamientoId) {

        setError(
          'No se ha encontrado el entrenamiento.'
        );

        setCargando(false);

        return;
      }


      try {

        setCargando(true);
        setError(null);


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/entrenamientos/${entrenamientoId}/analizar-ia`,
            {
              method: 'POST',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (
          response.status === 401
        ) {

          await AsyncStorage.removeItem(
            'fittrack_token'
          );


          router.replace('/');

          return;
        }


        if (
          response.status === 403
        ) {

          setError(
            'No tienes permiso para analizar este entrenamiento.'
          );

          return;
        }


        if (
          response.status === 404
        ) {

          setError(
            'No se ha encontrado el entrenamiento.'
          );

          return;
        }


        if (
          response.status === 503
        ) {

          setError(
            'El análisis no está disponible en este momento. Inténtalo de nuevo más tarde.'
          );

          return;
        }


        if (!response.ok) {

          setError(
            'No se ha podido analizar el entrenamiento.'
          );

          return;
        }


        const data:
          AnalisisResponse =
            await response.json();


        setAnalisis(
          data
        );


      } catch (error) {

        console.log(
          'Error analizando entrenamiento:',
          error
        );


        setError(
          'No se ha podido conectar con FitTrack.'
        );


      } finally {

        setCargando(false);
      }

    };


  /*
   * ANALIZAR AL ABRIR LA PANTALLA
   */

  useEffect(() => {

    analizarEntrenamiento();

  }, [entrenamientoId]);


  /*
   * SEPARAR RESPUESTA EN SECCIONES
   */

  const separarAnalisis = (
    texto: string
  ): SeccionesAnalisis => {

    const normalizado =
      texto.replace(
        /\r\n/g,
        '\n'
      );


    const extraer = (
      inicio: string,
      fin?: string
    ) => {

      const inicioIndex =
        normalizado.indexOf(inicio);


      if (inicioIndex === -1) {
        return '';
      }


      const desde =
        inicioIndex +
        inicio.length;


      if (!fin) {

        return normalizado
          .slice(desde)
          .trim();
      }


      const finIndex =
        normalizado.indexOf(
          fin,
          desde
        );


      if (finIndex === -1) {

        return normalizado
          .slice(desde)
          .trim();
      }


      return normalizado
        .slice(
          desde,
          finIndex
        )
        .trim();
    };


    return {

      resumen:
        extraer(
          'RESUMEN',
          'PUNTOS POSITIVOS'
        ),

      puntosPositivos:
        extraer(
          'PUNTOS POSITIVOS',
          'A MEJORAR'
        ),

      aMejorar:
        extraer(
          'A MEJORAR',
          'PRÓXIMA SESIÓN'
        ),

      proximaSesion:
        extraer(
          'PRÓXIMA SESIÓN'
        ),

    };
  };


  /*
   * SIN ID
   */

  if (!entrenamientoId) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

        <View
          style={
            styles.center
          }
        >

          <Text
            style={
              styles.errorTitle
            }
          >

            No encontramos el entrenamiento

          </Text>


          <Pressable

            style={({
              pressed
            }) => [

              styles.primaryButton,

              pressed &&
                styles.buttonPressed,

            ]}

            onPress={() =>
              router.back()
            }

          >

            <Text
              style={
                styles.primaryButtonText
              }
            >

              Volver

            </Text>

          </Pressable>

        </View>

      </SafeAreaView>

    );
  }


  const secciones =
    analisis
      ? separarAnalisis(
          analisis.analisis
        )
      : null;


  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <View
        style={
          styles.content
        }
      >


        {/* CABECERA */}

        <View
          style={
            styles.header
          }
        >

          <Pressable

            style={({
              pressed
            }) => [

              styles.backButton,

              pressed &&
                styles.buttonPressed,

            ]}

            onPress={() =>
              router.back()
            }

          >

            <Text
              style={
                styles.backText
              }
            >

              ‹

            </Text>

          </Pressable>


          <View
            style={
              styles.headerInfo
            }
          >

            <Text
              style={
                styles.smallTitle
              }
            >

              FITTRACK AI

            </Text>


            <Text
              style={
                styles.title
              }

              numberOfLines={
                1
              }
            >

              {
                entrenamientoNombre ??
                analisis?.nombreEntrenamiento ??
                'Entrenamiento'
              }

            </Text>

          </View>

        </View>


        {
          cargando
            ? (

              <View
                style={
                  styles.center
                }
              >

                <View
                  style={
                    styles.aiLoadingIcon
                  }
                >

                  <Text
                    style={
                      styles.aiLoadingIconText
                    }
                  >

                    ✦

                  </Text>

                </View>


                <ActivityIndicator
                  size="large"
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.loadingTitle
                  }
                >

                  Analizando tu entrenamiento

                </Text>


                <Text
                  style={
                    styles.loadingText
                  }
                >

                  FitTrack está revisando los datos de tu sesión.

                </Text>

              </View>

            )
            : error
              ? (

                <View
                  style={
                    styles.center
                  }
                >

                  <Text
                    style={
                      styles.errorTitle
                    }
                  >

                    No se pudo generar el análisis

                  </Text>


                  <Text
                    style={
                      styles.errorText
                    }
                  >

                    {error}

                  </Text>


                  <Pressable

                    style={({
                      pressed
                    }) => [

                      styles.primaryButton,

                      pressed &&
                        styles.buttonPressed,

                    ]}

                    onPress={
                      analizarEntrenamiento
                    }

                  >

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >

                      Reintentar

                    </Text>

                  </Pressable>

                </View>

              )
              : analisis &&
                secciones
                ? (

                  <ScrollView

                    showsVerticalScrollIndicator={
                      false
                    }

                    contentContainerStyle={
                      styles.scrollContent
                    }

                  >

                    <View
                      style={
                        styles.hero
                      }
                    >

                      <View
                        style={
                          styles.heroIcon
                        }
                      >

                        <Text
                          style={
                            styles.heroIconText
                          }
                        >

                          ✦

                        </Text>

                      </View>


                      <View
                        style={
                          styles.heroInfo
                        }
                      >

                        <Text
                          style={
                            styles.heroLabel
                          }
                        >

                          ANÁLISIS COMPLETADO

                        </Text>


                        <Text
                          style={
                            styles.heroTitle
                          }
                        >

                          Tu sesión, revisada

                        </Text>

                      </View>

                    </View>


                    <View
                      style={
                        styles.analysisCard
                      }
                    >

                      <Text
                        style={
                          styles.cardLabel
                        }
                      >

                        RESUMEN

                      </Text>


                      <Text
                        style={
                          styles.cardText
                        }
                      >

                        {secciones.resumen}

                      </Text>

                    </View>


                    <View
                      style={
                        styles.analysisCard
                      }
                    >

                      <Text
                        style={
                          styles.cardLabel
                        }
                      >

                        PUNTOS POSITIVOS

                      </Text>


                      <Text
                        style={
                          styles.cardText
                        }
                      >

                        {secciones.puntosPositivos}

                      </Text>

                    </View>


                    <View
                      style={
                        styles.analysisCard
                      }
                    >

                      <Text
                        style={
                          styles.cardLabel
                        }
                      >

                        A MEJORAR

                      </Text>


                      <Text
                        style={
                          styles.cardText
                        }
                      >

                        {secciones.aMejorar}

                      </Text>

                    </View>


                    <View
                      style={
                        styles.nextCard
                      }
                    >

                      <Text
                        style={
                          styles.nextLabel
                        }
                      >

                        PRÓXIMA SESIÓN

                      </Text>


                      <Text
                        style={
                          styles.nextText
                        }
                      >

                        {secciones.proximaSesion}

                      </Text>

                    </View>


                    <Text
                      style={
                        styles.disclaimer
                      }
                    >

                      El análisis de FitTrack es orientativo y se basa en los datos registrados en la aplicación.

                    </Text>

                  </ScrollView>

                )
                : null
        }

      </View>

    </SafeAreaView>

  );

}


const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        '#0B0F14',

    },


    content: {

      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 18,

    },


    header: {

      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 24,

    },


    backButton: {

      width: 44,

      height: 44,

      borderRadius: 14,

      backgroundColor:
        '#151B22',

      borderWidth: 1,

      borderColor:
        '#252D36',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    buttonPressed: {

      opacity: 0.65,

    },


    backText: {

      color:
        '#FFFFFF',

      fontSize: 32,

      lineHeight: 34,

    },


    headerInfo: {

      flex: 1,

      marginLeft: 16,

    },


    smallTitle: {

      color:
        '#717A84',

      fontSize: 10,

      fontWeight:
        '900',

      letterSpacing: 2,

    },


    title: {

      color:
        '#FFFFFF',

      fontSize: 26,

      fontWeight:
        '900',

      marginTop: 3,

    },


    center: {

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingBottom: 70,

    },


    aiLoadingIcon: {

      width: 66,

      height: 66,

      borderRadius: 22,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginBottom: 22,

    },


    aiLoadingIconText: {

      color:
        '#0B0F14',

      fontSize: 30,

      fontWeight:
        '900',

    },


    loadingTitle: {

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

      marginTop: 20,

      textAlign:
        'center',

    },


    loadingText: {

      color:
        '#7E8791',

      fontSize: 16,

      lineHeight: 24,

      marginTop: 8,

      textAlign:
        'center',

      maxWidth: 290,

    },


    errorTitle: {

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

      textAlign:
        'center',

    },


    errorText: {

      color:
        '#8C96A0',

      fontSize: 16,

      lineHeight: 24,

      textAlign:
        'center',

      marginTop: 10,

      maxWidth: 310,

    },


    primaryButton: {

      minWidth: 160,

      height: 52,

      borderRadius: 16,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 24,

      paddingHorizontal: 22,

    },


    primaryButtonText: {

      color:
        '#0B0F14',

      fontSize: 14,

      fontWeight:
        '900',

    },


    scrollContent: {

      paddingBottom: 38,

    },


    hero: {

      minHeight: 92,

      backgroundColor:
        '#151B22',

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        '#303A45',

      padding: 18,

      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 14,

    },


    heroIcon: {

      width: 54,

      height: 54,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 14,

    },


    heroIconText: {

      color:
        '#0B0F14',

      fontSize: 25,

      fontWeight:
        '900',

    },


    heroInfo: {

      flex: 1,

    },


    heroLabel: {

      color:
        '#747E89',

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing: 1.6,

    },


    heroTitle: {

      color:
        '#FFFFFF',

      fontSize: 22,

      fontWeight:
        '900',

      marginTop: 5,

    },


    analysisCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 19,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

      marginBottom: 12,

    },


    cardLabel: {

      color:
        '#7A848F',

      fontSize: 11,

      fontWeight:
        '900',

      letterSpacing: 1.6,

      marginBottom: 10,

    },


    cardText: {

      color:
        '#E9EDF1',

      fontSize: 16,

      lineHeight: 25,

      fontWeight:
        '500',

    },


    nextCard: {

      backgroundColor:
        '#FFFFFF',

      borderRadius: 19,

      padding: 18,

      marginTop: 2,

    },


    nextLabel: {

      color:
        '#59616A',

      fontSize: 11,

      fontWeight:
        '900',

      letterSpacing: 1.6,

      marginBottom: 10,

    },


    nextText: {

      color:
        '#0B0F14',

      fontSize: 16,

      lineHeight: 25,

      fontWeight:
        '700',

    },


    disclaimer: {

      color:
        '#626C76',

      fontSize: 12,

      lineHeight: 18,

      textAlign:
        'center',

      marginTop: 18,

      paddingHorizontal: 12,

    },

  });