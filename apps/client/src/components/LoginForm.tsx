import { FieldValues, useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.tsx";
import { HttpError } from "shared/exceptions/HttpError";

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();

  async function onSubmit(values: FieldValues) {
    console.log("submitting form");
    try {
      await login(values.loginEmail, values.loginPassword);
    } catch (e) {
      if (e instanceof HttpError) {
        console.log(e.message);
        console.log(e.code);
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
      <FormControl
        isInvalid={errors.loginEmail !== undefined || errors.loginPassword !== undefined}>
        <FormLabel htmlFor="loginEmail">Email</FormLabel>
        <Input
          id="loginEmail"
          type="email"
          placeholder="email"
          {...register("loginEmail", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          <>{errors.email && errors.email.message}</>
        </FormErrorMessage>
        <FormLabel htmlFor="loginPassword">Password</FormLabel>
        <Input
          id="loginPassword"
          type="password"
          placeholder="password"
          {...register("loginPassword", {
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
