import React, { useState, useEffect } from "react"
import { initializeApp } from 'firebase/app'
import { getFunctions, httpsCallable } from "firebase/functions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { getLike } from "../../functions";

const Like = (()=> {
    const [likeNum, setLikeNum] = useState(0)

    const functions = (()=>{
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCNhhenzg0nLnVQ8tgZZgz6BIC5lreKuVg",
            authDomain: "kuroneko913-blog-like-count.firebaseapp.com",
            projectId: "kuroneko913-blog-like-count",
            storageBucket: "kuroneko913-blog-like-count.appspot.com",
            messagingSenderId: "266086491455",
            appId: "1:266086491455:web:bbe1ab9c24e9eac953df8a"
        }
        console.log({firebaseConfig})
        const app = initializeApp(firebaseConfig)
        const functions = getFunctions(app)
        return functions
    })

    const addLike = (()=>{
        const addLike = httpsCallable(functions, 'addLike')
        addLike({ blog_url:"https://myblackcat913.com/2021-08-15-cluster%E3%81%A7%E9%81%8A%E3%82%93%E3%81%A7%E3%81%BF%E3%81%9F/"}).then((res)=>{
            setLikeNum(res.data.count)
        })
    })

    const removeLike = (()=>{
        const removeLike = httpsCallable(functions, 'removeLike')
        removeLike({ blog_url:"https://myblackcat913.com/2021-08-15-cluster%E3%81%A7%E9%81%8A%E3%82%93%E3%81%A7%E3%81%BF%E3%81%9F/"}).then((res)=>{
            console.log(res)
        })
    })
    
    const changeLike = (()=>{
        // クッキーに現在のページのいいねを押した痕跡がある場合は、削除する
        // それ以外は、いいねを追加し、IDをクッキーに記録する
        addLike()
        setLikeNum(likeNum+1)
    })

    const setLike = (()=>{
        const getLike = httpsCallable(functions, 'getLike')
        getLike({ blog_url:"https://myblackcat913.com/2021-08-15-cluster%E3%81%A7%E9%81%8A%E3%82%93%E3%81%A7%E3%81%BF%E3%81%9F/"}).then((res)=>{
            setLikeNum(res.data.count)
        })
    })

    useEffect(() => {
        setLike()
    }, [likeNum])
    return (
        <div>
           <FontAwesomeIcon icon={faHeart} onClick={changeLike}/>
           <span>{likeNum}</span>
        </div>
    )
})

export default Like
