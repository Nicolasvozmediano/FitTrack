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
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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


type UsuarioPerfil = {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro: string;

  peso: number | null;
  alturaCm: number | null;
  objetivo: string | null;
  nivelExperiencia: string | null;
};


const OBJETIVOS = [
  'Ganar masa muscular',
  'Perder grasa',
  'Mejorar fuerza',
  'Mejorar rendimiento',
  'Mantenerme en forma',
];


const NIVELES = [
  'Principiante',
  'Intermedio',
  'Avanzado',
];


export default function EditarPerfil() {

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
    peso,
    setPeso,
  ] =
    useState('');


  const [
    alturaCm,
    setAlturaCm,
  ] =
    useState('');


  const [
    objetivo,
    setObjetivo,
  ] =
    useState<string | null>(
      null
    );


  const [
    nivelExperiencia,
    setNivelExperiencia,
  ] =
    useState<string | null>(
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
   * CARGAR PERFIL
   */

  const cargarPerfil =
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
            `${API_URL}/api/usuarios/perfil`,
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

          Alert.alert(
            'Error',
            'No se pudo cargar tu perfil.'
          );

          return;
        }


        const data:
          UsuarioPerfil =
            await response.json();


        setPeso(
          data.peso !== null
            ? data.peso.toString()
            : ''
        );


        setAlturaCm(
          data.alturaCm !== null
            ? data.alturaCm.toString()
            : ''
        );


        setObjetivo(
          data.objetivo
        );


        setNivelExperiencia(
          data.nivelExperiencia
        );


      } catch (error) {

        console.log(
          'Error cargando perfil deportivo:',
          error
        );


        Alert.alert(
          'Sin conexión',
          'No se pudo conectar con el servidor.'
        );


      } finally {

        setCargando(false);
      }

    };


  /*
   * CARGAR AL ENTRAR
   */

  useFocusEffect(

    useCallback(() => {

      cargarPerfil();

    }, [])

  );


  /*
   * CONVERTIR PESO
   */

  const convertirPeso =
    () => {

      const texto =
        peso
          .trim()
          .replace(',', '.');


      if (!texto) {

        return null;
      }


      const numero =
        Number(texto);


      if (
        Number.isNaN(numero)
      ) {

        return NaN;
      }


      return numero;
    };


  /*
   * CONVERTIR ALTURA
   */

  const convertirAltura =
    () => {

      const texto =
        alturaCm.trim();


      if (!texto) {

        return null;
      }


      const numero =
        Number(texto);


      if (
        Number.isNaN(numero)
      ) {

        return NaN;
      }


      return Math.round(
        numero
      );
    };


  /*
   * GUARDAR
   */

  const guardarPerfil =
    async () => {

      try {

        const pesoNumero =
          convertirPeso();


        const alturaNumero =
          convertirAltura();


        if (
          pesoNumero !== null
          && Number.isNaN(
            pesoNumero
          )
        ) {

          Alert.alert(
            'Peso incorrecto',
            'Introduce un peso válido.'
          );

          return;
        }


        if (
          alturaNumero !== null
          && Number.isNaN(
            alturaNumero
          )
        ) {

          Alert.alert(
            'Altura incorrecta',
            'Introduce una altura válida.'
          );

          return;
        }


        if (
          pesoNumero !== null
          && (
            pesoNumero <= 0
            || pesoNumero > 500
          )
        ) {

          Alert.alert(
            'Peso incorrecto',
            'Introduce un peso entre 1 y 500 kg.'
          );

          return;
        }


        if (
          alturaNumero !== null
          && (
            alturaNumero <= 0
            || alturaNumero > 300
          )
        ) {

          Alert.alert(
            'Altura incorrecta',
            'Introduce una altura entre 1 y 300 cm.'
          );

          return;
        }


        const token =
          await obtenerToken();


        if (!token) {
          return;
        }


        setGuardando(true);


        const response =
          await fetch(
            `${API_URL}/api/usuarios/perfil`,
            {
              method: 'PUT',

              headers: {
                Authorization:
                  `Bearer ${token}`,

                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  peso:
                    pesoNumero,

                  alturaCm:
                    alturaNumero,

                  objetivo,

                  nivelExperiencia,
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


        if (
          response.status === 400
        ) {

          const data =
            await response.json();


          Alert.alert(
            'Datos incorrectos',
            data?.mensaje ??
              'Revisa los datos introducidos.'
          );

          return;
        }


        if (!response.ok) {

          Alert.alert(
            'Error',
            'No se pudo guardar tu perfil.'
          );

          return;
        }


        Alert.alert(
          'Perfil actualizado',
          'Tus datos deportivos se han guardado correctamente.',
          [
            {
              text: 'Aceptar',

              onPress: () =>
                router.back(),
            },
          ]
        );


      } catch (error) {

        console.log(
          'Error guardando perfil:',
          error
        );


        Alert.alert(
          'Sin conexión',
          'No se pudo conectar con el servidor.'
        );


      } finally {

        setGuardando(false);
      }

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

        <ScrollView

          style={
            styles.scroll
          }

          contentContainerStyle={
            styles.content
          }

          keyboardShouldPersistTaps="handled"

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

                Perfil deportivo

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

                    Cargando datos...

                  </Text>

                </View>

              )
              : (

                <>


                  {/* INTRODUCCIÓN */}

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

                      PERSONALIZACIÓN

                    </Text>


                    <Text
                      style={
                        styles.heroTitle
                      }
                    >

                      Cuéntanos sobre ti

                    </Text>


                    <Text
                      style={
                        styles.heroText
                      }
                    >

                      Estos datos nos permitirán personalizar mejor FitTrack y las futuras recomendaciones.

                    </Text>

                  </View>


                  {/* DATOS FÍSICOS */}

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

                      Datos físicos

                    </Text>

                  </View>


                  <View
                    style={
                      styles.inputCard
                    }
                  >

                    <Text
                      style={
                        styles.inputLabel
                      }
                    >

                      Peso

                    </Text>


                    <View
                      style={
                        styles.inputRow
                      }
                    >

                      <TextInput

                        style={
                          styles.input
                        }

                        value={
                          peso
                        }

                        onChangeText={
                          setPeso
                        }

                        placeholder="Ej. 70"

                        placeholderTextColor="#59636E"

                        keyboardType="decimal-pad"

                        maxLength={
                          6
                        }

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
                      styles.inputCard
                    }
                  >

                    <Text
                      style={
                        styles.inputLabel
                      }
                    >

                      Altura

                    </Text>


                    <View
                      style={
                        styles.inputRow
                      }
                    >

                      <TextInput

                        style={
                          styles.input
                        }

                        value={
                          alturaCm
                        }

                        onChangeText={
                          setAlturaCm
                        }

                        placeholder="Ej. 172"

                        placeholderTextColor="#59636E"

                        keyboardType="number-pad"

                        maxLength={
                          3
                        }

                      />


                      <Text
                        style={
                          styles.unit
                        }
                      >

                        cm

                      </Text>

                    </View>

                  </View>


                  {/* OBJETIVO */}

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

                      Objetivo principal

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      Elige lo que más se parezca a tu objetivo actual.

                    </Text>

                  </View>


                  <View
                    style={
                      styles.options
                    }
                  >

                    {
                      OBJETIVOS.map(
                        opcion => {

                          const seleccionado =
                            objetivo === opcion;


                          return (

                            <Pressable

                              key={
                                opcion
                              }

                              style={({
                                pressed
                              }) => [

                                styles.optionButton,

                                seleccionado &&
                                  styles.optionSelected,

                                pressed &&
                                  styles.pressed,

                              ]}

                              onPress={() =>
                                setObjetivo(
                                  opcion
                                )
                              }

                            >

                              <Text
                                style={[
                                  styles.optionText,

                                  seleccionado &&
                                    styles.optionTextSelected,
                                ]}
                              >

                                {
                                  opcion
                                }

                              </Text>


                              {
                                seleccionado && (

                                  <Text
                                    style={
                                      styles.check
                                    }
                                  >

                                    ✓

                                  </Text>

                                )
                              }

                            </Pressable>

                          );

                        }
                      )
                    }

                  </View>


                  {/* NIVEL */}

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

                      Nivel de experiencia

                    </Text>


                    <Text
                      style={
                        styles.sectionText
                      }
                    >

                      ¿Cuánta experiencia tienes entrenando con pesas?

                    </Text>

                  </View>


                  <View
                    style={
                      styles.levelRow
                    }
                  >

                    {
                      NIVELES.map(
                        nivel => {

                          const seleccionado =
                            nivelExperiencia ===
                            nivel;


                          return (

                            <Pressable

                              key={
                                nivel
                              }

                              style={({
                                pressed
                              }) => [

                                styles.levelButton,

                                seleccionado &&
                                  styles.levelSelected,

                                pressed &&
                                  styles.pressed,

                              ]}

                              onPress={() =>
                                setNivelExperiencia(
                                  nivel
                                )
                              }

                            >

                              <Text
                                style={[
                                  styles.levelText,

                                  seleccionado &&
                                    styles.levelTextSelected,
                                ]}
                              >

                                {
                                  nivel
                                }

                              </Text>

                            </Pressable>

                          );

                        }
                      )
                    }

                  </View>


                  {/* GUARDAR */}

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
                      guardarPerfil
                    }

                    disabled={
                      guardando
                    }

                  >

                    {
                      guardando
                        ? (

                          <ActivityIndicator
                            size="small"
                            color="#0B0F14"
                          />

                        )
                        : (

                          <Text
                            style={
                              styles.saveButtonText
                            }
                          >

                            Guardar cambios

                          </Text>

                        )
                    }

                  </Pressable>

                </>

              )
          }

        </ScrollView>

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

      fontSize: 25,

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


    hero: {

      backgroundColor:
        '#151B22',

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 22,

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

      fontSize: 25,

      fontWeight:
        '900',

      marginTop: 8,

    },


    heroText: {

      color:
        '#8D96A0',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 7,

    },


    sectionHeader: {

      marginTop: 28,

      marginBottom: 12,

    },


    sectionTitle: {

      color:
        '#FFFFFF',

      fontSize: 19,

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


    inputCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 17,

      marginBottom: 10,

    },


    inputLabel: {

      color:
        '#747E89',

      fontSize: 10,

      fontWeight:
        '800',

      textTransform:
        'uppercase',

      letterSpacing: 1,

    },


    inputRow: {

      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 5,

    },


    input: {

      flex: 1,

      color:
        '#FFFFFF',

      fontSize: 23,

      fontWeight:
        '900',

      paddingVertical: 5,

    },


    unit: {

      color:
        '#747E89',

      fontSize: 14,

      fontWeight:
        '700',

      marginLeft: 10,

    },


    options: {

      gap: 9,

    },


    optionButton: {

      minHeight: 56,

      backgroundColor:
        '#11171D',

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 17,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    optionSelected: {

      backgroundColor:
        '#FFFFFF',

      borderColor:
        '#FFFFFF',

    },


    optionText: {

      color:
        '#C2C8CE',

      fontSize: 14,

      fontWeight:
        '700',

    },


    optionTextSelected: {

      color:
        '#0B0F14',

      fontWeight:
        '900',

    },


    check: {

      color:
        '#0B0F14',

      fontSize: 17,

      fontWeight:
        '900',

    },


    levelRow: {

      flexDirection:
        'row',

      gap: 8,

    },


    levelButton: {

      flex: 1,

      minHeight: 52,

      backgroundColor:
        '#11171D',

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        '#252D36',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 5,

    },


    levelSelected: {

      backgroundColor:
        '#FFFFFF',

      borderColor:
        '#FFFFFF',

    },


    levelText: {

      color:
        '#9AA3AD',

      fontSize: 11,

      fontWeight:
        '800',

      textAlign:
        'center',

    },


    levelTextSelected: {

      color:
        '#0B0F14',

    },


    saveButton: {

      height: 56,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 32,

    },


    saveButtonPressed: {

      opacity: 0.8,

    },


    saveButtonDisabled: {

      opacity: 0.6,

    },


    saveButtonText: {

      color:
        '#0B0F14',

      fontSize: 15,

      fontWeight:
        '900',

    },

  });