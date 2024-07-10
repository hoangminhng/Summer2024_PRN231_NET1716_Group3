import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import RequiredAuth from "./Component/RequireAuth/requiredAuth";
import AdminLayout from "./Page/Admin/adminLayout";
import MemberLayout from "./Page/Member";
import Home from "./Page/Home";
import Dashboard from "./Page/Admin/Dashboard";
import Accounts from "./Page/Admin/Accounts";
import AccountDetail from "./Page/Admin/AccountDetail";
import MemberShips from "./Page/Admin/MemberShips";
import MemberShipDetail from "./Page/Admin/MemberShipDetail";
import Hostels from "./Page/Admin/Hostels";
import HostelDetail from "./Page/Admin/HostelDetail";
import Packages from "./Page/Admin/PackagesAdmin";
import PackageDetail from "./Page/Admin/PackageDetail";
import NewPackage from "./Page/Admin/NewPackage";
import PermissionPage from "./Page/Permission";
import OwnerLayout from "./Page/Owner";
import Hostel from "./Page/Owner/Hostel";
import Room from "./Page/Owner/Room";
import ProtectedRoute from "./Component/ProtectedRoute";
import Register from "./Page/Register";
import MemberHostelDetail from "./Page/Member/HostelDetail";
import OwnerContractCreate from "./Page/Owner/Contract";
import AdminTransaction from "./Page/Admin/AdminTransaction";
import RoomDetail from "./Page/Owner/RoomDetail";
import MemberRoomDetails from "./Page/Member/RoomDetail";
import ForgetPassword from "./Page/ForgetPassword";
import OwnerViewContract from "./Page/Owner/ViewContract";
import OwnerContractDetail from "./Page/Owner/ContractDetail";
import MemberViewContract from "./Page/Member/MemberContract";
import MemberContractDetail from "./Page/Member/MemberContractDetail";
import BillPayment from "./Page/Owner/BillPayment";
import BillList from "./Page/Owner/BillList";
import BillPaymentDetail from "./Page/Owner/BillDetail";
import BillMonthlyForm from "./Page/Owner/BillMonthlyForm";
import BillCreate from "./Page/Owner/BillCreate";
import PaymentSucess from "./Page/PaymentSuccess";
import OwnerPackage from "./Page/Owner/MembershipPackage";
import OwnerAppointment from "./Page/Owner/Appointment";
import OwnerAppointmentDetail from "./Page/Owner/AppointmentDetail";
import PaymentHistory from "./Page/Member/PaymentHistory";
import MemberProfile from "./Page/Member/Profile";
import OwnerProfile from "./Page/Owner/OwnerProfile";
import OwnerChangeProfile from "./Page/Owner/ChangeProfile";
import OwnerChangePassword from "./Page/Owner/ChangePassword";
import MemberChangeProfile from "./Page/Member/MemberChangeProfile";
import MemberChangePassword from "./Page/Member/MemberChangePassword";
import { useContext, useEffect } from "react";
import { generateToken, messaging } from "./Config/firebase_config";
import { onMessage } from "firebase/messaging";
import { NotificationContext } from "./context/notificationContext";
import { UserContext } from "./context/userContext";
import toast from "react-hot-toast";
import PackageRegisterHistory from "./Page/Owner/MembershipPackage/PackageRegisterHistory";
import MemberRentedRoom from "./Page/Member/MemberRentedRoom";
import ComplainHistory from "./Page/Member/ComplainHistory";
import OwnerComplains from "./Page/Owner/Complains";
import Appointment from "./Page/Member/Appointment";
import NotificationMember from "./Page/Member/Notification";
import NotificationOwner from "./Page/Owner/Notification";
import MemberRentedRoomDetail from "./Page/Member/MemberRentedRoomDetail";

const roles = {
  Admin: 1,
  Owner: 2,
  Member: 3,
};

