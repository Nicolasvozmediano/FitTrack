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


type Entrenamiento = {
  id: number;
  nombre: string;
  fecha: string | null;
  duracionMinutos: number | null;
};


export default function Entrenamientos() {

  const [
    entrenamientos,
    setEntrenamientos,
  ] =
    useState<Entrenamiento[]>([]);


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
   * CARGAR ENTRENAMIENTOS
   */

  const cargarEntrenamientos =
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
            `${API_URL}/api/entrenamientos`,
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
            'Error cargando entrenamientos:',
            response.status
          );

          return;
        }


        const data:
          Entrenamiento[] =
            await response.json();


        const ordenados =
          [...data].sort(
            (a, b) => {

              if (
                !a.fecha &&
                !b.fecha
              ) {
                return b.id - a.id;
              }


              if (!a.fecha) {
                return 1;
              }


              if (!b.fecha) {
                return -1;
              }


              const comparacionFecha =
                b.fecha.localeCompare(
                  a.fecha
                );


              if (
                comparacionFecha !== 0
              ) {
                return comparacionFecha;
              }


              return b.id - a.id;
            }
          );


        setEntrenamientos(
          ordenados
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

      cargarEntrenamientos();

    }, [])

  );


  /*
   * FORMATEAR FECHA
   */

  const formatearFecha = (
    fecha: string | null
  ) => {

    if (!fecha) {
      return 'Sin fecha';
    }


    const partes =
      fecha.split('-');


    if (
      partes.length !== 3
    ) {
      return fecha;
    }


    return (
      `${partes[2]}/` +
      `${partes[1]}/` +
      `${partes[0]}`
    );

  };


  /*
   * ABRIR ENTRENAMIENTO
   */

  const abrirEntrenamiento = (
    entrenamiento: Entrenamiento
  ) => {

    router.push({

      pathname:
        '/detalle-entrenamiento',

      params: {

        id:
          entrenamiento.id.toString(),

        nombre:
          entrenamiento.nombre,

      },

    });

  };


  /*
   * ELIMINAR ENTRENAMIENTO
   */

  const eliminarEntrenamiento =
    async (
      entrenamiento: Entrenamiento
    ) => {

      try {

        setEliminandoId(
          entrenamiento.id
        );


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
            `${API_URL}/api/entrenamientos/${entrenamiento.id}`,
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

          console.log(
            'Error eliminando entrenamiento:',
            response.status
          );


          Alert.alert(
            'No se pudo eliminar',
            'Ha ocurrido un problema al eliminar el entrenamiento.'
          );

          return;
        }


        setEntrenamientos(
          actuales =>
            actuales.filter(
              item =>
                item.id !==
                entrenamiento.id
            )
        );


      } catch (error) {

        console.log(
          'Error eliminando entrenamiento:',
          error
        );


        Alert.alert(
          'Error de conexión',
          'No se ha podido conectar con el servidor.'
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

  const confirmarEliminar = (
    entrenamiento: Entrenamiento
  ) => {

    Alert.alert(
      'Eliminar entrenamiento',
      `¿Seguro que quieres eliminar "${entrenamiento.nombre}"?\n\nTambién se eliminarán sus ejercicios y series.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            eliminarEntrenamiento(
              entrenamiento
            ),
        },
      ]
    );

  };


  /*
   * TARJETA DE ENTRENAMIENTO
   */

  const renderEntrenamiento = ({
    item,
  }: {
    item: Entrenamiento;
  }) => {

    const eliminando =
      eliminandoId ===
      item.id;


    return (

      <View
        style={
          styles.card
        }
      >

        <View
          style={
            styles.cardTop
          }
        >

          <Pressable

            style={({
              pressed
            }) => [

              styles.cardMainButton,

              pressed &&
                styles.cardPressed,

            ]}

            onPress={() =>
              abrirEntrenamiento(
                item
              )
            }

            disabled={
              eliminando
            }

          >

            <View
              style={
                styles.cardTitleContainer
              }
            >

              <Text
                style={
                  styles.cardTitle
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
              confirmarEliminar(
                item
              )
            }

            disabled={
              eliminando
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


        <Pressable

          style={({
            pressed
          }) => [

            styles.cardInfoButton,

            pressed &&
              styles.cardPressed,

          ]}

          onPress={() =>
            abrirEntrenamiento(
              item
            )
          }

          disabled={
            eliminando
          }

        >

          <View
            style={
              styles.cardInfo
            }
          >

            <View
              style={
                styles.infoBlock
              }
            >

              <Text
                style={
                  styles.infoLabel
                }
              >

                FECHA

              </Text>


              <Text
                style={
                  styles.infoValue
                }
              >

                {
                  formatearFecha(
                    item.fecha
                  )
                }

              </Text>

            </View>


            <View
              style={
                styles.infoBlock
              }
            >

              <Text
                style={
                  styles.infoLabel
                }
              >

                DURACIÓN

              </Text>


              <Text
                style={
                  styles.infoValue
                }
              >

                {
                  item
                    .duracionMinutos
                    != null

                    ? `${item.duracionMinutos} min`

                    : '—'
                }

              </Text>

            </View>

          </View>

        </Pressable>

      </View>

    );

  };


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
              pressed,
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
              styles.headerText
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

              Entrenamientos

            </Text>

          </View>

        </View>


        <Text
          style={
            styles.subtitle
          }
        >

          Tu historial de sesiones

        </Text>


        {/* NUEVO ENTRENAMIENTO */}

        <Pressable

          style={({
            pressed,
          }) => [

            styles.newButton,

            pressed &&
              styles.newButtonPressed,

          ]}

          onPress={() =>
            router.push(
              '/nuevo-entrenamiento'
            )
          }

        >

          <Text
            style={
              styles.newButtonPlus
            }
          >

            +

          </Text>


          <Text
            style={
              styles.newButtonText
            }
          >

            Nuevo entrenamiento

          </Text>

        </Pressable>


        {/* CONTENIDO */}

        {
          cargando
            ? (

              <View
                style={
                  styles.loadingContainer
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

                  Cargando entrenamientos...

                </Text>

              </View>

            )
            : entrenamientos.length === 0
              ? (

                <View
                  style={
                    styles.emptyContainer
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

                    Todavía no hay entrenamientos

                  </Text>


                  <Text
                    style={
                      styles.emptyText
                    }
                  >

                    Registra tu primera sesión para empezar a seguir tu progreso.

                  </Text>

                </View>

              )
              : (

                <FlatList

                  data={
                    entrenamientos
                  }

                  keyExtractor={(
                    item
                  ) =>
                    item.id.toString()
                  }

                  renderItem={
                    renderEntrenamiento
                  }

                  contentContainerStyle={
                    styles.list
                  }

                  showsVerticalScrollIndicator={
                    false
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

      flexDirection: 'row',

      alignItems: 'center',

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

      alignItems: 'center',

      justifyContent:
        'center',

    },


    buttonPressed: {

      opacity: 0.65,

    },


    backText: {

      color: '#FFFFFF',

      fontSize: 32,

      lineHeight: 34,

    },


    headerText: {

      marginLeft: 16,

    },


    smallTitle: {

      color: '#717A84',

      fontSize: 11,

      fontWeight: '800',

      letterSpacing: 2,

    },


    title: {

      color: '#FFFFFF',

      fontSize: 30,

      fontWeight: '900',

      marginTop: 2,

    },


    subtitle: {

      color: '#7D8791',

      fontSize: 15,

      marginTop: 20,

    },


    newButton: {

      height: 58,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 17,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      marginTop: 22,

      marginBottom: 22,

    },


    newButtonPressed: {

      opacity: 0.8,

    },


    newButtonPlus: {

      color: '#0B0F14',

      fontSize: 25,

      marginRight: 9,

    },


    newButtonText: {

      color: '#0B0F14',

      fontSize: 15,

      fontWeight: '800',

    },


    loadingContainer: {

      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingBottom: 80,

    },


    loadingText: {

      color: '#747E89',

      fontSize: 13,

      marginTop: 14,

    },


    list: {

      paddingBottom: 40,

    },


    card: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      padding: 19,

      borderWidth: 1,

      borderColor:
        '#252D36',

      marginBottom: 12,

    },


    cardPressed: {

      opacity: 0.6,

    },


    cardTop: {

      flexDirection: 'row',

      alignItems: 'center',

    },


    cardMainButton: {

      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      minHeight: 40,

    },


    cardTitleContainer: {

      flex: 1,

      paddingRight: 8,

    },


    cardTitle: {

      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '800',

    },


    arrow: {

      color: '#69737D',

      fontSize: 30,

      marginRight: 8,

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

      alignItems: 'center',

      justifyContent:
        'center',

      marginLeft: 4,

    },


    deleteButtonPressed: {

      opacity: 0.6,

    },


    deleteIcon: {

      color: '#FF6262',

      fontSize: 27,

      lineHeight: 29,

      fontWeight: '500',

    },


    cardInfoButton: {

      marginTop: 4,

    },


    cardInfo: {

      flexDirection: 'row',

      marginTop: 14,

    },


    infoBlock: {

      flex: 1,

    },


    infoLabel: {

      color: '#626D78',

      fontSize: 10,

      fontWeight: '800',

      letterSpacing: 1.5,

    },


    infoValue: {

      color: '#B8C0C8',

      fontSize: 13,

      fontWeight: '600',

      marginTop: 5,

    },


    emptyContainer: {

      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 25,

      paddingBottom: 100,

    },


    emptyIcon: {

      width: 62,

      height: 62,

      borderRadius: 20,

      backgroundColor:
        '#151B22',

      borderWidth: 1,

      borderColor:
        '#252D36',

      alignItems: 'center',

      justifyContent:
        'center',

      marginBottom: 20,

    },


    emptyIconText: {

      color: '#FFFFFF',

      fontSize: 30,

    },


    emptyTitle: {

      color: '#FFFFFF',

      fontSize: 19,

      fontWeight: '800',

      textAlign: 'center',

    },


    emptyText: {

      color: '#747E89',

      fontSize: 14,

      textAlign: 'center',

      marginTop: 8,

      lineHeight: 21,

    },

  });