
import { Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react"
import Prediction from "../components/prediction";
import HomeLayout from "../components/home-layout";

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Text>Loading</Text>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Text>Sign In to get started.</Text>
    )
  }

  return (
    <Prediction></Prediction>
  )

}

Home.getLayout = function getLayout(page) {
  return (
    <HomeLayout>{page}</HomeLayout>
  )
}
