import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useI18n } from "~/i18n";

interface ResetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ResetCodeModal = ({ isOpen, onClose, onReset }: ResetCodeModalProps) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(5px)" />
      <ModalContent
        bg="brand.secondary"
        borderColor="whiteAlpha.100"
        borderWidth={1}
        mx={4}
        maxW="md"
      >
        <ModalHeader color="white">{t("problem.resetCode")}</ModalHeader>
        <ModalCloseButton color="gray.400" />
        <ModalBody>
          <Text color="gray.300">{t("problem.resetConfirm")}</Text>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            onClick={onClose}
            color="gray.300"
            _hover={{ bg: "whiteAlpha.100" }}
          >
            {t("problem.cancel")}
          </Button>
          <Button
            bg="rgba(34, 197, 94, 0.1)"
            color="rgb(34, 197, 94)"
            _hover={{
              bg: "rgba(34, 197, 94, 0.2)",
            }}
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            {t("problem.resetCode")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetCodeModal;
