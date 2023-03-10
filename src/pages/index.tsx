import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Stack,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import { Message } from "~/interfaces/message";
import CTLogo from "~/components/canadianTireLogo";

const SalesChat: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card sx={{ textAlign: "left" }} shadow="sm">
      <Flex>
        <Box sx={{ height: 40, width: 40 }}>
          <CTLogo></CTLogo>
        </Box>
        {message}
      </Flex>
    </Card>
  );
};

const CustomerChat: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card shadow="sm" sx={{ textAlign: "right" }}>
      {message}{" "}
    </Card>
  );
};

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const client = api.useContext();

  const [data, setData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [text, setTextArea] = useState("");

  const onClick = async () => {
    data.push({
      message: text,
      person: "user",
    });
    setTextArea("");
    setLoading(true);
    try {
      const res = await client.example.chat.fetch(data);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Stack sx={{ overflowY: "auto", height: "100%" }}>
            {data.map((chat: Message) => {
              if (chat.person == "bot") {
                return <SalesChat message={chat.message} />;
              } else {
                return <CustomerChat message={chat.message} />;
              }
            })}
          </Stack>
        </Container>
        <Box sx={{ position: "absolute", bottom: "2vw", width: "100vw" }}>
          <Center>
            <Textarea
              sx={{ width: "70vw" }}
              onChange={(e) => setTextArea(e.target.value)}
            ></Textarea>
            <Button onClick={onClick} loading={loading}>
              Send
            </Button>
          </Center>
        </Box>
      </main>
    </>
  );
};

export default Home;
