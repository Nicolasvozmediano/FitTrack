import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
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


type EstadisticasUsuario = {
  totalEntrenamientos: number;
  totalEjercicios: number;
  totalSeries: number;
  volumenTotal: number;
  duracionTotalMinutos: number;
};


type HistorialEntrenamiento = {
  entrenamientoId: number;
  nombre: string;
  fecha: string;
  duracionMinutos: number | null;
  totalEjercicios: number;
  totalSeries: number;
  volumenTotal: number;
};


type GraficaLineaProps = {
  valores: number[];
};


function GraficaLinea({
  valores,
}: GraficaLineaProps) {

  const ancho = 300;
  const alto = 140;

  const margenX = 18;
  const margenY = 18;


  if (
    valores.length < 2
  ) {

    return (

      <View
        style={
          styles.chartEmpty
        }
      >

        <Text
          style={
            styles.chartEmptyTitle
          }
        >

          Necesitamos más sesiones

        </Text>


        <Text
          style={
            styles.chartEmptyText
          }
        >

          Registra al menos dos entrenamientos para mostrar la evolución.

        </Text>

      </View>

    );

  }


  const minimoOriginal =
    Math.min(
      ...valores
    );


  const maximoOriginal =
    Math.max(
      ...valores
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


  const puntos =
    valores.map(
      (
        valor,
        index
      ) => {

        const x =
          margenX +
          (
            index /
            (
              valores.length -
              1
            )
          ) *
          (
            ancho -
            margenX * 2
          );


        const porcentaje =
          (
            valor -
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


  const puntosTexto =
    puntos
      .map(
        punto =>
          `${punto.x},${punto.y}`
      )
      .join(' ');


  return (

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
          puntosTexto
        }
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />


      {
        puntos.map(
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

  );

}


export default function Estadisticas() {

  const [
    estadisticas,
    setEstadisticas,
  ] =
    useState<EstadisticasUsuario | null>(
      null
    );


  const [
    historial,
    setHistorial,
  ] =
    useState<HistorialEntrenamiento[]>(
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
   * CARGAR DATOS
   */

  const cargarDatos =
    useCallback(
      async () => {

        try {

          setCargando(true);
          setError(null);


          const token =
            await AsyncStorage.getItem(
              'fittrack_token'
            );


          if (!token) {

            router.replace('/');

            return;
          }


          const [
            responseEstadisticas,
            responseHistorial,
          ] =
            await Promise.all([

              fetch(
                `${API_URL}/api/entrenamientos/estadisticas`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              ),

              fetch(
                `${API_URL}/api/entrenamientos/historial`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              ),

            ]);


          if (
            responseEstadisticas.status === 401
            ||
            responseHistorial.status === 401
          ) {

            await AsyncStorage.removeItem(
              'fittrack_token'
            );


            router.replace('/');

            return;
          }


          if (
            !responseEstadisticas.ok
            ||
            !responseHistorial.ok
          ) {

            setError(
              'No se pudieron cargar las estadísticas.'
            );

            return;
          }


          const datosEstadisticas:
            EstadisticasUsuario =
              await responseEstadisticas
                .json();


          const datosHistorial:
            HistorialEntrenamiento[] =
              await responseHistorial
                .json();


          const historialOrdenado =
            [...datosHistorial]
              .sort(
                (
                  a,
                  b
                ) => {

                  const fechaA =
                    a.fecha ?? '';


                  const fechaB =
                    b.fecha ?? '';


                  const comparacionFecha =
                    fechaA.localeCompare(
                      fechaB
                    );


                  if (
                    comparacionFecha !== 0
                  ) {

                    return comparacionFecha;
                  }


                  return (
                    a.entrenamientoId -
                    b.entrenamientoId
                  );

                }
              );


          setEstadisticas(
            datosEstadisticas
          );


          setHistorial(
            historialOrdenado
          );


        } catch (error) {

          console.log(
            'Error cargando estadísticas:',
            error
          );


          setError(
            'No se pudo conectar con el servidor.'
          );


        } finally {

          setCargando(false);
        }

      },
      []
    );


  /*
   * ACTUALIZAR AL ENTRAR
   */

  useFocusEffect(

    useCallback(
      () => {

        void cargarDatos();

      },
      [
        cargarDatos,
      ]
    )

  );


  /*
   * DATOS GENERALES
   */

  const totalEntrenamientos =
    estadisticas
      ?.totalEntrenamientos
    ?? 0;


  const totalEjercicios =
    estadisticas
      ?.totalEjercicios
    ?? 0;


  const totalSeries =
    estadisticas
      ?.totalSeries
    ?? 0;


  const volumenTotal =
    estadisticas
      ?.volumenTotal
    ?? 0;


  const duracionTotal =
    estadisticas
      ?.duracionTotalMinutos
    ?? 0;


  const mediaSeries =
    totalEntrenamientos > 0
      ? totalSeries /
        totalEntrenamientos
      : 0;


  const mediaEjercicios =
    totalEntrenamientos > 0
      ? totalEjercicios /
        totalEntrenamientos
      : 0;


  const mediaVolumen =
    totalEntrenamientos > 0
      ? volumenTotal /
        totalEntrenamientos
      : 0;


  const mediaDuracion =
    totalEntrenamientos > 0
      ? duracionTotal /
        totalEntrenamientos
      : 0;


  /*
   * MEJOR SESIÓN
   */

  const mejorSesion =
    historial.length > 0
      ? historial.reduce(
          (
            mejor,
            actual
          ) =>
            actual.volumenTotal >
            mejor.volumenTotal
              ? actual
              : mejor
        )
      : null;


  /*
   * DATOS PARA GRÁFICAS
   */

  const volumenes =
    historial.map(
      sesion =>
        sesion.volumenTotal ?? 0
    );


  const duraciones =
    historial.map(
      sesion =>
        sesion.duracionMinutos ?? 0
    );


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


  /*
   * ÚLTIMAS SESIONES
   */

  const ultimasSesiones =
    [...historial]
      .reverse()
      .slice(
        0,
        5
      );


  /*
   * FORMATO
   */

  const formatearNumero = (
    numero: number
  ) => {

    return Math.round(
      numero
    ).toLocaleString(
      'es-ES'
    );

  };


  const formatearDecimal = (
    numero: number
  ) => {

    return numero.toLocaleString(
      'es-ES',
      {
        maximumFractionDigits: 1,
      }
    );

  };


  const formatearFecha = (
    fecha: string
  ) => {

    if (!fecha) {

      return '';
    }


    const partes =
      fecha.split('-');


    if (
      partes.length !== 3
    ) {

      return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  };


  const formatearFechaCorta = (
    fecha: string
  ) => {

    if (!fecha) {

      return '';
    }


    const partes =
      fecha.split('-');


    if (
      partes.length !== 3
    ) {

      return fecha;
    }


    return `${partes[2]}/${partes[1]}`;

  };


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

              FITTRACK

            </Text>


            <Text
              style={
                styles.title
              }
            >

              Estadísticas

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

                  Analizando tus entrenamientos...

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

                    No podemos mostrar tus estadísticas

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

                    onPress={() =>
                      void cargarDatos()
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


                  {/* HERO */}

                  <View
                    style={
                      styles.hero
                    }
                  >

                    <Text
                      style={
                        styles.heroLabel
                      }
                    >

                      TU ACTIVIDAD

                    </Text>


                    <Text
                      style={
                        styles.heroTitle
                      }
                    >

                      {
                        totalEntrenamientos
                      } entrenamientos

                    </Text>


                    <Text
                      style={
                        styles.heroText
                      }
                    >

                      Una visión global de todo el trabajo que has registrado en FitTrack.

                    </Text>

                  </View>


                  {/* TOTALES */}

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

                      Totales

                    </Text>

                  </View>


                  <View
                    style={
                      styles.statsRow
                    }
                  >

                    <View
                      style={
                        styles.statCard
                      }
                    >

                      <Text
                        style={
                          styles.statValue
                        }
                      >

                        {
                          totalSeries
                        }

                      </Text>


                      <Text
                        style={
                          styles.statLabel
                        }
                      >

                        Series

                      </Text>

                    </View>


                    <View
                      style={
                        styles.statCard
                      }
                    >

                      <Text
                        style={
                          styles.statValue
                        }
                      >

                        {
                          totalEjercicios
                        }

                      </Text>


                      <Text
                        style={
                          styles.statLabel
                        }
                      >

                        Ejercicios

                      </Text>

                    </View>

                  </View>


                  <View
                    style={
                      styles.statsRow
                    }
                  >

                    <View
                      style={
                        styles.statCard
                      }
                    >

                      <Text
                        style={
                          styles.statValueSmall
                        }
                      >

                        {
                          formatearNumero(
                            volumenTotal
                          )
                        }

                      </Text>


                      <Text
                        style={
                          styles.statLabel
                        }
                      >

                        Kg de volumen

                      </Text>

                    </View>


                    <View
                      style={
                        styles.statCard
                      }
                    >

                      <Text
                        style={
                          styles.statValueSmall
                        }
                      >

                        {
                          formatearDecimal(
                            duracionTotal /
                            60
                          )
                        } h

                      </Text>


                      <Text
                        style={
                          styles.statLabel
                        }
                      >

                        Tiempo total

                      </Text>

                    </View>

                  </View>


                  {/* MEDIAS */}

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

                      Media por entrenamiento

                    </Text>

                  </View>


                  <View
                    style={
                      styles.averageCard
                    }
                  >

                    <View
                      style={
                        styles.averageRow
                      }
                    >

                      <Text
                        style={
                          styles.averageLabel
                        }
                      >

                        Series

                      </Text>


                      <Text
                        style={
                          styles.averageValue
                        }
                      >

                        {
                          formatearDecimal(
                            mediaSeries
                          )
                        }

                      </Text>

                    </View>


                    <View
                      style={
                        styles.separator
                      }
                    />


                    <View
                      style={
                        styles.averageRow
                      }
                    >

                      <Text
                        style={
                          styles.averageLabel
                        }
                      >

                        Ejercicios

                      </Text>


                      <Text
                        style={
                          styles.averageValue
                        }
                      >

                        {
                          formatearDecimal(
                            mediaEjercicios
                          )
                        }

                      </Text>

                    </View>


                    <View
                      style={
                        styles.separator
                      }
                    />


                    <View
                      style={
                        styles.averageRow
                      }
                    >

                      <Text
                        style={
                          styles.averageLabel
                        }
                      >

                        Volumen

                      </Text>


                      <Text
                        style={
                          styles.averageValue
                        }
                      >

                        {
                          formatearNumero(
                            mediaVolumen
                          )
                        } kg

                      </Text>

                    </View>


                    <View
                      style={
                        styles.separator
                      }
                    />


                    <View
                      style={
                        styles.averageRow
                      }
                    >

                      <Text
                        style={
                          styles.averageLabel
                        }
                      >

                        Duración

                      </Text>


                      <Text
                        style={
                          styles.averageValue
                        }
                      >

                        {
                          formatearNumero(
                            mediaDuracion
                          )
                        } min

                      </Text>

                    </View>

                  </View>


                  {/* MEJOR SESIÓN */}

                  {
                    mejorSesion && (

                      <>

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

                            Mejor sesión por volumen

                          </Text>

                        </View>


                        <View
                          style={
                            styles.bestCard
                          }
                        >

                          <Text
                            style={
                              styles.bestLabel
                            }
                          >

                            MEJOR REGISTRO

                          </Text>


                          <Text
                            style={
                              styles.bestTitle
                            }
                            numberOfLines={
                              2
                            }
                          >

                            {
                              mejorSesion.nombre
                            }

                          </Text>


                          <Text
                            style={
                              styles.bestVolume
                            }
                          >

                            {
                              formatearNumero(
                                mejorSesion.volumenTotal
                              )
                            } kg

                          </Text>


                          <View
                            style={
                              styles.bestFooter
                            }
                          >

                            <Text
                              style={
                                styles.bestDetail
                              }
                            >

                              {
                                formatearFecha(
                                  mejorSesion.fecha
                                )
                              }

                            </Text>


                            <Text
                              style={
                                styles.bestDetail
                              }
                            >

                              {
                                mejorSesion.totalSeries
                              } series

                            </Text>


                            <Text
                              style={
                                styles.bestDetail
                              }
                            >

                              {
                                mejorSesion.duracionMinutos ??
                                0
                              } min

                            </Text>

                          </View>

                        </View>

                      </>

                    )
                  }


                  {/* VOLUMEN */}

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

                      Evolución del volumen

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      Kg totales movidos en cada entrenamiento.

                    </Text>

                  </View>


                  <View
                    style={
                      styles.chartCard
                    }
                  >

                    <GraficaLinea
                      valores={
                        volumenes
                      }
                    />


                    {
                      historial.length >= 2 && (

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
                                ? formatearFechaCorta(
                                    primeraSesion.fecha
                                  )
                                : ''
                            }

                          </Text>


                          <Text
                            style={
                              styles.chartCount
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
                                ? formatearFechaCorta(
                                    ultimaSesion.fecha
                                  )
                                : ''
                            }

                          </Text>

                        </View>

                      )
                    }

                  </View>


                  {/* DURACIÓN */}

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

                      Duración de las sesiones

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      Minutos registrados en cada entrenamiento.

                    </Text>

                  </View>


                  <View
                    style={
                      styles.chartCard
                    }
                  >

                    <GraficaLinea
                      valores={
                        duraciones
                      }
                    />


                    {
                      historial.length >= 2 && (

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
                                ? formatearFechaCorta(
                                    primeraSesion.fecha
                                  )
                                : ''
                            }

                          </Text>


                          <Text
                            style={
                              styles.chartCount
                            }
                          >

                            Minutos

                          </Text>


                          <Text
                            style={
                              styles.chartDate
                            }
                          >

                            {
                              ultimaSesion
                                ? formatearFechaCorta(
                                    ultimaSesion.fecha
                                  )
                                : ''
                            }

                          </Text>

                        </View>

                      )
                    }

                  </View>


                  {/* ÚLTIMAS SESIONES */}

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

                      Últimas sesiones

                    </Text>

                  </View>


                  {
                    ultimasSesiones.length === 0
                      ? (

                        <View
                          style={
                            styles.emptyCard
                          }
                        >

                          <Text
                            style={
                              styles.emptyTitle
                            }
                          >

                            Todavía no hay datos

                          </Text>


                          <Text
                            style={
                              styles.emptyText
                            }
                          >

                            Registra tu primer entrenamiento para empezar a generar estadísticas.

                          </Text>

                        </View>

                      )
                      : (

                        ultimasSesiones.map(
                          sesion => (

                            <View

                              key={
                                sesion.entrenamientoId
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

                                <View
                                  style={
                                    styles.sessionInfo
                                  }
                                >

                                  <Text
                                    style={
                                      styles.sessionName
                                    }
                                    numberOfLines={
                                      1
                                    }
                                  >

                                    {
                                      sesion.nombre
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
                                    styles.sessionVolume
                                  }
                                >

                                  {
                                    formatearNumero(
                                      sesion.volumenTotal
                                    )
                                  } kg

                                </Text>

                              </View>


                              <View
                                style={
                                  styles.sessionStats
                                }
                              >

                                <Text
                                  style={
                                    styles.sessionStat
                                  }
                                >

                                  {
                                    sesion.totalEjercicios
                                  } ejercicios

                                </Text>


                                <Text
                                  style={
                                    styles.sessionStat
                                  }
                                >

                                  {
                                    sesion.totalSeries
                                  } series

                                </Text>


                                <Text
                                  style={
                                    styles.sessionStat
                                  }
                                >

                                  {
                                    sesion.duracionMinutos ??
                                    0
                                  } min

                                </Text>

                              </View>

                            </View>

                          )
                        )

                      )
                  }


                  {/* ACTUALIZAR */}

                  <Pressable

                    style={({
                      pressed
                    }) => [

                      styles.refreshButton,

                      pressed &&
                        styles.pressed,

                    ]}

                    onPress={() =>
                      void cargarDatos()
                    }

                  >

                    <Text
                      style={
                        styles.refreshText
                      }
                    >

                      Actualizar estadísticas

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

      fontSize: 29,

      fontWeight:
        '900',

      marginTop: 2,

    },


    loading: {

      minHeight: 500,

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


    hero: {

      backgroundColor:
        '#151B22',

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 23,

      marginTop: 28,

    },


    heroLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    heroTitle: {

      color:
        '#FFFFFF',

      fontSize: 28,

      fontWeight:
        '900',

      marginTop: 9,

    },


    heroText: {

      color:
        '#8D96A0',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 7,

    },


    sectionHeader: {

      marginTop: 29,

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


    statsRow: {

      flexDirection:
        'row',

      gap: 12,

      marginBottom: 12,

    },


    statCard: {

      flex: 1,

      minHeight: 108,

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

      justifyContent:
        'center',

    },


    statValue: {

      color:
        '#FFFFFF',

      fontSize: 29,

      fontWeight:
        '900',

    },


    statValueSmall: {

      color:
        '#FFFFFF',

      fontSize: 22,

      fontWeight:
        '900',

    },


    statLabel: {

      color:
        '#7D8791',

      fontSize: 12,

      marginTop: 6,

    },


    averageCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 18,

    },


    averageRow: {

      minHeight: 68,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    averageLabel: {

      color:
        '#9AA3AD',

      fontSize: 13,

      fontWeight:
        '700',

    },


    averageValue: {

      color:
        '#FFFFFF',

      fontSize: 17,

      fontWeight:
        '900',

    },


    separator: {

      height: 1,

      backgroundColor:
        '#252D36',

    },


    bestCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

    },


    bestLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    bestTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      lineHeight: 26,

      fontWeight:
        '900',

      marginTop: 8,

    },


    bestVolume: {

      color:
        '#FFFFFF',

      fontSize: 31,

      fontWeight:
        '900',

      marginTop: 13,

    },


    bestFooter: {

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 13,

      marginTop: 13,

    },


    bestDetail: {

      color:
        '#747E89',

      fontSize: 11,

      fontWeight:
        '700',

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

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginTop: 3,

    },


    chartDate: {

      color:
        '#717A84',

      fontSize: 10,

      fontWeight:
        '700',

    },


    chartCount: {

      color:
        '#FFFFFF',

      fontSize: 10,

      fontWeight:
        '800',

    },


    chartEmpty: {

      minHeight: 160,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 20,

    },


    chartEmptyTitle: {

      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '900',

    },


    chartEmptyText: {

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

      padding: 17,

      marginBottom: 10,

    },


    sessionHeader: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      gap: 14,

    },


    sessionInfo: {

      flex: 1,

    },


    sessionName: {

      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '900',

    },


    sessionDate: {

      color:
        '#717A84',

      fontSize: 10,

      marginTop: 5,

    },


    sessionVolume: {

      color:
        '#FFFFFF',

      fontSize: 17,

      fontWeight:
        '900',

    },


    sessionStats: {

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 12,

      borderTopWidth: 1,

      borderTopColor:
        '#252D36',

      marginTop: 14,

      paddingTop: 13,

    },


    sessionStat: {

      color:
        '#7D8791',

      fontSize: 10,

      fontWeight:
        '700',

    },


    emptyCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

    },


    emptyTitle: {

      color:
        '#FFFFFF',

      fontSize: 16,

      fontWeight:
        '900',

    },


    emptyText: {

      color:
        '#747E89',

      fontSize: 12,

      lineHeight: 19,

      marginTop: 6,

    },


    refreshButton: {

      height: 54,

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        '#303842',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 20,

    },


    refreshText: {

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '800',

    },

  });