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


export default function Perfil() {

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioPerfil | null>(
      null
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
   * CARGAR PERFIL
   */

  const cargarPerfil =
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


        if (
          response.status === 404
        ) {

          setError(
            'No se ha encontrado tu perfil.'
          );

          return;
        }


        if (!response.ok) {

          setError(
            'No se pudo cargar el perfil.'
          );

          return;
        }


        const data:
          UsuarioPerfil =
            await response.json();


        setUsuario(data);


      } catch (error) {

        console.log(
          'Error cargando perfil:',
          error
        );


        setError(
          'No se pudo conectar con el servidor.'
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

      cargarPerfil();

    }, [])

  );


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
   * FORMATEAR FECHA
   */

  const formatearFecha = (
    fecha: string
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


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  };


  /*
   * INICIAL DEL USUARIO
   */

  const inicial =
    usuario?.nombre
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase()
      ?? '?';


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

              Perfil

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

                  Cargando perfil...

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

                    Ha ocurrido un problema

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
                      cargarPerfil
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
              : usuario
                ? (

                  <>


                    {/* TARJETA PRINCIPAL */}

                    <View
                      style={
                        styles.profileCard
                      }
                    >

                      <View
                        style={
                          styles.avatar
                        }
                      >

                        <Text
                          style={
                            styles.avatarText
                          }
                        >

                          {
                            inicial
                          }

                        </Text>

                      </View>


                      <Text
                        style={
                          styles.profileName
                        }
                      >

                        {
                          usuario.nombre
                        }

                      </Text>


                      <Text
                        style={
                          styles.profileEmail
                        }
                      >

                        {
                          usuario.email
                        }

                      </Text>

                    </View>


                    {/* INFORMACIÓN */}

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

                        Mi cuenta

                      </Text>


                      <Text
                        style={
                          styles.sectionText
                        }
                      >

                        Información asociada a tu perfil de FitTrack.

                      </Text>

                    </View>


                    <View
                      style={
                        styles.infoCard
                      }
                    >

                      <View
                        style={
                          styles.infoRow
                        }
                      >

                        <View
                          style={
                            styles.infoLeft
                          }
                        >

                          <Text
                            style={
                              styles.infoLabel
                            }
                          >

                            Nombre

                          </Text>

                        </View>


                        <Text
                          style={
                            styles.infoValue
                          }
                          numberOfLines={
                            1
                          }
                        >

                          {
                            usuario.nombre
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
                          styles.infoRow
                        }
                      >

                        <View
                          style={
                            styles.infoLeft
                          }
                        >

                          <Text
                            style={
                              styles.infoLabel
                            }
                          >

                            Correo electrónico

                          </Text>

                        </View>


                        <Text
                          style={
                            styles.infoValueSmall
                          }
                          numberOfLines={
                            1
                          }
                        >

                          {
                            usuario.email
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
                          styles.infoRow
                        }
                      >

                        <View
                          style={
                            styles.infoLeft
                          }
                        >

                          <Text
                            style={
                              styles.infoLabel
                            }
                          >

                            Miembro desde

                          </Text>

                        </View>


                        <Text
                          style={
                            styles.infoValue
                          }
                        >

                          {
                            formatearFecha(
                              usuario.fechaRegistro
                            )
                          }

                        </Text>

                      </View>

                    </View>


                    {/* PERFIL DEPORTIVO */}

                    <View
                      style={
                        styles.sportsCard
                      }
                    >

                      <View
                        style={
                          styles.sportsHeader
                        }
                      >

                        <View
                          style={
                            styles.sportsHeaderInfo
                          }
                        >

                          <Text
                            style={
                              styles.sportsLabel
                            }
                          >

                            PERFIL DEPORTIVO

                          </Text>


                          <Text
                            style={
                              styles.sportsTitle
                            }
                          >

                            Tus datos

                          </Text>

                        </View>


                        <Pressable

                          style={({
                            pressed
                          }) => [

                            styles.editButton,

                            pressed &&
                              styles.buttonPressed,

                          ]}

                          onPress={() =>
                            router.push(
                              '/editar-perfil'
                            )
                          }

                        >

                          <Text
                            style={
                              styles.editButtonText
                            }
                          >

                            Editar

                          </Text>

                        </Pressable>

                      </View>


                      <View
                        style={
                          styles.sportsGrid
                        }
                      >

                        <View
                          style={
                            styles.sportsStat
                          }
                        >

                          <Text
                            style={
                              styles.sportsStatLabel
                            }
                          >

                            Peso

                          </Text>


                          <Text
                            style={
                              styles.sportsStatValue
                            }
                          >

                            {
                              usuario.peso !== null
                                ? `${usuario.peso.toLocaleString(
                                    'es-ES',
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} kg`
                                : 'Sin definir'
                            }

                          </Text>

                        </View>


                        <View
                          style={
                            styles.sportsStat
                          }
                        >

                          <Text
                            style={
                              styles.sportsStatLabel
                            }
                          >

                            Altura

                          </Text>


                          <Text
                            style={
                              styles.sportsStatValue
                            }
                          >

                            {
                              usuario.alturaCm !== null
                                ? `${usuario.alturaCm} cm`
                                : 'Sin definir'
                            }

                          </Text>

                        </View>

                      </View>


                      <View
                        style={
                          styles.sportsSeparator
                        }
                      />


                      <View
                        style={
                          styles.sportsDetail
                        }
                      >

                        <Text
                          style={
                            styles.sportsDetailLabel
                          }
                        >

                          Objetivo

                        </Text>


                        <Text
                          style={
                            styles.sportsDetailValue
                          }
                        >

                          {
                            usuario.objetivo ??
                              'Sin definir'
                          }

                        </Text>

                      </View>


                      <View
                        style={
                          styles.sportsSeparator
                        }
                      />


                      <View
                        style={
                          styles.sportsDetail
                        }
                      >

                        <Text
                          style={
                            styles.sportsDetailLabel
                          }
                        >

                          Nivel

                        </Text>


                        <Text
                          style={
                            styles.sportsDetailValue
                          }
                        >

                          {
                            usuario.nivelExperiencia ??
                              'Sin definir'
                          }

                        </Text>

                      </View>

                    </View>


                    {/* CERRAR SESIÓN */}

                    <Pressable

                      style={({
                        pressed
                      }) => [

                        styles.logoutButton,

                        pressed &&
                          styles.buttonPressed,

                      ]}

                      onPress={
                        cerrarSesion
                      }

                    >

                      <Text
                        style={
                          styles.logoutText
                        }
                      >

                        Cerrar sesión

                      </Text>

                    </Pressable>

                  </>

                )
                : null
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


    profileCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 24,

      alignItems:
        'center',

      marginTop: 28,

    },


    avatar: {

      width: 82,

      height: 82,

      borderRadius: 41,

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

      fontSize: 34,

      fontWeight:
        '900',

    },


    profileName: {

      color:
        '#FFFFFF',

      fontSize: 24,

      fontWeight:
        '900',

      textAlign:
        'center',

      marginTop: 16,

    },


    profileEmail: {

      color:
        '#747E89',

      fontSize: 13,

      marginTop: 6,

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


    infoCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      paddingHorizontal: 18,

    },


    infoRow: {

      minHeight: 76,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      gap: 14,

    },


    infoLeft: {

      flex: 1,

    },


    infoLabel: {

      color:
        '#FFFFFF',

      fontSize: 14,

      fontWeight:
        '800',

    },


    infoValue: {

      color:
        '#9AA3AD',

      fontSize: 13,

      fontWeight:
        '700',

      maxWidth:
        '55%',

      textAlign:
        'right',

    },


    infoValueSmall: {

      color:
        '#9AA3AD',

      fontSize: 11,

      fontWeight:
        '700',

      maxWidth:
        '58%',

      textAlign:
        'right',

    },


    separator: {

      height: 1,

      backgroundColor:
        '#252D36',

    },


    sportsCard: {

      backgroundColor:
        '#151B22',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#252D36',

      padding: 20,

      marginTop: 24,

    },


    sportsHeader: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      gap: 14,

    },


    sportsHeaderInfo: {

      flex: 1,

    },


    sportsLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      letterSpacing: 2,

    },


    sportsTitle: {

      color:
        '#FFFFFF',

      fontSize: 19,

      fontWeight:
        '900',

      marginTop: 7,

    },


    editButton: {

      minWidth: 72,

      height: 38,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        '#303842',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 14,

    },


    editButtonText: {

      color:
        '#FFFFFF',

      fontSize: 12,

      fontWeight:
        '800',

    },


    sportsGrid: {

      flexDirection:
        'row',

      gap: 12,

      marginTop: 20,

    },


    sportsStat: {

      flex: 1,

      backgroundColor:
        '#11171D',

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        '#202830',

      padding: 15,

    },


    sportsStatLabel: {

      color:
        '#717A84',

      fontSize: 9,

      fontWeight:
        '800',

      textTransform:
        'uppercase',

      letterSpacing: 1,

    },


    sportsStatValue: {

      color:
        '#FFFFFF',

      fontSize: 16,

      fontWeight:
        '900',

      marginTop: 6,

    },


    sportsSeparator: {

      height: 1,

      backgroundColor:
        '#252D36',

      marginVertical: 16,

    },


    sportsDetail: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      gap: 16,

    },


    sportsDetailLabel: {

      color:
        '#747E89',

      fontSize: 12,

      fontWeight:
        '700',

    },


    sportsDetailValue: {

      flex: 1,

      color:
        '#FFFFFF',

      fontSize: 13,

      fontWeight:
        '800',

      textAlign:
        'right',

    },


    logoutButton: {

      height: 54,

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        '#5B2D2D',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 24,

    },


    logoutText: {

      color:
        '#FF7B7B',

      fontSize: 14,

      fontWeight:
        '900',

    },

  });