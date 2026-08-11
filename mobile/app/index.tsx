import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
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

const API_URL = 'http://192.168.1.128:8080';

export default function Index() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  const iniciarSesion = async () => {
    if (!email.trim() || !contrasena.trim()) {
      Alert.alert(
        'Faltan datos',
        'Introduce tu correo y tu contraseña.'
      );
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `${API_URL}/api/usuarios/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            contrasena: contrasena,
          }),
        }
      );

      if (!response.ok) {
        Alert.alert(
          'No se pudo iniciar sesión',
          'Comprueba el correo y la contraseña.'
        );
        return;
      }

      const data = await response.json();

      const token =
        typeof data === 'string'
          ? data
          : data.token ??
            data.jwt ??
            data.accessToken;

      if (!token) {
        Alert.alert(
          'Error',
          'El servidor respondió correctamente, pero no encontramos el token.'
        );
        console.log('Respuesta login:', data);
        return;
      }

      await AsyncStorage.setItem(
        'fittrack_token',
        token
      );

      setAutenticado(true);

    } catch (error) {
      console.log(error);

      Alert.alert(
        'No se puede conectar',
        'Comprueba que el backend esté encendido y que el iPhone y el PC estén conectados a la misma red.'
      );

    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(
      'fittrack_token'
    );

    setAutenticado(false);
    setContrasena('');
  };

  if (autenticado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoText}>FT</Text>
          </View>

          <Text style={styles.successTitle}>
            Sesión iniciada
          </Text>

          <Text style={styles.successText}>
            El móvil ya está conectado con tu backend de FitTrack.
          </Text>

          <Pressable
            style={styles.logoutButton}
            onPress={cerrarSesion}
          >
            <Text style={styles.logoutText}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.content}>

          <View style={styles.logo}>
            <Text style={styles.logoText}>
              FT
            </Text>
          </View>

          <Text style={styles.title}>
            FitTrack
          </Text>

          <Text style={styles.subtitle}>
            Tu progreso. Tus entrenamientos.
          </Text>

          <View style={styles.form}>

            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <TextInput
              style={styles.input}
              placeholder="usuario@fittrack.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Text style={styles.label}>
              Contraseña
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Tu contraseña"
              placeholderTextColor="#6B7280"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
            />

            <Pressable
              style={[
                styles.button,
                cargando && styles.buttonDisabled,
              ]}
              onPress={iniciarSesion}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>
                  Iniciar sesión
                </Text>
              )}
            </Pressable>

          </View>

          <Text style={styles.footer}>
            FITTRACK
          </Text>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logoText: {
    color: '#0B0F14',
    fontSize: 25,
    fontWeight: '900',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },

  subtitle: {
    color: '#8D96A0',
    fontSize: 17,
    marginTop: 8,
    marginBottom: 42,
  },

  form: {
    gap: 12,
  },

  label: {
    color: '#C8CDD3',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  input: {
    height: 56,
    backgroundColor: '#151B22',
    borderWidth: 1,
    borderColor: '#252D36',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontSize: 16,
  },

  button: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '800',
  },

  footer: {
    color: '#404852',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 46,
  },

  successContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },

  successText: {
    color: '#8D96A0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },

  logoutButton: {
    marginTop: 35,
    paddingHorizontal: 25,
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#303841',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});