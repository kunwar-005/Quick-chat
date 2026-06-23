import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendurl = import.meta.env.VITE_API_BASE_URL;

axios.defaults.baseURL = backendurl

export const Authcontext = createContext()

export const Authprovider = ({ children }) => {


    const [token, settoken] = useState(localStorage.getItem("token"))
    const [authUser, setauthUser] = useState(null)
    const [onlineusers, setonlineusers] = useState([])
    const [socket, setsocket] = useState(null)


    // check if user is authenticated and if yes set user data and connect to sockket 

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setauthUser(data.userdata)
                conncectSocket(data.userdata)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to handle socket connection and online user updates
    const conncectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io("http://localhost:5000",{
            query: {
                userId: userData._id
            }
        });
        newSocket.connect()
        setsocket(newSocket)
        newSocket.on("getonlineusers", (userIds) => {
            setonlineusers(userIds)
        })
    }

    // login funcrion to handle user authentication and socket connection
    

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) {
                setauthUser(data.userdata)
                conncectSocket(data.userdata)
                axios.defaults.headers.common["token"] = data.token

                settoken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    // function to handle user logout and socket disconnection

    const logout = async () => {
        localStorage.removeItem("token")
        settoken(null)
        setauthUser(null)
        setonlineusers([])
        axios.defaults.headers.common["token"] = null
        toast.success("logged out succefully")
        socket.disconnect()
    }

    // functions to handle use profiel updates
    
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body)
            if (data.success) {
                setauthUser(data.userdata)
                toast.success("Profile updated successfuly")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;

        }
        checkAuth()
    }, [])

    const value = {
        axios,
        authUser,
        onlineusers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    )
}