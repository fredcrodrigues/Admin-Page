import { useContext } from "react";
import AppContext from "../context/Appcontext";

const useAppData = () => useContext(AppContext)

export default useAppData /// exportar os dados a apartir desse hook