import { PasswordInput } from "@/components/custom/password-input";
import { Button } from "@/components/ui/button";
import { LabelInput } from "@/components/custom/labelledInput";
import { FormEvent, useState } from "react";
import { Loader } from "lucide-react";
import { formatZodErrors, loginSchema } from "@/schemas/schema";
import { toast } from "sonner";
import { useUserStore } from "@/store/user";
import api from "@/services/api";
import { isAxiosError } from "axios";

export default function Login() {
  const setUser = useUserStore().setUser;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      const errorMessages = formatZodErrors(result.error.errors)
        .split("\n")
        .map((line, index) => <div key={index}>{line}</div>);

      toast.error("Credentials Validation Error", {
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
      console.log(email, password)
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setUser({
        username: response.data?.user?.username,
        email: response.data?.user?.email,
        id: response.data?.user?.id,
      });

      toast.success(`Welcome back ${response.data?.user?.username}`);
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data?.message || "Login failed");
      else toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="border-2 flex flex-col items-center justify-center gap-5 rounded-xl w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] p-4">
        <div className="text-3xl font-medium">Login</div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <LabelInput
            label="Email *"
            className="w-full sm:max-w-[50%]"
            type="email"
            placeholder="johndoe@mail.com"
            name="email"
          />
          <PasswordInput name="password" />

          <Button disabled={isLoading} className="mt-2">
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                Login
                <Loader className="animate-spin" />
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}