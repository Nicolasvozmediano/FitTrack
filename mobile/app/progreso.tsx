
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


const API_URL =
  'http://192.168.1.128:8080';


type Estadisticas = {
  totalEntrenamientos: number;
  totalEjercicios: number;
  totalSeries: number;
  volumenTotal: number;
  duracionTotalMinutos: number;
};


type EjercicioUsuario = {
  id: number;
  nombre: string;
  catalogoEjercicioId: number | null;
};


type ProgresoSesion = {
  nombreEjercicio: string;
  ejercicioAnteriorId: number;
  ejercicioActualId: number;
  entrenamientoAnteriorId: number;
  entrenamientoActualId: number;
  fechaAnterior: string;
  fechaActual: string;
  pesoMaximoAnterior: number;
  pesoMaximoActual: number;
  diferenciaPeso: number;
  porcentajeCambio: number;
  estado: string;
};


type EjercicioConProgreso =
  EjercicioUsuario & {
    progreso: ProgresoSesion | null;
  };


export default function Progreso() {

  const [
    estadisticas,
    setEstadisticas,
  ] =
    useState<Estadisticas | null>(
      null
    );


  const [
    ejercicios,
    setEjercicios,
  ] =
    useState<EjercicioConProgreso[]>(
      []
    );


  const [
    cargando,
    setCargando,
  ] =
    useState(true);


  /*
   * TOKEN
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
   * CERRAR SESIÓN SI EL TOKEN YA NO ES VÁLIDO
   */

  const cerrarSesion =
    async () => {

      await AsyncStorage.removeItem(
        'fittrack_token'
      );


      router.replace('/');
    };


  /*
   * OBTENER EJERCICIOS ÚNICOS
   */

  const obtenerEjerciciosUnicos = (
    lista: EjercicioUsuario[]
  ) => {

    const mapa =
      new Map<
        string,
        EjercicioUsuario
      >();


    lista.forEach(
      ejercicio => {

        const clave =
          ejercicio.catalogoEjercicioId
            ? `catalogo-${ejercicio.catalogoEjercicioId}`
            : `nombre-${ejercicio.nombre
                .trim()
                .toLowerCase()}`;


        const existente =
          mapa.get(clave);


        if (
          !existente
          || ejercicio.id >
            existente.id
        ) {

          mapa.set(
            clave,
            ejercicio
          );
        }

      }
    );


    return Array
      .from(
        mapa.values()
      )
      .sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre,
            'es'
          )
      );
  };


  /*
   * CARGAR PROGRESO DE UN EJERCICIO
   */

  const cargarProgresoEjercicio =
    async (
      ejercicio: EjercicioUsuario,
      token: string
    ):
      Promise<EjercicioConProgreso> => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/series/progreso-sesion/ejercicio/${ejercicio.id}`,
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

          throw new Error(
            'UNAUTHORIZED'
          );
        }


        /*
         * 404 significa que todavía no existe
         * una sesión anterior comparable.
         */

        if (
          response.status === 404
        ) {

          return {
            ...ejercicio,
            progreso: null,
          };
        }


        if (!response.ok) {

          console.log(
            'Error cargando progreso del ejercicio:',
            ejercicio.id,
            response.status
          );


          return {
            ...ejercicio,
            progreso: null,
          };
        }


        const progreso:
          ProgresoSesion =
            await response.json();


        return {
          ...ejercicio,
          progreso,
        };


      } catch (error) {

        if (
          error instanceof Error
          && error.message ===
            'UNAUTHORIZED'
        ) {

          throw error;
        }


        console.log(
          'Error conectando con progreso:',
          error
        );


        return {
          ...ejercicio,
          progreso: null,
        };
      }

    };


  /*
   * CARGAR TODOS LOS DATOS
   */

  const cargarDatos =
    async () => {

      try {

        setCargando(true);


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const [
          responseEstadisticas,
          responseEjercicios,
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
              `${API_URL}/api/ejercicios/mis-ejercicios`,
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
          || responseEjercicios.status === 401
        ) {

          await cerrarSesion();

          return;
        }


        if (
          !responseEstadisticas.ok
        ) {

          console.log(
            'Error cargando estadísticas:',
            responseEstadisticas.status
          );

          return;
        }


        if (
          !responseEjercicios.ok
        ) {

          console.log(
            'Error cargando ejercicios:',
            responseEjercicios.status
          );

          return;
        }


        const datosEstadisticas:
          Estadisticas =
            await responseEstadisticas
              .json();


        const datosEjercicios:
          EjercicioUsuario[] =
            await responseEjercicios
              .json();


        setEstadisticas(
          datosEstadisticas
        );


        const ejerciciosUnicos =
          obtenerEjerciciosUnicos(
            datosEjercicios
          );


        const ejerciciosConProgreso =
          await Promise.all(
            ejerciciosUnicos.map(
              ejercicio =>
                cargarProgresoEjercicio(
                  ejercicio,
                  token
                )
            )
          );


        setEjercicios(
          ejerciciosConProgreso
        );


      } catch (error) {

        if (
          error instanceof Error
          && error.message ===
            'UNAUTHORIZED'
        ) {

          await cerrarSesion();

          return;
        }


        console.log(
          'Error cargando progreso:',
          error
        );


      } finally {

        setCargando(false);
      }

    };


  /*
   * ACTUALIZAR AL ENTRAR
   */

  useFocusEffect(

    useCallback(() => {

      cargarDatos();

    }, [])

  );


  /*
   * CÁLCULOS GENERALES
   */

  const totalEntrenamientos =
    estadisticas?.totalEntrenamientos ??
    0;


  const totalEjercicios =
    estadisticas?.totalEjercicios ??
    0;


  const totalSeries =
    estadisticas?.totalSeries ??
    0;


  const volumenTotal =
    estadisticas?.volumenTotal ??
    0;


  const duracionTotalMinutos =
    estadisticas?.duracionTotalMinutos ??
    0;


  const promedioSeries =
    totalEntrenamientos > 0
      ? totalSeries /
        totalEntrenamientos
      : 0;


  const promedioEjercicios =
    totalEntrenamientos > 0
      ? totalEjercicios /
        totalEntrenamientos
      : 0;


  const promedioDuracion =
    totalEntrenamientos > 0
      ? duracionTotalMinutos /
        totalEntrenamientos
      : 0;


  const volumenMedio =
    totalEntrenamientos > 0
      ? volumenTotal /
        totalEntrenamientos
      : 0;


  const horasTotales =
    duracionTotalMinutos /
    60;


  /*
   * FORMATO
   */

  const formatearNumero = (
    valor: number
  ) => {

    return Math.round(
      valor
    ).toLocaleString(
      'es-ES'
    );

  };


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


  const colorEstado = (
    estado: string
  ) => {

    if (
      estado === 'MEJORA'
    ) {

      return '#35D07F';
    }


    if (
      estado === 'BAJA'
    ) {

      return '#FF6B6B';
    }


    return '#A6B0BA';
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

              FITTRACK

            </Text>


            <Text
              style={
                styles.title
              }
            >

              Progreso

            </Text>

          </View>

        </View>


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

            TU EVOLUCIÓN

          </Text>


          <Text
            style={
              styles.heroTitle
            }
          >

            Cada sesión cuenta

          </Text>


          <Text
            style={
              styles.heroText
            }
          >

            Sigue tus entrenamientos y comprueba si tus marcas están mejorando con el tiempo.

          </Text>

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

                  Analizando tu progreso...

                </Text>

              </View>

            )
            : (

              <>


                {/* RESUMEN GENERAL */}

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

                    Resumen general

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
                        totalEntrenamientos
                      }

                    </Text>


                    <Text
                      style={
                        styles.statLabel
                      }
                    >

                      Entrenamientos

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
                        horasTotales.toFixed(
                          1
                        )
                      } h

                    </Text>


                    <Text
                      style={
                        styles.statLabel
                      }
                    >

                      Tiempo entrenando

                    </Text>

                  </View>

                </View>


                {/* PROMEDIOS */}

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

                    Por entrenamiento

                  </Text>

                </View>


                <View
                  style={
                    styles.detailCard
                  }
                >

                  <View
                    style={
                      styles.detailRow
                    }
                  >

                    <View
                      style={
                        styles.detailInfo
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >

                        Series de media

                      </Text>


                      <Text
                        style={
                          styles.detailText
                        }
                      >

                        Trabajo realizado en cada sesión

                      </Text>

                    </View>


                    <Text
                      style={
                        styles.detailValue
                      }
                    >

                      {
                        promedioSeries.toFixed(
                          1
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
                      styles.detailRow
                    }
                  >

                    <View
                      style={
                        styles.detailInfo
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >

                        Ejercicios de media

                      </Text>


                      <Text
                        style={
                          styles.detailText
                        }
                      >

                        Ejercicios registrados por sesión

                      </Text>

                    </View>


                    <Text
                      style={
                        styles.detailValue
                      }
                    >

                      {
                        promedioEjercicios.toFixed(
                          1
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
                      styles.detailRow
                    }
                  >

                    <View
                      style={
                        styles.detailInfo
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >

                        Duración media

                      </Text>


                      <Text
                        style={
                          styles.detailText
                        }
                      >

                        Minutos por entrenamiento

                      </Text>

                    </View>


                    <Text
                      style={
                        styles.detailValue
                      }
                    >

                      {
                        formatearNumero(
                          promedioDuracion
                        )
                      } min

                    </Text>

                  </View>


                  <View
                    style={
                      styles.separator
                    }
                  />


                  <View
                    style={
                      styles.detailRow
                    }
                  >

                    <View
                      style={
                        styles.detailInfo
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >

                        Volumen medio

                      </Text>


                      <Text
                        style={
                          styles.detailText
                        }
                      >

                        Kg movidos por sesión

                      </Text>

                    </View>


                    <Text
                      style={
                        styles.detailValue
                      }
                    >

                      {
                        formatearNumero(
                          volumenMedio
                        )
                      }

                    </Text>

                  </View>

                </View>


                {/* EVOLUCIÓN POR EJERCICIO */}

                <View
                  style={
                    styles.progressHeader
                  }
                >

                  <Text
                    style={
                      styles.progressLabel
                    }
                  >

                    RENDIMIENTO

                  </Text>


                  <Text
                    style={
                      styles.progressTitle
                    }
                  >

                    Evolución por ejercicio

                  </Text>


                  <Text
                    style={
                      styles.progressText
                    }
                  >

                    Comparamos el peso máximo de tus dos últimas sesiones del mismo ejercicio.

                  </Text>

                </View>


                {
                  ejercicios.length === 0
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

                          Todavía no hay ejercicios

                        </Text>


                        <Text
                          style={
                            styles.emptyText
                          }
                        >

                          Cuando registres ejercicios en tus entrenamientos aparecerán aquí.

                        </Text>

                      </View>

                    )
                    : (

                      ejercicios.map(
                        ejercicio => {

                          const progreso =
                            ejercicio.progreso;


                          return (

                            <Pressable
                              key={
                                `${ejercicio.catalogoEjercicioId ?? 'manual'}-${ejercicio.id}`
                              }

                              style={({
                                pressed
                              }) => [
                                styles.exerciseCard,

                                pressed &&
                                  styles.buttonPressed,
                              ]}

                              onPress={() =>
                                router.push({
                                  pathname: '/progreso-ejercicio',
                                  params: {
                                    ejercicioId:
                                      ejercicio.id.toString(),
                                    nombre:
                                      ejercicio.nombre,
                                  },
                                })
                              }
                            >

                              <View
                                style={
                                  styles.exerciseHeader
                                }
                              >

                                <View
                                  style={
                                    styles.exerciseHeaderInfo
                                  }
                                >

                                  <Text
                                    style={
                                      styles.exerciseName
                                    }
                                  >

                                    {
                                      ejercicio.nombre
                                    }

                                  </Text>


                                  <Text
                                    style={
                                      styles.exerciseSubtitle
                                    }
                                  >

                                    {
                                      progreso
                                        ? 'Últimas 2 sesiones'
                                        : 'Sin comparación todavía'
                                    }

                                  </Text>

                                </View>


                                {
                                  progreso && (

                                    <View
                                      style={[
                                        styles.statusBadge,
                                        {
                                          borderColor:
                                            colorEstado(
                                              progreso.estado
                                            ),
                                        },
                                      ]}
                                    >

                                      <Text
                                        style={[
                                          styles.statusText,
                                          {
                                            color:
                                              colorEstado(
                                                progreso.estado
                                              ),
                                          },
                                        ]}
                                      >

                                        {
                                          progreso.estado
                                        }

                                      </Text>

                                    </View>

                                  )
                                }

                              </View>


                              {
                                progreso
                                  ? (

                                    <>

                                      <View
                                        style={
                                          styles.weightComparison
                                        }
                                      >

                                        <View
                                          style={
                                            styles.weightBlock
                                          }
                                        >

                                          <Text
                                            style={
                                              styles.weightLabel
                                            }
                                          >

                                            Anterior

                                          </Text>


                                          <Text
                                            style={
                                              styles.weightValue
                                            }
                                          >

                                            {
                                              formatearPeso(
                                                progreso.pesoMaximoAnterior
                                              )
                                            } kg

                                          </Text>


                                          <Text
                                            style={
                                              styles.dateText
                                            }
                                          >

                                            {
                                              formatearFecha(
                                                progreso.fechaAnterior
                                              )
                                            }

                                          </Text>

                                        </View>


                                        <Text
                                          style={
                                            styles.arrow
                                          }
                                        >

                                          →

                                        </Text>


                                        <View
                                          style={
                                            styles.weightBlock
                                          }
                                        >

                                          <Text
                                            style={
                                              styles.weightLabel
                                            }
                                          >

                                            Actual

                                          </Text>


                                          <Text
                                            style={
                                              styles.weightValue
                                            }
                                          >

                                            {
                                              formatearPeso(
                                                progreso.pesoMaximoActual
                                              )
                                            } kg

                                          </Text>


                                          <Text
                                            style={
                                              styles.dateText
                                            }
                                          >

                                            {
                                              formatearFecha(
                                                progreso.fechaActual
                                              )
                                            }

                                          </Text>

                                        </View>

                                      </View>


                                      <View
                                        style={
                                          styles.changeRow
                                        }
                                      >

                                        <View>

                                          <Text
                                            style={
                                              styles.changeLabel
                                            }
                                          >

                                            Diferencia

                                          </Text>


                                          <Text
                                            style={[
                                              styles.changeValue,
                                              {
                                                color:
                                                  colorEstado(
                                                    progreso.estado
                                                  ),
                                              },
                                            ]}
                                          >

                                            {
                                              progreso.diferenciaPeso > 0
                                                ? '+'
                                                : ''
                                            }

                                            {
                                              formatearPeso(
                                                progreso.diferenciaPeso
                                              )
                                            } kg

                                          </Text>

                                        </View>


                                        <View
                                          style={
                                            styles.changeRight
                                          }
                                        >

                                          <Text
                                            style={
                                              styles.changeLabel
                                            }
                                          >

                                            Cambio

                                          </Text>


                                          <Text
                                            style={[
                                              styles.changeValue,
                                              {
                                                color:
                                                  colorEstado(
                                                    progreso.estado
                                                  ),
                                              },
                                            ]}
                                          >

                                            {
                                              progreso.porcentajeCambio > 0
                                                ? '+'
                                                : ''
                                            }

                                            {
                                              progreso.porcentajeCambio.toFixed(
                                                2
                                              )
                                            } %

                                          </Text>

                                        </View>

                                      </View>

                                    </>

                                  )
                                  : (

                                    <View
                                      style={
                                        styles.noProgressBox
                                      }
                                    >

                                      <Text
                                        style={
                                          styles.noProgressText
                                        }
                                      >

                                        Registra este mismo ejercicio en otra sesión para empezar a medir tu evolución.

                                      </Text>

                                    </View>

                                  )
                              }

                            </Pressable>

                          );

                        }
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
                      styles.refreshButtonPressed,

                  ]}

                  onPress={
                    cargarDatos
                  }

                >

                  <Text
                    style={
                      styles.refreshButtonText
                    }
                  >

                    Actualizar progreso

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

      paddingBottom: 45,

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
        '#747E89',

      fontSize: 10,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    heroTitle: {

      color:
        '#FFFFFF',

      fontSize: 27,

      fontWeight:
        '900',

      marginTop: 9,

    },


    heroText: {

      color:
        '#8D96A0',

      fontSize: 14,

      lineHeight: 21,

      marginTop: 7,

    },


    loading: {

      minHeight: 300,

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


    sectionHeader: {

      marginTop: 28,

      marginBottom: 13,

    },


    sectionTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '800',

    },


    statsRow: {

      flexDirection:
        'row',

      gap: 12,

      marginBottom: 12,

    },


    statCard: {

      flex: 1,

      minHeight: 110,

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

      fontSize: 30,

      fontWeight:
        '900',

    },


    statValueSmall: {

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

    },


    statLabel: {

      color:
        '#7D8791',

      fontSize: 12,

      marginTop: 6,

    },


    detailCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 18,

    },


    detailRow: {

      minHeight: 82,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      gap: 14,

    },


    detailInfo: {

      flex: 1,

    },


    detailLabel: {

      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '800',

    },


    detailText: {

      color:
        '#747E89',

      fontSize: 11,

      marginTop: 4,

    },


    detailValue: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '900',

    },


    separator: {

      height: 1,

      backgroundColor:
        '#252D36',

    },


    progressHeader: {

      marginTop: 32,

      marginBottom: 14,

    },


    progressLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    progressTitle: {

      color:
        '#FFFFFF',

      fontSize: 22,

      fontWeight:
        '900',

      marginTop: 7,

    },


    progressText: {

      color:
        '#7D8791',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 6,

    },


    exerciseCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 18,

      marginBottom: 12,

    },


    exerciseHeader: {

      flexDirection:
        'row',

      alignItems:
        'flex-start',

      justifyContent:
        'space-between',

      gap: 12,

    },


    exerciseHeaderInfo: {

      flex: 1,

    },


    exerciseName: {

      color:
        '#FFFFFF',

      fontSize: 17,

      fontWeight:
        '900',

      lineHeight: 23,

    },


    exerciseSubtitle: {

      color:
        '#747E89',

      fontSize: 11,

      marginTop: 5,

    },


    statusBadge: {

      borderWidth: 1,

      borderRadius: 999,

      paddingHorizontal: 10,

      paddingVertical: 6,

    },


    statusText: {

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing: 1,

    },


    weightComparison: {

      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 22,

    },


    weightBlock: {

      flex: 1,

    },


    weightLabel: {

      color:
        '#717A84',

      fontSize: 10,

      fontWeight:
        '700',

      textTransform:
        'uppercase',

      letterSpacing: 1,

    },


    weightValue: {

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

      marginTop: 5,

    },


    dateText: {

      color:
        '#68727D',

      fontSize: 10,

      marginTop: 4,

    },


    arrow: {

      color:
        '#717A84',

      fontSize: 24,

      fontWeight:
        '800',

      marginHorizontal: 10,

    },


    changeRow: {

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      borderTopWidth: 1,

      borderTopColor:
        '#252D36',

      marginTop: 18,

      paddingTop: 16,

    },


    changeRight: {

      alignItems:
        'flex-end',

    },


    changeLabel: {

      color:
        '#717A84',

      fontSize: 10,

      fontWeight:
        '700',

      textTransform:
        'uppercase',

      letterSpacing: 1,

    },


    changeValue: {

      fontSize: 17,

      fontWeight:
        '900',

      marginTop: 5,

    },


    noProgressBox: {

      backgroundColor:
        '#11171D',

      borderRadius: 14,

      padding: 14,

      marginTop: 16,

    },


    noProgressText: {

      color:
        '#7D8791',

      fontSize: 12,

      lineHeight: 18,

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
        '800',

    },


    emptyText: {

      color:
        '#7D8791',

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

      marginTop: 18,

    },


    refreshButtonPressed: {

      opacity: 0.65,

    },


    refreshButtonText: {

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '800',

    },

  });