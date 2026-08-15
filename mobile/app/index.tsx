import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';


const API_URL =
  'http://192.168.1.128:8080';


export default function Index() {

  const [
    email,
    setEmail,
  ] = useState('');


  const [
    contrasena,
    setContrasena,
  ] = useState('');


  const [
    cargando,
    setCargando,
  ] = useState(false);


  const [
    comprobandoSesion,
    setComprobandoSesion,
  ] = useState(true);


  /*
    AL ABRIR LA APP:

    Si ya existe un token,
    entramos directamente en Home.
  */

  useEffect(() => {

    comprobarSesion();

  }, []);


  const comprobarSesion =
    async () => {

      try {

        const token =
          await AsyncStorage.getItem(
            'fittrack_token'
          );


        if (token) {

          router.replace(
            '/home'
          );

          return;
        }


      } catch (error) {

        console.log(
          'Error comprobando sesión:',
          error
        );


      } finally {

        setComprobandoSesion(
          false
        );
      }

    };


  /*
    INICIAR SESIÓN
  */

  const iniciarSesion =
    async () => {

      if (
        !email.trim() ||
        !contrasena.trim()
      ) {

        Alert.alert(
          'Faltan datos',
          'Introduce tu correo y tu contraseña.'
        );

        return;
      }


      try {

        setCargando(true);


        const response =
          await fetch(

            `${API_URL}/api/usuarios/login`,

            {
              method: 'POST',

              headers: {

                'Content-Type':
                  'application/json',

              },

              body:
                JSON.stringify({

                  email:
                    email.trim(),

                  contrasena:
                    contrasena,

                }),
            }

          );


        if (!response.ok) {

          Alert.alert(
            'Inicio de sesión incorrecto',
            'Comprueba el correo y la contraseña.'
          );

          return;
        }


        const data =
          await response.json();


        const token =
          typeof data === 'string'

            ? data

            : data.token ??
              data.jwt ??
              data.accessToken;


        if (!token) {

          console.log(
            'Respuesta login:',
            data
          );


          Alert.alert(
            'Error',
            'El servidor no ha devuelto un token.'
          );

          return;
        }


        /*
          GUARDAMOS EL JWT
        */

        await AsyncStorage.setItem(
          'fittrack_token',
          token
        );


        /*
          ENTRAMOS EN HOME
        */

        router.replace(
          '/home'
        );


      } catch (error) {

        console.log(
          'Error de conexión:',
          error
        );


        Alert.alert(
          'No se puede conectar',
          'Comprueba que el backend esté funcionando y que el iPhone y el PC estén conectados a la misma red.'
        );


      } finally {

        setCargando(false);
      }

    };


  /*
    MIENTRAS COMPROBAMOS
    SI YA HAY SESIÓN
  */

  if (comprobandoSesion) {

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
            Cargando FitTrack...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  /*
    LOGIN
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


          {/* LOGO */}

          <View
            style={
              styles.logo
            }
          >

            <Text
              style={
                styles.logoText
              }
            >
              FT
            </Text>

          </View>


          {/* TITULO */}

          <Text
            style={
              styles.title
            }
          >
            FitTrack
          </Text>


          <Text
            style={
              styles.subtitle
            }
          >
            Tu progreso. Tus entrenamientos.
          </Text>


          {/* FORMULARIO */}

          <View
            style={
              styles.form
            }
          >


            <Text
              style={
                styles.label
              }
            >
              Correo electrónico
            </Text>


            <TextInput

              style={
                styles.input
              }

              placeholder=
                "usuario@fittrack.com"

              placeholderTextColor=
                "#6B7280"

              value={
                email
              }

              onChangeText={
                setEmail
              }

              autoCapitalize=
                "none"

              autoCorrect={
                false
              }

              keyboardType=
                "email-address"

              returnKeyType=
                "next"

            />


            <Text
              style={
                styles.label
              }
            >
              Contraseña
            </Text>


            <TextInput

              style={
                styles.input
              }

              placeholder=
                "Tu contraseña"

              placeholderTextColor=
                "#6B7280"

              value={
                contrasena
              }

              onChangeText={
                setContrasena
              }

              secureTextEntry

              returnKeyType=
                "done"

              onSubmitEditing={
                iniciarSesion
              }

            />


            <Pressable

              style={({ pressed }) => [

                styles.button,

                pressed &&
                  styles.buttonPressed,

                cargando &&
                  styles.buttonDisabled,

              ]}

              onPress={
                iniciarSesion
              }

              disabled={
                cargando
              }

            >

              {cargando ? (

                <ActivityIndicator
                  color="#0B0F14"
                />

              ) : (

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Iniciar sesión
                </Text>

              )}

            </Pressable>

          </View>


          <Text
            style={
              styles.footer
            }
          >
            FITTRACK
          </Text>


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


    loadingContainer: {

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    loadingText: {

      color:
        '#747E89',

      fontSize: 13,

      marginTop: 15,

    },


    content: {

      flex: 1,

      paddingHorizontal:
        28,

      justifyContent:
        'center',

    },


    logo: {

      width: 72,

      height: 72,

      borderRadius: 22,

      backgroundColor:
        '#FFFFFF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginBottom: 24,

    },


    logoText: {

      color:
        '#0B0F14',

      fontSize: 25,

      fontWeight:
        '900',

    },


    title: {

      color:
        '#FFFFFF',

      fontSize: 42,

      fontWeight:
        '800',

      letterSpacing:
        -1,

    },


    subtitle: {

      color:
        '#8D96A0',

      fontSize: 17,

      marginTop: 8,

      marginBottom: 42,

    },


    form: {

      gap: 12,

    },


    label: {

      color:
        '#C8CDD3',

      fontSize: 14,

      fontWeight:
        '600',

      marginTop: 4,

    },


    input: {

      height: 56,

      backgroundColor:
        '#151B22',

      borderWidth: 1,

      borderColor:
        '#252D36',

      borderRadius: 16,

      paddingHorizontal:
        18,

      color:
        '#FFFFFF',

      fontSize: 16,

    },


    button: {

      height: 58,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 16,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop: 16,

    },


    buttonPressed: {

      opacity: 0.8,

    },


    buttonDisabled: {

      opacity: 0.6,

    },


    buttonText: {

      color:
        '#0B0F14',

      fontSize: 16,

      fontWeight:
        '800',

    },


    footer: {

      color:
        '#404852',

      fontSize: 12,

      fontWeight:
        '700',

      letterSpacing: 4,

      textAlign:
        'center',

      marginTop: 46,

    },

  });