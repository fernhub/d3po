import { FieldValues, useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { api } from "../utils";

import { HttpError } from "shared/exceptions/HttpError";

export default function SignupForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: FieldValues) {
    try {
      const res = await api.handleSignup(values.name, values.email, values.password);
      console.log(res);
    } catch (e) {
      if (e instanceof HttpError) {
        console.log(e);
      } else {
        console.log(e);
      }
    }
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
    </form>
  );
}
