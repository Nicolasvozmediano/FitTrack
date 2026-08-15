import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
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


type Estadisticas = {
  totalEntrenamientos: number;
  totalEjercicios: number;
  totalSeries: number;
  volumenTotal: number;
  duracionTotalMinutos: number;
};


export default function Home() {

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


  useEffect(() => {

    cargarEstadisticas();

  }, []);


  /*
   * CARGAR ESTADÍSTICAS
   */

  const cargarEstadisticas =
    async () => {

      try {

        setCargando(true);


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
            'Error cargando estadísticas:',
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
   * CERRAR SESIÓN
   */

  const cerrarSesion =
    async () => {

      await AsyncStorage.removeItem(
        'fittrack_token'
      );


      router.replace('/');

    };


  /*
   * NAVEGACIÓN
   */

  const abrirEntrenamientos =
    () => {

      router.push(
        '/entrenamientos'
      );

    };


  const abrirProgreso =
    () => {

      router.push(
        '/progreso'
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

          <View>

            <Text
              style={
                styles.smallText
              }
            >

              BUENOS DÍAS

            </Text>


            <Text
              style={
                styles.title
              }
            >

              FitTrack

            </Text>

          </View>


          <Pressable

            style={({
              pressed
            }) => [

              styles.avatar,

              pressed &&
                styles.pressed,

            ]}

            onPress={
              cerrarSesion
            }

          >

            <Text
              style={
                styles.avatarText
              }
            >

              FT

            </Text>

          </Pressable>

        </View>


        {/* TARJETA PRINCIPAL */}

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

            TU ENTRENAMIENTO

          </Text>


          <Text
            style={
              styles.heroTitle
            }
          >

            ¿Entrenamos?

          </Text>


          <Text
            style={
              styles.heroText
            }
          >

            Registra tu sesión y sigue tu progreso.

          </Text>


          <Pressable

            style={({
              pressed
            }) => [

              styles.primaryButton,

              pressed &&
                styles.pressedButton,

            ]}

            onPress={
              abrirEntrenamientos
            }

          >

            <Text
              style={
                styles.primaryButtonText
              }
            >

              Empezar entrenamiento

            </Text>

          </Pressable>

        </View>


        {/* RESUMEN */}

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

            Resumen

          </Text>


          <Pressable

            onPress={
              cargarEstadisticas
            }

            hitSlop={
              10
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

        </View>


        {
          cargando
            ? (

              <View
                style={
                  styles.loadingBox
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

              </View>

            )

            : (

              <>

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
                        estadisticas
                          ?.totalEntrenamientos ??
                        0
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
                        estadisticas
                          ?.totalSeries ??
                        0
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
                        estadisticas
                          ?.totalEjercicios ??
                        0
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
                        Math.round(
                          estadisticas
                            ?.volumenTotal ??
                          0
                        ).toLocaleString(
                          'es-ES'
                        )
                      }

                    </Text>


                    <Text
                      style={
                        styles.statLabel
                      }
                    >

                      Volumen total

                    </Text>

                  </View>

                </View>

              </>

            )
        }


        {/* MENÚ */}

        <View
          style={
            styles.menu
          }
        >


          {/* ENTRENAMIENTOS */}

          <Pressable

            style={({
              pressed
            }) => [

              styles.menuItem,

              pressed &&
                styles.menuItemPressed,

            ]}

            onPress={
              abrirEntrenamientos
            }

          >

            <View
              style={
                styles.menuTextContainer
              }
            >

              <Text
                style={
                  styles.menuTitle
                }
              >

                Entrenamientos

              </Text>


              <Text
                style={
                  styles.menuText
                }
              >

                Consulta y registra tus sesiones

              </Text>

            </View>


            <Text
              style={
                styles.arrow
              }
            >

              ›

            </Text>

          </Pressable>


          {/* PROGRESO */}

          <Pressable

            style={({
              pressed
            }) => [

              styles.menuItem,

              pressed &&
                styles.menuItemPressed,

            ]}

            onPress={
              abrirProgreso
            }

          >

            <View
              style={
                styles.menuTextContainer
              }
            >

              <Text
                style={
                  styles.menuTitle
                }
              >

                Progreso

              </Text>


              <Text
                style={
                  styles.menuText
                }
              >

                Comprueba cómo estás evolucionando

              </Text>

            </View>


            <Text
              style={
                styles.arrow
              }
            >

              ›

            </Text>

          </Pressable>


          {/* ESTADÍSTICAS */}

          <Pressable

            style={({
              pressed
            }) => [

              styles.menuItem,

              pressed &&
                styles.menuItemPressed,

            ]}

            onPress={() => {

              console.log(
                'Estadísticas pendiente'
              );

            }}

          >

            <View
              style={
                styles.menuTextContainer
              }
            >

              <Text
                style={
                  styles.menuTitle
                }
              >

                Estadísticas

              </Text>


              <Text
                style={
                  styles.menuText
                }
              >

                Volumen, series y rendimiento

              </Text>

            </View>


            <Text
              style={
                styles.arrow
              }
            >

              ›

            </Text>

          </Pressable>

        </View>

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

      paddingBottom: 40,

    },


    header: {

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

    },


    smallText: {

      color:
        '#717A84',

      fontSize: 12,

      fontWeight:
        '700',

      letterSpacing: 2,

    },


    title: {

      color:
        '#FFFFFF',

      fontSize: 34,

      fontWeight:
        '900',

      marginTop: 4,

    },


    avatar: {

      width: 48,

      height: 48,

      borderRadius: 16,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    avatarText: {

      color:
        '#0B0F14',

      fontSize: 17,

      fontWeight:
        '900',

    },


    hero: {

      backgroundColor:
        '#151B22',

      borderRadius: 24,

      padding: 24,

      marginTop: 26,

      borderWidth: 1,

      borderColor:
        '#252D36',

    },


    heroLabel: {

      color:
        '#747E89',

      fontSize: 11,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    heroTitle: {

      color:
        '#FFFFFF',

      fontSize: 30,

      fontWeight:
        '900',

      marginTop: 10,

    },


    heroText: {

      color:
        '#8D96A0',

      fontSize: 15,

      marginTop: 8,

      lineHeight: 22,

    },


    primaryButton: {

      backgroundColor:
        '#FFFFFF',

      height: 54,

      borderRadius: 16,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 22,

    },


    primaryButtonText: {

      color:
        '#0B0F14',

      fontWeight:
        '800',

      fontSize: 15,

    },


    sectionHeader: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginTop: 26,

      marginBottom: 12,

    },


    sectionTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '800',

    },


    refreshText: {

      color:
        '#8D96A0',

      fontSize: 13,

      fontWeight:
        '600',

    },


    loadingBox: {

      height: 100,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    statsRow: {

      flexDirection:
        'row',

      gap: 12,

      marginBottom: 12,

    },


    statCard: {

      flex: 1,

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      padding: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

    },


    statValue: {

      color:
        '#FFFFFF',

      fontSize: 28,

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

      marginTop: 5,

    },


    menu: {

      marginTop: 6,

      gap: 10,

    },


    menuItem: {

      minHeight: 72,

      backgroundColor:
        '#11171D',

      borderRadius: 18,

      paddingHorizontal: 18,

      paddingVertical: 15,

      borderWidth: 1,

      borderColor:
        '#202830',

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

    },


    menuItemPressed: {

      opacity: 0.65,

    },


    menuTextContainer: {

      flex: 1,

      paddingRight: 10,

    },


    menuTitle: {

      color:
        '#FFFFFF',

      fontSize: 16,

      fontWeight:
        '700',

    },


    menuText: {

      color:
        '#747E89',

      fontSize: 12,

      marginTop: 4,

    },


    arrow: {

      color:
        '#69737D',

      fontSize: 28,

      fontWeight:
        '300',

    },


    pressed: {

      opacity: 0.7,

    },


    pressedButton: {

      opacity: 0.8,

    },

  });