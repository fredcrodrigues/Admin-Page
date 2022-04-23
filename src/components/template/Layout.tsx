import MenuLateral from "../template/MenuLateral"
import Cabecalho from "../template/Cabecalho"
import Conteudo from "../template/Conteudo"
import useAppData from "../../data/hook/useAppData"
import forcarAuth from "../../functions/ForcarAuth"
//import ForcarAuth from "../auth/ForcarAuth"

interface LayoutProps{

    titulo:string
    subtitulo:string
    children?: any

}

export default function Layout(props: LayoutProps){

    const {tema} = useAppData()

   
    return forcarAuth(
     
            <div className={`${tema} flex h-screen w-screen `}>
                <MenuLateral/>
                <div className={`
                        flex flex-col p-7 w-full 
                        bg-gray-300 dark:bg-gray-800 `}>
                    <Cabecalho titulo={props.titulo} subtitulo={props.subtitulo}/>
                    <Conteudo>
                        {props.children}
                    </Conteudo>
                </div>
            
            </div>

    )
}