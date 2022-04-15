import Link from "next/link"

interface MenuItemProps{
    url?: string
    texto: string 
    icone: any
    classe?: string
    onClick?:(evento: any ) => void
}
export default function MenuItem(props: MenuItemProps){ 

    function renderizarLink(){
       return( <a className={` 
            flex flex-col justify-center items-center 
            h-20 w-20 
            dark:text-gray-200
            ${props.classe}`
       }>
        {props.icone} 
            <span className={` text-xs `}>
                {props.texto}
            </span>
        </a>)
    }
    return(

    <li onClick={props.onClick}  className={`
        hover:bg-gray-100 dark:hover:bg-gray-800
        cursor-pointer
        `}>
        
        {props.url? (  

            <Link href={props.url}>
                    
                {renderizarLink()}

            </Link>

        ):(
                renderizarLink()
        )
        }
       
           
     </li>
    )
  
}