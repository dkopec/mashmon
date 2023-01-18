import Head from "next/head";
import Link from "next/link";
import { Container, Text, Heading } from "@chakra-ui/react";

export default function HomeLayout({ children }) {
    return (
        <>
            <Container>
                <Head>
                    <title>Mashmon the Game</title>
                </Head>

                <Heading>Mashmon</Heading>

                <Text>
                    Mash your Mosters, powered by {" "}
                    <Link target="_blank" href="https://replicate.com/lambdal/text-to-pokemon/">lambdal/text-to-pokemon</Link>
                </Text>

                {children}
            </Container>
        </>
    )
}