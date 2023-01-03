import {
  Container,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";
import api from "../variables/api";
import Header from "./Header";

export function Admin() {
  const [cliente, setCliente] = useState([]);
  const [creditos, setCreditos] = useState(0);
  const [newMovie, setMovie] = useState({
    nombre: "",
    poster: "",
    downsized_poster: "",
    precio: 100,
    asientos: 50,
    horarios: ["13:00", "16:00", "20:00"],
  });

  const toast = useToast();

  //QUITAR LO DEL TOKEN PORQUE YA LO TENEMOS EN EL LOCALSTORAGE
  //Y MANEJAR EN UN FORMULARIO CUANDO LE ENVIO LOS CREDITOS

  const { getStorage } = useStorage();
  const logUser = getStorage();
  const { token } = logUser;
  useEffect(() => {
    fetch(`${api}/clientes`, {
      method: "GET",
      headers: new Headers({
        "x-access-token": token,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.error) {
          return toast({
            title: "Algo Salio Mal!",
            description: res.error,
            status: Object.keys(res)[0],
            isClosable: true,
          });
        }
        console.log("?");
        setCliente(res);
      });
  }, []);

  const handleCreditosChange = (e) => {
    setCreditos(e.target.value);
  };
  const handleCreditosSubmit = (e, clientId) => {
    console.log("hpña");
    e.preventDefault();
    console.log(clientId);
    const id = clientId;
    fetch(
      `${api}/clientes/${id}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ creditos: creditos }),
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          return toast({
            title: "Bien hecho",
            description: res.success,
            status: Object.keys(res)[0],
            isClosable: true,
          });
        }
        return toast({
          title: "Algo Salio mal",
          description: "no se encontro el id",
          status: "error",
          isClosable: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleCarteleraChange=(e) => {
    setMovie({
        ...newMovie,
        [e.target.name]: e.target.value
    })
  } 

  const handleCarteleraSubmit=(e) => {
    e.preventDefault()
    console.log(newMovie)
    fetch(`${api}/cartelera`, {
        method: 'POST',
        mode: 'cors',
        headers: {
           'Content-Type': 'application/json',
           "x-access-token": token
        },
        body: JSON.stringify(newMovie)
    })
    .then(response => response.json())
    .then(res => {
        if(res.error) {
            return toast({
                title: "Error",
                description: res.error,
                status: Object.keys(res)[0],
                isClosable: true,
            })
        }
        return toast({
            title: "Perfecto!",
            description: res.success,
            status: Object.keys(res)[0],
            isClosable: true
        })
    })
    
    .catch(error => console.log(error))
  }
  const filterClients = cliente.filter((cli) => cli.rol !== "admin");

  return (
    <>
      <Header />
      <Container maxW="container.xl" my="50px">
        <Tabs size="lg" variant="enclosed">
          <TabList>
            <Tab>Clientes</Tab>
            <Tab>Cartelera</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {cliente.length == 0
                ? "Ingresa tu token para ver la informacion"
                : filterClients.map(
                    ({
                      nombre,
                      apellido,
                      correo,
                      telefono,
                      creditos,
                      rol,
                      _id,
                    }) => (
                      <Card key={_id}>
                        <CardHeader>
                          <Heading size="md" color="white">
                            {nombre} {apellido}
                          </Heading>
                        </CardHeader>
                        <CardBody color="white" fontFamily="heading">
                          <Stack divider={<StackDivider />} spacing="4">
                            <Box>
                              <Heading size="xs" textTransform="uppercase">
                                Correo Electronico
                              </Heading>
                              <Text pt="2" fontSize="sm">
                                {correo}
                              </Text>
                            </Box>
                            <Box>
                              <Heading size="xs" textTransform="uppercase">
                                Rol de Usuario
                              </Heading>
                              <Text pt="2" fontSize="sm">
                                {rol}
                              </Text>
                            </Box>
                            <Box>
                              <Heading size="xs" textTransform="uppercase">
                                Telefono
                              </Heading>
                              <Text pt="2" fontSize="sm">
                                {telefono}
                              </Text>
                            </Box>
                            <Box>
                              <Heading size="xs" textTransform="uppercase">
                                Cantidad de Creditos
                              </Heading>
                              <Text>{creditos}</Text>
                              <Box
                                as="form"
                                onSubmit={(e) => handleCreditosSubmit(e, _id)}
                                display="flex"
                                gap="10px"
                              >
                                <FormControl>
                                  <Input
                                    w="80px"
                                    defaultValue={0}
                                    onChange={handleCreditosChange}
                                  ></Input>
                                </FormControl>

                                <Button type="submit" bg="white" color="main">
                                  Añadir Creditos
                                </Button>
                              </Box>
                            </Box>
                          </Stack>
                        </CardBody>
                      </Card>
                    )
                  )}
            </TabPanel>
            <TabPanel>
              <Box
                as="form"
                display="flex"
                flexDirection="column"
                gap="20px"
                onSubmit={handleCarteleraSubmit}
              >
                <FormControl>
                  <FormLabel
                    color="white"
                    fontFamily="heading"
                    fontWeight="bold"
                  >
                    Nombre
                  </FormLabel>
                  <Input
                    type={"text"}
                    placeholder="nombre de la pelicula"
                    id="nombre"
                    name="nombre"
                    color="white"
                    fontFamily="heading"
                    onChange={handleCarteleraChange}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel
                    color="white"
                    fontWeight="bold"
                    fontFamily="heading"
                  >
                    Imagen
                  </FormLabel>
                  <Input
                    type={"text"}
                    placeholder="url del poster"
                    id="poster"
                    name="poster"
                    color="white"
                    fontFamily="heading"
                    onChange={handleCarteleraChange}
                  ></Input>
                </FormControl>

                <FormControl>
                  <FormLabel
                    color="white"
                    fontWeight="bold"
                    fontFamily="heading"
                  >
                    Imagen comprimida
                  </FormLabel>
                  <Input
                    type={"text"}
                    placeholder="url de la imagen pequeña"
                    id="downsized_poster"
                    name="downsized_poster"
                    color="white"
                    fontFamily="heading"
                    onChange={handleCarteleraChange}
                  ></Input>
                </FormControl>

                <Button
                  mt={"6"}
                  border="2px"
                  borderColor={"gray.400"}
                  type="submit"
                  color="main"
                  fontSize="xl"
                  fontFamily="heading"
                  fontWeight="bold"
                >
                  Agregar
                </Button>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}