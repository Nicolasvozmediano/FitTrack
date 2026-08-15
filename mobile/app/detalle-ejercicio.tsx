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
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';


const API_URL =
  'http://192.168.1.128:8080';


type Serie = {
  id: number;
  peso: number;
  repeticiones: number;
  fecha: string | null;
};


export default function DetalleEjercicio() {

  const {
    ejercicioId,
    ejercicioNombre,
    entrenamientoNombre,
  } =
    useLocalSearchParams<{
      ejercicioId?: string;
      ejercicioNombre?: string;
      entrenamientoNombre?: string;
    }>();


  const [
    series,
    setSeries,
  ] =
    useState<Serie[]>([]);


  const [
    peso,
    setPeso,
  ] =
    useState('');


  const [
    repeticiones,
    setRepeticiones,
  ] =
    useState('');


  const [
    cargando,
    setCargando,
  ] =
    useState(true);


  const [
    guardando,
    setGuardando,
  ] =
    useState(false);


  const [
    eliminandoId,
    setEliminandoId,
  ] =
    useState<number | null>(
      null
    );


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
   * CARGAR SERIES
   */

  const cargarSeries =
    async () => {

      if (!ejercicioId) {
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
            `${API_URL}/api/series/ejercicio/${ejercicioId}`,
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
            'Error cargando series:',
            response.status
          );

          return;
        }


        const data:
          Serie[] =
            await response.json();


        setSeries(data);


      } catch (error) {

        console.log(
          'Error cargando series:',
          error
        );


      } finally {

        setCargando(false);
      }

    };


  /*
   * RECARGAR AL VOLVER
   */

  useFocusEffect(

    useCallback(() => {

      if (ejercicioId) {
        cargarSeries();
      }

    }, [ejercicioId])

  );


  /*
   * GUARDAR SERIE
   */

  const guardarSerie =
    async () => {

      if (!ejercicioId) {

        Alert.alert(
          'Error',
          'No encontramos el ejercicio.'
        );

        return;
      }


      if (
        !peso.trim() ||
        !repeticiones.trim()
      ) {

        Alert.alert(
          'Faltan datos',
          'Introduce el peso y las repeticiones.'
        );

        return;
      }


      const pesoNumero =
        Number(
          peso.replace(',', '.')
        );


      const repeticionesNumero =
        Number(
          repeticiones
        );


      if (
        Number.isNaN(
          pesoNumero
        ) ||
        pesoNumero < 0
      ) {

        Alert.alert(
          'Peso incorrecto',
          'Introduce un peso válido.'
        );

        return;
      }


      if (
        Number.isNaN(
          repeticionesNumero
        ) ||
        repeticionesNumero <= 0
      ) {

        Alert.alert(
          'Repeticiones incorrectas',
          'Las repeticiones deben ser mayores que 0.'
        );

        return;
      }


      try {

        setGuardando(true);


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/series/ejercicio/${ejercicioId}`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  peso:
                    pesoNumero,

                  repeticiones:
                    repeticionesNumero,
                }),
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


          Alert.alert(
            'No se pudo guardar',
            mensaje ||
              'Ha ocurrido un error.'
          );

          return;
        }


        setPeso('');

        setRepeticiones('');


        await cargarSeries();


      } catch (error) {

        console.log(
          'Error guardando serie:',
          error
        );


        Alert.alert(
          'Error de conexión',
          'No se ha podido conectar con FitTrack.'
        );


      } finally {

        setGuardando(false);
      }

    };


  /*
   * ELIMINAR SERIE
   */

  const eliminarSerie =
    async (
      serie: Serie
    ) => {

      try {

        setEliminandoId(
          serie.id
        );


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/series/${serie.id}`,
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
            'Error eliminando serie:',
            response.status,
            mensaje
          );


          Alert.alert(
            'No se pudo eliminar',
            mensaje ||
              'Ha ocurrido un problema al eliminar la serie.'
          );

          return;
        }


        /*
         * La quitamos inmediatamente
         * de la pantalla.
         */

        setSeries(
          actuales =>
            actuales.filter(
              item =>
                item.id !==
                serie.id
            )
        );


      } catch (error) {

        console.log(
          'Error eliminando serie:',
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
   * CONFIRMACIÓN DE BORRADO
   */

  const confirmarEliminarSerie = (
    serie: Serie,
    numeroSerie: number
  ) => {

    Alert.alert(
      'Eliminar serie',
      `¿Quieres eliminar la serie ${numeroSerie}?\n\n${serie.peso} kg × ${serie.repeticiones} repeticiones`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            eliminarSerie(
              serie
            ),
        },
      ]
    );

  };


  /*
   * FECHA
   */

  const formatearFecha = (
    fecha: string | null
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


    return (
      `${partes[2]}/` +
      `${partes[1]}/` +
      `${partes[0]}`
    );

  };


  /*
   * TARJETA DE SERIE
   */

  const renderSerie = ({
    item,
    index,
  }: {
    item: Serie;
    index: number;
  }) => {

    const eliminando =
      eliminandoId ===
      item.id;


    return (

      <View
        style={
          styles.serieCard
        }
      >

        <View
          style={
            styles.serieNumber
          }
        >

          <Text
            style={
              styles.serieNumberText
            }
          >

            {index + 1}

          </Text>

        </View>


        <View
          style={
            styles.serieData
          }
        >

          <Text
            style={
              styles.serieValue
            }
          >

            {item.peso} kg

          </Text>


          <Text
            style={
              styles.serieLabel
            }
          >

            PESO

          </Text>

        </View>


        <View
          style={
            styles.serieData
          }
        >

          <Text
            style={
              styles.serieValue
            }
          >

            {item.repeticiones}

          </Text>


          <Text
            style={
              styles.serieLabel
            }
          >

            REPS

          </Text>

        </View>


        <View
          style={
            styles.serieRight
          }
        >

          <Text
            style={
              styles.dateText
            }
          >

            {
              formatearFecha(
                item.fecha
              )
            }

          </Text>


          <Pressable

            style={({
              pressed
            }) => [

              styles.deleteButton,

              pressed &&
                styles.deleteButtonPressed,

            ]}

            onPress={() =>
              confirmarEliminarSerie(
                item,
                index + 1
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

      </View>

    );

  };


  /*
   * SIN EJERCICIO
   */

  if (!ejercicioId) {

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

            No encontramos el ejercicio

          </Text>


          <Pressable

            style={
              styles.errorButton
            }

            onPress={() =>
              router.back()
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

      <KeyboardAvoidingView

        style={
          styles.keyboard
        }

        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
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
                  styles.trainingName
                }
                numberOfLines={
                  1
                }
              >

                {
                  entrenamientoNombre ??
                  'ENTRENAMIENTO'
                }

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
                  ejercicioNombre ??
                  'Ejercicio'
                }

              </Text>

            </View>

          </View>


          {/* AÑADIR SERIE */}

          <View
            style={
              styles.addCard
            }
          >

            <Text
              style={
                styles.addLabel
              }
            >

              NUEVA SERIE

            </Text>


            <Text
              style={
                styles.addTitle
              }
            >

              Registra tu serie

            </Text>


            <View
              style={
                styles.inputsRow
              }
            >

              <View
                style={
                  styles.inputContainer
                }
              >

                <Text
                  style={
                    styles.inputLabel
                  }
                >

                  PESO

                </Text>


                <View
                  style={
                    styles.inputBox
                  }
                >

                  <TextInput

                    style={
                      styles.input
                    }

                    placeholder="80"

                    placeholderTextColor=
                      "#59636E"

                    value={
                      peso
                    }

                    onChangeText={
                      setPeso
                    }

                    keyboardType=
                      "decimal-pad"

                  />


                  <Text
                    style={
                      styles.unit
                    }
                  >

                    kg

                  </Text>

                </View>

              </View>


              <View
                style={
                  styles.inputContainer
                }
              >

                <Text
                  style={
                    styles.inputLabel
                  }
                >

                  REPETICIONES

                </Text>


                <View
                  style={
                    styles.inputBox
                  }
                >

                  <TextInput

                    style={
                      styles.input
                    }

                    placeholder="10"

                    placeholderTextColor=
                      "#59636E"

                    value={
                      repeticiones
                    }

                    onChangeText={
                      setRepeticiones
                    }

                    keyboardType=
                      "number-pad"

                  />

                </View>

              </View>

            </View>


            <Pressable

              style={({
                pressed
              }) => [

                styles.saveButton,

                pressed &&
                  styles.saveButtonPressed,

                guardando &&
                  styles.saveButtonDisabled,

              ]}

              onPress={
                guardarSerie
              }

              disabled={
                guardando
              }

            >

              {
                guardando
                  ? (

                    <ActivityIndicator
                      color="#0B0F14"
                    />

                  )
                  : (

                    <Text
                      style={
                        styles.saveButtonText
                      }
                    >

                      + Guardar serie

                    </Text>

                  )
              }

            </Pressable>

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

              Series

            </Text>


            {
              !cargando && (

                <Text
                  style={
                    styles.seriesCount
                  }
                >

                  {series.length}

                </Text>

              )
            }

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

                </View>

              )
              : series.length === 0
                ? (

                  <View
                    style={
                      styles.empty
                    }
                  >

                    <Text
                      style={
                        styles.emptyTitle
                      }
                    >

                      Aún no hay series

                    </Text>


                    <Text
                      style={
                        styles.emptyText
                      }
                    >

                      Registra la primera serie de este ejercicio.

                    </Text>

                  </View>

                )
                : (

                  <FlatList

                    data={
                      series
                    }

                    keyExtractor={(
                      item
                    ) =>
                      item.id.toString()
                    }

                    renderItem={
                      renderSerie
                    }

                    showsVerticalScrollIndicator={
                      false
                    }

                    contentContainerStyle={
                      styles.list
                    }

                    keyboardShouldPersistTaps=
                      "handled"

                  />

                )
          }

        </View>

      </KeyboardAvoidingView>

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


    keyboard: {

      flex: 1,

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


    headerInfo: {

      flex: 1,

      marginLeft: 16,

    },


    trainingName: {

      color: '#717A84',

      fontSize: 10,

      fontWeight: '800',

      letterSpacing: 1.5,

      textTransform:
        'uppercase',

    },


    title: {

      color: '#FFFFFF',

      fontSize: 26,

      fontWeight: '900',

      marginTop: 3,

    },


    addCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

      marginTop: 28,

    },


    addLabel: {

      color: '#747E89',

      fontSize: 10,

      fontWeight: '800',

      letterSpacing: 2,

    },


    addTitle: {

      color: '#FFFFFF',

      fontSize: 23,

      fontWeight: '900',

      marginTop: 8,

    },


    inputsRow: {

      flexDirection: 'row',

      gap: 12,

      marginTop: 22,

    },


    inputContainer: {

      flex: 1,

    },


    inputLabel: {

      color: '#747E89',

      fontSize: 10,

      fontWeight: '800',

      letterSpacing: 1.2,

      marginBottom: 8,

    },


    inputBox: {

      height: 58,

      backgroundColor:
        '#0F141A',

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        '#252D36',

      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 14,

    },


    input: {

      flex: 1,

      color: '#FFFFFF',

      fontSize: 20,

      fontWeight: '800',

    },


    unit: {

      color: '#747E89',

      fontSize: 13,

      fontWeight: '600',

    },


    saveButton: {

      height: 56,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 16,

      alignItems: 'center',

      justifyContent:
        'center',

      marginTop: 20,

    },


    saveButtonPressed: {

      opacity: 0.8,

    },


    saveButtonDisabled: {

      opacity: 0.6,

    },


    saveButtonText: {

      color: '#0B0F14',

      fontSize: 15,

      fontWeight: '900',

    },


    sectionHeader: {

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      marginTop: 28,

      marginBottom: 14,

    },


    sectionTitle: {

      color: '#FFFFFF',

      fontSize: 20,

      fontWeight: '800',

    },


    seriesCount: {

      minWidth: 30,

      height: 30,

      borderRadius: 10,

      backgroundColor:
        '#252D36',

      color: '#FFFFFF',

      textAlign: 'center',

      lineHeight: 30,

      fontWeight: '800',

    },


    loading: {

      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

    },


    list: {

      paddingBottom: 40,

    },


    serieCard: {

      minHeight: 76,

      backgroundColor:
        '#151B22',

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 15,

      marginBottom: 10,

      flexDirection: 'row',

      alignItems: 'center',

    },


    serieNumber: {

      width: 38,

      height: 38,

      borderRadius: 12,

      backgroundColor:
        '#FFFFFF',

      alignItems: 'center',

      justifyContent:
        'center',

      marginRight: 15,

    },


    serieNumberText: {

      color: '#0B0F14',

      fontSize: 15,

      fontWeight: '900',

    },


    serieData: {

      minWidth: 67,

      marginRight: 8,

    },


    serieValue: {

      color: '#FFFFFF',

      fontSize: 16,

      fontWeight: '800',

    },


    serieLabel: {

      color: '#626D78',

      fontSize: 9,

      fontWeight: '800',

      letterSpacing: 1,

      marginTop: 3,

    },


    serieRight: {

      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'flex-end',

      gap: 9,

    },


    dateText: {

      color: '#69737D',

      fontSize: 10,

    },


    deleteButton: {

      width: 35,

      height: 35,

      borderRadius: 11,

      backgroundColor:
        '#23181B',

      borderWidth: 1,

      borderColor:
        '#48282D',

      alignItems: 'center',

      justifyContent:
        'center',

    },


    deleteButtonPressed: {

      opacity: 0.6,

    },


    deleteIcon: {

      color: '#FF6262',

      fontSize: 23,

      lineHeight: 25,

      fontWeight: '500',

    },


    empty: {

      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingBottom: 70,

    },


    emptyTitle: {

      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '800',

    },


    emptyText: {

      color: '#747E89',

      fontSize: 13,

      marginTop: 7,

      textAlign: 'center',

    },


    errorContainer: {

      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

    },


    errorTitle: {

      color: '#FFFFFF',

      fontSize: 20,

      fontWeight: '800',

    },


    errorButton: {

      backgroundColor:
        '#FFFFFF',

      paddingHorizontal: 28,

      paddingVertical: 15,

      borderRadius: 15,

      marginTop: 20,

    },


    errorButtonText: {

      color: '#0B0F14',

      fontWeight: '800',

    },

  });