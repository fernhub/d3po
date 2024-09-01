import { FieldValues, useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { signup } = useAuth();

  async function onSubmit(values: FieldValues) {
    signup(values.name, values.email, values.password);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={
          errors.name !== undefined || errors.email !== undefined || errors.password !== undefined
        }>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          type="name"
          placeholder="name"
          {...register("name", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          <>{errors.name && errors.name.message}</>
        </FormErrorMessage>

        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="email"
          {...register("email", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          <>{errors.email && errors.email.message}</>
        </FormErrorMessage>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          type="password"
          placeholder="password"
          {...register("password", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          <>{errors.password && errors.password.message}</>
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="green" isLoading={isSubmitting} type="submit">
        Create Account
      </Button>
      <>
        {errors.root && errors.root.serverError && (
          <p className="login-error">Error: {errors.root.serverError.message}</p>
        )}
      </>
    </form>
  );
}
