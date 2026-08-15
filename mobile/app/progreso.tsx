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


export default function Progreso() {

  const [
    estadisticas,
    setEstadisticas,
  ] =
    useState<Estadisticas | null>(
      null
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
   * CARGAR ESTADÍSTICAS
   */

  const cargarEstadisticas =
    async () => {

      try {

        setCargando(true);


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/entrenamientos/estadisticas`,
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


        if (!response.ok) {

          console.log(
            'Error cargando progreso:',
            response.status
          );

          return;
        }


        const data:
          Estadisticas =
            await response.json();


        setEstadisticas(
          data
        );


      } catch (error) {

        console.log(
          'Error conectando con backend:',
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

      cargarEstadisticas();

    }, [])

  );


  /*
   * CÁLCULOS
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

            Aquí podrás ver cómo está evolucionando tu entrenamiento con el tiempo.

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

                    <View>

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

                    <View>

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

                    <View>

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

                    <View>

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


                {/* PRÓXIMA FUNCIÓN */}

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

                    PRÓXIMAMENTE

                  </Text>


                  <Text
                    style={
                      styles.nextTitle
                    }
                  >

                    Evolución por ejercicio

                  </Text>


                  <Text
                    style={
                      styles.nextText
                    }
                  >

                    El siguiente paso será comparar tus marcas, volumen y rendimiento entre sesiones.

                  </Text>

                </View>


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
                    cargarEstadisticas
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


    nextCard: {

      backgroundColor:
        '#11171D',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

      marginTop: 28,

    },


    nextLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    nextTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '900',

      marginTop: 8,

    },


    nextText: {

      color:
        '#7D8791',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 7,

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