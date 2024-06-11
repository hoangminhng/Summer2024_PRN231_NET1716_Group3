import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
// import { useNavigate } from "react-router-dom";
import { loginByEmailPassword } from "../../../api/login";
import { useNavigate } from "react-router-dom";

const UserLogin: React.FC = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = () => {
    const loginStaff = async () => {
      if (email === "" || password === "") {
        toast.error("Please input all fields.", {
          duration: 2000,
        });
      } else {
        try {
          const response = await loginByEmailPassword(email, password);
          const responseData = response?.data;
          const user: LoginedUser = {
            accountId: responseData?.accountId,
            email: responseData?.email,
            isLoginWithGmail: responseData?.isLoginWithGmail,
            isNewAccount: responseData?.isNewAccount,
            name: responseData?.name,
            roleId: responseData?.roleId,
            status: responseData?.status,
            token: responseData?.token,
            username: responseData?.username,
          };
          if (responseData?.token) {
            login(user, responseData?.token);
          }
          if (user.roleId === 2) {
            navigate("/owner");
          }
          if(user.roleId === 1){
            navigate("/admin");
          }
          // else if (user.roleId === 3) {
          //   navigate("/member");
          // }
        } catch (error: any) {
          if (error.message.includes("401")) {
            toast.error("Invalid username or password", { duration: 2000 });
          } else {
            toast.error("An error occurred. Please try again.", {
              duration: 2000,
            });
          }
        }
      }
    };
    loginStaff();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleSubmit(); // Trigger login action
    }
  };
  return (
    <>
      <form className="space-y-4" onKeyDown={handleKeyDown}>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="name@company.com"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
              />
            </div>
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>
          <a
            href="forget-password"
            className="text-sm text-gray-900 hover:underline dark:text-blue-500"
          >
            Lost Password?
          </a>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login to your account
        </button>
        <button
          type="button"
          className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              fill-rule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              clip-rule="evenodd"
            />
          </svg>
          Sign in with Google
        </button>
      </form>

      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?{" "}
        <a
          href="register"
          className="text-blue-700 hover:underline dark:text-blue-500"
        >
          Create account
        </a>
      </div>
    </>
  );
};

export default UserLogin;
