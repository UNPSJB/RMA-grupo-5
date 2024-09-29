import '../assets/login.css'

const Login = () => {

    return(

    <div class="wrapper">
    <form class="login">
        <p class="title">Registro de usuarios</p>
        <input type="text" placeholder="Nombre" autofocus/>
        <i class="fa fa-user"></i>
        <input type="Password" placeholder="Password" />
        <i class="fa fa-key"></i>
        <button>
        <i class="spinner"></i>
        <span class="state">Log in</span>
        </button>
    </form>
    
    <footer>

    </footer>
    
    </div>
    )


}

export default Login;