function App() {
  const { updateNotiStatus } = useContext(NotificationContext);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNotificationToastClicked = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      updateNotiStatus(true);
      console.log(payload);
      if (payload.notification?.body) {
        const { title, body } = payload.notification;
        let status: string;
        let accountId: number;
        let forwardToPath: string;
        console.log("Got in 1");
        if (payload.data) {
          status = payload.data.type;
          accountId = parseInt(payload.data.accountId);
          forwardToPath = payload.data.forwardToPath;
          console.log("accountId: " + accountId);
          console.log("userId: " + userId);
          if (accountId == userId) {
            toast.custom(
              (t) => (
                <div
                  onClick={() => handleNotificationToastClicked(forwardToPath)}
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 pt-0.5">
                        <img
                          className="h-10 w-10"
                          src="https://res.cloudinary.com/dfdwupiah/image/upload/v1718272841/PRN231_GroupProject/glq77u926kxvcxggb9k9.png"
                          alt=""
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              {
                duration: 2000,
              }
            );
          }
        }
      }
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/permission" element={<PermissionPage />} />

        <Route path="/" element={<MemberLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forget-password"
            element={
              <ProtectedRoute>
                <ForgetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="hostel/detail/:hostelID"
            element={<MemberHostelDetail />}
          />
          <Route path="room/detail/:roomID" element={<MemberRoomDetails />} />
        </Route>

        <Route element={<RequiredAuth allowedRoles={[roles.Admin]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route
              path="accounts/detail/:accountId"
              element={<AccountDetail />}
            />
            <Route path="memberships" element={<MemberShips />} />
            <Route
              path="memberships/detail/:accountID"
              element={<MemberShipDetail />}
            />
            <Route path="hostels" element={<Hostels />} />

            <Route path="hostels/detail/:hostelID" element={<HostelDetail />} />
            <Route path="packages" element={<Packages />} />
            <Route path="transactions" element={<AdminTransaction />} />
            <Route path="packages/new" element={<NewPackage />} />
            <Route
              path="packages/detail/:packageID"
              element={<PackageDetail />}
            />
          </Route>
        </Route>

        <Route element={<RequiredAuth allowedRoles={[roles.Owner]} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route path="profile" element={<OwnerProfile />} />
            <Route
              path="profile/change-information"
              element={<OwnerChangeProfile />}
            />
            <Route
              path="profile/change-password"
              element={<OwnerChangePassword />}
            />
            <Route path="hostels" element={<Hostel />} />
            <Route path="hostels/:hostelId" element={<Room />} />
            <Route
              path="hostels/:hostelId/rooms/:roomId"
              element={<RoomDetail />}
            />
            <Route path="contract/create" element={<OwnerContractCreate />} />
            <Route path="contracts" element={<OwnerViewContract />} />
            <Route
              path="contracts/detail/:contractID"
              element={<OwnerContractDetail />}
            />
            <Route path="bill-payment" element={<BillPayment />} />
            <Route
              path="bill-payment/bills/:contractId"
              element={<BillList />}
            />
            <Route
              path="bill-payment/bills/details/:billPaymentId"
              element={<BillPaymentDetail />}
            />
            <Route
              path="bill-payment/bills/form"
              element={<BillMonthlyForm />}
            />
            <Route path="bill-payment/create" element={<BillCreate />} />
            <Route path="package" element={<OwnerPackage />} />
            <Route
              path="package/history"
              element={<PackageRegisterHistory />}
            />
            <Route path="appointments" element={<OwnerAppointment />} />
            <Route
              path="appointments/detail/:hostelID"
              element={<OwnerAppointmentDetail />}
            />
            <Route path="complains" element={<OwnerComplains />} />
            <Route path="notifications" element={<NotificationOwner />} />
          </Route>
        </Route>

        <Route element={<RequiredAuth allowedRoles={[roles.Member]} />}>
          <Route path="/" element={<MemberLayout />}>
            <Route path="contracts" element={<MemberViewContract />} />
            <Route
              path="contracts/detail/:contractID"
              element={<MemberContractDetail />}
            />
            <Route path="payment" element={<PaymentHistory />} />
            <Route path="appointments" element={<Appointment />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="rentedRooms" element={<MemberRentedRoom />} />
            <Route
              path="rentedRoomsDetail/:contractID"
              element={<MemberRentedRoomDetail />}
            />
            <Route path="complains" element={<ComplainHistory />} />
            <Route
              path="profile/change-information"
              element={<MemberChangeProfile />}
            />
            <Route
              path="profile/change-password"
              element={<MemberChangePassword />}
            />
            <Route path="notification" element={<NotificationMember />} />
          </Route>
        </Route>

        <Route
          element={<RequiredAuth allowedRoles={[roles.Member, roles.Owner]} />}
        >
          <Route path="/paymentsucess" element={<PaymentSucess />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
