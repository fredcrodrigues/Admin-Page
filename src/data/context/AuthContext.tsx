import { createContext, useEffect, useState } from "react";
import firebase from "../../firebase/config";
import Cookies from "js-cookie"
import Usuario from '../../model/Usuario'
import router from  'next/router'


interface  AuthContextProps{
    usuario?: Usuario
    loginGoogle?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function usuarioNormalizado(usuarioFirebase: firebase.User): Promise<Usuario>{
    const token = await usuarioFirebase.getIdToken()
    
    return {

        uid: usuarioFirebase.uid,
        nome: usuarioFirebase.displayName,
        email: usuarioFirebase.email,
        token,
        provedor: usuarioFirebase.providerData[0].providerId,
        imageUrl: usuarioFirebase.photoURL
    }
}

function gerenciarCookie(logado:boolean){
    if(logado){
        Cookies.set('admin-template-code-auth', logado, {
            expires:7
        })
    }else{
        Cookies.remove('admin-template-code-auth')
    }
}
export function AuthProvider(props){
    const [carreagando, setCarregando] = useState(true)
    const [usuario, setUsuario] = useState<Usuario>(null)

    async function configuraSessao(usuarioFirebase){
        if(usuarioFirebase?.email){
            const usuario = await usuarioNormalizado(usuarioFirebase) 
            setUsuario(usuario)
            gerenciarCookie(true)
            setCarregando(false)
            return usuario.email
        }else{
            setUsuario(null)
            gerenciarCookie(false)
            setCarregando(false)
            return false
        }   
    }

    async  function loginGoogle(){
        const resp = await firebase.auth().signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )
      
        configuraSessao(resp.user)
        router.push('/')
     
    }

    useEffect(()=> {
      const cancelar =  firebase.auth().onIdTokenChanged(configuraSessao) // indetifica o token do usuario issso é um observer
      return () => cancelar()
     },[])
    return(
        <AuthContext.Provider value={{
            usuario, 
            loginGoogle

        }}>

            {props.children}

        </AuthContext.Provider>
    )
}
export default AuthContext 