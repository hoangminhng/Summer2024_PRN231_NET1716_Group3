import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerByEmailPassword } from "../../api/register";
import ConfirmOtpModal from "../../Component/OtpModal";
import { trackPromise } from 'react-promise-tracker';
import { isValidEmail } from "../../Utils/emailFormat";
import { LoadingSpinnerComponent } from "../../Component/LoadingSpinner";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";


const Register: React.FC = () => {
  // const { login } = useContext(UserContext);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [citizenCard, setCitizenCard] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    let roleId: number = 3; //default is user
    if (email === "" || password === "" || name === "" || address === "" || phone === "" || citizenCard === "") {
      toast.error("Please input all fields.", {
        duration: 2000,
      });
      return;
    }
    if (!isValidEmail(email)) {
      console.log("this email is invalid " + email);
      toast.error("Invalid email format.", {
        duration: 2000,
      });
      return;
    }
    if (password.length < 6 || password.length > 20) {
      toast.error("Password length must be between 6 and 20 character.", {
        duration: 2000,
      });
      return;
    }


    const register = async () => {

      if (isOwner) {
        roleId = 2;
      }
      // trackPromise(registerByEmailPassword(email, roleId, name, password)).then(toggleModal);
      try {
        setIsLoading(true);
        const response = await registerByEmailPassword(email, roleId, name, password, phone, address, citizenCard);
        if (response != null) {
          toggleModal();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }


    }

    register();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleSubmit(); // Trigger login action
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleModal();
    }
  };

  return (
    <div className="relative">
      {isloading &&
        <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50 ">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        </div>}
      <>  <div className="justify-center">
        <div className="w-3/5 mx-auto">
          <div
            className="w-full bg-[#f6f5ec] gap-4 mb-4 rounded-[12px] overflow-hidden"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "30px",
              padding: "20px",
              color: "black",
            }}
          >
            <h3>
              Register a new account
            </h3>
          </div>
          <form className="space-y-4" onKeyDown={handleKeyDown}>
            <div>
              <label className="block mb-2 text-xs font-italic text-red-500 dark:text-red-400 text-start">
                * All fields are required
              </label>
            </div>
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
                Your name
              </label>
              <input
                type="name"
                name="name"
                id="name"
                placeholder="John Doe"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setName(e.target.value);
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
            <div>
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
                Your phone number
              </label>
              <input
                type="phone"
                name="phone"
                id="phone"
                placeholder="09 123 456 78"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
                Your address
              </label>
              <input
                type="address"
                name="address"
                id="address"
                placeholder="123 Cong Quynh St, District 1, HCM"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
                Your citizen card
              </label>
              <input
                type="citizenCard"
                name="citizenCard"
                id="citizenCard"
                placeholder="060120032384"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setCitizenCard(e.target.value);
                }}
              />
            </div>

            <label className="inline-flex w-full cursor-pointer mb-2 text-lg font-medium text-gray-900 dark:text-white"> Register as:&nbsp;
              <input type="checkbox" value="" className="sr-only peer"
                onChange={(e) => {
                  setIsOwner(!isOwner);
                }} />
              <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300"> {isOwner ? 'Owner' : 'User'}</span>
            </label>



            <button
              type="button"
              onClick={handleSubmit}
              className="w-full text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Register
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
              Register with Google
            </button>
          </form>
        </div>
      </div >
        {isModalOpen && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
          // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <ConfirmOtpModal email={email} />
          </div>
        )}</>

    </div>
  );
};


export default Register;