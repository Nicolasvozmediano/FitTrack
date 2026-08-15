import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  ejerciciosCatalogo,
} from '../data/ejerciciosCatalogo';


const API_URL =
  'http://192.168.1.128:8080';


type CatalogoApiResponse = {

  id: number;

  sourceId: string;

  nombreOriginal: string;

  nombre: string;

  grupoFitTrack: string;

  equipamiento: string;

  musculoPrincipal: string;

  musculosPrincipales: string[];

  musculosSecundarios: string[];

  instrucciones: string[];

  fuerza: string | null;

  nivel: string | null;

  mecanica: string | null;

  categoria: string | null;
};


type EjercicioDetalle = {

  id: string;

  catalogoEjercicioId:
    number | null;

  nombre: string;

  grupo: string;

  material: string;

  musculoPrincipal: string;

  musculosSecundarios:
    string[];

  instrucciones:
    string[];

  descripcion:
    string | null;

  erroresComunes:
    string[];

  imagen?:
    ImageSourcePropType;

  fuerza:
    string | null;

  nivel:
    string | null;

  mecanica:
    string | null;

  categoria:
    string | null;
};


export default function DetalleCatalogoEjercicio() {

  const {

    ejercicioId,

    entrenamientoId,

    entrenamientoNombre,

  } =
    useLocalSearchParams<{

      ejercicioId?: string;

      entrenamientoId?: string;

      entrenamientoNombre?: string;

    }>();


  const [
    ejercicio,
    setEjercicio,
  ] =
    useState<
      EjercicioDetalle | null
    >(
      null
    );


  const [
    cargando,
    setCargando,
  ] =
    useState(
      true
    );


  const [
    errorCarga,
    setErrorCarga,
  ] =
    useState(
      false
    );


  const [
    guardando,
    setGuardando,
  ] =
    useState(
      false
    );


  /*
   * DETECTAR SI EL ID VIENE
   * DEL CATÁLOGO NUEVO DEL BACKEND
   */

  const catalogoEjercicioId =
    useMemo(() => {

      if (!ejercicioId) {

        return null;
      }


      if (
        !/^\d+$/.test(
          ejercicioId
        )
      ) {

        return null;
      }


      const numero =
        Number(
          ejercicioId
        );


      if (
        !Number.isInteger(
          numero
        ) ||
        numero <= 0
      ) {

        return null;
      }


      return numero;

    }, [
      ejercicioId,
    ]);


  /*
   * CARGAR EJERCICIO
   */

  useEffect(() => {

    let activo =
      true;


    const cargarEjercicio =
      async () => {

        setCargando(
          true
        );

        setErrorCarga(
          false
        );


        /*
         * CATÁLOGO ANTIGUO LOCAL
         */

        if (
          catalogoEjercicioId ===
            null
        ) {

          const encontrado =
            ejerciciosCatalogo.find(
              item =>
                item.id ===
                ejercicioId
            );


          if (!activo) {
            return;
          }


          if (!encontrado) {

            setEjercicio(
              null
            );

            setErrorCarga(
              true
            );

            setCargando(
              false
            );

            return;
          }


          setEjercicio({

            id:
              encontrado.id,

            catalogoEjercicioId:
              null,

            nombre:
              encontrado.nombre,

            grupo:
              encontrado.grupo,

            material:
              encontrado.material,

            musculoPrincipal:
              encontrado
                .musculoPrincipal,

            musculosSecundarios:
              encontrado
                .musculosSecundarios,

            instrucciones:
              encontrado
                .instrucciones,

            descripcion:
              encontrado.descripcion,

            erroresComunes:
              encontrado
                .erroresComunes,

            imagen:
              encontrado.imagen,

            fuerza:
              null,

            nivel:
              null,

            mecanica:
              null,

            categoria:
              null,

          });


          setCargando(
            false
          );

          return;
        }


        /*
         * CATÁLOGO NUEVO
         * POSTGRESQL + BACKEND
         */

        try {

          const token =
            await AsyncStorage
              .getItem(
                'fittrack_token'
              );


          if (!token) {

            router.replace(
              '/'
            );

            return;
          }


          const response =
            await fetch(

              `${API_URL}/api/catalogo-ejercicios/${catalogoEjercicioId}`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );


          if (
            response.status ===
            401
          ) {

            await AsyncStorage
              .removeItem(
                'fittrack_token'
              );


            router.replace(
              '/'
            );

            return;
          }


          if (!response.ok) {

            throw new Error(
              `HTTP ${response.status}`
            );
          }


          const data:
            CatalogoApiResponse =
              await response.json();


          if (!activo) {
            return;
          }


          setEjercicio({

            id:
              String(
                data.id
              ),

            catalogoEjercicioId:
              data.id,

            nombre:
              data.nombre,

            grupo:
              data.grupoFitTrack,

            material:
              data.equipamiento,

            musculoPrincipal:
              data.musculoPrincipal,

            musculosSecundarios:
              data.musculosSecundarios ??
              [],

            instrucciones:
              data.instrucciones ??
              [],

            descripcion:
              null,

            erroresComunes:
              [],

            fuerza:
              data.fuerza,

            nivel:
              data.nivel,

            mecanica:
              data.mecanica,

            categoria:
              data.categoria,

          });


        } catch (error) {

          console.log(
            'Error cargando detalle del catálogo:',
            error
          );


          if (activo) {

            setEjercicio(
              null
            );

            setErrorCarga(
              true
            );

          }

        } finally {

          if (activo) {

            setCargando(
              false
            );

          }

        }

      };


    cargarEjercicio();


    return () => {

      activo =
        false;

    };

  }, [
    ejercicioId,
    catalogoEjercicioId,
  ]);


  /*
   * AÑADIR AL ENTRENAMIENTO
   */

  const añadirAlEntrenamiento =
    async () => {

      if (!ejercicio) {

        Alert.alert(
          'Error',
          'No encontramos el ejercicio.'
        );

        return;
      }


      if (!entrenamientoId) {

        Alert.alert(
          'Error',
          'No encontramos el entrenamiento.'
        );

        return;
      }


      try {

        setGuardando(
          true
        );


        const token =
          await AsyncStorage
            .getItem(
              'fittrack_token'
            );


        if (!token) {

          router.replace(
            '/'
          );

          return;
        }


        const body: {
          nombre: string;
          catalogoEjercicioId?:
            number;
        } = {

          nombre:
            ejercicio.nombre,

        };


        if (
          ejercicio
            .catalogoEjercicioId !==
          null
        ) {

          body.catalogoEjercicioId =
            ejercicio
              .catalogoEjercicioId;

        }


        const response =
          await fetch(

            `${API_URL}/api/ejercicios/entrenamiento/${entrenamientoId}`,

            {

              method:
                'POST',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify(
                  body
                ),

            }

          );


        if (
          response.status ===
          401
        ) {

          await AsyncStorage
            .removeItem(
              'fittrack_token'
            );


          router.replace(
            '/'
          );

          return;
        }


        if (!response.ok) {

          const mensaje =
            await response.text();


          Alert.alert(

            'No se pudo añadir',

            mensaje ||
              'Ha ocurrido un error.'

          );

          return;
        }


        Alert.alert(

          'Ejercicio añadido',

          `${ejercicio.nombre} se ha añadido a ${
            entrenamientoNombre ??
            'tu entrenamiento'
          }.`,

          [

            {

              text:
                'Continuar',

              onPress: () => {

                router.dismiss(
                  2
                );

              },

            },

          ]

        );


      } catch (error) {

        console.log(
          'Error añadiendo ejercicio:',
          error
        );


        Alert.alert(

          'Error de conexión',

          'No se ha podido conectar con FitTrack.'

        );


      } finally {

        setGuardando(
          false
        );

      }

    };


  /*
   * CARGANDO
   */

  if (cargando) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

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

            Cargando ejercicio...

          </Text>

        </View>

      </SafeAreaView>

    );

  }


  /*
   * ERROR
   */

  if (
    !ejercicio ||
    errorCarga
  ) {

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

            Ejercicio no encontrado

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


  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <ScrollView

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={
          styles.scrollContent
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

              EJERCICIO

            </Text>


            <Text

              style={
                styles.headerTitle
              }

              numberOfLines={
                1
              }

            >

              {
                ejercicio.grupo
              }

            </Text>

          </View>

        </View>


        {/* IMAGEN */}

        <View
          style={
            styles.imageCard
          }
        >

          {
            ejercicio.imagen ? (

              <Image

                source={
                  ejercicio.imagen
                }

                style={
                  styles.exerciseImage
                }

                resizeMode="contain"

              />

            ) : (

              <View
                style={
                  styles.placeholder
                }
              >

                <View
                  style={
                    styles.placeholderIcon
                  }
                >

                  <Text
                    style={
                      styles.placeholderIconText
                    }
                  >

                    FT

                  </Text>

                </View>


                <Text
                  style={
                    styles.placeholderTitle
                  }
                >

                  Ilustración próximamente

                </Text>


                <Text
                  style={
                    styles.placeholderText
                  }
                >

                  Añadiremos una imagen propia para este ejercicio.

                </Text>

              </View>

            )
          }

        </View>


        {/* NOMBRE */}

        <Text
          style={
            styles.exerciseTitle
          }
        >

          {
            ejercicio.nombre
          }

        </Text>


        {/* ETIQUETAS */}

        <View
          style={
            styles.tagsRow
          }
        >

          <View
            style={
              styles.tag
            }
          >

            <Text
              style={
                styles.tagText
              }
            >

              {
                ejercicio.grupo
              }

            </Text>

          </View>


          <View
            style={
              styles.tag
            }
          >

            <Text
              style={
                styles.tagText
              }
            >

              {
                ejercicio.material
              }

            </Text>

          </View>


          {
            ejercicio.nivel && (

              <View
                style={
                  styles.tag
                }
              >

                <Text
                  style={
                    styles.tagText
                  }
                >

                  {
                    ejercicio.nivel
                  }

                </Text>

              </View>

            )
          }

        </View>


        {/* DESCRIPCIÓN */}

        {
          ejercicio.descripcion && (

            <View
              style={
                styles.section
              }
            >

              <Text
                style={
                  styles.sectionLabel
                }
              >

                SOBRE EL EJERCICIO

              </Text>


              <Text
                style={
                  styles.description
                }
              >

                {
                  ejercicio.descripcion
                }

              </Text>

            </View>

          )
        }


        {/* MÚSCULOS */}

        <View
          style={
            styles.section
          }
        >

          <Text
            style={
              styles.sectionLabel
            }
          >

            MÚSCULOS TRABAJADOS

          </Text>


          <View
            style={
              styles.muscleCard
            }
          >

            <Text
              style={
                styles.muscleSmall
              }
            >

              PRINCIPAL

            </Text>


            <Text
              style={
                styles.muscleMain
              }
            >

              {
                ejercicio
                  .musculoPrincipal
              }

            </Text>

          </View>


          {
            ejercicio
              .musculosSecundarios
              .length > 0 && (

              <View
                style={
                  styles.secondaryCard
                }
              >

                <Text
                  style={
                    styles.muscleSmall
                  }
                >

                  TAMBIÉN TRABAJA

                </Text>


                <View
                  style={
                    styles.secondaryWrap
                  }
                >

                  {
                    ejercicio
                      .musculosSecundarios
                      .map(
                        (
                          musculo:
                            string
                        ) => (

                          <View

                            key={
                              musculo
                            }

                            style={
                              styles.secondaryTag
                            }

                          >

                            <Text
                              style={
                                styles.secondaryText
                              }
                            >

                              {
                                musculo
                              }

                            </Text>

                          </View>

                        )
                      )
                  }

                </View>

              </View>

            )
          }

        </View>


        {/* DATOS TÉCNICOS */}

        {
          (
            ejercicio.fuerza ||
            ejercicio.mecanica ||
            ejercicio.categoria
          ) && (

            <View
              style={
                styles.section
              }
            >

              <Text
                style={
                  styles.sectionLabel
                }
              >

                DATOS DEL EJERCICIO

              </Text>


              <View
                style={
                  styles.dataCard
                }
              >

                {
                  ejercicio.fuerza && (

                    <View
                      style={
                        styles.dataRow
                      }
                    >

                      <Text
                        style={
                          styles.dataLabel
                        }
                      >

                        Fuerza

                      </Text>


                      <Text
                        style={
                          styles.dataValue
                        }
                      >

                        {
                          ejercicio.fuerza
                        }

                      </Text>

                    </View>

                  )
                }


                {
                  ejercicio.mecanica && (

                    <View
                      style={
                        styles.dataRow
                      }
                    >

                      <Text
                        style={
                          styles.dataLabel
                        }
                      >

                        Mecánica

                      </Text>


                      <Text
                        style={
                          styles.dataValue
                        }
                      >

                        {
                          ejercicio.mecanica
                        }

                      </Text>

                    </View>

                  )
                }


                {
                  ejercicio.categoria && (

                    <View
                      style={
                        styles.dataRow
                      }
                    >

                      <Text
                        style={
                          styles.dataLabel
                        }
                      >

                        Categoría

                      </Text>


                      <Text
                        style={
                          styles.dataValue
                        }
                      >

                        {
                          ejercicio.categoria
                        }

                      </Text>

                    </View>

                  )
                }

              </View>

            </View>

          )
        }


        {/* CÓMO HACERLO */}

        <View
          style={
            styles.section
          }
        >

          <Text
            style={
              styles.sectionLabel
            }
          >

            CÓMO HACERLO

          </Text>


          {
            ejercicio
              .instrucciones
              .length > 0 ? (

              ejercicio
                .instrucciones
                .map(
                  (
                    instruccion:
                      string,
                    index:
                      number
                  ) => (

                    <View

                      key={
                        index
                      }

                      style={
                        styles.step
                      }

                    >

                      <View
                        style={
                          styles.stepNumber
                        }
                      >

                        <Text
                          style={
                            styles.stepNumberText
                          }
                        >

                          {
                            index + 1
                          }

                        </Text>

                      </View>


                      <Text
                        style={
                          styles.stepText
                        }
                      >

                        {
                          instruccion
                        }

                      </Text>

                    </View>

                  )
                )

            ) : (

              <Text
                style={
                  styles.noInstructions
                }
              >

                Instrucciones no disponibles.

              </Text>

            )
          }

        </View>


        {/* ERRORES FRECUENTES */}

        {
          ejercicio
            .erroresComunes
            .length > 0 && (

            <View
              style={
                styles.warningSection
              }
            >

              <View
                style={
                  styles.warningHeader
                }
              >

                <View
                  style={
                    styles.warningIcon
                  }
                >

                  <Text
                    style={
                      styles.warningIconText
                    }
                  >

                    !

                  </Text>

                </View>


                <Text
                  style={
                    styles.warningTitle
                  }
                >

                  Errores frecuentes

                </Text>

              </View>


              {
                ejercicio
                  .erroresComunes
                  .map(
                    (
                      error:
                        string,
                      index:
                        number
                    ) => (

                      <View

                        key={
                          index
                        }

                        style={
                          styles.errorRow
                        }

                      >

                        <Text
                          style={
                            styles.errorDot
                          }
                        >

                          •

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

                      </View>

                    )
                  )
              }

            </View>

          )
        }


        {/* BOTÓN AÑADIR */}

        <Pressable

          style={({
            pressed
          }) => [

            styles.addButton,

            pressed &&
              styles.addButtonPressed,

            guardando &&
              styles.addButtonDisabled,

          ]}

          onPress={
            añadirAlEntrenamiento
          }

          disabled={
            guardando
          }

        >

          {
            guardando ? (

              <ActivityIndicator
                color="#0B0F14"
              />

            ) : (

              <Text
                style={
                  styles.addButtonText
                }
              >

                + Añadir al entrenamiento

              </Text>

            )
          }

        </Pressable>


        <Text
          style={
            styles.trainingText
          }
        >

          {
            entrenamientoNombre

              ? `Se añadirá a ${entrenamientoNombre}`

              : 'Se añadirá al entrenamiento actual'
          }

        </Text>

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


    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 50,
    },


    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },


    loadingText: {
      color: '#8A939D',
      fontSize: 13,
      marginTop: 15,
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
      alignItems:
        'center',
      justifyContent:
        'center',
    },


    pressed: {
      opacity: 0.65,
    },


    backText: {
      color: '#FFFFFF',
      fontSize: 32,
      lineHeight: 34,
    },


    headerInfo: {
      marginLeft: 15,
      flex: 1,
    },


    smallTitle: {
      color: '#717A84',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.8,
    },


    headerTitle: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '900',
      marginTop: 2,
    },


    imageCard: {
      height: 340,
      backgroundColor:
        '#080B0F',
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        '#252D36',
      marginTop: 25,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent:
        'center',
    },


    exerciseImage: {
      width: '100%',
      height: '100%',
    },


    placeholder: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 30,
    },


    placeholderIcon: {
      width: 65,
      height: 65,
      borderRadius: 20,
      backgroundColor:
        '#FFFFFF',
      alignItems: 'center',
      justifyContent:
        'center',
    },


    placeholderIconText: {
      color: '#0B0F14',
      fontSize: 18,
      fontWeight: '900',
    },


    placeholderTitle: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
      marginTop: 18,
    },


    placeholderText: {
      color: '#65707B',
      fontSize: 12,
      textAlign: 'center',
      marginTop: 7,
    },


    exerciseTitle: {
      color: '#FFFFFF',
      fontSize: 29,
      lineHeight: 35,
      fontWeight: '900',
      marginTop: 25,
    },


    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 14,
    },


    tag: {
      backgroundColor:
        '#202832',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },


    tagText: {
      color: '#B7BEC5',
      fontSize: 11,
      fontWeight: '700',
    },


    section: {
      marginTop: 31,
    },


    sectionLabel: {
      color: '#747E89',
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.7,
      marginBottom: 13,
    },


    description: {
      color: '#CFD4D9',
      fontSize: 15,
      lineHeight: 24,
    },


    muscleCard: {
      backgroundColor:
        '#151B22',
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        '#252D36',
      padding: 17,
    },


    muscleSmall: {
      color: '#69737E',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.3,
    },


    muscleMain: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
      marginTop: 6,
    },


    secondaryCard: {
      marginTop: 10,
      backgroundColor:
        '#151B22',
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        '#252D36',
      padding: 17,
    },


    secondaryWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: 11,
    },


    secondaryTag: {
      backgroundColor:
        '#202832',
      borderRadius: 9,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },


    secondaryText: {
      color: '#C4CAD0',
      fontSize: 11,
      fontWeight: '700',
    },


    dataCard: {
      backgroundColor:
        '#151B22',
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        '#252D36',
      paddingHorizontal: 17,
      paddingVertical: 7,
    },


    dataRow: {
      minHeight: 47,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        '#202832',
    },


    dataLabel: {
      color: '#747E89',
      fontSize: 12,
      fontWeight: '700',
    },


    dataValue: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },


    step: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems:
        'flex-start',
    },


    stepNumber: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor:
        '#FFFFFF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 13,
    },


    stepNumberText: {
      color: '#0B0F14',
      fontSize: 13,
      fontWeight: '900',
    },


    stepText: {
      flex: 1,
      color: '#C9CFD5',
      fontSize: 14,
      lineHeight: 21,
      paddingTop: 6,
    },


    noInstructions: {
      color: '#747E89',
      fontSize: 13,
      lineHeight: 20,
    },


    warningSection: {
      backgroundColor:
        '#151B22',
      borderRadius: 19,
      borderWidth: 1,
      borderColor:
        '#2B333C',
      padding: 18,
      marginTop: 28,
    },


    warningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 13,
    },


    warningIcon: {
      width: 31,
      height: 31,
      borderRadius: 10,
      backgroundColor:
        '#FFFFFF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },


    warningIconText: {
      color: '#0B0F14',
      fontSize: 16,
      fontWeight: '900',
    },


    warningTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
    },


    errorRow: {
      flexDirection: 'row',
      marginTop: 8,
    },


    errorDot: {
      color: '#8A939C',
      fontSize: 17,
      marginRight: 9,
    },


    errorText: {
      flex: 1,
      color: '#A7AFB7',
      fontSize: 13,
      lineHeight: 19,
    },


    addButton: {
      height: 61,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 18,
      alignItems: 'center',
      justifyContent:
        'center',
      marginTop: 31,
    },


    addButtonPressed: {
      opacity: 0.8,
    },


    addButtonDisabled: {
      opacity: 0.55,
    },


    addButtonText: {
      color: '#0B0F14',
      fontSize: 15,
      fontWeight: '900',
    },


    trainingText: {
      color: '#626C76',
      fontSize: 11,
      textAlign: 'center',
      marginTop: 11,
    },


    errorContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },


    errorTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '900',
    },


    errorButton: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 14,
      paddingHorizontal: 25,
      paddingVertical: 14,
      marginTop: 20,
    },


    errorButtonText: {
      color: '#0B0F14',
      fontWeight: '900',
    },

  });