import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../components/RHFTextfield";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { loginAsync } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../components/CircularLoader";

type LoginForm = {
  userId: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const methods = useForm<LoginForm>({
    mode: "onSubmit",
  });

  const { handleSubmit } = methods;

  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(loginAsync(data));

    if (loginAsync.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/dashboard");
    } else {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBFF] flex flex-col md:flex-row p-5 box-border">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <img
          src="/images/Group.webp"
          alt="Login Illustration"
          className="w-[280px] sm:w-[320px] md:w-full md:max-w-sm lg:max-w-md object-contain"
        />
      </div>

      <div className="w-full md:w-1/2 flex">
        <div className="w-full h-full border-[0.5px] border-[#60A5FA] bg-white flex items-center rounded-lg justify-center px-4 sm:px-6 lg:px-12 py-6">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <img
                src="/images/logo.png"
                alt="PrepRoute"
                className="h-7 sm:h-8"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Login</h2>

            <p className="text-gray-500 text-sm mb-6">
              Use your company provided Login credentials
            </p>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <RHFTextField
                  name="userId"
                  label="User ID"
                  placeholder="Enter User ID"
                  rules={{
                    required: "User ID is required",
                  }}
                />

                <RHFTextField
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                  type="password"
                  rules={{
                    required: "Password is required",
                  }}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="button"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <CircularLoader size={18} />
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
