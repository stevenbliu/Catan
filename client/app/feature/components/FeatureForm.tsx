"use client";

import { useForm } from "react-hook-form";
import Button from "../../../shared_components/UI/Button";
import Input from "../../../shared_components/UI/Input";

import { FeatureItem } from "../types/feature";

// interface FeatureItem {
//   name: string;
//   message: string;
//   email: string;
//   rating: number;
// }

interface FeatureFormProps {
  onSubmit: (data: FeatureItem) => Promise<void>;
}

export default function FeatureForm({ onSubmit }: FeatureFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeatureItem>({
    defaultValues: { name: "", description: "", email: "", rating: 0 },
  });

  const submitHandler = async (data: FeatureItem) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mb-6 flex flex-col sm:flex-row gap-2"
    >
      <Input
        placeholder="Name"
        inputProps={register("name",
          //  { required: "Name is required" }
          )}
        error={errors.name?.message}
      />

      <Input
        placeholder="Message"
        inputProps={register("description",
          //  { required: "Message is required" }
          )}
        error={errors.description?.message}
      />

      <Input
        placeholder="Email"
        inputProps={register("email", {
          required: "Email is required",
          // pattern: {
          //   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          //   message: "Invalid email format"
          // }
        })}
        error={errors.email?.message}
      />

      <Input
        placeholder="Rating"
        type="number"
        inputProps={register("rating", 
          { required: "Rating is required",
          min: { value: 0, message: "Rating must be at least 0" },
          max: { value: 5, message: "Rating cannot be more than 5" }
         })}
        error={errors.rating?.message}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
