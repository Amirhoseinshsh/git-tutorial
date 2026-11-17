"use client";
import {useState} from "react";import axios from "axios";
const API=process.env.NEXT_PUBLIC_API_URL||"http://localhost:3000";
export default function LoginPage(){
const[username,setUsername]=useState("");const[password,setPassword]=useState("");const[error,setError]=useState("");const[loading,setLoading]=useState(false);
async function submit(e){e.preventDefault();setError("");setLoading(true);try{const{data={}}=await axios.post(`${API}/auth/login`,{username,password});const token=data.token||data.accessToken||data.access_token||data.data?.token||data.data?.accessToken||data.data?.access_token;if(!token)throw new Error("توکن ورود در پاسخ سرور پیدا نشد.");localStorage.setItem("token",token);window.location.href="/admin"}catch(err){setError(err.response?.data?.message||err.message||"ورود ناموفق بود.")}finally{setLoading(false)}}
return <main className="login-page"><form className="login-card" onSubmit={submit}><h1>ورود مدیر</h1><p>پنل مدیریت انبار</p><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="نام کاربری" required/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="رمز عبور" required/>{error&&<p className="error">{error}</p>}<button disabled={loading}>{loading?"در حال ورود...":"ورود به پنل"}</button></form></main>}
