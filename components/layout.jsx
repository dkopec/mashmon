import NavBar from "./navbar"
import Footer from "./footer"
import { Container } from "@chakra-ui/react"

export default function Layout({ children }) {
    return (
        <Container>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </Container>
    )
}