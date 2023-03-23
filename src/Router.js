import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {path : "/", name : "Home", component : () => import('./views/Home.vue')},
    {path : "/camera", name : "Camera", component : () => import('./views/camera.vue')},
    {path : "/user-agent", name : "UserAgent", component : () => import('./views/userAgent.vue')},
];

const router = createRouter({
    history : createWebHistory(),
    routes
});

export default router;