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

import Svg, {
  Circle,
  Line,
  Polyline,
} from 'react-native-svg';


const API_URL =
  'http://192.168.1.128:8080';


type HistorialSesion = {
  ejercicioId: number;
  entrenamientoId: number;
  catalogoEjercicioId: number | null;

  nombreEjercicio: string;

  fecha: string;

  pesoMaximo: number;
  volumenTotal: number;

  totalSeries: number;
  totalRepeticiones: number;
};


export default function ProgresoEjercicio() {

  const params =
    useLocalSearchParams<{
      ejercicioId?: string;
      nombre?: string;
    }>();


  const ejercicioId =
    params.ejercicioId;


  const nombreParametro =
    params.nombre ?? 'Ejercicio';


  const [
    historial,
    setHistorial,
  ] =
    useState<HistorialSesion[]>(
      []
    );


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


  /*
   * CARGAR HISTORIAL
   */

  useEffect(() => {

    cargarHistorial();

  }, [ejercicioId]);


  const cargarHistorial =
    async () => {

      try {

        setCargando(true);

        setError(null);


        if (!ejercicioId) {

          setError(
            'No se ha indicado el ejercicio.'
          );

          return;
        }


        const token =
          await AsyncStorage.getItem(
            'fittrack_token'
          );


        if (!token) {

          router.replace('/');

          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/series/historial-sesiones/ejercicio/${ejercicioId}`,
            {
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
            'No tienes acceso a este ejercicio.'
          );

          return;
        }


        if (
          response.status === 404
        ) {

          setError(
            'El ejercicio ya no existe.'
          );

          return;
        }


        if (!response.ok) {

          setError(
            'No se pudo cargar el historial.'
          );

          return;
        }


        const data:
          HistorialSesion[] =
            await response.json();


        setHistorial(
          data
        );


      } catch (error) {

        console.log(
          'Error cargando historial:',
          error
        );


        setError(
          'No se pudo conectar con el backend.'
        );


      } finally {

        setCargando(false);
      }

    };


  /*
   * DATOS GENERALES
   */

  const nombreEjercicio =
    historial.length > 0
      ? historial[
          historial.length - 1
        ].nombreEjercicio
      : nombreParametro;


  const primeraSesion =
    historial.length > 0
      ? historial[0]
      : null;


  const ultimaSesion =
    historial.length > 0
      ? historial[
          historial.length - 1
        ]
      : null;


  const recordPeso =
    historial.length > 0
      ? Math.max(
          ...historial.map(
            sesion =>
              sesion.pesoMaximo
          )
        )
      : 0;


  const diferenciaTotal =
    primeraSesion &&
    ultimaSesion
      ? ultimaSesion.pesoMaximo -
        primeraSesion.pesoMaximo
      : 0;


  const porcentajeTotal =
    primeraSesion &&
    primeraSesion.pesoMaximo !== 0
      ? (
          diferenciaTotal /
          primeraSesion.pesoMaximo
        ) * 100
      : 0;


  /*
   * FORMATO
   */

  const formatearPeso = (
    valor: number
  ) => {

    return valor.toLocaleString(
      'es-ES',
      {
        maximumFractionDigits: 2,
      }
    );

  };


  const formatearNumero = (
    valor: number
  ) => {

    return Math.round(
      valor
    ).toLocaleString(
      'es-ES'
    );

  };


  const formatearFecha = (
    fecha: string
  ) => {

    const partes =
      fecha.split('-');


    if (
      partes.length !== 3
    ) {

      return fecha;
    }


    return `${partes[2]}/${partes[1]}`;
  };


  const colorCambio =
    diferenciaTotal > 0
      ? '#35D07F'
      : diferenciaTotal < 0
        ? '#FF6B6B'
        : '#A6B0BA';


  /*
   * GRÁFICA
   */

  const crearPuntosGrafica =
    () => {

      if (
        historial.length === 0
      ) {

        return '';
      }


      const ancho =
        300;


      const alto =
        140;


      const margenX =
        18;


      const margenY =
        18;


      const pesos =
        historial.map(
          sesion =>
            sesion.pesoMaximo
        );


      const minimoOriginal =
        Math.min(
          ...pesos
        );


      const maximoOriginal =
        Math.max(
          ...pesos
        );


      const rangoOriginal =
        maximoOriginal -
        minimoOriginal;


      /*
       * Si todos los pesos son iguales,
       * damos un pequeño rango artificial
       * para que la línea quede centrada.
       */

      const minimo =
        rangoOriginal === 0
          ? minimoOriginal - 1
          : minimoOriginal;


      const maximo =
        rangoOriginal === 0
          ? maximoOriginal + 1
          : maximoOriginal;


      const rango =
        maximo - minimo;


      return historial
        .map(
          (
            sesion,
            index
          ) => {

            const x =
              historial.length === 1
                ? ancho / 2
                : margenX +
                  (
                    index /
                    (
                      historial.length -
                      1
                    )
                  ) *
                  (
                    ancho -
                    margenX * 2
                  );


            const porcentaje =
              (
                sesion.pesoMaximo -
                minimo
              ) /
              rango;


            const y =
              alto -
              margenY -
              porcentaje *
              (
                alto -
                margenY * 2
              );


            return `${x},${y}`;
          }
        )
        .join(' ');
    };


  const obtenerPuntos =
    () => {

      if (
        historial.length === 0
      ) {

        return [];
      }


      const ancho =
        300;


      const alto =
        140;


      const margenX =
        18;


      const margenY =
        18;


      const pesos =
        historial.map(
          sesion =>
            sesion.pesoMaximo
        );


      const minimoOriginal =
        Math.min(
          ...pesos
        );


      const maximoOriginal =
        Math.max(
          ...pesos
        );


      const rangoOriginal =
        maximoOriginal -
        minimoOriginal;


      const minimo =
        rangoOriginal === 0
          ? minimoOriginal - 1
          : minimoOriginal;


      const maximo =
        rangoOriginal === 0
          ? maximoOriginal + 1
          : maximoOriginal;


      const rango =
        maximo - minimo;


      return historial.map(
        (
          sesion,
          index
        ) => {

          const x =
            historial.length === 1
              ? ancho / 2
              : margenX +
                (
                  index /
                  (
                    historial.length -
                    1
                  )
                ) *
                (
                  ancho -
                  margenX * 2
                );


          const porcentaje =
            (
              sesion.pesoMaximo -
              minimo
            ) /
            rango;


          const y =
            alto -
            margenY -
            porcentaje *
            (
              alto -
              margenY * 2
            );


          return {
            x,
            y,
          };
        }
      );
    };


  const puntosGrafica =
    obtenerPuntos();


  /*
   * PANTALLA
   */

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <ScrollView

        style={
          styles.scroll
        }

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
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
                styles.pressed,

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

              PROGRESO

            </Text>


            <Text
              style={
                styles.title
              }
              numberOfLines={
                2
              }
            >

              {
                nombreEjercicio
              }

            </Text>

          </View>

        </View>


        {
          cargando
            ? (

              <View
                style={
                  styles.loading
                }
              >

                <ActivityIndicator
                  size="large"
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.loadingText
                  }
                >

                  Cargando evolución...

                </Text>

              </View>

            )
            : error
              ? (

                <View
                  style={
                    styles.errorCard
                  }
                >

                  <Text
                    style={
                      styles.errorTitle
                    }
                  >

                    No podemos mostrar el progreso

                  </Text>


                  <Text
                    style={
                      styles.errorText
                    }
                  >

                    {
                      error
                    }

                  </Text>


                  <Pressable

                    style={
                      styles.retryButton
                    }

                    onPress={
                      cargarHistorial
                    }

                  >

                    <Text
                      style={
                        styles.retryText
                      }
                    >

                      Reintentar

                    </Text>

                  </Pressable>

                </View>

              )
              : (

                <>


                  {/* RESUMEN */}

                  <View
                    style={
                      styles.summaryRow
                    }
                  >

                    <View
                      style={
                        styles.summaryCard
                      }
                    >

                      <Text
                        style={
                          styles.summaryLabel
                        }
                      >

                        ACTUAL

                      </Text>


                      <Text
                        style={
                          styles.summaryValue
                        }
                      >

                        {
                          formatearPeso(
                            ultimaSesion
                              ?.pesoMaximo ??
                            0
                          )
                        } kg

                      </Text>

                    </View>


                    <View
                      style={
                        styles.summaryCard
                      }
                    >

                      <Text
                        style={
                          styles.summaryLabel
                        }
                      >

                        RÉCORD

                      </Text>


                      <Text
                        style={
                          styles.summaryValue
                        }
                      >

                        {
                          formatearPeso(
                            recordPeso
                          )
                        } kg

                      </Text>

                    </View>

                  </View>


                  {/* EVOLUCIÓN TOTAL */}

                  <View
                    style={
                      styles.evolutionCard
                    }
                  >

                    <Text
                      style={
                        styles.cardLabel
                      }
                    >

                      EVOLUCIÓN TOTAL

                    </Text>


                    <Text
                      style={[
                        styles.evolutionValue,
                        {
                          color:
                            colorCambio,
                        },
                      ]}
                    >

                      {
                        diferenciaTotal > 0
                          ? '+'
                          : ''
                      }

                      {
                        formatearPeso(
                          diferenciaTotal
                        )
                      } kg

                    </Text>


                    <Text
                      style={[
                        styles.evolutionPercentage,
                        {
                          color:
                            colorCambio,
                        },
                      ]}
                    >

                      {
                        porcentajeTotal > 0
                          ? '+'
                          : ''
                      }

                      {
                        porcentajeTotal.toFixed(
                          2
                        )
                      } %

                    </Text>


                    <Text
                      style={
                        styles.evolutionText
                      }
                    >

                      Desde tu primera sesión registrada hasta la más reciente.

                    </Text>

                  </View>


                  {/* GRÁFICA */}

                  <View
                    style={
                      styles.sectionHeader
                    }
                  >

                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >

                      Peso máximo

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      Evolución de tu mejor serie en cada sesión.

                    </Text>

                  </View>


                  <View
                    style={
                      styles.chartCard
                    }
                  >

                    {
                      historial.length >= 2
                        ? (

                          <>

                            <Svg
                              width="100%"
                              height={160}
                              viewBox="0 0 300 140"
                            >

                              <Line
                                x1="18"
                                y1="122"
                                x2="282"
                                y2="122"
                                stroke="#252D36"
                                strokeWidth="1"
                              />


                              <Line
                                x1="18"
                                y1="70"
                                x2="282"
                                y2="70"
                                stroke="#1D242C"
                                strokeWidth="1"
                              />


                              <Line
                                x1="18"
                                y1="18"
                                x2="282"
                                y2="18"
                                stroke="#1D242C"
                                strokeWidth="1"
                              />


                              <Polyline
                                points={
                                  crearPuntosGrafica()
                                }
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="3"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />


                              {
                                puntosGrafica.map(
                                  (
                                    punto,
                                    index
                                  ) => (

                                    <Circle
                                      key={
                                        `punto-${index}`
                                      }
                                      cx={
                                        punto.x
                                      }
                                      cy={
                                        punto.y
                                      }
                                      r="5"
                                      fill="#0B0F14"
                                      stroke="#FFFFFF"
                                      strokeWidth="3"
                                    />

                                  )
                                )
                              }

                            </Svg>


                            <View
                              style={
                                styles.chartFooter
                              }
                            >

                              <Text
                                style={
                                  styles.chartDate
                                }
                              >

                                {
                                  primeraSesion
                                    ? formatearFecha(
                                        primeraSesion.fecha
                                      )
                                    : ''
                                }

                              </Text>


                              <Text
                                style={
                                  styles.chartSessions
                                }
                              >

                                {
                                  historial.length
                                } sesiones

                              </Text>


                              <Text
                                style={
                                  styles.chartDate
                                }
                              >

                                {
                                  ultimaSesion
                                    ? formatearFecha(
                                        ultimaSesion.fecha
                                      )
                                    : ''
                                }

                              </Text>

                            </View>

                          </>

                        )
                        : (

                          <View
                            style={
                              styles.notEnoughData
                            }
                          >

                            <Text
                              style={
                                styles.notEnoughTitle
                              }
                            >

                              Necesitamos otra sesión

                            </Text>


                            <Text
                              style={
                                styles.notEnoughText
                              }
                            >

                              Cuando vuelvas a registrar este ejercicio podremos dibujar tu evolución.

                            </Text>

                          </View>

                        )
                    }

                  </View>


                  {/* HISTORIAL */}

                  <View
                    style={
                      styles.sectionHeader
                    }
                  >

                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >

                      Historial

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      Tus sesiones registradas de este ejercicio.

                    </Text>

                  </View>


                  {
                    [...historial]
                      .reverse()
                      .map(
                        (
                          sesion,
                          index
                        ) => (

                          <View
                            key={
                              `${sesion.entrenamientoId}-${sesion.ejercicioId}`
                            }
                            style={
                              styles.sessionCard
                            }
                          >

                            <View
                              style={
                                styles.sessionHeader
                              }
                            >

                              <View>

                                <Text
                                  style={
                                    styles.sessionNumber
                                  }
                                >

                                  SESIÓN {
                                    historial.length -
                                    index
                                  }

                                </Text>


                                <Text
                                  style={
                                    styles.sessionDate
                                  }
                                >

                                  {
                                    formatearFecha(
                                      sesion.fecha
                                    )
                                  }

                                </Text>

                              </View>


                              <Text
                                style={
                                  styles.sessionWeight
                                }
                              >

                                {
                                  formatearPeso(
                                    sesion.pesoMaximo
                                  )
                                } kg

                              </Text>

                            </View>


                            <View
                              style={
                                styles.sessionStats
                              }
                            >

                              <View
                                style={
                                  styles.sessionStat
                                }
                              >

                                <Text
                                  style={
                                    styles.sessionStatValue
                                  }
                                >

                                  {
                                    sesion.totalSeries
                                  }

                                </Text>


                                <Text
                                  style={
                                    styles.sessionStatLabel
                                  }
                                >

                                  Series

                                </Text>

                              </View>


                              <View
                                style={
                                  styles.sessionStat
                                }
                              >

                                <Text
                                  style={
                                    styles.sessionStatValue
                                  }
                                >

                                  {
                                    sesion.totalRepeticiones
                                  }

                                </Text>


                                <Text
                                  style={
                                    styles.sessionStatLabel
                                  }
                                >

                                  Reps

                                </Text>

                              </View>


                              <View
                                style={
                                  styles.sessionStat
                                }
                              >

                                <Text
                                  style={
                                    styles.sessionStatValueSmall
                                  }
                                >

                                  {
                                    formatearNumero(
                                      sesion.volumenTotal
                                    )
                                  }

                                </Text>


                                <Text
                                  style={
                                    styles.sessionStatLabel
                                  }
                                >

                                  Kg volumen

                                </Text>

                              </View>

                            </View>

                          </View>

                        )
                      )
                  }


                  <Pressable

                    style={({
                      pressed
                    }) => [

                      styles.refreshButton,

                      pressed &&
                        styles.pressed,

                    ]}

                    onPress={
                      cargarHistorial
                    }

                  >

                    <Text
                      style={
                        styles.refreshText
                      }
                    >

                      Actualizar

                    </Text>

                  </Pressable>

                </>

              )
        }

      </ScrollView>

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


    scroll: {

      flex: 1,

    },


    content: {

      paddingHorizontal: 24,

      paddingTop: 18,

      paddingBottom: 50,

    },


    header: {

      flexDirection:
        'row',

      alignItems:
        'center',

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


    pressed: {

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
        '800',

      letterSpacing: 2,

    },


    title: {

      color:
        '#FFFFFF',

      fontSize: 23,

      lineHeight: 29,

      fontWeight:
        '900',

      marginTop: 2,

    },


    loading: {

      minHeight: 450,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    loadingText: {

      color:
        '#747E89',

      fontSize: 13,

      marginTop: 14,

    },


    errorCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

      marginTop: 30,

    },


    errorTitle: {

      color:
        '#FFFFFF',

      fontSize: 18,

      fontWeight:
        '900',

    },


    errorText: {

      color:
        '#7D8791',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 8,

    },


    retryButton: {

      height: 48,

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        '#303842',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 18,

    },


    retryText: {

      color:
        '#FFFFFF',

      fontSize: 13,

      fontWeight:
        '800',

    },


    summaryRow: {

      flexDirection:
        'row',

      gap: 12,

      marginTop: 30,

    },


    summaryCard: {

      flex: 1,

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

    },


    summaryLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 1.5,

    },


    summaryValue: {

      color:
        '#FFFFFF',

      fontSize: 25,

      fontWeight:
        '900',

      marginTop: 7,

    },


    evolutionCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

      marginTop: 12,

    },


    cardLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 1.5,

    },


    evolutionValue: {

      fontSize: 30,

      fontWeight:
        '900',

      marginTop: 10,

    },


    evolutionPercentage: {

      fontSize: 16,

      fontWeight:
        '900',

      marginTop: 3,

    },


    evolutionText: {

      color:
        '#7D8791',

      fontSize: 12,

      lineHeight: 18,

      marginTop: 10,

    },


    sectionHeader: {

      marginTop: 30,

      marginBottom: 13,

    },


    sectionTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '900',

    },


    sectionText: {

      color:
        '#747E89',

      fontSize: 12,

      lineHeight: 18,

      marginTop: 5,

    },


    chartCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

    },


    chartFooter: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginTop: 4,

    },


    chartDate: {

      color:
        '#717A84',

      fontSize: 10,

      fontWeight:
        '700',

    },


    chartSessions: {

      color:
        '#FFFFFF',

      fontSize: 10,

      fontWeight:
        '800',

    },


    notEnoughData: {

      minHeight: 150,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 20,

    },


    notEnoughTitle: {

      color:
        '#FFFFFF',

      fontSize: 16,

      fontWeight:
        '900',

    },


    notEnoughText: {

      color:
        '#747E89',

      fontSize: 12,

      lineHeight: 18,

      textAlign:
        'center',

      marginTop: 7,

    },


    sessionCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

      marginBottom: 11,

    },


    sessionHeader: {

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

    },


    sessionNumber: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 1.4,

    },


    sessionDate: {

      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '800',

      marginTop: 5,

    },


    sessionWeight: {

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

    },


    sessionStats: {

      flexDirection:
        'row',

      borderTopWidth: 1,

      borderTopColor:
        '#252D36',

      marginTop: 16,

      paddingTop: 15,

    },


    sessionStat: {

      flex: 1,

    },


    sessionStatValue: {

      color:
        '#FFFFFF',

      fontSize: 17,

      fontWeight:
        '900',

    },


    sessionStatValueSmall: {

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '900',

    },


    sessionStatLabel: {

      color:
        '#717A84',

      fontSize: 9,

      marginTop: 4,

    },


    refreshButton: {

      height: 52,

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        '#303842',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 12,

    },


    refreshText: {

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '800',

    },

  });