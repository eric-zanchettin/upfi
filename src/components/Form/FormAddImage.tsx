import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface FormData {
  url: string;
  title: string;
  description: string;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: value => value[0].size <= 1000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: value => /image\/(jpeg|png|gif)/g.test(value[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      },
    },
    title: {
      // REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 Carácteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      }
    },
    description: {
      // REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  // MUTATION API POST REQUEST,
  const mutation = useMutation(async (formData: FormData) => {
    await api.post('/api/images', {...formData, url: imageUrl});
  }, {
    // ONSUCCESS MUTATION
    onSuccess: () => {
      queryClient.invalidateQueries('images')
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro',
        });
        return;
      }
      // EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(data)
      // SHOW SUCCESS TOAST
      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      // SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      // CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          // SEND IMAGE ERRORS
          setError={setError}
          trigger={trigger}
          // REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          // SEND TITLE ERRORS
          error={errors.title}
          // REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
          />

        <TextInput
          placeholder="Descrição da imagem..."
          // SEND DESCRIPTION ERRORS
          error={errors.description}
          // REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
