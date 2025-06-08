// import { useEffect, useState } from "react";
// import { createBrowserRouter, useNavigate } from "react-router-dom"

// const routes = [
//   {
//     path: '/login',
//     name: 'Login',
//     meta: { requiresAuth: false }
//   },
//   {
//     path: '/',
//     name: 'Home',
//     meta: { requiresAuth: true }
//   }
// ]

// // 新增路由守卫高阶组件
// export const AuthGuard = ({ children }: { children: JSX.Element }) => {
//   const navigate = useNavigate();
//   const { isLoggedIn } = useAuth(); // 假设已有认证钩子
//   const [isVerified, setIsVerified] = useState(false);

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate('/login', { replace: true });
//     } else {
//       setIsVerified(true);
//     }
//   }, [isLoggedIn, navigate]);

//   return isVerified ? children : (
//     <div className="flex justify-center items-center h-screen">
//       <Loader2 className="animate-spin w-8 h-8" />
//     </div>
//   );
// });

// // 修改路由配置
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <AuthGuard><App /></AuthGuard>,
//     children: [
//       // 需要保护的路由
//       { path: 'conversations', element: <ConversationList /> },
//       { path: 'chat/:id', element: <ConversationContent /> }
//     ]
//   },
//   {
//     path: '/login',
//     element: <LoginPage /> // 公开路由
//   },
//   {
//     path: '*',
//     element: <NotFound />
//   }
// ]);
