import { ReactNode, createContext, useEffect, useState } from "react";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  userRole: number | undefined;
  userId: number | undefined;
  token: string | undefined;
  userAccountName: string | undefined;
  userPackageStatus: number | undefined;
  login: (user: LoginedUser, token: string) => void;
  updatePackageStatus(status: number): void;
  logout: () => void;
  isAuth: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  userRole: undefined,
  userId: undefined,
  token: undefined,
  userAccountName: undefined,
  userPackageStatus: undefined,
  updatePackageStatus: () => { },
  login: () => { },
  logout: () => { },
  isAuth: () => false,
});

const UserContextProvider = ({ children }: UserProviderProps) => {
  const [userRole, setUserRole] = useState<number | undefined>();
  const [userPackageStatus, setuserPackageStatus] = useState<number | undefined>();
  const [userAccountName, setUserAccountName] = useState<string | undefined>();
  const [userId, setUserId] = useState<number | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const getLocalData = async () => {
        const storageToken = localStorage.getItem("token");
        const storageUser = localStorage.getItem("user");
        const storageExpiration = localStorage.getItem("expiration");
        if (storageExpiration) {
          const expirationDate = parseInt(storageExpiration);
          const currentDate = new Date().getTime();
          if (expirationDate - currentDate <= 0) {
            logout();
          } else {
            if (storageToken && storageUser) {
              const parseStorageUser = JSON.parse(storageUser as string);
              setUserAccountName(parseStorageUser.accountName);
              setUserRole(parseStorageUser.roleId);
              setUserId(parseStorageUser.accountId);
              setToken(storageToken);
            }
          }
        }
        setIsLoaded(true);
      };
      getLocalData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const login = (user: LoginedUser, token: string) => {
    const stringUser = JSON.stringify(user);
    let currentDate = new Date();
    localStorage.setItem("user", stringUser);
    localStorage.setItem("token", token);
    localStorage.setItem(
      "expiration",
      currentDate.setHours(currentDate.getHours() + 1).toString()
    );
    localStorage.setItem("userId", user.accountId.toString());
    setUserRole(user?.roleId);
    setUserId(user?.accountId);
    setToken(token);
    setuserPackageStatus(user?.packageStatus);
  };

  const logout = () => {
    setUserAccountName(undefined);
    setUserRole(undefined);
    setUserId(undefined);
    setuserPackageStatus(undefined);
    setToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  };

  const isAuth = () => {
    const storageToken = localStorage.getItem("token");
    if (storageToken && storageToken !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const updatePackageStatus = (status: number) => {
    setuserPackageStatus(status);

  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        userId,
        token,
        userAccountName,
        userPackageStatus,
        updatePackageStatus,
        login,
        logout,
        isAuth,
      }}
    >
      {isLoaded ? children : null} {/* Only render children when loaded */}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
