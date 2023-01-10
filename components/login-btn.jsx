import { useSession, signIn, signOut } from "next-auth/react"
import {
  IconButton,
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  AvatarBadge,
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar
                name={session.user.name}
                src={session.user.image}
              />
              <Box>
                <FontAwesomeIcon><faChevronDown/></FontAwesomeIcon>
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem><Link href="/settings">Settings</Link></MenuItem>
            <MenuDivider />
            <MenuItem>
              <Link onClick={() => signOut()}>Sign Out</Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex >
    )
  }
  return (
    <>
      <Button onClick={() => signIn()}>Sign In</Button>
    </>
  )
}