import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { loginByUsernamePassword } from "../../../api/login";

const AdminLogin: React.FC = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = () => {
    const loginStaff = async () => {
      if (username === "" || password === "") {
        toast.error("Please input all fields.", {
          duration: 2000,
        });
      } else {
        try {
          const response = await loginByUsernamePassword(username, password);
          const responseData = response?.data;
          const user: LoginedUser = {
            accountId: responseData?.accountId,
            email: responseData?.email,
            isLoginWithGmail: responseData?.isLoginWithGmail,
            packageStatus: responseData?.packageStatus,
            name: responseData?.name,
            roleId: responseData?.roleId,
            status: responseData?.status,
            token: responseData?.token,
            username: responseData?.username,
          };
          if (responseData?.token) {
            login(user, responseData?.token);
          }
          if (user.roleId === 1) {
            navigate("/admin");
          }
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
            Your username
          </label>
          <input
            type="text"
            name="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
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
            href="#"
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
      </form>
    </>
  );
};

export default AdminLogin;
