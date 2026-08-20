import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';


const API_URL =
  'http://192.168.1.128:8080';


type Ejercicio = {
  id: number;
  nombre: string;
  catalogoEjercicioId?: number | null;
};


export default function DetalleEntrenamiento() {

  const {
    id,
    nombre,
  } =
    useLocalSearchParams<{
      id?: string;
      nombre?: string;
    }>();


  const [
    ejercicios,
    setEjercicios,
  ] =
    useState<Ejercicio[]>([]);


  const [
    cargando,
    setCargando,
  ] =
    useState(true);


  const [
    eliminandoId,
    setEliminandoId,
  ] =
    useState<number | null>(
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
   * CARGAR EJERCICIOS
   */

  const cargarEjercicios =
    async () => {

      if (!id) {
        return;
      }


      try {

        setCargando(true);


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/ejercicios/entrenamiento/${id}`,
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
            'Error cargando ejercicios:',
            response.status
          );

          return;
        }


        const data:
          Ejercicio[] =
            await response.json();


        setEjercicios(
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
   * RECARGAR AL VOLVER A LA PANTALLA
   */

  useFocusEffect(

    useCallback(() => {

      if (id) {
        cargarEjercicios();
      }

    }, [id])

  );


  /*
   * ABRIR CATÁLOGO
   */

  const abrirNuevoEjercicio =
    () => {

      if (!id) {
        return;
      }


      router.push({

        pathname:
          '/nuevo-ejercicio',

        params: {

          entrenamientoId:
            id,

          entrenamientoNombre:
            nombre ??
            'Entrenamiento',

        },

      });

    };


  /*
   * ABRIR ANÁLISIS CON IA
   */

  const abrirAnalisisIa =
    () => {

      if (!id) {
        return;
      }


      router.push({

        pathname:
          '/analisis-entrenamiento' as any,

        params: {

          entrenamientoId:
            id,

          entrenamientoNombre:
            nombre ??
            'Entrenamiento',

        },

      });

    };


  /*
   * ABRIR EJERCICIO
   */

  const abrirEjercicio = (
    ejercicio: Ejercicio
  ) => {

    router.push({

      pathname:
        '/detalle-ejercicio',

      params: {

        ejercicioId:
          ejercicio.id.toString(),

        ejercicioNombre:
          ejercicio.nombre,

        entrenamientoNombre:
          nombre ??
          'Entrenamiento',

      },

    });

  };


  /*
   * ELIMINAR EJERCICIO
   */

  const eliminarEjercicio =
    async (
      ejercicio: Ejercicio
    ) => {

      try {

        setEliminandoId(
          ejercicio.id
        );


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/ejercicios/${ejercicio.id}`,
            {
              method: 'DELETE',

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

          const mensaje =
            await response.text();


          console.log(
            'Error eliminando ejercicio:',
            response.status,
            mensaje
          );


          Alert.alert(
            'No se pudo eliminar',
            mensaje ||
              'Ha ocurrido un problema al eliminar el ejercicio.'
          );

          return;
        }


        /*
         * Lo quitamos inmediatamente
         * de la pantalla.
         */

        setEjercicios(
          actuales =>
            actuales.filter(
              item =>
                item.id !==
                ejercicio.id
            )
        );


      } catch (error) {

        console.log(
          'Error eliminando ejercicio:',
          error
        );


        Alert.alert(
          'Error de conexión',
          'No se ha podido conectar con FitTrack.'
        );


      } finally {

        setEliminandoId(
          null
        );
      }

    };


  /*
   * CONFIRMAR ELIMINACIÓN
   */

  const confirmarEliminarEjercicio =
    (
      ejercicio: Ejercicio
    ) => {

      Alert.alert(
        'Eliminar ejercicio',
        `¿Seguro que quieres eliminar "${ejercicio.nombre}" de este entrenamiento?\n\nTambién se eliminarán las series registradas en este ejercicio.`,
        [
          {
            text:
              'Cancelar',

            style:
              'cancel',
          },
          {
            text:
              'Eliminar',

            style:
              'destructive',

            onPress:
              () =>
                eliminarEjercicio(
                  ejercicio
                ),
          },
        ]
      );

    };


  /*
   * TARJETA DE EJERCICIO
   */

  const renderEjercicio = ({
    item,
  }: {
    item: Ejercicio;
  }) => {

    const eliminando =
      eliminandoId ===
      item.id;


    return (

      <View
        style={
          styles.exerciseCard
        }
      >

        <Pressable

          style={({
            pressed
          }) => [

            styles.exerciseMain,

            pressed &&
              styles.exerciseCardPressed,

          ]}

          onPress={() =>
            abrirEjercicio(
              item
            )
          }

          disabled={
            eliminando
          }

        >

          <View
            style={
              styles.exerciseInfo
            }
          >

            <Text
              style={
                styles.exerciseLabel
              }
            >

              EJERCICIO

            </Text>


            <Text
              style={
                styles.exerciseName
              }

              numberOfLines={
                2
              }
            >

              {item.nombre}

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


        <Pressable

          style={({
            pressed
          }) => [

            styles.deleteButton,

            pressed &&
              styles.deleteButtonPressed,

          ]}

          onPress={() =>
            confirmarEliminarEjercicio(
              item
            )
          }

          disabled={
            eliminando
          }

          hitSlop={
            8
          }

        >

          {
            eliminando
              ? (

                <ActivityIndicator
                  size="small"
                  color="#FF6262"
                />

              )
              : (

                <Text
                  style={
                    styles.deleteIcon
                  }
                >

                  ×

                </Text>

              )
          }

        </Pressable>

      </View>

    );

  };


  /*
   * ENTRENAMIENTO NO ENCONTRADO
   */

  if (!id) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

        <View
          style={
            styles.errorContainer
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

            style={
              styles.errorButton
            }

            onPress={() =>
              router.replace(
                '/entrenamientos'
              )
            }

          >

            <Text
              style={
                styles.errorButtonText
              }
            >

              Volver

            </Text>

          </Pressable>

        </View>

      </SafeAreaView>

    );

  }


  /*
   * PANTALLA
   */

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

              ENTRENAMIENTO

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
                nombre ??
                'Entrenamiento'
              }

            </Text>

          </View>

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

            TU SESIÓN

          </Text>


          <Text
            style={
              styles.heroTitle
            }
          >

            Ejercicios

          </Text>


          <Text
            style={
              styles.heroText
            }
          >

            Añade ejercicios y registra tus series.

          </Text>

        </View>


        {/* AÑADIR EJERCICIO */}

        <Pressable

          style={({
            pressed
          }) => [

            styles.newButton,

            pressed &&
              styles.newButtonPressed,

          ]}

          onPress={
            abrirNuevoEjercicio
          }

        >

          <Text
            style={
              styles.plus
            }
          >

            +

          </Text>


          <Text
            style={
              styles.newButtonText
            }
          >

            Añadir ejercicio

          </Text>

        </Pressable>


        {/* ANALIZAR ENTRENAMIENTO */}

        <Pressable

          style={({
            pressed
          }) => [

            styles.aiButton,

            pressed &&
              styles.aiButtonPressed,

            ejercicios.length === 0 &&
              styles.aiButtonDisabled,

          ]}

          onPress={
            abrirAnalisisIa
          }

          disabled={
            ejercicios.length === 0
          }

        >

          <View
            style={
              styles.aiIcon
            }
          >

            <Text
              style={
                styles.aiIconText
              }
            >

              ✦

            </Text>

          </View>


          <View
            style={
              styles.aiButtonInfo
            }
          >

            <Text
              style={
                styles.aiButtonLabel
              }
            >

              FITTRACK AI

            </Text>


            <Text
              style={
                styles.aiButtonText
              }
            >

              Analizar entrenamiento

            </Text>

          </View>


          <Text
            style={
              styles.aiArrow
            }
          >

            ›

          </Text>

        </Pressable>


        {/* CABECERA LISTA */}

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

            Ejercicios

          </Text>


          {
            !cargando && (

              <Text
                style={
                  styles.exerciseCount
                }
              >

                {ejercicios.length}

              </Text>

            )
          }

        </View>


        {/* CONTENIDO */}

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

                  Cargando ejercicios...

                </Text>

              </View>

            )
            : ejercicios.length === 0
              ? (

                <View
                  style={
                    styles.empty
                  }
                >

                  <View
                    style={
                      styles.emptyIcon
                    }
                  >

                    <Text
                      style={
                        styles.emptyIconText
                      }
                    >

                      +

                    </Text>

                  </View>


                  <Text
                    style={
                      styles.emptyTitle
                    }
                  >

                    Aún no hay ejercicios

                  </Text>


                  <Text
                    style={
                      styles.emptyText
                    }
                  >

                    Añade el primer ejercicio de esta sesión.

                  </Text>

                </View>

              )
              : (

                <FlatList

                  data={
                    ejercicios
                  }

                  keyExtractor={(
                    item
                  ) =>
                    item.id.toString()
                  }

                  renderItem={
                    renderEjercicio
                  }

                  showsVerticalScrollIndicator={
                    false
                  }

                  contentContainerStyle={
                    styles.list
                  }

                />

              )
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

      fontSize: 11,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    title: {

      color:
        '#FFFFFF',

      fontSize: 27,

      fontWeight:
        '900',

      marginTop: 2,

    },


    hero: {

      backgroundColor:
        '#151B22',

      borderRadius: 22,

      padding: 22,

      borderWidth: 1,

      borderColor:
        '#252D36',

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


    newButton: {

      height: 58,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 17,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 20,

      marginBottom: 12,

    },


    newButtonPressed: {

      opacity: 0.8,

    },


    plus: {

      color:
        '#0B0F14',

      fontSize: 25,

      marginRight: 9,

    },


    newButtonText: {

      color:
        '#0B0F14',

      fontSize: 15,

      fontWeight:
        '800',

    },


    aiButton: {

      minHeight: 76,

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#343E49',

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal: 15,

      paddingVertical: 12,

      marginBottom: 25,

    },


    aiButtonPressed: {

      opacity: 0.72,

    },


    aiButtonDisabled: {

      opacity: 0.4,

    },


    aiIcon: {

      width: 44,

      height: 44,

      borderRadius: 14,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 13,

    },


    aiIconText: {

      color:
        '#0B0F14',

      fontSize: 21,

      fontWeight:
        '900',

    },


    aiButtonInfo: {

      flex: 1,

    },


    aiButtonLabel: {

      color:
        '#747E89',

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing: 1.6,

    },


    aiButtonText: {

      color:
        '#FFFFFF',

      fontSize: 16,

      fontWeight:
        '900',

      marginTop: 4,

    },


    aiArrow: {

      color:
        '#69737D',

      fontSize: 29,

      marginLeft: 8,

    },


    sectionHeader: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 14,

    },


    sectionTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '800',

    },


    exerciseCount: {

      color:
        '#FFFFFF',

      backgroundColor:
        '#252D36',

      minWidth: 30,

      height: 30,

      borderRadius: 10,

      textAlign:
        'center',

      lineHeight: 30,

      fontSize: 13,

      fontWeight:
        '800',

    },


    loading: {

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingBottom: 80,

    },


    loadingText: {

      color:
        '#747E89',

      fontSize: 13,

      marginTop: 14,

    },


    list: {

      paddingBottom: 40,

    },


    exerciseCard: {

      minHeight: 78,

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 12,

      paddingVertical: 10,

      marginBottom: 11,

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    exerciseMain: {

      flex: 1,

      minHeight: 58,

      paddingLeft: 6,

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    exerciseCardPressed: {

      opacity: 0.65,

    },


    exerciseInfo: {

      flex: 1,

      paddingRight: 8,

    },


    exerciseLabel: {

      color:
        '#626D78',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 1.5,

    },


    exerciseName: {

      color:
        '#FFFFFF',

      fontSize: 17,

      fontWeight:
        '800',

      marginTop: 5,

    },


    arrow: {

      color:
        '#69737D',

      fontSize: 30,

      marginRight: 5,

    },


    deleteButton: {

      width: 40,

      height: 40,

      borderRadius: 12,

      backgroundColor:
        '#23181B',

      borderWidth: 1,

      borderColor:
        '#48282D',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginLeft: 5,

    },


    deleteButtonPressed: {

      opacity: 0.6,

    },


    deleteIcon: {

      color:
        '#FF6262',

      fontSize: 27,

      lineHeight: 29,

      fontWeight:
        '500',

    },


    empty: {

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingBottom: 100,

    },


    emptyIcon: {

      width: 60,

      height: 60,

      borderRadius: 20,

      backgroundColor:
        '#151B22',

      borderWidth: 1,

      borderColor:
        '#252D36',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginBottom: 18,

    },


    emptyIconText: {

      color:
        '#FFFFFF',

      fontSize: 28,

    },


    emptyTitle: {

      color:
        '#FFFFFF',

      fontSize: 19,

      fontWeight:
        '800',

    },


    emptyText: {

      color:
        '#747E89',

      fontSize: 14,

      marginTop: 8,

      textAlign:
        'center',

    },


    errorContainer: {

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 30,

    },


    errorTitle: {

      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '800',

      textAlign:
        'center',

    },


    errorButton: {

      backgroundColor:
        '#FFFFFF',

      paddingHorizontal: 30,

      paddingVertical: 15,

      borderRadius: 15,

      marginTop: 25,

    },


    errorButtonText: {

      color:
        '#0B0F14',

      fontWeight:
        '800',

    },

  });