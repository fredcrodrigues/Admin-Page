import MenuItem from "../template/MenuItem"
import Logo from "../template/Logo"
import { IconeHome, IconeAjustes, IconeNotificacao, IconeSair  } from "../Icone/"
import useAuth from "../../data/hook/useAuth"
export default function MenuLateral(){

    const {logout} = useAuth()

    return (
        <aside className={`
        flex flex-col
        bg-gray-100 text-gray-700 
        dark:bg-gray-800   
        `}>

            <div className={`
                    flex flex-col items-center justify-center
                    bg-gradient-to-r from-indigo-500 to-purple-800
                    h-20 w-20
            `}>
                <Logo/>
            </div>
            <ul className="flex-grow">
                <MenuItem url="/" texto="" icone={IconeHome}/>
                <MenuItem url="/ajustes" texto="Ajustes" icone={IconeAjustes}/>
                <MenuItem url="/notificacoes" texto="Notificações" icone={IconeNotificacao}/>
            </ul>
            <ul>
                <MenuItem onClick={logout} 
                classe={`
                text-red-600  dark:text-red-400 
                dark:hover:bg-gray-400   dark:hover:text-white
               `}
                texto="Sair" icone={IconeSair}/>
            </ul>


        </aside>
    )
}