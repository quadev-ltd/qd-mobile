import { FormProvider, useForm } from 'react-hook-form';

const TestFormProvider: React.FC<{
  defaultValues?: object;
  children: React.ReactNode;
}> = ({ defaultValues = {}, children }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default TestFormProvider;
