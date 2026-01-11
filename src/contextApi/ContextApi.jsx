import { createContext, useContext, useState } from "react";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;

    const getUserInfo = localStorage.getItem("USER_INFO")
        ? JSON.parse(localStorage.getItem("USER_INFO"))
        : null;

    const [token, setToken] = useState(getToken);
    const [userInfo, setUserInfo] = useState(getUserInfo);

    const updateUserInfo = (info) => {
        setUserInfo(info);
        if (info) {
            localStorage.setItem("USER_INFO", JSON.stringify(info));
        } else {
            localStorage.removeItem("USER_INFO");
        }
    };

    const clearUserInfo = () => {
        setToken(null);
        setUserInfo(null);
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER_INFO");
    };

    const sendData = {
        token,
        setToken,
        userInfo,
        setUserInfo: updateUserInfo,
        clearUserInfo,
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
};


export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
}