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
  FlatList,
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


type EjercicioCatalogoApi = {

  id: number;

  sourceId: string;

  nombre: string;

  grupoFitTrack: string;

  equipamiento: string;

  musculoPrincipal: string;

  nivel: string | null;
};


const ORDEN_GRUPOS = [

  'Pecho',

  'Espalda',

  'Hombros',

  'Bíceps',

  'Tríceps',

  'Cuádriceps',

  'Isquios',

  'Glúteos',

  'Gemelos',

  'Core',

  'Antebrazos',

  'Abductores',

  'Aductores',

];


export default function NuevoEjercicio() {

  const {

    entrenamientoId,

    entrenamientoNombre,

  } =
    useLocalSearchParams<{

      entrenamientoId?: string;

      entrenamientoNombre?: string;

    }>();


  const [
    ejerciciosCatalogo,
    setEjerciciosCatalogo,
  ] =
    useState<
      EjercicioCatalogoApi[]
    >(
      []
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
    grupoSeleccionado,
    setGrupoSeleccionado,
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    materialSeleccionado,
    setMaterialSeleccionado,
  ] =
    useState(
      'Todos'
    );


  const [
    busqueda,
    setBusqueda,
  ] =
    useState(
      ''
    );


  /*
   * CARGAR CATÁLOGO DESDE BACKEND
   */

  useEffect(() => {

    let activo =
      true;


    const cargarCatalogo =
      async () => {

        try {

          setCargando(
            true
          );

          setErrorCarga(
            false
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


          const response =
            await fetch(

              `${API_URL}/api/catalogo-ejercicios`,

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
            EjercicioCatalogoApi[] =
              await response.json();


          if (!activo) {
            return;
          }


          setEjerciciosCatalogo(
            data
          );


        } catch (error) {

          console.log(
            'Error cargando catálogo:',
            error
          );


          if (activo) {

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


    cargarCatalogo();


    return () => {

      activo =
        false;

    };

  }, []);


  /*
   * GRUPOS DISPONIBLES
   */

  const gruposMusculares =
    useMemo(() => {

      const gruposDisponibles =
        new Set(

          ejerciciosCatalogo.map(
            ejercicio =>
              ejercicio.grupoFitTrack
          )

        );


      return ORDEN_GRUPOS.filter(
        grupo =>
          gruposDisponibles.has(
            grupo
          )
      );

    }, [
      ejerciciosCatalogo,
    ]);


  /*
   * MATERIALES DISPONIBLES
   */

  const materiales =
    useMemo(() => {

      if (!grupoSeleccionado) {

        return [
          'Todos',
        ];

      }


      const valores =
        ejerciciosCatalogo

          .filter(
            ejercicio =>
              ejercicio
                .grupoFitTrack ===
              grupoSeleccionado
          )

          .map(
            ejercicio =>
              ejercicio.equipamiento
          );


      const materialesUnicos =
        Array.from(
          new Set(
            valores
          )
        )

          .sort(
            (
              a,
              b
            ) =>
              a.localeCompare(
                b,
                'es'
              )
          );


      return [

        'Todos',

        ...materialesUnicos,

      ];

    }, [

      grupoSeleccionado,

      ejerciciosCatalogo,

    ]);


  /*
   * FILTRADO
   */

  const ejerciciosFiltrados =
    useMemo(() => {

      if (!grupoSeleccionado) {

        return [];

      }


      const texto =
        busqueda
          .trim()
          .toLocaleLowerCase(
            'es'
          );


      return ejerciciosCatalogo

        .filter(
          ejercicio =>
            ejercicio
              .grupoFitTrack ===
            grupoSeleccionado
        )

        .filter(
          ejercicio =>

            materialSeleccionado ===
              'Todos' ||

            ejercicio
              .equipamiento ===
              materialSeleccionado

        )

        .filter(
          ejercicio =>

            !texto ||

            ejercicio
              .nombre
              .toLocaleLowerCase(
                'es'
              )
              .includes(
                texto
              )

        )

        .sort(
          (
            a,
            b
          ) =>
            a.nombre.localeCompare(
              b.nombre,
              'es'
            )
        );

    }, [

      grupoSeleccionado,

      materialSeleccionado,

      busqueda,

      ejerciciosCatalogo,

    ]);


  /*
   * SELECCIONAR GRUPO
   */

  const seleccionarGrupo = (
    grupo: string
  ) => {

    setGrupoSeleccionado(
      grupo
    );

    setMaterialSeleccionado(
      'Todos'
    );

    setBusqueda(
      ''
    );

  };


  /*
   * VOLVER A GRUPOS
   */

  const volverAGrupos = () => {

    setGrupoSeleccionado(
      null
    );

    setMaterialSeleccionado(
      'Todos'
    );

    setBusqueda(
      ''
    );

  };


  /*
   * ABRIR DETALLE
   */

  const abrirEjercicio = (
    ejercicio:
      EjercicioCatalogoApi
  ) => {

    router.push({

      pathname:
        '/detalle-catalogo-ejercicio',

      params: {

        ejercicioId:
          String(
            ejercicio.id
          ),

        entrenamientoId:
          entrenamientoId ??
          '',

        entrenamientoNombre:
          entrenamientoNombre ??
          'Entrenamiento',

      },

    });

  };


  /*
   * ICONOS DE GRUPOS
   */

  const iconoGrupo = (
    grupo: string
  ) => {

    switch (grupo) {

      case 'Pecho':
        return '◉';

      case 'Espalda':
        return '◆';

      case 'Hombros':
        return '▲';

      case 'Bíceps':
        return '●';

      case 'Tríceps':
        return '●';

      case 'Cuádriceps':
        return '▰';

      case 'Isquios':
        return '▰';

      case 'Glúteos':
        return '⬢';

      case 'Gemelos':
        return '▴';

      case 'Core':
        return '✦';

      case 'Antebrazos':
        return '◆';

      case 'Abductores':
        return '◇';

      case 'Aductores':
        return '◇';

      default:
        return '●';

    }

  };


  /*
   * TARJETA EJERCICIO
   */

  const renderEjercicio = ({
    item,
  }: {
    item:
      EjercicioCatalogoApi;
  }) => {

    return (

      <Pressable

        style={({
          pressed
        }) => [

          styles.exerciseCard,

          pressed &&
            styles.pressed,

        ]}

        onPress={() =>
          abrirEjercicio(
            item
          )
        }

      >

        <View
          style={
            styles.exerciseVisual
          }
        >

          <View
            style={
              styles.miniHead
            }
          />


          <View
            style={
              styles.miniBody
            }
          />

        </View>


        <View
          style={
            styles.exerciseInfo
          }
        >

          <Text
            style={
              styles.exerciseName
            }
          >

            {
              item.nombre
            }

          </Text>


          <View
            style={
              styles.exerciseMeta
            }
          >

            <Text
              style={
                styles.exerciseMaterial
              }
            >

              {
                item.equipamiento
              }

            </Text>


            <Text
              style={
                styles.metaDot
              }
            >

              •

            </Text>


            <Text
              style={
                styles.exerciseMuscle
              }
            >

              {
                item
                  .musculoPrincipal
              }

            </Text>

          </View>

        </View>


        <Text
          style={
            styles.arrow
          }
        >

          ›

        </Text>

      </Pressable>

    );

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

            Cargando catálogo...

          </Text>

        </View>

      </SafeAreaView>

    );

  }


  /*
   * ERROR DE CONEXIÓN
   */

  if (errorCarga) {

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
              styles.emptyTitle
            }
          >

            No se pudo cargar el catálogo

          </Text>


          <Text
            style={
              styles.emptyText
            }
          >

            Comprueba que el backend de FitTrack está encendido.

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
   * SELECCIÓN DE GRUPO MUSCULAR
   */

  if (
    !grupoSeleccionado
  ) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

        <FlatList<string>

          data={
            gruposMusculares
          }

          keyExtractor={(
            item
          ) =>
            item
          }

          numColumns={
            2
          }

          columnWrapperStyle={
            styles.groupRow
          }

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.groupList
          }

          ListHeaderComponent={

            <View>

              <View
                style={
                  styles.header
                }
              >

                <Pressable

                  style={
                    styles.backButton
                  }

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

                    AÑADIR EJERCICIO

                  </Text>


                  <Text
                    style={
                      styles.title
                    }
                  >

                    ¿Qué vas a entrenar?

                  </Text>

                </View>

              </View>


              <View
                style={
                  styles.trainingCard
                }
              >

                <Text
                  style={
                    styles.trainingLabel
                  }
                >

                  ENTRENAMIENTO ACTUAL

                </Text>


                <Text
                  style={
                    styles.trainingName
                  }
                >

                  {
                    entrenamientoNombre ??
                    'Entrenamiento'
                  }

                </Text>

              </View>


              <Text
                style={
                  styles.description
                }
              >

                Selecciona un grupo muscular para ver sus ejercicios.

              </Text>

            </View>

          }

          renderItem={({
            item
          }) => (

            <Pressable

              style={({
                pressed
              }) => [

                styles.groupCard,

                pressed &&
                  styles.pressed,

              ]}

              onPress={() =>
                seleccionarGrupo(
                  item
                )
              }

            >

              <View
                style={
                  styles.groupIcon
                }
              >

                <Text
                  style={
                    styles.groupIconText
                  }
                >

                  {
                    iconoGrupo(
                      item
                    )
                  }

                </Text>

              </View>


              <Text
                style={
                  styles.groupName
                }
              >

                {
                  item
                }

              </Text>


              <Text
                style={
                  styles.groupArrow
                }
              >

                ›

              </Text>

            </Pressable>

          )}

        />

      </SafeAreaView>

    );

  }


  /*
   * LISTA DE EJERCICIOS
   */

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <View
        style={
          styles.catalogContainer
        }
      >


        {/* CABECERA */}

        <View
          style={
            styles.header
          }
        >

          <Pressable

            style={
              styles.backButton
            }

            onPress={
              volverAGrupos
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

              GRUPO MUSCULAR

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
                grupoSeleccionado
              }

            </Text>

          </View>

        </View>


        {/* BUSCADOR */}

        <View
          style={
            styles.searchBox
          }
        >

          <Text
            style={
              styles.searchIcon
            }
          >

            ⌕

          </Text>


          <TextInput

            style={
              styles.searchInput
            }

            placeholder=
              "Buscar ejercicio..."

            placeholderTextColor=
              "#65707B"

            value={
              busqueda
            }

            onChangeText={
              setBusqueda
            }

            autoCorrect={
              false
            }

          />


          {
            busqueda.length >
              0 && (

              <Pressable
                onPress={() =>
                  setBusqueda(
                    ''
                  )
                }
              >

                <Text
                  style={
                    styles.clearSearch
                  }
                >

                  ×

                </Text>

              </Pressable>

            )
          }

        </View>


        {/* FILTROS */}

        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.filters
          }

        >

          {
            materiales.map(
              material => {

                const activo =
                  materialSeleccionado ===
                  material;


                return (

                  <Pressable

                    key={
                      material
                    }

                    style={[

                      styles.filterButton,

                      activo &&
                        styles.filterButtonActive,

                    ]}

                    onPress={() =>
                      setMaterialSeleccionado(
                        material
                      )
                    }

                  >

                    <Text
                      style={[

                        styles.filterText,

                        activo &&
                          styles.filterTextActive,

                      ]}
                    >

                      {
                        material
                      }

                    </Text>

                  </Pressable>

                );

              }
            )
          }

        </ScrollView>


        {/* RESULTADOS */}

        <View
          style={
            styles.resultHeader
          }
        >

          <Text
            style={
              styles.resultTitle
            }
          >

            Ejercicios

          </Text>


          <Text
            style={
              styles.resultCount
            }
          >

            {
              ejerciciosFiltrados
                .length
            }

          </Text>

        </View>


        <FlatList<EjercicioCatalogoApi>

          data={
            ejerciciosFiltrados
          }

          keyExtractor={(
            item
          ) =>
            String(
              item.id
            )
          }

          renderItem={
            renderEjercicio
          }

          showsVerticalScrollIndicator={
            false
          }

          keyboardShouldPersistTaps=
            "handled"

          contentContainerStyle={
            styles.exerciseList
          }

          ListEmptyComponent={

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

                No encontramos ejercicios

              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >

                Prueba con otra búsqueda o cambia el filtro.

              </Text>

            </View>

          }

        />

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


    loadingContainer: {
      flex: 1,
      alignItems:
        'center',
      justifyContent:
        'center',
    },


    loadingText: {
      color:
        '#808A94',
      fontSize: 13,
      marginTop: 15,
    },


    errorContainer: {
      flex: 1,
      alignItems:
        'center',
      justifyContent:
        'center',
      paddingHorizontal: 30,
    },


    errorButton: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 14,
      paddingHorizontal: 25,
      paddingVertical: 14,
      marginTop: 22,
    },


    errorButtonText: {
      color:
        '#0B0F14',
      fontWeight:
        '900',
    },


    catalogContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 14,
    },


    groupList: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 40,
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


    backText: {
      color:
        '#FFFFFF',
      fontSize: 32,
      lineHeight: 34,
    },


    headerInfo: {
      flex: 1,
      marginLeft: 15,
    },


    smallTitle: {
      color:
        '#717A84',
      fontSize: 10,
      fontWeight:
        '800',
      letterSpacing:
        1.8,
    },


    title: {
      color:
        '#FFFFFF',
      fontSize: 25,
      fontWeight:
        '900',
      marginTop: 3,
    },


    trainingCard: {
      backgroundColor:
        '#151B22',
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        '#252D36',
      padding: 18,
      marginTop: 27,
    },


    trainingLabel: {
      color:
        '#68727D',
      fontSize: 9,
      fontWeight:
        '800',
      letterSpacing:
        1.4,
    },


    trainingName: {
      color:
        '#FFFFFF',
      fontSize: 18,
      fontWeight:
        '800',
      marginTop: 5,
    },


    description: {
      color:
        '#808A94',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 22,
      marginBottom: 18,
    },


    groupRow: {
      gap: 11,
    },


    groupCard: {
      flex: 1,
      minHeight: 135,
      backgroundColor:
        '#151B22',
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        '#252D36',
      padding: 17,
      marginBottom: 11,
      position:
        'relative',
    },


    groupIcon: {
      width: 39,
      height: 39,
      borderRadius: 12,
      backgroundColor:
        '#FFFFFF',
      alignItems:
        'center',
      justifyContent:
        'center',
    },


    groupIconText: {
      color:
        '#0B0F14',
      fontSize: 17,
      fontWeight:
        '900',
    },


    groupName: {
      color:
        '#FFFFFF',
      fontSize: 16,
      fontWeight:
        '800',
      marginTop: 18,
    },


    groupArrow: {
      position:
        'absolute',
      right: 15,
      bottom: 10,
      color:
        '#606A75',
      fontSize: 25,
    },


    pressed: {
      opacity: 0.65,
    },


    searchBox: {
      height: 55,
      borderRadius: 16,
      backgroundColor:
        '#151B22',
      borderWidth: 1,
      borderColor:
        '#252D36',
      flexDirection:
        'row',
      alignItems:
        'center',
      marginTop: 25,
      paddingHorizontal: 15,
    },


    searchIcon: {
      color:
        '#7A848F',
      fontSize: 22,
      marginRight: 10,
    },


    searchInput: {
      flex: 1,
      color:
        '#FFFFFF',
      fontSize: 15,
    },


    clearSearch: {
      color:
        '#747E89',
      fontSize: 25,
      paddingLeft: 10,
    },


    filters: {
      paddingTop: 15,
      paddingBottom: 12,
      gap: 8,
    },


    filterButton: {
      height: 37,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        '#252D36',
      backgroundColor:
        '#151B22',
      paddingHorizontal: 14,
      alignItems:
        'center',
      justifyContent:
        'center',
    },


    filterButtonActive: {
      backgroundColor:
        '#FFFFFF',
      borderColor:
        '#FFFFFF',
    },


    filterText: {
      color:
        '#8A939D',
      fontSize: 12,
      fontWeight:
        '700',
    },


    filterTextActive: {
      color:
        '#0B0F14',
    },


    resultHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      marginTop: 5,
      marginBottom: 12,
    },


    resultTitle: {
      color:
        '#FFFFFF',
      fontSize: 19,
      fontWeight:
        '800',
    },


    resultCount: {
      minWidth: 29,
      height: 29,
      borderRadius: 9,
      backgroundColor:
        '#252D36',
      color:
        '#FFFFFF',
      textAlign:
        'center',
      lineHeight: 29,
      fontWeight:
        '800',
      fontSize: 12,
    },


    exerciseList: {
      paddingBottom: 45,
    },


    exerciseCard: {
      minHeight: 82,
      backgroundColor:
        '#151B22',
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        '#252D36',
      marginBottom: 10,
      paddingHorizontal: 14,
      flexDirection:
        'row',
      alignItems:
        'center',
    },


    exerciseVisual: {
      width: 51,
      height: 51,
      borderRadius: 15,
      backgroundColor:
        '#202832',
      alignItems:
        'center',
      position:
        'relative',
      marginRight: 13,
    },


    miniHead: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor:
        '#FFFFFF',
      marginTop: 8,
    },


    miniBody: {
      width: 17,
      height: 22,
      borderRadius: 8,
      backgroundColor:
        '#AEB5BC',
      marginTop: 2,
    },


    exerciseInfo: {
      flex: 1,
      paddingVertical: 13,
    },


    exerciseName: {
      color:
        '#FFFFFF',
      fontSize: 15,
      fontWeight:
        '800',
    },


    exerciseMeta: {
      flexDirection:
        'row',
      alignItems:
        'center',
      marginTop: 6,
      flexWrap:
        'wrap',
    },


    exerciseMaterial: {
      color:
        '#818B95',
      fontSize: 10,
      fontWeight:
        '700',
    },


    metaDot: {
      color:
        '#4D5660',
      fontSize: 11,
      marginHorizontal: 6,
    },


    exerciseMuscle: {
      color:
        '#69737D',
      fontSize: 10,
      fontWeight:
        '600',
    },


    arrow: {
      color:
        '#626C77',
      fontSize: 29,
      marginLeft: 8,
    },


    empty: {
      alignItems:
        'center',
      paddingTop: 70,
      paddingHorizontal: 30,
    },


    emptyTitle: {
      color:
        '#FFFFFF',
      fontSize: 17,
      fontWeight:
        '800',
      textAlign:
        'center',
    },


    emptyText: {
      color:
        '#747E89',
      fontSize: 13,
      lineHeight: 19,
      textAlign:
        'center',
      marginTop: 8,
    },

  });