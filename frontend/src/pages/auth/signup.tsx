import { PasswordInput } from "@/components/custom/password-input";
import { Button } from "@/components/ui/button";
import { LabelInput } from "@/components/custom/labelledInput";
import { FormEvent, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { signUpSchema, formatZodErrors } from "@/schemas/schema";
import api from "@/services/api";
import { useUserStore } from "@/store/user";
import { isAxiosError } from "axios";

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useUserStore().setUser;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = signUpSchema.safeParse({
      username,
      email,
      password,
    });

    if (!result.success) {
      const errorMessages = formatZodErrors(result.error.errors)
        .split("\n")
        .map((line, index) => <div key={index}>{line}</div>);

      toast.error("Register Validation Error", {
        description: (
          <>
            <p>Please correct the following errors:</p>
            {errorMessages}
          </>
        ),
      });

      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setUser({
        username: response.data?.user?.username,
        email: response.data?.user?.email,
        id: response.data?.user?.id,
        accessToken: response.data?.user?.accessToken,
      });

      toast.success(`Welcome ${response.data?.user?.username}`);
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data?.message || "Registration failed");
      else toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="border-2 flex flex-col items-center justify-center gap-5 rounded-xl w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] p-4">
        <div className="text-3xl font-medium">Sign up</div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <LabelInput
            label="Username *"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="johndoe"
            name="username"
          />
          <LabelInput
            label="Email *"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="johndoe@mail.com"
            name="email"
          />
          <PasswordInput name="password" />

          <Button disabled={isLoading} className="mt-2">
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                Sign Up
                <Loader className="animate-spin" />
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
