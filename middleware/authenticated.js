export default function ({ store, redirect, route }) {
    if (!store.state.user && route.name !== 'login') {
        redirect('/login')
    }
}