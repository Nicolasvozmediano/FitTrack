import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://192.168.1.128:8080';

function obtenerFechaHoy() {
  const hoy = new Date();

  const year = hoy.getFullYear();

  const month = String(
    hoy.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    hoy.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function NuevoEntrenamiento() {
  const [nombre, setNombre] =
    useState('');

  const [duracion, setDuracion] =
    useState('');

  const [fecha, setFecha] =
    useState(obtenerFechaHoy());

  const [guardando, setGuardando] =
    useState(false);

  const guardarEntrenamiento = async () => {
    if (!nombre.trim()) {
      Alert.alert(
        'Falta el nombre',
        'Escribe un nombre para el entrenamiento.'
      );

      return;
    }

    const duracionNumero =
      duracion.trim()
        ? Number(duracion)
        : null;

    if (
      duracionNumero !== null &&
      (
        Number.isNaN(duracionNumero) ||
        duracionNumero <= 0
      )
    ) {
      Alert.alert(
        'Duración incorrecta',
        'Introduce una duración mayor que 0.'
      );

      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
      Alert.alert(
        'Fecha incorrecta',
        'Utiliza el formato AAAA-MM-DD.'
      );

      return;
    }

    try {
      setGuardando(true);

      const token =
        await AsyncStorage.getItem(
          'fittrack_token'
        );

      if (!token) {
        router.replace('/');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/entrenamientos`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            nombre: nombre.trim(),

            fecha,

            duracionMinutos:
              duracionNumero,
          }),
        }
      );

      if (response.status === 401) {
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

      Alert.alert(
        'Entrenamiento creado',
        'La sesión se ha guardado correctamente.',
        [
          {
            text: 'Continuar',

            onPress: () =>
              router.back(),
          },
        ]
      );

    } catch (error) {
      console.log(
        'Error creando entrenamiento:',
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

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.header}>

            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.back()
              }
            >

              <Text style={styles.backText}>
                ‹
              </Text>

            </Pressable>

            <View>

              <Text style={styles.smallTitle}>
                FITTRACK
              </Text>

              <Text style={styles.title}>
                Nueva sesión
              </Text>

            </View>

          </View>


          <Text style={styles.subtitle}>
            Registra tu entrenamiento
          </Text>


          <View style={styles.form}>

            <Text style={styles.label}>
              Nombre
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ej. Pecho y tríceps"
              placeholderTextColor="#606A75"
              value={nombre}
              onChangeText={setNombre}
              autoCorrect={false}
            />


            <Text style={styles.label}>
              Fecha
            </Text>

            <TextInput
              style={styles.input}
              placeholder="2026-08-13"
              placeholderTextColor="#606A75"
              value={fecha}
              onChangeText={setFecha}
              keyboardType="numbers-and-punctuation"
            />


            <Text style={styles.helper}>
              Formato: AAAA-MM-DD
            </Text>


            <Text style={styles.label}>
              Duración
            </Text>

            <View style={styles.durationRow}>

              <TextInput
                style={[
                  styles.input,
                  styles.durationInput,
                ]}
                placeholder="60"
                placeholderTextColor="#606A75"
                value={duracion}
                onChangeText={setDuracion}
                keyboardType="number-pad"
              />

              <Text style={styles.minutes}>
                minutos
              </Text>

            </View>


            <Pressable
              style={({ pressed }) => [
                styles.saveButton,

                pressed &&
                  styles.saveButtonPressed,

                guardando &&
                  styles.saveButtonDisabled,
              ]}
              onPress={
                guardarEntrenamiento
              }
              disabled={guardando}
            >

              {guardando ? (

                <ActivityIndicator
                  color="#0B0F14"
                />

              ) : (

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Crear entrenamiento
                </Text>

              )}

            </Pressable>

          </View>

        </ScrollView>

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
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#151B22',
    borderWidth: 1,
    borderColor: '#252D36',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
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
    marginTop: 28,
  },

  form: {
    marginTop: 30,
  },

  label: {
    color: '#C8CDD3',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
    marginTop: 18,
  },

  input: {
    height: 58,
    backgroundColor: '#151B22',
    borderWidth: 1,
    borderColor: '#252D36',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontSize: 16,
  },

  helper: {
    color: '#59636E',
    fontSize: 12,
    marginTop: 7,
  },

  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  durationInput: {
    flex: 1,
  },

  minutes: {
    color: '#8D96A0',
    fontSize: 15,
    marginLeft: 14,
  },

  saveButton: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  saveButtonPressed: {
    opacity: 0.8,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '900',
  },

});