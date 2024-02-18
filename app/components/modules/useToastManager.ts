import { useToast } from "@chakra-ui/react";

export default function useToastManager() {
  const toast = useToast();

  const errorToast1 = () => {
    toast({
      title: "Error",
      status: "error",
      variant: "left-accent",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
  };

  const errorToast2 = (error: unknown) => {
    toast({
      title: "Error",
      description: `${error}`,
      status: "error",
      variant: "left-accent",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
  };

  const responseToast = (response: string) => {
    toast({
      description: response,
      status: "success",
      variant: "left-accent",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
  };

  return { errorToast1, errorToast2, responseToast };
}
