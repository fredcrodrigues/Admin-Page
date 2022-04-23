import { createContext, useEffect, useState } from "react";
import firebase from "../../firebase/config";
import Cookies from "js-cookie"
import Usuario from '../../model/Usuario'
import router from  'next/router'


interface  AuthContextProps{
    usuario?: Usuario
    carregando?: boolean
    login?: (email: string, senha:string) => Promise<void>
    cadastrar?: (email: string, senha:string) => Promise<void>
    loginGoogle?: () => Promise<void>
    logout?: () => Promise<void>
 
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
    const [carregando, setCarregando] = useState(true)
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

        try{
            setCarregando(true)
            const resp = await firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )
          
            await configuraSessao(resp.user)
            router.push('/')
         
        } finally{
            setCarregando(false)

        }
       
    }

    async  function login(email, senha){

        try{
            setCarregando(true)
            const resp = await firebase.auth().signInWithEmailAndPassword(email, senha)
          
            await configuraSessao(resp.user)
            router.push('/')
         
        } finally{
            setCarregando(false)

        }
       
    }

    async  function cadastrar(email, senha){

        try{
            setCarregando(true)
            const resp = await firebase.auth().createUserWithEmailAndPassword(email, senha)
          
            await configuraSessao(resp.user)
            router.push('/')
         
        } finally{
            setCarregando(false)

        }
       
    }
    async function logout(){
        try{
            setCarregando(true)
            await firebase.auth().signOut
            await configuraSessao(null)
        }finally{
            setCarregando(false)
        }
    } 

    useEffect(()=> {
    if(Cookies.get('admin-template-code-auth')){
        const cancelar =  firebase.auth().onIdTokenChanged(configuraSessao) // indetifica o token do usuario issso é um observer
        return () => cancelar()
    }else{
        setCarregando(false)
    }
      
    
     },[])
    return(
        <AuthContext.Provider value={{
            usuario, 
            login,
            loginGoogle, 
            logout,
            cadastrar,
            carregando

        }}>

            {props.children}

        </AuthContext.Provider>
    )
}
export default AuthContext 