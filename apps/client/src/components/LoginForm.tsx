import { FieldValues, useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { api } from "../utils";
import { HttpError } from "shared/exceptions/HttpError";

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: FieldValues) {
    try {
      const res = await api.handleLogin(values.email, values.password);
      console.log(res);
    } catch (e) {
      if (e instanceof HttpError) {
        setError("root.serverError", {
          type: "manual",
          message: e.message,
        });
      } else {
        console.log(e);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.email !== undefined || errors.password !== undefined}>
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
        Login
      </Button>
      <>
        {errors.root && errors.root.serverError && (
          <p className="login-error">Error: {errors.root.serverError.message}</p>
        )}
      </>
    </form>
  );
}
